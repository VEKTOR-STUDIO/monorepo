// Medallas. Las bloqueadas se muestran apagadas a propósito: ver lo que falta
// motiva más que esconderlo.
const THRESHOLD_HINT = {
  workouts: (n) => `${n} ${n === 1 ? "sesión" : "sesiones"}`,
  streak: (n) => `${n} días seguidos`,
  minutes: (n) => `${n.toLocaleString("es")} minutos`,
  level: (n) => `nivel ${n}`,
};

const AchievementGrid = ({ achievements }) => (
  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
    {achievements.map((achievement) => {
      const unlocked = Boolean(achievement.unlocked_at);
      return (
        <div
          key={achievement.id}
          className={`border p-4 text-center transition-colors ${
            unlocked
              ? "border-primary/40 bg-primary/5"
              : "border-base-300 bg-base-200/40 opacity-55"
          }`}
        >
          <span
            className={`text-3xl ${unlocked ? "" : "grayscale"}`}
            aria-hidden="true"
          >
            {achievement.icon || "🏅"}
          </span>
          <p className="mt-2 text-sm font-bold uppercase tracking-wide text-base-content">
            {achievement.name}
          </p>
          <p className="mt-1 text-xs text-base-content/55">{achievement.description}</p>
          <p className="mt-2 text-[11px] uppercase tracking-widest text-base-content/40">
            {unlocked
              ? `Conseguida · +${achievement.xp_reward} XP`
              : THRESHOLD_HINT[achievement.threshold_type]?.(achievement.threshold_value)}
          </p>
        </div>
      );
    })}
  </div>
);

export default AchievementGrid;
