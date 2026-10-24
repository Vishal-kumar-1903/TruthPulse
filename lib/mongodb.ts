import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/truthpulse';

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongooseCache: MongooseCache | undefined;
}

let cached: MongooseCache = global.mongooseCache || { conn: null, promise: null };

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

export async function connectDB(): Promise<typeof mongoose> {
  // If already connected and readyState is 1 (connected), return
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts: mongoose.ConnectOptions = {
      serverSelectionTimeoutMS: 5000,
      autoIndex: true,
    };

    cached.promise = (async () => {
      try {
        console.log(`🔌 Connecting to MongoDB at: ${MONGODB_URI.replace(/:([^:@]{4})[^:@]*@/, ':****@')}`);
        const conn = await mongoose.connect(MONGODB_URI, opts);
        console.log(`✅ Successfully connected to MongoDB database: "${conn.connection.name}" on host: ${conn.connection.host}`);
        return conn;
      } catch (err: any) {
        console.warn(`⚠️ Primary MongoDB connection failed (${err.message}). Starting embedded memory server fallback...`);
        const { MongoMemoryServer } = await import('mongodb-memory-server');
        const memoryServer = await MongoMemoryServer.create();
        const memUri = memoryServer.getUri();
        console.log(`✅ Connected to Embedded In-Memory MongoDB at: ${memUri}`);
        return await mongoose.connect(memUri);
      }
    })();
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectDB;
