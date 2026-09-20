"use client";

import { useActionState, useRef, useState } from "react";
import { analizarPdf, aplicarImportacion } from "@/app/admin/acciones";
import AvisoBloqueado from "@/components/demo/AvisoBloqueado";
import { enDolares } from "@/libs/formato";
import { esDemo } from "@/libs/demo";

/**
 * Subir el PDF nuevo y ver qué cambia antes de tocar nada.
 *
 * Dos pasos a propósito: primero "analizar", que solo lee y compara, y luego
 * "aplicar", que ya escribe. El mismo archivo se manda dos veces (lo guarda el
 * input) para no tener que dejar el PDF a medias en ningún sitio.
 */
export default function ImportadorPdf() {
  const formulario = useRef(null);
  const [archivo, setArchivo] = useState(null);
  const [subirFotos, setSubirFotos] = useState(true);

  const [analisis, analizar, analizando] = useActionState(analizarPdf, null);
  const [aplicado, aplicar, aplicando] = useActionState(aplicarImportacion, null);
  // Analizar sí funciona en la demo: lee el PDF y compara, sin escribir nada.
  // Lo que no se puede es aplicar.
  const demo = esDemo();

  const resumen = analisis?.ok ? analisis.resumen : null;

  return (
    <div className="space-y-6">
      <form ref={formulario} action={analizar} className="ficha p-6">
        <h2 className="rotulo mb-4">1 · El PDF</h2>

        <label className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-base-content/15 px-6 py-10 text-center transition-colors hover:border-primary/50 hover:bg-primary/4">
          <input
            type="file"
            name="pdf"
            accept="application/pdf,.pdf"
            required
            onChange={(e) => setArchivo(e.target.files?.[0] || null)}
            className="sr-only"
          />
          <span className="text-3xl" aria-hidden="true">
            📄
          </span>
          {archivo ? (
            <>
              <span className="text-sm font-medium">{archivo.name}</span>
              <span className="cifra text-xs text-base-content/45">
                {(archivo.size / 1024 / 1024).toFixed(1)} MB · pulsa para cambiarlo
              </span>
            </>
          ) : (
            <>
              <span className="text-sm font-medium">Arrastra aquí el catálogo, o pulsa</span>
              <span className="text-xs text-base-content/45">
                El PDF de siempre, el que mandan por WhatsApp
              </span>
            </>
          )}
        </label>

        {!demo && (
        <label className="mt-4 flex items-start gap-3 text-sm">
          <input
            type="checkbox"
            name="subirFotos"
            checked={subirFotos}
            onChange={(e) => setSubirFotos(e.target.checked)}
            className="mt-0.5 size-4 accent-primary"
          />
          <span>
            Subir también las fotos que falten
            <span className="block text-xs text-base-content/45">
              Solo de los productos que aún no tienen foto. Las que ya están no se tocan.
            </span>
          </span>
        </label>
        )}

        <button type="submit" disabled={!archivo || analizando} className="btn btn-primary mt-5">
          {analizando ? "Leyendo el PDF…" : "Analizar"}
        </button>

        {analisis && !analisis.ok && (
          <p className="mt-4 rounded-lg border border-error/40 bg-error/8 px-3.5 py-2.5 text-sm text-error">
            {analisis.error}
          </p>
        )}
      </form>

      {resumen && (
        <div className="ficha p-6">
          <h2 className="rotulo mb-4">2 · Qué va a cambiar</h2>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Dato valor={resumen.total} etiqueta="productos en el PDF" />
            <Dato valor={resumen.totalNuevos} etiqueta="nuevos" acento />
            <Dato valor={resumen.totalCambios} etiqueta="con cambios" acento />
            <Dato valor={resumen.totalDesaparecidos} etiqueta="ya no vienen" />
          </div>

          {resumen.primeraVez && (
            <p className="mt-4 rounded-lg border border-info/30 bg-info/8 px-3.5 py-2.5 text-xs text-info">
              La base está vacía: esta importación carga el catálogo completo.
            </p>
          )}

          {resumen.totalCambios > 0 && (
            <Lista titulo={`Cambios de precio o estado (${resumen.totalCambios})`}>
              {resumen.cambios.map((p) => (
                <li key={p.slug} className="py-2.5">
                  <p className="text-sm">{p.nombre}</p>
                  <p className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs">
                    {p.diferencias.map((d) => (
                      <span key={d.etiqueta} className="cifra text-base-content/50">
                        {d.etiqueta}:{" "}
                        <span className="text-base-content/35 line-through">
                          {typeof d.antes === "number" ? enDolares(d.antes) : d.antes}
                        </span>{" "}
                        <span className="text-primary">
                          {typeof d.ahora === "number" ? enDolares(d.ahora) : d.ahora}
                        </span>
                      </span>
                    ))}
                  </p>
                </li>
              ))}
            </Lista>
          )}

          {resumen.totalNuevos > 0 && (
            <Lista titulo={`Productos nuevos (${resumen.totalNuevos})`}>
              {resumen.nuevos.map((p) => (
                <li key={p.slug} className="flex justify-between gap-4 py-2 text-sm">
                  <span className="min-w-0 truncate">{p.nombre}</span>
                  <span className="cifra shrink-0 text-primary">{enDolares(p.precioContado)}</span>
                </li>
              ))}
            </Lista>
          )}

          {resumen.totalDesaparecidos > 0 && (
            <Lista titulo={`Ya no vienen en la lista (${resumen.totalDesaparecidos})`}>
              <li className="pb-2 text-xs text-base-content/45">
                No se borran: se ocultan de la tienda para no romper los pedidos viejos.
              </li>
              {resumen.desaparecidos.map((p) => (
                <li key={p.slug} className="py-2 text-sm text-base-content/55">
                  {p.nombre}
                </li>
              ))}
            </Lista>
          )}

          {demo ? (
            <AvisoBloqueado titulo="Hasta aquí llega la demo" className="mt-6">
              Acabas de ver lo que de verdad importa: el PDF leído y comparado con la tienda.
              En el sistema instalado, el siguiente botón aplica todos esos cambios al catálogo
              de una vez.
            </AvisoBloqueado>
          ) : (
          <form
            action={aplicar}
            className="mt-6 flex flex-wrap items-center gap-3 border-t border-base-content/10 pt-5"
          >
            {/* El mismo archivo otra vez: el input lo conserva. */}
            <input
              type="file"
              name="pdf"
              className="sr-only"
              ref={(nodo) => {
                if (nodo && archivo) {
                  const lista = new DataTransfer();
                  lista.items.add(archivo);
                  nodo.files = lista.files;
                }
              }}
            />
            {subirFotos && <input type="hidden" name="subirFotos" value="on" />}

            <button type="submit" disabled={aplicando} className="btn btn-primary">
              {aplicando ? "Aplicando…" : "Aplicar al catálogo"}
            </button>
            <span className="text-xs text-base-content/45">
              Se actualizan precios, estados y productos nuevos.
            </span>
          </form>
          )}

          {aplicado && !aplicado.ok && (
            <p className="mt-4 rounded-lg border border-error/40 bg-error/8 px-3.5 py-2.5 text-sm text-error">
              {aplicado.error}
            </p>
          )}

          {aplicado?.ok && (
            <div className="mt-4 rounded-lg border border-success/40 bg-success/8 px-4 py-3 text-sm text-success">
              <p className="font-medium">Catálogo actualizado.</p>
              <p className="mt-1 text-xs">
                {aplicado.aplicado.nuevos} nuevos · {aplicado.aplicado.actualizados} actualizados ·{" "}
                {aplicado.aplicado.desactivados} ocultados
                {aplicado.aplicado.fotosSubidas > 0 && ` · ${aplicado.aplicado.fotosSubidas} fotos subidas`}
              </p>
              {aplicado.aplicado.fotosPendientes > 0 && (
                <p className="mt-1.5 text-xs text-warning">
                  Quedan {aplicado.aplicado.fotosPendientes} fotos por subir. Vuelve a aplicar la
                  importación para continuar con la siguiente tanda.
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Dato({ valor, etiqueta, acento }) {
  return (
    <div className="rounded-lg border border-base-content/10 bg-base-200/40 px-4 py-3">
      <p className={`cifra text-2xl font-bold leading-none ${acento && valor > 0 ? "text-primary" : ""}`}>
        {valor}
      </p>
      <p className="mt-1.5 text-[0.7rem] text-base-content/45">{etiqueta}</p>
    </div>
  );
}

function Lista({ titulo, children }) {
  return (
    <details className="mt-5 rounded-lg border border-base-content/10">
      <summary className="cursor-pointer px-4 py-3 text-sm font-medium">{titulo}</summary>
      <ul className="max-h-80 divide-y divide-base-content/8 overflow-y-auto px-4 pb-3">{children}</ul>
    </details>
  );
}
