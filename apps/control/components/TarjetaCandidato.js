"use client";

import Link from "next/link";
import { RUTINA } from "@/libs/etapas";
import { duracion, haceCuanto } from "@/libs/formato";

const COLOR_RUTINA = {
  "en-cola": "text-warning",
  corriendo: "text-accent",
  terminada: "text-success",
  fallida: "text-error",
  detenida: "text-base-content/50",
};

export default function TarjetaCandidato({ candidato, arrastrando, alEmpezar, alTerminar }) {
  const { rutina } = candidato;
  const corriendo = rutina.estado === "corriendo";
  const detalle = [candidato.instagram, candidato.ciudad].filter(Boolean).join(" · ");

  return (
    <Link
      href={`/candidatos/${candidato.id}`}
      // Mientras Claude trabaja la tarjeta no se mueve a mano.
      draggable={!corriendo}
      onDragStart={(e) => {
        e.dataTransfer.setData("text/plain", candidato.id);
        e.dataTransfer.effectAllowed = "move";
        alEmpezar();
      }}
      onDragEnd={alTerminar}
      className={`group relative block overflow-hidden rounded-box border bg-base-100 p-3 transition-[border-color,opacity,transform] hover:border-base-content/30 ${
        corriendo ? "border-accent/50" : "border-base-300"
      } ${arrastrando ? "scale-[0.98] opacity-40" : ""} ${corriendo ? "" : "cursor-grab active:cursor-grabbing"}`}
    >
      {corriendo && <span aria-hidden className="corriendo absolute inset-x-0 top-0 h-[3px]" />}

      <p className="text-sm font-medium leading-snug">{candidato.nombre}</p>
      {detalle && <p className="mt-0.5 truncate text-xs text-base-content/50">{detalle}</p>}

      {(candidato.rubro || candidato.carpeta) && (
        <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
          {candidato.rubro && (
            <span className="rounded-selector bg-base-300/60 px-1.5 py-0.5 text-[0.6875rem] text-base-content/70">
              {candidato.rubro}
            </span>
          )}
          {candidato.carpeta && (
            <span className="truncate font-mono text-[0.6875rem] text-base-content/55">
              clients/{candidato.carpeta}
            </span>
          )}
        </div>
      )}

      <div className="mt-2.5 flex items-center gap-2 border-t border-base-300/60 pt-2 text-[0.6875rem] text-base-content/50">
        {rutina.estado !== "inactiva" ? (
          <span className={`flex items-center gap-1.5 font-medium ${COLOR_RUTINA[rutina.estado] || ""}`}>
            {corriendo && <span className="size-1.5 animate-latido rounded-full bg-accent" />}
            {RUTINA[rutina.estado]}
            {corriendo && rutina.inicio && (
              <span className="font-mono font-normal opacity-70">{duracion(rutina.inicio)}</span>
            )}
          </span>
        ) : (
          <span>{candidato.material ? `${candidato.material} de material` : "Sin material"}</span>
        )}
        <span className="ml-auto" suppressHydrationWarning>
          {haceCuanto(candidato.actualizado)}
        </span>
      </div>
    </Link>
  );
}
