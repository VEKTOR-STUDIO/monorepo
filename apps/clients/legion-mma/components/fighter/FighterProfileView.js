import FighterCard from "@/components/FighterCard";
import { STATUS_LABELS, BJJ_BELTS, STANCES } from "@/data/fighterOptions";

const calcAge = (birthDate) => {
  if (!birthDate) return null;
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
};

const labelOf = (options, value) =>
  options.find((o) => o.value === value)?.label || null;

const Stat = ({ label, value }) => (
  <div className="border border-base-content/10 bg-base-200 p-4">
    <p className="text-[0.6rem] tracking-[0.25em] uppercase text-base-content/40 font-bold">
      {label}
    </p>
    <p className="font-display text-xl md:text-2xl text-base-content mt-1">
      {value ?? "—"}
    </p>
  </div>
);

/**
 * FighterProfileView — ficha de peleador estilo UFC (récord, divisiones, stats).
 */
export default function FighterProfileView({ fighter }) {
  const status = STATUS_LABELS[fighter.status] || STATUS_LABELS.pendiente;
  const age = calcAge(fighter.birth_date);
  const totalWins = fighter.wins || 0;
  const finishes = (fighter.wins_ko || 0) + (fighter.wins_sub || 0);
  const finishRate = totalWins > 0 ? Math.round((finishes / totalWins) * 100) : null;

  const disciplineLabel =
    { mma: "MMA", bjj: "BJJ / Grappling", ambas: "MMA + BJJ" }[fighter.discipline] ||
    fighter.discipline;

  return (
    <div className="grid md:grid-cols-[minmax(0,320px)_1fr] gap-6 md:gap-8 items-start">
      {/* Retrato */}
      <FighterCard
        name={fighter.full_name}
        nickname={fighter.nickname}
        record={`${fighter.wins}-${fighter.losses}-${fighter.draws}`}
        weightClass={fighter.weight_class}
        country={fighter.nationality}
        hometown={[fighter.city, fighter.state].filter(Boolean).join(", ")}
        photo={fighter.photo_url}
        side="red"
        size="lg"
      />

      <div className="space-y-6">
        {/* Estado dentro de la liga */}
        <div className="flex items-center justify-between border border-primary/30 bg-base-200 p-4">
          <p className="text-[0.65rem] tracking-[0.25em] uppercase text-base-content/50 font-bold">
            Estado en la liga
          </p>
          <span className={`badge ${status.badge} badge-sm md:badge-md tracking-wider uppercase text-[0.6rem] font-bold`}>
            {status.label}
          </span>
        </div>

        {/* Récord grande estilo UFC */}
        <div className="border border-primary/30 bg-base-200 p-6 text-center">
          <p className="text-[0.65rem] tracking-[0.3em] uppercase text-primary font-bold mb-2">
            Récord {fighter.experience_level === "profesional" ? "profesional" : "amateur"}
          </p>
          <p className="font-display text-5xl md:text-6xl text-base-content tabular-nums">
            {fighter.wins}
            <span className="text-primary mx-2">-</span>
            {fighter.losses}
            <span className="text-primary mx-2">-</span>
            {fighter.draws}
          </p>
          <div className="flex justify-center gap-6 mt-4 text-[0.65rem] tracking-[0.2em] uppercase text-base-content/50 font-bold">
            <span>{fighter.wins_ko || 0} KO/TKO</span>
            <span>{fighter.wins_sub || 0} SUM</span>
            <span>{fighter.wins_dec || 0} DEC</span>
            {finishRate !== null && (
              <span className="text-primary">{finishRate}% finalización</span>
            )}
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <Stat label="Disciplina" value={disciplineLabel} />
          <Stat label="División" value={fighter.weight_class} />
          <Stat label="Edad" value={age ? `${age} años` : null} />
          <Stat
            label="Peso"
            value={fighter.weight_kg ? `${Number(fighter.weight_kg)} kg` : null}
          />
          <Stat
            label="Estatura"
            value={fighter.height_cm ? `${Number(fighter.height_cm)} cm` : null}
          />
          <Stat
            label="Alcance"
            value={fighter.reach_cm ? `${Number(fighter.reach_cm)} cm` : null}
          />
          <Stat label="Guardia" value={labelOf(STANCES, fighter.stance)} />
          {fighter.bjj_belt && (
            <Stat label="Cinturón BJJ" value={labelOf(BJJ_BELTS, fighter.bjj_belt)} />
          )}
          <Stat label="Equipo" value={fighter.team} />
        </div>

        {/* Detalles secundarios */}
        <div className="border border-base-content/10 bg-base-200 p-4 space-y-1 text-sm text-base-content/60">
          {fighter.coach_name && (
            <p>
              <span className="text-base-content/40 uppercase text-[0.6rem] tracking-[0.2em] font-bold mr-2">Coach</span>
              {fighter.coach_name}
            </p>
          )}
          {fighter.years_training != null && (
            <p>
              <span className="text-base-content/40 uppercase text-[0.6rem] tracking-[0.2em] font-bold mr-2">Experiencia</span>
              {fighter.years_training} años entrenando
            </p>
          )}
          {fighter.instagram && (
            <p>
              <span className="text-base-content/40 uppercase text-[0.6rem] tracking-[0.2em] font-bold mr-2">Instagram</span>
              @{fighter.instagram}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
