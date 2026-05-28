// Renamed in spirit to "AboutLegion" — keep filename so existing imports keep working.

const pillars = [
  {
    title: "Cambiar el MMA",
    body:
      "Repensar cómo se hacen las cosas en las artes marciales mixtas venezolanas. Eventos planificados, organización profesional, transparencia con los peleadores.",
  },
  {
    title: "Proteger al Peleador",
    body:
      "Equipos médicos en cada evento, contratos claros, descanso adecuado entre peleas. El bienestar del atleta no es opcional.",
  },
  {
    title: "Mercado Internacional",
    body:
      "Darle al peleador venezolano la experiencia y la vitrina necesaria para pelear afuera. Legión es la antesala hacia ligas mundiales.",
  },
];

const AboutLegion = () => (
  <section id="sobre" className="relative bg-base-100 py-20 lg:py-28">
    <div className="max-w-7xl mx-auto px-6 lg:px-10">
      <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1.4fr] gap-12 lg:gap-20 items-center">
        {/* Left: founder block */}
        <div className="relative">
          <div className="relative w-full aspect-[3/4] max-w-md mx-auto lg:mx-0 overflow-hidden border-2 border-primary">
            <div
              className="absolute inset-0 bg-cover bg-center grayscale"
              style={{
                backgroundImage:
                  'url("https://images.unsplash.com/photo-1517438476312-10d79c077509?auto=format&fit=crop&w=700&q=80")',
              }}
              aria-hidden
            />
            <div className="absolute inset-0 bg-gradient-to-t from-base-100 via-base-100/30 to-transparent" />
            <div className="absolute inset-0 bg-primary/10 mix-blend-color" />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <p className="text-[0.6rem] tracking-[0.4em] uppercase font-bold text-primary mb-1">
                Fundador
              </p>
              <p className="font-display text-3xl text-base-content leading-none">
                Omar Morales
              </p>
              <p className="text-xs tracking-[0.2em] uppercase text-base-content/60 mt-1">
                Peleador UFC · Caracas, Venezuela
              </p>
            </div>
          </div>
        </div>

        {/* Right: pillars */}
        <div>
          <div className="inline-flex items-center gap-3 mb-4">
            <span className="w-10 h-px bg-primary" />
            <p className="text-primary font-bold text-xs uppercase tracking-[0.4em]">
              Sobre Legión
            </p>
          </div>
          <h2 className="font-display leading-none mb-6" style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)" }}>
            La <span className="text-primary">misión</span> es clara.
          </h2>
          <p className="text-base-content/70 text-lg leading-relaxed mb-10 max-w-xl">
            Legión MMA nació para cambiar las reglas del juego en Venezuela: una liga que respeta al peleador,
            profesionaliza el deporte y abre la puerta al circuito internacional. No es solo otra noche de peleas —
            es una plataforma.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-base-content/10 border border-base-content/10">
            {pillars.map((p) => (
              <div key={p.title} className="bg-base-100 p-6">
                <div className="w-8 h-1 bg-primary mb-4" />
                <h3 className="font-display text-xl text-base-content mb-2 leading-tight">
                  {p.title}
                </h3>
                <p className="text-sm text-base-content/65 leading-relaxed">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default AboutLegion;
