const DisciplinesSection = ({ disciplines = [] }) => {
  if (!disciplines?.length) {
    disciplines = [
      {
        name: "Fuerza & potencia",
        description: "Variantes de cargas, velocidad de ejecución y progresiones para ganar explosividad sin descuidar la técnica.",
      },
      {
        name: "Condición & capacidad aeróbica",
        description: "Trabajo metabólico y series estructuradas para mejorar resistencia según tu disciplina.",
      },
      {
        name: "Movilidad / prevención",
        description: "Patrones de movimiento, activación y enfriamiento para sostener semanas de carga altas.",
      },
    ];
  }

  return (
    <section
      id="features"
      className="py-16 md:py-24 px-6 sm:px-8 bg-base-200/50 border-t border-base-300"
      aria-labelledby="features-heading"
    >
      <div className="max-w-5xl mx-auto">
        <h2 id="features-heading" className="text-2xl sm:text-3xl font-bold text-base-content mb-10 text-center">
          Líneas de entrenamiento
        </h2>
        <p className="text-center text-base-content/70 max-w-2xl mx-auto mb-10 text-sm">
          Si conectas Supabase, estas tarjetas pueden alimentarse desde tu tabla de disciplinas; si no, se muestran
          estos ejemplos.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {disciplines.map((d) => (
            <article key={d.id || d.name} className="border border-base-300 bg-base-100 p-6 md:p-8 rounded-md shadow-sm">
              <h3 className="text-lg font-semibold text-primary mb-2">{d.name}</h3>
              <p className="text-sm text-base-content/70">{d.description || ""}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DisciplinesSection;
