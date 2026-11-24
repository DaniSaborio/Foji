"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createStageAction, deleteStageAction } from "@/app/admin/actions/stages";
import type { Stage } from "@/entities/stage/model/types";

export function StagesManager({ stages }: { stages: Stage[] }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");

  function add() {
    const trimmed = name.trim();
    if (!trimmed) return;
    start(async () => {
      await createStageAction(trimmed, stages.length);
      setName("");
      router.refresh();
    });
  }

  function remove(id: string) {
    start(async () => {
      await deleteStageAction(id);
      router.refresh();
    });
  }

  return (
    <div className="mt-3 border-t border-white/10 pt-3">
      <button
        onClick={() => setOpen((v) => !v)}
        className="font-mono text-xs uppercase tracking-wider text-slate-500 hover:text-slate-300"
      >
        {open ? "Ocultar gestor de etapas" : "Gestionar etapas ›"}
      </button>

      {open && (
        <div className="mt-3 space-y-2">
          <p className="text-xs text-slate-500">
            Las etapas son compartidas por todos los proyectos (p.ej. Diseño,
            Desarrollo, QA, Entregado, En garantía).
          </p>

          {stages.length > 0 ? (
            <ul className="space-y-1">
              {stages.map((s) => (
                <li
                  key={s.id}
                  className="flex items-center justify-between rounded-none border border-white/15 bg-ink-950/90 px-3 py-1.5 text-xs text-slate-200"
                >
                  <span>{s.name}</span>
                  <button
                    onClick={() => remove(s.id)}
                    disabled={pending}
                    className="font-mono text-slate-600 hover:text-pink-400"
                    title="Eliminar etapa"
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="font-mono text-xs text-slate-600">Aún no hay etapas.</p>
          )}

          <div className="flex gap-2">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  add();
                }
              }}
              placeholder="Nueva etapa"
              className="input flex-1 text-xs"
            />
            <button
              onClick={add}
              disabled={pending || !name.trim()}
              className="btn-primary text-xs"
            >
              Añadir
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
