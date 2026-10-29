import mongoose from "mongoose";

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongooseCache || {
  conn: null,
  promise: null,
};

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

export async function connectDB() {
  const uri = process.env.MONGODB_URI || process.env.DATABASE_URL;

  if (!uri) {
    throw new Error(
      "Missing MongoDB connection string. Please define MONGODB_URI in your .env or .env.local file."
    );
  }

  // If already connected and ready, return existing connection
  if (mongoose.connection.readyState === 1) {
    return mongoose;
  }

  // If currently in the process of connecting, await the promise
  if (cached.promise && mongoose.connection.readyState === 2) {
    return await cached.promise;
  }

  const opts = {
    bufferCommands: false,
    serverSelectionTimeoutMS: 5000,
  };

  cached.promise = mongoose
    .connect(uri, opts)
    .then((mongooseInstance) => {
      cached.conn = mongooseInstance;
      return mongooseInstance;
    })
    .catch((err) => {
      cached.promise = null;
      cached.conn = null;
      throw err;
    });

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (e) {
    cached.promise = null;
    cached.conn = null;
    throw e;
  }
}
