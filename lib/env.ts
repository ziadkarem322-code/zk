import { z } from "zod";

const cleanString = (min = 1, msg?: string) =>
  z
    .string()
    .transform((s) => s.trim().replace(/^["']|["']$/g, ""))
    .pipe(z.string().min(min, msg));

const envSchema = z.object({
  MONGODB_URI: cleanString(1, "MONGODB_URI is required").refine(
    (uri) => uri.startsWith("mongodb://") || uri.startsWith("mongodb+srv://"),
    {
      message:
        "MONGODB_URI must start with 'mongodb://' or 'mongodb+srv://'. Check for accidental characters or typos in Vercel.",
    }
  ),
  JWT_SECRET: cleanString(16, "JWT_SECRET must be at least 16 characters"),
  JWT_EXPIRES_IN: z.string().default("12h"),
  ADMIN_PASSWORD: cleanString(1, "ADMIN_PASSWORD is required"),
  CLOUDINARY_API_KEY: cleanString(1),
  CLOUDINARY_API_SECRET: cleanString(1),
  CLOUDINARY_UPLOAD_FOLDER: z.string().default("zk-portfolio"),
  NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: cleanString(1),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Invalid environment configuration:");
  for (const issue of parsed.error.issues) {
    console.error(`  ${issue.path.join(".")}: ${issue.message}`);
  }
  throw new Error("Invalid environment configuration — see server logs.");
}

export const env = parsed.data;
