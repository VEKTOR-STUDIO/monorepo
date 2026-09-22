"use client";

import { useEffect, useRef } from "react";
import { contexto, ANGULO } from "@/libs/animaciones";

// -----------------------------------------------------------------------------
// El escenario de DealerNauta.
//
// Todas sus publicaciones montan la misma escena, y siempre en el mismo orden
// de arriba abajo: un CIELO naranja que va de ámbar a naranja quemado, el
// perfil de la CIUDAD recortado en negro contra ese cielo, el ASFALTO gris
// ocupando el tercio de abajo, y el vehículo posado encima. Cruzando por
// detrás, las ALAS del emblema.
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
// Las alas son elementos de verdad y no un `background-image` por dos razones:
// se pueden animar una a una —entran barriendo, cada una a su tiempo— y se
// mueven a distinta velocidad al hacer scroll, que es lo que les da
// profundidad. La ciudad también se desplaza, más despacio, como cuando pasas
// por delante en carretera.
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
        const alas = g.utils.toArray("[data-ala]", raiz.current);

        // Entrada: cada ala llega barriendo desde su propio lado, en el sentido
        // en que está inclinada. Lo que se anima es `xPercent`, así que la
        // rotación de la capa no se toca y no hay dos transformaciones
        // peleándose.
        if (alas.length) {
          g.fromTo(
            alas,
            { xPercent: (i) => (i % 2 === 0 ? -125 : 125), opacity: 0 },
            {
              xPercent: 0,
              // Cada ala vuelve a SU opacidad, no a 1: la plateada vive al 6 %
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

        // La ciudad, muy despacio y solo de lado: es el fondo del fondo.
        const ciudad = raiz.current?.querySelector("[data-ciudad]");
        if (ciudad) {
          g.fromTo(
            ciudad,
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
      {/* 1. El cielo. */}
      <div
        className="cielo absolute inset-0"
        style={{ "--cielo-fuerza": escena.cielo }}
      />

      {/* 2. Las alas, cruzando. */}
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
            // La cuña que muere en punta, igual que el ala del emblema.
            clipPath: "polygon(0 0, 100% 18%, 100% 82%, 0 100%)",
            // Solo rotación: el centrado va por `left`, no por un
            // translateX(-50%). GSAP descompone la matriz que encuentra, y con
            // un porcentaje dentro se lo quedaría convertido a píxeles fijos,
            // que al cambiar el ancho de la ventana dejaría las alas
            // descolocadas.
            transform: `rotate(${ANGULO}deg)`,
          }}
        />
      ))}

      {/* 3. La ciudad, anclada abajo. */}
      {escena.ciudad && (
        <div
          data-ciudad
          className="horizonte absolute inset-x-0 bottom-0"
          style={{ height: escena.ciudad.alto, opacity: escena.ciudad.opacidad }}
        />
      )}

      {/* 4. El asfalto, lo último, tapando el pie de la ciudad. */}
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
 * Las recetas. Cada escena dice cuánto cielo lleva, qué alas la cruzan, y si
 * se ven la ciudad y el asfalto.
 *
 * El naranja nunca llena la pantalla: en sus publicaciones tampoco, porque el
 * negro es lo que hace que el naranja se vea naranja. Si lo cubriera todo
 * dejaría de ser un cielo y sería un fondo de color.
 *
 * La ciudad y el asfalto van en MEDIDAS ABSOLUTAS y no en porcentaje del alto
 * de la sección. Con porcentajes, una portada a `min-h-svh` en un monitor alto
 * estiraba la ciudad hasta que las torres medían más que el titular: dejaba de
 * parecer una ciudad al fondo y parecía un muro. Una ciudad se ve lejos porque
 * es pequeña, y eso no depende de lo alta que sea la sección.
 */
const ESCENAS = {
  // La portada: la escena completa, como una pieza suya de Instagram.
  portada: {
    cielo: 1,
    ciudad: { alto: "clamp(150px, 30vh, 330px)", opacidad: 0.9 },
    asfalto: { alto: "clamp(90px, 16vh, 190px)", opacidad: 0.85 },
    alas: [
      { top: "6%", alto: "11%", color: "var(--color-naranja)", opacidad: 0.75, izquierda: "-50%" },
      { top: "30%", alto: "4%", color: "var(--color-plata)", opacidad: 0.1, izquierda: "-38%" },
      { top: "52%", alto: "18%", color: "var(--color-naranja-hondo)", opacidad: 0.3, izquierda: "-56%" },
    ],
  },

  // Las secciones: el mismo cielo, bajado de tono para no competir con el
  // texto que lleva encima, y la ciudad apenas insinuada.
  seccion: {
    cielo: 0.45,
    ciudad: { alto: "clamp(90px, 18vh, 200px)", opacidad: 0.45 },
    asfalto: null,
    alas: [
      { top: "12%", alto: "6%", color: "var(--color-naranja)", opacidad: 0.4, izquierda: "-52%" },
      { top: "58%", alto: "14%", color: "var(--color-plata)", opacidad: 0.05, izquierda: "-40%" },
    ],
  },

  // Donde solo hace falta que se note que hay una casa detrás.
  sutil: {
    cielo: 0.22,
    ciudad: null,
    asfalto: null,
    alas: [
      { top: "24%", alto: "4%", color: "var(--color-naranja)", opacidad: 0.26, izquierda: "-50%" },
    ],
  },
};
