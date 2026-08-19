"use client";

import { useState } from "react";
import {
  ATRIBUTOS,
  BLOQUES,
  DETALLES,
  GAS_CRITICO,
  LESIONES,
  MARCAS_MAXIMAS,
  MOVIMIENTOS,
  POSICIONES,
  TIPOS,
  ESTILOS,
  gasMaximo,
} from "@/libs/camino-negro";

// HUD del jugador en CAMINO NEGRO: gas, atributos, marcas y la ficha completa
// (técnicas, detalles y lesiones) escondida detrás de un botón, como la
// pantalla de estado de cualquier juego de rol.
export default function CaminoNegroHud({ corrida }) {
  const [abierta, setAbierta] = useState(false);

  const techo = gasMaximo(corrida);
  const gas = Math.round((corrida.gas / techo) * 100);
  const bloque = BLOQUES[corrida.bloque];
  const noches = corrida.mapa[corrida.bloque]?.pasos.length ?? 5;

  return (
    <div className="border-2 border-base-300 bg-base-200">
      <div className="flex items-center justify-between gap-2 border-b border-base-300 px-3 py-2">
        <span className="tag-skew bg-primary px-2 py-0.5 text-[0.6rem] text-primary-content">
          <span>{ESTILOS[corrida.estilo].name}</span>
        </span>
        <span className="text-[0.6rem] font-black uppercase tracking-[0.2em] opacity-60">
          Bloque {corrida.bloque + 1} · {bloque.nombre} · Noche{" "}
          {Math.min(corrida.paso + 1, noches)}/{noches}
        </span>
      </div>

      <div className="space-y-3 p-3">
        {/* Gas: la vida de la corrida. No se rellena solo entre topes. */}
        <div>
          <div className="mb-1 flex items-end justify-between">
            <span className="text-[0.6rem] font-black uppercase tracking-[0.25em] opacity-60">
              Gas
            </span>
            <span className="display text-lg">
              {corrida.gas}
              <span className="text-xs opacity-50">/{techo}</span>
            </span>
          </div>
          <div className={`cn-bar ${corrida.gas < GAS_CRITICO ? "cn-bar-bajo" : ""}`}>
            <div className="cn-bar-fill" style={{ width: `${Math.max(gas, 0)}%` }} />
          </div>
        </div>

        <div className="grid grid-cols-4 gap-1.5">
          {Object.entries(ATRIBUTOS).map(([key, attr]) => (
            <div key={key} className="border border-base-300 bg-base-100 px-2 py-1.5 text-center">
              <p className="text-[0.55rem] font-black uppercase tracking-[0.15em] opacity-50">
                {attr.short}
              </p>
              <p className="display text-xl text-primary">{corrida.atributos[key]}</p>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between gap-2">
          {/* Marcas: topes perdidos. A la tercera se acaba la corrida. */}
          <div className="flex items-center gap-1.5">
            <span className="text-[0.55rem] font-black uppercase tracking-[0.2em] opacity-50">
              Topes perdidos
            </span>
            <span className="flex gap-1">
              {Array.from({ length: MARCAS_MAXIMAS }).map((_, i) => (
                <span
                  key={i}
                  className={`h-3 w-3 border ${
                    i < corrida.marcas
                      ? "border-accent bg-accent"
                      : "border-base-300 bg-base-100"
                  }`}
                />
              ))}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setAbierta((v) => !v)}
            className="text-[0.6rem] font-black uppercase tracking-[0.2em] text-primary"
          >
            {abierta ? "Cerrar ficha" : "Ver ficha"}
          </button>
        </div>

        {abierta && (
          <div className="space-y-3 border-t border-base-300 pt-3">
            <Seccion titulo={`Detalles (${corrida.detalles.length})`}>
              {corrida.detalles.length ? (
                corrida.detalles.map((key) => (
                  <li key={key} className="border-l-2 border-primary pl-2">
                    <p className="text-xs font-black uppercase tracking-wider">
                      {DETALLES[key].name}
                    </p>
                    <p className="text-[0.7rem] opacity-60">{DETALLES[key].desc}</p>
                  </li>
                ))
              ) : (
                <li className="text-[0.7rem] opacity-50">Todavía nadie te ha corregido nada.</li>
              )}
            </Seccion>

            <Seccion titulo={`Lesiones (${corrida.lesiones.length})`}>
              {corrida.lesiones.length ? (
                corrida.lesiones.map((key) => (
                  <li key={key} className="border-l-2 border-accent pl-2">
                    <p className="text-xs font-black uppercase tracking-wider">
                      {LESIONES[key].name}
                    </p>
                    <p className="text-[0.7rem] opacity-60">{LESIONES[key].desc}</p>
                  </li>
                ))
              ) : (
                <li className="text-[0.7rem] opacity-50">Entero.</li>
              )}
            </Seccion>

            <Seccion titulo={`Movelist (${corrida.movimientos.length})`}>
              <li className="flex flex-wrap gap-1">
                {corrida.movimientos.map((key) => (
                  <span
                    key={key}
                    title={`${POSICIONES[MOVIMIENTOS[key].from === "todas" ? "pie" : MOVIMIENTOS[key].from[0]].name} · ${TIPOS[MOVIMIENTOS[key].tipo].label}`}
                    className="border border-base-300 bg-base-100 px-1.5 py-0.5 text-[0.65rem] font-semibold"
                  >
                    {MOVIMIENTOS[key].name}
                  </span>
                ))}
              </li>
            </Seccion>
          </div>
        )}
      </div>
    </div>
  );
}

function Seccion({ titulo, children }) {
  return (
    <div>
      <p className="mb-1.5 text-[0.6rem] font-black uppercase tracking-[0.25em] opacity-50">
        {titulo}
      </p>
      <ul className="space-y-1.5">{children}</ul>
    </div>
  );
}
