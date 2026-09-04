import type { CSSProperties } from "react";
import type { SlideEntry } from "./slideMeta";

interface Props {
  slides: SlideEntry[];
  vars: CSSProperties;
}

/** Hidden on screen, shown only in print — one slide per printed page at native 1920x1080. */
export function PrintDeck({ slides, vars }: Props) {
  return (
    <div className="hidden print:block">
      {slides.map((s, i) => (
        <div
          key={s.key}
          className="relative box-border overflow-hidden"
          style={{
            width: 1920,
            height: 1080,
            contain: "size",
            breakAfter: i === slides.length - 1 ? "auto" : "page",
            ...vars,
          }}
        >
          {s.node}
        </div>
      ))}
    </div>
  );
}
