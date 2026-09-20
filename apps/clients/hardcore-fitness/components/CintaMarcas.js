"use client";

import { useEffect, useRef } from "react";
import { contexto } from "@/libs/animaciones";

/**
 * Cinta de marcas que corre sin parar.
 *
 * La lista sale del catálogo, no de una lista escrita a mano: son las marcas
 * que Hardcore tiene de verdad. Se duplica el contenido para que el bucle
 * encaje sin salto (la animación desplaza justo la mitad).
 *
 * La lleva GSAP en vez de CSS por dos cosas que con @keyframes no se pueden:
 * la cinta acelera con la velocidad del scroll y cambia de sentido según
 * hacia dónde se mueva la página. Al parar el scroll vuelve sola a su ritmo.
 */
export default function CintaMarcas({ marcas }) {
  const raiz = useRef(null);

  useEffect(
    () =>
      contexto((g, st) => {
        const tira = raiz.current.querySelector("[data-tira]");
        if (!tira) return;

        const bucle = g.to(tira, {
          xPercent: -50,
          duration: 38,
          ease: "none",
          repeat: -1,
        });

        // La velocidad del scroll empuja la cinta: hacia abajo la acelera,
        // hacia arriba la hace retroceder. `timeScale` es lo que permite esto
        // sin tocar la animación en sí.
        let volver;
        st.create({
          trigger: raiz.current,
          start: "top bottom",
          end: "bottom top",
          onUpdate: (self) => {
            const empuje = g.utils.clamp(-3, 3, self.getVelocity() / 260);
            bucle.timeScale(empuje === 0 ? 1 : empuje);

            // Cuando el scroll se detiene, se vuelve al ritmo de crucero.
            volver?.kill();
            volver = g.delayedCall(0.4, () => {
              g.to(bucle, { timeScale: 1, duration: 0.8, overwrite: true });
            });
          },
        });

        // Al pasar el ratón, se para: si alguien quiere leer una marca, que pueda.
        const nodo = raiz.current;
        const parar = () => g.to(bucle, { timeScale: 0, duration: 0.4 });
        const seguir = () => g.to(bucle, { timeScale: 1, duration: 0.6 });
        nodo.addEventListener("pointerenter", parar);
        nodo.addEventListener("pointerleave", seguir);

        return () => {
          nodo.removeEventListener("pointerenter", parar);
          nodo.removeEventListener("pointerleave", seguir);
          volver?.kill();
        };
      }, raiz),
    [marcas]
  );

  if (!marcas?.length) return null;

  const tira = [...marcas, ...marcas];

  return (
    <section
      ref={raiz}
      className="relative overflow-hidden border-y border-base-content/10 py-5"
      aria-label="Marcas disponibles"
    >
      <div data-tira className="flex w-max items-center gap-10">
        {tira.map((marca, i) => (
          <span
            key={`${marca}-${i}`}
            className="display shrink-0 whitespace-nowrap text-lg text-base-content/25 transition-colors hover:text-primary"
            aria-hidden={i >= marcas.length ? "true" : undefined}
          >
            {marca}
          </span>
        ))}
      </div>

      {/* Desvanecido en los bordes para que las marcas entren y salgan. */}
      <div
        className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-linear-to-r from-base-100 to-transparent"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-linear-to-l from-base-100 to-transparent"
        aria-hidden="true"
      />
    </section>
  );
}
