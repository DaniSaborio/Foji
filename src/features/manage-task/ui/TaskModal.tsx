"use client";

import { useState, useTransition } from "react";
import { Modal } from "@/components/modal";
import { deleteTaskAction, moveTaskToSprintAction } from "@/app/admin/proyectos/[id]/sprint-actions";
import { IssueDetailContent } from "@/features/browse-github-issues/ui/IssueDetailModal";
import type { Sprint } from "@/entities/sprint/model/types";
import type { Task } from "@/entities/task/model/types";

export function TaskModal({
  task,
  projectId,
  sprints,
  onClose,
  onDeleted,
}: {
  task: Task;
  projectId: string;
  sprints: Sprint[];
  onClose: () => void;
  onDeleted: (id: string) => void;
}) {
  const [pending, start] = useTransition();
  const [confirmDelete, setConfirmDelete] = useState(false);

  function moveToSprint(sprintId: string | null) {
    start(async () => {
      await moveTaskToSprintAction(task.id, projectId, sprintId);
      onClose();
    });
  }

  function remove() {
    start(async () => {
      await deleteTaskAction(task.id, projectId);
      onDeleted(task.id);
    });
  }

  return (
    <Modal onClose={onClose}>
      <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-3">
        <div>
          <span className="bento-tag">TAREA // DETALLE</span>
          <h3 className="mt-0.5 text-lg font-bold text-white">{task.title}</h3>
        </div>
        <button
          onClick={onClose}
          className="border border-white/15 bg-white/5 px-2 py-1 font-mono text-xs text-slate-400 hover:border-white/30 hover:text-white"
        >
          ✕
        </button>
      </div>
      {task.description && (
        <p className="mt-3 text-sm text-slate-300">{task.description}</p>
      )}
      {task.githubIssueNumber && (
        <div className="mt-4 border-t border-white/10 pt-3">
          <IssueDetailContent
            projectId={projectId}
            issueNumber={task.githubIssueNumber}
            fallbackUrl={task.githubIssueUrl}
          />
        </div>
      )}

      <div className="mt-5 border-t border-white/10 pt-4">
        <h4 className="mb-2 font-mono text-xs font-semibold uppercase tracking-wider text-slate-300">
          Mover a
        </h4>
        <div className="flex flex-wrap gap-2">
          <button
            disabled={pending || task.sprintId === null}
            onClick={() => moveToSprint(null)}
            className="badge border border-white/15 bg-white/5 px-3 py-1 text-slate-300 hover:border-brand-500/50 hover:text-white disabled:opacity-40"
          >
            Backlog
          </button>
          {sprints.map((s) => (
            <button
              key={s.id}
              disabled={pending || task.sprintId === s.id}
              onClick={() => moveToSprint(s.id)}
              className="badge border border-white/15 bg-white/5 px-3 py-1 text-slate-300 hover:border-brand-500/50 hover:text-white disabled:opacity-40"
            >
              {s.name}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 border-t border-white/10 pt-4">
        {!confirmDelete ? (
          <button
            onClick={() => setConfirmDelete(true)}
            className="font-mono text-xs font-semibold uppercase tracking-wider text-pink-500/80 hover:text-pink-400"
          >
            Eliminar tarea
          </button>
        ) : (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-400">¿Eliminar «{task.title}»?</span>
            <button
              disabled={pending}
              onClick={remove}
              className="rounded-none border border-pink-400 bg-pink-500/90 px-2.5 py-1 font-mono text-xs font-semibold uppercase text-white hover:bg-pink-500 disabled:opacity-50"
            >
              {pending ? "Eliminando…" : "Sí, eliminar"}
            </button>
            <button
              onClick={() => setConfirmDelete(false)}
              className="font-mono text-xs uppercase text-slate-500 hover:text-slate-300"
            >
              Cancelar
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
}
