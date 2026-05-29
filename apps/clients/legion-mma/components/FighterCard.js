import Image from "next/image";

const FLAGS = {
  VE: "🇻🇪",
  CO: "🇨🇴",
  AR: "🇦🇷",
  BR: "🇧🇷",
  MX: "🇲🇽",
  US: "🇺🇸",
};

const initials = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

const surname = (name = "") => {
  const parts = name.split(" ").filter(Boolean);
  return parts.length > 1 ? parts.slice(1).join(" ") : parts[0] ?? "";
};

/**
 * FighterCard — championship fighter portrait card.
 * Props: name, nickname, record, weightClass, country (ISO-2),
 *        countryName, hometown, photo,
 *        side ("red" | "blue" — gold (red) / silver (blue) corners),
 *        size ("lg" | "md").
 * Todo lo que no sea `name` es opcional: la tarjeta se ve completa solo con el
 * nombre usando una placa tipográfica cuando no hay foto.
 */
const FighterCard = ({
  name,
  nickname,
  record,
  weightClass,
  country,
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
    <div className="group relative w-full">
      {/* Portrait / typographic plate */}
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
          <div className="absolute inset-0">
            {/* Diagonal raw texture */}
            <div
              className="absolute inset-0 opacity-[0.07]"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(135deg, var(--color-primary) 0 2px, transparent 2px 16px)",
              }}
              aria-hidden
            />
            {/* Oversized ghost initials */}
            <div
              className={`absolute inset-0 flex items-center justify-center font-display leading-none select-none ${
                isGold ? "text-primary/25" : "text-base-content/15"
              }`}
              style={{ fontSize: isLg ? "12rem" : "7rem" }}
              aria-hidden
            >
              {initials(name)}
            </div>
            {/* Surname plate, italic / skewed for edge */}
            <div className="absolute inset-0 flex items-end p-4">
              <span
                className="font-display text-base-content leading-[0.82] italic"
                style={{ fontSize: isLg ? "clamp(2rem,5vw,3.5rem)" : "1.6rem", transform: "skewX(-6deg)" }}
              >
                {surname(name)}
              </span>
            </div>
          </div>
        )}

        {photo && (
          <>
            <div
              className={`absolute inset-0 mix-blend-color ${
                isGold ? "bg-primary/35" : "bg-base-content/10"
              } group-hover:opacity-0 transition-opacity duration-500`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-base-100 via-base-100/30 to-transparent" />
          </>
        )}

        {/* Corner side badge */}
        <div
          className={`absolute top-3 ${
            isGold ? "left-3" : "right-3"
          } font-display text-xs tracking-[0.3em] uppercase ${accentText}`}
        >
          {cornerLabel}
        </div>

        {/* Flag bottom-right (solo si hay país) */}
        {country && (
          <div className="absolute bottom-3 right-3 text-2xl select-none" title={countryName}>
            {FLAGS[country] ?? "🏳️"}
          </div>
        )}
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

        {(record || weightClass) && (
          <div className="flex items-center gap-3 mt-3 text-[0.65rem] tracking-[0.2em] uppercase text-base-content/60 font-bold">
            {record && <span className="tabular-nums text-base-content">{record}</span>}
            {record && weightClass && <span className="w-1 h-1 bg-base-content/40 rounded-full" />}
            {weightClass && <span>{weightClass}</span>}
          </div>
        )}
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
