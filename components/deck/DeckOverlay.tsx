"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  currentSlide: number;
  totalSlides: number;
  onPrev: () => void;
  onNext: () => void;
  showRail: boolean;
  onToggleRail: () => void;
  showNotes: boolean;
  onToggleNotes: () => void;
  onPrint: () => void;
}

export function DeckOverlay({
  currentSlide,
  totalSlides,
  onPrev,
  onNext,
  showRail,
  onToggleRail,
  showNotes,
  onToggleNotes,
  onPrint,
}: Props) {
  const [visible, setVisible] = useState(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    function onMouseMove() {
      setVisible(true);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        setVisible(false);
      }, 3200);
    }

    window.addEventListener("mousemove", onMouseMove);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);

  return (
    <div
      onMouseEnter={() => {
        if (timerRef.current) clearTimeout(timerRef.current);
        setVisible(true);
      }}
      className={`fixed bottom-[22px] left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-[6px] px-3 py-[5px] rounded-full border border-white/[.14] transition-all duration-300 ease-out print:hidden ${
        visible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-2 scale-95 pointer-events-none"
      }`}
      style={{
        background: "rgba(11, 13, 15, 0.85)",
        backdropFilter: "blur(22px) saturate(180%)",
        WebkitBackdropFilter: "blur(22px) saturate(180%)",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,.25), 0 10px 32px rgba(0,0,0,.45)",
      }}
    >
      {/* Prev button */}
      <button
        type="button"
        onClick={onPrev}
        disabled={currentSlide === 0}
        aria-label="Previous slide"
        title="Previous slide (←)"
        className="w-7 h-7 rounded-full flex items-center justify-center text-white/75 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>

      {/* Slide counter */}
      <span className="font-mono text-[12px] tracking-[.08em] px-2 text-white/90 tabular-nums select-none">
        {pad(currentSlide + 1)} <span className="text-white/40">/</span> {pad(totalSlides)}
      </span>

      {/* Next button */}
      <button
        type="button"
        onClick={onNext}
        disabled={currentSlide >= totalSlides - 1}
        aria-label="Next slide"
        title="Next slide (→)"
        className="w-7 h-7 rounded-full flex items-center justify-center text-white/75 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>

      <span className="w-px h-4 bg-white/15 mx-1" />

      {/* Thumbnail rail toggle */}
      <button
        type="button"
        onClick={onToggleRail}
        title="Toggle thumbnails (T)"
        aria-label="Toggle thumbnails"
        className={`px-2.5 h-6 rounded-full font-mono text-[10px] tracking-wider uppercase transition-all flex items-center gap-1.5 ${
          showRail ? "bg-white text-black font-semibold" : "text-white/70 hover:text-white hover:bg-white/10"
        }`}
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
        </svg>
        <span>Grid</span>
      </button>

      {/* Speaker notes toggle */}
      <button
        type="button"
        onClick={onToggleNotes}
        title="Toggle speaker notes (N)"
        aria-label="Toggle speaker notes"
        className={`px-2.5 h-6 rounded-full font-mono text-[10px] tracking-wider uppercase transition-all flex items-center gap-1.5 ${
          showNotes ? "bg-white text-black font-semibold" : "text-white/70 hover:text-white hover:bg-white/10"
        }`}
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
        <span>Notes</span>
      </button>

      {/* Print button */}
      <button
        type="button"
        onClick={onPrint}
        title="Print or export to PDF (P)"
        aria-label="Print deck"
        className="px-2.5 h-6 rounded-full font-mono text-[10px] tracking-wider uppercase text-white/70 hover:text-white hover:bg-white/10 transition-all flex items-center gap-1.5"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 6 2 18 2 18 9" />
          <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
          <rect x="6" y="14" width="12" height="8" />
        </svg>
        <span>PDF</span>
      </button>
    </div>
  );
}
