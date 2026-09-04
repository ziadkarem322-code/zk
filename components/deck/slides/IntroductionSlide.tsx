import { ImageBox } from "@/components/deck/ImageBox";
import { SlideShell } from "@/components/deck/SlideShell";
import type { Category } from "@/lib/types";

export function IntroductionSlide({ category }: { category: Category }) {
  return (
    <SlideShell padding="64px 88px" className="grid grid-cols-2" style={{ gap: 56 }}>
      <div className="flex flex-col" style={{ gap: 26 }}>
        <div className="flex overflow-hidden" style={{ height: 620, gap: 20, flex: "0 0 auto" }}>
          <ImageBox photo={category.intro} padding={20} className="aspect-[9/16] h-full w-auto min-w-0" />
          <ImageBox photo={category.introWide} padding={20} className="aspect-[9/16] h-full w-auto min-w-0" />
        </div>
        <div className="grid grid-cols-2" style={{ gap: "16px 24px" }}>
          {category.stats.map((stat, i) => (
            <div key={i} className="border-t border-[rgba(245,244,242,.2)]" style={{ paddingTop: 14 }}>
              <div className="font-display text-[46px] leading-none text-[var(--accent)]">{stat.v}</div>
              <div className="font-mono text-[24px] tracking-[.1em] uppercase text-[rgba(245,244,242,.55)]" style={{ marginTop: 6 }}>
                {stat.k}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col justify-between">
        <div>
          <div className="font-display text-[108px] leading-[.9]">INTRODUCTION</div>
          <div className="w-full h-px bg-[rgba(245,244,242,.2)]" style={{ margin: "18px 0 24px" }} />
          <div className="font-body text-[30px] leading-[1.5] text-[rgba(245,244,242,.82)]" style={{ maxWidth: 820, textWrap: "pretty" }}>
            {category.bio}
          </div>
        </div>

        <div className="grid grid-cols-2" style={{ gap: "26px 48px", marginTop: 30 }}>
          <div>
            <div className="font-mono text-[24px] tracking-[.14em] uppercase text-[var(--accent)]" style={{ marginBottom: 16 }}>
              Services
            </div>
            <div className="flex flex-col" style={{ gap: 10 }}>
              {category.services.map((s, i) => (
                <div key={i} className="font-body text-[26px] text-[rgba(245,244,242,.8)]">
                  {s}
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="font-mono text-[24px] tracking-[.14em] uppercase text-[var(--accent)]" style={{ marginBottom: 16 }}>
              Kit &amp; workflow
            </div>
            <div className="flex flex-col" style={{ gap: 10 }}>
              {category.kit.map((s, i) => (
                <div key={i} className="font-body text-[26px] text-[rgba(245,244,242,.8)]">
                  {s}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </SlideShell>
  );
}
