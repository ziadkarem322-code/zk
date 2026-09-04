import "./loadEnv";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pLimit from "p-limit";
import { cloudinary } from "@/lib/cloudinary";
import { extractData } from "./extract-data";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..");
const CACHE_DIR = path.resolve(__dirname, ".cache");
const CACHE_FILE = path.join(CACHE_DIR, "photo-map.json");

export interface UploadedPhoto {
  publicId: string;
  url: string;
  resourceType: "image" | "video";
}

function loadCache(): Record<string, UploadedPhoto> {
  if (!fs.existsSync(CACHE_FILE)) return {};
  return JSON.parse(fs.readFileSync(CACHE_FILE, "utf-8"));
}

function saveCache(cache: Record<string, UploadedPhoto>) {
  fs.mkdirSync(CACHE_DIR, { recursive: true });
  fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2));
}

/**
 * Uploads every PH.* photo referenced by the prototype's DATA object to Cloudinary.
 * Keyed by the relative file path (e.g. "photos/foo.jpg") rather than the PH.*
 * identifier — DATA's fields already hold the resolved path string after the
 * PH.* reference is evaluated, so a path-keyed map is what seed.ts needs directly.
 */
export async function uploadAllPhotos(): Promise<Record<string, UploadedPhoto>> {
  const { PH } = extractData();
  const cache = loadCache();
  const limit = pLimit(5);
  const folder = process.env.CLOUDINARY_UPLOAD_FOLDER || "zk-portfolio";

  const relativePaths = Array.from(new Set(Object.values(PH)));
  let uploaded = 0;
  let skipped = 0;

  await Promise.all(
    relativePaths.map((relativePath) =>
      limit(async () => {
        if (cache[relativePath]) {
          skipped++;
          return;
        }
        const absolutePath = path.resolve(REPO_ROOT, relativePath);
        if (!fs.existsSync(absolutePath)) {
          console.warn(`  [skip] file not found at ${relativePath}`);
          return;
        }
        const result = await cloudinary.uploader.upload(absolutePath, {
          folder,
          resource_type: "image",
          public_id: path.basename(relativePath, path.extname(relativePath)).slice(0, 80),
          overwrite: false,
          unique_filename: true,
        });
        cache[relativePath] = { publicId: result.public_id, url: result.secure_url, resourceType: "image" };
        uploaded++;
        console.log(`  [ok] ${relativePath} -> ${result.public_id}`);
      })
    )
  );

  saveCache(cache);
  console.log(`Uploaded ${uploaded}, already cached ${skipped}, total ${Object.keys(cache).length}/${relativePaths.length}.`);
  return cache;
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  uploadAllPhotos()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
