"use client";

interface Props {
  showRail: boolean;
  onToggleRail: () => void;
  showNotes: boolean;
  onToggleNotes: () => void;
  onPrint: () => void;
}

const btnBase =
  "appearance-none cursor-pointer border-none font-mono text-[9px] tracking-[.1em] uppercase px-3 h-[22px] rounded-full flex items-center justify-center leading-none transition-opacity";

/** UI chrome for the prototype's thumbnail-rail / speaker-notes / print tooling — not part of the design content. */
export function DeckToolbar({ showRail, onToggleRail, showNotes, onToggleNotes, onPrint }: Props) {
  return (
    <div
      className="fixed top-[10px] left-[12px] z-[9999] flex items-stretch gap-[3px] p-[3px] box-border rounded-full border border-white/[.14] print:hidden"
      style={{
        background: "linear-gradient(150deg, rgba(255,255,255,.20), rgba(255,255,255,.05) 42%, rgba(255,255,255,.12))",
        backdropFilter: "blur(22px) saturate(180%)",
        WebkitBackdropFilter: "blur(22px) saturate(180%)",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,.45), inset 0 -1px 0 rgba(255,255,255,.12), 0 8px 24px rgba(0,0,0,.32)",
      }}
    >
      <button
        type="button"
        onClick={onToggleRail}
        title="Toggle thumbnail rail (T)"
        className={`${btnBase} ${showRail ? "opacity-100" : "opacity-70 hover:opacity-100"}`}
        style={{ background: showRail ? "rgba(255,255,255,.9)" : "transparent", color: showRail ? "#101214" : "rgba(255,255,255,.68)" }}
      >
        Thumbs
      </button>
      <button
        type="button"
        onClick={onToggleNotes}
        title="Toggle speaker notes (N)"
        className={`${btnBase} ${showNotes ? "opacity-100" : "opacity-70 hover:opacity-100"}`}
        style={{ background: showNotes ? "rgba(255,255,255,.9)" : "transparent", color: showNotes ? "#101214" : "rgba(255,255,255,.68)" }}
      >
        Notes
      </button>
      <button
        type="button"
        onClick={onPrint}
        title="Print / save as PDF (P)"
        className={`${btnBase} opacity-70 hover:opacity-100`}
        style={{ color: "rgba(255,255,255,.68)" }}
      >
        Print
      </button>
    </div>
  );
}
