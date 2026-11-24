import { headers } from "next/headers";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { getPublicProjectView } from "@/server/services/public-project.service";
import { PublicChat } from "./public-chat";

export const dynamic = "force-dynamic";

// Generic unavailable page. Intentionally identical whether the token doesn't
// exist OR the project is inactive — never leak which case it is.
function Unavailable() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="bento-cell bento-magenta max-w-md text-center shadow-neon-violet">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/forge-sh-logo-transparent.svg"
          alt="FORGE/SH"
          className="mx-auto mb-4 h-24 w-auto drop-shadow-[0_0_16px_rgba(200,29,245,0.35)]"
        />
        <div className="mb-2 font-mono text-xs font-bold uppercase tracking-widest text-pink-400">
          ACCESO // BLOQUEADO
        </div>
        <h1 className="text-lg font-bold uppercase text-white">
          Este proyecto ya no está disponible
        </h1>
        <p className="mt-2 text-xs text-slate-300">
          Si crees que es un error, contacta a tu equipo de{" "}
          <span className="font-semibold text-brand-400">FORGE/SH</span>.
        </p>
      </div>
    </main>
  );
}

export default async function PublicProject({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const { env } = getCloudflareContext();

  // Basic per-IP rate limit against token brute-forcing.
  const ip =
    (await headers()).get("cf-connecting-ip") ??
    (await headers()).get("x-forwarded-for") ??
    "unknown";
  try {
    const rl = await env.PUBLIC_RATE_LIMITER.limit({ key: ip });
    if (!rl.success) return <Unavailable />;
  } catch {
    /* limiter not bound in some local setups; fail open */
  }

  const view = await getPublicProjectView(token);
  if (!view) return <Unavailable />;
  const { project, events, messages } = view;

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:py-10">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-6 lg:grid-cols-12">
          {/* Celda Bento 1: Identidad de la Empresa FORGE/SH y del Proyecto */}
          <section className="bento-cell bento-cyan relative flex flex-col justify-between overflow-hidden md:col-span-6 lg:col-span-5">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-brand-500/10 via-violet-600/10 to-transparent" />
            <div className="relative flex items-center justify-between border-b border-violet-500/25 pb-2.5">
              <div className="flex items-center gap-2 text-sm font-bold">
                <span className="text-base font-black">
                  <span className="text-gradient">Fō</span>
                  <span className="text-white">ji</span>
                </span>
                <span className="border border-violet-500/40 bg-ink-950 px-1.5 py-0.5 font-mono text-[10px] font-bold tracking-wider">
                  <span className="text-white">FORGE</span>
                  <span className="text-brand-400">/</span>
                  <span className="text-pink-400">SH</span>
                </span>
              </div>
              <span className="inline-flex items-center gap-1.5 border border-forge-mint/35 bg-forge-mint/10 px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-widest text-forge-mint">
                <span className="h-1.5 w-1.5 bg-forge-mint" />
                PORTAL // CLIENTE
              </span>
            </div>

            <div className="relative mt-3.5 flex items-center gap-4 border border-brand-500/35 bg-ink-950/90 p-3 shadow-neon">
              <div className="pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-forge-spectrum" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/forge-sh-logo-transparent.svg"
                alt="FORGE/SH — forge-sh.dev"
                className="h-16 w-auto shrink-0 select-none drop-shadow-[0_0_15px_rgba(0,210,255,0.3)] sm:h-20"
              />
              <div className="min-w-0 border-l border-violet-500/30 pl-3.5">
                <span className="bento-tag text-forge-gold">PROYECTO ACTIVO</span>
                <h1 className="mt-1 truncate text-xl font-black uppercase tracking-tight text-white sm:text-2xl">
                  {project.name}
                </h1>
              </div>
            </div>
          </section>

          {/* Celda Bento 2: Etapa Actual */}
          <section className="bento-cell bento-magenta relative flex flex-col justify-between overflow-hidden shadow-neon-violet md:col-span-3 lg:col-span-4">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-pink-500/20 via-violet-600/15 to-brand-500/10" />
            <div className="relative flex items-center justify-between border-b border-violet-500/25 pb-2.5">
              <span className="bento-tag text-pink-400">FASE // ETAPA ACTUAL</span>
              <span className="h-2.5 w-2.5 bg-pink-500 shadow-neon-violet" />
            </div>
            <div className="relative mt-4">
              <p className="text-2xl font-black uppercase tracking-tight text-gradient sm:text-3xl">
                {project.stage ?? "En ejecución"}
              </p>
              <p className="mt-1 font-mono text-[11px] uppercase tracking-wider text-violet-300">
                Pipeline de ingeniería FORGE/SH
              </p>
            </div>
          </section>

          {/* Celda Bento 3: Progreso General */}
          <section className="bento-cell bento-gold relative flex flex-col justify-between overflow-hidden md:col-span-3 lg:col-span-3">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-forge-orange/15 via-forge-gold/10 to-transparent" />
            <div className="relative flex items-center justify-between border-b border-violet-500/25 pb-2.5">
              <span className="bento-tag text-forge-gold">PROGRESO GENERAL</span>
              <span className="font-mono text-xs font-bold text-forge-orange">
                AVANCE
              </span>
            </div>
            <div className="relative mt-3">
              <div className="mb-1.5 flex items-baseline justify-between">
                <span className="font-mono text-3xl font-black text-crucible">
                  {project.progressPct}%
                </span>
                <span className="font-mono text-[10px] uppercase text-forge-mint">
                  Completado
                </span>
              </div>
              <div className="h-3.5 overflow-hidden rounded-none border border-violet-500/35 bg-ink-950">
                <div
                  className="h-full rounded-none bg-forge-spectrum transition-all"
                  style={{ width: `${project.progressPct}%` }}
                />
              </div>
            </div>
          </section>

          {/* Celda Bento 4: Roadmap / Avances del proyecto */}
          <section className="bento-cell bento-violet flex flex-col md:col-span-6 lg:col-span-5">
            <div className="flex items-center justify-between border-b border-violet-500/25 pb-3">
              <div>
                <span className="bento-tag text-violet-400">
                  ROADMAP // BITÁCORA
                </span>
                <h2 className="mt-0.5 text-sm font-bold uppercase tracking-wider text-white">
                  Avances del proyecto
                </h2>
              </div>
              <span className="border border-brand-500/40 bg-brand-500/10 px-2 py-0.5 font-mono text-xs font-bold text-brand-300">
                {events.length}
              </span>
            </div>

            {events.length === 0 ? (
              <p className="mt-6 font-mono text-xs uppercase tracking-widest text-slate-400">
                Pronto verás aquí los avances de tu proyecto.
              </p>
            ) : (
              <ol className="mt-4 max-h-[60vh] space-y-3 overflow-y-auto pr-1">
                {events.map((ev, i) => {
                  const dotColors = [
                    "bg-brand-500 shadow-neon",
                    "bg-pink-500 shadow-neon-violet",
                    "bg-forge-gold shadow-neon-crucible",
                    "bg-forge-mint shadow-neon-mint",
                  ];
                  return (
                    <li
                      key={ev.id}
                      className="relative flex gap-3 border border-violet-500/25 bg-ink-950/80 p-3"
                    >
                      <div className="flex flex-col items-center">
                        <div
                          className={`mt-0.5 h-2.5 w-2.5 rounded-none ${
                            dotColors[i % dotColors.length]
                          }`}
                        />
                        {i < events.length - 1 && (
                          <div className="mt-1 w-px flex-1 bg-gradient-to-b from-brand-500/50 to-violet-500/20" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm text-slate-100">{ev.description}</p>
                        <time className="mt-1 block font-mono text-[11px] text-brand-300/80">
                          {new Date(ev.createdAt).toLocaleDateString("es-MX", {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                          })}
                        </time>
                      </div>
                    </li>
                  );
                })}
              </ol>
            )}
          </section>

          {/* Celda Bento 5: Chat con el equipo */}
          <div className="md:col-span-6 lg:col-span-7">
            <PublicChat token={token} history={messages} />
          </div>

          {/* Celda Bento 6: Pie de Telemetría y Marca FORGE/SH */}
          <footer className="bento-cell flex flex-wrap items-center justify-between gap-4 py-3 md:col-span-6 lg:col-span-12">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-forge-spectrum" />
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/forge-sh-icon.svg"
                alt="FORGE/SH"
                className="h-8 w-8 border border-brand-500/40 bg-ink-950 p-1"
              />
              <div>
                <span className="bento-tag text-brand-300">
                  POWERED BY FŌJI · FORGE/SH
                </span>
                <p className="font-mono text-[11px] text-slate-400">
                  Ingeniería de software & sistemas de alto rendimiento
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden items-center gap-1 sm:flex">
                <span className="h-2 w-2 bg-[#C81DF5]" />
                <span className="h-2 w-2 bg-[#7B2CBF]" />
                <span className="h-2 w-2 bg-[#00D2FF]" />
                <span className="h-2 w-2 bg-[#14F1C9]" />
                <span className="h-2 w-2 bg-[#FFD13B]" />
                <span className="h-2 w-2 bg-[#FF7B1C]" />
              </div>
              <span className="font-mono text-xs font-bold text-gradient">
                forge-sh.dev
              </span>
            </div>
          </footer>
        </div>
      </div>
    </main>
  );
}
