// Plain, framework-agnostic types shared between server (Mongoose schemas,
// route handlers) and client components. No runtime code lives here —
// safe to import from client components without pulling in mongoose.

export interface Photo {
  _id?: string;
  publicId?: string;
  url?: string;
  resourceType: "image" | "video";
  fit: "cover" | "contain";
  zoom: number;
  width: number;
  height: number;
  x: number;
  y: number;
}

export interface CaptionedPhoto {
  _id?: string;
  caption: string;
  photo: Photo;
}

export interface Project {
  _id?: string;
  label: string;
  kicker: string;
  year: string;
  title: string;
  hero: Photo;
  desc: string;
  frames: CaptionedPhoto[];
  delivered: string[];
  notes: string;
}

export interface Stat {
  v: string;
  k: string;
}

export interface ContentItem {
  n: string;
  t: string;
}

export interface Package {
  tier: string;
  price: string;
  unit: string;
  items: string[];
}

export interface ContactItem {
  k: string;
  v: string;
}

export interface BgStop {
  color: string;
  position: number;
}

export interface Category {
  _id: string;
  slug: string;
  order: number;
  short: string;
  catName: string;
  discipline?: string;
  accent: string;
  bgStops: BgStop[];
  bgAngle: number;
  cover: Photo;
  intro: Photo;
  introWide: Photo;
  tagline: string;
  coverSlot: string;
  bio: string;
  services: string[];
  kit: string[];
  stats: Stat[];
  contents: ContentItem[];
  gridNote: string;
  gridPhotos: CaptionedPhoto[];
  videoPoster?: Photo;
  videoAsset?: Photo;
  videoTitle?: string;
  videoKicker?: string;
  videoDesc?: string;
  videoSpecs?: string[];
  packagesTitle: string;
  packagesNote: string;
  packages: Package[];
  clients: string[];
  quote: string;
  quoteBy: string;
  availability: string;
  contact: ContactItem[];
  projects: Project[];
}

export type CategorySummary = Pick<Category, "_id" | "slug" | "short" | "catName" | "accent" | "order">;

export const emptyPhoto = (): Photo => ({
  resourceType: "image",
  fit: "cover",
  zoom: 100,
  width: 100,
  height: 0,
  x: 43,
  y: 23,
});
