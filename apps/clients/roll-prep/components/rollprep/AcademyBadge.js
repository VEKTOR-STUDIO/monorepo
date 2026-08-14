import { ACADEMY_FALLBACK_COLOR, NO_ACADEMY_LABEL } from "@/libs/academies";

const SIZES = {
  xs: "px-1.5 py-0.5 text-[0.55rem]",
  sm: "px-2 py-0.5 text-[0.6rem]",
  md: "px-3 py-1 text-xs",
};

const CREST_SIZES = {
  xs: "h-3 w-3",
  sm: "h-3.5 w-3.5",
  md: "h-4 w-4",
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

  const crest = academy.crest?.shape === "circle" ? academy.crest : null;

  return (
    <span
      className={`tag-skew text-white ${SIZES[size]}`}
      style={{ backgroundColor: academy.color || ACADEMY_FALLBACK_COLOR }}
    >
      <span className="inline-flex items-center gap-1.5">
        {crest && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={crest.src}
            alt=""
            className={`${CREST_SIZES[size]} shrink-0 rounded-full object-cover`}
          />
        )}
        {academy.name}
      </span>
    </span>
  );
}
