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

        // fromTo y no from: el CSS ya deja esto en opacity 0 (para que no dé
        // un salto al hidratar), y `from` animaría desde 0 hasta el valor
        // actual, que también es 0. El destino hay que decirlo a mano.
        g.fromTo(
          nodo.current,
          { opacity: 0, ...salida },
          {
            opacity: 1,
            x: 0,
            y: 0,
            scale: 1,
            duration: TIEMPOS.entrada,
            delay: retraso / 1000,
            // Al terminar se quita el marcador. A partir de ahí el elemento
            // deja de depender de la regla que lo ocultaba: aunque algo borre
            // los estilos en línea, se queda visible.
            onComplete: () => nodo.current?.removeAttribute("data-anima"),
            scrollTrigger: {
              trigger: nodo.current,
              start: DISPARO,
              once: true,
            },
          }
        );
      }, nodo),
    [retraso, desde]
  );

  return (
    <Etiqueta ref={nodo} data-anima className={className}>
      {children}
    </Etiqueta>
  );
}
