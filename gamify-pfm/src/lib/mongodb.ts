import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;
if (!MONGODB_URI) throw new Error("MONGODB_URI is not defined in .env.local");

// define a global interface for caching the mongoose connection
declare global {
  var _mongooseCache: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  } | undefined;
}

let cached = global._mongooseCache;

if (!cached) {
  cached = global._mongooseCache = { conn: null, promise: null };
}

// connectDB function for use in API routes
export async function connectDB(): Promise<typeof mongoose> {
  if (cached!.conn) return cached!.conn;
  if (!cached!.promise) {
    cached!.promise = mongoose.connect(MONGODB_URI).then((m) => m);
  }
  cached!.conn = await cached!.promise;
  return cached!.conn;
}
