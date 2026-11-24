import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

const ERRORS: Record<string, string> = {
  oauth: "El inicio de sesión con GitHub falló o expiró. Intenta de nuevo.",
  token: "No se pudo obtener el acceso de GitHub.",
  denied: "Tu cuenta de GitHub no está autorizada para este panel.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  if (await getSession()) redirect("/admin");
  const { error } = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-5xl">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-12">
          {/* Celda Principal Bento: Identidad de Marca FORGE/SH y Arquitectura */}
          <section className="bento-cell bento-cyan flex flex-col justify-between overflow-hidden md:col-span-7 md:row-span-2">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-pink-500/10 via-violet-600/10 to-brand-500/10" />

            <div className="relative">
              <div className="flex items-center justify-between border-b border-violet-500/25 pb-3">
                <span className="bento-tag text-brand-300">
                  SYS // FOJI · FORGE/SH
                </span>
                <span className="inline-flex items-center gap-1.5 border border-forge-mint/30 bg-forge-mint/10 px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-widest text-forge-mint">
                  <span className="h-2 w-2 bg-forge-mint shadow-neon-mint" />
                  OPERATIVO
                </span>
              </div>

              {/* Escenario Principal del Logo de la Empresa FORGE/SH */}
              <div className="relative mt-4 overflow-hidden border border-brand-500/35 bg-ink-950/95 p-5 shadow-neon">
                <div className="pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-forge-spectrum" />
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(255,123,28,0.16),rgba(123,44,191,0.18)_45%,rgba(0,210,255,0.08)_75%,transparent_100%)]" />
                {/* Marcadores técnicos de esquina con los colores de la marca */}
                <span className="pointer-events-none absolute left-0 top-0 h-2.5 w-2.5 border-l-2 border-t-2 border-pink-500" />
                <span className="pointer-events-none absolute right-0 top-0 h-2.5 w-2.5 border-r-2 border-t-2 border-brand-500" />
                <span className="pointer-events-none absolute bottom-0 left-0 h-2.5 w-2.5 border-b-2 border-l-2 border-forge-gold" />
                <span className="pointer-events-none absolute bottom-0 right-0 h-2.5 w-2.5 border-b-2 border-r-2 border-forge-mint" />

                <div className="relative flex flex-col items-center">
                  {/* eslint-disable-next-line @next/next/no-img-element -- next/image no funciona en el runtime de Workers */}
                  <img
                    src="/forge-sh-logo-transparent.svg"
                    alt="FORGE/SH — forge-sh.dev"
                    className="h-36 w-auto select-none drop-shadow-[0_0_25px_rgba(0,210,255,0.28)] sm:h-44"
                  />
                </div>
              </div>

              <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
                    <span className="text-gradient">Fō</span>
                    <span className="text-white">ji</span>
                  </h1>
                  <span className="border border-forge-gold/40 bg-forge-orange/15 px-2.5 py-1 font-mono text-[11px] font-bold uppercase tracking-widest text-forge-gold">
                    FORGE/SH OS
                  </span>
                </div>
                <p className="font-mono text-xs uppercase tracking-widest text-brand-300">
                  Gestión de proyectos de ingeniería
                </p>
              </div>

              <p className="mt-3 text-sm leading-relaxed text-slate-300">
                Centro de operaciones de{" "}
                <span className="font-semibold text-white">FORGE</span>
                <span className="font-semibold text-brand-400">/</span>
                <span className="font-semibold text-violet-400">SH</span> para
                planificación de sprints, sincronización de repositorios e issues
                de GitHub, seguimiento de errores y comunicación en tiempo real
                con clientes.
              </p>
            </div>

            <div className="relative mt-6 grid grid-cols-2 gap-2.5 border-t border-violet-500/25 pt-4">
              <div className="bento-cyan border bg-ink-950/85 p-3">
                <span className="bento-tag text-brand-400">[01] PIPELINE</span>
                <p className="mt-1 text-xs font-semibold text-white">
                  Tablero Kanban & Sprints
                </p>
              </div>
              <div className="bento-violet border bg-ink-950/85 p-3">
                <span className="bento-tag text-violet-400">[02] CÓDIGO</span>
                <p className="mt-1 text-xs font-semibold text-white">
                  Sincronización GitHub
                </p>
              </div>
              <div className="bento-crucible border bg-ink-950/85 p-3">
                <span className="bento-tag text-forge-gold">[03] CALIDAD</span>
                <p className="mt-1 text-xs font-semibold text-white">
                  Triage de Errores
                </p>
              </div>
              <div className="bento-mint border bg-ink-950/85 p-3">
                <span className="bento-tag text-forge-mint">[04] CLIENTES</span>
                <p className="mt-1 text-xs font-semibold text-white">
                  Portal & Chat en Vivo
                </p>
              </div>
            </div>
          </section>

          {/* Celda Bento: Acceso OAuth */}
          <section className="bento-cell bento-magenta relative flex flex-col justify-between overflow-hidden shadow-neon-violet md:col-span-5">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-pink-500/15 via-violet-600/10 to-transparent" />

            <div className="relative">
              <div className="flex items-center justify-between border-b border-violet-500/25 pb-3">
                <span className="bento-tag text-pink-400">
                  AUTH // ACCESO SOCIOS
                </span>
                <span className="border border-forge-gold/40 bg-forge-gold/10 px-2 py-0.5 font-mono text-[10px] font-semibold text-forge-gold">
                  OAUTH 2.0
                </span>
              </div>

              <div className="mt-5 flex items-center gap-3.5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/forge-sh-icon.svg"
                  alt="FORGE/SH Icon"
                  className="h-12 w-12 border border-pink-500/40 bg-ink-950 p-1.5 shadow-neon-violet"
                />
                <div>
                  <h2 className="text-base font-bold uppercase tracking-wide text-white">
                    Autenticación requerida
                  </h2>
                  <p className="mt-0.5 font-mono text-[11px] uppercase tracking-wider text-brand-300">
                    Credenciales de socio · FORGE/SH
                  </p>
                </div>
              </div>

              <p className="mt-4 text-xs leading-relaxed text-slate-300">
                Conecta tu cuenta autorizada de GitHub para acceder al centro de
                comando, repositorios y tableros de ingeniería.
              </p>

              {error && ERRORS[error] && (
                <p className="mt-4 border border-pink-500/50 bg-pink-500/15 px-3 py-2 text-xs text-pink-300">
                  {ERRORS[error]}
                </p>
              )}
            </div>

            <div className="relative mt-6">
              <a
                href="/api/auth/github"
                className="btn-primary w-full justify-center py-3 text-sm"
              >
                <GithubMark />
                Entrar con GitHub
              </a>
              <p className="mt-3 text-center font-mono text-[11px] text-slate-400">
                Acceso restringido a los socios autorizados de{" "}
                <span className="text-brand-400">forge-sh.dev</span>
              </p>
            </div>
          </section>

          {/* Celda Bento: Telemetría y Paleta de Marca FORGE/SH */}
          <section className="bento-cell bento-gold relative flex flex-col justify-between gap-3 overflow-hidden py-4 md:col-span-5">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-forge-orange/10 via-violet-600/10 to-brand-500/10" />
            <div className="relative flex items-center justify-between">
              <div>
                <span className="bento-tag text-forge-gold">NODO OFICIAL</span>
                <p className="mt-0.5 font-mono text-sm font-bold text-gradient">
                  forge-sh.dev
                </p>
              </div>
              <div className="text-right">
                <span className="bento-tag text-brand-300">ARQUITECTURA</span>
                <p className="mt-0.5 font-mono text-xs text-slate-300">
                  EDGE · D1 · DURABLE OBJECTS
                </p>
              </div>
            </div>

            {/* Espectro cromático oficial FORGE/SH */}
            <div className="relative border-t border-violet-500/25 pt-2.5">
              <div className="mb-1.5 flex items-center justify-between font-mono text-[9px] uppercase tracking-widest text-slate-400">
                <span>FORGE/SH CHROMATIC SYSTEM</span>
                <span className="text-forge-mint">6 CHANNELS</span>
              </div>
              <div className="grid grid-cols-6 gap-1">
                <div className="h-1.5 bg-[#C81DF5]" title="Neon Magenta #C81DF5" />
                <div className="h-1.5 bg-[#7B2CBF]" title="Forge Violet #7B2CBF" />
                <div className="h-1.5 bg-[#00D2FF]" title="Electric Cyan #00D2FF" />
                <div className="h-1.5 bg-[#14F1C9]" title="Forge Mint #14F1C9" />
                <div className="h-1.5 bg-[#FFD13B]" title="Crucible Gold #FFD13B" />
                <div className="h-1.5 bg-[#FF7B1C]" title="Crucible Orange #FF7B1C" />
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

function GithubMark() {
  return (
    <svg viewBox="0 0 16 16" className="h-5 w-5 fill-current" aria-hidden>
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0016 8c0-4.42-3.58-8-8-8z" />
    </svg>
  );
}
