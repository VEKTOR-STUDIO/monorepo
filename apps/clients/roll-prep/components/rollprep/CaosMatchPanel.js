"use client";

import { readRoll, cardTone } from "@/libs/caos";

// Resumen compacto del roll dentro de la celda del bracket: el terreno y la
// mitad de carta que le tocó a cada peleador. La regla completa se lee en la
// ceremonia (botón "Cartas").
export default function CaosMatchPanel({ roll, student1Id, student2Id, names, onOpen }) {
  const reading = readRoll(roll);
  if (!reading) return null;

  const { tier, terrain, sides, spread, bounty } = reading;

  const fighters = [
    { id: student1Id, side: sides.student1 },
    { id: student2Id, side: sides.student2 },
  ];

  return (
    // pb-4 deja respirar el corte diagonal (clip-cut) de la celda del bracket.
    <div className="border-t-2 border-primary/40 bg-base-100/60 px-3 pb-4 pt-2">
      <div className="flex items-center gap-1.5">
        <span className="tag-skew bg-secondary px-1.5 py-0.5 text-[0.5rem] text-secondary-content">
          <span>{terrain.name}</span>
        </span>
        {tier === 3 && (
          <span className="tag-skew blink-soft bg-accent px-1.5 py-0.5 text-[0.5rem] text-accent-content">
            <span>Brutal</span>
          </span>
        )}
      </div>

      <div className="mt-2 space-y-1">
        {fighters.map(({ id, side }, i) => {
          const tone = cardTone(side.weight);
          return (
            <div key={id ?? i} className="flex items-center gap-1.5">
              <span
                aria-hidden="true"
                className={`h-3 w-1 shrink-0 ${
                  tone === "alfa"
                    ? "bg-primary"
                    : tone === "omega"
                      ? "bg-accent"
                      : "bg-base-300"
                }`}
              />
              <span
                className={`truncate text-[0.65rem] font-bold uppercase tracking-wider ${
                  tone === "alfa"
                    ? "text-primary"
                    : tone === "omega"
                      ? "text-accent"
                      : "opacity-70"
                }`}
                title={`${names[id] ?? "Peleador"}: ${side.card.rule}`}
              >
                {side.card.name}
              </span>
            </div>
          );
        })}
      </div>

      <div className="mt-2 flex items-center gap-2">
        {spread > 0 && (
          <span className="text-[0.55rem] font-black uppercase tracking-widest text-accent">
            Remontar +{bounty} XP
          </span>
        )}
        <button
          type="button"
          className="btn btn-ghost btn-xs ml-auto uppercase opacity-70 hover:opacity-100"
          onClick={onOpen}
        >
          Cartas
        </button>
      </div>
    </div>
  );
}
