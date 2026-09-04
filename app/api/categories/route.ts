import { NextResponse } from "next/server";
import { getCategorySummaries } from "@/lib/serverData";

// Without this, Next.js treats a GET-only route with no dynamic API usage as
// statically cacheable and can execute it at BUILD time — if the DB wasn't
// reachable from the build environment, it bakes a permanent error response
// into the static output, served identically on every request thereafter.
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const categories = await getCategorySummaries();
    return NextResponse.json(categories);
  } catch (err) {
    console.error("GET /api/categories failed:", err);
    return NextResponse.json({ error: (err as Error).message || "Failed to load categories" }, { status: 500 });
  }
}
