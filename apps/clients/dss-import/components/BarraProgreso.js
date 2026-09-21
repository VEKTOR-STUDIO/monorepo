"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { usarGsap } from "@/libs/animaciones";

/**
 * El hilo de oro de arriba: cuánto llevas leído de la página.
 *
 * Es el único elemento de movimiento que está siempre en pantalla, así que
 * tiene que ser el más discreto de todos: dos píxeles de alto y el oro de la
 * casa. Va atado al scroll con `scrub`, sin duración propia, para que se
 * sienta pegado a la rueda y no persiguiéndola.
 *
 * Se recalcula al cambiar de página porque cada una mide distinto; sin eso, al
 * navegar desde una página larga a una corta la barra se queda llena.
 */
export default function BarraProgreso() {
  const barra = useRef(null);
  const ruta = usePathname();

  useEffect(() => {
    const nodo = barra.current;
    if (!nodo) return;

    const { gsap, ScrollTrigger } = usarGsap();

    // Quien pide menos movimiento no necesita este adorno.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const tween = gsap.fromTo(
      nodo,
      { scaleX: 0 },
      {
        scaleX: 1,
        ease: "none",
        scrollTrigger: {
          trigger: document.documentElement,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.3,
          invalidateOnRefresh: true,
        },
      }
    );

    ScrollTrigger.refresh();

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [ruta]);

  return (
    <div
      className="pointer-events-none fixed inset-x-0 z-70 h-0.5"
      style={{ top: "var(--alto-barra-demo)" }}
      aria-hidden="true"
    >
      <div ref={barra} className="progreso h-full w-full bg-primary" />
    </div>
  );
}
