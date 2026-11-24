"use client";

import { useEffect, useState, useTransition } from "react";
import { Modal } from "@/components/modal";
import { formatDateTime } from "@/shared/lib/date";
import { getTaskIssueDetailAction } from "@/app/admin/proyectos/[id]/sprint-actions";
import type { GithubIssueComment, GithubIssueDetail } from "@/lib/github-oauth";

function Avatar({ actor }: { actor: { login: string; avatar_url: string } }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={actor.avatar_url}
      alt={actor.login}
      className="h-5 w-5 rounded-none border border-white/15"
    />
  );
}

// Fetch + render del cuerpo del issue (estado, labels, asignados, descripción,
// comentarios). Sin título ni chrome de modal, para poder incrustarse directo
// dentro de otro modal (ej. TaskModal) o envolverse en un popup propio
// (IssueDetailModal, para issues del pool que aún no son tarea).
export function IssueDetailContent({
  projectId,
  issueNumber,
  fallbackUrl,
}: {
  projectId: string;
  issueNumber: number;
  fallbackUrl: string | null;
}) {
  const [pending, start] = useTransition();
  const [detail, setDetail] = useState<GithubIssueDetail | null>(null);
  const [comments, setComments] = useState<GithubIssueComment[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    start(async () => {
      const res = await getTaskIssueDetailAction(projectId, issueNumber);
      if (res.ok) {
        setDetail(res.detail ?? null);
        setComments(res.comments ?? []);
      } else {
        setError(res.error ?? "No se pudo cargar el issue.");
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId, issueNumber]);

  return (
    <div>
      {pending && <p className="font-mono text-xs text-slate-400">Cargando issue…</p>}
      {error && <p className="font-mono text-xs text-pink-400">{error}</p>}

      {detail && (
        <>
          <div className="flex flex-wrap items-center gap-2 font-mono text-xs text-slate-400">
            <span
              className={`badge ${
                detail.state === "open"
                  ? "border border-forge-mint/40 bg-forge-mint/10 text-forge-mint"
                  : "border border-white/15 bg-white/5 text-slate-400"
              }`}
            >
              {detail.state === "open" ? "Abierto" : "Cerrado"}
            </span>
            <span>#{detail.number}</span>
            {detail.user && (
              <span className="inline-flex items-center gap-1.5">
                <Avatar actor={detail.user} />
                {detail.user.login}
              </span>
            )}
            <span>· {formatDateTime(detail.created_at)}</span>
          </div>

          {detail.labels.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {detail.labels.map((l) => (
                <span
                  key={l.name}
                  className="rounded-none px-2 py-0.5 font-mono text-[11px] font-medium uppercase"
                  style={{
                    backgroundColor: `#${l.color}26`,
                    color: `#${l.color}`,
                    border: `1px solid #${l.color}55`,
                  }}
                >
                  {l.name}
                </span>
              ))}
            </div>
          )}

          {detail.assignees.length > 0 && (
            <div className="mt-3 flex items-center gap-2 font-mono text-xs text-slate-400">
              <span>Asignados:</span>
              <div className="flex items-center gap-1.5">
                {detail.assignees.map((a) => (
                  <span key={a.login} className="inline-flex items-center gap-1">
                    <Avatar actor={a} />
                    {a.login}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="mt-4 whitespace-pre-wrap rounded-none border border-white/10 bg-ink-950/90 p-3 text-sm text-slate-300">
            {detail.body?.trim() || "Sin descripción."}
          </div>

          <a
            href={detail.html_url}
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-block font-mono text-xs font-medium text-brand-400 hover:underline"
          >
            Abrir en GitHub ↗
          </a>

          <div className="mt-5 border-t border-white/10 pt-4">
            <h4 className="mb-2 font-mono text-xs font-semibold uppercase tracking-wider text-white">
              Comentarios{comments.length > 0 ? ` (${comments.length})` : ""}
            </h4>
            {comments.length === 0 ? (
              <p className="font-mono text-xs text-slate-500">Sin comentarios.</p>
            ) : (
              <div className="flex flex-col gap-3">
                {comments.map((c) => (
                  <div
                    key={c.id}
                    className="rounded-none border border-white/10 bg-ink-950/90 p-3"
                  >
                    <div className="mb-1 flex items-center gap-1.5 font-mono text-xs text-slate-400">
                      {c.user && <Avatar actor={c.user} />}
                      <span className="font-medium text-slate-300">
                        {c.user?.login ?? "desconocido"}
                      </span>
                      <span>· {formatDateTime(c.created_at)}</span>
                    </div>
                    <p className="whitespace-pre-wrap text-sm text-slate-300">
                      {c.body?.trim() || "—"}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {!pending && error && fallbackUrl && (
        <a
          href={fallbackUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-block font-mono text-xs font-medium text-brand-400 hover:underline"
        >
          Abrir en GitHub ↗
        </a>
      )}
    </div>
  );
}

export function IssueDetailModal({
  projectId,
  issueNumber,
  title,
  fallbackUrl,
  onClose,
}: {
  projectId: string;
  issueNumber: number;
  title?: string;
  fallbackUrl: string | null;
  onClose: () => void;
}) {
  return (
    <Modal onClose={onClose} maxWidthClassName="max-w-2xl" zIndexClassName="z-[60]">
      <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-3">
        <div>
          <span className="bento-tag">GITHUB // ISSUE #{issueNumber}</span>
          <h3 className="mt-0.5 text-lg font-bold text-white">
            {title ?? `Issue #${issueNumber}`}
          </h3>
        </div>
        <button
          onClick={onClose}
          className="border border-white/15 bg-white/5 px-2 py-1 font-mono text-xs text-slate-400 hover:border-white/30 hover:text-white"
        >
          ✕
        </button>
      </div>
      <div className="mt-3">
        <IssueDetailContent
          projectId={projectId}
          issueNumber={issueNumber}
          fallbackUrl={fallbackUrl}
        />
      </div>
    </Modal>
  );
}
