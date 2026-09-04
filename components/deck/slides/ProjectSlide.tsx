import { ImageBox } from "@/components/deck/ImageBox";
import { SlideShell } from "@/components/deck/SlideShell";
import type { Project } from "@/lib/types";

export function ProjectSlide({ project }: { project: Project }) {
  return (
    <SlideShell padding="64px 88px" className="grid grid-cols-2" style={{ gap: 48 }}>
      <div className="flex flex-col min-h-0" style={{ gap: 24 }}>
        <div>
          <div className="flex items-center" style={{ gap: 14 }}>
            <span className="font-mono text-[24px] tracking-[.16em] uppercase text-[var(--accent)]">{project.kicker}</span>
            <span className="w-[26px] h-px bg-[var(--accent)]" />
            <span className="font-mono text-[24px] text-[rgba(245,244,242,.5)]">{project.year}</span>
          </div>
          <div className="font-display text-[96px] leading-[.86]" style={{ marginTop: 12 }}>
            {project.title}
          </div>
        </div>
        <ImageBox photo={project.hero} padding={22} className="flex-1 min-h-0 self-start aspect-[9/16] h-full w-auto" />
      </div>

      <div className="flex flex-col justify-between min-h-0" style={{ gap: 26 }}>
        <div
          className="font-body text-[28px] leading-[1.45] text-[rgba(245,244,242,.8)]"
          style={{ textWrap: "pretty" }}
        >
          {project.desc}
        </div>

        <div className="flex overflow-hidden" style={{ gap: 18, height: 400, flex: "0 0 auto" }}>
          {project.frames.map((frame, i) => (
            <ImageBox key={i} photo={frame.photo} padding={14} className="aspect-[9/16] h-full w-auto">
              <div
                className="font-mono text-[24px] tracking-[.05em] text-[rgba(245,244,242,.62)]"
                style={{ textShadow: "0 2px 10px rgba(0,0,0,.8)" }}
              >
                {frame.caption}
              </div>
            </ImageBox>
          ))}
        </div>

        <div>
          <div className="font-mono text-[24px] tracking-[.14em] uppercase text-[var(--accent)]" style={{ marginBottom: 14 }}>
            Delivered
          </div>
          <div className="flex flex-wrap" style={{ gap: 10 }}>
            {project.delivered.map((item, i) => (
              <span
                key={i}
                className="font-body text-[24px] rounded-full border border-[rgba(245,244,242,.24)] text-[rgba(245,244,242,.82)]"
                style={{ padding: "8px 20px" }}
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </SlideShell>
  );
}
