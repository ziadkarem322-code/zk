import type { Category } from "@/lib/types";
import { TextAreaField, TextField, ListEditor, Section } from "@/components/admin/fields";

interface Props {
  category: Category;
  onPatch: (set: Record<string, unknown>) => void;
}

export function BioStatsTab({ category, onPatch }: Props) {
  return (
    <div className="flex flex-col gap-6">
      <Section title="Bio">
        <TextAreaField label="Bio (~55 words)" value={category.bio} onCommit={(v) => onPatch({ bio: v })} />
      </Section>

      <Section title="Services & kit">
        <div className="grid grid-cols-2 gap-4">
          <ListEditor
            label="Services (4)"
            values={category.services}
            onCommitIndex={(i, v) => onPatch({ [`services.${i}`]: v })}
          />
          <ListEditor label="Kit & workflow (4)" values={category.kit} onCommitIndex={(i, v) => onPatch({ [`kit.${i}`]: v })} />
        </div>
      </Section>

      <Section title="Stats (4)">
        <div className="grid grid-cols-2 gap-4">
          {category.stats.map((stat, i) => (
            <div key={i} className="flex gap-2">
              <TextField label="Value" value={stat.v} onCommit={(v) => onPatch({ [`stats.${i}.v`]: v })} />
              <TextField label="Key" value={stat.k} onCommit={(v) => onPatch({ [`stats.${i}.k`]: v })} />
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}
