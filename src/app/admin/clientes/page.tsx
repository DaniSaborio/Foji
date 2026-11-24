import Link from "next/link";
import { getClientsPageData } from "@/server/services/client.service";
import { CreateClientForm } from "@/features/create-client/ui/CreateClientForm";

export const dynamic = "force-dynamic";

export default async function ClientsPage() {
  const clients = await getClientsPageData();
  const totalProjects = clients.reduce((acc, c) => acc + c.projectCount, 0);

  return (
    <div className="space-y-3">
      {/* Cabecera Bento de Clientes */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-12">
        <section className="bento-cell bento-mint flex flex-col justify-between md:col-span-6">
          <div className="flex items-center justify-between">
            <span className="bento-tag text-forge-mint">
              BENTO // 04 · DIRECTORIO CRM
            </span>
            <span className="border border-forge-mint/35 bg-forge-mint/10 px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-widest text-forge-mint">
              CUENTAS
            </span>
          </div>
          <div className="mt-2">
            <h1 className="text-2xl font-black uppercase tracking-tight text-white">
              Clientes
            </h1>
            <p className="mt-0.5 text-xs text-slate-300">
              Empresas registradas y proyectos históricos vinculados
            </p>
          </div>
        </section>

        <section className="bento-cell bento-gold flex flex-col justify-between md:col-span-3">
          <span className="bento-tag text-forge-gold">TOTAL CLIENTES</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="font-mono text-3xl font-black text-crucible">
              {clients.length}
            </span>
            <span className="font-mono text-[10px] uppercase text-slate-400">
              Registrados
            </span>
          </div>
        </section>

        <section className="bento-cell bento-cyan flex flex-col justify-between md:col-span-3">
          <span className="bento-tag text-brand-400">PROYECTOS VINCULADOS</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="font-mono text-3xl font-black text-gradient">
              {totalProjects}
            </span>
            <span className="font-mono text-[10px] uppercase text-brand-300/80">
              Asignaciones
            </span>
          </div>
        </section>
      </div>

      <CreateClientForm />

      {/* Bento Grid de Tarjetas de Clientes */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {clients.length === 0 && (
          <div className="bento-cell py-12 text-center sm:col-span-2 lg:col-span-3">
            <p className="font-mono text-xs uppercase tracking-widest text-slate-500">
              Aún no hay clientes registrados.
            </p>
          </div>
        )}
        {clients.map((c, idx) => (
          <Link
            key={c.id}
            href={`/admin/clientes/${c.id}`}
            className="bento-cell-interactive flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                <span className="bento-tag">
                  CLIENTE // [{String(idx + 1).padStart(2, "0")}]
                </span>
                <span className="badge border border-brand-500/40 bg-brand-500/10 text-brand-300">
                  {c.projectCount} proyecto{c.projectCount === 1 ? "" : "s"}
                </span>
              </div>
              <h2 className="mt-3 text-lg font-bold text-white">{c.name}</h2>
              {c.contact ? (
                <p className="mt-1 font-mono text-xs text-slate-400">{c.contact}</p>
              ) : (
                <p className="mt-1 font-mono text-xs text-slate-600">
                  Sin contacto registrado
                </p>
              )}
            </div>

            <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-2.5 font-mono text-[11px] uppercase tracking-wider text-brand-400">
              <span>Ver expediente</span>
              <span>→</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
