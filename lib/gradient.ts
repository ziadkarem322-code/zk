import type { BgStop } from "@/lib/types";

export function buildGradientCss(stops: BgStop[], angle: number): string {
  const stopsCss = stops
    .slice()
    .sort((a, b) => a.position - b.position)
    .map((s) => `${s.color} ${s.position}%`)
    .join(", ");
  return `linear-gradient(${angle}deg, ${stopsCss})`;
}
