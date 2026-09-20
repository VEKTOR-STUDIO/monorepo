"use client";

import { useEffect, useRef } from "react";
import { contexto, parallax } from "@/libs/animaciones";

/**
 * Mueve a su contenido más despacio que a la página.
 *
 * Es lo que separa el vehículo del fondo en las pantallas del escaparate: la
 * foto sube un poco menos que el texto que tiene al lado y las dos capas dejan
 * de sentirse pegadas a la misma hoja.
 *
 * Va atado al scroll con `scrub`, sin duración propia. Y sin `data-anima`: el
 * contenido tiene que verse siempre, lo único que cambia es dónde está.
 */
export default function Parallax({
  children,
  desde = -8,
  hasta = 8,
  escala,
  className = "",
}) {
  const nodo = useRef(null);

  useEffect(
    () => contexto((g) => parallax(g, nodo.current, { desde, hasta, escala }), nodo),
    [desde, hasta, escala]
  );

  return (
    <div ref={nodo} className={className}>
      {children}
    </div>
  );
}
