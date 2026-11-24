"use client";

import { ProjectCardFace } from "@/entities/project/ui/ProjectCardFace";
import type { ProjectCard } from "@/entities/project/model/types";

export function DraggableProjectCard({
  card,
  isDragging = false,
  onOpen,
  onDragStart,
  onDragEnd,
}: {
  card: ProjectCard;
  isDragging?: boolean;
  onOpen: (c: ProjectCard) => void;
  onDragStart?: (id: string) => void;
  onDragEnd?: () => void;
}) {
  return (
    <div
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData("text/plain", card.id);
        e.dataTransfer.effectAllowed = "move";
        onDragStart?.(card.id);
      }}
      onDragEnd={() => onDragEnd?.()}
      onClick={() => onOpen(card)}
      className={`cursor-grab active:cursor-grabbing ${isDragging ? "opacity-40" : ""}`}
    >
      <ProjectCardFace card={card} />
    </div>
  );
}
