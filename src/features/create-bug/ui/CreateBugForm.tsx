"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { createBugAction } from "@/app/admin/actions/bugs";
import { PRIORITY_META, PRIORITY_OPTIONS } from "@/entities/bug/model/types";
import type { ProjectOption } from "@/server/models/bug.model";

export function CreateBugForm({
  projects,
  onClose,
}: {
  projects: ProjectOption[];
  onClose: () => void;
}) {
  const router = useRouter();
  const [pending, start] = useTransition();

  return (
    <form
      action={(fd) =>
        start(async () => {
          await createBugAction(fd);
          onClose();
          router.refresh();
        })
      }
      className="bento-cell space-y-3"
    >
      <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
        <span className="bento-tag">NUEVO REGISTRO // REPORTE DE ERROR</span>
        <button
          type="button"
          onClick={onClose}
          className="font-mono text-xs text-slate-500 hover:text-white"
        >
          ✕
        </button>
      </div>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-12">
        <div className="md:col-span-6">
          <label className="label">Título</label>
          <input
            name="title"
            required
            autoFocus
            placeholder="Qué falla"
            className="input"
          />
        </div>
        <div className="md:col-span-3">
          <label className="label">Prioridad</label>
          <select name="priority" defaultValue="media" className="input">
            {PRIORITY_OPTIONS.map((p) => (
              <option key={p} value={p}>
                {PRIORITY_META[p].label}
              </option>
            ))}
          </select>
        </div>
        <div className="md:col-span-3">
          <label className="label">Proyecto (opcional)</label>
          <select name="projectId" defaultValue="" className="input">
            <option value="">— Ninguno —</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
        <div className="md:col-span-12">
          <label className="label">Descripción (opcional)</label>
          <textarea
            name="description"
            rows={2}
            placeholder="Pasos, contexto, cómo reproducir…"
            className="input"
          />
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <button type="button" onClick={onClose} className="btn-ghost text-xs">
          Cancelar
        </button>
        <button disabled={pending} className="btn-primary text-xs">
          {pending ? "Guardando…" : "Registrar error"}
        </button>
      </div>
    </form>
  );
}
