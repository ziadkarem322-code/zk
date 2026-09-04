import type { SlideEntry } from "./slideMeta";

export function SpeakerNotesPanel({ slide }: { slide: SlideEntry }) {
  return (
    <div className="fixed top-[64px] right-[12px] z-[9997] w-[340px] rounded-lg border border-white/15 bg-black/80 p-4 backdrop-blur-md font-mono text-[12px] leading-relaxed text-white/90 print:hidden">
      <div className="mb-2 text-[10px] uppercase tracking-[.14em] text-white/50">{slide.label} — speaker notes</div>
      <div>{slide.notes || "—"}</div>
    </div>
  );
}
