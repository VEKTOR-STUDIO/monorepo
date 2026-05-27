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
      className="py-16 md:py-24 px-6 sm:px-8 bg-base-100 border-t border-base-300"
      aria-labelledby="horarios-heading"
    >
      <div className="max-w-2xl mx-auto">
        <h2 id="horarios-heading" className="text-2xl sm:text-3xl font-bold text-base-content mb-10 text-center">
          Horarios de piso / grupos
        </h2>
        <div className="border border-base-300 rounded-md overflow-hidden shadow-sm">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-base-300 bg-base-200">
                <th className="p-4 text-xs uppercase tracking-wide font-semibold text-base-content/80">Día</th>
                <th className="p-4 text-xs uppercase tracking-wide font-semibold text-base-content/80">Ventana</th>
              </tr>
            </thead>
            <tbody>
              {horarios.map((row) => (
                <tr key={row.dia} className="border-b border-base-200 last:border-b-0">
                  <td className="p-4 font-medium text-base-content">{row.dia}</td>
                  <td className="p-4 text-base-content/80">{row.hora}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-sm text-base-content/50 text-center">
          Datos de ejemplo. Ajusta horarios reales o enlaza a tu agenda en producción.
        </p>
      </div>
    </section>
  );
};

export default HorariosSection;
