"use client";

// -----------------------------------------------------------------------------
// GSAP, en un solo sitio.
//
// Aquí se registran los plugins una única vez y se fijan los tiempos y curvas
// que usa toda la página, para que las cosas se muevan igual en todas partes:
// una ficha que entra en la portada y otra que entra en el catálogo tienen
// que sentirse iguales.
//
// El movimiento de esta página no es decorativo. La gráfica de DSS son las
// vetas del pan de oro cruzando por detrás de la unidad y un cielo dorado sobre
// asfalto,
// así que casi todo entra BARRIENDO: alas que cruzan, líneas de titular que
// suben desde detrás de una máscara y fotos que se abren con el mismo ángulo.
// Es la misma idea de sus publicaciones, pero en movimiento.
//
// Todo pasa por gsap.matchMedia(), que además de separar móvil y escritorio
// atiende "prefers-reduced-motion": quien lo pida no ve ni un movimiento, y al
// limpiar el contexto los elementos se quedan en su sitio, no invisibles.
// -----------------------------------------------------------------------------

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

/** Curva de la casa: arranca rápido y frena largo. */
export const SALIDA = "power3.out";

/** La curva de las entradas grandes: más seca al final, más "de catálogo". */
export const SALIDA_FUERTE = "expo.out";

export const TIEMPOS = {
  entrada: 0.9,
  corta: 0.45,
  larga: 1.25,
  escalonado: 0.07,
};

/**
 * El ángulo del ala de la marca, en grados.
 *
 * Muy tumbado a propósito: las vetas del pan de oro del sello cruzan casi
 * horizontales, y ese es el gesto que hay que repetir. Una diagonal marcada
 * sería el lenguaje de otra marca. Tiene que ir a la par con --angulo-dss de
 * globals.css.
 */
export const ANGULO = -9;

/** Punto de disparo estándar: cuando al elemento le falta poco para entrar. */
export const DISPARO = "top 85%";

let registrado = false;

export function usarGsap() {
  if (!registrado && typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger, SplitText);
    gsap.defaults({ ease: SALIDA, duration: TIEMPOS.entrada });
    registrado = true;
  }
  return { gsap, ScrollTrigger, SplitText };
}

/**
 * Quita el marcador que tenía oculto al elemento.
 *
 * Es la regla `[data-anima] { opacity: 0 }` de globals.css la que lo ocultaba,
 * así que quitar el atributo es lo que de verdad lo muestra. A partir de ahí el
 * elemento deja de depender de nada: aunque algo borre los estilos en línea,
 * se queda visible.
 */
export function mostrar(nodo) {
  if (!nodo) return;
  for (const n of Array.isArray(nodo) ? nodo : [nodo]) {
    n?.removeAttribute?.("data-anima");
  }
}

/**
 * Atajo para animar dentro de un componente y limpiar al desmontar.
 *
 * `gsap.context` recoge todo lo que se cree dentro —tweens y ScrollTriggers— y
 * lo mata de una vez. Sin esto, navegar entre páginas deja disparadores
 * huérfanos apuntando a nodos que ya no existen.
 *
 * Lo que `construir` devuelva se ejecuta también al limpiar: es donde va el
 * `split.revert()` de los titulares, que gsap.context no conoce.
 *
 * @param {Function} construir  recibe (gsap, ScrollTrigger) y monta la animación
 * @param {HTMLElement} ambito  raíz para los selectores de gsap
 */
export function contexto(construir, ambito) {
  const { gsap: g, ScrollTrigger: st } = usarGsap();
  let limpiezas = [];

  const ctx = g.context(() => {
    const mm = g.matchMedia();

    // Quien pide menos movimiento ve el resultado final, sin recorrido.
    // Se limpia a mano porque el ámbito de gsap.context solo alcanza a los
    // descendientes, y muchas veces el elemento a mostrar es el ámbito mismo.
    mm.add("(prefers-reduced-motion: reduce)", () => {
      const raiz = ambito?.current ?? ambito;
      if (!raiz) return;
      const nodos = [raiz, ...raiz.querySelectorAll("[data-anima]")];
      g.set(nodos, { clearProps: "all" });
      mostrar(nodos);
    });

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const suelta = construir(g, st);
      if (typeof suelta === "function") limpiezas.push(suelta);
    });
  }, ambito);

  return () => {
    for (const suelta of limpiezas) suelta();
    limpiezas = [];
    ctx.revert();
  };
}

/** Entrada básica: sube, aparece y se asienta. */
export function entrar(g, objetivo, opciones = {}) {
  return g.fromTo(
    objetivo,
    { opacity: 0, y: 28 },
    { opacity: 1, y: 0, duration: TIEMPOS.entrada, ...opciones }
  );
}

/**
 * El titular, línea a línea, saliendo de detrás de una máscara.
 *
 * `mask: "lines"` envuelve cada línea en una caja recortada, así que la línea
 * no aparece: ASOMA. Es el movimiento que mejor traduce el corte diagonal del
 * catálogo impreso.
 *
 * `autoSplit` vuelve a partir el texto cuando terminan de cargar las
 * tipografías y cuando cambia el ancho: sin eso, un titular partido con la
 * fuente de respaldo se queda con los saltos en el sitio equivocado.
 *
 * Devuelve la función de limpieza; hay que llamarla al desmontar porque
 * SplitText reescribe el DOM y gsap.context no lo deshace solo.
 */
export function revelarTexto(g, nodo, opciones = {}) {
  if (!nodo) return () => {};

  const {
    retraso = 0,
    disparo = DISPARO,
    escalonado = 0.09,
    duracion = TIEMPOS.larga,
    disparador = nodo,
    sesgo = true,
  } = opciones;

  // El contenedor se muestra ya: lo que se anima son sus líneas, y si se
  // quedara en opacity 0 no se vería ninguna.
  g.set(nodo, { opacity: 1 });
  mostrar(nodo);

  const split = SplitText.create(nodo, {
    type: "lines",
    mask: "lines",
    linesClass: "linea-titulo",
    autoSplit: true,
    onSplit: (self) =>
      g.fromTo(
        self.lines,
        { yPercent: 115, opacity: 0, ...(sesgo ? { skewY: 5 } : {}) },
        {
          yPercent: 0,
          opacity: 1,
          skewY: 0,
          duration: duracion,
          ease: SALIDA_FUERTE,
          delay: retraso / 1000,
          stagger: escalonado,
          scrollTrigger: { trigger: disparador, start: disparo, once: true },
        }
      ),
  });

  return () => split.revert();
}

/**
 * Un barrido en diagonal: el elemento se descubre con el ángulo de la marca.
 *
 * Es un `clip-path` animado, no una máscara de imagen, para que funcione sobre
 * cualquier cosa —una foto, un bloque de color, una tarjeta entera—.
 */
export function barrerDiagonal(g, objetivo, opciones = {}) {
  const { retraso = 0, duracion = TIEMPOS.larga, disparador = objetivo } = opciones;

  return g.fromTo(
    objetivo,
    { clipPath: "polygon(0 0, 0 0, -22% 100%, 0 100%)" },
    {
      clipPath: "polygon(0 0, 122% 0, 100% 100%, 0 100%)",
      duration: duracion,
      ease: "power4.inOut",
      delay: retraso / 1000,
      scrollTrigger: { trigger: disparador, start: DISPARO, once: true },
    }
  );
}

/**
 * Parallax atado al scroll.
 *
 * `scrub` y no una animación con duración: el movimiento tiene que ir pegado a
 * la rueda del ratón, no ir por su cuenta. Con `yPercent` da igual el alto real
 * del elemento.
 */
export function parallax(g, objetivo, opciones = {}) {
  const { desde = -9, hasta = 9, disparador = objetivo, escala } = opciones;

  return g.fromTo(
    objetivo,
    { yPercent: desde, ...(escala ? { scale: escala } : {}) },
    {
      yPercent: hasta,
      ...(escala ? { scale: 1 } : {}),
      ease: "none",
      scrollTrigger: {
        trigger: disparador,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    }
  );
}

/**
 * Una cifra que sube hasta su valor.
 *
 * Se anima un objeto intermedio y se escribe el texto formateado en cada
 * fotograma: así el contador puede enseñar "$7.500" y no un número pelado.
 */
export function contarHasta(g, nodo, valor, opciones = {}) {
  if (!nodo) return null;

  const {
    duracion = 1.6,
    formato = (n) => Math.round(n).toLocaleString("es-VE"),
    disparador = nodo,
  } = opciones;

  const estado = { n: 0 };

  return g.to(estado, {
    n: valor,
    duration: duracion,
    ease: "power2.out",
    onUpdate: () => {
      nodo.textContent = formato(estado.n);
    },
    scrollTrigger: { trigger: disparador, start: "top 90%", once: true },
  });
}
