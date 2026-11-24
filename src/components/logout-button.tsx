"use client";

import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();
  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/login");
    router.refresh();
  }
  return (
    <button
      onClick={logout}
      className="rounded-none border border-white/15 bg-white/5 px-3 py-1.5 font-mono text-xs font-semibold uppercase tracking-wider text-slate-300 transition hover:border-pink-500/50 hover:bg-pink-500/10 hover:text-pink-300"
    >
      Salir
    </button>
  );
}
