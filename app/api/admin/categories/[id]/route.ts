import { NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import { Category } from "@/lib/models/Category";
import { requireAdmin } from "@/lib/auth";
import { sanitizeSetPayload } from "@/lib/dotPatch";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { id } = await params;
  await connectDb();
  const category = await Category.findById(id).lean();
  if (!category) {
    return NextResponse.json({ error: "Category not found" }, { status: 404 });
  }
  return NextResponse.json(category);
}

/**
 * Generic dot-path update: body is {"gridPhotos.0.photo.zoom": 140, "accent": "oklch(...)"}.
 * Covers top-level fields, color stops, and any nested per-photo position field
 * (including array items inside `projects`, by numeric index) with one handler.
 */
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { id } = await params;
  let set: Record<string, unknown>;
  try {
    set = sanitizeSetPayload(await req.json());
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 400 });
  }

  await connectDb();
  try {
    const category = await Category.findByIdAndUpdate(id, { $set: set }, { new: true, runValidators: true }).lean();
    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }
    return NextResponse.json(category);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 400 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { id } = await params;
  await connectDb();
  await Category.findByIdAndDelete(id);
  return NextResponse.json({ ok: true });
}
