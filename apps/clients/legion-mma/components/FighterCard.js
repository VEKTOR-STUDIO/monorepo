import Image from "next/image";

const FLAGS = {
  VE: "🇻🇪",
  CO: "🇨🇴",
  AR: "🇦🇷",
  BR: "🇧🇷",
  MX: "🇲🇽",
  US: "🇺🇸",
};

/**
 * FighterCard — championship fighter portrait card.
 * Props: name, nickname, record, weightClass, country (ISO-2),
 *        countryName, hometown, photo,
 *        side ("red" | "blue" — kept for data compatibility; visually rendered
 *        as gold (red) and silver (blue) corners), size ("lg" | "md").
 */
const FighterCard = ({
  name,
  nickname,
  record,
  weightClass,
  country = "VE",
  countryName = "Venezuela",
  hometown,
  photo,
  side = "red",
  size = "md",
}) => {
  const isGold = side === "red";
  const isLg = size === "lg";
  const accentBorder = isGold ? "border-primary" : "border-base-content/60";
  const accentText = isGold ? "text-primary" : "text-base-content";
  const cornerLabel = isGold ? "Oro" : "Plata";

  return (
    <div className={`group relative ${isLg ? "w-full" : "w-full"}`}>
      {/* Photo */}
      <div
        className={`relative w-full overflow-hidden border-l-4 ${accentBorder} bg-base-200`}
        style={{ aspectRatio: isLg ? "3/4" : "4/5" }}
      >
        {photo ? (
          <Image
            src={photo}
            alt={name}
            fill
            className="object-cover object-top grayscale group-hover:grayscale-0 transition-all duration-500"
            sizes={isLg ? "(max-width: 768px) 100vw, 40vw" : "(max-width: 768px) 50vw, 25vw"}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-base-content/30 font-display text-6xl">
            {name?.[0] ?? "?"}
          </div>
        )}

        {/* Side overlay tint — gold corner gets warm wash, silver stays neutral */}
        <div
          className={`absolute inset-0 mix-blend-color ${
            isGold ? "bg-primary/35" : "bg-base-content/10"
          } group-hover:opacity-0 transition-opacity duration-500`}
        />

        {/* Vignette to body */}
        <div className="absolute inset-0 bg-gradient-to-t from-base-100 via-base-100/30 to-transparent" />

        {/* Corner side badge */}
        <div
          className={`absolute top-3 ${
            isGold ? "left-3" : "right-3"
          } font-display text-xs tracking-[0.3em] uppercase ${accentText}`}
        >
          {cornerLabel}
        </div>

        {/* Flag bottom-right */}
        <div className="absolute bottom-3 right-3 text-2xl select-none" title={countryName}>
          {FLAGS[country] ?? "🏳️"}
        </div>
      </div>

      {/* Info block */}
      <div className={`bg-base-200 border-l-4 ${accentBorder} border-r border-b border-base-content/10 p-4`}>
        {nickname && (
          <p className={`text-[0.65rem] tracking-[0.3em] uppercase font-bold ${accentText} mb-1`}>
            “{nickname}”
          </p>
        )}
        <h3 className={`font-display ${isLg ? "text-3xl" : "text-xl"} leading-none text-base-content`}>
          {name}
        </h3>

        <div className="flex items-center gap-3 mt-3 text-[0.65rem] tracking-[0.2em] uppercase text-base-content/60 font-bold">
          <span className="tabular-nums text-base-content">{record}</span>
          {weightClass && (
            <>
              <span className="w-1 h-1 bg-base-content/40 rounded-full" />
              <span>{weightClass}</span>
            </>
          )}
        </div>
        {hometown && (
          <p className="text-[0.6rem] tracking-[0.2em] uppercase text-base-content/40 mt-1">
            {hometown}
          </p>
        )}
      </div>
    </div>
  );
};

export default FighterCard;
