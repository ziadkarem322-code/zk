"use client";

import type { CSSProperties, ReactNode } from "react";
import { useStageScale } from "@/hooks/useStageScale";

interface StageProps {
  children: ReactNode;
  vars: CSSProperties;
}

/** The fixed 1920x1080 design canvas, scaled uniformly to fit the viewport, centred, full-bleed. */
export function Stage({ children, vars }: StageProps) {
  const { containerRef, scale } = useStageScale();

  return (
    <div ref={containerRef} className="fixed inset-0 flex items-center justify-center overflow-hidden bg-[#0b0d0f] print:hidden">
      <div
        className="relative shrink-0 font-body"
        style={{
          width: 1920,
          height: 1080,
          transform: `scale(${scale})`,
          transformOrigin: "center center",
          visibility: scale > 0 ? "visible" : "hidden",
          ...vars,
        }}
      >
        {children}
      </div>
    </div>
  );
}
