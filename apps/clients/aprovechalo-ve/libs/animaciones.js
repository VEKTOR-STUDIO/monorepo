"use client";

// -----------------------------------------------------------------------------
// GSAP, en un solo sitio.
//
// Aquí se registra ScrollTrigger una única vez y se fijan los tiempos y curvas
// que usa toda la tienda, para que las cosas se muevan igual en todas partes:
// una ficha que entra en la portada y otra que entra en el catálogo tienen que
// sentirse iguales.
//
// Todo pasa por gsap.matchMedia(), que además de separar móvil y escritorio
// atiende "prefers-reduced-motion": quien lo pida no ve ni un movimiento, y al
// limpiar el contexto los elementos se quedan en su sitio, no invisibles.
// -----------------------------------------------------------------------------

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Curva única de la casa: arranca rápido y frena largo. Es la hermana de la
// que usa el CSS del proyecto (cubic-bezier(0.16, 1, 0.3, 1)), para que no se
// note el cambio entre lo que anima CSS y lo que anima GSAP.
export const SALIDA = "power3.out";

export const TIEMPOS = {
  entrada: 0.85,
  corta: 0.45,
  escalonado: 0.07,
};

/** Punto de disparo estándar: cuando al elemento le falta poco para entrar. */
export const DISPARO = "top 85%";

let registrado = false;

export function usarGsap() {
  if (!registrado && typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
    gsap.defaults({ ease: SALIDA, duration: TIEMPOS.entrada });
    registrado = true;
  }
  return { gsap, ScrollTrigger };
}

/**
 * Atajo para animar dentro de un componente y limpiar al desmontar.
 *
 * `gsap.context` recoge todo lo que se cree dentro —tweens y ScrollTriggers— y
 * lo mata de una vez. Sin esto, navegar entre páginas deja disparadores
 * huérfanos apuntando a nodos que ya no existen.
 *
 * @param {Function} construir  recibe (gsap, ScrollTrigger) y monta la animación
 * @param {HTMLElement} ambito  raíz para los selectores de gsap
 */
export function contexto(construir, ambito) {
  const { gsap: g, ScrollTrigger: st } = usarGsap();

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
      // Quitar el marcador es lo que de verdad los muestra: es la regla
      // [data-anima]{opacity:0} del CSS la que los tenía ocultos.
      for (const nodo of nodos) nodo.removeAttribute?.("data-anima");
    });

    mm.add("(prefers-reduced-motion: no-preference)", () => construir(g, st));
  }, ambito);

  return () => ctx.revert();
}

/** Entrada básica: sube, aparece y se asienta. */
export function entrar(g, objetivo, opciones = {}) {
  return g.from(objetivo, {
    opacity: 0,
    y: 28,
    duration: TIEMPOS.entrada,
    ...opciones,
  });
}
