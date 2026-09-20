"use client";

import { useEffect, useRef } from "react";
import { contexto } from "@/libs/animaciones";

/**
 * Las manchas de color del fondo.
 *
 * El cristal esmerilado solo se ve si hay algo que desenfocar: sobre un negro
 * plano, un `backdrop-filter` no hace nada y los paneles quedan como cajas
 * grises. Estas tres manchas se mueven despacio por detrás de todo y son las
 * que dan el efecto.
 *
 * Van fijas a la ventana y fuera del flujo: no ocupan sitio, no se pueden
 * pulsar y no se leen.
 */
export default function Ambiente() {
  const raiz = useRef(null);

  useEffect(
    () =>
      contexto((g) => {
        // Cada mancha con su ritmo, para que el conjunto nunca se repita a
        // simple vista. Movimientos largos y lentos: esto es atmósfera, no
        // un elemento que pida atención.
        g.to('[data-mancha="1"]', {
          xPercent: 12,
          yPercent: 18,
          scale: 1.15,
          duration: 22,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });

        g.to('[data-mancha="2"]', {
          xPercent: -16,
          yPercent: -10,
          scale: 0.88,
          duration: 28,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });

        g.to('[data-mancha="3"]', {
          xPercent: 9,
          yPercent: -14,
          duration: 34,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }, raiz),
    []
  );

  return (
    <div
      ref={raiz}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <div
        data-mancha="1"
        className="absolute -left-[15%] -top-[20%] size-[70vmax] rounded-full opacity-55"
        style={{
          background:
            "radial-gradient(circle, color-mix(in oklab, var(--color-primary) 30%, transparent), transparent 62%)",
          filter: "blur(90px)",
        }}
      />
      <div
        data-mancha="2"
        className="absolute -right-[20%] top-[25%] size-[60vmax] rounded-full opacity-45"
        style={{
          background:
            "radial-gradient(circle, color-mix(in oklab, var(--color-accent) 24%, transparent), transparent 62%)",
          filter: "blur(100px)",
        }}
      />
      <div
        data-mancha="3"
        className="absolute bottom-[-25%] left-[25%] size-[65vmax] rounded-full opacity-35"
        style={{
          background:
            "radial-gradient(circle, color-mix(in oklab, var(--color-primary) 22%, transparent), transparent 65%)",
          filter: "blur(110px)",
        }}
      />

      {/* Grano finísimo encima: quita las bandas que dejan los degradados
          grandes en pantallas de 8 bits. */}
      <div
        className="absolute inset-0 opacity-[0.035] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='r'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='120' height='120' filter='url(%23r)'/%3E%3C/svg%3E\")",
        }}
      />
    </div>
  );
}
