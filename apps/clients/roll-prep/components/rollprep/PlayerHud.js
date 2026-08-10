import AcademyBadge from "@/components/rollprep/AcademyBadge";
import BeltBadge from "@/components/rollprep/BeltBadge";
import { formatXp, getRank } from "@/libs/gamification";

// HUD del jugador estilo videojuego: nombre, academia, cinturón (rango) y
// barra de XP.
export default function PlayerHud({ fullName, totalPoints, academy }) {
  const { belt, nextBelt, progress, pointsToNext } = getRank(totalPoints);

  return (
    <div className="clip-cut relative overflow-hidden border-2 border-base-300 bg-base-200 p-4">
      <div className="halftone absolute inset-0 opacity-60" aria-hidden="true" />

      <div className="relative flex items-center gap-4">
        {/* Avatar: inicial del alumno como retrato de personaje */}
        <div className="flex h-14 w-14 shrink-0 items-center justify-center border-2 border-primary bg-base-100">
          <span className="display text-3xl text-primary">
            {(fullName || "?").trim().charAt(0).toUpperCase()}
          </span>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className="display truncate text-xl">{fullName || "Peleador anónimo"}</p>
            <p className="display shrink-0 text-xl text-primary">
              {formatXp(totalPoints)}
              <span className="ml-1 text-xs opacity-70">XP</span>
            </p>
          </div>

          <div className="mt-1 flex flex-wrap items-center gap-2">
            <BeltBadge rank={belt} showName />
            <AcademyBadge academy={academy} />
            {nextBelt && (
              <span className="text-[0.6rem] font-bold uppercase tracking-widest opacity-50">
                {formatXp(pointsToNext)} XP para {nextBelt.short}
              </span>
            )}
          </div>

          <div className="xp-bar mt-2">
            <div
              className="xp-bar-fill"
              style={{ width: `${Math.max(4, Math.round(progress * 100))}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
