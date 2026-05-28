import FighterCard from "./FighterCard";
import { mainEvent, undercard } from "@/data/fights";

const UndercardRow = ({ fight }) => (
  <div className="border border-base-content/10 bg-base-200">
    <div className="bg-base-300 px-4 py-2 flex items-center justify-between border-b border-base-content/10">
      <span className="text-[0.6rem] tracking-[0.3em] uppercase font-bold text-primary">
        {fight.weightClass}
      </span>
      <span className="text-[0.6rem] tracking-[0.3em] uppercase text-base-content/50">
        3 × 5 min
      </span>
    </div>
    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 p-4">
      <FighterCard {...fight.red} side="red" size="md" />
      <div className="flex flex-col items-center justify-center self-stretch">
        <span className="font-display text-4xl text-primary leading-none">VS</span>
      </div>
      <FighterCard {...fight.blue} side="blue" size="md" />
    </div>
  </div>
);

const FightCard = () => (
  <section id="cartelera" className="relative py-20 lg:py-28 bg-base-100">
    <div className="max-w-7xl mx-auto px-6 lg:px-10">
      {/* Header */}
      <div className="mb-14 text-center">
        <div className="inline-flex items-center gap-3 mb-4">
          <span className="w-10 h-px bg-primary" />
          <p className="text-primary font-bold text-xs uppercase tracking-[0.4em]">
            Cartelera Oficial
          </p>
          <span className="w-10 h-px bg-primary" />
        </div>
        <h2 className="font-display leading-none" style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)" }}>
          La <span className="text-primary">Pelea</span>
        </h2>
      </div>

      {/* Main event */}
      <div className="relative mb-16">
        {/* Title fight banner */}
        {mainEvent.titleFight && (
          <div className="text-center mb-6">
            <span className="inline-block bg-primary text-primary-content px-6 py-2 font-display text-sm tracking-[0.4em]">
              Pelea por el Título
            </span>
          </div>
        )}
        <p className="text-center text-[0.7rem] tracking-[0.4em] uppercase font-bold text-base-content/50 mb-8">
          Estelar · {mainEvent.weightClass} · 5 × 5 min
        </p>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center gap-6 md:gap-10">
          <FighterCard {...mainEvent.red} side="red" size="lg" />
          <div className="flex flex-col items-center justify-center py-6 md:py-0">
            <span className="font-display text-7xl md:text-9xl text-primary leading-none">
              VS
            </span>
            <span className="text-[0.6rem] tracking-[0.4em] uppercase text-base-content/40 mt-2 font-bold">
              Main Event
            </span>
          </div>
          <FighterCard {...mainEvent.blue} side="blue" size="lg" />
        </div>
      </div>

      {/* Undercard */}
      <div>
        <h3 className="font-display text-2xl text-base-content/70 mb-6 text-center tracking-[0.3em]">
          Cartelera Preliminar
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {undercard.map((fight, i) => (
            <UndercardRow key={i} fight={fight} />
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default FightCard;
