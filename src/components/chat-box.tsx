"use client";

import { useEffect, useRef, useState } from "react";
import { formatTime } from "@/shared/lib/date";
import { useChat } from "./use-chat";
import type { ChatAuthorType, ChatMessage } from "@/entities/chat/model/types";

// Reusable chat UI. `mine` decides which side a message renders on.
export function ChatBox({
  query,
  history,
  mine,
  title,
  className,
}: {
  query: string;
  history: ChatMessage[];
  mine: ChatAuthorType;
  title?: string;
  className?: string;
}) {
  const { messages, state, send } = useChat(query, history);
  const [text, setText] = useState("");
  const listRef = useRef<HTMLDivElement>(null);
  const stickToBottom = useRef(true);
  const initialScrollDone = useRef(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-grow the textarea to fit its content (capped by max-h, then scrolls).
  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [text]);

  // Scroll only the message list (never the page). Keep the reader's position
  // when they are reading older messages, unless they just sent one.
  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    const lastIsMine = messages[messages.length - 1]?.authorType === mine;
    if (stickToBottom.current || lastIsMine) {
      el.scrollTo({
        top: el.scrollHeight,
        behavior: initialScrollDone.current ? "smooth" : "auto",
      });
    }
    initialScrollDone.current = true;
  }, [messages, mine]);

  function onListScroll() {
    const el = listRef.current;
    if (!el) return;
    stickToBottom.current =
      el.scrollHeight - el.scrollTop - el.clientHeight < 80;
  }

  function submit(e?: React.FormEvent) {
    e?.preventDefault();
    if (send(text)) setText("");
  }

  // Enter sends; Shift+Enter inserts a new line.
  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      if (state === "open") submit();
    }
  }

  return (
    <div className={`card flex flex-col overflow-hidden ${className ?? ""}`}>
      <div className="flex items-center justify-between border-b border-white/15 bg-ink-950/60 px-4 py-3">
        <div>
          <span className="bento-tag">COMMS // CANAL EN TIEMPO REAL</span>
          <h2 className="text-sm font-bold uppercase tracking-wider text-white">
            {title ?? "Chat"}
          </h2>
        </div>
        <span
          className={`flex items-center gap-1.5 border px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest ${
            state === "open"
              ? "border-brand-500/40 bg-brand-500/10 text-brand-300"
              : "border-white/15 bg-white/5 text-slate-500"
          }`}
        >
          <span
            className={`h-2 w-2 rounded-none ${
              state === "open" ? "bg-brand-500 shadow-neon" : "bg-slate-600"
            }`}
          />
          {state === "open" ? "En línea" : "Conectando…"}
        </span>
      </div>

      <div
        ref={listRef}
        onScroll={onListScroll}
        className="min-h-0 flex-1 space-y-3 overflow-y-auto p-4"
      >
        {messages.length === 0 && (
          <p className="py-8 text-center font-mono text-xs uppercase tracking-widest text-slate-500">
            No hay mensajes todavía. Escribe el primero.
          </p>
        )}
        {messages.map((m) => {
          const isMine = m.authorType === mine;
          return (
            <div
              key={m.id}
              className={`flex ${isMine ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[82%] rounded-none px-3.5 py-2.5 text-sm ${
                  isMine
                    ? "border border-brand-400/50 bg-brand-gradient-2 text-ink-950"
                    : "border border-white/15 bg-ink-950/90 text-slate-100"
                }`}
              >
                {!isMine && (
                  <div className="mb-1 font-mono text-[11px] font-semibold uppercase tracking-wider text-brand-300">
                    {m.authorName}
                  </div>
                )}
                <p className="whitespace-pre-wrap break-words">{m.text}</p>
                <time
                  className={`mt-1.5 block font-mono text-[10px] ${
                    isMine ? "text-ink-900/75" : "text-slate-500"
                  }`}
                >
                  {formatTime(m.createdAt)}
                </time>
              </div>
            </div>
          );
        })}
      </div>

      <form
        onSubmit={submit}
        className="flex items-end gap-2 border-t border-white/15 bg-ink-950/60 p-3"
      >
        <textarea
          ref={inputRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={onKeyDown}
          rows={1}
          placeholder="Escribe un mensaje…"
          className="input max-h-40 flex-1 resize-none overflow-y-auto"
        />
        <button
          type="submit"
          disabled={state !== "open"}
          className="btn-primary shrink-0"
        >
          Enviar
        </button>
      </form>
    </div>
  );
}
