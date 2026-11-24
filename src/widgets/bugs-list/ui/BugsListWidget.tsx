"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteBugAction, updateBugAction } from "@/app/admin/actions/bugs";
import { CreateBugForm } from "@/features/create-bug/ui/CreateBugForm";
import { BugRow } from "@/features/manage-bug/ui/BugRow";
import { STATUS_META, PRIORITY_META } from "@/entities/bug/model/types";
import type { Bug, Status, Priority } from "@/entities/bug/model/types";
import type { ProjectOption } from "@/server/models/bug.model";

export function BugsListWidget({
  bugs,
  projects,
}: {
  bugs: Bug[];
  projects: ProjectOption[];
}) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [open, setOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<"todos" | Status>("todos");
  const [priorityFilter, setPriorityFilter] = useState<"todas" | Priority>("todas");

  const openCount = bugs.filter((b) => b.status !== "resuelto").length;
  const highPriorityOpen = bugs.filter(
    (b) => b.priority === "alta" && b.status !== "resuelto",
  ).length;

  const visible = useMemo(() => {
    return bugs
      .filter((b) => (statusFilter === "todos" ? true : b.status === statusFilter))
      .filter((b) => (priorityFilter === "todas" ? true : b.priority === priorityFilter))
      .sort((a, b) => {
        // Resueltos al fondo; luego por prioridad; luego más recientes.
        const statusRank = STATUS_META[a.status].rank - STATUS_META[b.status].rank;
        if (statusRank !== 0) return statusRank;
        const priorityRank = PRIORITY_META[a.priority].rank - PRIORITY_META[b.priority].rank;
        if (priorityRank !== 0) return priorityRank;
        return b.createdAt.localeCompare(a.createdAt);
      });
  }, [bugs, statusFilter, priorityFilter]);

  function update(id: string, data: { status?: Status; priority?: Priority }) {
    start(async () => {
      await updateBugAction(id, data);
      router.refresh();
    });
  }

  function remove(id: string) {
    start(async () => {
      await deleteBugAction(id);
      router.refresh();
    });
  }

  return (
    <div className="space-y-3">
      {/* Cabecera Bento de Errores */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-6 lg:grid-cols-12">
        <section className="bento-cell bento-crucible flex flex-wrap items-center justify-between gap-3 md:col-span-6 lg:col-span-5">
          <div>
            <span className="bento-tag text-forge-orange">
              BENTO // 03 · CONTROL DE CALIDAD
            </span>
            <h1 className="mt-0.5 text-2xl font-black uppercase tracking-tight text-white">
              Errores
            </h1>
            <p className="mt-0.5 text-xs text-slate-300">
              {openCount} sin resolver · prioriza y ataca por orden.
            </p>
          </div>
          <button onClick={() => setOpen((v) => !v)} className="btn-crucible text-xs">
            {open ? "Cerrar" : "+ Nuevo error"}
          </button>
        </section>

        <section className="bento-cell bento-magenta flex flex-col justify-between md:col-span-2 lg:col-span-2">
          <span className="bento-tag text-pink-400">CRÍTICOS</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="font-mono text-3xl font-black text-gradient">
              {highPriorityOpen}
            </span>
            <span className="font-mono text-[10px] uppercase text-pink-300/80">
              Prioridad alta
            </span>
          </div>
        </section>

        <section className="bento-cell bento-cyan flex flex-col justify-between md:col-span-2 lg:col-span-2">
          <span className="bento-tag text-brand-400">ABIERTOS</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="font-mono text-3xl font-black text-crucible">
              {openCount}
            </span>
            <span className="font-mono text-[10px] uppercase text-brand-300/80">
              Activos
            </span>
          </div>
        </section>

        <section className="bento-cell bento-violet flex flex-col justify-between md:col-span-2 lg:col-span-3">
          <span className="bento-tag text-violet-400">FILTROS // TRIAGE</span>
          <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
            <Filter
              label="Estado"
              value={statusFilter}
              onChange={(v) => setStatusFilter(v as typeof statusFilter)}
              options={[
                ["todos", "Todos"],
                ["abierto", "Abierto"],
                ["en_progreso", "En progreso"],
                ["resuelto", "Resuelto"],
              ]}
            />
            <Filter
              label="Prioridad"
              value={priorityFilter}
              onChange={(v) => setPriorityFilter(v as typeof priorityFilter)}
              options={[
                ["todas", "Todas"],
                ["alta", "Alta"],
                ["media", "Media"],
                ["baja", "Baja"],
              ]}
            />
          </div>
        </section>
      </div>

      {open && (
        <CreateBugForm
          projects={projects}
          onClose={() => {
            setOpen(false);
          }}
        />
      )}

      {/* Bento Grid de Errores */}
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        {visible.length === 0 && (
          <div className="bento-cell py-12 text-center lg:col-span-2">
            <p className="font-mono text-xs uppercase tracking-widest text-slate-500">
              Sin errores. Registra el primero con “+ Nuevo error”.
            </p>
          </div>
        )}
        {visible.map((b) => (
          <BugRow
            key={b.id}
            bug={b}
            pending={pending}
            onUpdate={update}
            onRemove={remove}
          />
        ))}
      </div>
    </div>
  );
}

function Filter({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: [string, string][];
}) {
  return (
    <label className="block">
      <span className="mb-1 block font-mono text-[10px] uppercase tracking-wider text-slate-500">
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="input !py-1 text-xs"
      >
        {options.map(([v, l]) => (
          <option key={v} value={v}>
            {l}
          </option>
        ))}
      </select>
    </label>
  );
}
