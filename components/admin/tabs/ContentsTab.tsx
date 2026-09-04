import type { Category } from "@/lib/types";
import { TextField, Section } from "@/components/admin/fields";

interface Props {
  category: Category;
  onPatch: (set: Record<string, unknown>) => void;
}

export function ContentsTab({ category, onPatch }: Props) {
  return (
    <Section title="Contents (5 numbered sections)">
      <div className="grid grid-cols-2 gap-4">
        {category.contents.map((item, i) => (
          <div key={i} className="flex gap-2">
            <div className="w-16">
              <TextField label="No." value={item.n} onCommit={(v) => onPatch({ [`contents.${i}.n`]: v })} />
            </div>
            <div className="flex-1">
              <TextField label="Title" value={item.t} onCommit={(v) => onPatch({ [`contents.${i}.t`]: v })} />
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
