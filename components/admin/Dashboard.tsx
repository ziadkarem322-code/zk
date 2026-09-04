"use client";

import { useState } from "react";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  adminCreateCategory,
  adminDeleteCategory,
  adminFetchCategories,
  adminReorderCategories,
} from "@/lib/apiClient";
import { AdminSkeleton } from "./AdminSkeleton";

export function Dashboard() {
  const queryClient = useQueryClient();
  const { data: categories, isLoading } = useQuery({
    queryKey: ["admin-categories"],
    queryFn: adminFetchCategories,
  });

  const [slug, setSlug] = useState("");
  const [short, setShort] = useState("");
  const [catName, setCatName] = useState("");
  const [error, setError] = useState<string | null>(null);

  const createMutation = useMutation({
    mutationFn: adminCreateCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
      setSlug("");
      setShort("");
      setCatName("");
      setError(null);
    },
    onError: (err: Error) => setError(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: adminDeleteCategory,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-categories"] }),
  });

  const reorderMutation = useMutation({
    mutationFn: adminReorderCategories,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-categories"] }),
  });

  function move(index: number, dir: -1 | 1) {
    if (!categories) return;
    const target = index + dir;
    if (target < 0 || target >= categories.length) return;
    const next = [...categories];
    [next[index], next[target]] = [next[target], next[index]];
    reorderMutation.mutate(next.map((c, i) => ({ id: c._id, order: i })));
  }

  if (isLoading) return <AdminSkeleton />;

  return (
    <div className="flex flex-col gap-8 max-w-3xl">
      <div className="flex flex-col gap-4">
        {categories?.map((cat, i) => (
          <div
            key={cat._id}
            className="flex items-center gap-4 border border-neutral-800 rounded-lg p-4"
          >
            <div
              className="w-16 h-16 shrink-0 rounded bg-neutral-800 bg-cover bg-center border border-neutral-700"
              style={cat.cover?.url ? { backgroundImage: `url('${cat.cover.url}')` } : undefined}
            />
            <div className="flex-1">
              <div className="font-medium">{cat.catName}</div>
              <div className="text-xs text-neutral-400">
                {cat.short} · /{cat.slug}
              </div>
            </div>
            <span className="w-4 h-4 rounded-full border border-neutral-700" style={{ background: cat.accent }} />
            <div className="flex flex-col">
              <button onClick={() => move(i, -1)} className="text-neutral-400 hover:text-neutral-100 text-xs">
                ▲
              </button>
              <button onClick={() => move(i, 1)} className="text-neutral-400 hover:text-neutral-100 text-xs">
                ▼
              </button>
            </div>
            <Link
              href={`/admin/categories/${cat._id}`}
              className="text-xs rounded bg-neutral-100 text-neutral-900 px-3 py-1.5 font-medium"
            >
              Edit
            </Link>
            <Link
              href={`/?category=${cat.slug}`}
              target="_blank"
              className="text-xs text-neutral-400 hover:text-neutral-100"
            >
              View
            </Link>
            <button
              onClick={() => {
                if (confirm(`Delete "${cat.catName}"? This cannot be undone.`)) {
                  deleteMutation.mutate(cat._id);
                }
              }}
              className="text-xs text-red-400 hover:text-red-300"
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          createMutation.mutate({ slug, short, catName });
        }}
        className="flex flex-col gap-3 border border-neutral-800 rounded-lg p-5"
      >
        <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-300">New category</h2>
        <div className="grid grid-cols-3 gap-3">
          <input
            placeholder="slug (e.g. travel)"
            value={slug}
            onChange={(e) => setSlug(e.target.value.toLowerCase())}
            className="rounded border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-neutral-100"
          />
          <input
            placeholder="Short label (e.g. Travel)"
            value={short}
            onChange={(e) => setShort(e.target.value)}
            className="rounded border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-neutral-100"
          />
          <input
            placeholder="Full name (e.g. Travel & Landscape)"
            value={catName}
            onChange={(e) => setCatName(e.target.value)}
            className="rounded border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-neutral-100"
          />
        </div>
        {error && <p className="text-sm text-red-400">{error}</p>}
        <button
          type="submit"
          disabled={createMutation.isPending}
          className="self-start rounded bg-neutral-100 text-neutral-900 px-4 py-2 text-sm font-medium disabled:opacity-50"
        >
          {createMutation.isPending ? "Creating…" : "Create category"}
        </button>
      </form>
    </div>
  );
}
