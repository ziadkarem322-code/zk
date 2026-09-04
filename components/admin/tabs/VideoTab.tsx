import type { Category } from "@/lib/types";
import { TextField, TextAreaField, ListEditor, Section } from "@/components/admin/fields";
import { PhotoField } from "@/components/admin/PhotoField";

interface Props {
  category: Category;
  onPatch: (set: Record<string, unknown>) => void;
}

export function VideoTab({ category, onPatch }: Props) {
  const specs = category.videoSpecs && category.videoSpecs.length === 4 ? category.videoSpecs : ["", "", "", ""];

  return (
    <div className="flex flex-col gap-6">
      <Section title="Video copy">
        <div className="grid grid-cols-2 gap-4">
          <TextField label="Kicker" value={category.videoKicker || ""} onCommit={(v) => onPatch({ videoKicker: v })} />
          <TextField label="Title" value={category.videoTitle || ""} onCommit={(v) => onPatch({ videoTitle: v })} />
        </div>
        <TextAreaField label="Description" value={category.videoDesc || ""} onCommit={(v) => onPatch({ videoDesc: v })} />
        <ListEditor label="Delivery specs (4)" values={specs} onCommitIndex={(i, v) => onPatch({ [`videoSpecs.${i}`]: v })} />
      </Section>

      <Section title="Assets">
        <div className="grid grid-cols-2 gap-4">
          <PhotoField label="Poster" photo={category.videoPoster || { resourceType: "image", fit: "cover", zoom: 100, width: 0, height: 0, x: 50, y: 50 }} path="videoPoster" onPatch={onPatch} />
          <PhotoField
            label="Video asset"
            photo={category.videoAsset || { resourceType: "video", fit: "cover", zoom: 100, width: 100, height: 0, x: 43, y: 23 }}
            path="videoAsset"
            resourceType="video"
            onPatch={onPatch}
          />
        </div>
      </Section>
    </div>
  );
}
