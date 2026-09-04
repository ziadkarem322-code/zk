"use client";

import { useEffect, useRef, useState } from "react";

const DESIGN_WIDTH = 1920;
const DESIGN_HEIGHT = 1080;

/**
 * Scale-to-fit measurement for the fixed 1920x1080 design canvas.
 *
 * Two failure modes this guards against (see README "Two failure modes to avoid"):
 * 1. Zero-height stage — a one-shot mount-time read can fire before layout settles
 *    and compute a scale of 0. We measure via ResizeObserver (post-layout) and,
 *    if still zero, retry on requestAnimationFrame until a real size lands.
 * 2. Late web-font swaps changing intrinsic sizes — re-measure once fonts are ready.
 */
export function useStageScale() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let rafId = 0;
    let cancelled = false;

    const measure = () => {
      if (cancelled) return;
      const { width, height } = el.getBoundingClientRect();
      if (width === 0 || height === 0) {
        rafId = requestAnimationFrame(measure);
        return;
      }
      setScale(Math.min(width / DESIGN_WIDTH, height / DESIGN_HEIGHT));
    };

    const observer = new ResizeObserver(measure);
    observer.observe(el);
    measure();

    document.fonts?.ready.then(measure).catch(() => {});
    window.addEventListener("load", measure);

    return () => {
      cancelled = true;
      observer.disconnect();
      window.removeEventListener("load", measure);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return { containerRef, scale };
}
