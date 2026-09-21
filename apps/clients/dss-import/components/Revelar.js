"use client";

import { useEffect, useRef } from "react";
import { contexto, mostrar, DISPARO, TIEMPOS, SALIDA_FUERTE } from "@/libs/animaciones";

/**
 * Hace aparecer a su contenido cuando entra en pantalla.
 *
 * Todas las entradas de la página pasan por aquí para que se sientan iguales.
 * Las variantes no son un catálogo de efectos: cada una dice algo distinto.
 *
 *   abajo      lo normal, sube y se asienta.
 *   izquierda  para lo que acompaña a un texto por el lado.
 *   derecha    idem, al revés.
 *   escala     para lo que tiene que sentirse cerca: fotos, tarjetas grandes.
 *   corte      entra recortado en diagonal, con el ángulo de la marca. Es el
 *              más fuerte y se reserva para las fotos y los bloques de color.
 *   giro       llega inclinado y se endereza; para las tarjetas del catálogo.
 *
 * `once` a propósito: revelar algo cada vez que pasa por pantalla marea al
 * volver hacia arriba.
 */

const SALIDAS = {
  abajo: { y: 40 },
  izquierda: { x: -48 },
  derecha: { x: 48 },
  escala: { scale: 0.92 },
  giro: { y: 44, rotate: -2.5, scale: 0.97 },
  corte: {
    y: 26,
    clipPath: "polygon(0 0, 0 0, -24% 100%, 0 100%)",
  },
};

const LLEGADA = {
  clipPath: "polygon(0 0, 124% 0, 100% 100%, 0 100%)",
};

export default function Revelar({
  children,
  retraso = 0,
  desde = "abajo",
  duracion,
  className = "",
  as: Etiqueta = "div",
}) {
  const nodo = useRef(null);

  useEffect(
    () =>
      contexto((g) => {
        const salida = SALIDAS[desde] || SALIDAS.abajo;
        const esCorte = desde === "corte";

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
            rotate: 0,
            ...(esCorte ? LLEGADA : {}),
            duration: duracion ?? (esCorte ? TIEMPOS.larga : TIEMPOS.entrada),
            ease: esCorte ? "power4.inOut" : SALIDA_FUERTE,
            delay: retraso / 1000,
            // Al terminar se quita el marcador. A partir de ahí el elemento
            // deja de depender de la regla que lo ocultaba: aunque algo borre
            // los estilos en línea, se queda visible.
            //
            // El recorte SÍ se limpia: dejar un clip-path puesto recortaría
            // para siempre cualquier cosa que se salga de la caja —una sombra,
            // un menú, una etiqueta en la esquina—.
            ...(esCorte ? { clearProps: "clipPath" } : {}),
            onComplete: () => mostrar(nodo.current),
            scrollTrigger: {
              trigger: nodo.current,
              start: DISPARO,
              once: true,
            },
          }
        );
      }, nodo),
    [retraso, desde, duracion]
  );

  return (
    <Etiqueta ref={nodo} data-anima className={className}>
      {children}
    </Etiqueta>
  );
}
