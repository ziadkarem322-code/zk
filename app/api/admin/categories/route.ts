import { NextResponse } from "next/server";
import { z } from "zod";
import { connectDb } from "@/lib/db";
import { Category } from "@/lib/models/Category";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    await connectDb();
    const categories = await Category.find({}, "slug short catName accent order cover.url")
      .sort({ order: 1 })
      .lean();
    return NextResponse.json(categories);
  } catch (err) {
    console.error("GET /api/admin/categories failed:", err);
    return NextResponse.json({ error: (err as Error).message || "Failed to load categories" }, { status: 500 });
  }
}

const createSchema = z.object({
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, and hyphens only"),
  short: z.string().min(1),
  catName: z.string().min(1),
});

export async function POST(req: Request) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const parsed = createSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid category", issues: parsed.error.issues }, { status: 400 });
  }

  try {
    await connectDb();
    const count = await Category.countDocuments();
    const category = await Category.create({ ...parsed.data, order: count });
    return NextResponse.json(category, { status: 201 });
  } catch (err) {
    console.error("POST /api/admin/categories failed:", err);
    return NextResponse.json({ error: (err as Error).message || "Failed to create category" }, { status: 500 });
  }
}
