"use client";

import { useRouter } from "next/navigation";
import { adminLogout } from "@/lib/apiClient";

export function LogoutButton() {
  const router = useRouter();
  return (
    <button
      onClick={async () => {
        await adminLogout();
        router.push("/admin/login");
        router.refresh();
      }}
      className="text-xs text-neutral-400 hover:text-neutral-100"
    >
      Log out
    </button>
  );
}
