import { SlideShell } from "@/components/deck/SlideShell";
import type { Category } from "@/lib/types";

export function PackagesSlide({ category }: { category: Category }) {
  return (
    <SlideShell padding="64px 88px" className="grid" style={{ gridTemplateRows: "auto 1fr", gap: 34 }}>
      <div className="flex justify-between items-start">
        <div>
          <div className="font-mono text-[24px] tracking-[.16em] uppercase text-[var(--accent)]" style={{ marginBottom: 16 }}>
            How we work together
          </div>
          <div className="font-display text-[96px] leading-none">{category.packagesTitle}</div>
        </div>
        <div className="font-body text-[26px] text-[rgba(245,244,242,.66)]" style={{ maxWidth: 520 }}>
          {category.packagesNote}
        </div>
      </div>

      <div className="grid grid-cols-3" style={{ gap: 20 }}>
        {category.packages.map((pkg, i) => {
          const featured = i === 1;
          return (
            <div
              key={i}
              className="flex flex-col justify-between box-border"
              style={{
                gap: 18,
                padding: "26px 24px",
                border: featured ? "1px solid var(--accent)" : "1px solid rgba(245,244,242,.18)",
                background: featured ? "rgba(245,244,242,.06)" : "transparent",
              }}
            >
              <div>
                <div className="font-mono text-[24px] tracking-[.14em] uppercase text-[rgba(245,244,242,.62)]">{pkg.tier}</div>
                <div className="font-display text-[62px] leading-none" style={{ marginTop: 8 }}>
                  {pkg.price}
                </div>
                <div className="font-body text-[24px] text-[rgba(245,244,242,.6)]" style={{ marginTop: 6 }}>
                  {pkg.unit}
                </div>
              </div>
              <div className="flex flex-col font-body text-[26px] leading-[1.35] text-[rgba(245,244,242,.82)]" style={{ gap: 12 }}>
                {pkg.items.map((item, j) => (
                  <div key={j}>{item}</div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </SlideShell>
  );
}
