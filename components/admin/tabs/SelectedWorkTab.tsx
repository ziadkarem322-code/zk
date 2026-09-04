"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Category } from "@/lib/types";
import { TextField, TextAreaField, Section } from "@/components/admin/fields";
import { PhotoField } from "@/components/admin/PhotoField";
import { adminAddGridPhoto, adminDeleteGridPhoto } from "@/lib/apiClient";

interface Props {
  category: Category;
  categoryId: string;
  onPatch: (set: Record<string, unknown>) => void;
}

export function SelectedWorkTab({ category, categoryId, onPatch }: Props) {
  const queryClient = useQueryClient();

  const addMutation = useMutation({
    mutationFn: () => adminAddGridPhoto(categoryId),
    onSuccess: (updated) => queryClient.setQueryData(["admin-category", categoryId], updated),
  });
  const removeMutation = useMutation({
    mutationFn: (index: number) => adminDeleteGridPhoto(categoryId, index),
    onSuccess: (updated) => queryClient.setQueryData(["admin-category", categoryId], updated),
  });

  function move(index: number, dir: -1 | 1) {
    const target = index + dir;
    if (target < 0 || target >= category.gridPhotos.length) return;
    const a = category.gridPhotos[index];
    const b = category.gridPhotos[target];
    onPatch({ [`gridPhotos.${index}`]: b, [`gridPhotos.${target}`]: a });
  }

  return (
    <div className="flex flex-col gap-6">
      <Section title="Selected Work">
        <TextAreaField label="Section note" value={category.gridNote} onCommit={(v) => onPatch({ gridNote: v })} />
      </Section>

      <div className="flex items-center justify-between">
        <p className="text-xs text-neutral-500">
          Only the first 3 photos below render on the public slide — reorder with ▲/▼ to change which 3 show.
        </p>
        <button
          onClick={() => addMutation.mutate()}
          disabled={category.gridPhotos.length >= 8 || addMutation.isPending}
          className="text-xs rounded bg-neutral-100 text-neutral-900 px-3 py-1.5 font-medium disabled:opacity-50 shrink-0"
        >
          + Add photo
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {category.gridPhotos.map((item, i) => (
          <div key={i} className="flex flex-col gap-3 border border-neutral-800 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-neutral-400">
                #{i + 1} {i < 3 ? "(rendered)" : "(reserve)"}
              </span>
              <div className="flex items-center gap-3">
                <button onClick={() => move(i, -1)} disabled={i === 0} className="text-xs text-neutral-400 hover:text-neutral-100 disabled:opacity-30">
                  ▲
                </button>
                <button
                  onClick={() => move(i, 1)}
                  disabled={i === category.gridPhotos.length - 1}
                  className="text-xs text-neutral-400 hover:text-neutral-100 disabled:opacity-30"
                >
                  ▼
                </button>
                <button onClick={() => removeMutation.mutate(i)} className="text-xs text-red-400 hover:text-red-300">
                  Remove
                </button>
              </div>
            </div>
            <TextField label="Caption" value={item.caption} onCommit={(v) => onPatch({ [`gridPhotos.${i}.caption`]: v })} />
            <PhotoField label="Photo" photo={item.photo} path={`gridPhotos.${i}.photo`} onPatch={onPatch} />
          </div>
        ))}
      </div>
    </div>
  );
}
