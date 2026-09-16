"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { FRAME_SEQUENCE, frameUrls } from "@/libs/exercise-animation";

// -----------------------------------------------------------------------------
// El "monigote" animado de un ejercicio.
//
// Apila los 3 fotogramas y va cambiando cuál está visible. Como todos están
// cargados desde el principio, el cambio no parpadea.
//
// Respeta "reducir movimiento" del sistema operativo: en ese caso se queda
// quieto en el fotograma central, que es el que mejor explica el ejercicio.
// -----------------------------------------------------------------------------
const ExerciseFigure = ({
  slug,
  name = "Ejercicio",
  speed = 700,          // ms por fotograma
  playing = true,
  className = "",
}) => {
  const frames = useMemo(() => frameUrls(slug), [slug]);
  const [step, setStep] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const timer = useRef(null);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(query.matches);
    const onChange = (event) => setReducedMotion(event.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (!slug || !playing || reducedMotion) return undefined;
    timer.current = setInterval(
      () => setStep((value) => (value + 1) % FRAME_SEQUENCE.length),
      Math.max(200, speed)
    );
    return () => clearInterval(timer.current);
  }, [slug, playing, reducedMotion, speed]);

  if (!slug) {
    return (
      <div
        className={`flex aspect-square w-full items-center justify-center border border-dashed border-base-300 bg-base-200/40 ${className}`}
        aria-hidden="true"
      >
        <span className="display text-2xl text-base-content/20">FM</span>
      </div>
    );
  }

  const activeFrame = reducedMotion ? 2 : FRAME_SEQUENCE[step];

  return (
    <div
      className={`relative aspect-square w-full overflow-hidden bg-base-200/40 ${className}`}
      role="img"
      aria-label={`Demostración del ejercicio ${name}`}
    >
      {frames.map((src, index) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={src}
          src={src}
          alt=""
          aria-hidden="true"
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-contain p-2 transition-opacity duration-200"
          style={{ opacity: activeFrame === index + 1 ? 1 : 0 }}
        />
      ))}
    </div>
  );
};

export default ExerciseFigure;
