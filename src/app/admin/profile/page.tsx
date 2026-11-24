import { requireSession } from "@/lib/auth";
import { getProfileData } from "@/server/services/profile.service";
import { GithubAccountCard, GithubMark } from "@/entities/github-account/ui/GithubAccountCard";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const session = await requireSession();
  const { githubAccount } = await getProfileData(session.uid);

  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-12">
      {/* Celda Identidad del Operador y Marca FORGE/SH */}
      <section className="bento-cell bento-gold flex flex-col justify-between md:col-span-5">
        <div>
          <div className="flex items-center justify-between border-b border-violet-500/25 pb-2.5">
            <span className="bento-tag text-forge-gold">
              BENTO // 05 · PERFIL DE OPERADOR
            </span>
            <span className="badge border border-forge-gold/40 bg-forge-orange/15 text-forge-gold">
              SOCIO FORGE/SH
            </span>
          </div>
          <div className="mt-4 flex items-center gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/forge-sh-logo-transparent.svg"
              alt="FORGE/SH"
              className="h-16 w-auto border border-brand-500/35 bg-ink-950 p-2 shadow-neon"
            />
            <div>
              <h1 className="text-2xl font-black uppercase tracking-tight text-white">
                {session.nombre}
              </h1>
              <p className="mt-1 font-mono text-xs text-brand-300">
                {session.email}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 border-t border-violet-500/25 pt-3 font-mono text-[11px] text-slate-400">
          ID // <span className="text-violet-300">{session.uid}</span>
        </div>
      </section>

      {/* Celda Cuenta de GitHub */}
      <section className="bento-cell bento-violet flex flex-col justify-between md:col-span-7">
        <div>
          <div className="flex items-center justify-between border-b border-violet-500/25 pb-2.5">
            <span className="bento-tag text-pink-400">
              INTEGRACIÓN // CREDENCIALES OAUTH
            </span>
            <div className="flex items-center gap-1.5 text-brand-300">
              <GithubMark />
              <span className="font-mono text-xs font-bold uppercase">GitHub</span>
            </div>
          </div>
          <p className="mt-3 text-xs text-slate-300">
            Con esta cuenta se crean tus repositorios privados, se importan issues
            y se sincroniza el progreso de los proyectos.
          </p>
        </div>

        {githubAccount ? (
          <GithubAccountCard account={githubAccount} />
        ) : (
          <p className="mt-5 border border-forge-gold/40 bg-forge-orange/15 p-3 font-mono text-xs text-forge-gold">
            No hay cuenta de GitHub vinculada. Cierra sesión y vuelve a entrar con
            GitHub.
          </p>
        )}
      </section>

      {/* Fila Inferior Bento: Permisos y Capacidades */}
      <section className="bento-cell bento-cyan md:col-span-4">
        <span className="bento-tag text-brand-400">[01] REPOSITORIOS</span>
        <h3 className="mt-2 text-sm font-bold uppercase text-white">
          Creación automatizada
        </h3>
        <p className="mt-1 text-xs text-slate-300">
          Despliega repositorios privados directamente desde las tarjetas de ideas
          del tablero Kanban.
        </p>
      </section>

      <section className="bento-cell bento-magenta md:col-span-4">
        <span className="bento-tag text-pink-400">[02] ISSUES & SPRINTS</span>
        <h3 className="mt-2 text-sm font-bold uppercase text-white">
          Sincronización bidireccional
        </h3>
        <p className="mt-1 text-xs text-slate-300">
          Arrastra issues abiertos al tablero de sprints y visualiza comentarios en
          tiempo real.
        </p>
      </section>

      <section className="bento-cell bento-mint md:col-span-4">
        <span className="bento-tag text-forge-mint">[03] TELEMETRÍA</span>
        <h3 className="mt-2 text-sm font-bold uppercase text-white">
          Cálculo de avance
        </h3>
        <p className="mt-1 text-xs text-slate-300">
          Actualización de porcentaje de progreso basado en issues cerrados y
          milestones activos.
        </p>
      </section>
    </div>
  );
}
