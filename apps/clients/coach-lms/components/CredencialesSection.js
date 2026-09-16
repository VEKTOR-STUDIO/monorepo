const credenciales = [
  {
    number: "01",
    title: "Certificación & trayectoria",
    desc: "Placeholder: títulos del staff, federaciones o años de experiencia en alto rendimiento.",
  },
  {
    number: "02",
    title: "Metodología probada",
    desc: "Bloques de fuerza, potencia y movilidad integrados en microciclos adaptables al calendario deportivo.",
  },
  {
    number: "03",
    title: "Seguimiento",
    desc: "Demo: integración con panel de atleta, citas y contenido VOD — conecta tus herramientas reales.",
  },
];

const CredencialesSection = () => {
  return (
    <section
      className="border-t border-base-300 bg-base-100 px-6 py-20 sm:px-8 md:py-28"
      aria-labelledby="credenciales-heading"
    >
      <div className="mx-auto max-w-6xl">
        <h2
          id="credenciales-heading"
          className="display mb-12 text-4xl text-base-content sm:text-5xl md:text-6xl"
        >
          Por qué entrenar
          <br />
          <span className="text-primary">con nosotros.</span>
        </h2>

        <div className="grid grid-cols-1 gap-px overflow-hidden border border-base-300 bg-base-300 md:grid-cols-3">
          {credenciales.map((item) => (
            <div
              key={item.title}
              className="group relative bg-base-100 p-8 transition-colors duration-300 hover:bg-base-200 md:p-10"
            >
              <span className="display text-stroke text-6xl transition-colors group-hover:text-primary group-hover:[-webkit-text-stroke:0px]">
                {item.number}
              </span>
              <h3 className="display mt-6 text-2xl text-base-content">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-base-content/60">
                {item.desc}
              </p>
              <span className="absolute bottom-0 left-0 h-1 w-0 bg-primary transition-all duration-300 group-hover:w-full" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CredencialesSection;
