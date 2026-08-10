"use client";

import { useEffect, useState } from "react";
import { TERRAINS, DUELS, TIER_LABELS, CAOS_POINTS } from "@/libs/caos";
import D20 from "./D20";

// Demo del roleo en la landing: el visitante le da al botón y ve la misma
// ceremonia del torneo, en chiquito y dentro de la sección.
//
// Las tiradas NO son aleatorias a propósito. Son tres ejemplos escogidos a
// mano que recorren la escala de locura —brutal, leve y neutro— para que en
// tres clics se entienda el juego completo: que el terreno aplica a los dos,
// que el duelo puede partir la pelea en ventaja y carga, y que cuando el
// duelo es parejo no hay bono que pagar. Un random podía sacar tres tier 1
// seguidos y no enseñar nada.
const EXAMPLES = [
  { terrain: "muerte_subita", duel: "t3_rey_de_la_montada" },
  { terrain: "esquina_caliente", duel: "t1_guardia_cerrada" },
  { terrain: "reloj_roto", duel: "n_espalda_con_espalda" },
]
  .map((example) => ({
    terrain: TERRAINS.find((t) => t.key === example.terrain),
    duel: DUELS.find((d) => d.key === example.duel),
  }))
  // Si mañana se retira una carta del mazo, el ejemplo desaparece en vez de
  // reventar la landing.
  .filter((example) => example.terrain && example.duel);

// Mismas fases que CaosRollCeremony, un pelín más rápidas: aquí nadie está
// grabando, solo hojeando.
const PHASE_DELAYS = [0, 1000, 1350, 1950];
const LAST_PHASE = PHASE_DELAYS.length - 1;

export default function CaosRollDemo() {
  const [index, setIndex] = useState(0);
  // Arranca en la última fase: quien llega a la landing ve el ejemplo armado,
  // sin animación de entrada. El show solo pasa cuando lo piden.
  const [phase, setPhase] = useState(LAST_PHASE);
  const [run, setRun] = useState(0);

  useEffect(() => {
    if (run === 0) return;

    if (window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches) {
      setPhase(LAST_PHASE);
      return;
    }

    setPhase(0);
    const timers = PHASE_DELAYS.slice(1).map((delay, i) =>
      setTimeout(() => setPhase(i + 1), delay)
    );
    return () => timers.forEach(clearTimeout);
  }, [run]);

  if (EXAMPLES.length === 0) return null;

  const { terrain, duel } = EXAMPLES[index];
  const tier = duel.tier;
  const isBrutal = tier === 3;
  const isRolling = phase === 0;
  // Diferencia de peso = 2 × tier, a 10 XP el punto: 0 / 20 / 40 / 60.
  const bounty = tier * 2 * CAOS_POINTS.upsetPerWeight;

  const roll = () => {
    setIndex((i) => (i + 1) % EXAMPLES.length);
    setRun((n) => n + 1);
  };

  return (
    <div className="mt-16">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[0.6rem] font-black uppercase tracking-[0.3em] text-primary">
            Anatomía de un roleo
          </p>
          <h3 className="display mt-2 text-3xl md:text-4xl">
            Así se ve una pelea del CAOS
          </h3>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-[0.6rem] font-bold uppercase tracking-widest opacity-50">
            Ejemplo {index + 1} de {EXAMPLES.length}
          </span>
          <button
            type="button"
            className="btn btn-outline btn-sm gap-2 md:btn-md"
            onClick={roll}
            disabled={isRolling}
          >
            <D20 className={`h-4 w-4 ${isRolling ? "caos-tumble" : ""}`} />
            {isRolling ? "Roleando..." : "Rolear otra vez"}
          </button>
        </div>
      </div>

      {/* min-h para que la página no pegue un brinco al cambiar de tirada. */}
      <div className="relative mt-6 min-h-[30rem]" aria-live="polite">
        {isRolling ? (
          <div className="caos-shake relative flex min-h-[30rem] flex-col items-center justify-center overflow-hidden border-2 border-base-300 bg-base-200">
            <div
              className="halftone absolute inset-0 opacity-40"
              aria-hidden="true"
            />
            <div className="caos-speed" aria-hidden="true" />

            <div className="relative">
              <div
                aria-hidden="true"
                className="caos-burst absolute inset-0 rounded-full bg-primary/30"
              />
              <D20 className="caos-tumble h-24 w-24 text-primary" />
            </div>
            <p className="display relative mt-6 text-4xl md:text-5xl">
              Roleando<span className="text-primary">...</span>
            </p>
            <p className="relative mt-2 text-[0.65rem] font-black uppercase tracking-[0.35em] opacity-60">
              El tatami decide
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {/* El flash del impacto, igual que en la ceremonia del torneo. */}
            {phase === 1 && (
              <div
                aria-hidden="true"
                className="caos-flash pointer-events-none absolute inset-0 z-10 bg-primary"
              />
            )}

            <div className="caos-slam flex flex-wrap items-center gap-2">
              <span
                className={`tag-skew px-3 py-1 text-xs ${
                  isBrutal
                    ? "blink-soft bg-accent text-accent-content"
                    : "bg-base-300"
                }`}
              >
                <span>
                  Nivel {tier} · {TIER_LABELS[tier]}
                </span>
              </span>
              <span className="text-[0.6rem] font-bold uppercase tracking-widest opacity-50">
                {duel.start}
              </span>
            </div>

            {/* TERRENO — igual para los dos */}
            <div className="caos-slam caos-card caos-card-neutro">
              <div className="caos-tier-bar text-secondary" aria-hidden="true" />
              <div className="stripes p-5">
                <p className="text-[0.6rem] font-black uppercase tracking-[0.3em] opacity-60">
                  Terreno · aplica a los dos
                </p>
                <p className="caos-title mt-1 text-3xl md:text-4xl">
                  {terrain.name}
                </p>
                <p className="mt-2 text-sm font-medium opacity-80">
                  {terrain.rule}
                </p>
              </div>
            </div>

            {phase >= 2 && (
              <>
                <div className="flex items-center gap-3">
                  <div className="h-px flex-1 bg-base-300" />
                  <p className="display text-2xl">
                    {duel.name}
                    <span className="text-primary">.</span>
                  </p>
                  <div className="h-px flex-1 bg-base-300" />
                </div>

                {/* DUELO — la carta doble. En tier 0 los dos leen lo mismo. */}
                <div className="grid gap-3 sm:grid-cols-2">
                  <DuelCard
                    tone={tier === 0 ? "neutro" : "alfa"}
                    role={tier === 0 ? "Los dos igual" : `Ventaja +${tier}`}
                    card={duel.alfa}
                    fly="left"
                  />
                  <DuelCard
                    tone={tier === 0 ? "neutro" : "omega"}
                    role={tier === 0 ? "Los dos igual" : `Carga −${tier}`}
                    card={duel.omega}
                    fly="right"
                    brutal={isBrutal}
                  />
                </div>
              </>
            )}

            {/* La regla de oro */}
            {phase >= 3 && (
              <div className="caos-verdict clip-cut border-2 border-base-300 bg-base-200 p-6">
                <p className="text-[0.6rem] font-black uppercase tracking-[0.3em] text-primary">
                  La regla de oro
                </p>
                <p className="display mt-2 text-2xl md:text-3xl">
                  La desventaja no se compensa cambiando la regla.{" "}
                  <span className="text-primary">Se compensa con el premio.</span>
                </p>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {bounty > 0 ? (
                    <div className="border-l-2 border-accent pl-4">
                      <p className="display text-3xl text-accent">
                        +{bounty} XP
                      </p>
                      <p className="mt-1 text-xs font-semibold uppercase tracking-wider opacity-70">
                        Para el que carga, si se lleva la pelea. Diez XP por
                        cada punto de diferencia: 20 / 40 / 60 según el nivel.
                      </p>
                    </div>
                  ) : (
                    <div className="border-l-2 border-secondary pl-4">
                      <p className="display text-3xl">Sin bono</p>
                      <p className="mt-1 text-xs font-semibold uppercase tracking-wider opacity-70">
                        Duelo parejo: nadie carga con desventaja, así que no hay
                        remontada que pagar. En los otros niveles son 20 / 40 /
                        60 XP.
                      </p>
                    </div>
                  )}
                  <div className="border-l-2 border-primary pl-4">
                    <p className="display text-3xl text-primary">
                      +{CAOS_POINTS.finish} XP
                    </p>
                    <p className="mt-1 text-xs font-semibold uppercase tracking-wider opacity-70">
                      Para quien finalice. El que arranca con ventaja solo cobra
                      si termina la pelea — nada de guindarse a estancarla.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function DuelCard({ tone, role, card, fly, brutal }) {
  const ink =
    tone === "alfa" ? "text-primary" : tone === "omega" ? "text-accent" : "";

  return (
    <div
      className={`caos-card caos-card-${tone} caos-fly-${fly} ${
        brutal && tone === "omega" ? "caos-brutal" : ""
      }`}
    >
      <div
        className={`caos-tier-bar ${ink || "text-secondary"}`}
        aria-hidden="true"
      />
      <div className="p-5">
        <p
          className={`text-[0.6rem] font-black uppercase tracking-[0.25em] ${
            ink || "opacity-60"
          }`}
        >
          {role}
        </p>
        <p className={`caos-title mt-1 text-2xl md:text-3xl ${ink}`}>
          {card.name}
        </p>
        <p className="mt-2 text-sm font-medium opacity-80">{card.rule}</p>
      </div>
    </div>
  );
}
