// Los siete bloques de una sesión del sistema. Si la tabla `disciplines` de
// Supabase tiene filas, se muestran esas; si no, estos valores por defecto.
const BLOQUES = [
  {
    name: "Warm up",
    description:
      "Assault bike o cuerda, serie dinámica de cadera, columna torácica y hombros, activación de glúteo y escápula.",
  },
  {
    name: "Plyometrics",
    description:
      "Depth jumps, saltos laterales y reactivos: el primer paso explosivo y los cambios de ángulo.",
  },
  {
    name: "Contrast set",
    description:
      "Fuerza pesada seguida de un gesto explosivo: box squat con medball slam, peso muerto con lanzamientos y golpeo.",
  },
  {
    name: "Push + Pull",
    description:
      "Push press y dominadas balísticas en clusters: potencia de empuje y tracción sin acumular fatiga.",
  },
  {
    name: "Midsection",
    description:
      "Rotaciones con landmine y banda terminadas en golpe: transferencia directa a la potencia de puño.",
  },
  {
    name: "Conditioning",
    description:
      "Sprints en assault bike y rounds híbridos que simulan intercambios, flurries y derribos.",
  },
  {
    name: "Breathing",
    description:
      "Respiración diafragmática 4·6·4·6 para bajar pulsaciones y recuperar entre rounds.",
  },
];

const DisciplinesSection = ({ disciplines = [] }) => {
  const items = disciplines?.length ? disciplines : BLOQUES;

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
          La sesión
        </p>
        <h2
          id="features-heading"
          className="display mb-4 text-4xl text-base-content sm:text-5xl md:text-6xl"
        >
          Estructura de cada sesión
        </h2>
        <p className="mb-12 max-w-2xl text-sm leading-relaxed text-base-content/60">
          Siete bloques, siempre en el mismo orden. Cambian las cargas, las
          series y el objetivo de la semana; la estructura no.
        </p>

        <div className="grid grid-cols-1 gap-px overflow-hidden border border-base-300 bg-base-300 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((d, i) => (
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
