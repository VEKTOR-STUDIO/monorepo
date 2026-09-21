"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { borrarMaterialAccion } from "@/app/acciones";
import { peso } from "@/libs/formato";

export default function SeccionMaterial({ candidato, material }) {
  const router = useRouter();
  const entrada = useRef(null);
  const [encima, setEncima] = useState(false);
  const [subiendo, setSubiendo] = useState(false);
  const [, empezar] = useTransition();

  async function subir(archivos) {
    const lista = Array.from(archivos || []);
    if (!lista.length) return;
    const formulario = new FormData();
    for (const archivo of lista) formulario.append("archivos", archivo);

    setSubiendo(true);
    try {
      const respuesta = await fetch(`/api/candidatos/${candidato.id}/material`, { method: "POST", body: formulario });
      const datos = await respuesta.json();
      if (!respuesta.ok) throw new Error(datos.error || "No se pudo subir.");
      toast.success(lista.length === 1 ? `«${datos.guardados[0]}» guardado.` : `${datos.guardados.length} archivos guardados.`);
      router.refresh();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSubiendo(false);
      if (entrada.current) entrada.current.value = "";
    }
  }

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={() => entrada.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setEncima(true);
        }}
        onDragLeave={() => setEncima(false)}
        onDrop={(e) => {
          e.preventDefault();
          setEncima(false);
          subir(e.dataTransfer.files);
        }}
        className={`flex w-full flex-col items-center gap-1 rounded-box border border-dashed px-4 py-7 text-center transition-colors ${
          encima ? "border-primary bg-primary/10" : "border-base-content/20 hover:border-base-content/40"
        }`}
      >
        <span className="text-sm">{subiendo ? "Subiendo…" : "Suelta aquí el material, o haz clic para elegirlo"}</span>
        <span className="text-xs text-base-content/55">
          El PDF del catálogo, capturas de su Instagram, el logotipo, el chat de WhatsApp exportado, fotos…
        </span>
      </button>
      <input ref={entrada} type="file" multiple hidden onChange={(e) => subir(e.target.files)} />

      {material.length > 0 && (
        <ul className="divide-y divide-base-300/60 rounded-box border border-base-300 bg-base-100">
          {material.map((m) => (
            <li key={m.nombre} className="flex items-center gap-3 px-3 py-2 text-sm">
              <span className="min-w-0 flex-1 truncate">{m.nombre}</span>
              <span className="shrink-0 font-mono text-xs text-base-content/50">{peso(m.peso)}</span>
              <button
                type="button"
                aria-label={`Quitar ${m.nombre}`}
                onClick={() =>
                  empezar(async () => {
                    const r = await borrarMaterialAccion(candidato.id, m.nombre);
                    if (!r.ok) toast.error(r.error);
                  })
                }
                className="btn btn-ghost btn-xs btn-square text-base-content/50 hover:text-error"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}

      <p className="text-xs leading-relaxed text-base-content/50">
        Al lanzar la rutina se copia a{" "}
        <code className="font-mono">
          apps/clients/{candidato.carpeta || "<carpeta>"}/docs/fuentes
        </code>{" "}
        junto con un <code className="font-mono">encargo.md</code> que reúne los datos, las notas y lo que pidas abajo.
        Es lo primero que lee Claude.
      </p>
    </div>
  );
}
