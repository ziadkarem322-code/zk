import type { CSSProperties, ReactNode } from "react";

interface SlideShellProps {
  padding: string;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}

/** Every slide: full-bleed, the category's bg gradient, #f5f4f2 text, overflow hidden. */
export function SlideShell({ padding, className = "", style, children }: SlideShellProps) {
  return (
    <section
      className={`absolute inset-0 box-border overflow-hidden bg-[var(--bg)] text-[#f5f4f2] ${className}`}
      style={{ padding, ...style }}
    >
      {children}
    </section>
  );
}
