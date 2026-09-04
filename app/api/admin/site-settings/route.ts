import { NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import { SiteSettings } from "@/lib/models/SiteSettings";
import { requireAdmin } from "@/lib/auth";
import { sanitizeSetPayload } from "@/lib/dotPatch";

export async function GET() {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    await connectDb();
    const settings = await SiteSettings.findOneAndUpdate({}, {}, { upsert: true, new: true, setDefaultsOnInsert: true }).lean();
    return NextResponse.json(settings);
  } catch (err) {
    console.error("GET /api/admin/site-settings failed:", err);
    return NextResponse.json({ error: (err as Error).message || "Failed to load site settings" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  let set: Record<string, unknown>;
  try {
    set = sanitizeSetPayload(await req.json());
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 400 });
  }

  try {
    await connectDb();
    const settings = await SiteSettings.findOneAndUpdate({}, { $set: set }, { upsert: true, new: true, runValidators: true }).lean();
    return NextResponse.json(settings);
  } catch (err) {
    console.error("PATCH /api/admin/site-settings failed:", err);
    return NextResponse.json({ error: (err as Error).message || "Failed to save site settings" }, { status: 500 });
  }
}
