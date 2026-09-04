import { Schema } from "mongoose";

/**
 * Backs every image/video slot in a Category or Project. An empty {} means
 * "no photo assigned", rendered client-side as the placeholder pattern.
 *
 * No explicit generic here deliberately — Mongoose's TS typings fight the
 * `{ type: [subSchema], default }` array-of-subdocument syntax when a strict
 * generic is supplied. Consumers assert shape at the call site via .lean<T>().
 */
export const photoSchema = new Schema(
  {
    publicId: { type: String },
    url: { type: String },
    resourceType: { type: String, enum: ["image", "video"], default: "image" },
    fit: { type: String, enum: ["cover", "contain"], default: "cover" },
    zoom: { type: Number, min: 100, max: 260, default: 100 },
    width: { type: Number, min: 0, max: 400, default: 100 },
    height: { type: Number, min: 0, max: 400, default: 0 },
    x: { type: Number, min: 0, max: 100, default: 43 },
    y: { type: Number, min: 0, max: 100, default: 23 },
  },
  { _id: false }
);
