"use client";

import type { CSSProperties } from "react";
import type { SlideEntry } from "./slideMeta";

interface Props {
  slides: SlideEntry[];
  current: number;
  onSelect: (i: number) => void;
  vars: CSSProperties;
  accent: string;
}

const THUMB_WIDTH = 160;
const THUMB_HEIGHT = Math.round((THUMB_WIDTH * 1080) / 1920);
const SCALE = THUMB_WIDTH / 1920;

/** Real visual thumbnails — each slide rendered at native size and scaled down, not just a label list. */
export function ThumbnailRail({ slides, current, onSelect, vars, accent }: Props) {
  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-[9997] flex gap-2 overflow-x-auto p-3 print:hidden"
      style={{ background: "linear-gradient(to top, rgba(0,0,0,.7), transparent)" }}
    >
      {slides.map((s, i) => (
        <button
          key={s.key}
          type="button"
          onClick={() => onSelect(i)}
          title={s.label}
          className="relative shrink-0 overflow-hidden rounded box-border"
          style={{
            width: THUMB_WIDTH,
            height: THUMB_HEIGHT,
            border: i === current ? `2px solid ${accent}` : "1px solid rgba(255,255,255,.2)",
            opacity: i === current ? 1 : 0.7,
          }}
        >
          <div
            className="pointer-events-none"
            style={{ width: 1920, height: 1080, transform: `scale(${SCALE})`, transformOrigin: "top left", ...vars }}
          >
            {s.node}
          </div>
        </button>
      ))}
    </div>
  );
}
