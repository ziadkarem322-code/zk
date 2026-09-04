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
  if (category.projects.length >= 3) {
    return NextResponse.json({ error: "A category can have at most 3 projects" }, { status: 400 });
  }
  category.projects.push({
    label: "",
    kicker: "",
    year: "",
    title: "",
    hero: {},
    desc: "",
    frames: [
      { caption: "", photo: {} },
      { caption: "", photo: {} },
    ],
    delivered: ["", "", ""],
    notes: "",
  });
  await category.save();
  return NextResponse.json(category, { status: 201 });
}
