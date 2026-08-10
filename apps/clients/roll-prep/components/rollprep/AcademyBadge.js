import { ACADEMY_FALLBACK_COLOR, NO_ACADEMY_LABEL } from "@/libs/academies";

const SIZES = {
  xs: "px-1.5 py-0.5 text-[0.55rem]",
  sm: "px-2 py-0.5 text-[0.6rem]",
  md: "px-3 py-1 text-xs",
};

/**
 * Chapa de la academia del alumno (Slam MMA, Élite Jiu-Jitsu, ...).
 * Sin academia no pinta nada, salvo que se pida `showEmpty`.
 */
export default function AcademyBadge({ academy, size = "sm", showEmpty = false }) {
  if (!academy) {
    if (!showEmpty) return null;

    return (
      <span
        className={`tag-skew border border-base-content/25 text-base-content/50 ${SIZES[size]}`}
      >
        <span>{NO_ACADEMY_LABEL}</span>
      </span>
    );
  }

  return (
    <span
      className={`tag-skew text-white ${SIZES[size]}`}
      style={{ backgroundColor: academy.color || ACADEMY_FALLBACK_COLOR }}
    >
      <span>{academy.name}</span>
    </span>
  );
}
