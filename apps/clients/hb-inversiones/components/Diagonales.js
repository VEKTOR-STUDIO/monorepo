"use client";

import { useEffect, useRef } from "react";
import { contexto, ANGULO } from "@/libs/animaciones";

// -----------------------------------------------------------------------------
// Las diagonales de HB.
//
// En las trece páginas de su catálogo pasa siempre lo mismo: sobre el negro
// cruzan dos o tres bandas en diagonal, una roja ancha y una blanca fina, de
// abajo-izquierda a arriba-derecha. Es lo que hace que una foto de un carro
// blanco sobre fondo negro se lea como una publicación suya y no como una foto
// suelta.
//
// Aquí esas bandas son elementos de verdad y no un `background-image`, por dos
// razones: se pueden animar una a una —entran disparadas, cada una a su
// tiempo— y se pueden mover a distinta velocidad al hacer scroll, que es lo
// que les da profundidad.
//
// Se monta como capa dentro de una sección con `position: relative`:
//
//   <section className="relative overflow-hidden">
//     <Diagonales />
//     …contenido…
//   </section>
// -----------------------------------------------------------------------------

/**
 * @param {"portada"|"seccion"|"sutil"} variante  cuánto pesa la gráfica
 * @param {boolean} deslizar  si las bandas se mueven al hacer scroll
 */
export default function Diagonales({
  variante = "seccion",
  deslizar = true,
  className = "",
}) {
  const raiz = useRef(null);

  const bandas = BANDAS[variante] || BANDAS.seccion;

  useEffect(
    () =>
      contexto((g) => {
        const nodos = g.utils.toArray("[data-banda]", raiz.current);
        if (!nodos.length) return;

        // Entrada: cada banda llega disparada desde su propio lado, en el
        // sentido en que está inclinada. Lo que se anima es `xPercent`, así
        // que el sesgo de la banda no se toca y no hay dos transformaciones
        // peleándose.
        g.fromTo(
          nodos,
          { xPercent: (i) => (i % 2 === 0 ? -130 : 130), opacity: 0 },
          {
            xPercent: 0,
            // Cada banda vuelve a SU opacidad, no a 1: la blanca vive al 4 % y
            // llevarla al 100 % convertiría el fondo en un tablero de ajedrez.
            opacity: (i) => bandas[i].opacidad,
            duration: 1.4,
            ease: "expo.out",
            stagger: 0.12,
          }
        );

        if (!deslizar) return;

        // Y al hacer scroll, cada una a su velocidad: las de atrás casi no se
        // mueven, las de delante sí. Con `scrub` van pegadas a la rueda.
        nodos.forEach((nodo, i) => {
          g.to(nodo, {
            xPercent: (i % 2 === 0 ? 1 : -1) * (8 + i * 5),
            yPercent: -6 - i * 3,
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
    [deslizar, variante, bandas]
  );

  return (
    <div
      ref={raiz}
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden="true"
    >
      {bandas.map((banda, i) => (
        <span
          key={i}
          data-banda
          className="absolute block"
          style={{
            top: banda.top,
            left: banda.izquierda,
            width: "190%",
            height: banda.alto,
            background: banda.color,
            opacity: banda.opacidad,
            // Solo rotación: el centrado va por `left`, no por un
            // translateX(-50%). GSAP descompone la matriz que encuentra, y con
            // un porcentaje dentro se lo quedaría convertido a píxeles fijos,
            // que al cambiar el ancho de la ventana dejaría las bandas
            // descolocadas.
            transform: `rotate(${ANGULO}deg)`,
          }}
        />
      ))}
    </div>
  );
}

/**
 * Las recetas. Cada banda dice a qué altura va, qué grosor tiene y de qué
 * color es; el ángulo lo pone la marca y es el mismo para todas.
 *
 * El rojo nunca pasa del 18 % de la pantalla: en el catálogo tampoco. Si
 * ocupara más dejaría de ser un corte y sería un fondo rojo.
 */
const BANDAS = {
  // La portada: la gráfica manda, con una roja ancha y dos acompañantes.
  portada: [
    { top: "4%", alto: "13%", color: "var(--color-rojo)", opacidad: 0.9, izquierda: "-50%" },
    { top: "33%", alto: "5%", color: "oklch(97% 0 0)", opacidad: 0.09, izquierda: "-38%" },
    { top: "57%", alto: "22%", color: "var(--color-rojo-hondo)", opacidad: 0.35, izquierda: "-56%" },
    { top: "84%", alto: "3%", color: "oklch(97% 0 0)", opacidad: 0.06, izquierda: "-40%" },
  ],

  // Las secciones: la misma gráfica, bajada de tono para no competir con el
  // texto que lleva encima.
  seccion: [
    { top: "10%", alto: "7%", color: "var(--color-rojo)", opacidad: 0.45, izquierda: "-52%" },
    { top: "45%", alto: "20%", color: "oklch(97% 0 0)", opacidad: 0.04, izquierda: "-40%" },
    { top: "76%", alto: "4%", color: "var(--color-rojo)", opacidad: 0.22, izquierda: "-46%" },
  ],

  // Donde solo hace falta que se note que hay una casa detrás.
  sutil: [
    { top: "20%", alto: "4%", color: "var(--color-rojo)", opacidad: 0.28, izquierda: "-50%" },
    { top: "66%", alto: "12%", color: "oklch(97% 0 0)", opacidad: 0.03, izquierda: "-42%" },
  ],
};
