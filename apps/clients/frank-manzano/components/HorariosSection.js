const HorariosSection = () => {
  const horarios = [
    { dia: "Lunes", hora: "06:30 – 09:00 · 17:00 – 21:00" },
    { dia: "Martes", hora: "06:30 – 09:00 · 17:00 – 21:00" },
    { dia: "Miércoles", hora: "06:30 – 09:00 · 17:00 – 21:00" },
    { dia: "Jueves", hora: "06:30 – 09:00 · 17:00 – 21:00" },
    { dia: "Viernes", hora: "06:30 – 09:00 · 17:00 – 20:00" },
    { dia: "Sábado", hora: "08:00 – 13:00" },
  ];

  return (
    <section
      id="horarios"
      className="border-t border-base-300 bg-base-100 px-6 py-20 sm:px-8 md:py-28"
      aria-labelledby="horarios-heading"
    >
      <div className="mx-auto max-w-3xl">
        <p className="mb-3 text-center text-xs font-bold uppercase tracking-[0.2em] text-primary">
          Agenda
        </p>
        <h2
          id="horarios-heading"
          className="display mb-12 text-center text-4xl text-base-content sm:text-5xl md:text-6xl"
        >
          Horarios de piso
        </h2>

        <div className="divide-y divide-base-300 border-y border-base-300">
          {horarios.map((row) => (
            <div
              key={row.dia}
              className="flex items-center justify-between gap-4 py-5"
            >
              <span className="display text-2xl text-base-content md:text-3xl">
                {row.dia}
              </span>
              <span className="text-right text-sm font-medium text-base-content/60 md:text-base">
                {row.hora}
              </span>
            </div>
          ))}
        </div>

        <p className="mt-6 text-center text-xs uppercase tracking-widest text-base-content/40">
          Datos de ejemplo · Ajusta horarios reales en producción
        </p>
      </div>
    </section>
  );
};

export default HorariosSection;
