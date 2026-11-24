"use client";

import { useEffect, useState } from "react";

export function PublicLinkPanel({
  token,
  active,
}: {
  token: string;
  active: boolean;
}) {
  const [url, setUrl] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setUrl(`${window.location.origin}/p/${token}`);
  }, [token]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard blocked */
    }
  }

  return (
    <section className="bento-cell">
      <div className="flex items-center justify-between border-b border-white/10 pb-2">
        <span className="bento-tag">SHARE // LINK PÚBLICO</span>
        <span
          className={`font-mono text-[10px] font-bold uppercase tracking-widest ${
            active ? "text-forge-mint" : "text-pink-400"
          }`}
        >
          {active ? "ACTIVO" : "DESACTIVADO"}
        </span>
      </div>
      <div className="mt-3 flex gap-2">
        <input readOnly value={url} className="input flex-1 truncate font-mono text-xs" />
        <button onClick={copy} className="btn-ghost shrink-0 text-xs">
          {copied ? "¡Copiado!" : "Copiar"}
        </button>
      </div>
    </section>
  );
}
