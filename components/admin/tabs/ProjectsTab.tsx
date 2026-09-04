"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Category } from "@/lib/types";
import { TextField, TextAreaField, ListEditor, Section } from "@/components/admin/fields";
import { PhotoField } from "@/components/admin/PhotoField";
import { adminAddProject, adminDeleteProject } from "@/lib/apiClient";

interface Props {
  category: Category;
  categoryId: string;
  onPatch: (set: Record<string, unknown>) => void;
}

export function ProjectsTab({ category, categoryId, onPatch }: Props) {
  const queryClient = useQueryClient();

  const addMutation = useMutation({
    mutationFn: () => adminAddProject(categoryId),
    onSuccess: (updated) => queryClient.setQueryData(["admin-category", categoryId], updated),
  });
  const removeMutation = useMutation({
    mutationFn: (index: number) => adminDeleteProject(categoryId, index),
    onSuccess: (updated) => queryClient.setQueryData(["admin-category", categoryId], updated),
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <p className="text-xs text-neutral-500">Up to 3 case studies, each rendered as its own slide.</p>
        <button
          onClick={() => addMutation.mutate()}
          disabled={category.projects.length >= 3 || addMutation.isPending}
          className="text-xs rounded bg-neutral-100 text-neutral-900 px-3 py-1.5 font-medium disabled:opacity-50"
        >
          + Add project
        </button>
      </div>

      {category.projects.map((project, i) => (
        <Section key={i} title={project.title || `Project ${i + 1}`}>
          <div className="flex justify-end">
            <button onClick={() => removeMutation.mutate(i)} className="text-xs text-red-400 hover:text-red-300">
              Remove project
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <TextField label="Label" value={project.label} onCommit={(v) => onPatch({ [`projects.${i}.label`]: v })} />
            <TextField label="Kicker" value={project.kicker} onCommit={(v) => onPatch({ [`projects.${i}.kicker`]: v })} />
            <TextField label="Year" value={project.year} onCommit={(v) => onPatch({ [`projects.${i}.year`]: v })} />
            <TextField label="Title" value={project.title} onCommit={(v) => onPatch({ [`projects.${i}.title`]: v })} />
          </div>
          <TextAreaField label="Case study description" value={project.desc} onCommit={(v) => onPatch({ [`projects.${i}.desc`]: v })} />

          <PhotoField label="Hero" photo={project.hero} path={`projects.${i}.hero`} onPatch={onPatch} />

          <div className="grid grid-cols-2 gap-4">
            {project.frames.map((frame, j) => (
              <div key={j} className="flex flex-col gap-2">
                <TextField
                  label={`Frame ${j + 1} caption`}
                  value={frame.caption}
                  onCommit={(v) => onPatch({ [`projects.${i}.frames.${j}.caption`]: v })}
                />
                <PhotoField label={`Frame ${j + 1}`} photo={frame.photo} path={`projects.${i}.frames.${j}.photo`} onPatch={onPatch} />
              </div>
            ))}
          </div>

          <ListEditor
            label="Delivered (3)"
            values={project.delivered}
            onCommitIndex={(j, v) => onPatch({ [`projects.${i}.delivered.${j}`]: v })}
          />
          <TextAreaField label="Speaker notes (admin only)" value={project.notes} onCommit={(v) => onPatch({ [`projects.${i}.notes`]: v })} />
        </Section>
      ))}
    </div>
  );
}
