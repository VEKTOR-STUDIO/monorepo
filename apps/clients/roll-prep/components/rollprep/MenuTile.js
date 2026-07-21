import Link from "next/link";

// Tile del menú principal estilo pantalla de selección de modo de un
// videojuego de pelea: número gigante, splash art al hover y chip de estado.
export default function MenuTile({
  href,
  index,
  kicker,
  title,
  description,
  splashUrl,
  chip,
  chipTone = "primary",
  hero = false,
}) {
  const chipClasses = {
    primary: "bg-primary text-primary-content blink-soft",
    accent: "bg-accent text-accent-content blink-soft",
    done: "bg-base-300 text-base-content",
  };

  return (
    <Link
      href={href}
      className={`menu-tile clip-cut group ${hero ? "min-h-52 md:min-h-64" : "min-h-36"}`}
    >
      {splashUrl && (
        <span
          className="tile-splash"
          style={{ backgroundImage: `url(${splashUrl})` }}
          aria-hidden="true"
        />
      )}

      {/* Número de modo, gigante y contorneado como en las pantallas VS */}
      <span
        aria-hidden="true"
        className={`display text-stroke pointer-events-none absolute -bottom-4 right-1 select-none ${
          hero ? "text-9xl" : "text-7xl"
        }`}
      >
        {String(index).padStart(2, "0")}
      </span>

      <span className="relative z-10 flex h-full flex-col justify-between gap-3 p-5">
        <span className="flex items-start justify-between gap-2">
          <span className="tag-skew bg-secondary px-2 py-0.5 text-[0.6rem] text-secondary-content">
            <span>{kicker}</span>
          </span>
          {chip && (
            <span className={`tag-skew px-2 py-0.5 text-[0.6rem] ${chipClasses[chipTone]}`}>
              <span>{chip}</span>
            </span>
          )}
        </span>

        <span>
          <span
            className={`display block group-hover:text-primary ${
              hero ? "text-4xl md:text-5xl" : "text-2xl"
            }`}
          >
            {title}
          </span>
          {description && (
            <span className="mt-1 block max-w-[85%] text-xs font-semibold uppercase tracking-widest opacity-60">
              {description}
            </span>
          )}
          <span className="tile-cta mt-3 text-[0.65rem] font-black uppercase tracking-[0.2em] text-primary">
            Entrar
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              className="h-3 w-3"
            >
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </span>
        </span>
      </span>
    </Link>
  );
}
