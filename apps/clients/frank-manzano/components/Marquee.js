"use client";

const ITEMS = [
  "Fisioterapia",
  "BJJ",
  "Rehabilitación deportiva",
  "Total Elite Training",
  "Caracas",
  "Terapia a domicilio",
  "Consultorio",
  "Brazilian Jiu Jitsu",
  "Recuperación",
  "Rendimiento",
];

export default function Marquee() {
  return (
    <section className="relative overflow-hidden border-y border-primary/20 bg-base-200/80 py-3 md:py-4" aria-hidden="true">
      <div className="marquee-inner flex w-max gap-8 md:gap-12 whitespace-nowrap">
        {[...ITEMS, ...ITEMS].map((label, i) => (
          <span
            key={`${label}-${i}`}
            className="text-sm md:text-base font-medium uppercase tracking-wider text-primary/90"
          >
            {label}
          </span>
        ))}
      </div>
    </section>
  );
}
