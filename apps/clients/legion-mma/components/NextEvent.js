"use client";

import { useEffect, useMemo, useState } from "react";
import config from "@/config";

function getRemaining(target) {
  const diff = target.getTime() - Date.now();
  if (diff <= 0) return { d: 0, h: 0, m: 0, s: 0, expired: true };
  const d = Math.floor(diff / (1000 * 60 * 60 * 24));
  const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const m = Math.floor((diff / 1000 / 60) % 60);
  const s = Math.floor((diff / 1000) % 60);
  return { d, h, m, s, expired: false };
}

const TimeBlock = ({ value, label }) => (
  <div className="flex flex-col items-center min-w-[5rem] sm:min-w-[6rem]">
    <div className="font-display text-5xl sm:text-7xl text-base-content leading-none tabular-nums">
      {String(value).padStart(2, "0")}
    </div>
    <div className="text-[0.6rem] sm:text-xs tracking-[0.3em] uppercase text-primary font-bold mt-2">
      {label}
    </div>
  </div>
);

const NextEvent = () => {
  const target = useMemo(() => new Date(config.event.date), []);
  const [t, setT] = useState(() => getRemaining(target));
  // En render inicial (SSR) no asumimos "finalizado" para evitar mismatch de hidratación.
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const id = setInterval(() => setT(getRemaining(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  const dateLabel = target
    .toLocaleDateString("es-VE", { weekday: "long", day: "numeric", month: "long", year: "numeric" })
    .toUpperCase();

  // El evento ya pasó: pasamos a modo "recap" en vez de un contador roto.
  const finished = mounted && t.expired;

  return (
    <section
      id="proximo-evento"
      className="relative bg-base-200 border-y-4 border-primary py-20 lg:py-28 overflow-hidden"
    >
      {/* Diagonal accent stripes */}
      <div
        className="absolute -top-1 left-0 right-0 h-2 bg-primary"
        aria-hidden
      />
      <div
        className="absolute inset-0 opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, var(--color-primary) 0 2px, transparent 2px 14px)",
        }}
        aria-hidden
      />

      <div className="relative max-w-6xl mx-auto px-6 lg:px-10 text-center">
        <div className="inline-flex items-center gap-3 mb-6">
          <span className="w-10 h-px bg-primary" />
          <p className="text-primary font-bold text-xs uppercase tracking-[0.4em] inline-flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full bg-primary ${finished ? "" : "animate-pulse"}`} />
            {finished ? "Último Evento" : "Próximo Evento"}
          </p>
          <span className="w-10 h-px bg-primary" />
        </div>

        <h2
          className="font-display leading-none mb-3"
          style={{ fontSize: "clamp(3rem, 8vw, 6rem)" }}
        >
          {config.event.name}{" "}
          <span className="text-primary">{config.event.edition}</span>
        </h2>

        <p className="text-base-content/70 text-xs sm:text-sm tracking-[0.3em] uppercase font-bold mb-12">
          {dateLabel} · {config.event.venue} · {config.event.city}
        </p>

        {finished ? (
          <div className="mb-12">
            <span
              className="inline-block bg-primary text-primary-content px-8 py-3 font-display text-xl sm:text-3xl tracking-[0.3em] italic mb-4"
              style={{ transform: "skewX(-8deg)" }}
            >
              Evento Finalizado
            </span>
            <p className="text-base-content/60 text-sm tracking-[0.2em] uppercase font-bold">
              Revive la cartelera completa de la noche
            </p>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-3 sm:gap-8 mb-12 flex-wrap">
            <TimeBlock value={t.d} label="Días" />
            <span className="font-display text-5xl sm:text-7xl text-primary/40">:</span>
            <TimeBlock value={t.h} label="Horas" />
            <span className="font-display text-5xl sm:text-7xl text-primary/40">:</span>
            <TimeBlock value={t.m} label="Min" />
            <span className="font-display text-5xl sm:text-7xl text-primary/40">:</span>
            <TimeBlock value={t.s} label="Seg" />
          </div>
        )}

        {finished ? (
          <a
            href="#cartelera"
            className="btn btn-primary px-12 py-4 text-base"
          >
            Ver Cartelera
          </a>
        ) : (
          <a
            href={config.event.ticketUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary px-12 py-4 text-base"
            style={{ animation: "var(--animate-pulse-gold)" }}
          >
            Comprar Entradas
          </a>
        )}
      </div>
    </section>
  );
};

export default NextEvent;
