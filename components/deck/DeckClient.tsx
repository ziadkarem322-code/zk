"use client";

import { useEffect, useMemo, useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchCategory } from "@/lib/apiClient";
import { buildGradientCss } from "@/lib/gradient";
import type { Category, CategorySummary } from "@/lib/types";
import { Stage } from "./Stage";
import { CategorySwitcher } from "./CategorySwitcher";
import { DeckSkeleton } from "./DeckSkeleton";
import { CoverSlide } from "./slides/CoverSlide";
import { IntroductionSlide } from "./slides/IntroductionSlide";
import { ContentsSlide } from "./slides/ContentsSlide";
import { SelectedWorkSlide } from "./slides/SelectedWorkSlide";
import { VideoSlide } from "./slides/VideoSlide";
import { ProjectSlide } from "./slides/ProjectSlide";
import { PackagesSlide } from "./slides/PackagesSlide";
import { ClientsSlide } from "./slides/ClientsSlide";
import { ContactSlide } from "./slides/ContactSlide";

interface DeckClientProps {
  categories: CategorySummary[];
  initialSlug: string;
  initialCategory: Category;
}

function buildSlides(category: Category) {
  return [
    <CoverSlide key="cover" category={category} />,
    <IntroductionSlide key="intro" category={category} />,
    <ContentsSlide key="contents" category={category} />,
    <SelectedWorkSlide key="selected" category={category} />,
    <VideoSlide key="video" category={category} />,
    ...category.projects.map((p, i) => <ProjectSlide key={`project-${i}`} project={p} />),
    <PackagesSlide key="packages" category={category} />,
    <ClientsSlide key="clients" category={category} />,
    <ContactSlide key="contact" category={category} />,
  ];
}

export function DeckClient({ categories, initialSlug, initialCategory }: DeckClientProps) {
  const [activeSlug, setActiveSlug] = useState(initialSlug);
  const [currentSlide, setCurrentSlide] = useState(0);

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

  const slides = useMemo(() => (category ? buildSlides(category) : []), [category]);
  const clampedSlide = Math.min(currentSlide, Math.max(slides.length - 1, 0));

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "ArrowRight") {
        setCurrentSlide((s) => Math.min(s + 1, slides.length - 1));
      } else if (e.key === "ArrowLeft") {
        setCurrentSlide((s) => Math.max(s - 1, 0));
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
      <CategorySwitcher categories={categories} active={activeSlug} onSelect={setActiveSlug} loading={isFetching} />
      <Stage vars={vars}>{slides[clampedSlide]}</Stage>
    </>
  );
}
