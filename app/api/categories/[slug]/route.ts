import { NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import { Category } from "@/lib/models/Category";

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  await connectDb();
  const category = await Category.findOne({ slug: slug.toLowerCase() }).lean();
  if (!category) {
    return NextResponse.json({ error: "Category not found" }, { status: 404 });
  }
  return NextResponse.json(category);
}
