"use client";

import { useEffect, useRef } from "react";
import { contexto } from "@/libs/animaciones";

// -----------------------------------------------------------------------------
// Las alas de Veloce.
//
// Su logotipo no tiene fondo, ni pauta, ni segundo color: es una V alada negra
// sobre blanco y punto. Así que la gráfica de la página no se inventa un
// motivo nuevo, usa el que ya existe: la propia marca ampliada hasta salirse
// del cuadro, repetida a distintas alturas y opacidades.
//
// Lo que queda es un campo de vértices que se abren hacia arriba. No decora:
// es la misma forma que el visitante acaba de ver en la cabecera, tan grande
// que ya no se lee como logotipo sino como retícula.
//
// Son elementos de verdad y no un `background-image` por dos razones: se
// pueden animar uno a uno —se abren como alas al entrar— y se pueden mover a
// distinta velocidad al hacer scroll, que es lo que les da profundidad.
//
// Se monta como capa dentro de una sección con `position: relative`:
//
//   <section className="relative overflow-hidden">
//     <Alas />
//     …contenido…
//   </section>
// -----------------------------------------------------------------------------

/**
 * Un galón: la V dibujada estirada a la caja que le toque.
 *
 * `preserveAspectRatio="none"` es lo que deja que el mismo dibujo sea un
 * vértice muy abierto en una franja ancha y uno cerrado en una estrecha. Por
 * eso es un polígono relleno y no un trazo: un `stroke` se deformaría de
 * grosor al estirarse y quedarían las dos alas con distinto peso.
 */
function Galon({ grosor = 12 }) {
  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className="block h-full w-full"
      aria-hidden="true"
    >
      <path
        d={`M0 0 L50 ${100 - grosor} L100 0 L100 ${grosor} L50 100 L0 ${grosor} Z`}
        fill="currentColor"
      />
    </svg>
  );
}

/**
 * @param {"portada"|"seccion"|"sutil"} variante  cuánto pesa la gráfica
 * @param {boolean} deslizar  si las alas se mueven al hacer scroll
 */
export default function Alas({ variante = "seccion", deslizar = true, className = "" }) {
  const raiz = useRef(null);

  const alas = ALAS[variante] || ALAS.seccion;

  useEffect(
    () =>
      contexto((g) => {
        const nodos = g.utils.toArray("[data-ala]", raiz.current);
        if (!nodos.length) return;

        // Entrada: cada ala nace cerrada —aplastada contra su vértice— y se
        // abre. Es el gesto del logotipo, no una aparición genérica.
        g.fromTo(
          nodos,
          { scaleX: 0.35, scaleY: 0.6, opacity: 0 },
          {
            scaleX: 1,
            scaleY: 1,
            // Cada una vuelve a SU opacidad, no a 1: la más tenue vive al 4 %
            // y llevarla al 100 % convertiría el fondo en una pared de galones.
            opacity: (i) => alas[i].opacidad,
            duration: 1.5,
            ease: "expo.out",
            stagger: 0.14,
            transformOrigin: "50% 100%",
          }
        );

        if (!deslizar) return;

        // Y al hacer scroll, cada una a su velocidad: las de atrás casi no se
        // mueven, las de delante sí. Con `scrub` van pegadas a la rueda.
        nodos.forEach((nodo, i) => {
          g.to(nodo, {
            yPercent: -8 - i * 6,
            ease: "none",
            scrollTrigger: {
              trigger: raiz.current,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          });
        });
      }, raiz),
    [deslizar, variante, alas]
  );

  return (
    <div
      ref={raiz}
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden="true"
    >
      {alas.map((ala, i) => (
        <span
          key={i}
          data-ala
          className="absolute block text-base-content"
          style={{
            top: ala.top,
            left: ala.izquierda,
            width: ala.ancho,
            height: ala.alto,
            opacity: ala.opacidad,
          }}
        >
          <Galon grosor={ala.grosor} />
        </span>
      ))}
    </div>
  );
}

/**
 * Las recetas. Cada ala dice dónde se posa, cuánto ocupa, qué grosor tiene su
 * trazo y cuánto se ve.
 *
 * Ninguna pasa del 12 % de opacidad. Sobre negro, un blanco al 15 % ya compite
 * con el texto, y esta gráfica tiene que estar DEBAJO de lo que se lee: es la
 * marca de agua de la casa, no un elemento más de la página.
 */
const ALAS = {
  // La portada: la marca manda, con un ala enorme cruzando el alto entero.
  portada: [
    { top: "-18%", izquierda: "-25%", ancho: "150%", alto: "95%", grosor: 5, opacidad: 0.1 },
    { top: "14%", izquierda: "8%", ancho: "84%", alto: "62%", grosor: 9, opacidad: 0.055 },
    { top: "46%", izquierda: "-40%", ancho: "180%", alto: "80%", grosor: 4, opacidad: 0.07 },
    { top: "68%", izquierda: "30%", ancho: "95%", alto: "55%", grosor: 14, opacidad: 0.035 },
  ],

  // Las secciones: la misma gráfica, bajada de tono para no competir con el
  // texto que lleva encima.
  seccion: [
    { top: "-10%", izquierda: "-15%", ancho: "130%", alto: "70%", grosor: 6, opacidad: 0.065 },
    { top: "34%", izquierda: "20%", ancho: "110%", alto: "85%", grosor: 4, opacidad: 0.045 },
    { top: "58%", izquierda: "-30%", ancho: "95%", alto: "60%", grosor: 11, opacidad: 0.03 },
  ],

  // Donde solo hace falta que se note que hay una casa detrás.
  sutil: [
    { top: "6%", izquierda: "-20%", ancho: "140%", alto: "80%", grosor: 5, opacidad: 0.04 },
    { top: "40%", izquierda: "45%", ancho: "80%", alto: "70%", grosor: 9, opacidad: 0.025 },
  ],
};
