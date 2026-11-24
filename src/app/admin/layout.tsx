import Link from "next/link";
import { eq } from "drizzle-orm";
import { requireSession } from "@/lib/auth";
import { getDb } from "@/db";
import { githubCuentas } from "@/db/schema";
import { LogoutButton } from "@/components/logout-button";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireSession();
  const db = getDb();
  const gh = await db
    .select({ login: githubCuentas.githubLogin, avatar: githubCuentas.avatarUrl })
    .from(githubCuentas)
    .where(eq(githubCuentas.usuarioId, session.uid))
    .get();

  return (
    <div className="min-h-screen pb-10">
      <header className="sticky top-0 z-20 mx-auto max-w-7xl px-4 pt-3">
        <div className="overflow-hidden border border-violet-500/35 bg-ink-900/90 shadow-neon-violet backdrop-blur-xl">
          {/* Barra superior con el espectro de colores FORGE/SH */}
          <div className="h-1 w-full bg-forge-spectrum" />

          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Celda Marca FORGE/SH */}
            <div className="relative flex items-center justify-between border-b border-violet-500/25 bg-gradient-to-r from-violet-600/15 via-brand-500/10 to-transparent px-4 py-2.5 lg:col-span-3 lg:border-b-0 lg:border-r">
              <Link
                href="/admin"
                className="group flex items-center gap-3 tracking-tight"
              >
                <div className="relative flex h-11 w-12 shrink-0 items-center justify-center border border-brand-500/50 bg-ink-950 p-1 shadow-neon transition group-hover:border-pink-500/70">
                  <span className="pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-forge-spectrum" />
                  {/* eslint-disable-next-line @next/next/no-img-element -- next/image no funciona en el runtime de Workers */}
                  <img
                    src="/forge-sh-icon.svg"
                    alt="FORGE/SH"
                    className="h-full w-full object-contain drop-shadow-[0_0_10px_rgba(0,210,255,0.35)]"
                  />
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-black leading-none">
                      <span className="text-gradient">Fō</span>
                      <span className="text-white">ji</span>
                    </span>
                    <span className="border border-violet-500/40 bg-ink-950/90 px-1.5 py-0.5 font-mono text-[10px] font-bold tracking-wider">
                      <span className="text-white">FORGE</span>
                      <span className="text-brand-400">/</span>
                      <span className="text-pink-400">SH</span>
                    </span>
                  </div>
                  <span className="mt-1 font-mono text-[9px] font-semibold uppercase tracking-[0.2em] text-forge-gold">
                    forge-sh.dev
                  </span>
                </div>
              </Link>
              <span className="inline-flex items-center gap-1.5 border border-forge-mint/30 bg-forge-mint/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-forge-mint lg:hidden">
                <span className="h-1.5 w-1.5 bg-forge-mint" />
                SYS
              </span>
            </div>

            {/* Celda Navegación Bento con acentos cromáticos de la marca */}
            <nav className="grid grid-cols-5 divide-x divide-violet-500/20 border-b border-violet-500/25 text-xs lg:col-span-6 lg:border-b-0 lg:border-r">
              <NavLink
                href="/admin"
                index="01"
                accentText="text-brand-400"
                accentBar="bg-brand-500"
                hoverBg="hover:bg-brand-500/10"
              >
                Inicio
              </NavLink>
              <NavLink
                href="/admin/kanban"
                index="02"
                accentText="text-violet-400"
                accentBar="bg-violet-500"
                hoverBg="hover:bg-violet-500/10"
              >
                Tablero
              </NavLink>
              <NavLink
                href="/admin/bugs"
                index="03"
                accentText="text-forge-orange"
                accentBar="bg-forge-orange"
                hoverBg="hover:bg-forge-orange/10"
              >
                Errores
              </NavLink>
              <NavLink
                href="/admin/clientes"
                index="04"
                accentText="text-forge-mint"
                accentBar="bg-forge-mint"
                hoverBg="hover:bg-forge-mint/10"
              >
                Clientes
              </NavLink>
              <NavLink
                href="/admin/profile"
                index="05"
                accentText="text-forge-gold"
                accentBar="bg-forge-gold"
                hoverBg="hover:bg-forge-gold/10"
              >
                Perfil
              </NavLink>
            </nav>

            {/* Celda Estado Operador */}
            <div className="flex items-center justify-between gap-2 bg-ink-950/40 px-4 py-2.5 lg:col-span-3 lg:justify-end">
              {gh ? (
                <Link
                  href="/admin/profile"
                  className="inline-flex items-center gap-2 border border-brand-500/40 bg-brand-500/10 px-2.5 py-1 font-mono text-xs text-brand-300 shadow-neon transition hover:border-brand-400"
                >
                  <span className="h-2 w-2 bg-forge-mint" />
                  @{gh.login}
                </Link>
              ) : (
                <Link
                  href="/admin/profile"
                  className="inline-flex items-center gap-1.5 border border-forge-gold/40 bg-forge-gold/10 px-2.5 py-1 font-mono text-xs text-forge-gold hover:border-forge-gold"
                >
                  <span className="h-2 w-2 bg-forge-orange" />
                  Conectar GitHub
                </Link>
              )}
              <LogoutButton />
            </div>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 pt-4">{children}</main>
    </div>
  );
}

function NavLink({
  href,
  index,
  accentText,
  accentBar,
  hoverBg,
  children,
}: {
  href: string;
  index: string;
  accentText: string;
  accentBar: string;
  hoverBg: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`group relative flex flex-col justify-center px-3 py-2.5 text-slate-200 transition ${hoverBg} hover:text-white`}
    >
      <span
        className={`pointer-events-none absolute inset-x-0 bottom-0 h-0.5 opacity-60 transition group-hover:opacity-100 ${accentBar}`}
      />
      <span className={`font-mono text-[9px] font-bold tracking-widest ${accentText}`}>
        [{index}]
      </span>
      <span className="font-semibold uppercase tracking-wider">{children}</span>
    </Link>
  );
}
