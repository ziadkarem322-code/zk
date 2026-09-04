"use client";

import { useParams } from "next/navigation";
import { CategoryEditor } from "@/components/admin/CategoryEditor";

export default function CategoryEditPage() {
  const params = useParams<{ id: string }>();
  return <CategoryEditor id={params.id} />;
}
