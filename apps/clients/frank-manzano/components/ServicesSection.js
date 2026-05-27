"use client";

const services = [
  {
    title: "Fisioterapia",
    description:
      "Evaluación y tratamiento para recuperación de lesiones, dolor musculoesquelético y preparación física. Enfocado en deportistas y en tu bienestar.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
  },
  {
    title: "Terapia a domicilio",
    description:
      "Sesiones en tu casa o en tu academia. Comodidad y seguimiento personalizado para que te recuperes donde entrenas.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    title: "Consultorio en Total Elite Training",
    description:
      "Atención en las instalaciones de Total Elite Training. Ambiente de alto rendimiento para deportistas y atletas.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
  },
];

export default function ServicesSection() {
  return (
    <section
      id="servicios"
      className="relative py-24 lg:py-32 scroll-mt-20"
      aria-labelledby="servicios-heading"
    >
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-8">
        <h2
          id="servicios-heading"
          className="text-2xl md:text-4xl font-bold tracking-tight text-base-content mb-2"
        >
          Servicios
        </h2>
        <p className="text-base-content/60 text-sm md:text-base mb-14 max-w-xl">
          Fisioterapia y rehabilitación con enfoque en deporte y excelencia.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
          {services.map((s) => (
            <div
              key={s.title}
              className="group relative rounded-2xl p-6 md:p-8 border border-base-content/10 bg-base-200/50 hover:border-primary/30 hover:bg-base-200/80 transition-all duration-300"
            >
              <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-primary/15 text-primary mb-5 group-hover:bg-primary/25 transition-colors duration-300">
                {s.icon}
              </div>
              <h3 className="text-lg md:text-xl font-bold text-base-content mb-3">
                {s.title}
              </h3>
              <p className="text-base-content/70 text-sm md:text-base leading-relaxed">
                {s.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
