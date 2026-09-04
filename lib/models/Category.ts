import { Schema, model, models } from "mongoose";
import type { Category as CategoryType } from "@/lib/types";
import { photoSchema } from "./shared/photoSchema";
import { captionedPhotoSchema } from "./shared/captionedPhotoSchema";
import { projectSchema } from "./shared/projectSchema";

const bgStopSchema = new Schema(
  {
    color: { type: String, required: true },
    position: { type: Number, required: true },
  },
  { _id: false }
);

const statSchema = new Schema({ v: { type: String, default: "" }, k: { type: String, default: "" } }, { _id: false });
const contentItemSchema = new Schema({ n: { type: String, default: "" }, t: { type: String, default: "" } }, { _id: false });
const packageSchema = new Schema(
  {
    tier: { type: String, default: "" },
    price: { type: String, default: "" },
    unit: { type: String, default: "" },
    items: { type: [String], default: () => [] },
  },
  { _id: false }
);
const contactItemSchema = new Schema({ k: { type: String, default: "" }, v: { type: String, default: "" } }, { _id: false });

const categorySchema = new Schema<Omit<CategoryType, "_id">>(
  {
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    order: { type: Number, default: 0 },
    short: { type: String, default: "New" },
    catName: { type: String, default: "New Category" },
    discipline: { type: String },
    accent: { type: String, default: "oklch(0.74 0.16 32)" },
    bgStops: {
      type: [bgStopSchema],
      default: () => [
        { color: "oklch(0.20 0.012 285)", position: 0 },
        { color: "oklch(0.13 0.010 285)", position: 62 },
        { color: "oklch(0.10 0.008 285)", position: 100 },
      ],
    },
    bgAngle: { type: Number, default: 155 },
    cover: { type: photoSchema, default: () => ({ x: 50, y: 50, zoom: 100, width: 0, height: 0, fit: "cover" }) },
    intro: { type: photoSchema, default: () => ({}) },
    introWide: { type: photoSchema, default: () => ({}) },
    tagline: { type: String, default: "" },
    coverSlot: { type: String, default: "" },
    bio: { type: String, default: "" },
    services: { type: [String], default: () => ["", "", "", ""] },
    kit: { type: [String], default: () => ["", "", "", ""] },
    stats: { type: [statSchema], default: () => [{}, {}, {}, {}] },
    contents: {
      type: [contentItemSchema],
      default: () => [
        { n: "01", t: "" },
        { n: "02", t: "" },
        { n: "03", t: "" },
        { n: "04", t: "" },
        { n: "05", t: "" },
      ],
    },
    gridNote: { type: String, default: "" },
    gridPhotos: { type: [captionedPhotoSchema], default: () => [] },
    videoPoster: { type: photoSchema, default: () => ({ x: 50, y: 50, zoom: 100, width: 0, height: 0, fit: "cover" }) },
    videoAsset: { type: photoSchema, default: () => ({ resourceType: "video" }) },
    videoTitle: { type: String },
    videoKicker: { type: String },
    videoDesc: { type: String },
    videoSpecs: { type: [String] },
    packagesTitle: { type: String, default: "" },
    packagesNote: { type: String, default: "" },
    packages: { type: [packageSchema], default: () => [{}, {}, {}] },
    clients: { type: [String], default: () => Array(8).fill("") },
    quote: { type: String, default: "" },
    quoteBy: { type: String, default: "" },
    availability: { type: String, default: "" },
    contact: { type: [contactItemSchema], default: () => [{}, {}, {}, {}] },
    projects: { type: [projectSchema], default: () => [] },
  },
  { timestamps: true }
);

// `models.Category` guards against Next.js hot-reload redefining the model.
export const Category = models.Category || model("Category", categorySchema);
