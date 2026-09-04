import { NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import { Category } from "@/lib/models/Category";
import { requireAdmin } from "@/lib/auth";

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string; index: string }> }) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { id, index } = await params;
  const i = Number(index);
  await connectDb();
  const category = await Category.findById(id);
  if (!category) {
    return NextResponse.json({ error: "Category not found" }, { status: 404 });
  }
  if (!Number.isInteger(i) || i < 0 || i >= category.projects.length) {
    return NextResponse.json({ error: "Invalid project index" }, { status: 400 });
  }
  category.projects.splice(i, 1);
  await category.save();
  return NextResponse.json(category);
}
