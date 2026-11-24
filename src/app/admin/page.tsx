import Link from "next/link";
import { getDashboardData } from "@/server/services/project.service";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const { columnCounts, inbox } = await getDashboardData();

  const ideas = columnCounts["idea"] ?? 0;
  const inProgress = columnCounts["en_progreso"] ?? 0;
  const ready = columnCounts["listo"] ?? 0;
  const paused = columnCounts["pausado"] ?? 0;
  const delivered = columnCounts["entregado"] ?? 0;
  const totalProjects = Object.values(columnCounts).reduce((a, b) => a + b, 0);
  const totalUnread = inbox.reduce((a, r) => a + r.unreadCount, 0);

  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-6 lg:grid-cols-12">
      {/* Celda Bento 1: Resumen Principal e Identidad FORGE/SH (Span 5 cols x 2 rows) */}
      <section className="bento-cell bento-cyan relative flex flex-col justify-between overflow-hidden md:col-span-6 lg:col-span-5 lg:row-span-2">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-brand-500/10 via-violet-600/10 to-forge-orange/5" />

        <div className="relative">
          <div className="flex items-center justify-between border-b border-violet-500/25 pb-3">
            <span className="bento-tag text-brand-300">
              BENTO // 01 · CENTRO DE COMANDO
            </span>
            <span className="inline-flex items-center gap-1.5 border border-forge-mint/35 bg-forge-mint/10 px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-widest text-forge-mint">
              <span className="h-2 w-2 bg-forge-mint" />
              ACTIVO
            </span>
          </div>

          {/* Escaparate del Logo de la Empresa FORGE/SH */}
          <div className="relative mt-4 flex items-center justify-between gap-4 border border-brand-500/35 bg-ink-950/90 p-3.5 shadow-neon">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-forge-spectrum" />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_22%_50%,rgba(255,123,28,0.14),rgba(123,44,191,0.14)_50%,transparent_85%)]" />
            <div className="relative flex items-center gap-3.5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/forge-sh-logo-transparent.svg"
                alt="FORGE/SH — forge-sh.dev"
                className="h-16 w-auto shrink-0 select-none drop-shadow-[0_0_16px_rgba(0,210,255,0.3)] sm:h-20"
              />
              <div className="border-l border-violet-500/30 pl-3.5">
                <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-forge-gold">
                  FORGE/SH ENGINEERING
                </span>
                <h1 className="mt-0.5 text-xl font-black uppercase tracking-tight text-white sm:text-2xl">
                  Resumen General
                </h1>
                <p className="mt-0.5 text-xs text-slate-300">
                  Estado global del pipeline
                </p>
              </div>
            </div>
            <div className="relative text-right">
              <div className="font-mono text-4xl font-black text-crucible">
                {totalProjects}
              </div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-brand-300">
                Proyectos
              </div>
            </div>
          </div>

          {/* Barra segmentada sin esquinas redondeadas con colores de la marca */}
          <div className="mt-5">
            <div className="mb-1.5 flex justify-between font-mono text-[10px] uppercase tracking-wider text-slate-300">
              <span>Distribución de flujo</span>
              <span className="text-forge-mint">
                {totalProjects > 0
                  ? `${Math.round(((inProgress + ready) / totalProjects) * 100)}% activos`
                  : "0% activos"}
              </span>
            </div>
            <div className="flex h-3.5 w-full border border-violet-500/35 bg-ink-950">
              {totalProjects > 0 && (
                <>
                  <div
                    className="h-full bg-brand-500"
                    style={{ width: `${(ideas / totalProjects) * 100}%` }}
                    title={`Ideas: ${ideas}`}
                  />
                  <div
                    className="h-full bg-violet-500"
                    style={{ width: `${(inProgress / totalProjects) * 100}%` }}
                    title={`En progreso: ${inProgress}`}
                  />
                  <div
                    className="h-full bg-pink-500"
                    style={{ width: `${(ready / totalProjects) * 100}%` }}
                    title={`Listos: ${ready}`}
                  />
                  <div
                    className="h-full bg-forge-gold"
                    style={{ width: `${(paused / totalProjects) * 100}%` }}
                    title={`Pausados: ${paused}`}
                  />
                  <div
                    className="h-full bg-forge-mint"
                    style={{ width: `${(delivered / totalProjects) * 100}%` }}
                    title={`Entregados: ${delivered}`}
                  />
                </>
              )}
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-3 font-mono text-[10px] uppercase tracking-wider text-slate-400">
              <span className="inline-flex items-center gap-1">
                <span className="h-2 w-2 bg-brand-500" /> Ideas
              </span>
              <span className="inline-flex items-center gap-1">
                <span className="h-2 w-2 bg-violet-500" /> Progreso
              </span>
              <span className="inline-flex items-center gap-1">
                <span className="h-2 w-2 bg-pink-500" /> Listos
              </span>
              <span className="inline-flex items-center gap-1">
                <span className="h-2 w-2 bg-forge-gold" /> Pausados
              </span>
              <span className="inline-flex items-center gap-1">
                <span className="h-2 w-2 bg-forge-mint" /> Entregados
              </span>
            </div>
          </div>
        </div>

        <div className="relative mt-5 grid grid-cols-2 gap-2 border-t border-violet-500/25 pt-4">
          <Link href="/admin/kanban" className="btn-primary text-xs">
            Abrir Tablero →
          </Link>
          <Link href="/admin/bugs" className="btn-crucible text-xs">
            Triage Errores →
          </Link>
        </div>
      </section>

      {/* Celda Bento 2: En Progreso (Destacada Violeta/Magenta) */}
      <section className="bento-cell bento-violet relative overflow-hidden md:col-span-3 lg:col-span-4">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-600/25 via-pink-500/10 to-transparent" />
        <div className="relative flex h-full flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="bento-tag text-violet-400">PIPELINE // EN PROGRESO</span>
            <span className="h-2.5 w-2.5 bg-violet-500 shadow-neon-violet" />
          </div>
          <div className="mt-4 flex items-end justify-between">
            <div className="font-mono text-5xl font-black text-gradient">
              {inProgress}
            </div>
            <span className="font-mono text-xs uppercase tracking-wider text-violet-300">
              Sprints en curso
            </span>
          </div>
        </div>
      </section>

      {/* Celda Bento 3: Mensajes Sin Leer (Cyan/Mint) */}
      <section className="bento-cell bento-cyan relative overflow-hidden md:col-span-3 lg:col-span-3">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-brand-500/25 via-forge-mint/10 to-transparent" />
        <div className="relative flex h-full flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="bento-tag text-brand-400">COMMS // SIN LEER</span>
            <span
              className={`h-2.5 w-2.5 ${
                totalUnread > 0 ? "bg-brand-500 shadow-neon" : "bg-forge-mint"
              }`}
            />
          </div>
          <div className="mt-4 flex items-end justify-between">
            <div className="font-mono text-5xl font-black text-white">
              {totalUnread}
            </div>
            <span className="font-mono text-xs uppercase tracking-wider text-brand-300">
              {inbox.length} canales
            </span>
          </div>
        </div>
      </section>

      {/* Celda Bento 4: Ideas (Electric Cyan) */}
      <Stat
        tag="ESTADO // 01"
        tagColor="text-brand-400"
        label="Ideas"
        value={ideas}
        accent="from-brand-500/20"
        indicator="bg-brand-500"
        borderVariant="bento-cyan"
        className="md:col-span-2 lg:col-span-2"
      />

      {/* Celda Bento 5: Listos (Neon Magenta) */}
      <Stat
        tag="ESTADO // 02"
        tagColor="text-pink-400"
        label="Listos"
        value={ready}
        accent="from-pink-500/20"
        indicator="bg-pink-500"
        borderVariant="bento-magenta"
        className="md:col-span-2 lg:col-span-2"
      />

      {/* Celda Bento 6: Pausados & Entregados (Crucible Gold & Forge Mint) */}
      <Stat
        tag="ESTADO // 03"
        tagColor="text-forge-gold"
        label="Pausados"
        value={paused}
        subValue={`${delivered} entregados`}
        accent="from-forge-orange/20"
        indicator="bg-forge-gold"
        borderVariant="bento-crucible"
        className="md:col-span-2 lg:col-span-3"
      />

      {/* Celda Bento 7: Bandeja de Mensajes (Span 8 cols) */}
      <section className="bento-cell bento-violet flex flex-col p-0 md:col-span-6 lg:col-span-8">
        <div className="flex items-center justify-between border-b border-violet-500/25 bg-gradient-to-r from-violet-600/15 via-brand-500/10 to-transparent px-5 py-4">
          <div>
            <span className="bento-tag text-brand-300">
              FEED // COMUNICACIÓN DIRECTA
            </span>
            <h2 className="mt-0.5 text-base font-bold uppercase tracking-wide text-white">
              Bandeja de mensajes
            </h2>
          </div>
          <span className="badge border border-brand-500/40 bg-brand-500/15 text-brand-300">
            {totalUnread} sin leer
          </span>
        </div>

        <div className="divide-y divide-violet-500/15">
          {inbox.length === 0 && (
            <div className="px-5 py-10 text-center">
              <p className="font-mono text-xs uppercase tracking-widest text-slate-400">
                Todavía no hay mensajes de clientes.
              </p>
            </div>
          )}
          {inbox.map((row, idx) => (
            <Link
              key={row.id}
              href={`/admin/proyectos/${row.id}`}
              className="flex items-center gap-4 px-5 py-3.5 transition hover:bg-brand-500/5"
            >
              <span className="font-mono text-xs font-bold text-violet-400">
                {String(idx + 1).padStart(2, "0")}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="truncate font-semibold text-white">
                    {row.name}
                  </span>
                  {row.unreadCount > 0 && (
                    <span className="inline-flex h-5 min-w-5 items-center justify-center bg-crucible-gradient px-1.5 font-mono text-xs font-bold text-ink-950">
                      {row.unreadCount}
                    </span>
                  )}
                  {!row.active && (
                    <span className="border border-pink-500/30 bg-pink-500/10 px-1.5 py-0.5 font-mono text-[10px] uppercase text-pink-300">
                      inactivo
                    </span>
                  )}
                </div>
                <p className="mt-0.5 truncate text-xs text-slate-300">
                  {row.lastMessageText}
                </p>
              </div>
              <time className="shrink-0 font-mono text-[11px] text-brand-300/80">
                {row.lastActivityAt
                  ? new Date(row.lastActivityAt).toLocaleString("es-MX", {
                      day: "2-digit",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : ""}
              </time>
            </Link>
          ))}
        </div>
      </section>

      {/* Celda Bento 8: Matriz de Módulos (Span 4 cols) */}
      <section className="bento-cell bento-gold flex flex-col justify-between md:col-span-6 lg:col-span-4">
        <div className="flex items-center justify-between border-b border-violet-500/25 pb-3">
          <div>
            <span className="bento-tag text-forge-gold">DIRECTORIO // MÓDULOS</span>
            <h2 className="mt-0.5 text-base font-bold uppercase tracking-wide text-white">
              Acceso rápido
            </h2>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/forge-sh-icon.svg"
            alt="FORGE/SH"
            className="h-8 w-8 border border-forge-gold/40 bg-ink-950 p-1"
          />
        </div>

        <div className="mt-4 grid flex-1 grid-cols-2 gap-2.5">
          <Link
            href="/admin/kanban"
            className="bento-cyan flex flex-col justify-between border bg-ink-950/80 p-3.5 transition hover:border-brand-400 hover:bg-brand-500/10"
          >
            <span className="bento-tag text-brand-400">[02] KANBAN</span>
            <div className="mt-4">
              <div className="text-sm font-bold uppercase text-white">Tablero</div>
              <div className="text-[11px] text-brand-300/70">Ideas y flujo</div>
            </div>
          </Link>

          <Link
            href="/admin/bugs"
            className="bento-crucible flex flex-col justify-between border bg-ink-950/80 p-3.5 transition hover:border-forge-orange hover:bg-forge-orange/10"
          >
            <span className="bento-tag text-forge-orange">[03] QA</span>
            <div className="mt-4">
              <div className="text-sm font-bold uppercase text-white">Errores</div>
              <div className="text-[11px] text-forge-gold/70">Registro y prioridad</div>
            </div>
          </Link>

          <Link
            href="/admin/clientes"
            className="bento-mint flex flex-col justify-between border bg-ink-950/80 p-3.5 transition hover:border-forge-mint hover:bg-forge-mint/10"
          >
            <span className="bento-tag text-forge-mint">[04] CRM</span>
            <div className="mt-4">
              <div className="text-sm font-bold uppercase text-white">Clientes</div>
              <div className="text-[11px] text-forge-mint/70">Cuentas e historial</div>
            </div>
          </Link>

          <Link
            href="/admin/profile"
            className="bento-violet flex flex-col justify-between border bg-ink-950/80 p-3.5 transition hover:border-pink-500 hover:bg-violet-500/10"
          >
            <span className="bento-tag text-pink-400">[05] OAUTH</span>
            <div className="mt-4">
              <div className="text-sm font-bold uppercase text-white">Perfil</div>
              <div className="text-[11px] text-violet-300/80">Cuenta de GitHub</div>
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
}

function Stat({
  tag,
  tagColor = "text-slate-400",
  label,
  value,
  subValue,
  accent,
  indicator,
  borderVariant = "",
  className = "",
}: {
  tag: string;
  tagColor?: string;
  label: string;
  value: number;
  subValue?: string;
  accent: string;
  indicator: string;
  borderVariant?: string;
  className?: string;
}) {
  return (
    <div
      className={`bento-cell-interactive ${borderVariant} relative overflow-hidden ${className}`}
    >
      <div
        className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${accent} to-transparent`}
      />
      <div className="relative flex h-full flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className={`bento-tag ${tagColor}`}>{tag}</span>
          <span className={`h-2 w-2 ${indicator}`} />
        </div>
        <div className="mt-3">
          <div className="font-mono text-3xl font-black text-white">{value}</div>
          <div className="mt-1 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-200">
              {label}
            </span>
            {subValue && (
              <span className="font-mono text-[10px] font-semibold text-forge-mint">
                {subValue}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
