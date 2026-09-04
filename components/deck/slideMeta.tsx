import type { ReactNode } from "react";
import type { Category, SiteSettings } from "@/lib/types";
import { CoverSlide } from "./slides/CoverSlide";
import { IntroductionSlide } from "./slides/IntroductionSlide";
import { ContentsSlide } from "./slides/ContentsSlide";
import { SelectedWorkSlide } from "./slides/SelectedWorkSlide";
import { VideoSlide } from "./slides/VideoSlide";
import { ProjectSlide } from "./slides/ProjectSlide";
import { PackagesSlide } from "./slides/PackagesSlide";
import { ClientsSlide } from "./slides/ClientsSlide";
import { ContactSlide } from "./slides/ContactSlide";

export interface SlideEntry {
  key: string;
  label: string;
  notes: string;
  node: ReactNode;
}

// Director's cues from the original prototype (Photography Portfolio.dc.html
// data-speaker-notes) — fixed per slide *type*, not per-category data.
export function buildSlideEntries(category: Category, siteSettings: SiteSettings): SlideEntry[] {
  return [
    {
      key: "cover",
      label: "01 Cover",
      notes: "Open with the category the client cares about. Say the name, the discipline, and one sentence of positioning.",
      node: <CoverSlide category={category} siteSettings={siteSettings} />,
    },
    {
      key: "intro",
      label: "02 Introduction",
      notes: "Two beats: who I am, and why this category is the bulk of my work.",
      node: <IntroductionSlide category={category} />,
    },
    {
      key: "contents",
      label: "03 Contents",
      notes: "Signpost the five sections so the client knows the shape of the next ten minutes.",
      node: <ContentsSlide category={category} />,
    },
    {
      key: "selected",
      label: "04 Selected work",
      notes: "Let the grid breathe — name each frame only if asked.",
      node: <SelectedWorkSlide category={category} />,
    },
    {
      key: "video",
      label: "05 Video",
      notes: "Play the vertical cut, then say the same visit produced the stills set.",
      node: <VideoSlide category={category} />,
    },
    ...category.projects.map((p, i) => ({
      key: `project-${i}`,
      label: p.label || `Project ${i + 1}`,
      notes: p.notes || "",
      node: <ProjectSlide key={`project-${i}`} project={p} />,
    })),
    {
      key: "packages",
      label: "09 Packages",
      notes: "Anchor on the middle package. Rates are day rates, licensing quoted separately.",
      node: <PackagesSlide category={category} />,
    },
    {
      key: "clients",
      label: "10 Clients",
      notes: "Read the quote out loud only if the room is quiet. Otherwise let them scan the list.",
      node: <ClientsSlide category={category} />,
    },
    {
      key: "contact",
      label: "11 Contact",
      notes: "Close on availability: name the next open window and ask for their shoot dates.",
      node: <ContactSlide category={category} />,
    },
  ];
}
