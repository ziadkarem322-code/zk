"use client";

import { useEffect, useMemo, useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchCategory } from "@/lib/apiClient";
import { buildGradientCss } from "@/lib/gradient";
import type { Category, CategorySummary, SiteSettings } from "@/lib/types";
import { Stage } from "./Stage";
import { CategorySwitcher } from "./CategorySwitcher";
import { DeckSkeleton } from "./DeckSkeleton";
import { DeckToolbar } from "./DeckToolbar";
import { ThumbnailRail } from "./ThumbnailRail";
import { SpeakerNotesPanel } from "./SpeakerNotesPanel";
import { PrintDeck } from "./PrintDeck";
import { buildSlideEntries } from "./slideMeta";

interface DeckClientProps {
  categories: CategorySummary[];
  initialSlug: string;
  initialCategory: Category;
  siteSettings: SiteSettings;
}

export function DeckClient({ categories, initialSlug, initialCategory, siteSettings }: DeckClientProps) {
  const [activeSlug, setActiveSlug] = useState(initialSlug);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showRail, setShowRail] = useState(false);
  const [showNotes, setShowNotes] = useState(false);

  const { data: category, isFetching } = useQuery({
    queryKey: ["category", activeSlug],
    queryFn: () => fetchCategory(activeSlug),
    initialData: activeSlug === initialSlug ? initialCategory : undefined,
    // Keep showing the previous category's deck while the next one loads,
    // instead of a blank flash — the switcher's own loading pulse (below)
    // is the only feedback the switch is in flight.
    placeholderData: keepPreviousData,
    staleTime: Infinity,
  });

  const slides = useMemo(() => (category ? buildSlideEntries(category, siteSettings) : []), [category, siteSettings]);
  const clampedSlide = Math.min(currentSlide, Math.max(slides.length - 1, 0));

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") return;
      if (e.key === "ArrowRight") {
        setCurrentSlide((s) => Math.min(s + 1, slides.length - 1));
      } else if (e.key === "ArrowLeft") {
        setCurrentSlide((s) => Math.max(s - 1, 0));
      } else if (e.key === "t" || e.key === "T") {
        setShowRail((v) => !v);
      } else if (e.key === "n" || e.key === "N") {
        setShowNotes((v) => !v);
      } else if (e.key === "p" || e.key === "P") {
        window.print();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [slides.length]);

  if (!category) {
    return <DeckSkeleton />;
  }

  const vars = {
    "--accent": category.accent,
    "--bg": buildGradientCss(category.bgStops, category.bgAngle),
  } as React.CSSProperties;

  return (
    <>
      <DeckToolbar
        showRail={showRail}
        onToggleRail={() => setShowRail((v) => !v)}
        showNotes={showNotes}
        onToggleNotes={() => setShowNotes((v) => !v)}
        onPrint={() => window.print()}
      />
      <CategorySwitcher categories={categories} active={activeSlug} onSelect={setActiveSlug} loading={isFetching} />
      <Stage vars={vars}>{slides[clampedSlide]?.node}</Stage>
      {showNotes && slides[clampedSlide] && <SpeakerNotesPanel slide={slides[clampedSlide]} />}
      {showRail && (
        <ThumbnailRail slides={slides} current={clampedSlide} onSelect={setCurrentSlide} vars={vars} accent={category.accent} />
      )}
      <PrintDeck slides={slides} vars={vars} />
    </>
  );
}
