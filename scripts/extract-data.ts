import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const HTML_PATH = path.resolve(__dirname, "..", "Photography Portfolio.dc.html");

// `const PH = {...}` starts at line 248, `const DATA = {...}` closes at line 492
// (verified against Photography Portfolio.dc.html — re-check these if the file changes).
const PH_DATA_START_LINE = 248;
const PH_DATA_END_LINE = 492;

export interface RawProject {
  label: string;
  kicker: string;
  year: string;
  title: string;
  hero: string;
  desc: string;
  frames: [string, string][];
  delivered: string[];
  notes: string;
}

export interface RawCategory {
  short: string;
  catName: string;
  discipline?: string;
  accent: string;
  bg: string;
  cover: string;
  intro: string;
  introWide: string;
  tagline: string;
  coverSlot: string;
  bio: string;
  services: string[];
  kit: string[];
  stats: { v: string; k: string }[];
  contents: { n: string; t: string }[];
  gridNote: string;
  gridSlots: string[];
  gridImages: string[];
  video?: string;
  videoTitle?: string;
  videoKicker?: string;
  videoDesc?: string;
  videoSpecs?: string[];
  packagesTitle: string;
  packagesNote: string;
  packages: { tier: string; price: string; unit: string; items: string[] }[];
  clients: string[];
  quote: string;
  quoteBy: string;
  availability: string;
  contact: { k: string; v: string }[];
  projects: RawProject[];
}

/**
 * Extracts the prototype's `PH` (photo path map) and `DATA` (5 category records)
 * literal objects by evaluating that exact slice of the .dc.html source in a vm
 * sandbox — byte-faithful copy, no hand-parsing / no invented content.
 */
export function extractData(): { PH: Record<string, string>; DATA: Record<string, RawCategory> } {
  const html = fs.readFileSync(HTML_PATH, "utf-8");
  const lines = html.split("\n");
  const snippet = lines.slice(PH_DATA_START_LINE - 1, PH_DATA_END_LINE).join("\n");

  if (!snippet.includes("const PH = {") || !snippet.trimEnd().endsWith("};")) {
    throw new Error(
      "extract-data: line range no longer matches the PH/DATA block — re-check PH_DATA_START_LINE/END_LINE against the .dc.html source."
    );
  }

  const sandbox: { __PH?: Record<string, string>; __DATA?: Record<string, RawCategory> } = {};
  vm.createContext(sandbox);
  vm.runInContext(`${snippet}\nthis.__PH = PH; this.__DATA = DATA;`, sandbox, { filename: "dc-data-snippet.js" });

  if (!sandbox.__PH || !sandbox.__DATA) {
    throw new Error("extract-data: failed to evaluate PH/DATA from the snippet.");
  }

  return { PH: sandbox.__PH, DATA: sandbox.__DATA };
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  const { PH, DATA } = extractData();
  console.log(`Extracted ${Object.keys(PH).length} photo refs and ${Object.keys(DATA).length} categories:`, Object.keys(DATA));
}
