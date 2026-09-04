import { ImageBox } from "@/components/deck/ImageBox";
import { SlideShell } from "@/components/deck/SlideShell";
import type { Category } from "@/lib/types";

export function SelectedWorkSlide({ category }: { category: Category }) {
  const shown = category.gridPhotos.slice(0, 3);

  return (
    <SlideShell padding="64px 88px" className="grid" style={{ gridTemplateRows: "auto 1fr", gap: 32 }}>
      <div className="flex justify-between items-end">
        <div>
          <div className="font-mono text-[24px] tracking-[.16em] uppercase text-[var(--accent)]" style={{ marginBottom: 14 }}>
            Section 01
          </div>
          <div className="font-display text-[104px] leading-[.85]">SELECTED WORK</div>
        </div>
        <div className="font-body text-[26px] leading-[1.45] text-[rgba(245,244,242,.66)]" style={{ maxWidth: 520, textWrap: "pretty" }}>
          {category.gridNote}
        </div>
      </div>

      <div className="flex justify-center items-stretch" style={{ gap: 24, minHeight: 0 }}>
        {shown.map((item, i) => (
          <ImageBox key={i} photo={item.photo} className="aspect-[9/16] h-full w-auto">
            <div
              className="font-mono text-[24px] tracking-[.06em] text-[rgba(245,244,242,.72)]"
              style={{ textShadow: "0 2px 10px rgba(0,0,0,.8)" }}
            >
              {item.caption}
            </div>
          </ImageBox>
        ))}
      </div>
    </SlideShell>
  );
}
