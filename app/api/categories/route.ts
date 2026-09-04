import { NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import { Category } from "@/lib/models/Category";

export async function GET() {
  await connectDb();
  const categories = await Category.find({}, "slug short catName accent order")
    .sort({ order: 1 })
    .lean();
  return NextResponse.json(categories);
}
