"use client";

import { TaskCardFace } from "@/entities/task/ui/TaskCardFace";
import type { Task } from "@/entities/task/model/types";

export function DraggableTask({
  task,
  isDragging = false,
  onOpen,
  onViewIssue,
  onDragStart,
  onDragEnd,
}: {
  task: Task;
  isDragging?: boolean;
  onOpen: (t: Task) => void;
  onViewIssue: (t: Task) => void;
  onDragStart?: (id: string) => void;
  onDragEnd?: () => void;
}) {
  return (
    <div
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData("text/plain", task.id);
        e.dataTransfer.effectAllowed = "move";
        onDragStart?.(task.id);
      }}
      onDragEnd={() => onDragEnd?.()}
      onClick={() => onOpen(task)}
      className={`cursor-grab active:cursor-grabbing ${isDragging ? "opacity-40" : ""}`}
    >
      <TaskCardFace task={task} onViewIssue={onViewIssue} />
    </div>
  );
}
