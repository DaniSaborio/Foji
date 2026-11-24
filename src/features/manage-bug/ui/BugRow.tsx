import Link from "next/link";
import { formatDate } from "@/shared/lib/date";
import {
  PRIORITY_META,
  PRIORITY_OPTIONS,
  STATUS_META,
  STATUS_OPTIONS,
} from "@/entities/bug/model/types";
import type { Bug, Priority, Status } from "@/entities/bug/model/types";

export function BugRow({
  bug,
  pending,
  onUpdate,
  onRemove,
}: {
  bug: Bug;
  pending: boolean;
  onUpdate: (id: string, data: { status?: Status; priority?: Priority }) => void;
  onRemove: (id: string) => void;
}) {
  return (
    <div
      className={`bento-cell flex flex-col justify-between gap-4 ${
        bug.status === "resuelto" ? "opacity-60" : ""
      }`}
    >
      <div>
        <div className="flex items-start justify-between gap-2 border-b border-white/10 pb-2.5">
          <div className="flex items-center gap-2">
            <span
              className={`badge h-fit shrink-0 border ${PRIORITY_META[bug.priority].cls}`}
            >
              {PRIORITY_META[bug.priority].label}
            </span>
            <span className="font-mono text-[11px] uppercase tracking-wider text-slate-500">
              {STATUS_META[bug.status].label}
            </span>
          </div>
          <button
            onClick={() => onRemove(bug.id)}
            disabled={pending}
            className="border border-white/10 bg-white/5 px-2 py-0.5 font-mono text-xs text-slate-500 transition hover:border-pink-500/40 hover:text-pink-400"
            aria-label="Eliminar"
            title="Eliminar"
          >
            ✕
          </button>
        </div>

        <p
          className={`mt-3 text-sm font-bold text-white ${
            bug.status === "resuelto" ? "line-through" : ""
          }`}
        >
          {bug.title}
        </p>
        {bug.description && (
          <p className="mt-1 text-xs leading-relaxed text-slate-400">
            {bug.description}
          </p>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-white/10 pt-3">
        <div className="flex flex-wrap items-center gap-2 font-mono text-xs text-slate-500">
          {bug.projectId ? (
            <Link
              href={`/admin/proyectos/${bug.projectId}`}
              className="rounded-none border border-brand-500/30 bg-brand-500/10 px-2 py-0.5 text-brand-300 hover:underline"
            >
              {bug.projectName ?? "Proyecto"}
            </Link>
          ) : (
            <span className="rounded-none border border-white/10 bg-white/5 px-2 py-0.5">
              Sin proyecto
            </span>
          )}
          <span>{formatDate(bug.createdAt)}</span>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <select
            value={bug.priority}
            onChange={(e) =>
              onUpdate(bug.id, { priority: e.target.value as Priority })
            }
            disabled={pending}
            className="input !w-auto !py-1 text-xs"
            aria-label="Prioridad"
          >
            {PRIORITY_OPTIONS.map((p) => (
              <option key={p} value={p}>
                {PRIORITY_META[p].label}
              </option>
            ))}
          </select>
          <select
            value={bug.status}
            onChange={(e) =>
              onUpdate(bug.id, { status: e.target.value as Status })
            }
            disabled={pending}
            className="input !w-auto !py-1 text-xs"
            aria-label="Estado"
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {STATUS_META[s].label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
