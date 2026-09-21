"use client";

import { useMemo, useState, useTransition } from "react";
import toast from "react-hot-toast";
import Copiable from "@/components/Copiable";
import { copiarPlantillaAccion, desvincularCarpetaAccion } from "@/app/acciones";
import { aSlug, esSlug } from "@/libs/slug.mjs";
import { fechaCorta } from "@/libs/formato";

export default function SeccionPlantilla({ candidato, plantillas, cliente, carpetaPerdida }) {
  const [origen, setOrigen] = useState("");
  const [carpeta, setCarpeta] = useState(() => aSlug(candidato.nombre));
  const [filtro, setFiltro] = useState("");
  const [trabajando, empezar] = useTransition();

  const visibles = useMemo(() => {
    const aguja = filtro.trim().toLowerCase();
    if (!aguja) return plantillas;
    return plantillas.filter((p) => `${p.carpeta} ${p.descripcion}`.toLowerCase().includes(aguja));
  }, [filtro, plantillas]);

  if (carpetaPerdida) {
    return (
      <div className="rounded-box border border-error/40 bg-error/10 p-4 text-sm">
        <p>
          La tarjeta apunta a <code className="font-mono">apps/clients/{candidato.carpeta}</code>, pero esa carpeta ya
          no existe. Si la renombraste, vuelve a ponerle su nombre; si la borraste, desvincúlala y copia otra plantilla.
        </p>
        <button
          type="button"
          disabled={trabajando}
          onClick={() =>
            empezar(async () => {
              const r = await desvincularCarpetaAccion(candidato.id);
              if (!r.ok) toast.error(r.error);
            })
          }
          className="btn btn-sm btn-outline btn-error mt-3"
        >
          Desvincular la carpeta
        </button>
      </div>
    );
  }

  if (candidato.carpeta && cliente) {
    return (
      <div className="space-y-4 text-sm">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 font-mono text-xs">
          <span className="text-base-content/50">{candidato.plantilla}</span>
          <span className="text-base-content/40">→</span>
          <span className="text-base-content">apps/clients/{candidato.carpeta}</span>
          <span className="font-sans text-base-content/50">· copiada el {fechaCorta(candidato.copiada)}</span>
        </div>

        <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-[auto_1fr] sm:items-center">
          <dt className="text-xs text-base-content/50">Levantarla</dt>
          <dd>
            <Copiable texto={`pnpm --filter ${cliente.paquete} dev`} />
          </dd>
          <dt className="text-xs text-base-content/50">Abrirla en Claude</dt>
          <dd>
            <Copiable texto={`claude "Sigamos con apps/clients/${candidato.carpeta}"`} />
          </dd>
          <dt className="text-xs text-base-content/50">Clave de la demo</dt>
          <dd>
            {cliente.clave ? (
              <Copiable texto={cliente.clave} oculto />
            ) : (
              <span className="text-xs text-base-content/50">
                Sin <code className="font-mono">DEMO_PASSWORD</code> en su .env.local
              </span>
            )}
          </dd>
        </dl>
      </div>
    );
  }

  const destino = aSlug(carpeta);
  const lista = esSlug(destino) && origen;

  function copiar() {
    empezar(async () => {
      const r = await copiarPlantillaAccion(candidato.id, origen, destino);
      if (!r.ok) toast.error(r.error);
      else toast.success(`Copiada en apps/clients/${r.carpeta}`);
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-base-content/60">Elige el proyecto que más se parezca a lo que hay que venderle.</p>
        <input
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          placeholder="Filtrar…"
          className="input input-sm w-40"
        />
      </div>

      <div role="radiogroup" aria-label="Plantilla" className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
        {visibles.map((p) => {
          const elegida = origen === p.ruta;
          return (
            <button
              key={p.ruta}
              type="button"
              role="radio"
              aria-checked={elegida}
              onClick={() => setOrigen(p.ruta)}
              className={`rounded-box border p-3 text-left transition-colors ${
                elegida ? "border-primary bg-primary/10" : "border-base-300 bg-base-100 hover:border-base-content/30"
              }`}
            >
              <div className="flex items-center gap-1.5">
                <span className="truncate font-mono text-xs font-medium">{p.carpeta}</span>
                {p.grupo === "base" && <Marca>en blanco</Marca>}
                {p.tieneDemo && <Marca>demo</Marca>}
                {p.tieneSupabase && <Marca>supabase</Marca>}
              </div>
              <p className="mt-1.5 line-clamp-3 text-xs leading-snug text-base-content/55">
                {p.descripcion || "Sin descripción en su package.json."}
              </p>
            </button>
          );
        })}
        {!visibles.length && <p className="text-sm text-base-content/50">Ninguna plantilla con ese nombre.</p>}
      </div>

      <div className="flex flex-wrap items-end gap-3 border-t border-base-300/70 pt-4">
        <label className="min-w-56 flex-1">
          <span className="mb-1.5 block text-xs text-base-content/55">Carpeta nueva</span>
          <span className="flex items-center rounded-field border border-base-300 bg-base-100 pl-2.5 font-mono text-xs focus-within:border-base-content/40">
            <span className="text-base-content/50">apps/clients/</span>
            <input
              value={carpeta}
              onChange={(e) => setCarpeta(e.target.value)}
              onBlur={() => setCarpeta(aSlug(carpeta))}
              spellCheck={false}
              className="h-8 min-w-0 flex-1 bg-transparent pr-2 outline-none"
            />
          </span>
        </label>
        <button type="button" disabled={!lista || trabajando} onClick={copiar} className="btn btn-sm btn-primary">
          {trabajando ? "Copiando…" : "Copiar plantilla"}
        </button>
      </div>

      <p className="text-xs leading-relaxed text-base-content/50">
        Copia la carpeta entera y renombra el paquete. Se quedan fuera <code className="font-mono">node_modules</code>,{" "}
        <code className="font-mono">.next</code>, <code className="font-mono">.turbo</code>,{" "}
        <code className="font-mono">.vercel</code> —que ataría la copia al proyecto de Vercel del original— y{" "}
        <code className="font-mono">docs/fuentes</code>, que es el material del otro negocio.
      </p>
    </div>
  );
}

function Marca({ children }) {
  return (
    <span className="shrink-0 rounded-selector bg-base-300/70 px-1.5 py-0.5 text-[0.625rem] uppercase tracking-wide text-base-content/60">
      {children}
    </span>
  );
}
