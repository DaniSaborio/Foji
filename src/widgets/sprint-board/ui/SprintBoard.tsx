"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  importIssueAsTaskAction,
  listAvailableGithubIssuesAction,
  moveTaskAction,
} from "@/app/admin/proyectos/[id]/sprint-actions";
import { GithubIssuesPool } from "@/features/browse-github-issues/ui/GithubIssuesPool";
import { IssueDetailModal } from "@/features/browse-github-issues/ui/IssueDetailModal";
import { SprintHeader } from "@/features/manage-sprint/ui/SprintHeader";
import { SprintTabs } from "@/features/manage-sprint/ui/SprintTabs";
import { TaskModal } from "@/features/manage-task/ui/TaskModal";
import { GH_DRAG_PREFIX, TASK_COLUMNS } from "@/entities/task/model/types";
import { TaskColumnView } from "./TaskColumnView";
import type { Sprint } from "@/entities/sprint/model/types";
import type { Task, TaskColumn } from "@/entities/task/model/types";
import type { GithubIssueLite } from "@/lib/github-oauth";

export function SprintBoard({
  proyectoId: projectId,
  tieneRepo: hasRepo,
  sprints,
  tareas: tasksProp,
}: {
  proyectoId: string;
  tieneRepo: boolean;
  sprints: Sprint[];
  tareas: Task[];
}) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [tasks, setTasks] = useState(tasksProp);
  useEffect(() => setTasks(tasksProp), [tasksProp]);

  const activeSprint = sprints.find((s) => s.status === "activo") ?? null;
  const [selectedSprintId, setSelectedSprintId] = useState<string | null>(
    activeSprint?.id ?? null,
  );
  const [activeId, setActiveId] = useState<string | null>(null);
  const [openTask, setOpenTask] = useState<Task | null>(null);
  const [viewIssueTask, setViewIssueTask] = useState<Task | null>(null);

  const [issues, setIssues] = useState<GithubIssueLite[] | null>(null);
  const [issuesLoading, setIssuesLoading] = useState(false);
  const [issuesError, setIssuesError] = useState<string | null>(null);

  function reloadIssues() {
    setIssuesError(null);
    setIssuesLoading(true);
    startTransition(async () => {
      const res = await listAvailableGithubIssuesAction(projectId);
      setIssuesLoading(false);
      if (res.ok) setIssues(res.issues ?? []);
      else setIssuesError(res.error ?? "Error al cargar issues");
    });
  }

  async function handleDropItem(
    overColumn: TaskColumn,
    id: string,
    droppedIssue?: GithubIssueLite,
  ) {
    setActiveId(null);

    if (id.startsWith(GH_DRAG_PREFIX)) {
      const issue =
        droppedIssue ??
        issues?.find((i) => `${GH_DRAG_PREFIX}${i.number}` === id);
      if (!issue) return;
      setIssues((prev) => prev?.filter((i) => i.number !== issue.number) ?? prev);
      await importIssueAsTaskAction(projectId, selectedSprintId, overColumn, {
        number: issue.number,
        title: issue.title,
        url: issue.html_url,
      });
      router.refresh();
      return;
    }

    const task = tasks.find((t) => t.id === id);
    if (!task || (task.column === overColumn && task.sprintId === selectedSprintId)) return;
    const order = tasks.filter(
      (t) => t.sprintId === selectedSprintId && t.column === overColumn,
    ).length;
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, column: overColumn, order } : t)),
    );
    await moveTaskAction(id, projectId, overColumn, order);
  }

  const sprintTasks = tasks.filter((t) => t.sprintId === selectedSprintId);
  const currentSprint = sprints.find((s) => s.id === selectedSprintId) ?? null;

  return (
    <section className="bento-cell">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
        <div>
          <span className="bento-tag">WORKSPACE // EJECUCIÓN DE TAREAS</span>
          <h2 className="mt-0.5 text-base font-bold uppercase tracking-wider text-white">
            Tablero de trabajo
          </h2>
        </div>
        <p className="font-mono text-xs text-slate-400">
          Sprints, backlog y tareas — arrastra issues de GitHub directo al tablero.
        </p>
      </div>

      <SprintTabs
        projectId={projectId}
        sprints={sprints}
        selected={selectedSprintId}
        onSelect={setSelectedSprintId}
      />

      {currentSprint && (
        <SprintHeader
          sprint={currentSprint}
          projectId={projectId}
          onDeleted={() => setSelectedSprintId(null)}
        />
      )}

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-12">
        <div
          className={`grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4 ${
            hasRepo ? "lg:col-span-9" : "lg:col-span-12"
          }`}
        >
          {TASK_COLUMNS.map((col, idx) => (
            <TaskColumnView
              key={col.key}
              index={idx + 1}
              column={col}
              tasks={sprintTasks.filter((t) => t.column === col.key)}
              projectId={projectId}
              sprintId={selectedSprintId}
              hasRepo={hasRepo}
              activeId={activeId}
              onOpen={setOpenTask}
              onViewIssue={setViewIssueTask}
              onDragStart={setActiveId}
              onDragEnd={() => setActiveId(null)}
              onDropItem={handleDropItem}
            />
          ))}
        </div>

        {hasRepo && (
          <div className="lg:col-span-3">
            <GithubIssuesPool
              projectId={projectId}
              issues={issues}
              loading={issuesLoading}
              error={issuesError}
              activeId={activeId}
              onReload={reloadIssues}
              onDragStart={setActiveId}
              onDragEnd={() => setActiveId(null)}
            />
          </div>
        )}
      </div>

      {openTask && (
        <TaskModal
          task={tasks.find((t) => t.id === openTask.id) ?? openTask}
          projectId={projectId}
          sprints={sprints}
          onClose={() => setOpenTask(null)}
          onDeleted={() => setOpenTask(null)}
        />
      )}

      {viewIssueTask?.githubIssueNumber && (
        <IssueDetailModal
          projectId={projectId}
          issueNumber={viewIssueTask.githubIssueNumber}
          title={viewIssueTask.title}
          fallbackUrl={viewIssueTask.githubIssueUrl}
          onClose={() => setViewIssueTask(null)}
        />
      )}
    </section>
  );
}
