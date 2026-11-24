"use client";

import { useState } from "react";
import { createProjectAction } from "@/app/admin/actions/proyectos";

export function CreateIdeaForm() {
  const [open, setOpen] = useState(false);
  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="rounded-none border border-dashed border-white/20 bg-ink-950/40 px-3 py-2 font-mono text-xs font-semibold uppercase tracking-wider text-slate-400 transition hover:border-brand-500/60 hover:text-brand-300"
      >
        + Nueva idea
      </button>
    );
  }
  return (
    <form
      action={async (fd) => {
        await createProjectAction(fd);
        setOpen(false);
      }}
      className="rounded-none border border-white/15 bg-ink-950 p-3"
    >
      <input name="name" placeholder="Título" required autoFocus className="input" />
      <textarea
        name="description"
        placeholder="Descripción (opcional)"
        rows={2}
        className="input mt-2"
      />
      <div className="mt-2 flex gap-2">
        <button className="btn-primary flex-1">Crear</button>
        <button type="button" onClick={() => setOpen(false)} className="btn-ghost">
          Cancelar
        </button>
      </div>
    </form>
  );
}
