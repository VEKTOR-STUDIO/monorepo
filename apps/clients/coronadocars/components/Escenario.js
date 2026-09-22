"use client";

import { useEffect, useRef } from "react";
import { contexto, ANGULO } from "@/libs/animaciones";

// -----------------------------------------------------------------------------
// El escenario de Coronado Carss.
//
// Sus fichas no montan un paisaje: el carro se fotografía siempre en el mismo
// sitio, contra la PARED DE PRENSA del local, y la pieza se remata con cajas
// azules cortadas en diagonal y un filete amarillo. Así que su "fondo" son
// tres cosas, siempre las mismas:
//
//   1. LA LUZ AZUL. La noche de la página con dos focos del azul rey de su
//      recuadro, como si el logotipo iluminara el cuarto.
//   2. LA PARED. Las placas del photocall en filas desplazadas, muy bajitas:
//      se lee "pared de prensa" sin que haya que escribir ningún nombre.
//   3. LAS BANDAS. El azul de sus cajas y el filete amarillo, estirados y
//      cruzando en la pendiente de la casa, deslizándose muy despacio.
//
// Se monta como capa dentro de cualquier sección y la sección pasa a parecer
// una pieza suya:
//
//   <section className="relative overflow-hidden">
//     <Escenario />
//     …contenido…
//   </section>
//
// Las bandas son elementos de verdad y no un `background-image` por dos
// razones: se pueden animar una a una —entran deslizándose, cada una a su
// tiempo— y se mueven a distinta velocidad al hacer scroll, que es lo que les
// da profundidad.
// -----------------------------------------------------------------------------

/**
 * @param {"portada"|"seccion"|"sutil"} variante  cuánto pesa la escena
 * @param {boolean} deslizar  si las capas se mueven al hacer scroll
 */
export default function Escenario({
  variante = "seccion",
  deslizar = true,
  className = "",
}) {
  const raiz = useRef(null);

  const escena = ESCENAS[variante] || ESCENAS.seccion;

  useEffect(
    () =>
      contexto((g) => {
        const bandas = g.utils.toArray("[data-banda]", raiz.current);

        // Entrada: cada banda llega deslizándose desde su lado. Lo que se anima
        // es `xPercent`, así que el sesgo de la capa no se toca y no hay dos
        // transformaciones peleándose.
        if (bandas.length) {
          g.fromTo(
            bandas,
            { xPercent: (i) => (i % 2 === 0 ? -120 : 120), opacity: 0 },
            {
              xPercent: 0,
              // Cada banda vuelve a SU opacidad, no a 1: varias viven al 10 % y
              // llevarlas al 100 % convertiría el fondo en una bandera.
              opacity: (i) => escena.bandas[i].opacidad,
              duration: 1.3,
              ease: "expo.out",
              stagger: 0.11,
            }
          );
        }

        if (!deslizar) return;

        // Al hacer scroll, cada capa a su velocidad: las de atrás casi no se
        // mueven, las de delante sí. Con `scrub` van pegadas a la rueda.
        bandas.forEach((nodo, i) => {
          g.to(nodo, {
            xPercent: (i % 2 === 0 ? 1 : -1) * (7 + i * 5),
            yPercent: -5 - i * 3,
            ease: "none",
            scrollTrigger: {
              trigger: raiz.current,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          });
        });

        // La pared, muy despacio y solo de lado: es el fondo del fondo.
        const pared = raiz.current?.querySelector("[data-pared]");
        if (pared) {
          g.fromTo(
            pared,
            { backgroundPositionX: "0px" },
            {
              backgroundPositionX: "-160px",
              ease: "none",
              scrollTrigger: {
                trigger: raiz.current,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            }
          );
        }
      }, raiz),
    [deslizar, variante, escena]
  );

  return (
    <div
      ref={raiz}
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden="true"
    >
      {/* 1. La luz azul. */}
      <div
        className="pared absolute inset-0"
        style={{ "--pared-fuerza": escena.luz }}
      />

      {/* 2. La pared de prensa. */}
      {escena.pared > 0 && (
        <div
          data-pared
          className="pared-logos absolute inset-0"
          style={{ opacity: escena.pared }}
        />
      )}

      {/* 3. Las bandas, deslizándose. */}
      {escena.bandas.map((banda, i) => (
        <span
          key={i}
          data-banda
          className="absolute block"
          style={{
            top: banda.top,
            left: banda.izquierda,
            width: "175%",
            height: banda.alto,
            background: banda.color,
            opacity: banda.opacidad,
            // Solo el sesgo: el centrado va por `left`, no por un
            // translateX(-50%). GSAP descompone la matriz que encuentra, y con
            // un porcentaje dentro se lo quedaría convertido a píxeles fijos,
            // que al cambiar el ancho de la ventana dejaría las bandas
            // descolocadas.
            transform: `skewX(${ANGULO}deg)`,
          }}
        />
      ))}
    </div>
  );
}

/**
 * Las recetas. Cada escena dice cuánta luz azul lleva, cuánto se ve la pared
 * y qué bandas la cruzan.
 *
 * El amarillo NUNCA pasa de una raya. En sus piezas tampoco: es un filete o
 * es el nombre, nunca un fondo. Una banda ancha amarilla detrás de un titular
 * blanco lo haría ilegible y gastaría el único color que señala.
 */
const ESCENAS = {
  // La portada: la escena completa, como una pieza suya de Instagram.
  portada: {
    luz: 1,
    pared: 0.09,
    bandas: [
      { top: "12%", alto: "3px", color: "var(--color-lima)", opacidad: 0.55, izquierda: "-42%" },
      { top: "58%", alto: "24%", color: "var(--color-azul)", opacidad: 0.34, izquierda: "-50%" },
      { top: "84%", alto: "2px", color: "var(--color-hueso)", opacidad: 0.14, izquierda: "-38%" },
    ],
  },

  // Las secciones: la misma luz, bajada de tono para no competir con el texto
  // que lleva encima, y la pared apenas insinuada.
  seccion: {
    luz: 0.5,
    pared: 0.05,
    bandas: [
      { top: "20%", alto: "2px", color: "var(--color-lima)", opacidad: 0.3, izquierda: "-44%" },
      { top: "62%", alto: "18%", color: "var(--color-azul)", opacidad: 0.2, izquierda: "-50%" },
    ],
  },

  // Donde solo hace falta que se note que hay una casa detrás.
  sutil: {
    luz: 0.24,
    pared: 0,
    bandas: [
      { top: "34%", alto: "2px", color: "var(--color-hueso)", opacidad: 0.08, izquierda: "-46%" },
    ],
  },
};
