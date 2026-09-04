"use client";

import { useEffect, useState } from "react";

const PRESETS = [
  { name: "Warm red", value: "oklch(0.74 0.16 32)" },
  { name: "Amber", value: "oklch(0.80 0.11 85)" },
  { name: "Warm gold", value: "oklch(0.82 0.10 88)" },
  { name: "Magenta", value: "oklch(0.74 0.13 330)" },
  { name: "Coral", value: "oklch(0.80 0.09 20)" },
];

export function ColorAccentPicker({ value, onCommit }: { value: string; onCommit: (v: string) => void }) {
  const [local, setLocal] = useState(value);
  useEffect(() => setLocal(value), [value]);

  return (
    <div className="flex flex-col gap-3">
      <span className="block text-xs uppercase tracking-wide text-neutral-400">Accent colour (oklch)</span>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full border border-neutral-700 shrink-0" style={{ background: local }} />
        <input
          className="flex-1 rounded border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-neutral-100 font-mono"
          value={local}
          onChange={(e) => setLocal(e.target.value)}
          onBlur={() => local !== value && onCommit(local)}
        />
      </div>
      <div className="flex flex-wrap gap-2">
        {PRESETS.map((p) => (
          <button
            key={p.value}
            type="button"
            title={p.name}
            onClick={() => {
              setLocal(p.value);
              onCommit(p.value);
            }}
            className="w-7 h-7 rounded-full border border-neutral-700"
            style={{ background: p.value }}
          />
        ))}
        <button
          type="button"
          onClick={() => {
            const hue = Math.round(Math.random() * 360);
            const v = `oklch(0.78 0.12 ${hue})`;
            setLocal(v);
            onCommit(v);
          }}
          className="text-xs px-3 py-1 rounded border border-neutral-700 text-neutral-300"
        >
          Random hue
        </button>
      </div>
    </div>
  );
}
