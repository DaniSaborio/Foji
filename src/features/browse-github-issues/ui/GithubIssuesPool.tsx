"use client";

import { useState } from "react";
import { IssueDetailModal } from "./IssueDetailModal";
import { GH_DRAG_PREFIX } from "@/entities/task/model/types";
import type { GithubIssueLite } from "@/lib/github-oauth";

function DraggableIssue({
  issue,
  isDragging = false,
  onViewDetail,
  onDragStart,
  onDragEnd,
}: {
  issue: GithubIssueLite;
  isDragging?: boolean;
  onViewDetail: (n: number) => void;
  onDragStart?: (id: string) => void;
  onDragEnd?: () => void;
}) {
  const dragId = `${GH_DRAG_PREFIX}${issue.number}`;
  return (
    <div
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData("text/plain", dragId);
        e.dataTransfer.setData("application/x-foji-issue", JSON.stringify(issue));
        e.dataTransfer.effectAllowed = "copyMove";
        onDragStart?.(dragId);
      }}
      onDragEnd={() => onDragEnd?.()}
      className={`cursor-grab rounded-none border border-white/15 bg-ink-900/90 p-2.5 transition hover:border-brand-500/50 active:cursor-grabbing ${
        isDragging ? "opacity-40" : ""
      }`}
    >
      <p className="text-sm font-semibold text-white">{issue.title}</p>
      <div className="mt-1.5 flex items-center justify-between border-t border-white/10 pt-1.5">
        <p className="font-mono text-xs text-slate-500">#{issue.number}</p>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onViewDetail(issue.number);
          }}
          className="font-mono text-xs font-medium text-brand-400 hover:underline"
        >
          Ver detalle
        </button>
      </div>
    </div>
  );
}

export function GithubIssuesPool({
  projectId,
  issues,
  loading,
  error,
  activeId,
  onReload,
  onDragStart,
  onDragEnd,
}: {
  projectId: string;
  issues: GithubIssueLite[] | null;
  loading: boolean;
  error: string | null;
  activeId?: string | null;
  onReload: () => void;
  onDragStart?: (id: string) => void;
  onDragEnd?: () => void;
}) {
  const [detailNumber, setDetailNumber] = useState<number | null>(null);
  const issueDetail = issues?.find((i) => i.number === detailNumber) ?? null;

  return (
    <div className="flex h-full flex-col rounded-none border border-white/15 bg-ink-950/60">
      <div className="flex items-center justify-between border-b border-white/15 bg-ink-950/80 px-3 py-2">
        <h4 className="text-xs font-bold uppercase tracking-wider text-white">
          Issues de GitHub
        </h4>
        <button onClick={onReload} disabled={loading} className="btn-ghost px-2 py-1 text-[11px]">
          {loading ? "Cargando…" : issues ? "Actualizar" : "Cargar"}
        </button>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-3">
        <p className="font-mono text-[11px] text-slate-500">
          Arrastra un issue al tablero para convertirlo en tarea.
        </p>
        {error && <p className="font-mono text-xs text-pink-400">{error}</p>}
        <div className="flex flex-col gap-2">
          {issues?.length === 0 && (
            <p className="font-mono text-xs text-slate-500">
              No hay issues abiertos disponibles.
            </p>
          )}
          {issues?.map((i) => (
            <DraggableIssue
              key={i.number}
              issue={i}
              isDragging={activeId === `${GH_DRAG_PREFIX}${i.number}`}
              onViewDetail={setDetailNumber}
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
            />
          ))}
        </div>
      </div>

      {issueDetail && (
        <IssueDetailModal
          projectId={projectId}
          issueNumber={issueDetail.number}
          title={issueDetail.title}
          fallbackUrl={issueDetail.html_url}
          onClose={() => setDetailNumber(null)}
        />
      )}
    </div>
  );
}
