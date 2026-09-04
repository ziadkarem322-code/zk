import "server-only";
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
    global.__mongooseConn = mongoose.connect(env.MONGODB_URI);
  }
  return global.__mongooseConn;
}
