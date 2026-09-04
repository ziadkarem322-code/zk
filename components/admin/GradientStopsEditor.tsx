"use client";

import { useEffect, useState } from "react";
import { buildGradientCss } from "@/lib/gradient";
import type { BgStop } from "@/lib/types";

interface Props {
  stops: BgStop[];
  angle: number;
  onCommit: (stops: BgStop[], angle: number) => void;
}

export function GradientStopsEditor({ stops, angle, onCommit }: Props) {
  const [local, setLocal] = useState(stops);
  const [localAngle, setLocalAngle] = useState(angle);
  useEffect(() => setLocal(stops), [stops]);
  useEffect(() => setLocalAngle(angle), [angle]);

  function updateStop(i: number, patch: Partial<BgStop>) {
    const next = local.map((s, idx) => (idx === i ? { ...s, ...patch } : s));
    setLocal(next);
  }

  function commit() {
    onCommit(local, localAngle);
  }

  return (
    <div className="flex flex-col gap-3">
      <span className="block text-xs uppercase tracking-wide text-neutral-400">Background gradient (3 stops, oklch)</span>
      <div className="h-12 rounded border border-neutral-700" style={{ background: buildGradientCss(local, localAngle) }} />
      {local.map((stop, i) => (
        <div key={i} className="flex gap-2 items-center">
          <input
            className="flex-1 rounded border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm font-mono text-neutral-100"
            value={stop.color}
            onChange={(e) => updateStop(i, { color: e.target.value })}
            onBlur={commit}
          />
          <input
            type="number"
            min={0}
            max={100}
            className="w-20 rounded border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-neutral-100"
            value={stop.position}
            onChange={(e) => updateStop(i, { position: Number(e.target.value) })}
            onBlur={commit}
          />
          <span className="text-xs text-neutral-500">%</span>
        </div>
      ))}
      <label className="block">
        <span className="block text-xs uppercase tracking-wide text-neutral-400 mb-1">Angle</span>
        <input
          type="number"
          className="w-24 rounded border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-neutral-100"
          value={localAngle}
          onChange={(e) => setLocalAngle(Number(e.target.value))}
          onBlur={commit}
        />
      </label>
    </div>
  );
}
