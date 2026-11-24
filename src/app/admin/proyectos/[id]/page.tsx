import Link from "next/link";
import { notFound } from "next/navigation";
import { getClientsPageData } from "@/server/services/client.service";
import { listClientsLinkedToProject } from "@/server/models/client.model";
import { getDb } from "@/db";
import {
  getProjectChatHistory,
  getProjectDetail,
  getProjectEvents,
  markClientMessagesAsRead,
} from "@/server/services/project.service";
import { getStages } from "@/server/services/stage.service";
import { getSprintBoardData } from "@/server/services/sprint.service";
import { StageEditor } from "@/features/edit-project-stage/ui/StageEditor";
import { StagesManager } from "@/features/manage-stages/ui/StagesManager";
import { ActiveToggle } from "@/features/toggle-project-active/ui/ActiveToggle";
import { PublicLinkPanel } from "@/features/share-project-link/ui/PublicLinkPanel";
import { GithubPanel } from "@/features/manage-project-github-link/ui/GithubPanel";
import { ClientLinker } from "@/features/link-client-to-project/ui/ClientLinker";
import { AdminChat } from "./admin-chat";
import { SprintBoard } from "@/widgets/sprint-board/ui/SprintBoard";

export const dynamic = "force-dynamic";

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const project = await getProjectDetail(id);
  if (!project) notFound();

  const [stages, events, allClients, linkedClients, sprintBoardData, messages] =
    await Promise.all([
      getStages(),
      getProjectEvents(id),
      getClientsPageData(),
      listClientsLinkedToProject(getDb(), id),
      getSprintBoardData(id),
      getProjectChatHistory(id),
    ]);

  // Side-effect explícito, separado del fetch de arriba: marca como leídos
  // los mensajes que el cliente mandó (para el inbox de socios en /admin).
  await markClientMessagesAsRead(id);

  const stageNames = stages.map((s) => s.name);

  return (
    <div className="space-y-3">
      {/* Fila 1 Bento: Identidad, Telemetría de Progreso y Control de Portal */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-6 lg:grid-cols-12">
        {/* Celda Identidad del Proyecto */}
        <section className="bento-cell bento-cyan flex flex-col justify-between md:col-span-6 lg:col-span-6">
          <div className="flex items-center justify-between border-b border-violet-500/25 pb-2.5">
            <Link
              href="/admin/kanban"
              className="font-mono text-xs uppercase tracking-wider text-brand-300 hover:text-brand-200"
            >
              ← Tablero Kanban
            </Link>
            <span className="bento-tag text-brand-400">
              PROYECTO // EXPEDIENTE
            </span>
          </div>
          <div className="mt-3">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-2xl font-black uppercase tracking-tight text-white">
                {project.name}
              </h1>
              {project.repoGithub && (
                <a
                  href={`https://github.com/${project.repoGithub}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 border border-brand-500/40 bg-brand-500/10 px-2.5 py-0.5 font-mono text-xs font-medium text-brand-300 hover:border-brand-400"
                >
                  <span className="h-1.5 w-1.5 bg-forge-mint" />
                  {project.repoGithub} ↗
                </a>
              )}
            </div>
            {project.description && (
              <p className="mt-1.5 max-w-2xl text-sm text-slate-300">
                {project.description}
              </p>
            )}
          </div>
        </section>

        {/* Celda Telemetría de Avance */}
        <section className="bento-cell bento-gold flex flex-col justify-between md:col-span-3 lg:col-span-3">
          <div className="flex items-center justify-between">
            <span className="bento-tag text-forge-gold">TELEMETRÍA // AVANCE</span>
            {project.stage && (
              <span className="border border-pink-500/40 bg-pink-500/15 px-2 py-0.5 font-mono text-[10px] font-semibold uppercase text-pink-300">
                {project.stage}
              </span>
            )}
          </div>
          <div className="mt-3">
            <div className="mb-1.5 flex items-baseline justify-between">
              <span className="font-mono text-3xl font-black text-crucible">
                {project.progressPct}%
              </span>
              <span className="font-mono text-[10px] uppercase tracking-wider text-forge-mint">
                Completado
              </span>
            </div>
            <div className="h-3 w-full overflow-hidden rounded-none border border-violet-500/35 bg-ink-950">
              <div
                className="h-full rounded-none bg-forge-spectrum transition-all"
                style={{ width: `${project.progressPct}%` }}
              />
            </div>
          </div>
        </section>

        {/* Celda Control de Acceso Público */}
        <section className="bento-cell bento-mint flex flex-col justify-between md:col-span-3 lg:col-span-3">
          <div className="flex items-center justify-between">
            <span className="bento-tag text-forge-mint">ACCESO // PORTAL</span>
            <Link
              href={`/p/${project.publicToken}`}
              target="_blank"
              className="font-mono text-[10px] font-bold uppercase tracking-wider text-brand-400 hover:underline"
            >
              Ver portal ↗
            </Link>
          </div>
          <div className="mt-3">
            <ActiveToggle projectId={project.id} active={project.active} />
          </div>
        </section>
      </div>

      {/* Fila 2 Bento: Tablero de Sprints y Tareas */}
      <SprintBoard
        proyectoId={project.id}
        tieneRepo={!!project.repoGithub}
        sprints={sprintBoardData.sprints}
        tareas={sprintBoardData.tasks}
      />

      {/* Fila 3 Bento: Operaciones, Integraciones y Comunicaciones */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-6 lg:grid-cols-12">
        {/* Celda Etapas y Progreso */}
        <section className="bento-cell md:col-span-3 lg:col-span-4">
          <div className="mb-3 flex items-center justify-between border-b border-white/10 pb-2.5">
            <span className="bento-tag">FLUJO // ETAPA DEL PROYECTO</span>
            <span className="font-mono text-xs font-bold text-white">
              {project.progressPct}%
            </span>
          </div>
          <StageEditor
            projectId={project.id}
            currentStage={project.stage}
            stages={stageNames}
          />
          <StagesManager stages={stages} />
        </section>

        {/* Celda GitHub */}
        <div className="md:col-span-3 lg:col-span-4">
          <GithubPanel
            projectId={project.id}
            repoGithub={project.repoGithub}
            installationId={project.installationId}
            milestoneId={project.milestoneId}
            milestoneTitle={project.milestoneTitle}
            creatorLogin={project.creatorGithubLogin}
          />
        </div>

        {/* Celda Link Público + Clientes Vinculados */}
        <div className="flex flex-col gap-3 md:col-span-6 lg:col-span-4">
          <PublicLinkPanel token={project.publicToken} active={project.active} />
          <ClientLinker
            projectId={project.id}
            allClients={allClients.map((c) => ({ id: c.id, name: c.name }))}
            linkedClients={linkedClients}
          />
        </div>

        {/* Celda Historial de Eventos */}
        <section className="bento-cell flex flex-col md:col-span-6 lg:col-span-5">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div>
              <span className="bento-tag">REGISTRO // AUDITORÍA</span>
              <h2 className="mt-0.5 text-sm font-bold uppercase tracking-wider text-white">
                Historial de eventos
              </h2>
            </div>
            <span className="border border-white/15 bg-white/5 px-2 py-0.5 font-mono text-xs text-slate-400">
              {events.length}
            </span>
          </div>
          <ol className="mt-4 max-h-[54vh] space-y-3 overflow-y-auto pr-1">
            {events.length === 0 && (
              <li className="font-mono text-xs uppercase tracking-widest text-slate-500">
                Sin eventos todavía.
              </li>
            )}
            {events.map((ev) => (
              <li
                key={ev.id}
                className="flex gap-3 border border-white/10 bg-ink-950/70 p-3"
              >
                <div className="mt-1 h-2.5 w-2.5 shrink-0 rounded-none bg-brand-500" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-slate-200">{ev.description}</p>
                  <time className="mt-1 block font-mono text-[11px] text-slate-500">
                    {new Date(ev.createdAt).toLocaleString("es-MX")}
                  </time>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* Celda Chat con el Cliente */}
        <div className="md:col-span-6 lg:col-span-7">
          <AdminChat proyectoId={project.id} history={messages} />
        </div>
      </div>
    </div>
  );
}
