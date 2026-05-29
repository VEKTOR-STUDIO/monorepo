import FighterCard from "./FighterCard";
import { mainEvent, undercard, grappling } from "@/data/fights";

/**
 * BoutRow — fila tipo "tale of the tape" para carteleras largas.
 * Escala sin fotos: número de combate gigante + nombres enfrentados + tag.
 */
const BoutRow = ({ index, fight, prefix = "" }) => (
  <div className="group relative border-b border-base-content/10 last:border-b-0">
    {/* slash de acento al hacer hover */}
    <div className="absolute inset-y-0 left-0 w-1 bg-primary scale-y-0 group-hover:scale-y-100 origin-top transition-transform duration-300" />
    <div className="grid grid-cols-[2.75rem_1fr_auto_1fr] sm:grid-cols-[4rem_1fr_auto_1fr] items-center gap-2 sm:gap-4 py-4 sm:py-5 pl-3 sm:pl-5 pr-3 sm:pr-5 transition-colors duration-300 group-hover:bg-base-300/40">
      {/* índice de combate */}
      <span className="font-display text-3xl sm:text-5xl leading-none text-base-content/25 tabular-nums group-hover:text-primary/70 transition-colors">
        {prefix}
        {String(index).padStart(2, "0")}
      </span>

      {/* esquina oro */}
      <div className="text-right">
        <span className="font-display text-lg sm:text-2xl leading-none text-base-content block">
          {fight.red.name}
        </span>
        <span className="text-[0.55rem] tracking-[0.3em] uppercase text-primary font-bold">
          Oro
        </span>
      </div>

      {/* VS */}
      <div className="flex flex-col items-center px-1 sm:px-2">
        <span className="font-display text-xl sm:text-3xl text-primary leading-none italic" style={{ transform: "skewX(-8deg)" }}>
          VS
        </span>
      </div>

      {/* esquina plata */}
      <div className="text-left">
        <span className="font-display text-lg sm:text-2xl leading-none text-base-content block">
          {fight.blue.name}
        </span>
        <span className="text-[0.55rem] tracking-[0.3em] uppercase text-base-content/50 font-bold">
          Plata
        </span>
      </div>
    </div>

    {/* tag de disciplina/división, esquina superior derecha de la fila */}
    {fight.weightClass && (
      <span className="absolute top-2 right-3 sm:right-5 text-[0.5rem] sm:text-[0.55rem] tracking-[0.3em] uppercase text-base-content/40 font-bold">
        {fight.weightClass}
      </span>
    )}
  </div>
);

const CardBlock = ({ kicker, title, accent, bouts, prefix }) => (
  <div className="border border-base-content/10 bg-base-200">
    <div className="flex items-center justify-between bg-base-300 border-b border-base-content/10 px-4 sm:px-5 py-3">
      <div className="flex items-center gap-3">
        <span className="w-6 h-px bg-primary" />
        <span className="text-[0.6rem] tracking-[0.35em] uppercase font-bold text-primary">
          {kicker}
        </span>
      </div>
      <span className="font-display text-base sm:text-xl text-base-content/70 tracking-[0.2em]">
        {title}
      </span>
    </div>
    {accent}
    <div>
      {bouts.map((fight, i) => (
        <BoutRow key={`${prefix}-${i}`} index={i + 1} fight={fight} prefix={prefix} />
      ))}
    </div>
  </div>
);

const FightCard = () => (
  <section id="cartelera" className="relative py-20 lg:py-28 bg-base-100 overflow-hidden">
    {/* textura diagonal de fondo */}
    <div
      className="absolute inset-0 opacity-[0.04] pointer-events-none"
      style={{
        backgroundImage:
          "repeating-linear-gradient(135deg, var(--color-primary) 0 1px, transparent 1px 22px)",
      }}
      aria-hidden
    />

    <div className="relative max-w-7xl mx-auto px-6 lg:px-10">
      {/* Header */}
      <div className="mb-12 text-center">
        <div className="inline-flex items-center gap-3 mb-4">
          <span className="w-10 h-px bg-primary" />
          <p className="text-primary font-bold text-xs uppercase tracking-[0.4em]">
            Cartelera Oficial · Legión 10
          </p>
          <span className="w-10 h-px bg-primary" />
        </div>
        <h2 className="font-display leading-none" style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)" }}>
          La <span className="text-primary">guerra</span>
        </h2>
        <p className="text-base-content/50 mt-4 text-xs tracking-[0.3em] uppercase font-bold">
          12 combates · MMA + Submission Grappling
        </p>
      </div>

      {/* Main event */}
      <div className="relative mb-16">
        <div className="text-center mb-6">
          <span className="inline-block bg-primary text-primary-content px-6 py-2 font-display text-sm tracking-[0.4em] italic" style={{ transform: "skewX(-8deg)" }}>
            Main Event
          </span>
        </div>
        <p className="text-center text-[0.7rem] tracking-[0.4em] uppercase font-bold text-base-content/50 mb-8">
          Estelar · {mainEvent.weightClass} · 5 × 5 min
        </p>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center gap-6 md:gap-10">
          <FighterCard {...mainEvent.red} side="red" size="lg" />
          <div className="flex flex-col items-center justify-center py-6 md:py-0">
            <span className="font-display text-7xl md:text-9xl text-primary leading-none italic" style={{ transform: "skewX(-8deg)" }}>
              VS
            </span>
            <span className="text-[0.6rem] tracking-[0.4em] uppercase text-base-content/40 mt-2 font-bold">
              Estelar
            </span>
          </div>
          <FighterCard {...mainEvent.blue} side="blue" size="lg" />
        </div>
      </div>

      {/* Run of show: MMA + Grappling */}
      <div className="grid grid-cols-1 gap-8">
        <CardBlock
          kicker="Cartelera"
          title="MMA"
          prefix=""
          bouts={undercard}
        />
        <CardBlock
          kicker="Misma noche · Jiu-Jitsu"
          title="Submission Grappling"
          prefix="SG·"
          bouts={grappling}
          accent={
            <div
              className="h-1 w-full bg-primary/60"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(45deg, var(--color-primary) 0 8px, transparent 8px 16px)",
              }}
              aria-hidden
            />
          }
        />
      </div>
    </div>
  </section>
);

export default FightCard;
