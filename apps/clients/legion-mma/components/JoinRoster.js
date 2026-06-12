import Link from "next/link";
import config from "@/config";

const BENEFITS = [
  {
    title: "Perfil estilo UFC",
    description:
      "Tu ficha oficial con récord, división, alcance, guardia y foto de peleador.",
  },
  {
    title: "Récord oficial",
    description:
      "Tus victorias, derrotas y finalizaciones registradas en la base de datos de la liga.",
  },
  {
    title: "Visibilidad en carteleras",
    description:
      "El matchmaking de Legión arma los eventos directamente desde el roster registrado.",
  },
];

/**
 * JoinRoster — call to action de la landing para que los peleadores se
 * registren en la base de datos oficial de Legión.
 */
const JoinRoster = () => (
  <section id="registro" className="relative overflow-hidden bg-base-100 py-20 lg:py-28">
    {/* Textura diagonal dorada */}
    <div
      className="absolute inset-0 opacity-[0.05] pointer-events-none"
      style={{
        backgroundImage:
          "repeating-linear-gradient(135deg, var(--color-primary) 0 2px, transparent 2px 18px)",
      }}
      aria-hidden
    />
    {/* Franja dorada lateral */}
    <div className="absolute top-0 left-0 w-2 h-full bg-primary" aria-hidden />

    <div className="relative max-w-7xl mx-auto px-6 lg:px-10">
      <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        {/* Copy + CTA */}
        <div className="text-center lg:text-left">
          <div className="inline-flex items-center gap-3 mb-4">
            <span className="w-10 h-px bg-primary" />
            <p className="text-primary font-bold text-xs uppercase tracking-[0.4em]">
              ¿Peleas MMA o BJJ?
            </p>
            <span className="w-10 h-px bg-primary" />
          </div>

          <h2
            className="font-display leading-[0.9] mb-6"
            style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)" }}
          >
            Tu lugar está en <span className="legion-gold-sheen">el roster</span>
          </h2>

          <p className="text-base-content/70 text-lg leading-relaxed max-w-xl mx-auto lg:mx-0 mb-8">
            Legión está construyendo la base de datos oficial de peleadores de
            Venezuela. Regístrate, completa tu ficha y entra al radar del
            matchmaking de la liga más grande de MMA del país.
          </p>

          <Link
            href={config.auth?.loginUrl ?? "/signin"}
            className="inline-flex items-center gap-3 bg-primary text-primary-content px-12 py-4 font-display text-lg tracking-[0.3em] uppercase hover:bg-accent transition-colors duration-200"
          >
            Regístrate como Peleador
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="square" d="M5 12h14M13 5l7 7-7 7" />
            </svg>
          </Link>

          <p className="text-[0.65rem] tracking-[0.2em] uppercase text-base-content/40 font-bold mt-4">
            Gratis · Con tu cuenta de Google · Aprobación del equipo de Legión
          </p>
        </div>

        {/* Beneficios */}
        <div className="space-y-4">
          {BENEFITS.map((benefit, i) => (
            <div
              key={benefit.title}
              className="flex items-start gap-5 border border-base-content/10 border-l-4 border-l-primary bg-base-200 p-6"
            >
              <span className="font-display text-3xl text-primary/40 leading-none select-none">
                0{i + 1}
              </span>
              <div>
                <h3 className="font-display text-xl text-base-content mb-1">
                  {benefit.title}
                </h3>
                <p className="text-sm text-base-content/60 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default JoinRoster;
