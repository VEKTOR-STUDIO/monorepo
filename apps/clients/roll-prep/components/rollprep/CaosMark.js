// Marca del modo CAOS: el corazón que escribe CAOS de forma abstracta.
//
// primary (volt) sobre fondos oscuros — es la versión de casa.
// ink (negro) sobre fondos invertidos: el marquee volt, chips filled, la
// ceremonia cuando el tag va sobre primary. El usuario todavía no tiene un
// sitio fijo para el negro; estas son las superficies que ya se voltean.
const SRC = {
  primary: "/images/caosPrimary.png",
  ink: "/images/caosBlack.png",
};

export default function CaosMark({
  variant = "primary",
  watermark = false,
  className = "",
}) {
  const src = SRC[variant] ?? SRC.primary;

  return (
    // Decorative: el texto "CAOS" siempre está al lado. next/image no aporta
    // aquí — los watermarks se dimensionan a ojo con Tailwind, no a un size fijo.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      aria-hidden="true"
      draggable="false"
      className={`select-none object-contain ${watermark ? "caos-watermark" : ""} ${className}`.trim()}
    />
  );
}
