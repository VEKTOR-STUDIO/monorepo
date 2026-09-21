"use client";

import { useEffect, useRef } from "react";
import Emblema from "@/components/MarcaTopMiami";
import { contexto } from "@/libs/animaciones";

// -----------------------------------------------------------------------------
// El escenario de Top Miami Cars.
//
// Su logotipo monta una sola escena: un ESCUDO de acero cepillado y, cruzándolo
// de lado a lado, la LÍNEA de un deportivo en azul. Eso es la identidad, así
// que aquí es un componente y no un adorno suelto: se monta como capa dentro de
// cualquier sección y la sección pasa a parecer una pieza suya.
//
//   <section className="relative overflow-hidden">
//     <Escenario />
//     …contenido…
//   </section>
//
// El escudo y la línea son vectores de verdad (components/MarcaTopMiami.js) y
// no un `background-image` por dos razones: la línea SE DIBUJA sola al entrar
// —el morro primero, el techo después, las ruedas al final, como quien la traza
// a mano— y las dos piezas se mueven a distinta velocidad al hacer scroll, que
// es lo que les da profundidad: el escudo casi quieto, la línea pasando por
// delante.
// -----------------------------------------------------------------------------

/**
 * @param {"portada"|"puerta"|"seccion"|"sutil"|"pie"} variante  cuánto pesa la escena
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
        const nodo = raiz.current;
        if (!nodo) return;

        const escudo = nodo.querySelector("[data-escudo]");
        const linea = nodo.querySelector("[data-linea]");
        const trazos = g.utils.toArray("[data-trazo]", nodo);

        const disparo = { trigger: nodo, start: "top 85%", once: true };

        // El escudo llega desde un poco más grande y desenfocado, como una
        // chapa que se posa. `clearProps` al final: un `filter` que se queda
        // puesto abre un contexto de apilado y cuesta pintar en cada scroll.
        if (escudo) {
          g.fromTo(
            escudo,
            { opacity: 0, scale: 1.12, filter: "blur(10px)" },
            {
              opacity: 1,
              scale: 1,
              filter: "blur(0px)",
              duration: 1.5,
              ease: "expo.out",
              clearProps: "filter",
              scrollTrigger: disparo,
            }
          );
        }

        // La línea se dibuja. Todos los trazos llevan pathLength="1", así que
        // con un solo número se animan todos, midan lo que midan.
        if (trazos.length) {
          g.fromTo(
            trazos,
            { strokeDasharray: 1, strokeDashoffset: 1 },
            {
              strokeDashoffset: 0,
              duration: 1.6,
              ease: "power2.inOut",
              stagger: 0.12,
              delay: 0.25,
              scrollTrigger: disparo,
              // Al acabar se quita el guion: con él puesto, un cambio de ancho
              // de ventana deja a veces un corte de un píxel a mitad de trazo.
              onComplete: () => g.set(trazos, { clearProps: "strokeDasharray,strokeDashoffset" }),
            }
          );
        }

        if (!deslizar) return;

        // Al hacer scroll, cada pieza a su velocidad. Con `scrub` van pegadas
        // a la rueda.
        const recorrido = {
          trigger: nodo,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        };

        if (escudo) g.to(escudo, { yPercent: 7, ease: "none", scrollTrigger: recorrido });
        if (linea) g.to(linea, { xPercent: -5, yPercent: -18, ease: "none", scrollTrigger: recorrido });
      }, raiz),
    [deslizar, variante]
  );

  return (
    <div
      ref={raiz}
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden="true"
    >
      {/* 1. La luz del salón: blanca en el centro, gris frío hacia los bordes. */}
      {escena.salon && <div className="estudio absolute inset-0" />}

      {/* 2. El emblema —escudo y línea—, grande y muy bajado de tono. */}
      {/* La proporción va en ESTA caja y no en el emblema: es la que está
          posicionada en absoluto, y a una caja así el navegador sí le saca el
          ancho a partir del alto. Con la proporción solo dentro, la caja no
          tiene ancho propio y el emblema se queda en cero. */}
      <div className={`absolute aspect-[624/468] ${escena.emblema}`}>
        <Emblema className="w-full" biseles={escena.biseles} linea={escena.linea} />
      </div>

      {/* 3. El piso pulido, anclado abajo. */}
      {escena.piso && (
        <div className="piso absolute inset-x-0 bottom-0" style={{ height: escena.piso }} />
      )}
    </div>
  );
}

/**
 * Las recetas. Cada escena dice dónde va el emblema, cuánto pesa, y si lleva
 * la luz del salón y el piso.
 *
 * El emblema nunca va a plena potencia: el acero a tamaño de pared se come el
 * texto que lleva encima. En la portada de escritorio, donde tiene sitio propio
 * a la derecha, sube; en el móvil —donde cae justo detrás del titular— y en las
 * secciones se queda en marca de agua.
 *
 * La caja se da por ALTO y el ancho sale de la proporción del logotipo. Fuera
 * de la portada y la puerta —que miden una pantalla— el alto va en `rem` y NO
 * en porcentaje: la ficha de una unidad mide 4.000 px, y un escudo al 120 % de
 * eso eran dos bandas grises cruzando la página entera, no un escudo.
 *
 * Van como clases enteras y no como trozos que se concatenan: Tailwind solo
 * genera las clases que encuentra escritas tal cual en el código.
 */
const ESCENAS = {
  // La portada. En escritorio el emblema va DETRÁS DEL TITULAR, a la izquierda,
  // y no detrás de la unidad: la tarjeta de la derecha ya lleva su propio
  // escudo, y con otro detrás asomaba el morro de la línea por un lado de la
  // tarjeta como una flecha suelta. A la izquierda, la línea se dibuja por
  // detrás de las letras, que es justo lo que hace en el logotipo.
  portada: {
    salon: true,
    piso: "clamp(44px, 7vh, 80px)",
    biseles: true,
    linea: true,
    emblema:
      "top-[4.5rem] right-[-9rem] h-[19rem] opacity-20 sm:right-[-4rem] sm:h-[26rem] lg:top-[7%] lg:right-auto lg:left-[-5rem] lg:h-[min(86%,50rem)] lg:opacity-[0.17]",
  },

  // La puerta de la demo. Ahí el logotipo de verdad ya está a la vista, así que
  // el emblema dibujado no puede competir con él: va centrado, enorme y muy
  // bajado, cruzando por detrás de las dos columnas. En el móvil se baja a la
  // mitad de abajo, detrás de la caja de acceso, para no quedar justo debajo
  // del logotipo haciendo de eco. En escritorio va corrido a la derecha por lo
  // mismo: centrado, el morro de la línea cruzaba por encima del logotipo.
  puerta: {
    salon: true,
    piso: "clamp(70px, 14vh, 160px)",
    biseles: true,
    linea: true,
    emblema:
      "top-[46%] left-1/2 h-[52%] -translate-x-1/2 opacity-[0.13] lg:top-[5%] lg:left-[64%] lg:h-[90%] lg:opacity-[0.2]",
  },

  // Las secciones: marca de agua, a la derecha, medio salida.
  seccion: {
    salon: false,
    piso: null,
    biseles: true,
    linea: true,
    emblema:
      "top-[3rem] right-[-10rem] h-[18rem] opacity-[0.12] lg:top-[3.5rem] lg:right-[-7rem] lg:h-[38rem] lg:opacity-[0.17]",
  },

  // Donde solo hace falta que se note que hay una casa detrás.
  sutil: {
    salon: false,
    piso: null,
    biseles: false,
    linea: true,
    emblema:
      "top-[2rem] right-[-8rem] h-[16rem] opacity-[0.08] lg:right-[-6rem] lg:h-[32rem] lg:opacity-[0.11]",
  },

  // El pie: solo el escudo. Ahí debajo hay una dirección y un teléfono, y la
  // línea del carro les pasaba por encima como un tachón.
  pie: {
    salon: false,
    piso: null,
    biseles: false,
    linea: false,
    emblema:
      "top-[2rem] right-[-8rem] h-[16rem] opacity-[0.08] lg:top-[-2rem] lg:right-[-3rem] lg:h-[30rem] lg:opacity-[0.12]",
  },
};
