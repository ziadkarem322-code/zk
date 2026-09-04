"use client";

import type { CSSProperties, ReactNode } from "react";
import { useStageScale } from "@/hooks/useStageScale";

interface StageProps {
  children: ReactNode;
  vars: CSSProperties;
  onPrev?: () => void;
  onNext?: () => void;
}

/** The fixed 1920x1080 design canvas, scaled uniformly to fit the viewport, centred, full-bleed. */
export function Stage({ children, vars, onPrev, onNext }: StageProps) {
  const { containerRef, scale } = useStageScale();

  function onClick(e: React.MouseEvent<HTMLDivElement>) {
    const target = e.target as HTMLElement;
    if (target.closest("button, a, input, textarea, select, video, [role='tab'], [role='tablist']")) {
      return;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    if (clickX < rect.width / 2) {
      onPrev?.();
    } else {
      onNext?.();
    }
  }

  return (
    <div
      ref={containerRef}
      onClick={onClick}
      className="fixed inset-0 flex items-center justify-center overflow-hidden bg-[#0b0d0f] print:hidden cursor-default select-none"
    >
      <div
        className="relative shrink-0 font-body select-text"
        style={{
          width: 1920,
          height: 1080,
          transform: `scale(${scale})`,
          transformOrigin: "center center",
          visibility: scale > 0 ? "visible" : "hidden",
          boxShadow: "0 0 0 1.5px rgba(255, 255, 255, 0.12)",
          ...vars,
        }}
      >
        {children}
      </div>
    </div>
  );
}
