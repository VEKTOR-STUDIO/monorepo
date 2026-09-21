"use client";

import { useEffect, useRef } from "react";
import MarcaCorona from "@/components/MarcaCorona";
import { contexto, ANGULO } from "@/libs/animaciones";

// -----------------------------------------------------------------------------
// El escenario de Kings Cars.
//
// Aquí no hay cielo ni horizonte ni asfalto, y eso es una decisión tomada
// mirando su cuenta: Kings Cars no monta escenas: fotografía el carro donde
// está, lo enmarca y le pone encima su corona al agua. Su "fondo" es tres
// cosas, siempre las mismas:
//
//   1. LA LOSA. Su foto de perfil está calada sobre una piedra gris oscuro con
//      vetas, no sobre negro plano. Esa losa es el suelo de toda la marca.
//   2. LA CORONA AL AGUA. En cada publicación va arriba y al centro, grande,
//      en blanco translúcido sobre la foto. Es su firma.
//   3. LOS ROMBOS. Los dos huecos de la base de la corona, estirados en bandas
//      y deslizándose muy despacio. Es lo único inclinado de toda la casa, y
//      va aquí y no en el contenido justamente por eso.
//
// Se monta como capa dentro de cualquier sección y la sección pasa a parecer
// una pieza suya:
//
//   <section className="relative overflow-hidden">
//     <Escenario />
//     …contenido…
//   </section>
//
// Los rombos son elementos de verdad y no un `background-image` por dos
// razones: se pueden animar uno a uno —entran deslizándose, cada uno a su
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
        const rombos = g.utils.toArray("[data-rombo]", raiz.current);

        // Entrada: cada banda llega deslizándose desde su lado. Lo que se anima
        // es `xPercent`, así que el sesgo de la capa no se toca y no hay dos
        // transformaciones peleándose.
        if (rombos.length) {
          g.fromTo(
            rombos,
            { xPercent: (i) => (i % 2 === 0 ? -120 : 120), opacity: 0 },
            {
              xPercent: 0,
              // Cada banda vuelve a SU opacidad, no a 1: varias viven al 5 % y
              // llevarlas al 100 % convertiría el fondo en un tablero.
              opacity: (i) => escena.rombos[i].opacidad,
              duration: 1.3,
              ease: "expo.out",
              stagger: 0.11,
            }
          );
        }

        // La corona al agua respira: aparece y crece apenas. Nunca gira, que es
        // lo primero que se le hace a un logo y lo último que aguanta este.
        const corona = raiz.current?.querySelector("[data-corona]");
        if (corona) {
          g.fromTo(
            corona,
            { opacity: 0, scale: 1.08 },
            { opacity: escena.corona.opacidad, scale: 1, duration: 1.6, ease: "power3.out" }
          );
        }

        if (!deslizar) return;

        // Al hacer scroll, cada capa a su velocidad: las de atrás casi no se
        // mueven, las de delante sí. Con `scrub` van pegadas a la rueda.
        rombos.forEach((nodo, i) => {
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

        // La corona, más despacio que todo lo demás: es el fondo del fondo.
        if (corona) {
          g.to(corona, {
            yPercent: -12,
            ease: "none",
            scrollTrigger: {
              trigger: raiz.current,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          });
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
      {/* 1. La losa. */}
      <div
        className="piedra absolute inset-0"
        style={{ "--piedra-fuerza": escena.piedra }}
      />
      <div className="piedra-vetas absolute inset-0" />

      {/* 2. Los rombos, deslizándose. */}
      {escena.rombos.map((rombo, i) => (
        <span
          key={i}
          data-rombo
          className="absolute block"
          style={{
            top: rombo.top,
            left: rombo.izquierda,
            width: "175%",
            height: rombo.alto,
            background: rombo.color,
            opacity: rombo.opacidad,
            // Solo el sesgo del rombo: el centrado va por `left`, no por un
            // translateX(-50%). GSAP descompone la matriz que encuentra, y con
            // un porcentaje dentro se lo quedaría convertido a píxeles fijos,
            // que al cambiar el ancho de la ventana dejaría las bandas
            // descolocadas.
            transform: `skewX(${ANGULO}deg)`,
          }}
        />
      ))}

      {/* 3. La corona al agua, como en sus publicaciones: arriba y al centro.
             VA SIN MÁSCARA, y eso costó una pasada de capturas: con un degradado
             radial encima, la banda de la corona se desvanecía y lo que quedaba
             en pantalla era la estrella del pico suelta. Dejaba de leerse como
             una corona y parecía un destello cualquiera. Al 4 % de opacidad no
             hay ningún borde duro que suavizar, así que la máscara no resolvía
             nada y rompía la figura. */}
      {escena.corona && (
        <div
          data-corona
          className="absolute left-1/2 -translate-x-1/2"
          style={{
            top: escena.corona.top,
            width: escena.corona.ancho,
            opacity: escena.corona.opacidad,
          }}
        >
          <MarcaCorona className="h-auto w-full text-base-content" />
        </div>
      )}
    </div>
  );
}

/**
 * Las recetas. Cada escena dice cuánto pesa la losa, qué bandas la cruzan y
 * cuánta corona lleva.
 *
 * La corona al agua NUNCA pasa del 5 %. En sus publicaciones tampoco: es una
 * marca de agua sobre la foto, no un fondo. Subirla hasta que "se vea bien" es
 * exactamente lo que la convierte en un dibujo detrás del texto.
 *
 * La corona va en MEDIDAS ABSOLUTAS y no en porcentaje del alto de la sección.
 * Con porcentajes, una portada a `min-h-svh` en un monitor alto la estiraba
 * hasta que medía más que el titular: dejaba de ser una firma al fondo y
 * pasaba a ser el protagonista.
 */
const ESCENAS = {
  // La portada: la escena completa, como una pieza suya de Instagram.
  portada: {
    piedra: 1,
    corona: { top: "4%", ancho: "clamp(280px, 46vw, 680px)", opacidad: 0.05 },
    rombos: [
      { top: "14%", alto: "3px", color: "var(--color-hueso)", opacidad: 0.12, izquierda: "-42%" },
      { top: "46%", alto: "22%", color: "var(--color-piedra)", opacidad: 0.5, izquierda: "-50%" },
      { top: "76%", alto: "2px", color: "var(--color-rojo)", opacidad: 0.35, izquierda: "-38%" },
    ],
  },

  // Las secciones: la misma losa, bajada de tono para no competir con el texto
  // que lleva encima, y la corona apenas insinuada.
  seccion: {
    piedra: 0.5,
    corona: { top: "12%", ancho: "clamp(200px, 30vw, 420px)", opacidad: 0.035 },
    rombos: [
      { top: "22%", alto: "2px", color: "var(--color-hueso)", opacidad: 0.09, izquierda: "-44%" },
      { top: "60%", alto: "16%", color: "var(--color-piedra)", opacidad: 0.32, izquierda: "-50%" },
    ],
  },

  // Donde solo hace falta que se note que hay una casa detrás.
  sutil: {
    piedra: 0.24,
    corona: null,
    rombos: [
      { top: "34%", alto: "2px", color: "var(--color-hueso)", opacidad: 0.07, izquierda: "-46%" },
    ],
  },
};
