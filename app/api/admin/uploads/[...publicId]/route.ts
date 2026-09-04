import { NextResponse } from "next/server";
import { cloudinary } from "@/lib/cloudinary";
import { requireAdmin } from "@/lib/auth";

export async function DELETE(req: Request, { params }: { params: Promise<{ publicId: string[] }> }) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { publicId: segments } = await params;
  const publicId = segments.join("/");
  const resourceType = new URL(req.url).searchParams.get("resourceType") === "video" ? "video" : "image";

  await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
  return NextResponse.json({ ok: true });
}
