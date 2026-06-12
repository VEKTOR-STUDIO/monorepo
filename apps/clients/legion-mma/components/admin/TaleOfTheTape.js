import { STANCES } from "@/data/fighterOptions";

const calcAge = (birthDate) => {
  if (!birthDate) return null;
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
};

const finishRate = (f) => {
  const wins = f.wins || 0;
  if (wins === 0) return null;
  return Math.round((((f.wins_ko || 0) + (f.wins_sub || 0)) / wins) * 100);
};

const stanceLabel = (v) => STANCES.find((s) => s.value === v)?.label || null;

const fmt = (v, suffix = "") => (v == null || v === "" ? "—" : `${v}${suffix}`);

/**
 * TaleOfTheTape — comparación estilo UFC entre dos peleadores para
 * simular un enfrentamiento. La ventaja numérica se resalta en dorado.
 */
export default function TaleOfTheTape({ red, blue }) {
  if (!red || !blue) return null;

  const rows = [
    {
      label: "Récord",
      red: `${red.wins}-${red.losses}-${red.draws}`,
      blue: `${blue.wins}-${blue.losses}-${blue.draws}`,
      redWins: (red.wins || 0) > (blue.wins || 0),
      blueWins: (blue.wins || 0) > (red.wins || 0),
    },
    {
      label: "% Finalización",
      red: fmt(finishRate(red), "%"),
      blue: fmt(finishRate(blue), "%"),
      redWins: (finishRate(red) || 0) > (finishRate(blue) || 0),
      blueWins: (finishRate(blue) || 0) > (finishRate(red) || 0),
    },
    {
      label: "KO / Sum / Dec",
      red: `${red.wins_ko || 0} / ${red.wins_sub || 0} / ${red.wins_dec || 0}`,
      blue: `${blue.wins_ko || 0} / ${blue.wins_sub || 0} / ${blue.wins_dec || 0}`,
    },
    {
      label: "Edad",
      red: fmt(calcAge(red.birth_date)),
      blue: fmt(calcAge(blue.birth_date)),
    },
    {
      label: "Peso",
      red: fmt(red.weight_kg && Number(red.weight_kg), " kg"),
      blue: fmt(blue.weight_kg && Number(blue.weight_kg), " kg"),
    },
    {
      label: "Estatura",
      red: fmt(red.height_cm && Number(red.height_cm), " cm"),
      blue: fmt(blue.height_cm && Number(blue.height_cm), " cm"),
      redWins: (red.height_cm || 0) > (blue.height_cm || 0),
      blueWins: (blue.height_cm || 0) > (red.height_cm || 0),
    },
    {
      label: "Alcance",
      red: fmt(red.reach_cm && Number(red.reach_cm), " cm"),
      blue: fmt(blue.reach_cm && Number(blue.reach_cm), " cm"),
      redWins: (red.reach_cm || 0) > (blue.reach_cm || 0),
      blueWins: (blue.reach_cm || 0) > (red.reach_cm || 0),
    },
    {
      label: "Guardia",
      red: fmt(stanceLabel(red.stance)),
      blue: fmt(stanceLabel(blue.stance)),
    },
    {
      label: "Años entrenando",
      red: fmt(red.years_training),
      blue: fmt(blue.years_training),
      redWins: (red.years_training || 0) > (blue.years_training || 0),
      blueWins: (blue.years_training || 0) > (red.years_training || 0),
    },
    {
      label: "Equipo",
      red: fmt(red.team),
      blue: fmt(blue.team),
    },
    {
      label: "Nivel",
      red: fmt(red.experience_level),
      blue: fmt(blue.experience_level),
    },
  ];

  return (
    <div className="border border-primary/30 bg-base-100/60">
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 p-4 border-b border-primary/20">
        <div className="text-left min-w-0">
          <p className="text-[0.6rem] tracking-[0.3em] uppercase text-primary font-bold">
            Esquina roja
          </p>
          <p className="font-display text-lg md:text-2xl truncate">{red.full_name}</p>
          {red.nickname && (
            <p className="text-[0.65rem] text-primary/80 uppercase tracking-[0.2em]">
              &ldquo;{red.nickname}&rdquo;
            </p>
          )}
        </div>
        <span className="font-display text-2xl md:text-4xl text-primary px-2">VS</span>
        <div className="text-right min-w-0">
          <p className="text-[0.6rem] tracking-[0.3em] uppercase text-base-content/60 font-bold">
            Esquina azul
          </p>
          <p className="font-display text-lg md:text-2xl truncate">{blue.full_name}</p>
          {blue.nickname && (
            <p className="text-[0.65rem] text-base-content/60 uppercase tracking-[0.2em]">
              &ldquo;{blue.nickname}&rdquo;
            </p>
          )}
        </div>
      </div>

      <div className="divide-y divide-base-content/5">
        {rows.map((row) => (
          <div
            key={row.label}
            className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 px-4 py-2 text-sm"
          >
            <span
              className={`text-left tabular-nums capitalize ${
                row.redWins ? "text-primary font-bold" : "text-base-content/80"
              }`}
            >
              {row.red}
            </span>
            <span className="text-[0.6rem] tracking-[0.25em] uppercase text-base-content/40 font-bold text-center px-3">
              {row.label}
            </span>
            <span
              className={`text-right tabular-nums capitalize ${
                row.blueWins ? "text-primary font-bold" : "text-base-content/80"
              }`}
            >
              {row.blue}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
