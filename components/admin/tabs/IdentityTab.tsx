import type { Category } from "@/lib/types";
import { TextField, Section } from "@/components/admin/fields";
import { ColorAccentPicker } from "@/components/admin/ColorAccentPicker";
import { GradientStopsEditor } from "@/components/admin/GradientStopsEditor";

interface Props {
  category: Category;
  onPatch: (set: Record<string, unknown>) => void;
}

export function IdentityTab({ category, onPatch }: Props) {
  return (
    <div className="flex flex-col gap-6">
      <Section title="Identity">
        <div className="grid grid-cols-2 gap-4">
          <TextField label="Slug" value={category.slug} onCommit={(v) => onPatch({ slug: v.toLowerCase() })} />
          <TextField label="Switcher label (short)" value={category.short} onCommit={(v) => onPatch({ short: v })} />
          <TextField label="Full name (catName)" value={category.catName} onCommit={(v) => onPatch({ catName: v })} />
          <TextField
            label="Discipline (cover kicker)"
            value={category.discipline || ""}
            onCommit={(v) => onPatch({ discipline: v })}
            placeholder="Independent — AI Image Direction"
          />
        </div>
      </Section>

      <Section title="Colors">
        <ColorAccentPicker value={category.accent} onCommit={(v) => onPatch({ accent: v })} />
        <GradientStopsEditor
          stops={category.bgStops}
          angle={category.bgAngle}
          onCommit={(stops, angle) => onPatch({ bgStops: stops, bgAngle: angle })}
        />
      </Section>
    </div>
  );
}
