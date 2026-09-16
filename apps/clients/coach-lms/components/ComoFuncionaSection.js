// Cómo funciona el entrenamiento online, paso a paso. Sustituye a los horarios
// de piso: aquí no hay gimnasio físico, el plan llega y se registra en la app.
const PASOS = [
  {
    numero: "01",
    titulo: "Tu ficha de atleta",
    texto:
      "Récord, peso actual y categoría, altura, estilo de pelea y fecha del combate. De ahí sale el objetivo del bloque.",
  },
  {
    numero: "02",
    titulo: "Plan por bloques",
    texto:
      "Recibes tu bloque de 4 semanas: 3 sesiones por semana de 55 a 65 minutos, cada ejercicio con series, cargas y descansos.",
  },
  {
    numero: "03",
    titulo: "Registras cada sesión",
    texto:
      "Marcas las series desde el móvil, anotas cargas y cómo te sentiste. El coach lo ve el mismo día.",
  },
  {
    numero: "04",
    titulo: "Ajustes semanales",
    texto:
      "Semana a semana suben cargas, series e intensidad de los sprints. Al cerrar el bloque, llega el siguiente.",
  },
];

const ComoFuncionaSection = () => {
  return (
    <section
      id="como-funciona"
      className="border-t border-base-300 bg-base-100 px-6 py-20 sm:px-8 md:py-28"
      aria-labelledby="como-funciona-heading"
    >
      <div className="mx-auto max-w-3xl">
        <p className="mb-3 text-center text-xs font-bold uppercase tracking-[0.2em] text-primary">
          Online
        </p>
        <h2
          id="como-funciona-heading"
          className="display mb-12 text-center text-4xl text-base-content sm:text-5xl md:text-6xl"
        >
          Cómo funciona
        </h2>

        <ol className="divide-y divide-base-300 border-y border-base-300">
          {PASOS.map((paso) => (
            <li key={paso.numero} className="flex items-start gap-5 py-6 sm:gap-8">
              <span className="display text-stroke shrink-0 text-4xl leading-none sm:text-5xl">
                {paso.numero}
              </span>
              <div>
                <h3 className="display text-2xl text-base-content md:text-3xl">
                  {paso.titulo}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-base-content/60 md:text-base">
                  {paso.texto}
                </p>
              </div>
            </li>
          ))}
        </ol>

        <p className="mt-6 text-center text-xs uppercase tracking-widest text-base-content/40">
          Sin desplazamientos · Desde cualquier gimnasio
        </p>
      </div>
    </section>
  );
};

export default ComoFuncionaSection;
