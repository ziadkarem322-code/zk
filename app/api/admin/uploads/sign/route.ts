import { NextResponse } from "next/server";
import { cloudinary } from "@/lib/cloudinary";
import { env } from "@/lib/env";
import { requireAdmin } from "@/lib/auth";

export async function POST() {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const timestamp = Math.round(Date.now() / 1000);
  const paramsToSign = { timestamp, folder: env.CLOUDINARY_UPLOAD_FOLDER };
  const signature = cloudinary.utils.api_sign_request(paramsToSign, env.CLOUDINARY_API_SECRET);

  return NextResponse.json({
    timestamp,
    signature,
    apiKey: env.CLOUDINARY_API_KEY,
    cloudName: env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    folder: env.CLOUDINARY_UPLOAD_FOLDER,
  });
}
