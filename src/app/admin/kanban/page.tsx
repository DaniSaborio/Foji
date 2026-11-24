import { getKanbanBoardData } from "@/server/services/project.service";
import { KanbanBoard } from "@/widgets/kanban-board/ui/KanbanBoard";

export const dynamic = "force-dynamic";

export default async function KanbanPage() {
  const cards = await getKanbanBoardData();
  const withRepo = cards.filter((c) => c.hasRepo).length;
  const activeCount = cards.filter(
    (c) => c.kanbanColumn === "en_progreso" || c.kanbanColumn === "listo",
  ).length;

  return (
    <div className="space-y-3">
      {/* Cabecera Bento del Tablero */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-12">
        <section className="bento-cell bento-cyan flex flex-col justify-between md:col-span-6">
          <div className="flex items-center justify-between">
            <span className="bento-tag text-brand-300">
              BENTO // 02 · PIPELINE KANBAN
            </span>
            <span className="border border-brand-500/40 bg-brand-500/10 px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-widest text-brand-300">
              DRAG & DROP
            </span>
          </div>
          <div className="mt-2">
            <h1 className="text-2xl font-black uppercase tracking-tight text-white">
              Tablero de Proyectos
            </h1>
            <p className="mt-0.5 text-xs text-slate-300">
              Ideas y proyectos · arrastra las tarjetas entre celdas de estado
            </p>
          </div>
        </section>

        <section className="bento-cell bento-gold flex flex-col justify-between md:col-span-2">
          <span className="bento-tag text-forge-gold">TOTAL</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="font-mono text-3xl font-black text-crucible">
              {cards.length}
            </span>
            <span className="font-mono text-[10px] uppercase text-slate-400">
              Tarjetas
            </span>
          </div>
        </section>

        <section className="bento-cell bento-magenta flex flex-col justify-between md:col-span-2">
          <span className="bento-tag text-pink-400">ACTIVOS</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="font-mono text-3xl font-black text-gradient">
              {activeCount}
            </span>
            <span className="font-mono text-[10px] uppercase text-slate-400">
              En flujo
            </span>
          </div>
        </section>

        <section className="bento-cell bento-mint flex flex-col justify-between md:col-span-2">
          <span className="bento-tag text-forge-mint">GITHUB</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="font-mono text-3xl font-black text-white">
              {withRepo}
            </span>
            <span className="font-mono text-[10px] uppercase text-forge-mint">
              Con repo
            </span>
          </div>
        </section>
      </div>

      <KanbanBoard cards={cards} />
    </div>
  );
}
