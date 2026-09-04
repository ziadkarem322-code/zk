import { connectDb } from "@/lib/db";
import { Category } from "@/lib/models/Category";
import type { Category as CategoryType, CategorySummary } from "@/lib/types";

export async function getCategorySummaries(): Promise<CategorySummary[]> {
  await connectDb();
  return Category.find({}, "slug short catName accent order").sort({ order: 1 }).lean<CategorySummary[]>();
}

export async function getCategoryBySlug(slug: string): Promise<CategoryType | null> {
  await connectDb();
  return Category.findOne({ slug: slug.toLowerCase() }).lean<CategoryType | null>();
}
