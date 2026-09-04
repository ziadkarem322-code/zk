"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminFetchSiteSettings, adminPatchSiteSettings } from "@/lib/apiClient";
import { TextField, Section } from "./fields";

export function SiteSettingsCard() {
  const queryClient = useQueryClient();
  const { data: settings } = useQuery({ queryKey: ["admin-site-settings"], queryFn: adminFetchSiteSettings });

  const patchMutation = useMutation({
    mutationFn: (set: Record<string, unknown>) => adminPatchSiteSettings(set),
    onSuccess: (updated) => queryClient.setQueryData(["admin-site-settings"], updated),
  });

  if (!settings) return null;

  return (
    <Section title="Site — cover wordmark & name (shown on every category's Cover slide)">
      <div className="grid grid-cols-3 gap-4">
        <TextField
          label="Photographer name"
          value={settings.photographerName}
          onCommit={(v) => patchMutation.mutate({ photographerName: v })}
        />
        <TextField
          label="Wordmark — part 1"
          value={settings.wordmarkStart}
          onCommit={(v) => patchMutation.mutate({ wordmarkStart: v })}
        />
        <TextField
          label="Wordmark — part 2 (accent-coloured)"
          value={settings.wordmarkEnd}
          onCommit={(v) => patchMutation.mutate({ wordmarkEnd: v })}
        />
      </div>
    </Section>
  );
}
