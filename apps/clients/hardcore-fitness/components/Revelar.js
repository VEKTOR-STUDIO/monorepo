"use client";

import { useEffect, useRef } from "react";
import { contexto, DISPARO, TIEMPOS } from "@/libs/animaciones";

/**
 * Hace aparecer a su contenido cuando entra en pantalla.
 *
 * Antes era un IntersectionObserver con transiciones CSS; ahora lo lleva GSAP
 * con ScrollTrigger, que da control sobre el momento exacto del disparo y
 * encaja con el resto de animaciones del sitio.
 *
 * `once` a propósito: revelar algo cada vez que pasa por pantalla marea al
 * volver hacia arriba.
 */
export default function Revelar({
  children,
  retraso = 0,
  desde = "abajo",
  className = "",
  as: Etiqueta = "div",
}) {
  const nodo = useRef(null);

  useEffect(
    () =>
      contexto((g) => {
        const salida = {
          abajo: { y: 30 },
          izquierda: { x: -34 },
          derecha: { x: 34 },
          escala: { scale: 0.94 },
        }[desde] || { y: 30 };

        g.from(nodo.current, {
          opacity: 0,
          ...salida,
          duration: TIEMPOS.entrada,
          delay: retraso / 1000,
          scrollTrigger: {
            trigger: nodo.current,
            start: DISPARO,
            once: true,
          },
        });
      }, nodo),
    [retraso, desde]
  );

  return (
    <Etiqueta ref={nodo} data-anima className={className}>
      {children}
    </Etiqueta>
  );
}
