import type { Category } from "@/lib/types";
import { TextField, TextAreaField, Section } from "@/components/admin/fields";

interface Props {
  category: Category;
  onPatch: (set: Record<string, unknown>) => void;
}

export function ContactTab({ category, onPatch }: Props) {
  return (
    <div className="flex flex-col gap-6">
      <Section title="Availability">
        <TextAreaField label="Availability" value={category.availability} onCommit={(v) => onPatch({ availability: v })} />
      </Section>

      <Section title="Contact details (4)">
        <div className="grid grid-cols-2 gap-4">
          {category.contact.map((item, i) => (
            <div key={i} className="flex gap-2">
              <TextField label="Key" value={item.k} onCommit={(v) => onPatch({ [`contact.${i}.k`]: v })} />
              <TextField label="Value" value={item.v} onCommit={(v) => onPatch({ [`contact.${i}.v`]: v })} />
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}
