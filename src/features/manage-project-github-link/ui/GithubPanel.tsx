"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createRepoForIdeaAction, linkExistingRepoAction } from "@/app/admin/actions/github";
import { refreshProjectProgressAction } from "@/app/admin/actions/proyectos";

export function GithubPanel({
  projectId,
  repoGithub,
  creatorLogin,
}: {
  projectId: string;
  repoGithub: string | null;
  installationId: number | null;
  milestoneId: number | null;
  milestoneTitle: string | null;
  creatorLogin: string | null;
}) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [linking, setLinking] = useState(false);
  const [repo, setRepo] = useState(repoGithub ?? "");

  function createRepo() {
    setError(null);
    start(async () => {
      const res = await createRepoForIdeaAction(projectId);
      if (!res.ok) setError(res.error ?? "Error");
      router.refresh();
    });
  }

  function linkExisting() {
    setError(null);
    start(async () => {
      const res = await linkExistingRepoAction(projectId, repo);
      if (!res.ok) {
        setError(res.error ?? "Error");
      } else {
        setLinking(false);
      }
      router.refresh();
    });
  }

  function refresh() {
    start(async () => {
      await refreshProjectProgressAction(projectId);
      router.refresh();
    });
  }

  return (
    <section className="bento-cell flex h-full flex-col justify-between">
      <div>
        <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
          <span className="bento-tag">INTEGRACIÓN // GITHUB</span>
          {repoGithub && (
            <button
              onClick={refresh}
              disabled={pending}
              className="font-mono text-xs font-medium text-brand-400 hover:underline disabled:opacity-50"
            >
              Recalcular progreso
            </button>
          )}
        </div>

        {repoGithub ? (
          <div className="mt-3 flex items-center gap-2 rounded-none border border-brand-500/30 bg-brand-500/10 px-3 py-2.5">
            <span className="h-2 w-2 rounded-none bg-brand-500" />
            <a
              href={`https://github.com/${repoGithub}`}
              target="_blank"
              rel="noreferrer"
              className="font-mono text-sm text-brand-300 hover:underline"
            >
              {repoGithub}
            </a>
          </div>
        ) : (
          <div className="mt-3">
            <p className="text-xs leading-relaxed text-slate-400">
              Cuando la idea esté lista, crea el repositorio en la cuenta del
              <strong className="text-slate-200"> creador de la idea</strong>, o
              vincula uno que ya exista.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                onClick={createRepo}
                disabled={pending || !creatorLogin}
                className="btn-primary text-xs"
              >
                {pending ? "Creando…" : "Crear repositorio"}
              </button>
              <button
                onClick={() => setLinking((v) => !v)}
                disabled={!creatorLogin}
                className="btn-ghost text-xs"
              >
                Vincular repo existente
              </button>
            </div>
            {!creatorLogin && (
              <p className="mt-2 font-mono text-xs text-amber-400">
                El creador de la idea debe conectar su GitHub en Perfil antes de
                crear o vincular un repo.
              </p>
            )}
            {creatorLogin && !linking && (
              <p className="mt-2 font-mono text-xs text-slate-500">
                Se creará como <span className="text-slate-300">@{creatorLogin}</span> ·
                privado.
              </p>
            )}
          </div>
        )}

        {error && (
          <p className="mt-3 rounded-none border border-pink-500/40 bg-pink-500/10 px-3 py-2 text-xs text-pink-400">
            {error}
          </p>
        )}

        {/* Vincular repo existente por OAuth (sin Installation ID) */}
        {linking && (
          <div className="mt-3 border-t border-white/10 pt-3">
            <label className="block">
              <span className="label">Repositorio existente (owner/repo o URL)</span>
              <input
                value={repo}
                onChange={(e) => setRepo(e.target.value)}
                placeholder="JaimeCordero26/mi-repo"
                autoFocus
                className="input"
              />
            </label>
            <p className="mt-1.5 font-mono text-xs text-slate-500">
              Debe pertenecer a{" "}
              <span className="text-slate-300">@{creatorLogin}</span> o ser accesible
              con su cuenta.
            </p>
            <div className="mt-3 flex gap-2">
              <button
                onClick={linkExisting}
                disabled={pending || !repo.trim()}
                className="btn-primary text-xs"
              >
                {pending ? "Vinculando…" : "Vincular y calcular"}
              </button>
              <button
                type="button"
                onClick={() => setLinking(false)}
                className="btn-ghost text-xs"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Cuando ya hay repo, permitir cambiarlo */}
      {repoGithub && !linking && (
        <button
          onClick={() => {
            setRepo("");
            setLinking(true);
          }}
          className="mt-4 self-start font-mono text-xs uppercase tracking-wider text-slate-500 hover:text-slate-300"
        >
          Vincular otro repo ›
        </button>
      )}
    </section>
  );
}
