import type { Category } from "@/lib/types";
import { TextField, TextAreaField, Section } from "@/components/admin/fields";
import { PhotoField } from "@/components/admin/PhotoField";

interface Props {
  category: Category;
  onPatch: (set: Record<string, unknown>) => void;
}

export function CoverIntroTab({ category, onPatch }: Props) {
  return (
    <div className="flex flex-col gap-6">
      <Section title="Cover">
        <div className="grid grid-cols-2 gap-4">
          <TextAreaField label="Tagline" value={category.tagline} onCommit={(v) => onPatch({ tagline: v })} />
          <TextField label="Cover caption (coverSlot)" value={category.coverSlot} onCommit={(v) => onPatch({ coverSlot: v })} />
        </div>
        <PhotoField label="Cover image" photo={category.cover} path="cover" onPatch={onPatch} />
      </Section>

      <Section title="Introduction reels">
        <div className="grid grid-cols-2 gap-4">
          <PhotoField label="Intro (left reel)" photo={category.intro} path="intro" onPatch={onPatch} />
          <PhotoField label="Intro wide (right reel)" photo={category.introWide} path="introWide" onPatch={onPatch} />
        </div>
      </Section>
    </div>
  );
}
