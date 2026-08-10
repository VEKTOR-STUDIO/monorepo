import { getRank } from "@/libs/gamification";

const SIZES = {
  xs: "px-1.5 py-0.5 text-[0.55rem]",
  sm: "px-2 py-0.5 text-[0.6rem]",
  md: "px-3 py-1 text-xs",
};

/**
 * Chapa del rango: cinturón + grados.
 *
 * En corto ("Blanca II") para listas apretadas como el ranking, y con el
 * nombre largo más las cintas del grado para el HUD.
 * Recibe el rango ya calculado o el XP total y lo resuelve.
 */
export default function BeltBadge({
  rank,
  totalPoints,
  size = "sm",
  showName = false,
}) {
  const belt = rank ?? getRank(totalPoints).belt;

  return (
    <span
      className={`tag-skew ${SIZES[size]}`}
      style={{ backgroundColor: belt.color, color: belt.ink }}
    >
      <span>
        {showName ? belt.name : belt.short}
        {showName && belt.degree > 0 && (
          <span
            className="ml-1.5 inline-block align-middle"
            aria-label={`${belt.degree} grado${belt.degree === 1 ? "" : "s"}`}
          >
            {Array.from({ length: belt.degree }).map((_, i) => (
              <span
                key={i}
                className="ml-0.5 inline-block h-2.5 w-0.5 align-middle"
                style={{ backgroundColor: belt.ink }}
              />
            ))}
          </span>
        )}
      </span>
    </span>
  );
}
