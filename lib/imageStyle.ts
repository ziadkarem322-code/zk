import type { CSSProperties } from "react";
import type { Photo } from "@/lib/types";

const EMPTY_PATTERN =
  "repeating-linear-gradient(135deg, rgba(245,244,242,.07) 0 10px, rgba(245,244,242,0) 10px 20px)";

const SCRIM = "linear-gradient(to top, rgba(0,0,0,.45), rgba(0,0,0,0) 45%)";
const COVER_SCRIM = "linear-gradient(to right, rgba(0,0,0,.55), rgba(0,0,0,0) 40%), linear-gradient(to top, rgba(0,0,0,.5), rgba(0,0,0,0) 40%)";

/**
 * Ported 1:1 from the prototype's sizing/position resolution
 * (Photography Portfolio.dc.html:540-554). Resolution order: explicit
 * width/height override zoom; zoom overrides the fit keyword.
 */
function resolveFocusSizing(photo: Photo) {
  const { fit, zoom, width, height, x, y } = photo;
  const focus = `${x}% ${y}%`;
  let sizing: string;
  if (width || height) {
    sizing = `${width ? `${width}%` : "auto"} ${height ? `${height}%` : "auto"}`;
  } else if (zoom !== 100) {
    sizing = `${zoom}% auto`;
  } else {
    sizing = fit;
  }
  return { focus, sizing };
}

/** Standard reel treatment: bottom-up scrim + image. Used by every 9:16 photo box. */
export function resolveBackgroundStyle(photo?: Photo | null): CSSProperties {
  if (!photo?.url) return { background: EMPTY_PATTERN };
  const { focus, sizing } = resolveFocusSizing(photo);
  return { background: `${SCRIM}, url('${photo.url}') ${focus}/${sizing} no-repeat` };
}

/** Cover slide's full-bleed image: two-way scrim (right + top) for left-side text readability. */
export function resolveCoverBackground(photo?: Photo | null): CSSProperties {
  if (!photo?.url) return { background: EMPTY_PATTERN };
  const { focus, sizing } = resolveFocusSizing(photo);
  return { background: `${COVER_SCRIM}, url('${photo.url}') ${focus}/${sizing} no-repeat` };
}

/** Video poster box: plain image, no scrim (native controls sit on top instead). */
export function resolveVideoPosterBackground(photo?: Photo | null): CSSProperties {
  if (!photo?.url) return { background: EMPTY_PATTERN };
  const { focus, sizing } = resolveFocusSizing(photo);
  return { background: `url('${photo.url}') ${focus}/${sizing} no-repeat` };
}
