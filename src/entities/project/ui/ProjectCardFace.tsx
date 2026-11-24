import { AuthorChip } from "./AuthorChip";
import type { ProjectCard } from "../model/types";

export function ProjectCardFace({ card, dragging }: { card: ProjectCard; dragging?: boolean }) {
  return (
    <div
      className={`rounded-none border border-white/15 bg-ink-950/90 p-3.5 transition hover:border-brand-500/50 hover:shadow-neon ${
        dragging ? "border-brand-500 shadow-neon" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-bold text-white">{card.name}</p>
        {card.hasRepo && (
          <span className="badge shrink-0 border border-brand-500/40 bg-brand-500/10 text-brand-300">
            repo
          </span>
        )}
      </div>
      {card.description && (
        <p className="mt-1.5 line-clamp-2 text-xs text-slate-400">{card.description}</p>
      )}
      <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-2">
        <AuthorChip author={card.author} />
        {card.comments.length > 0 && (
          <span className="font-mono text-[11px] text-slate-400">
            💬 {card.comments.length}
          </span>
        )}
      </div>
    </div>
  );
}
