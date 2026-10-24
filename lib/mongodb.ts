import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose | null> | null;
}

declare global {
  var mongooseCache: MongooseCache | undefined;
}

let cached: MongooseCache = global.mongooseCache || { conn: null, promise: null };

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

export async function connectDB(): Promise<typeof mongoose | null> {
  // If already connected and readyState is 1 (connected), return cached connection
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  // If running in Vercel or production and MONGODB_URI is not provided, gracefully return null
  if (!MONGODB_URI) {
    if (process.env.VERCEL) {
      console.warn('⚠️ MONGODB_URI is not configured in Vercel. Running in resilient zero-config fallback mode.');
      return null;
    }
  }

  if (!cached.promise) {
    const opts: mongoose.ConnectOptions = {
      serverSelectionTimeoutMS: 4000,
      autoIndex: true,
    };

    cached.promise = (async () => {
      // 1. Try connecting to configured MONGODB_URI
      if (MONGODB_URI) {
        try {
          console.log(`🔌 Connecting to MongoDB Atlas / Remote Cluster...`);
          const conn = await mongoose.connect(MONGODB_URI, opts);
          console.log(`✅ Successfully connected to MongoDB database: "${conn.connection.name}"`);
          return conn;
        } catch (err: any) {
          console.warn(`⚠️ Configured MONGODB_URI failed (${err.message}).`);
          if (process.env.VERCEL) {
            return null;
          }
        }
      }

      // 2. On Vercel, if MONGODB_URI was missing or failed, do NOT use MongoMemoryServer (read-only filesystem)
      if (process.env.VERCEL) {
        return null;
      }

      // 3. In local development only, attempt local MongoDB or MongoMemoryServer
      try {
        const localUri = 'mongodb://127.0.0.1:27017/truthpulse';
        console.log(`🔌 Attempting local MongoDB at: ${localUri}`);
        return await mongoose.connect(localUri, opts);
      } catch (localErr: any) {
        console.warn(`⚠️ Local MongoDB daemon unavailable (${localErr.message}). Starting embedded memory server fallback...`);
        try {
          const { MongoMemoryServer } = await import('mongodb-memory-server');
          const memoryServer = await MongoMemoryServer.create();
          const memUri = memoryServer.getUri();
          console.log(`✅ Connected to Embedded In-Memory MongoDB at: ${memUri}`);
          return await mongoose.connect(memUri);
        } catch (memErr: any) {
          console.warn(`⚠️ Memory server unavailable: ${memErr.message}. Operating in stateless fallback mode.`);
          return null;
        }
      }
    })();
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    cached.conn = null;
    return null;
  }

  return cached.conn;
}

export default connectDB;
