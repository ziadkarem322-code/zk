import { connectDb } from "@/lib/db";
import { Category } from "./models/Category";
import { SiteSettings } from "./models/SiteSettings";
import type { Category as CategoryType, CategorySummary, SiteSettings as SiteSettingsType } from "@/lib/types";

function serialize<T>(data: T): T {
  return JSON.parse(JSON.stringify(data));
}

export async function getCategorySummaries(): Promise<CategorySummary[]> {
  await connectDb();
  const docs = await Category.find({}, "slug short catName accent order").sort({ order: 1 }).lean();
  return serialize(docs) as unknown as CategorySummary[];
}

export async function getCategoryBySlug(slug: string): Promise<CategoryType | null> {
  await connectDb();
  const doc = await Category.findOne({ slug: slug.toLowerCase() }).lean();
  return doc ? (serialize(doc) as unknown as CategoryType) : null;
}

/** Singleton doc — lazily created with schema defaults on first read. */
export async function getSiteSettings(): Promise<SiteSettingsType> {
  await connectDb();
  const doc = await SiteSettings.findOneAndUpdate({}, {}, { upsert: true, new: true, setDefaultsOnInsert: true }).lean();
  return serialize(doc) as unknown as SiteSettingsType;
}

