"use client";

import { useState } from "react";
import { deleteProjectAction, moveProjectCardAction } from "@/app/admin/actions/proyectos";
import { ProjectCardModal } from "@/features/manage-project-card/ui/ProjectCardModal";
import { KANBAN_COLUMNS } from "@/entities/project/model/types";
import { KanbanColumn } from "./KanbanColumn";
import type { KanbanColumn as KanbanColumnKey, ProjectCard } from "@/entities/project/model/types";

export function KanbanBoard({ cards: initial }: { cards: ProjectCard[] }) {
  const [cards, setCards] = useState(initial);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [openCard, setOpenCard] = useState<ProjectCard | null>(null);

  async function handleDropCard(overColumn: KanbanColumnKey, cardId: string) {
    setActiveId(null);
    const card = cards.find((c) => c.id === cardId);
    if (!card || card.kanbanColumn === overColumn) return;

    const order = cards.filter((c) => c.kanbanColumn === overColumn).length;
    setCards((prev) =>
      prev.map((c) => (c.id === cardId ? { ...c, kanbanColumn: overColumn, order } : c)),
    );
    await moveProjectCardAction(cardId, overColumn, order);
  }

  async function handleDelete(cardId: string) {
    setCards((prev) => prev.filter((c) => c.id !== cardId));
    setOpenCard(null);
    await deleteProjectAction(cardId);
  }

  return (
    <>
      {/* Bento Grid de 12 columnas: las primeras 4 etapas ocupan 3 cols c/u; las 3 de cierre ocupan 4 cols c/u */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-6 xl:grid-cols-12">
        {KANBAN_COLUMNS.map((column, index) => {
          const spanClass =
            index < 4
              ? "md:col-span-3 xl:col-span-3"
              : "md:col-span-2 xl:col-span-4";
          return (
            <KanbanColumn
              key={column.key}
              column={column}
              index={index + 1}
              className={spanClass}
              cards={cards.filter((c) => c.kanbanColumn === column.key)}
              activeId={activeId}
              onOpen={setOpenCard}
              onDragStart={setActiveId}
              onDragEnd={() => setActiveId(null)}
              onDropCard={handleDropCard}
            />
          );
        })}
      </div>

      {openCard && (
        <ProjectCardModal
          card={cards.find((c) => c.id === openCard.id) ?? openCard}
          onClose={() => setOpenCard(null)}
          onDelete={handleDelete}
        />
      )}
    </>
  );
}
