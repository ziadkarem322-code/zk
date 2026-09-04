"use client";

import { useEffect, useState } from "react";

const inputClass =
  "w-full rounded border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-neutral-100 focus:border-neutral-400 focus:outline-none";
const labelClass = "block text-xs uppercase tracking-wide text-neutral-400 mb-1";

interface FieldProps {
  label: string;
  value: string;
  onCommit: (value: string) => void;
  placeholder?: string;
}

export function TextField({ label, value, onCommit, placeholder }: FieldProps) {
  const [local, setLocal] = useState(value);
  useEffect(() => setLocal(value), [value]);
  return (
    <label className="block">
      <span className={labelClass}>{label}</span>
      <input
        className={inputClass}
        value={local}
        placeholder={placeholder}
        onChange={(e) => setLocal(e.target.value)}
        onBlur={() => local !== value && onCommit(local)}
      />
    </label>
  );
}

export function TextAreaField({ label, value, onCommit, placeholder }: FieldProps) {
  const [local, setLocal] = useState(value);
  useEffect(() => setLocal(value), [value]);
  return (
    <label className="block">
      <span className={labelClass}>{label}</span>
      <textarea
        className={`${inputClass} min-h-24`}
        value={local}
        placeholder={placeholder}
        onChange={(e) => setLocal(e.target.value)}
        onBlur={() => local !== value && onCommit(local)}
      />
    </label>
  );
}

interface NumberFieldProps {
  label: string;
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onCommit: (value: number) => void;
}

export function NumberField({ label, value, min, max, step, onCommit }: NumberFieldProps) {
  const [local, setLocal] = useState(String(value));
  useEffect(() => setLocal(String(value)), [value]);
  return (
    <label className="block">
      <span className={labelClass}>{label}</span>
      <input
        type="number"
        className={inputClass}
        value={local}
        min={min}
        max={max}
        step={step}
        onChange={(e) => setLocal(e.target.value)}
        onBlur={() => {
          const n = Number(local);
          if (!Number.isNaN(n) && n !== value) onCommit(n);
        }}
      />
    </label>
  );
}

interface SliderFieldProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onCommit: (value: number) => void;
}

/** Live-updates locally while dragging; only PATCHes on release, to avoid per-pixel network calls. */
export function SliderField({ label, value, min, max, step = 1, unit = "", onCommit }: SliderFieldProps) {
  const [local, setLocal] = useState(value);
  useEffect(() => setLocal(value), [value]);
  return (
    <label className="block">
      <span className={labelClass}>
        {label} — {local}
        {unit}
      </span>
      <input
        type="range"
        className="w-full accent-white"
        min={min}
        max={max}
        step={step}
        value={local}
        onChange={(e) => setLocal(Number(e.target.value))}
        onMouseUp={() => local !== value && onCommit(local)}
        onTouchEnd={() => local !== value && onCommit(local)}
        onKeyUp={() => local !== value && onCommit(local)}
      />
    </label>
  );
}

interface ListEditorProps {
  label: string;
  values: string[];
  onCommitIndex: (index: number, value: string) => void;
}

/** Fixed-length string array (services[4], clients[8], delivered[3], ...). */
export function ListEditor({ label, values, onCommitIndex }: ListEditorProps) {
  return (
    <div>
      <span className={labelClass}>{label}</span>
      <div className="flex flex-col gap-2">
        {values.map((v, i) => (
          <input
            key={i}
            className={inputClass}
            defaultValue={v}
            onBlur={(e) => e.target.value !== v && onCommitIndex(i, e.target.value)}
          />
        ))}
      </div>
    </div>
  );
}

export function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border border-neutral-800 rounded-lg p-5 flex flex-col gap-4">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-neutral-300">{title}</h3>
      {children}
    </div>
  );
}
