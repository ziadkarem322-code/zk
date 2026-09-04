import { Schema } from "mongoose";
import type { CaptionedPhoto } from "@/lib/types";
import { photoSchema } from "./photoSchema";

/** A single {caption, photo} pair — used for gridPhotos and project frames. */
export const captionedPhotoSchema = new Schema<CaptionedPhoto>({
  caption: { type: String, default: "" },
  photo: { type: photoSchema, default: () => ({}) },
});
