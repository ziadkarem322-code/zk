import { Schema, model, models } from "mongoose";

/**
 * Singleton document (always looked up with an empty filter `{}`) holding the
 * global brand chrome that lives outside any one category — the photographer's
 * name and wordmark on the Cover slide.
 */
const siteSettingsSchema = new Schema(
  {
    photographerName: { type: String, default: "zk" },
    wordmarkStart: { type: String, default: "PORT" },
    wordmarkEnd: { type: String, default: "FOLIO" },
  },
  { timestamps: true }
);

export const SiteSettings = models.SiteSettings || model("SiteSettings", siteSettingsSchema);
