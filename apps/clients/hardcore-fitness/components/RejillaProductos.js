"use client";

import { Children, useEffect, useRef } from "react";
import { contexto, DISPARO } from "@/libs/animaciones";

/**
 * La cuadrícula de productos, con entrada escalonada.
 *
 * Se usa `ScrollTrigger.batch` y no un disparador por tarjeta: con 231
 * productos, un ScrollTrigger cada uno sería un despilfarro. `batch` junta
 * las que entran a la vez y las anima en un solo tween escalonado.
 *
 * Las tarjetas llegan ya montadas desde el servidor y se pasan como children,
 * así que este componente solo se ocupa del movimiento.
 */
export default function RejillaProductos({ children, className = "" }) {
  const raiz = useRef(null);
  // Basta con saber cuántas hay: si cambia el filtro cambia el número y se
  // vuelve a montar. Depender de `children` re-ejecutaría en cada render,
  // porque es un array nuevo cada vez.
  const cuantas = Children.count(children);

  useEffect(
    () =>
      contexto((g, st) => {
        const tarjetas = g.utils.toArray(raiz.current.children);
        if (!tarjetas.length) return;

        g.set(tarjetas, { opacity: 0, y: 26 });

        st.batch(tarjetas, {
          start: DISPARO,
          once: true,
          // Por filas: las que caen juntas entran juntas, con un escalón corto.
          batchMax: 8,
          onEnter: (grupo) =>
            g.to(grupo, {
              opacity: 1,
              y: 0,
              duration: 0.7,
              stagger: 0.06,
              overwrite: true,
            }),
        });
      }, raiz),
    [cuantas]
  );

  return (
    <div ref={raiz} className={className}>
      {children}
    </div>
  );
}
