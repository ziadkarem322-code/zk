import { resolveCoverBackground } from "@/lib/imageStyle";
import type { Category } from "@/lib/types";

export function CoverSlide({ category }: { category: Category }) {
  return (
    <section className="absolute inset-0 box-border overflow-hidden bg-[var(--bg)] text-[#f5f4f2] grid grid-cols-2">
      <div className="flex flex-col justify-between" style={{ padding: "80px 72px 72px 88px" }}>
        <div className="flex items-center gap-4">
          <span className="w-[38px] h-px bg-[var(--accent)]" />
          <span className="font-mono text-[24px] tracking-[.22em] uppercase text-[rgba(245,244,242,.6)]">
            {category.discipline || "Independent — AI Image Direction"}
          </span>
        </div>

        <div>
          <div className="font-display text-[212px] leading-[.86] tracking-[.01em]">
            PORT<span className="text-[var(--accent)]">FOLIO</span>
          </div>
          <div className="flex items-baseline gap-5 mt-[26px] flex-nowrap font-mono text-[24px] tracking-[.08em] uppercase text-[rgba(245,244,242,.78)]">
            <span className="whitespace-nowrap">{category.catName}</span>
            <span className="flex-1 h-px bg-[rgba(245,244,242,.22)]" style={{ minWidth: 40 }} />
            <span className="whitespace-nowrap">2026</span>
          </div>
        </div>

        <div className="flex items-baseline justify-between">
          <div className="font-display text-[56px] leading-none tracking-[.06em]">zk</div>
          <div
            className="font-body text-[26px] leading-[1.45] text-[rgba(245,244,242,.66)] text-right"
            style={{ maxWidth: 440, textWrap: "pretty" }}
          >
            {category.tagline}
          </div>
        </div>
      </div>

      <div
        className="relative flex items-end box-border border-l border-[rgba(245,244,242,.14)]"
        style={{ padding: 40, ...resolveCoverBackground(category.cover) }}
      >
        <div
          className="font-mono text-[24px] tracking-[.12em] uppercase leading-[1.7] text-[rgba(245,244,242,.78)]"
          style={{ textShadow: "0 2px 12px rgba(0,0,0,.8)" }}
        >
          {category.coverSlot}
        </div>
      </div>
    </section>
  );
}
