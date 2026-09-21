"use client";

import { useState } from "react";

// Un comando o una ruta que se copia con un clic. `oculto` lo enseña con
// puntos hasta que se pida verlo — para la clave de la demo, que no tiene por
// qué quedar a la vista mientras se comparte pantalla.
export default function Copiable({ texto, oculto = false, className = "" }) {
  const [copiado, setCopiado] = useState(false);
  const [visible, setVisible] = useState(!oculto);

  async function copiar() {
    try {
      await navigator.clipboard.writeText(texto);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 1400);
    } catch {
      // Sin permiso de portapapeles: el texto sigue ahí para copiarlo a mano.
    }
  }

  return (
    <span
      className={`inline-flex max-w-full items-center gap-1 rounded-field border border-base-300 bg-base-100 py-1 pl-2.5 pr-1 font-mono text-xs ${className}`}
    >
      <span className="truncate">{visible ? texto : "•".repeat(Math.min(12, texto.length))}</span>
      {oculto && (
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="rounded-selector px-1.5 py-0.5 font-sans text-[0.6875rem] text-base-content/50 hover:bg-base-300/60 hover:text-base-content"
        >
          {visible ? "Ocultar" : "Ver"}
        </button>
      )}
      <button
        type="button"
        onClick={copiar}
        className={`rounded-selector px-1.5 py-0.5 font-sans text-[0.6875rem] hover:bg-base-300/60 ${
          copiado ? "text-success" : "text-base-content/50 hover:text-base-content"
        }`}
      >
        {copiado ? "Copiado" : "Copiar"}
      </button>
    </span>
  );
}
