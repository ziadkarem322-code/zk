import mongoose from "mongoose";
import { env } from "./env";

// Next.js dev/hot-reload creates multiple module instances; cache the
// connection promise on the global object so we never open a second one.
declare global {
  var __mongooseConn: Promise<typeof mongoose> | undefined;
}

export function connectDb(): Promise<typeof mongoose> {
  if (!global.__mongooseConn) {
    mongoose.set("strictQuery", true);
    // If the connection attempt rejects, clear the cache so the *next* call
    // retries instead of permanently re-throwing the same stale failure for
    // the rest of this warm serverless instance's lifetime (a real bug that
    // was hit in production: one unlucky cold-start connection attempt —
    // e.g. an Atlas free-tier cluster waking from idle — poisoned every
    // subsequent request to that function until its next cold start).
    global.__mongooseConn = mongoose.connect(env.MONGODB_URI).catch((err) => {
      global.__mongooseConn = undefined;
      throw err;
    });
  }
  return global.__mongooseConn;
}
