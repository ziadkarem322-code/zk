"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminFetchCategory, adminPatchCategory } from "@/lib/apiClient";
import { IdentityTab } from "./tabs/IdentityTab";
import { CoverIntroTab } from "./tabs/CoverIntroTab";
import { BioStatsTab } from "./tabs/BioStatsTab";
import { ContentsTab } from "./tabs/ContentsTab";
import { SelectedWorkTab } from "./tabs/SelectedWorkTab";
import { VideoTab } from "./tabs/VideoTab";
import { PackagesTab } from "./tabs/PackagesTab";
import { ClientsQuoteTab } from "./tabs/ClientsQuoteTab";
import { ContactTab } from "./tabs/ContactTab";
import { ProjectsTab } from "./tabs/ProjectsTab";

const TABS = [
  "Identity & Colors",
  "Cover & Intro",
  "Bio & Stats",
  "Contents",
  "Selected Work",
  "Video",
  "Packages",
  "Clients & Quote",
  "Contact",
  "Projects",
] as const;

export function CategoryEditor({ id }: { id: string }) {
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<(typeof TABS)[number]>(TABS[0]);
  const [savedAt, setSavedAt] = useState<number | null>(null);

  const { data: category, isLoading } = useQuery({
    queryKey: ["admin-category", id],
    queryFn: () => adminFetchCategory(id),
  });

  const patchMutation = useMutation({
    mutationFn: (set: Record<string, unknown>) => adminPatchCategory(id, set),
    onSuccess: (updated) => {
      queryClient.setQueryData(["admin-category", id], updated);
      queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
      setSavedAt(Date.now());
    },
  });

  function onPatch(set: Record<string, unknown>) {
    patchMutation.mutate(set);
  }

  if (isLoading || !category) return <p className="text-neutral-400">Loading…</p>;

  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">{category.catName}</h1>
        <span className="text-xs text-neutral-500">
          {patchMutation.isPending ? "Saving…" : savedAt ? "Saved" : ""}
        </span>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-neutral-800 pb-3">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`text-xs px-3 py-1.5 rounded-full ${
              tab === t ? "bg-neutral-100 text-neutral-900" : "text-neutral-400 hover:text-neutral-100"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "Identity & Colors" && <IdentityTab category={category} onPatch={onPatch} />}
      {tab === "Cover & Intro" && <CoverIntroTab category={category} onPatch={onPatch} />}
      {tab === "Bio & Stats" && <BioStatsTab category={category} onPatch={onPatch} />}
      {tab === "Contents" && <ContentsTab category={category} onPatch={onPatch} />}
      {tab === "Selected Work" && <SelectedWorkTab category={category} categoryId={id} onPatch={onPatch} />}
      {tab === "Video" && <VideoTab category={category} onPatch={onPatch} />}
      {tab === "Packages" && <PackagesTab category={category} onPatch={onPatch} />}
      {tab === "Clients & Quote" && <ClientsQuoteTab category={category} onPatch={onPatch} />}
      {tab === "Contact" && <ContactTab category={category} onPatch={onPatch} />}
      {tab === "Projects" && <ProjectsTab category={category} categoryId={id} onPatch={onPatch} />}
    </div>
  );
}
