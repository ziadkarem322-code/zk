import { SlideShell } from "@/components/deck/SlideShell";
import type { Category } from "@/lib/types";

export function ContactSlide({ category }: { category: Category }) {
  return (
    <SlideShell padding="84px 88px" className="flex flex-col justify-between">
      <div className="font-mono text-[26px] tracking-[.22em] uppercase text-[rgba(245,244,242,.6)]">
        {category.catName} — booking
      </div>

      <div>
        <div className="font-display text-[210px] leading-none">
          LET&apos;S <span className="text-[var(--accent)]">SHOOT</span>
        </div>
        <div
          className="font-body text-[32px] leading-[1.45] text-[rgba(245,244,242,.76)]"
          style={{ maxWidth: 760, marginTop: 28, textWrap: "pretty" }}
        >
          {category.availability}
        </div>
      </div>

      <div className="grid grid-cols-4 border-t border-[rgba(245,244,242,.2)]" style={{ gap: 30, paddingTop: 28 }}>
        {category.contact.map((item, i) => (
          <div key={i}>
            <div className="font-mono text-[24px] tracking-[.12em] uppercase text-[var(--accent)]" style={{ marginBottom: 8 }}>
              {item.k}
            </div>
            <div className="font-body text-[30px] text-[rgba(245,244,242,.88)]">{item.v}</div>
          </div>
        ))}
      </div>
    </SlideShell>
  );
}
