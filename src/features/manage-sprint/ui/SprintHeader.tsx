"use client";

import { useState, useTransition } from "react";
import { closeSprintAction, deleteSprintAction, startSprintAction } from "@/app/admin/proyectos/[id]/sprint-actions";
import type { Sprint } from "@/entities/sprint/model/types";

const STATUS_BADGE: Record<Sprint["status"], string> = {
  planificado: "border-forge-gold/40 bg-forge-gold/10 text-forge-gold",
  activo: "border-forge-mint/40 bg-forge-mint/10 text-forge-mint",
  cerrado: "border-violet-500/30 bg-violet-500/10 text-violet-300",
};

export function SprintHeader({
  sprint,
  projectId,
  onDeleted,
}: {
  sprint: Sprint;
  projectId: string;
  onDeleted: () => void;
}) {
  const [pending, start] = useTransition();
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border border-white/10 bg-ink-950/60 px-3.5 py-2.5">
      <div className="flex items-center gap-2">
        <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-white">
          {sprint.name}
        </h3>
        <span className={`badge border ${STATUS_BADGE[sprint.status]}`}>
          {sprint.status}
        </span>
      </div>
      <div className="flex items-center gap-2">
        {sprint.status === "planificado" && (
          <button
            disabled={pending}
            onClick={() => start(() => startSprintAction(sprint.id, projectId))}
            className="btn-ghost py-1 text-xs"
          >
            Iniciar sprint
          </button>
        )}
        {sprint.status === "activo" && (
          <button
            disabled={pending}
            onClick={() => start(() => closeSprintAction(sprint.id, projectId))}
            className="btn-ghost py-1 text-xs"
          >
            Cerrar sprint
          </button>
        )}
        {!confirmDelete ? (
          <button
            onClick={() => setConfirmDelete(true)}
            className="font-mono text-xs font-semibold uppercase tracking-wider text-pink-500/80 hover:text-pink-400"
          >
            Eliminar
          </button>
        ) : (
          <span className="flex items-center gap-1.5 font-mono text-xs">
            <span className="text-slate-400">¿Seguro?</span>
            <button
              disabled={pending}
              onClick={() =>
                start(async () => {
                  await deleteSprintAction(sprint.id, projectId);
                  onDeleted();
                })
              }
              className="font-semibold uppercase text-pink-400 hover:text-pink-300"
            >
              Sí
            </button>
            <button
              onClick={() => setConfirmDelete(false)}
              className="uppercase text-slate-500 hover:text-slate-300"
            >
              No
            </button>
          </span>
        )}
      </div>
    </div>
  );
}
