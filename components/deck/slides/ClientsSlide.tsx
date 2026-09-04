import { SlideShell } from "@/components/deck/SlideShell";
import type { Category } from "@/lib/types";

export function ClientsSlide({ category }: { category: Category }) {
  return (
    <SlideShell padding="80px 88px" className="grid grid-cols-2 items-center" style={{ gap: 64 }}>
      <div>
        <div className="font-display text-[96px] leading-[.95]" style={{ marginBottom: 30 }}>
          CLIENTS
        </div>
        <div className="grid grid-cols-2" style={{ gap: "16px 40px" }}>
          {category.clients.map((name, i) => (
            <div
              key={i}
              className="font-mono text-[26px] tracking-[.06em] uppercase text-[rgba(245,244,242,.8)] border-b border-[rgba(245,244,242,.16)]"
              style={{ paddingBottom: 12 }}
            >
              {name}
            </div>
          ))}
        </div>
      </div>

      <div className="border-l-2 border-[var(--accent)]" style={{ padding: "10px 0 10px 40px" }}>
        <div className="font-body text-[34px] leading-[1.34]" style={{ textWrap: "pretty" }}>
          &ldquo;{category.quote}&rdquo;
        </div>
        <div
          className="font-mono text-[24px] tracking-[.1em] uppercase text-[rgba(245,244,242,.6)]"
          style={{ marginTop: 26 }}
        >
          {category.quoteBy}
        </div>
      </div>
    </SlideShell>
  );
}
