import { NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import { Category } from "@/lib/models/Category";
import { requireAdmin } from "@/lib/auth";

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { id } = await params;
  await connectDb();
  const category = await Category.findById(id);
  if (!category) {
    return NextResponse.json({ error: "Category not found" }, { status: 404 });
  }
  if (category.gridPhotos.length >= 8) {
    return NextResponse.json({ error: "At most 8 grid photos (only the first 3 render)" }, { status: 400 });
  }
  category.gridPhotos.push({ caption: "", photo: {} });
  await category.save();
  return NextResponse.json(category, { status: 201 });
}
