export type TaskColumn = "por_hacer" | "en_progreso" | "revision" | "hecho";
export type TaskOrigin = "manual" | "github_import";

export interface Task {
  id: string;
  title: string;
  description: string | null;
  column: TaskColumn;
  order: number;
  sprintId: string | null;
  origin: TaskOrigin;
  githubIssueNumber: number | null;
  githubIssueUrl: string | null;
}

export const TASK_COLUMNS: {
  key: TaskColumn;
  label: string;
  dot: string;
  accent?: string;
  tagColor?: string;
}[] = [
  {
    key: "por_hacer",
    label: "Por hacer",
    dot: "bg-pink-500",
    accent: "bento-magenta",
    tagColor: "text-pink-400",
  },
  {
    key: "en_progreso",
    label: "En progreso",
    dot: "bg-brand-500",
    accent: "bento-cyan",
    tagColor: "text-brand-400",
  },
  {
    key: "revision",
    label: "Revisión",
    dot: "bg-forge-gold",
    accent: "bento-gold",
    tagColor: "text-forge-gold",
  },
  {
    key: "hecho",
    label: "Hecho",
    dot: "bg-forge-mint",
    accent: "bento-mint",
    tagColor: "text-forge-mint",
  },
];

export const TASK_COLUMN_KEYS: TaskColumn[] = TASK_COLUMNS.map((c) => c.key);

// Prefijo usado para distinguir, en onDragEnd, un issue del pool de GitHub
// (todavía sin fila en `tareas`) de una tarea ya existente (id uuid).
export const GH_DRAG_PREFIX = "gh-";
