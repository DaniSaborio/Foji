"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { setProjectActiveAction } from "@/app/admin/actions/proyectos";

export function ActiveToggle({
  projectId,
  active,
}: {
  projectId: string;
  active: boolean;
}) {
  const router = useRouter();
  const [on, setOn] = useState(active);
  const [pending, start] = useTransition();

  function toggle() {
    const next = !on;
    setOn(next);
    start(async () => {
      await setProjectActiveAction(projectId, next);
      router.refresh();
    });
  }

  return (
    <button
      onClick={toggle}
      disabled={pending}
      className={`inline-flex w-full items-center justify-between rounded-none border px-3 py-2 font-mono text-xs font-semibold uppercase tracking-wider transition ${
        on
          ? "border-brand-500/50 bg-brand-500/15 text-brand-300"
          : "border-white/15 bg-white/5 text-slate-500"
      }`}
    >
      <span>{on ? "Link público activo" : "Link público desactivado"}</span>
      <span
        className={`h-2.5 w-2.5 rounded-none ${
          on ? "bg-brand-500 shadow-neon" : "bg-slate-600"
        }`}
      />
    </button>
  );
}
