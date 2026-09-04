"use client";

import { useState } from "react";
import { resolveBackgroundStyle } from "@/lib/imageStyle";
import { openUploadWidget } from "@/lib/cloudinaryWidget";
import type { Photo } from "@/lib/types";
import { SliderField } from "./fields";

interface PhotoFieldProps {
  label: string;
  photo: Photo;
  path: string; // dot-path prefix, e.g. "cover" or "projects.0.hero" or "gridPhotos.2.photo"
  resourceType?: "image" | "video" | "auto";
  onPatch: (set: Record<string, unknown>) => void;
}

export function PhotoField({ label, photo, path, resourceType = "image", onPatch }: PhotoFieldProps) {
  const [uploading, setUploading] = useState(false);
  const hasPhoto = Boolean(photo.url);

  function upload() {
    setUploading(true);
    openUploadWidget(
      (result) => {
        onPatch({
          [`${path}.publicId`]: result.publicId,
          [`${path}.url`]: result.url,
          [`${path}.resourceType`]: result.resourceType,
        });
        setUploading(false);
      },
      { resourceType }
    );
  }

  return (
    <div className="flex flex-col gap-3 border border-neutral-800 rounded-lg p-4">
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-wide text-neutral-400">{label}</span>
        <button
          type="button"
          onClick={upload}
          disabled={uploading}
          className="text-xs rounded bg-neutral-100 text-neutral-900 px-3 py-1.5 font-medium disabled:opacity-50"
        >
          {uploading ? "Opening…" : hasPhoto ? "Replace" : "Upload"}
        </button>
      </div>

      <div
        className="aspect-[9/16] w-full max-w-40 border border-neutral-700"
        style={resolveBackgroundStyle(photo)}
      />

      {hasPhoto && (
        <div className="flex flex-col gap-3">
          <div className="flex gap-2">
            {(["cover", "contain"] as const).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => onPatch({ [`${path}.fit`]: f })}
                className={`text-xs px-3 py-1 rounded border ${
                  photo.fit === f ? "border-white bg-white text-neutral-900" : "border-neutral-700 text-neutral-300"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          <SliderField
            label="Zoom"
            value={photo.zoom}
            min={100}
            max={260}
            step={5}
            unit="%"
            onCommit={(v) => onPatch({ [`${path}.zoom`]: v })}
          />
          <SliderField
            label="Width (0 = auto)"
            value={photo.width}
            min={0}
            max={400}
            step={5}
            unit="%"
            onCommit={(v) => onPatch({ [`${path}.width`]: v })}
          />
          <SliderField
            label="Height (0 = auto)"
            value={photo.height}
            min={0}
            max={400}
            step={5}
            unit="%"
            onCommit={(v) => onPatch({ [`${path}.height`]: v })}
          />
          <SliderField
            label="Position X"
            value={photo.x}
            min={0}
            max={100}
            unit="%"
            onCommit={(v) => onPatch({ [`${path}.x`]: v })}
          />
          <SliderField
            label="Position Y"
            value={photo.y}
            min={0}
            max={100}
            unit="%"
            onCommit={(v) => onPatch({ [`${path}.y`]: v })}
          />
        </div>
      )}
    </div>
  );
}
