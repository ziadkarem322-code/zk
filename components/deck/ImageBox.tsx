import type { CSSProperties, ReactNode } from "react";
import { resolveBackgroundStyle } from "@/lib/imageStyle";
import type { Photo } from "@/lib/types";

interface ImageBoxProps {
  photo?: Photo | null;
  padding?: number;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

/** The standard 9:16 reel treatment: border, box-sizing, bottom-up scrim, caption slot. */
export function ImageBox({ photo, padding = 16, className = "", style, children }: ImageBoxProps) {
  return (
    <div
      className={`box-border border border-[rgba(245,244,242,.16)] flex items-end min-h-0 ${className}`}
      style={{ padding, ...resolveBackgroundStyle(photo), ...style }}
    >
      {children}
    </div>
  );
}
