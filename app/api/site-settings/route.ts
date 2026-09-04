import { NextResponse } from "next/server";
import { getSiteSettings } from "@/lib/serverData";

export async function GET() {
  try {
    const settings = await getSiteSettings();
    return NextResponse.json(settings);
  } catch (err) {
    console.error("GET /api/site-settings failed:", err);
    return NextResponse.json({ error: (err as Error).message || "Failed to load site settings" }, { status: 500 });
  }
}
