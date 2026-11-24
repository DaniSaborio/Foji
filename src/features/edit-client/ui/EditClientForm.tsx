"use client";

import { useRouter } from "next/navigation";
import { updateClientAction } from "@/app/admin/actions/clientes";
import type { Client } from "@/entities/client/model/types";

export function EditClientForm({ client }: { client: Client }) {
  const router = useRouter();
  return (
    <form
      action={async (fd) => {
        await updateClientAction(client.id, fd);
        router.refresh();
      }}
      className="bento-cell grid grid-cols-1 gap-3"
    >
      <div className="border-b border-white/10 pb-2.5">
        <span className="bento-tag">DATOS // FICHA TÉCNICA</span>
        <h2 className="mt-0.5 text-sm font-bold uppercase tracking-wider text-white">
          Editar cliente
        </h2>
      </div>
      <label className="block">
        <span className="label">Nombre</span>
        <input name="name" defaultValue={client.name} required className="input" />
      </label>
      <label className="block">
        <span className="label">Contacto</span>
        <input name="contact" defaultValue={client.contact ?? ""} className="input" />
      </label>
      <label className="block">
        <span className="label">Notas</span>
        <textarea
          name="notes"
          defaultValue={client.notes ?? ""}
          rows={4}
          className="input"
        />
      </label>
      <div className="pt-1">
        <button className="btn-primary w-full text-xs">Guardar cambios</button>
      </div>
    </form>
  );
}
