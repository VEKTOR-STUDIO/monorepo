"use client";

import { useEffect, useRef } from "react";
import { contexto, ANGULO } from "@/libs/animaciones";

// -----------------------------------------------------------------------------
// Las barras de LM 2006.
//
// Su logotipo es un trío: plata estrecha, roja media y azul muy ancha,
// inclinadas −12°. Ese trío es lo que se reconoce de la marca —está en el
// logotipo y vuelve a estar, como remate, al pie de cada publicación—, así que
// aquí cruza el fondo a tamaño de sección.
//
// UN GRUPO ES UN SOLO ELEMENTO, no tres. Los tres colores salen de un degradado
// de cortes duros dentro de la misma caja, y eso importa por dos razones:
//
//   · las tres barras se mueven juntas, que es lo que las hace leerse como un
//     logotipo ampliado y no como tres rayas sueltas;
//   · hay un tercio de nodos que animar, y estas capas están en casi todas las
//     secciones de la página.
//
// Se monta como capa dentro de una sección con `position: relative`:
//
//   <section className="relative overflow-hidden">
//     <Diagonales />
//     …contenido…
//   </section>
// -----------------------------------------------------------------------------

/**
 * El degradado que mete las tres barras dentro de una caja.
 *
 * Las proporciones son las del logotipo y no un reparto bonito: la plata
 * apenas se ve, la roja es un apunte y la azul se lleva casi todo. Igualarlas
 * rompe el parecido.
 */
function trio(intensidad = 1) {
  const mezcla = (color, porcentaje) =>
    `color-mix(in oklab, ${color} ${Math.round(porcentaje * intensidad)}%, transparent)`;

  return `linear-gradient(
    to bottom,
    ${mezcla("var(--color-plata)", 70)} 0 6%,
    transparent 6% 11%,
    ${mezcla("var(--color-rojo)", 100)} 11% 24%,
    transparent 24% 29%,
    ${mezcla("var(--color-azul)", 100)} 29% 100%
  )`;
}

/**
 * @param {"portada"|"seccion"|"sutil"} variante  cuánto pesa la gráfica
 * @param {boolean} deslizar  si las barras se mueven al hacer scroll
 */
export default function Diagonales({
  variante = "seccion",
  deslizar = true,
  className = "",
}) {
  const raiz = useRef(null);

  const grupos = GRUPOS[variante] || GRUPOS.seccion;

  useEffect(
    () =>
      contexto((g) => {
        const nodos = g.utils.toArray("[data-banda]", raiz.current);
        if (!nodos.length) return;

        // Entrada: cada grupo llega disparado desde su propio lado, en el
        // sentido en que está inclinado. Lo que se anima es `xPercent`, así
        // que la rotación del grupo no se toca y no hay dos transformaciones
        // peleándose.
        g.fromTo(
          nodos,
          { xPercent: (i) => (i % 2 === 0 ? -130 : 130), opacity: 0 },
          {
            xPercent: 0,
            // Cada grupo vuelve a SU opacidad, no a 1: las de fondo viven muy
            // bajas y llevarlas al 100 % convertiría la sección en un cartel.
            opacity: (i) => grupos[i].opacidad,
            duration: 1.4,
            ease: "expo.out",
            stagger: 0.12,
          }
        );

        if (!deslizar) return;

        // Y al hacer scroll, cada uno a su velocidad: los de atrás casi no se
        // mueven, los de delante sí. Con `scrub` van pegados a la rueda.
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
    [deslizar, variante, grupos]
  );

  return (
    <div
      ref={raiz}
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden="true"
    >
      {grupos.map((grupo, i) => (
        <span
          key={i}
          data-banda
          className="absolute block"
          style={{
            top: grupo.top,
            left: grupo.izquierda,
            width: "190%",
            height: grupo.alto,
            backgroundImage: trio(grupo.intensidad ?? 1),
            opacity: grupo.opacidad,
            // Solo rotación: el centrado va por `left`, no por un
            // translateX(-50%). GSAP descompone la matriz que encuentra, y con
            // un porcentaje dentro se lo quedaría convertido a píxeles fijos,
            // que al cambiar el ancho de la ventana dejaría las barras
            // descolocadas.
            transform: `rotate(${ANGULO}deg)`,
          }}
        />
      ))}
    </div>
  );
}

/**
 * Las recetas. Cada grupo dice a qué altura va, qué grosor tiene y cuánto
 * pesa; el ángulo y el orden de los colores los pone la marca y son siempre
 * los mismos.
 *
 * El trío nunca pasa del 20 % de la pantalla, igual que en su logotipo no pasa
 * de una esquina. Si ocupara más dejaría de ser una firma y sería un fondo de
 * colores.
 */
const GRUPOS = {
  // La portada: la gráfica manda, con un trío ancho arriba y dos acompañantes.
  portada: [
    { top: "6%", alto: "16%", opacidad: 0.5, intensidad: 1, izquierda: "-50%" },
    { top: "38%", alto: "6%", opacidad: 0.3, intensidad: 0.6, izquierda: "-38%" },
    { top: "60%", alto: "20%", opacidad: 0.24, intensidad: 0.8, izquierda: "-56%" },
    { top: "86%", alto: "4%", opacidad: 0.22, intensidad: 0.5, izquierda: "-40%" },
  ],

  // Las secciones: la misma gráfica, bajada de tono para no competir con el
  // texto que lleva encima.
  seccion: [
    { top: "10%", alto: "9%", opacidad: 0.26, intensidad: 0.8, izquierda: "-52%" },
    { top: "48%", alto: "18%", opacidad: 0.12, intensidad: 0.5, izquierda: "-40%" },
    { top: "78%", alto: "5%", opacidad: 0.2, intensidad: 0.7, izquierda: "-46%" },
  ],

  // Donde solo hace falta que se note que hay una casa detrás.
  sutil: [
    { top: "22%", alto: "5%", opacidad: 0.2, intensidad: 0.7, izquierda: "-50%" },
    { top: "68%", alto: "12%", opacidad: 0.1, intensidad: 0.45, izquierda: "-42%" },
  ],
};
