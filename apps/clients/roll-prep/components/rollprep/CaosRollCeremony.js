"use client";

import { useEffect, useState } from "react";
import { readRoll, cardTone, TIER_LABELS, CAOS_POINTS } from "@/libs/caos";

// Ceremonia de roleo del Torneo CAOS: pantalla completa, pensada para
// grabarla. Va por fases —el dado carga, impacta, cae el TERRENO, chocan
// las dos cartas de duelo y sube el veredicto— y se puede repetir con un
// botón sin volver a rolear, para agarrar la toma buena.
const PHASE_DELAYS = [0, 1150, 1420, 2250, 3050];
const LAST_PHASE = PHASE_DELAYS.length - 1;

export default function CaosRollCeremony({
  roll,
  student1Id,
  student2Id,
  names,
  onClose,
}) {
  const [phase, setPhase] = useState(0);
  const [run, setRun] = useState(0);

  useEffect(() => {
    if (
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches
    ) {
      setPhase(LAST_PHASE);
      return;
    }

    setPhase(0);
    const timers = PHASE_DELAYS.slice(1).map((delay, i) =>
      setTimeout(() => setPhase(i + 1), delay)
    );
    return () => timers.forEach(clearTimeout);
  }, [run]);

  // Escape cierra: útil cuando estás grabando y quieres cortar rápido.
  useEffect(() => {
    const onKey = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const reading = readRoll(roll);
  if (!reading) return null;

  const { tier, terrain, duel, start, sides, spread, bounty } = reading;
  const isCharging = phase === 0;
  const isBrutal = tier === 3;

  const fighters = [
    { id: student1Id, side: sides.student1 },
    { id: student2Id, side: sides.student2 },
  ];
  const underdog = fighters.find((f) => f.side.weight < 0);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-base-100/95 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Roleo del CAOS"
    >
      {/* Fondo: trama halftone + líneas de velocidad mientras carga */}
      <div aria-hidden="true" className="halftone pointer-events-none absolute inset-0 opacity-40" />
      {isCharging && <div aria-hidden="true" className="caos-speed" />}

      {/* Flash del impacto */}
      {phase === 1 && (
        <div
          aria-hidden="true"
          className="caos-flash pointer-events-none absolute inset-0 bg-primary"
        />
      )}

      <span
        aria-hidden="true"
        className="display text-stroke pointer-events-none absolute -left-6 top-1/3 select-none text-[13rem] leading-none opacity-40 md:text-[20rem]"
      >
        CAOS
      </span>

      <div
        className={`relative z-10 w-full max-w-3xl ${isCharging ? "caos-shake" : ""}`}
      >
        {/* ---------------- Fase 0: el dado cargando ---------------- */}
        {isCharging ? (
          <div className="flex flex-col items-center gap-6 py-16">
            <div className="relative">
              <div
                aria-hidden="true"
                className="caos-burst absolute inset-0 rounded-full bg-primary/30"
              />
              <D20 className="caos-tumble h-32 w-32 text-primary" />
            </div>
            <p className="display text-4xl md:text-6xl">
              Roleando<span className="text-primary">...</span>
            </p>
            <p className="text-[0.65rem] font-black uppercase tracking-[0.35em] opacity-60">
              El tatami decide
            </p>
          </div>
        ) : (
          <div className="space-y-4 py-6">
            {/* ---------------- Encabezado ---------------- */}
            <div className="caos-slam flex items-center justify-between gap-3">
              <span className="tag-skew bg-primary px-3 py-1 text-xs text-primary-content">
                <span>Torneo CAOS</span>
              </span>
              <span
                className={`tag-skew px-3 py-1 text-xs ${
                  isBrutal
                    ? "blink-soft bg-accent text-accent-content"
                    : "bg-base-300 text-base-content"
                }`}
              >
                <span>
                  Nivel {tier} · {TIER_LABELS[tier]}
                </span>
              </span>
            </div>

            {/* ---------------- TERRENO ---------------- */}
            <div className={`caos-slam caos-card caos-card-neutro ${isBrutal ? "" : ""}`}>
              <div className="caos-tier-bar text-secondary" />
              <div className="stripes p-4 md:p-5">
                <p className="text-[0.6rem] font-black uppercase tracking-[0.3em] opacity-60">
                  Terreno · aplica a los dos
                </p>
                <p className="caos-title mt-1 text-3xl md:text-4xl">{terrain.name}</p>
                <p className="mt-2 text-sm font-medium opacity-80">{terrain.rule}</p>
              </div>
            </div>

            {/* ---------------- DUELO: las dos cartas ---------------- */}
            {phase >= 3 && (
              <>
                <div className="flex items-center gap-3">
                  <div className="h-px flex-1 bg-base-300" />
                  <p className="display text-2xl">
                    {duel.name}
                    <span className="text-primary">.</span>
                  </p>
                  <div className="h-px flex-1 bg-base-300" />
                </div>

                <div className="grid grid-cols-2 gap-2 md:gap-3">
                  {fighters.map(({ id, side }, i) => {
                    const tone = cardTone(side.weight);
                    return (
                      <div
                        key={id ?? i}
                        className={`caos-card caos-card-${tone} ${
                          i === 0 ? "caos-fly-left" : "caos-fly-right"
                        } ${isBrutal && tone === "omega" ? "caos-brutal" : ""}`}
                      >
                        <div
                          className={`caos-tier-bar ${
                            tone === "alfa"
                              ? "text-primary"
                              : tone === "omega"
                                ? "text-accent"
                                : "text-secondary"
                          }`}
                        />
                        <div className="p-3 md:p-4">
                          <p className="truncate text-[0.6rem] font-black uppercase tracking-[0.2em] opacity-60">
                            {names[id] ?? "Peleador"}
                          </p>
                          <p
                            className={`caos-title mt-1 text-xl md:text-2xl ${
                              tone === "alfa"
                                ? "text-primary"
                                : tone === "omega"
                                  ? "text-accent"
                                  : ""
                            }`}
                          >
                            {side.card.name}
                          </p>
                          <p className="mt-2 text-xs font-medium opacity-80 md:text-sm">
                            {side.card.rule}
                          </p>
                          {side.weight !== 0 && (
                            <p
                              className={`mt-3 text-[0.6rem] font-black uppercase tracking-[0.2em] ${
                                tone === "alfa" ? "text-primary" : "text-accent"
                              }`}
                            >
                              {tone === "alfa"
                                ? `Ventaja +${side.weight}`
                                : `Carga ${side.weight}`}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <p className="border border-base-300 bg-base-200 px-4 py-2 text-xs font-semibold opacity-80">
                  <span className="font-black uppercase tracking-[0.2em] opacity-60">
                    Arrancan:{" "}
                  </span>
                  {start}
                </p>
              </>
            )}

            {/* ---------------- Veredicto ---------------- */}
            {phase >= 4 && (
              <div className="caos-verdict space-y-3">
                <div
                  className={`clip-cut border-2 p-4 text-center ${
                    spread > 0
                      ? "border-accent bg-accent/10"
                      : "border-secondary bg-base-200"
                  }`}
                >
                  {spread > 0 ? (
                    <>
                      <p className="text-[0.6rem] font-black uppercase tracking-[0.3em] text-accent">
                        Recompensa por remontar
                      </p>
                      <p className="display mt-1 text-3xl md:text-4xl">
                        {names[underdog?.id] ?? "El que carga"} gana{" "}
                        <span className="text-accent">+{bounty} XP</span>
                      </p>
                      <p className="mt-1 text-xs font-semibold uppercase tracking-widest opacity-60">
                        Solo si se lleva la pelea desde la desventaja
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-[0.6rem] font-black uppercase tracking-[0.3em] opacity-60">
                        Duelo parejo
                      </p>
                      <p className="display mt-1 text-3xl md:text-4xl">
                        Sin ventaja<span className="text-primary">.</span>
                      </p>
                      <p className="mt-1 text-xs font-semibold uppercase tracking-widest opacity-60">
                        Los dos cargan lo mismo: no hay bono de remontada
                      </p>
                    </>
                  )}
                </div>

                <p className="text-center text-[0.65rem] font-black uppercase tracking-[0.25em] text-primary">
                  Finalizar por sumisión paga +{CAOS_POINTS.finish} XP extra a
                  quien gane
                </p>

                <div className="flex gap-2">
                  <button
                    type="button"
                    className="btn btn-outline flex-1"
                    onClick={() => setRun((n) => n + 1)}
                  >
                    Repetir animación
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary flex-1"
                    onClick={onClose}
                  >
                    A pelear
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Dado de veinte caras: el icono del CAOS.
function D20({ className }) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      stroke="currentColor"
      strokeWidth="4"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M50 4 6 30v40l44 26 44-26V30L50 4Z" />
      <path d="M50 4 22 48l28 48 28-48L50 4Z" />
      <path d="M6 30h16M94 30H78M22 48H6M78 48h16M22 48l-16 22M78 48l16 22" />
    </svg>
  );
}
