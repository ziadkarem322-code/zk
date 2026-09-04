import "./loadEnv";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { connectDb } from "@/lib/db";
import { Category } from "@/lib/models/Category";
import type { BgStop, Photo } from "@/lib/types";
import { extractData, type RawCategory, type RawProject } from "./extract-data";
import { uploadAllPhotos, type UploadedPhoto } from "./upload-photos";

// Reproduces the prototype's hardcoded `center/cover` treatment (Cover image, Video poster).
const COVER_LIKE_DEFAULTS = { fit: "cover" as const, zoom: 100, width: 0, height: 0, x: 50, y: 50 };
// Reproduces the prototype's actual baked-in slider defaults for every other photo slot
// (Photography Portfolio.dc.html:247) — deliberately NOT the schema's own new-photo
// defaults (zoom:100,width:100,height:0,x:43,y:23), which are for photos created fresh in admin.
const REEL_DEFAULTS = { fit: "cover" as const, zoom: 100, width: 135, height: 0, x: 53, y: 23 };

function toPhoto(relPath: string | undefined, uploads: Record<string, UploadedPhoto>, defaults: typeof COVER_LIKE_DEFAULTS): Photo {
  const upload = relPath ? uploads[relPath] : undefined;
  if (!upload) {
    return { resourceType: "image", ...defaults };
  }
  return { publicId: upload.publicId, url: upload.url, resourceType: upload.resourceType, ...defaults };
}

function parseGradient(bg: string): { angle: number; stops: BgStop[] } {
  const match = bg.match(/^linear-gradient\((\d+)deg,\s*(.+)\)$/);
  if (!match) throw new Error(`Could not parse gradient: ${bg}`);
  const angle = Number(match[1]);
  const stops = match[2].split(/,\s*/).map((part) => {
    const stopMatch = part.match(/^(.+)\s(\d+)%$/);
    if (!stopMatch) throw new Error(`Could not parse gradient stop: ${part}`);
    return { color: stopMatch[1], position: Number(stopMatch[2]) };
  });
  return { angle, stops };
}

function toCaptionedPhotos(
  captions: string[],
  images: string[],
  uploads: Record<string, UploadedPhoto>
): { caption: string; photo: Photo }[] {
  return images.map((img, i) => ({
    caption: captions[i] ?? "",
    photo: toPhoto(img, uploads, REEL_DEFAULTS),
  }));
}

function toProject(raw: RawProject, uploads: Record<string, UploadedPhoto>) {
  return {
    label: raw.label,
    kicker: raw.kicker,
    year: raw.year,
    title: raw.title,
    hero: toPhoto(raw.hero, uploads, REEL_DEFAULTS),
    desc: raw.desc,
    frames: raw.frames.map(([caption, img]) => ({ caption, photo: toPhoto(img, uploads, REEL_DEFAULTS) })),
    delivered: raw.delivered,
    notes: raw.notes,
  };
}

function toCategoryDoc(slug: string, order: number, raw: RawCategory, uploads: Record<string, UploadedPhoto>) {
  const { angle: bgAngle, stops: bgStops } = parseGradient(raw.bg);
  // The prototype falls back to the cover image as the video poster when no
  // dedicated `video` still is set (renderVals: `videoPoster: d.video || d.cover`).
  const videoPosterSrc = raw.video || raw.cover;

  return {
    slug,
    order,
    short: raw.short,
    catName: raw.catName,
    discipline: raw.discipline,
    accent: raw.accent,
    bgStops,
    bgAngle,
    cover: toPhoto(raw.cover, uploads, COVER_LIKE_DEFAULTS),
    intro: toPhoto(raw.intro, uploads, REEL_DEFAULTS),
    introWide: toPhoto(raw.introWide, uploads, REEL_DEFAULTS),
    tagline: raw.tagline,
    coverSlot: raw.coverSlot,
    bio: raw.bio,
    services: raw.services,
    kit: raw.kit,
    stats: raw.stats,
    contents: raw.contents,
    gridNote: raw.gridNote,
    gridPhotos: toCaptionedPhotos(raw.gridSlots, raw.gridImages, uploads),
    videoPoster: toPhoto(videoPosterSrc, uploads, COVER_LIKE_DEFAULTS),
    // No video file ships with the prototype (README: "No video file is included") —
    // videoAsset stays unset, so the public deck correctly shows its empty-state hint.
    videoAsset: { resourceType: "video" as const, fit: "cover" as const, zoom: 100, width: 100, height: 0, x: 43, y: 23 },
    videoTitle: raw.videoTitle,
    videoKicker: raw.videoKicker,
    videoDesc: raw.videoDesc,
    videoSpecs: raw.videoSpecs,
    packagesTitle: raw.packagesTitle,
    packagesNote: raw.packagesNote,
    packages: raw.packages,
    clients: raw.clients,
    quote: raw.quote,
    quoteBy: raw.quoteBy,
    availability: raw.availability,
    contact: raw.contact,
    projects: raw.projects.map((p) => toProject(p, uploads)),
  };
}

const CATEGORY_ORDER = ["fashion", "food", "product", "portrait", "estate"];

async function seed() {
  console.log("Extracting DATA from Photography Portfolio.dc.html...");
  const { DATA } = extractData();

  console.log("Uploading photos to Cloudinary (cached — safe to re-run)...");
  const uploads = await uploadAllPhotos();

  console.log("Connecting to MongoDB...");
  await connectDb();

  for (const slug of CATEGORY_ORDER) {
    const raw = DATA[slug];
    if (!raw) {
      console.warn(`  [skip] no DATA entry for "${slug}"`);
      continue;
    }
    const order = CATEGORY_ORDER.indexOf(slug);
    const doc = toCategoryDoc(slug, order, raw, uploads);
    await Category.findOneAndUpdate({ slug }, doc, { upsert: true, new: true, setDefaultsOnInsert: true });
    console.log(`  [ok] upserted "${slug}" (${raw.catName})`);
  }

  console.log("Seed complete.");
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  seed()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
