"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Copiable from "@/components/Copiable";
import Registro from "@/components/Registro";
import { detenerRutinaAccion, moverCandidatoAccion } from "@/app/acciones";
import { RUTINA } from "@/libs/etapas";
import { duracion } from "@/libs/formato";

const COLOR = {
  inactiva: "border-base-300 text-base-content/50",
  "en-cola": "border-warning/40 bg-warning/10 text-warning",
  corriendo: "border-accent/50 bg-accent/10 text-accent",
  terminada: "border-success/40 bg-success/10 text-success",
  fallida: "border-error/40 bg-error/10 text-error",
  detenida: "border-base-300 text-base-content/60",
};

const MODO = {
  acceptEdits: "edita sin preguntar y solo ejecuta los comandos de su lista",
  bypassPermissions: "sin preguntas ni lista de comandos",
  auto: "permisos automáticos",
  dontAsk: "lo que pediría permiso, se deniega",
};

export default function SeccionRutina({ candidato, cliente, modo, antesDeLanzar }) {
  const router = useRouter();
  const { rutina } = candidato;
  const activa = rutina.estado === "en-cola" || rutina.estado === "corriendo";
  const [trabajando, empezar] = useTransition();

  // El cronómetro de la rutina en marcha.
  const [, tic] = useState(0);
  useEffect(() => {
    if (rutina.estado !== "corriendo") return;
    const reloj = setInterval(() => tic((n) => n + 1), 1000);
    return () => clearInterval(reloj);
  }, [rutina.estado]);

  function lanzar() {
    const seguro = window.confirm(
      `Esto lanza la rutina de Claude sobre apps/clients/${candidato.carpeta} con la skill demo-de-venta.\n\n¿La lanzo?`
    );
    if (!seguro) return;
    empezar(async () => {
      // Lo que esté escrito sin guardar —el encargo, sobre todo— tiene que
      // llegar a disco antes: la rutina lo lee de ahí.
      if (!(await antesDeLanzar())) return;
      const r = await moverCandidatoAccion(candidato.id, "por-hacer");
      if (!r.ok) toast.error(r.error);
      else toast.success("En la cola de la rutina.");
    });
  }

  function parar() {
    if (!window.confirm("¿Detengo la rutina? Lo que Claude ya haya cambiado en la carpeta se queda como esté.")) return;
    empezar(async () => {
      const r = await detenerRutinaAccion(candidato.id);
      if (!r.ok) toast.error(r.error);
      router.refresh();
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <span className={`flex items-center gap-2 rounded-field border px-2.5 py-1 text-xs font-medium ${COLOR[rutina.estado]}`}>
          {rutina.estado === "corriendo" && <span className="size-1.5 animate-latido rounded-full bg-accent" />}
          {RUTINA[rutina.estado]}
        </span>

        {rutina.inicio && (
          <span className="font-mono text-xs text-base-content/50" suppressHydrationWarning>
            {duracion(rutina.inicio, rutina.fin)}
          </span>
        )}
        {rutina.turnos != null && <span className="font-mono text-xs text-base-content/50">{rutina.turnos} turnos</span>}
        {rutina.costo != null && (
          <span className="font-mono text-xs text-base-content/50">${rutina.costo.toFixed(2)}</span>
        )}

        <div className="ml-auto flex items-center gap-2">
          {activa ? (
            <button type="button" disabled={trabajando} onClick={parar} className="btn btn-sm btn-outline btn-error">
              {rutina.estado === "en-cola" ? "Sacar de la cola" : "Detener"}
            </button>
          ) : (
            <button
              type="button"
              disabled={trabajando || !cliente}
              onClick={lanzar}
              className="btn btn-sm btn-primary"
            >
              {rutina.estado === "inactiva" ? "Pasar a «Por hacer» y lanzar" : "Volver a lanzar"}
            </button>
          )}
        </div>
      </div>

      {!cliente && (
        <p className="text-sm text-base-content/50">
          La rutina trabaja sobre una carpeta: primero cópiale una plantilla en el paso 02.
        </p>
      )}

      {rutina.estado === "fallida" && rutina.error && (
        <p className="rounded-box border border-error/40 bg-error/10 px-3 py-2.5 text-sm text-error">{rutina.error}</p>
      )}

      {rutina.estado === "terminada" && rutina.resumen && (
        <div className="rounded-box border border-success/30 bg-success/5 px-4 py-3">
          <p className="rotulo mb-2 text-[0.625rem] text-success">Lo que dice Claude</p>
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-base-content/85">{rutina.resumen}</p>
        </div>
      )}

      <Registro id={candidato.id} activa={activa} estado={rutina.estado} alCambiar={() => router.refresh()} />

      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-base-content/55">
        <span>
          Permisos: <span className="font-mono text-base-content/65">{modo}</span> — {MODO[modo] || ""}
        </span>
        {cliente && (
          <span>
            Prueba en el puerto <span className="font-mono text-base-content/65">{cliente.puerto}</span>
          </span>
        )}
      </div>

      {rutina.sesion && !activa && (
        <div className="flex flex-wrap items-center gap-3 border-t border-base-300/70 pt-4">
          <span className="text-xs text-base-content/55">Seguir la misma conversación en la terminal</span>
          <Copiable texto={`claude --resume ${rutina.sesion}`} />
        </div>
      )}

      {cliente?.pendientes && (
        <details className="rounded-box border border-base-300 bg-base-100" open={candidato.etapa === "revision"}>
          <summary className="cursor-pointer px-4 py-2.5 text-sm">
            <span className="font-mono text-xs">docs/PENDIENTES.md</span>
            <span className="ml-2 text-xs text-base-content/55">lo que dejó apuntado la rutina</span>
          </summary>
          <pre className="registro max-h-96 overflow-y-auto border-t border-base-300 px-4 py-3 text-base-content/80">
            {cliente.pendientes}
          </pre>
        </details>
      )}
    </div>
  );
}
