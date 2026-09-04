"use client";

import { useEffect, useState } from "react";
import type { Category } from "@/lib/types";
import { TextField, Section } from "@/components/admin/fields";

interface Props {
  category: Category;
  onPatch: (set: Record<string, unknown>) => void;
}

function ItemsField({ items, onCommit }: { items: string[]; onCommit: (items: string[]) => void }) {
  const joined = items.join("\n");
  const [local, setLocal] = useState(joined);
  useEffect(() => setLocal(joined), [joined]);
  return (
    <label className="block">
      <span className="block text-xs uppercase tracking-wide text-neutral-400 mb-1">Items (one per line)</span>
      <textarea
        className="w-full min-h-28 rounded border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-neutral-100"
        value={local}
        onChange={(e) => setLocal(e.target.value)}
        onBlur={() => {
          const next = local.split("\n").map((s) => s.trim()).filter(Boolean);
          if (next.join("\n") !== joined) onCommit(next);
        }}
      />
    </label>
  );
}

export function PackagesTab({ category, onPatch }: Props) {
  return (
    <div className="flex flex-col gap-6">
      <Section title="Packages header">
        <div className="grid grid-cols-2 gap-4">
          <TextField label="Title" value={category.packagesTitle} onCommit={(v) => onPatch({ packagesTitle: v })} />
          <TextField label="Note" value={category.packagesNote} onCommit={(v) => onPatch({ packagesNote: v })} />
        </div>
      </Section>

      <div className="grid grid-cols-3 gap-4">
        {category.packages.map((pkg, i) => (
          <Section key={i} title={`Tier ${i + 1}${i === 1 ? " (featured)" : ""}`}>
            <TextField label="Tier" value={pkg.tier} onCommit={(v) => onPatch({ [`packages.${i}.tier`]: v })} />
            <TextField label="Price" value={pkg.price} onCommit={(v) => onPatch({ [`packages.${i}.price`]: v })} />
            <TextField label="Unit" value={pkg.unit} onCommit={(v) => onPatch({ [`packages.${i}.unit`]: v })} />
            <ItemsField items={pkg.items} onCommit={(items) => onPatch({ [`packages.${i}.items`]: items })} />
          </Section>
        ))}
      </div>
    </div>
  );
}
