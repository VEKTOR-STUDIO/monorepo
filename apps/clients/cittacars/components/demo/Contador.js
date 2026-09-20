"use client";

import { useEffect, useState } from "react";
import config from "@/config";

// -----------------------------------------------------------------------------
// La cuenta atrás de la oferta.
//
// Cuelga de `config.demo.ofertaHasta`, que es una fecha real. No se reinicia
// en cada visita ni inventa una urgencia que no existe: si la fecha pasa, el
// contador se va y el precio se queda sin rebaja. Para alargar la oferta se
// mueve la fecha, que es lo honesto y además lo más fácil de mantener.
//
// El primer render sale vacío a propósito: el servidor y el navegador nunca
// van a calcular el mismo segundo, y pintar el contador en el HTML del
// servidor daría un error de hidratación. Aparece en cuanto monta.
// -----------------------------------------------------------------------------

/** Lo que falta hasta `limite`, o null si ya pasó. */
function calcular(limite) {
  const restante = limite - Date.now();
  if (restante <= 0) return null;

  return {
    dias: Math.floor(restante / 86400000),
    horas: Math.floor((restante / 3600000) % 24),
    minutos: Math.floor((restante / 60000) % 60),
    segundos: Math.floor((restante / 1000) % 60),
  };
}

/**
 * @param {"compacto"|"completo"} formato
 *   compacto → "3 d 04:12:56", para la franja de arriba.
 *   completo → las cuatro cifras en cajas, para el bloque de venta.
 */
export default function Contador({ formato = "compacto", className = "" }) {
  const limite = config.demo?.ofertaHasta ? new Date(config.demo.ofertaHasta).getTime() : null;
  const [tiempo, setTiempo] = useState(null);

  useEffect(() => {
    if (!limite || Number.isNaN(limite)) return;

    setTiempo(calcular(limite));
    const reloj = setInterval(() => {
      const ahora = calcular(limite);
      setTiempo(ahora);
      if (!ahora) clearInterval(reloj);
    }, 1000);

    return () => clearInterval(reloj);
  }, [limite]);

  // Sin fecha, antes de montar, o con la oferta ya vencida: no se pinta nada.
  if (!tiempo) return null;

  const dosCifras = (n) => String(n).padStart(2, "0");

  if (formato === "compacto") {
    return (
      <span className={`cifra tabular-nums ${className}`}>
        {tiempo.dias > 0 && `${tiempo.dias} d `}
        {dosCifras(tiempo.horas)}:{dosCifras(tiempo.minutos)}:{dosCifras(tiempo.segundos)}
      </span>
    );
  }

  const cajas = [
    { valor: tiempo.dias, etiqueta: tiempo.dias === 1 ? "día" : "días" },
    { valor: tiempo.horas, etiqueta: "horas" },
    { valor: tiempo.minutos, etiqueta: "min" },
    { valor: tiempo.segundos, etiqueta: "seg" },
  ];

  return (
    <div className={`flex gap-2 ${className}`}>
      {cajas.map((caja) => (
        <div
          key={caja.etiqueta}
          className="min-w-14 rounded-md border border-base-content/12 bg-base-100 px-2 py-2 text-center"
        >
          <p className="cifra text-xl font-bold tabular-nums text-base-content">
            {dosCifras(caja.valor)}
          </p>
          <p className="microgramma mt-0.5 text-[0.55rem] text-base-content/45">
            {caja.etiqueta}
          </p>
        </div>
      ))}
    </div>
  );
}

/** ¿Sigue viva la oferta? Lo usan los textos que la nombran. */
export function ofertaVigente() {
  const limite = config.demo?.ofertaHasta ? new Date(config.demo.ofertaHasta).getTime() : null;
  if (!limite || Number.isNaN(limite)) return false;
  return limite > Date.now();
}
