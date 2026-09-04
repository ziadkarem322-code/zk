import { Schema } from "mongoose";
import { photoSchema } from "./photoSchema";
import { captionedPhotoSchema } from "./captionedPhotoSchema";

export const projectSchema = new Schema({
  label: { type: String, default: "" },
  kicker: { type: String, default: "" },
  year: { type: String, default: "" },
  title: { type: String, default: "" },
  hero: { type: photoSchema, default: () => ({}) },
  desc: { type: String, default: "" },
  frames: {
    type: [captionedPhotoSchema],
    default: () => [
      { caption: "", photo: {} },
      { caption: "", photo: {} },
    ],
  },
  delivered: { type: [String], default: () => ["", "", ""] },
  notes: { type: String, default: "" },
});
