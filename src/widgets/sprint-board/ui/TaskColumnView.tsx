"use client";

import { useState } from "react";
import { CreateTaskForm } from "@/features/create-task/ui/CreateTaskForm";
import { DraggableTask } from "./DraggableTask";
import type { Task, TaskColumn } from "@/entities/task/model/types";
import type { GithubIssueLite } from "@/lib/github-oauth";

export function TaskColumnView({
  column,
  index,
  tasks,
  projectId,
  sprintId,
  hasRepo,
  activeId,
  onOpen,
  onViewIssue,
  onDragStart,
  onDragEnd,
  onDropItem,
}: {
  column: {
    key: TaskColumn;
    label: string;
    dot: string;
    accent?: string;
    tagColor?: string;
  };
  index?: number;
  tasks: Task[];
  projectId: string;
  sprintId: string | null;
  hasRepo: boolean;
  activeId?: string | null;
  onOpen: (t: Task) => void;
  onViewIssue: (t: Task) => void;
  onDragStart?: (id: string) => void;
  onDragEnd?: () => void;
  onDropItem?: (column: TaskColumn, id: string, issue?: GithubIssueLite) => void;
}) {
  const [isOver, setIsOver] = useState(false);

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
        if (!isOver) setIsOver(true);
      }}
      onDragLeave={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
          setIsOver(false);
        }
      }}
      onDrop={(e) => {
        e.preventDefault();
        setIsOver(false);
        const id = e.dataTransfer.getData("text/plain") || activeId;
        const rawIssue = e.dataTransfer.getData("application/x-foji-issue");
        let parsedIssue: GithubIssueLite | undefined;
        if (rawIssue) {
          try {
            parsedIssue = JSON.parse(rawIssue) as GithubIssueLite;
          } catch {
            parsedIssue = undefined;
          }
        }
        if (id) onDropItem?.(column.key, id, parsedIssue);
      }}
      className={`flex flex-col rounded-none border transition ${
        column.accent ?? ""
      } ${
        isOver
          ? "border-brand-500/80 bg-brand-500/15 shadow-neon"
          : "border-violet-500/25 bg-ink-950/70"
      }`}
    >
      <div className="flex items-center justify-between border-b border-violet-500/20 bg-ink-950/85 px-3 py-2">
        <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white">
          <span className={`h-2 w-2 rounded-none ${column.dot}`} />
          {index !== undefined && (
            <span
              className={`font-mono text-[10px] font-bold ${
                column.tagColor ?? "text-brand-400"
              }`}
            >
              [{String(index).padStart(2, "0")}]
            </span>
          )}
          {column.label}
        </h4>
        <span className="rounded-none border border-violet-500/30 bg-violet-500/10 px-2 py-0.5 font-mono text-xs font-bold text-slate-200">
          {tasks.length}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-3">
        {column.key === "por_hacer" && (
          <CreateTaskForm projectId={projectId} sprintId={sprintId} hasRepo={hasRepo} />
        )}
        {tasks.map((t) => (
          <DraggableTask
            key={t.id}
            task={t}
            isDragging={activeId === t.id}
            onOpen={onOpen}
            onViewIssue={onViewIssue}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
          />
        ))}
        {tasks.length === 0 && column.key !== "por_hacer" && (
          <p className="flex-1 rounded-none border border-dashed border-white/10 px-3 py-6 text-center font-mono text-[11px] uppercase tracking-widest text-slate-600">
            Vacío
          </p>
        )}
      </div>
    </div>
  );
}
