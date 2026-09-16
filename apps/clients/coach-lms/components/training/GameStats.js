import { levelProgress } from "@/libs/training-constants";

// Tarjetas de progreso: nivel + barra de XP, racha, sesiones y minutos.
// Es la primera cosa que ve el alumno al entrar: tiene que entenderse sin leer.
const Tile = ({ label, value, hint }) => (
  <div className="border border-base-300 bg-base-200/60 p-4">
    <p className="text-[11px] uppercase tracking-[0.14em] text-base-content/45">{label}</p>
    <p className="display mt-1 text-3xl text-base-content">{value}</p>
    {hint && <p className="mt-0.5 text-xs text-base-content/50">{hint}</p>}
  </div>
);

const GameStats = ({ stats }) => {
  const progress = levelProgress(stats.xp, stats.level);

  return (
    <div className="space-y-4">
      <div className="border border-base-300 bg-base-200/60 p-5">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-[11px] uppercase tracking-[0.14em] text-base-content/45">
              Tu nivel
            </p>
            <p className="display text-5xl text-primary">Nivel {stats.level}</p>
          </div>
          <p className="text-sm text-base-content/60">
            {stats.xp.toLocaleString("es")} XP
            {progress.missing > 0 && (
              <>
                {" · "}
                <span className="text-base-content/45">
                  te faltan {progress.missing.toLocaleString("es")} para el nivel{" "}
                  {stats.level + 1}
                </span>
              </>
            )}
          </p>
        </div>
        <div
          className="mt-3 h-3 w-full overflow-hidden bg-base-300"
          role="progressbar"
          aria-valuenow={progress.percent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Progreso al nivel ${stats.level + 1}`}
        >
          <div
            className="h-full bg-primary transition-[width] duration-700"
            style={{ width: `${progress.percent}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <Tile
          label="Racha"
          value={stats.current_streak}
          hint={
            stats.current_streak > 0
              ? `${stats.current_streak === 1 ? "día" : "días"} seguidos`
              : "Entrena hoy y empieza"
          }
        />
        <Tile label="Sesiones" value={stats.total_workouts} hint="registradas en total" />
        <Tile
          label="Minutos"
          value={stats.total_minutes.toLocaleString("es")}
          hint={`≈ ${Math.round(stats.total_minutes / 60)} horas`}
        />
      </div>
    </div>
  );
};

export default GameStats;
