"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClientAction } from "@/app/admin/actions/clientes";

export function CreateClientForm() {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  if (!open) {
    return (
      <div className="flex justify-end">
        <button onClick={() => setOpen(true)} className="btn-primary text-xs">
          + Nuevo cliente
        </button>
      </div>
    );
  }

  return (
    <form
      action={async (fd) => {
        await createClientAction(fd);
        setOpen(false);
        router.refresh();
      }}
      className="bento-cell grid grid-cols-1 gap-3 sm:grid-cols-2"
    >
      <div className="flex items-center justify-between border-b border-white/10 pb-2 sm:col-span-2">
        <span className="bento-tag">ALTA // NUEVO CLIENTE</span>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="font-mono text-xs text-slate-500 hover:text-white"
        >
          ✕
        </button>
      </div>
      <input
        name="name"
        placeholder="Nombre de la empresa"
        required
        className="input"
      />
      <input
        name="contact"
        placeholder="Contacto (email / teléfono)"
        className="input"
      />
      <textarea
        name="notes"
        placeholder="Notas"
        rows={2}
        className="input sm:col-span-2"
      />
      <div className="flex justify-end gap-2 sm:col-span-2">
        <button type="button" onClick={() => setOpen(false)} className="btn-ghost text-xs">
          Cancelar
        </button>
        <button className="btn-primary text-xs">Guardar</button>
      </div>
    </form>
  );
}
