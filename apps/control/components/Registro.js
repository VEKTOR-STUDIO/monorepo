"use client";

import { useEffect, useRef, useState } from "react";

// Cuántas líneas se pintan como mucho. Una rutina larga deja miles, y lo que
// interesa mientras corre es el final.
const TOPE = 1500;

// El color de cada línea sale de la marca que le pone scripts/rutina.mjs.
function colorDe(linea) {
  const cuerpo = linea.replace(/^\[\d\d:\d\d:\d\d\]\s+/, "");
  if (cuerpo.startsWith("✗") || cuerpo.startsWith("!")) return "text-error";
  if (cuerpo.startsWith("✓")) return "text-success";
  if (cuerpo.startsWith("▶") || cuerpo.startsWith("…") || cuerpo.startsWith("■")) return "text-accent";
  if (cuerpo.startsWith("→")) return "text-base-content/55";
  return "text-base-content/85";
}

// El registro de la rutina, leído a trozos de /api/candidatos/<id>/registro.
// `activa` decide si se sigue preguntando; `alCambiar` avisa cuando la rutina
// cambia de estado para que la página entera se vuelva a pedir.
export default function Registro({ id, activa, estado, alCambiar }) {
  const [lineas, setLineas] = useState([]);
  const desde = useRef(0);
  const resto = useRef("");
  const caja = useRef(null);
  const pegado = useRef(true);
  const estadoVisto = useRef(estado);
  const avisar = useRef(alCambiar);
  avisar.current = alCambiar;

  useEffect(() => {
    let vivo = true;
    let reloj = null;

    async function leer() {
      try {
        const respuesta = await fetch(`/api/candidatos/${id}/registro?desde=${desde.current}`, { cache: "no-store" });
        if (!respuesta.ok || !vivo) return;
        const datos = await respuesta.json();

        // Empezó otra rutina y el archivo se vació: se empieza de cero.
        if (datos.desde === 0 && desde.current > 0) {
          resto.current = "";
          setLineas([]);
        }
        desde.current = datos.hasta;

        if (datos.texto) {
          const trozos = (resto.current + datos.texto).split("\n");
          resto.current = trozos.pop();
          if (trozos.length) setLineas((antes) => [...antes, ...trozos].slice(-TOPE));
        }
        if (datos.rutina.estado !== estadoVisto.current) {
          estadoVisto.current = datos.rutina.estado;
          avisar.current?.();
        }
      } catch {
        // El servidor se está reiniciando: la siguiente vuelta lo reintenta.
      }
    }

    leer();
    if (activa) reloj = setInterval(leer, 2000);
    return () => {
      vivo = false;
      if (reloj) clearInterval(reloj);
    };
  }, [id, activa]);

  // Sigue el final mientras nadie haya subido a leer algo de más arriba.
  useEffect(() => {
    const el = caja.current;
    if (el && pegado.current) el.scrollTop = el.scrollHeight;
  }, [lineas]);

  if (!lineas.length) {
    return (
      <div className="registro rounded-box border border-base-300 bg-base-100 px-4 py-6 text-center text-base-content/45">
        {activa ? "Esperando a que la rutina escriba algo…" : "Todavía no hay registro."}
      </div>
    );
  }

  return (
    <div
      ref={caja}
      onScroll={(e) => {
        const el = e.currentTarget;
        pegado.current = el.scrollHeight - el.scrollTop - el.clientHeight < 40;
      }}
      className="registro max-h-[28rem] overflow-y-auto rounded-box border border-base-300 bg-base-100 px-4 py-3"
    >
      {lineas.map((linea, i) => (
        <div key={i} className={colorDe(linea)}>
          {linea || "\u00a0"}
        </div>
      ))}
    </div>
  );
}
