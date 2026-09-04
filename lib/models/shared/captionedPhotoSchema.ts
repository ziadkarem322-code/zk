import { Schema } from "mongoose";
import { photoSchema } from "./photoSchema";

/** A single {caption, photo} pair — used for gridPhotos and project frames. */
export const captionedPhotoSchema = new Schema({
  caption: { type: String, default: "" },
  photo: { type: photoSchema, default: () => ({}) },
});
