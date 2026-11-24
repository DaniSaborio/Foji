"use client";

import { useState } from "react";
import { createSprintAction } from "@/app/admin/proyectos/[id]/sprint-actions";
import type { Sprint } from "@/entities/sprint/model/types";

const STATUS_DOT: Record<Sprint["status"], string> = {
  planificado: "bg-forge-gold",
  activo: "bg-forge-mint",
  cerrado: "bg-violet-500",
};

export function SprintTabs({
  projectId,
  sprints,
  selected,
  onSelect,
}: {
  projectId: string;
  sprints: Sprint[];
  selected: string | null;
  onSelect: (id: string | null) => void;
}) {
  const [creating, setCreating] = useState(false);

  return (
    <div className="mb-4 flex flex-wrap items-center gap-1.5 border-b border-white/10 pb-3">
      <button
        onClick={() => onSelect(null)}
        className={`rounded-none border px-3 py-1.5 font-mono text-xs font-semibold uppercase tracking-wider transition ${
          selected === null
            ? "border-brand-500/60 bg-brand-500/15 text-brand-300"
            : "border-white/10 bg-ink-950/60 text-slate-400 hover:border-white/25 hover:text-white"
        }`}
      >
        Backlog
      </button>
      {sprints.map((s) => (
        <button
          key={s.id}
          onClick={() => onSelect(s.id)}
          className={`inline-flex items-center gap-1.5 rounded-none border px-3 py-1.5 font-mono text-xs font-semibold uppercase tracking-wider transition ${
            selected === s.id
              ? "border-brand-500/60 bg-brand-500/15 text-brand-300"
              : "border-white/10 bg-ink-950/60 text-slate-400 hover:border-white/25 hover:text-white"
          }`}
        >
          <span className={`h-2 w-2 rounded-none ${STATUS_DOT[s.status]}`} />
          {s.name}
        </button>
      ))}

      {!creating ? (
        <button
          onClick={() => setCreating(true)}
          className="ml-auto border border-dashed border-brand-500/40 bg-brand-500/5 px-3 py-1.5 font-mono text-xs font-semibold uppercase tracking-wider text-brand-300 transition hover:border-brand-400"
        >
          + Nuevo sprint
        </button>
      ) : (
        <form
          action={async (fd) => {
            const name = String(fd.get("name") ?? "");
            await createSprintAction(projectId, name);
            setCreating(false);
          }}
          className="ml-auto flex items-center gap-2"
        >
          <input
            name="name"
            placeholder="Nombre del sprint"
            required
            autoFocus
            className="input py-1 text-sm"
          />
          <button className="btn-primary px-3 py-1 text-xs">Crear</button>
          <button
            type="button"
            onClick={() => setCreating(false)}
            className="btn-ghost px-3 py-1 text-xs"
          >
            Cancelar
          </button>
        </form>
      )}
    </div>
  );
}
