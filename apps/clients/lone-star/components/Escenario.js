"use client";

import { useEffect, useRef } from "react";
import { contexto, ANGULO } from "@/libs/animaciones";

// -----------------------------------------------------------------------------
// El escenario de Lone Star.
//
// Su emblema y sus piezas montan la misma escena, y siempre en el mismo orden
// de arriba abajo: una NOCHE negra con humo rojo, la BANDERA de Estados Unidos
// ondeando en la esquina de arriba, el PUERTO al fondo —grúas, contenedores y
// el buque—, el PISO MOJADO que devuelve el rojo, y el vehículo posado encima.
// Cruzando por detrás, las BANDAS rojas cortadas en diagonal.
//
// Eso es la identidad, así que aquí es un componente y no un adorno suelto: se
// monta como capa dentro de cualquier sección y la sección pasa a parecer una
// pieza suya.
//
//   <section className="relative overflow-hidden">
//     <Escenario />
//     …contenido…
//   </section>
//
// Las bandas son elementos de verdad y no un `background-image` por dos
// razones: se pueden animar una a una —entran barriendo, cada una a su
// tiempo— y se mueven a distinta velocidad al hacer scroll, que es lo que les
// da profundidad. El puerto también se desplaza, más despacio, como cuando se
// pasa por delante del muelle.
// -----------------------------------------------------------------------------

/**
 * @param {"portada"|"seccion"|"sutil"} variante  cuánto pesa la escena
 * @param {boolean} deslizar  si las capas se mueven al hacer scroll
 */
export default function Escenario({ variante = "seccion", deslizar = true, className = "" }) {
  const raiz = useRef(null);

  const escena = ESCENAS[variante] || ESCENAS.seccion;

  useEffect(
    () =>
      contexto((g) => {
        const alas = g.utils.toArray("[data-ala]", raiz.current);

        // Entrada: cada banda llega barriendo desde su propio lado, en el
        // sentido en que está inclinada. Lo que se anima es `xPercent`, así que la
        // rotación de la capa no se toca y no hay dos transformaciones
        // peleándose.
        if (alas.length) {
          g.fromTo(
            alas,
            { xPercent: (i) => (i % 2 === 0 ? -125 : 125), opacity: 0 },
            {
              xPercent: 0,
              // Cada banda vuelve a SU opacidad, no a 1: la blanca vive al 6 %
              // y llevarla al 100 % convertiría el fondo en un tablero.
              opacity: (i) => escena.alas[i].opacidad,
              duration: 1.4,
              ease: "expo.out",
              stagger: 0.12,
            }
          );
        }

        if (!deslizar) return;

        // Al hacer scroll, cada capa a su velocidad: las de atrás casi no se
        // mueven, las de delante sí. Con `scrub` van pegadas a la rueda.
        alas.forEach((nodo, i) => {
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

        // El puerto, muy despacio y solo de lado: es el fondo del fondo.
        const puerto = raiz.current?.querySelector("[data-puerto]");
        if (puerto) {
          g.fromTo(
            puerto,
            { backgroundPositionX: "0px" },
            {
              backgroundPositionX: "-240px",
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
      {/* 1. La noche. */}
      <div className="cielo absolute inset-0" style={{ "--cielo-fuerza": escena.cielo }} />

      {/* 2. La bandera, arriba a la izquierda, muy apagada. */}
      {escena.bandera && (
        <div
          className="bandera absolute left-0 top-0 h-[70%] w-[62%]"
          style={{ opacity: escena.bandera }}
        />
      )}

      {/* 3. Las bandas rojas, cruzando. */}
      {escena.alas.map((ala, i) => (
        <span
          key={i}
          data-ala
          className="absolute block"
          style={{
            top: ala.top,
            left: ala.izquierda,
            width: "190%",
            height: ala.alto,
            background: ala.color,
            opacity: ala.opacidad,
            // La banda recta con los dos extremos cortados en diagonal, como
            // las de sus piezas.
            clipPath: "polygon(3% 0, 100% 0, 97% 100%, 0 100%)",
            // Solo rotación: el centrado va por `left`, no por un
            // translateX(-50%). GSAP descompone la matriz que encuentra, y con
            // un porcentaje dentro se lo quedaría convertido a píxeles fijos,
            // que al cambiar el ancho de la ventana dejaría las alas
            // descolocadas.
            transform: `rotate(${ANGULO}deg)`,
          }}
        />
      ))}

      {/* 4. El puerto, anclado abajo. */}
      {escena.puerto && (
        <div
          data-puerto
          className="horizonte absolute inset-x-0 bottom-0"
          style={{ height: escena.puerto.alto, opacity: escena.puerto.opacidad }}
        />
      )}

      {/* 5. El piso mojado, lo último, tapando el pie del puerto. */}
      {escena.asfalto && (
        <div
          className="asfalto absolute inset-x-0 bottom-0"
          style={{ height: escena.asfalto.alto, opacity: escena.asfalto.opacidad }}
        />
      )}
    </div>
  );
}

/**
 * Las recetas. Cada escena dice cuánto rojo lleva, qué bandas la cruzan, y si
 * se ven la bandera, el puerto y el piso.
 *
 * El rojo nunca llena la pantalla: en sus piezas tampoco, porque el negro es lo
 * que hace que el rojo se vea rojo.
 *
 * El puerto y el piso van en MEDIDAS ABSOLUTAS y no en porcentaje del alto de
 * la sección. Con porcentajes, una portada a `min-h-svh` en un monitor alto
 * estiraba el dibujo hasta que las grúas medían más que el titular. Un puerto
 * se ve lejos porque es pequeño, y eso no depende de lo alta que sea la
 * sección.
 */
const ESCENAS = {
  // La portada: la escena completa, como su emblema.
  portada: {
    cielo: 1,
    bandera: 0.16,
    puerto: { alto: "clamp(150px, 30vh, 330px)", opacidad: 0.95 },
    asfalto: { alto: "clamp(90px, 16vh, 190px)", opacidad: 0.9 },
    alas: [
      { top: "8%", alto: "7%", color: "var(--color-rojo)", opacidad: 0.55, izquierda: "-50%" },
      { top: "30%", alto: "2.5%", color: "var(--color-plata)", opacidad: 0.08, izquierda: "-38%" },
      {
        top: "56%",
        alto: "14%",
        color: "var(--color-rojo-hondo)",
        opacidad: 0.3,
        izquierda: "-56%",
      },
    ],
  },

  // Las secciones: el mismo rojo, bajado de tono para no competir con el
  // texto que lleva encima, y el puerto apenas insinuado.
  seccion: {
    cielo: 0.45,
    bandera: 0,
    puerto: { alto: "clamp(90px, 18vh, 200px)", opacidad: 0.55 },
    asfalto: null,
    alas: [
      { top: "12%", alto: "4%", color: "var(--color-rojo)", opacidad: 0.35, izquierda: "-52%" },
      { top: "58%", alto: "10%", color: "var(--color-plata)", opacidad: 0.04, izquierda: "-40%" },
    ],
  },

  // Donde solo hace falta que se note que hay una casa detrás.
  sutil: {
    cielo: 0.22,
    bandera: 0,
    puerto: null,
    asfalto: null,
    alas: [
      { top: "24%", alto: "3%", color: "var(--color-rojo)", opacidad: 0.24, izquierda: "-50%" },
    ],
  },
};
