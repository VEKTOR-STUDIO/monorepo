// -----------------------------------------------------------------------------
// Las banderas redondas de su emblema: Venezuela, Panamá y Colombia, al lado
// de "ENVÍOS A TODA LATINOAMÉRICA". Van dibujadas aquí, en pequeño y
// simplificadas —a 28 px el escudo de una bandera es una mancha—, para no
// depender de emojis, que cada sistema pinta a su manera y Windows ni pinta.
// -----------------------------------------------------------------------------

function Estrellita({ x, y, r, fill }) {
  const puntos = Array.from({ length: 10 }, (_, i) => {
    const a = ((-90 + 36 * i) * Math.PI) / 180;
    const radio = i % 2 === 0 ? r : r * 0.42;
    return `${(x + radio * Math.cos(a)).toFixed(2)},${(y + radio * Math.sin(a)).toFixed(2)}`;
  }).join(" ");
  return <polygon points={puntos} fill={fill} />;
}

const DIBUJOS = {
  ve: (
    <>
      <rect width="30" height="10" fill="#FCD116" />
      <rect y="10" width="30" height="10" fill="#00247D" />
      <rect y="20" width="30" height="10" fill="#CF142B" />
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
        const a = ((200 + (140 / 7) * i) * Math.PI) / 180;
        return (
          <circle
            key={i}
            cx={15 + 6.4 * Math.cos(a)}
            cy={18.6 + 6.4 * Math.sin(a)}
            r="0.9"
            fill="#fff"
          />
        );
      })}
    </>
  ),
  pa: (
    <>
      <rect width="30" height="30" fill="#fff" />
      <rect x="15" width="15" height="15" fill="#DA121A" />
      <rect y="15" width="15" height="15" fill="#072357" />
      <Estrellita x={7.5} y={7.5} r={3.6} fill="#072357" />
      <Estrellita x={22.5} y={22.5} r={3.6} fill="#DA121A" />
    </>
  ),
  co: (
    <>
      <rect width="30" height="15" fill="#FCD116" />
      <rect y="15" width="30" height="7.5" fill="#003893" />
      <rect y="22.5" width="30" height="7.5" fill="#CE1126" />
    </>
  ),
};

export default function Bandera({ codigo, nombre, className = "size-7" }) {
  const dibujo = DIBUJOS[codigo];
  if (!dibujo) return null;

  return (
    <svg
      viewBox="0 0 30 30"
      role="img"
      aria-label={nombre}
      className={`shrink-0 rounded-full ring-1 ring-base-content/25 ${className}`}
    >
      <clipPath id={`bandera-${codigo}`}>
        <circle cx="15" cy="15" r="15" />
      </clipPath>
      <g clipPath={`url(#bandera-${codigo})`}>{dibujo}</g>
    </svg>
  );
}
