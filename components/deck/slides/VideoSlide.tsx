import { resolveVideoPosterBackground } from "@/lib/imageStyle";
import { SlideShell } from "@/components/deck/SlideShell";
import type { Category } from "@/lib/types";

export function VideoSlide({ category }: { category: Category }) {
  const hasVideo = Boolean(category.videoAsset?.url);

  return (
    <SlideShell padding="64px 88px" className="grid grid-cols-2" style={{ gap: 48 }}>
      <div className="flex flex-col justify-between">
        <div>
          <div className="flex items-center" style={{ gap: 14 }}>
            <span className="font-mono text-[24px] tracking-[.16em] uppercase text-[var(--accent)]">
              {category.videoKicker || `Video — ${category.catName}`}
            </span>
            <span className="w-[26px] h-px bg-[var(--accent)]" />
          </div>
          <div className="font-display text-[96px] leading-[.9]" style={{ marginTop: 12 }}>
            {category.videoTitle || "MOTION CUT"}
          </div>
          <div className="font-body text-[28px] leading-[1.45] text-[rgba(245,244,242,.8)]" style={{ marginTop: 24 }}>
            {category.videoDesc || "A short motion cut from the same session, delivered alongside the stills set."}
          </div>
        </div>

        <div>
          <div className="font-mono text-[24px] tracking-[.14em] uppercase text-[var(--accent)]" style={{ marginBottom: 14 }}>
            Delivery
          </div>
          <div className="flex flex-wrap" style={{ gap: 12 }}>
            {(category.videoSpecs || []).map((spec, i) => (
              <span
                key={i}
                className="font-mono text-[24px] rounded-full border border-[rgba(245,244,242,.24)] text-[rgba(245,244,242,.82)]"
                style={{ padding: "6px 18px" }}
              >
                {spec}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-stretch justify-center" style={{ minHeight: 0 }}>
        <div
          className="relative box-border border border-[rgba(245,244,242,.16)] overflow-hidden aspect-[9/16] h-full w-auto"
          style={resolveVideoPosterBackground(category.videoPoster)}
        >
          {hasVideo ? (
            <video
              controls
              playsInline
              preload="metadata"
              poster={category.videoPoster?.url}
              src={category.videoAsset!.url}
              className="w-full h-full object-cover bg-black"
            />
          ) : (
            <div
              className="absolute inset-x-0 bottom-0 font-mono text-[24px] text-[rgba(245,244,242,.82)] pointer-events-none"
              style={{
                padding: "18px 22px",
                background: "linear-gradient(to top, rgba(0,0,0,.78), rgba(0,0,0,0))",
              }}
            >
              Set the video asset in admin to play the cut here
            </div>
          )}
        </div>
      </div>
    </SlideShell>
  );
}
