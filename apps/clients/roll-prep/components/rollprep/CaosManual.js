"use client";

import { useState } from "react";
import {
  OUTFITS,
  DEFAULT_OUTFIT,
  deckFor,
  TIER_LABELS,
  TIER_ODDS_LABELS,
  CAOS_POINTS,
} from "@/libs/caos";
import CaosOath from "./CaosOath";

// Manual del modo CAOS: el códice completo del juego. Cambia entre el mazo
// de no-gi y el de gi, porque no comparten todas las cartas.
export default function CaosManual() {
  const [outfit, setOutfit] = useState(DEFAULT_OUTFIT);
  const deck = deckFor(outfit);

  return (
    <div className="space-y-8">
      {/* ---------------- El papel ---------------- */}
      <section className="rise rise-2 space-y-3">
        <SectionTitle index="00" title="El papel" />
        <p className="text-sm font-medium opacity-70">
          Lo que el árbitro lee en voz alta antes de cada pelea. En el roleo
          llega plegado: se abre, se lee, se pelea.
        </p>
        <CaosOath defaultOpen />
      </section>

      {/* ---------------- Cómo se juega ---------------- */}
      <section className="rise rise-2 space-y-3">
        <SectionTitle index="01" title="Cómo se juega" />

        <div className="grid gap-2 md:grid-cols-3">
          <Step
            n="1"
            title="Se rolea"
            text="Antes de cada pelea, el profesor tira el dado. Una sola vez por pelea: lo que salga, se pelea."
          />
          <Step
            n="2"
            title="Sale el terreno"
            text="Una regla de arena que aplica igual a los dos. Cambia el tiempo, el área o qué cosa vale punto."
          />
          <Step
            n="3"
            title="Se parte el duelo"
            text="Una carta doble. Un lado se lleva la ventaja, el otro la carga. Siempre son las dos caras de la misma situación."
          />
        </div>

        <div className="clip-cut border-2 border-base-300 bg-base-200 p-4">
          <p className="text-[0.6rem] font-black uppercase tracking-[0.3em] text-primary">
            La regla de oro
          </p>
          <p className="mt-1.5 text-sm font-medium opacity-85">
            La desventaja <b>no se compensa cambiando la regla</b>: se compensa
            con el premio. El que carga cobra XP extra si se lleva la pelea. El
            que arranca con ventaja solo cobra extra si <b>finaliza</b> — así
            nadie se guinda de la ventaja a estancar la pelea. Los dos entran
            con algo que buscar.
          </p>
        </div>
      </section>

      {/* ---------------- XP ---------------- */}
      <section className="rise rise-2 space-y-3">
        <SectionTitle index="02" title="Qué paga XP" />

        <div className="overflow-x-auto border border-base-300">
          <table className="table table-sm">
            <thead>
              <tr className="text-[0.6rem] uppercase tracking-widest">
                <th>Lo que hiciste</th>
                <th className="text-right">XP</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              <tr>
                <td>
                  <b>Remontar</b> desde una carta{" "}
                  <span className="text-accent">Leve</span>
                </td>
                <td className="text-right font-black text-accent">+20</td>
              </tr>
              <tr>
                <td>
                  <b>Remontar</b> desde una carta{" "}
                  <span className="text-accent">Seria</span>
                </td>
                <td className="text-right font-black text-accent">+40</td>
              </tr>
              <tr>
                <td>
                  <b>Remontar</b> desde una carta{" "}
                  <span className="text-accent">Brutal</span>
                </td>
                <td className="text-right font-black text-accent">+60</td>
              </tr>
              <tr>
                <td>
                  <b>Finalizar por sumisión</b> — de cualquier lado, con
                  ventaja o con carga
                </td>
                <td className="text-right font-black text-primary">
                  +{CAOS_POINTS.finish}
                </td>
              </tr>
              <tr className="opacity-60">
                <td>
                  Pelear el tope · 3er puesto · ser finalista · ser campeón
                </td>
                <td className="text-right font-black">+15 / +25 / +50 / +100</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="text-xs font-semibold opacity-60">
          En los duelos <b>neutros</b> los dos cargan lo mismo, así que no hay
          bono de remontada. El de sumisión sigue en pie.
        </p>
      </section>

      {/* ---------------- Selector de ruleset ---------------- */}
      <section className="rise rise-3 space-y-3">
        <SectionTitle index="03" title="El mazo" />

        <div className="flex gap-2">
          {Object.entries(OUTFITS).map(([key, meta]) => {
            const active = outfit === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setOutfit(key)}
                aria-pressed={active}
                className={`clip-cut flex-1 border-2 p-3 text-left transition-colors ${
                  active
                    ? "border-primary bg-primary/10"
                    : "border-base-300 bg-base-200 hover:border-base-content/30"
                }`}
              >
                <p
                  className={`display text-2xl ${
                    active ? "text-primary" : "opacity-70"
                  }`}
                >
                  {meta.label}
                </p>
                <p className="mt-0.5 text-[0.65rem] font-semibold leading-snug opacity-60">
                  {meta.tagline}
                </p>
              </button>
            );
          })}
        </div>

        <p className="text-xs font-semibold opacity-60">
          {deck.terrains.length} terrenos y {deck.duels.length} duelos en el
          mazo de <b>{OUTFITS[outfit].label}</b>. Las cartas marcadas{" "}
          <ExclusiveTag outfit={outfit} /> solo existen en este ruleset; el
          resto se juegan igual con o sin kimono.
        </p>
      </section>

      {/* ---------------- Terrenos ---------------- */}
      <section className="rise rise-3 space-y-3">
        <SectionTitle index="04" title="Terrenos" />
        <p className="text-sm font-medium opacity-70">
          Aplican a los dos peleadores por igual. Nunca cambian la posición de
          arranque — de eso se encarga el duelo.
        </p>

        <div className="grid gap-2 md:grid-cols-2">
          {deck.terrains.map((terrain) => (
            <div
              key={terrain.key}
              className="caos-card caos-card-neutro h-full"
            >
              <div className="caos-tier-bar text-secondary" />
              <div className="stripes p-3">
                <div className="flex items-start justify-between gap-2">
                  <p className="caos-title text-xl">{terrain.name}</p>
                  {terrain.outfit !== "both" && (
                    <ExclusiveTag outfit={terrain.outfit} />
                  )}
                </div>
                <p className="mt-1.5 text-xs font-medium opacity-80">
                  {terrain.rule}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------- Duelos por nivel ---------------- */}
      <section className="rise rise-3 space-y-5">
        <SectionTitle index="05" title="Duelos" />
        <p className="text-sm font-medium opacity-70">
          Cada duelo es una carta partida en dos. Mientras más duro el nivel,
          más grande la ventaja — y más paga la remontada.
        </p>

        {deck.duelsByTier.map(({ tier, duels }) => (
          <div key={tier} className="space-y-2">
            <div className="flex flex-wrap items-center gap-2 border-b-2 border-base-300 pb-2">
              <span
                className={`tag-skew px-2 py-0.5 text-[0.6rem] ${
                  tier === 3
                    ? "bg-accent text-accent-content"
                    : tier === 0
                      ? "bg-base-300 text-base-content"
                      : "bg-primary text-primary-content"
                }`}
              >
                <span>
                  Nivel {tier} · {TIER_LABELS[tier]}
                </span>
              </span>
              <span className="text-[0.6rem] font-bold uppercase tracking-widest opacity-50">
                Sale {TIER_ODDS_LABELS[tier]} de las veces
              </span>
              <span className="ml-auto text-[0.6rem] font-black uppercase tracking-widest text-accent">
                {tier === 0
                  ? "Sin bono de remontada"
                  : `Remontar paga +${tier * 2 * CAOS_POINTS.upsetPerWeight} XP`}
              </span>
            </div>

            <div className="space-y-2">
              {duels.map((duel) => (
                <DuelRow key={duel.key} duel={duel} neutral={tier === 0} />
              ))}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

function DuelRow({ duel, neutral }) {
  return (
    <div className="border border-base-300 bg-base-200">
      <div className="flex flex-wrap items-center gap-2 border-b border-base-300 px-3 py-2">
        <p className="display text-lg">{duel.name}</p>
        {duel.outfit !== "both" && <ExclusiveTag outfit={duel.outfit} />}
        <p className="ml-auto text-[0.6rem] font-semibold uppercase tracking-widest opacity-50">
          {duel.start}
        </p>
      </div>

      {neutral ? (
        <div className="p-3">
          <p className="text-[0.55rem] font-black uppercase tracking-[0.2em] opacity-50">
            Los dos peleadores
          </p>
          <p className="mt-1 text-xs font-medium opacity-85">{duel.alfa.rule}</p>
        </div>
      ) : (
        <div className="grid gap-px bg-base-300 md:grid-cols-2">
          <HalfCard half={duel.alfa} tone="alfa" tier={duel.tier} />
          <HalfCard half={duel.omega} tone="omega" tier={duel.tier} />
        </div>
      )}
    </div>
  );
}

function HalfCard({ half, tone, tier }) {
  const isAlfa = tone === "alfa";
  return (
    <div className="bg-base-200 p-3">
      <div className="flex items-center gap-2">
        <span
          aria-hidden="true"
          className={`h-3 w-1 shrink-0 ${isAlfa ? "bg-primary" : "bg-accent"}`}
        />
        <p
          className={`text-[0.55rem] font-black uppercase tracking-[0.2em] ${
            isAlfa ? "text-primary" : "text-accent"
          }`}
        >
          {isAlfa ? `Ventaja +${tier}` : `Carga −${tier}`}
        </p>
      </div>
      <p
        className={`caos-title mt-1 text-lg ${
          isAlfa ? "text-primary" : "text-accent"
        }`}
      >
        {half.name}
      </p>
      <p className="mt-1 text-xs font-medium opacity-80">{half.rule}</p>
    </div>
  );
}

function ExclusiveTag({ outfit }) {
  return (
    <span className="tag-skew shrink-0 bg-secondary px-1.5 py-0.5 text-[0.5rem] text-secondary-content">
      <span>Solo {OUTFITS[outfit]?.short ?? outfit}</span>
    </span>
  );
}

function SectionTitle({ index, title }) {
  return (
    <div className="flex items-baseline gap-3">
      <span className="display text-stroke select-none text-3xl leading-none">
        {index}
      </span>
      <h2 className="display text-3xl">
        {title}
        <span className="text-primary">.</span>
      </h2>
    </div>
  );
}

function Step({ n, title, text }) {
  return (
    <div className="clip-cut relative h-full border-2 border-base-300 bg-base-200 p-3">
      <span
        aria-hidden="true"
        className="display text-stroke pointer-events-none absolute -bottom-2 right-1 select-none text-6xl leading-none"
      >
        {n}
      </span>
      <p className="display relative text-xl text-primary">{title}</p>
      <p className="relative mt-1 text-xs font-medium opacity-75">{text}</p>
    </div>
  );
}
