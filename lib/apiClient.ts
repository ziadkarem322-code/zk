import type { Category, CategorySummary } from "@/lib/types";

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(body.error || `Request failed: ${res.status}`);
  }
  return res.json();
}

// Public
export const fetchCategories = () => request<CategorySummary[]>("/api/categories");
export const fetchCategory = (slug: string) => request<Category>(`/api/categories/${slug}`);

// Admin auth
export const adminLogin = (password: string) =>
  request<{ ok: true }>("/api/admin/login", { method: "POST", body: JSON.stringify({ password }) });
export const adminLogout = () => request<{ ok: true }>("/api/admin/logout", { method: "POST" });
export const adminSession = () => request<{ ok: true }>("/api/admin/session");

// Admin categories
export const adminFetchCategories = () =>
  request<(CategorySummary & { cover?: { url?: string } })[]>("/api/admin/categories");
export const adminFetchCategory = (id: string) => request<Category>(`/api/admin/categories/${id}`);
export const adminCreateCategory = (data: { slug: string; short: string; catName: string }) =>
  request<Category>("/api/admin/categories", { method: "POST", body: JSON.stringify(data) });
export const adminPatchCategory = (id: string, set: Record<string, unknown>) =>
  request<Category>(`/api/admin/categories/${id}`, { method: "PATCH", body: JSON.stringify(set) });
export const adminDeleteCategory = (id: string) =>
  request<{ ok: true }>(`/api/admin/categories/${id}`, { method: "DELETE" });
export const adminReorderCategories = (items: { id: string; order: number }[]) =>
  request<{ ok: true }>("/api/admin/categories/reorder", { method: "PATCH", body: JSON.stringify(items) });

// Projects
export const adminAddProject = (categoryId: string) =>
  request<Category>(`/api/admin/categories/${categoryId}/projects`, { method: "POST" });
export const adminDeleteProject = (categoryId: string, index: number) =>
  request<Category>(`/api/admin/categories/${categoryId}/projects/${index}`, { method: "DELETE" });

// Grid photos
export const adminAddGridPhoto = (categoryId: string) =>
  request<Category>(`/api/admin/categories/${categoryId}/grid-photos`, { method: "POST" });
export const adminDeleteGridPhoto = (categoryId: string, index: number) =>
  request<Category>(`/api/admin/categories/${categoryId}/grid-photos/${index}`, { method: "DELETE" });

// Uploads
export interface UploadSignature {
  timestamp: number;
  signature: string;
  apiKey: string;
  cloudName: string;
  folder: string;
}
export const getUploadSignature = () => request<UploadSignature>("/api/admin/uploads/sign", { method: "POST" });
export const deleteUpload = (publicId: string, resourceType: "image" | "video") =>
  request<{ ok: true }>(`/api/admin/uploads/${publicId}?resourceType=${resourceType}`, { method: "DELETE" });
