const DisciplinesSection = ({ disciplines = [] }) => {
  if (!disciplines?.length) {
    disciplines = [
      {
        name: "Fuerza & potencia",
        description:
          "Variantes de cargas, velocidad de ejecución y progresiones para ganar explosividad sin descuidar la técnica.",
      },
      {
        name: "Condición & capacidad aeróbica",
        description:
          "Trabajo metabólico y series estructuradas para mejorar resistencia según tu disciplina.",
      },
      {
        name: "Movilidad / prevención",
        description:
          "Patrones de movimiento, activación y enfriamiento para sostener semanas de carga altas.",
      },
    ];
  }

  return (
    <section
      id="features"
      className="relative overflow-hidden border-t border-base-300 bg-base-200 px-6 py-20 sm:px-8 md:py-28"
      aria-labelledby="features-heading"
    >
      <span
        aria-hidden="true"
        className="display text-stroke pointer-events-none absolute -right-2 bottom-2 select-none text-[6rem] leading-none opacity-50 md:text-[12rem]"
      >
        TRAIN
      </span>

      <div className="relative mx-auto max-w-6xl">
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-primary">
          Programa
        </p>
        <h2
          id="features-heading"
          className="display mb-4 text-4xl text-base-content sm:text-5xl md:text-6xl"
        >
          Líneas de entrenamiento
        </h2>
        <p className="mb-12 max-w-2xl text-sm leading-relaxed text-base-content/60">
          Si conectas Supabase, estas tarjetas se alimentan desde tu tabla de
          disciplinas; si no, se muestran estos ejemplos.
        </p>

        <div className="grid grid-cols-1 gap-px overflow-hidden border border-base-300 bg-base-300 md:grid-cols-3">
          {disciplines.map((d, i) => (
            <article
              key={d.id || d.name}
              className="group relative bg-base-100 p-8 transition-colors duration-300 hover:bg-base-200 md:p-10"
            >
              <span className="display text-stroke text-6xl transition-colors group-hover:text-primary group-hover:[-webkit-text-stroke:0px]">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="display mt-6 text-2xl text-base-content">
                {d.name}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-base-content/60">
                {d.description || ""}
              </p>
              <span className="absolute bottom-0 left-0 h-1 w-0 bg-primary transition-all duration-300 group-hover:w-full" />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DisciplinesSection;
