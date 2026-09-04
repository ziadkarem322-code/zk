"use client";

import { useRef } from "react";
import type { CategorySummary } from "@/lib/types";

interface Props {
  categories: CategorySummary[];
  active: string;
  onSelect: (slug: string) => void;
  /** True while the active category's data is (re)loading — pulses the active button as feedback. */
  loading?: boolean;
}

/** The signature liquid-glass pill. Each button's active state previews *its own* accent, not the current one. */
export function CategorySwitcher({ categories, active, onSelect, loading = false }: Props) {
  const btnRefs = useRef<(HTMLButtonElement | null)[]>([]);

  function onKeyDown(e: React.KeyboardEvent) {
    const i = categories.findIndex((c) => c.slug === active);
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      e.preventDefault();
      const next = e.key === "ArrowRight" ? (i + 1) % categories.length : (i - 1 + categories.length) % categories.length;
      onSelect(categories[next].slug);
      btnRefs.current[next]?.focus();
    }
  }

  return (
    <div
      role="tablist"
      aria-label="Client type"
      onKeyDown={onKeyDown}
      className="fixed top-[10px] right-[12px] z-[9999] flex items-stretch gap-[3px] p-[3px] box-border rounded-full border border-white/[.14] print:hidden"
      style={{
        background: "linear-gradient(150deg, rgba(255,255,255,.20), rgba(255,255,255,.05) 42%, rgba(255,255,255,.12))",
        backdropFilter: "blur(22px) saturate(180%)",
        WebkitBackdropFilter: "blur(22px) saturate(180%)",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,.45), inset 0 -1px 0 rgba(255,255,255,.12), 0 8px 24px rgba(0,0,0,.32)",
      }}
    >
      {categories.map((cat, i) => {
        const isActive = cat.slug === active;
        return (
          <button
            key={cat.slug}
            ref={(el) => {
              btnRefs.current[i] = el;
            }}
            role="tab"
            aria-selected={isActive}
            tabIndex={isActive ? 0 : -1}
            onClick={() => onSelect(cat.slug)}
            className={`appearance-none cursor-pointer border-none font-mono text-[9px] tracking-[.1em] uppercase px-3 h-[22px] rounded-full flex-none min-w-0 whitespace-nowrap flex items-center justify-center leading-none transition-all duration-[180ms] ease-out ${
              isActive ? "opacity-100" : "opacity-80 hover:opacity-100"
            } ${isActive && loading ? "animate-pulse" : ""}`}
            style={{
              background: isActive ? cat.accent : "transparent",
              color: isActive ? "#101214" : "rgba(255,255,255,.68)",
              boxShadow: isActive ? "inset 0 1px 0 rgba(255,255,255,.5), 0 2px 8px rgba(0,0,0,.25)" : "none",
            }}
          >
            {cat.short}
          </button>
        );
      })}
    </div>
  );
}
