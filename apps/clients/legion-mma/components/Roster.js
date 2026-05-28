import FighterCard from "./FighterCard";
import { roster } from "@/data/fights";

const Roster = () => (
  <section id="peleadores" className="relative bg-base-200 py-20 lg:py-28">
    <div className="max-w-7xl mx-auto px-6 lg:px-10">
      <div className="mb-12 text-center">
        <div className="inline-flex items-center gap-3 mb-4">
          <span className="w-10 h-px bg-primary" />
          <p className="text-primary font-bold text-xs uppercase tracking-[0.4em]">
            Roster
          </p>
          <span className="w-10 h-px bg-primary" />
        </div>
        <h2 className="font-display leading-none" style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)" }}>
          Los <span className="text-primary">guerreros</span>
        </h2>
        <p className="text-base-content/60 mt-4 text-sm tracking-[0.2em] uppercase max-w-xl mx-auto">
          Peleadores que defienden la bandera y construyen su camino al circuito mundial.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {roster.slice(0, 8).map((f, i) => (
          <FighterCard
            key={`${f.name}-${i}`}
            {...f}
            side={i % 2 === 0 ? "red" : "blue"}
            size="md"
          />
        ))}
      </div>
    </div>
  </section>
);

export default Roster;
