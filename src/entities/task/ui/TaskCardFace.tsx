import type { Task } from "../model/types";

export function TaskCardFace({
  task,
  dragging,
  onViewIssue,
}: {
  task: Task;
  dragging?: boolean;
  onViewIssue?: (task: Task) => void;
}) {
  return (
    <div
      className={`rounded-none border border-white/15 bg-ink-900/90 p-3 transition hover:border-brand-500/50 hover:shadow-neon ${
        dragging ? "border-brand-500 shadow-neon" : ""
      }`}
    >
      <p className="text-sm font-bold text-white">{task.title}</p>
      {task.description && (
        <p className="mt-1 line-clamp-2 text-xs text-slate-400">{task.description}</p>
      )}
      {task.githubIssueNumber && (
        <div className="mt-2.5 flex items-center justify-between border-t border-white/10 pt-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onViewIssue?.(task);
            }}
            className="font-mono text-xs font-medium text-brand-400 hover:underline"
          >
            Ver detalle · #{task.githubIssueNumber}
          </button>
          <a
            href={task.githubIssueUrl ?? "#"}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
            title="Abrir en GitHub"
            className="font-mono text-xs text-slate-500 hover:text-slate-300"
          >
            ↗
          </a>
        </div>
      )}
    </div>
  );
}
