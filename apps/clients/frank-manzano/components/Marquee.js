"use client";

const ITEMS = [
  "Fuerza",
  "BJJ",
  "Rehabilitación deportiva",
  "Rendimiento",
  "Movilidad",
  "Brazilian Jiu Jitsu",
  "Recuperación",
  "Preparación física",
];

export default function Marquee() {
  return (
    <div
      className="overflow-hidden border-y border-base-300 bg-primary py-3 text-primary-content"
      aria-hidden="true"
    >
      <div className="marquee-track">
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0">
            {ITEMS.concat(ITEMS).map((item, i) => (
              <span
                key={`${copy}-${i}`}
                className="display mx-6 whitespace-nowrap text-xl tracking-wide"
              >
                {item} <span className="mx-2 opacity-40">/</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
