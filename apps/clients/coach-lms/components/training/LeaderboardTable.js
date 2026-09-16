import Image from "next/image";
import Link from "next/link";

// Ranking. El propio alumno aparece resaltado para que se encuentre de un vistazo.
const MEDALS = ["🥇", "🥈", "🥉"];

const LeaderboardTable = ({ rows, period = "total", myRank = null }) => (
  <div className="space-y-4">
    <div role="tablist" className="flex gap-1 border border-base-300 p-1">
      {[
        { key: "total", label: "Histórico" },
        { key: "mes", label: "Este mes" },
      ].map((tab) => (
        <Link
          key={tab.key}
          href={`/dashboard/ranking?periodo=${tab.key}`}
          role="tab"
          aria-selected={period === tab.key}
          className={`flex-1 px-4 py-2 text-center text-xs font-bold uppercase tracking-[0.12em] transition-colors ${
            period === tab.key
              ? "bg-primary text-primary-content"
              : "text-base-content/50 hover:text-base-content"
          }`}
        >
          {tab.label}
        </Link>
      ))}
    </div>

    {myRank && (
      <p className="border border-primary/40 bg-primary/5 px-4 py-3 text-sm">
        Vas en el puesto{" "}
        <span className="display text-2xl text-primary">#{myRank.rank}</span> de{" "}
        {myRank.total_players} con {myRank.xp.toLocaleString("es")} XP.
      </p>
    )}

    {rows.length === 0 ? (
      <p className="border border-dashed border-base-300 p-10 text-center text-base-content/60">
        Todavía no hay nadie en el ranking
        {period === "mes" ? " este mes" : ""}. Registra una sesión y estrénalo.
      </p>
    ) : (
      <ol className="divide-y divide-base-300 border border-base-300">
        {rows.map((row) => (
          <li
            key={row.athlete_id}
            className={`flex items-center gap-3 p-3 sm:gap-4 sm:p-4 ${
              row.is_me ? "bg-primary/10" : ""
            }`}
          >
            <span className="display w-10 shrink-0 text-center text-2xl text-base-content/60">
              {MEDALS[row.rank - 1] || `#${row.rank}`}
            </span>

            <span className="h-10 w-10 shrink-0 overflow-hidden border border-base-300">
              <Image
                src={
                  row.avatar_url ||
                  `https://api.dicebear.com/8.x/initials/svg?seed=${encodeURIComponent(
                    row.display_name
                  )}`
                }
                alt=""
                width={40}
                height={40}
                className="h-full w-full object-cover"
                unoptimized
              />
            </span>

            <span className="min-w-0 flex-1">
              <span className="block truncate font-bold text-base-content">
                {row.display_name}
                {row.is_me && (
                  <span className="ml-2 text-xs uppercase tracking-widest text-primary">
                    tú
                  </span>
                )}
              </span>
              <span className="block text-xs text-base-content/50">
                Nivel {row.level} · {row.total_workouts} sesiones
                {row.current_streak > 1 ? ` · 🔥 ${row.current_streak} días` : ""}
              </span>
            </span>

            <span className="display shrink-0 text-2xl text-primary">
              {row.xp.toLocaleString("es")}
              <span className="ml-1 text-xs text-base-content/40">XP</span>
            </span>
          </li>
        ))}
      </ol>
    )}
  </div>
);

export default LeaderboardTable;
