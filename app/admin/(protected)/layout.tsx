import { redirect } from "next/navigation";
import Link from "next/link";
import { isAdminRequest } from "@/lib/auth";
import { LogoutButton } from "@/components/admin/LogoutButton";

export default async function AdminProtectedLayout({ children }: { children: React.ReactNode }) {
  const ok = await isAdminRequest();
  if (!ok) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <header className="flex items-center justify-between border-b border-neutral-800 px-6 py-4">
        <Link href="/admin" className="font-semibold">
          zk — admin
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/" target="_blank" className="text-xs text-neutral-400 hover:text-neutral-100">
            View live ↗
          </Link>
          <LogoutButton />
        </div>
      </header>
      <main className="p-6">{children}</main>
    </div>
  );
}
