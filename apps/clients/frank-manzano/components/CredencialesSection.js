const credenciales = [
  {
    title: "Certificación & trayectoria",
    desc: "Placeholder: títulos del staff, federaciones o años de experiencia en alto rendimiento.",
  },
  {
    title: "Metodología probada",
    desc: "Bloques de fuerza, potencia y movilidad integrados en microciclos adaptables al calendario deportivo.",
  },
  {
    title: "Seguimiento",
    desc: "Demo: integración con panel de atleta, citas y contenido VOD — conecta tus herramientas reales.",
  },
];

const CredencialesSection = () => {
  return (
    <section
      className="py-16 md:py-24 px-6 sm:px-8 bg-base-100 border-t border-base-300"
      aria-labelledby="credenciales-heading"
    >
      <div className="max-w-5xl mx-auto">
        <h2 id="credenciales-heading" className="text-2xl sm:text-3xl font-bold text-base-content mb-10 text-center">
          Por qué entrenar con nosotros
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {credenciales.map((item) => (
            <div key={item.title} className="border border-base-300 bg-base-100 p-6 md:p-8 rounded-md shadow-sm">
              <h3 className="text-lg font-semibold text-primary mb-2">{item.title}</h3>
              <p className="text-sm text-base-content/70">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CredencialesSection;
