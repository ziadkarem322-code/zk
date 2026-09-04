import { NextResponse } from "next/server";
import { getCategorySummaries } from "@/lib/serverData";

export async function GET() {
  try {
    const categories = await getCategorySummaries();
    return NextResponse.json(categories);
  } catch (err) {
    console.error("GET /api/categories failed:", err);
    return NextResponse.json({ error: (err as Error).message || "Failed to load categories" }, { status: 500 });
  }
}
