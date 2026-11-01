import mongoose from 'mongoose';

// Disable Mongoose command buffering on disconnected states so operations fail-fast or use in-memory fallbacks
mongoose.set('bufferCommands', false);

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
  const uri = process.env.MONGODB_URI || MONGODB_URI;

  // If already connected and readyState is 1 (connected), return cached connection immediately
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  // Fast-fail: If uri is not configured, do not wait or spin up slow memory servers
  if (!uri) {
    return null;
  }

  if (!cached.promise) {
    const isCloudAtlas = uri.includes('mongodb+srv://') || uri.includes('mongodb.net');
    const opts: mongoose.ConnectOptions = {
      serverSelectionTimeoutMS: isCloudAtlas ? 15000 : 3000,
      autoIndex: false,
      maxPoolSize: 10,
      minPoolSize: 1,
      socketTimeoutMS: 30000,
      tlsAllowInvalidCertificates: isCloudAtlas ? true : false,
    };

    cached.promise = (async () => {
      try {
        const conn = await mongoose.connect(uri, opts);
        return conn;
      } catch (err: any) {
        console.warn(`⚠️ Configured MONGODB_URI connection failed (${err.message}). Using instant fallback.`);
        return null;
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
