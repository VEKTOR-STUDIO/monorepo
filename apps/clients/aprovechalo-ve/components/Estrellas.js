// -----------------------------------------------------------------------------
// El arco de estrellas de Aprovéchalo.
//
// Su foto de perfil es un arco de siete estrellas blancas sobre negro. El JPEG
// sirve sobre fondo oscuro —el negro se funde con `mix-blend-mode: screen`—
// pero sobre el fondo claro de esta página no hay forma de recortarlo: en
// `multiply` desaparecen las estrellas y en `screen` desaparece el fondo.
//
// Así que el motivo se dibuja: siete estrellas repartidas sobre un arco,
// en `currentColor`, que escala a cualquier tamaño, pesa nada y se puede
// pintar en negro sobre blanco o en blanco sobre negro según haga falta.
//
// El arco se calcula, no se copia punto por punto: cambiar `cantidad` o
// `apertura` recoloca todo solo.
// -----------------------------------------------------------------------------

/** Los cinco picos de una estrella, como polígono. */
function puntosDeEstrella(cx, cy, radio, giro = -90) {
  const interior = radio * 0.42;
  const puntos = [];

  for (let i = 0; i < 10; i++) {
    const r = i % 2 === 0 ? radio : interior;
    const angulo = ((giro + i * 36) * Math.PI) / 180;
    puntos.push(`${(cx + r * Math.cos(angulo)).toFixed(2)},${(cy + r * Math.sin(angulo)).toFixed(2)}`);
  }

  return puntos.join(" ");
}

/**
 * @param {number} cantidad  cuántas estrellas lleva el arco
 * @param {number} apertura  grados que abarca el arco
 */
export default function Estrellas({
  cantidad = 7,
  apertura = 132,
  className = "",
}) {
  // El arco vive en una caja de 200×78. El centro del círculo cae por debajo
  // del dibujo, que es lo que deja la curva abierta hacia arriba.
  const cx = 100;
  const cy = 118;
  const radio = 88;

  const desde = -90 - apertura / 2;
  const paso = apertura / (cantidad - 1);

  const estrellas = Array.from({ length: cantidad }, (_, i) => {
    const angulo = ((desde + i * paso) * Math.PI) / 180;
    // Las de los extremos algo más pequeñas: así el arco respira igual que en
    // el original en vez de parecer una fila de iconos pegados.
    const distanciaAlCentro = Math.abs(i - (cantidad - 1) / 2) / ((cantidad - 1) / 2);
    const tamano = 15 - distanciaAlCentro * 3.5;

    return {
      x: cx + radio * Math.cos(angulo),
      y: cy + radio * Math.sin(angulo),
      r: tamano,
    };
  });

  return (
    <svg
      viewBox="0 0 200 78"
      className={className}
      role="img"
      aria-hidden="true"
      preserveAspectRatio="xMidYMid meet"
    >
      {estrellas.map((e, i) => (
        <polygon key={i} points={puntosDeEstrella(e.x, e.y, e.r)} fill="currentColor" />
      ))}
    </svg>
  );
}
