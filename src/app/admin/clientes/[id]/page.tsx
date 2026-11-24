import Link from "next/link";
import { notFound } from "next/navigation";
import { getClientDetail } from "@/server/services/client.service";
import { EditClientForm } from "@/features/edit-client/ui/EditClientForm";

export const dynamic = "force-dynamic";

const COLUMN_LABEL: Record<string, string> = {
  idea: "Idea",
  en_progreso: "En progreso",
  listo: "Listo",
  pausado: "Pausado",
  cancelado: "Cancelado",
  entregado: "Entregado",
  cerrado: "Cerrado",
};

export default async function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const detail = await getClientDetail(id);
  if (!detail) notFound();
  const { client, projects } = detail;

  return (
    <div className="space-y-3">
      {/* Cabecera Bento del Cliente */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-12">
        <section className="bento-cell bento-mint flex flex-col justify-between md:col-span-8">
          <div className="flex items-center justify-between border-b border-violet-500/25 pb-2">
            <Link
              href="/admin/clientes"
              className="font-mono text-xs uppercase tracking-wider text-brand-300 hover:text-brand-200"
            >
              ← Clientes
            </Link>
            <span className="bento-tag text-forge-mint">
              CRM // EXPEDIENTE DE CLIENTE
            </span>
          </div>
          <div className="mt-3">
            <h1 className="text-2xl font-black uppercase tracking-tight text-white">
              {client.name}
            </h1>
            {client.contact && (
              <p className="mt-1 font-mono text-xs text-brand-300">
                {client.contact}
              </p>
            )}
          </div>
        </section>

        <section className="bento-cell bento-gold flex flex-col justify-between md:col-span-4">
          <span className="bento-tag text-forge-gold">PROYECTOS VINCULADOS</span>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="font-mono text-4xl font-black text-crucible">
              {projects.length}
            </span>
            <span className="font-mono text-xs uppercase text-slate-400">
              Históricos
            </span>
          </div>
        </section>
      </div>

      {/* Bento Grid: Edición + Proyectos Históricos */}
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <EditClientForm client={client} />
        </div>

        <section className="bento-cell flex flex-col p-0 lg:col-span-7">
          <div className="flex items-center justify-between border-b border-white/15 px-5 py-4">
            <div>
              <span className="bento-tag">HISTORIAL // PROYECTOS</span>
              <h2 className="mt-0.5 text-sm font-bold uppercase tracking-wider text-white">
                Proyectos históricos ({projects.length})
              </h2>
            </div>
          </div>

          <div className="divide-y divide-white/10">
            {projects.length === 0 && (
              <p className="px-5 py-10 text-center font-mono text-xs uppercase tracking-widest text-slate-500">
                Este cliente no tiene proyectos vinculados.
              </p>
            )}
            {projects.map((p) => (
              <Link
                key={p.id}
                href={`/admin/proyectos/${p.id}`}
                className="flex items-center justify-between gap-4 px-5 py-4 transition hover:bg-white/5"
              >
                <div className="min-w-0">
                  <p className="truncate font-bold text-white">{p.name}</p>
                  <p className="mt-0.5 font-mono text-xs text-slate-500">
                    {COLUMN_LABEL[p.kanbanColumn] ?? p.kanbanColumn}
                    {p.stage ? ` · ${p.stage}` : ""}
                    {!p.active ? " · inactivo" : ""}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="hidden h-2.5 w-28 overflow-hidden rounded-none border border-white/15 bg-ink-950 sm:block">
                    <div
                      className="h-full rounded-none bg-brand-gradient-2"
                      style={{ width: `${p.progressPct}%` }}
                    />
                  </div>
                  <span className="w-10 text-right font-mono text-xs font-bold text-slate-300">
                    {p.progressPct}%
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
