"use client";

import { useEffect, useRef } from "react";
import { contexto, ANGULO } from "@/libs/animaciones";

// -----------------------------------------------------------------------------
// Los filetes de SUSU.
//
// El logotipo de esta casa es una línea: el deportivo está dibujado de un
// trazo y las letras llevan remates finos. La gráfica de fondo de la web es esa
// misma cosa repetida —filetes de oro de un píxel cruzando el negro, con el
// resplandor que el metal deja alrededor—, y no las bandas anchas de color que
// traía la plantilla de la que salió esta página.
//
// La diferencia no es un gusto: una banda de oro de 200 px de alto deja de
// parecer oro y pasa a parecer un rectángulo amarillo. El oro solo se lee como
// metal cuando es fino y tiene un degradado a lo largo.
//
// Los filetes son elementos de verdad y no un `background-image`, por dos
// razones: se pueden animar uno a uno —entran trazándose de lado a lado, como
// quien dibuja la línea— y se pueden mover a distinta velocidad al hacer
// scroll, que es lo que les da profundidad.
//
// Se monta como capa dentro de una sección con `position: relative`:
//
//   <section className="relative overflow-hidden">
//     <Filetes />
//     …contenido…
//   </section>
// -----------------------------------------------------------------------------

/**
 * @param {"portada"|"seccion"|"sutil"} variante  cuánto pesa la gráfica
 * @param {boolean} deslizar  si los filetes se mueven al hacer scroll
 */
export default function Filetes({
  variante = "seccion",
  deslizar = true,
  className = "",
}) {
  const raiz = useRef(null);

  const lineas = LINEAS[variante] || LINEAS.seccion;

  useEffect(
    () =>
      contexto((g) => {
        const nodos = g.utils.toArray("[data-filete]", raiz.current);
        if (!nodos.length) return;

        // Entrada: cada filete se traza de lado a lado en vez de aparecer. Lo
        // que se anima es `scaleX` con el origen en un extremo, así que la
        // rotación de la línea no se toca y no hay dos transformaciones
        // peleándose.
        g.fromTo(
          nodos,
          { scaleX: 0, opacity: 0 },
          {
            scaleX: 1,
            // Cada filete vuelve a SU opacidad, no a 1: el oro vive al 30 % y
            // llevarlo al 100 % convertiría el fondo en un tablero.
            opacity: (i) => lineas[i].opacidad,
            duration: 1.6,
            ease: "expo.out",
            stagger: 0.14,
          }
        );

        if (!deslizar) return;

        // Y al hacer scroll, cada uno a su velocidad: los de atrás casi no se
        // mueven, los de delante sí. Con `scrub` van pegados a la rueda.
        nodos.forEach((nodo, i) => {
          g.to(nodo, {
            yPercent: -8 - i * 4,
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
    [deslizar, variante, lineas]
  );

  return (
    <div
      ref={raiz}
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden="true"
    >
      {/* El foco desplazado del logotipo: el negro del fondo nunca es plano,
          tiene de dónde brillar el oro. */}
      <div className="destello-oro absolute inset-0" />

      {lineas.map((linea, i) => (
        <span
          key={i}
          data-filete
          className="absolute block"
          style={{
            top: linea.top,
            left: linea.izquierda ?? "-25%",
            width: "150%",
            height: linea.alto,
            backgroundImage: linea.color,
            opacity: linea.opacidad,
            // El origen del trazo alterna, para que no se dibujen todos desde
            // el mismo lado.
            transformOrigin: i % 2 === 0 ? "left center" : "right center",
            // Solo rotación: el centrado va por `left`, no por un
            // translateX(-50%). GSAP descompone la matriz que encuentra, y con
            // un porcentaje dentro se lo quedaría convertido a píxeles fijos,
            // que al cambiar el ancho de la ventana dejaría las líneas
            // descolocadas.
            transform: `rotate(${ANGULO}deg)`,
            filter: linea.resplandor
              ? `drop-shadow(0 0 6px color-mix(in oklab, var(--color-oro) 55%, transparent))`
              : undefined,
          }}
        />
      ))}
    </div>
  );
}

/** El degradado de un filete: nace de la nada, brilla y se apaga. */
const ORO = `linear-gradient(to right, transparent, color-mix(in oklab, var(--color-oro-hondo) 70%, transparent) 18%, var(--color-oro) 48%, color-mix(in oklab, var(--color-oro-claro) 80%, transparent) 55%, transparent 92%)`;

/** El mismo trazo en blanco hueso, para acompañar sin repetir el oro. */
const HUESO = `linear-gradient(to right, transparent, color-mix(in oklab, var(--color-base-content) 60%, transparent) 45%, transparent 90%)`;

/**
 * Las recetas. Cada filete dice a qué altura va, qué grosor tiene y de qué
 * color es; la inclinación la pone la marca y es la misma para todos.
 *
 * Ninguno pasa de 2 px. Es la regla que mantiene esto en "filete" y no en
 * "banda": en cuanto una línea engorda, el oro se apaga.
 */
const LINEAS = {
  // La portada: tres trazos, uno de ellos con resplandor, que es el que hace
  // de eje. Es lo más lejos que llega la gráfica.
  portada: [
    { top: "18%", alto: "1px", color: ORO, opacidad: 0.55, resplandor: true },
    { top: "34%", alto: "1px", color: HUESO, opacidad: 0.12, izquierda: "-32%" },
    { top: "66%", alto: "2px", color: ORO, opacidad: 0.35, izquierda: "-18%" },
    { top: "88%", alto: "1px", color: HUESO, opacidad: 0.08, izquierda: "-30%" },
  ],

  // Las secciones: los mismos trazos, bajados de tono para no competir con el
  // texto que llevan encima.
  seccion: [
    { top: "14%", alto: "1px", color: ORO, opacidad: 0.3 },
    { top: "58%", alto: "1px", color: HUESO, opacidad: 0.07, izquierda: "-30%" },
    { top: "82%", alto: "1px", color: ORO, opacidad: 0.18, izquierda: "-20%" },
  ],

  // Donde solo hace falta que se note que hay una casa detrás.
  sutil: [
    { top: "26%", alto: "1px", color: ORO, opacidad: 0.18 },
    { top: "72%", alto: "1px", color: HUESO, opacidad: 0.05, izquierda: "-28%" },
  ],
};
