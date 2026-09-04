import { SlideShell } from "@/components/deck/SlideShell";
import type { Category } from "@/lib/types";

export function ContentsSlide({ category }: { category: Category }) {
  return (
    <SlideShell padding="84px 88px" className="flex flex-col justify-center" style={{ gap: 52 }}>
      <div className="flex items-baseline" style={{ gap: 34 }}>
        <div className="font-display text-[112px] leading-[.9]">CONTENT</div>
        <div className="flex-1 h-px bg-[rgba(245,244,242,.2)]" />
        <div className="font-mono text-[26px] tracking-[.16em] uppercase text-[rgba(245,244,242,.6)] whitespace-nowrap">
          {category.catName}
        </div>
      </div>

      <div className="grid grid-cols-5" style={{ gap: 34 }}>
        {category.contents.map((item, i) => (
          <div key={i} className="border-t-2 border-[rgba(245,244,242,.22)]" style={{ paddingTop: 22 }}>
            <div className="font-display text-[104px] leading-[.9] text-[var(--accent)]">{item.n}</div>
            <div
              className="font-mono text-[24px] tracking-[.1em] uppercase leading-[1.45] text-[rgba(245,244,242,.78)]"
              style={{ marginTop: 10 }}
            >
              {item.t}
            </div>
          </div>
        ))}
      </div>
    </SlideShell>
  );
}
