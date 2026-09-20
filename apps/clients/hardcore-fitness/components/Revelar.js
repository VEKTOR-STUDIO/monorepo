"use client";

import { useEffect, useRef } from "react";

/**
 * Hace aparecer a su contenido cuando entra en pantalla.
 *
 * Un solo IntersectionObserver por instancia, que se desconecta en cuanto ha
 * revelado: no hace falta seguir observando algo que ya se vio. Si el navegador
 * no lo soporta, o el usuario pidió menos movimiento (lo resuelve el CSS), el
 * contenido simplemente está ahí.
 */
export default function Revelar({ children, retraso = 0, className = "", as: Etiqueta = "div" }) {
  const referencia = useRef(null);

  useEffect(() => {
    const nodo = referencia.current;
    if (!nodo) return;

    if (typeof IntersectionObserver === "undefined") {
      nodo.dataset.revelar = "visible";
      return;
    }

    const observador = new IntersectionObserver(
      ([entrada]) => {
        if (!entrada.isIntersecting) return;
        nodo.dataset.revelar = "visible";
        observador.disconnect();
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.05 }
    );

    observador.observe(nodo);
    return () => observador.disconnect();
  }, []);

  return (
    <Etiqueta
      ref={referencia}
      data-revelar=""
      style={retraso ? { transitionDelay: `${retraso}ms` } : undefined}
      className={className}
    >
      {children}
    </Etiqueta>
  );
}
