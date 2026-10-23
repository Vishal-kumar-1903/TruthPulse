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
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 3000,
    };

    cached.promise = (async () => {
      try {
        console.log(`Connecting to MongoDB at: ${MONGODB_URI}`);
        return await mongoose.connect(MONGODB_URI, opts);
      } catch (err) {
        console.warn('⚠️ Local MongoDB unreachable, starting embedded MongoDB Memory Server fallback...');
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
