import { NextResponse } from "next/server";
import { getCategoryBySlug } from "@/lib/serverData";

export const dynamic = "force-dynamic";

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  try {
    const category = await getCategoryBySlug(slug);
    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }
    return NextResponse.json(category);
  } catch (err) {
    console.error(`GET /api/categories/${slug} failed:`, err);
    return NextResponse.json({ error: (err as Error).message || "Failed to load category" }, { status: 500 });
  }
}
