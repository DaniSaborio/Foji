"use client";

import { useState } from "react";
import { CreateIdeaForm } from "@/features/create-project-idea/ui/CreateIdeaForm";
import { DraggableProjectCard } from "./DraggableProjectCard";
import type { KanbanColumn as KanbanColumnKey, ProjectCard } from "@/entities/project/model/types";

export function KanbanColumn({
  column,
  index,
  cards,
  activeId,
  onOpen,
  onDragStart,
  onDragEnd,
  onDropCard,
  className = "",
}: {
  column: {
    key: KanbanColumnKey;
    label: string;
    dot: string;
    accent?: string;
    tagColor?: string;
  };
  index?: number;
  cards: ProjectCard[];
  activeId?: string | null;
  onOpen: (c: ProjectCard) => void;
  onDragStart?: (id: string) => void;
  onDragEnd?: () => void;
  onDropCard?: (column: KanbanColumnKey, cardId: string) => void;
  className?: string;
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
        const cardId = e.dataTransfer.getData("text/plain") || activeId;
        if (cardId) onDropCard?.(column.key, cardId);
      }}
      className={`flex flex-col rounded-none border backdrop-blur-md transition ${
        column.accent ?? ""
      } ${
        isOver
          ? "border-brand-500/80 bg-brand-500/15 shadow-neon"
          : "border-violet-500/25 bg-ink-900/85"
      } ${className}`}
    >
      <div className="flex items-center justify-between border-b border-violet-500/20 bg-ink-950/70 px-3.5 py-2.5">
        <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white">
          <span className={`h-2.5 w-2.5 ${column.dot}`} />
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
        </h3>
        <span className="border border-violet-500/30 bg-violet-500/10 px-2 py-0.5 font-mono text-xs font-bold text-slate-200">
          {cards.length}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-2.5 p-3">
        {column.key === "idea" && <CreateIdeaForm />}
        {cards.map((c) => (
          <DraggableProjectCard
            key={c.id}
            card={c}
            isDragging={activeId === c.id}
            onOpen={onOpen}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
          />
        ))}
        {cards.length === 0 && column.key !== "idea" && (
          <p className="flex-1 border border-dashed border-violet-500/20 px-3 py-8 text-center font-mono text-[11px] uppercase tracking-widest text-slate-500">
            Vacío
          </p>
        )}
      </div>
    </div>
  );
}
