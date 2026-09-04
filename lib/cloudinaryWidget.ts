"use client";

import { getUploadSignature } from "@/lib/apiClient";

const WIDGET_SRC = "https://upload-widget.cloudinary.com/global/all.js";

interface CloudinaryWidgetInfo {
  public_id: string;
  secure_url: string;
  resource_type: string;
}

interface CloudinaryWidgetResult {
  event: string;
  info: CloudinaryWidgetInfo;
}

interface CloudinaryWidget {
  open: () => void;
}

interface CloudinaryGlobal {
  createUploadWidget: (
    options: Record<string, unknown>,
    callback: (error: unknown, result: CloudinaryWidgetResult | undefined) => void
  ) => CloudinaryWidget;
}

declare global {
  interface Window {
    cloudinary?: CloudinaryGlobal;
  }
}

let loadPromise: Promise<void> | null = null;

function loadWidgetScript(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.cloudinary) return Promise.resolve();
  if (loadPromise) return loadPromise;

  loadPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = WIDGET_SRC;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Cloudinary widget"));
    document.body.appendChild(script);
  });
  return loadPromise;
}

export interface UploadResult {
  publicId: string;
  url: string;
  resourceType: "image" | "video";
}

/** Opens Cloudinary's signed Upload Widget (crop step included) for photos or videos. */
export async function openUploadWidget(
  onSuccess: (result: UploadResult) => void,
  options?: { resourceType?: "image" | "video" | "auto" }
) {
  await loadWidgetScript();
  const sig = await getUploadSignature();

  if (!window.cloudinary) return;

  const widget = window.cloudinary.createUploadWidget(
    {
      cloudName: sig.cloudName,
      apiKey: sig.apiKey,
      uploadSignatureTimestamp: sig.timestamp,
      uploadSignature: sig.signature,
      folder: sig.folder,
      resourceType: options?.resourceType ?? "auto",
      cropping: true,
      multiple: false,
      sources: ["local", "url", "camera"],
    },
    (error, result) => {
      if (error || !result) return;
      if (result.event === "success") {
        onSuccess({
          publicId: result.info.public_id,
          url: result.info.secure_url,
          resourceType: result.info.resource_type === "video" ? "video" : "image",
        });
      }
    }
  );

  widget.open();
}
