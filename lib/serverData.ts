import { connectDb } from "@/lib/db";
import { Category } from "./models/Category";
import type { Category as CategoryType, CategorySummary } from "@/lib/types";

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

