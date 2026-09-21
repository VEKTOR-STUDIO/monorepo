// -----------------------------------------------------------------------------
// El logotipo de LM 2006, redibujado en vector.
//
// Su marca son tres barras inclinadas seguidas del nombre: una barra de plata
// estrecha, una roja un poco más ancha y un bloque azul con "LM" en blanco
// dentro; después, "2006" y un © diminuto arriba a la derecha.
//
// Aparece en dos montajes distintos, y los dos son suyos:
//
//   · EN LÍNEA (por defecto). Es el que va en la esquina de cada una de sus
//     publicaciones. Sirve para cabeceras y pies.
//   · APILADA. Barras y "LM" arriba, "2006" debajo. Es su foto de perfil.
//
// Por qué en vector y no la imagen: la foto de perfil viene con su propio
// fondo grafito cuadrado, así que sobre cualquier otro fondo hay que recortarla
// o fundirla, y a tamaño de cabecera el texto se empasta. Aquí el trazo es
// limpio a cualquier tamaño y el color de "2006" lo pone `currentColor`, así
// que la marca funciona igual sobre claro que sobre oscuro. La foto tal cual
// está en public/marca/lm2006-logo.jpg y la usa <LogoChapa /> en Logo.js.
//
// LA GEOMETRÍA NO ES DECORATIVA. La inclinación es −12°, medida sobre el borde
// del bloque azul del archivo original, y es la misma variable (--angulo-lm)
// que usa el resto de la página. Las anchuras relativas de las tres barras
// —estrecha, media, muy ancha— también están medidas: si se igualan, deja de
// parecerse a su logotipo y pasa a parecerse al de otra marca alemana muy
// conocida, que es justo lo que hay que evitar.
// -----------------------------------------------------------------------------

// Lo que se desplaza la base respecto al techo con 48 px de alto y −12°:
// 48 · tan(12°) = 10,2.
const SESGO = 10.2;
const ALTO = 48;

/** Un paralelogramo: arriba de `x` a `x + ancho`, y la base corrida a la izquierda. */
function barra(x, ancho, relleno, opacidad) {
  return (
    <path
      d={`M${x} 0 L${x + ancho} 0 L${x + ancho - SESGO} ${ALTO} L${x - SESGO} ${ALTO} Z`}
      fill={relleno}
      opacity={opacidad}
    />
  );
}

/**
 * @param {"linea"|"apilada"} disposicion  el montaje de la marca
 * @param {boolean} soloBarras  solo el trío plata-rojo-azul, sin el nombre
 */
export default function MarcaLM({
  className = "",
  disposicion = "linea",
  soloBarras = false,
  titulo = "LM 2006",
}) {
  // Las tres barras son siempre las mismas y están en el mismo sitio; lo único
  // que cambia entre montajes es dónde cae "2006".
  const barras = (
    <>
      {barra(13, 7, "var(--color-plata, #aabad4)")}
      {barra(24, 11, "var(--color-rojo, #ff1f1f)")}
    </>
  );

  const bloqueAzul = barra(41, 76, "var(--color-azul, #0059ff)");

  // "LM" va dentro del bloque y siempre en blanco: en el original nunca toma el
  // color del fondo, porque va sobre el azul.
  //
  // `textLength` + `lengthAdjust` fijan el ancho del texto pase lo que pase con
  // la carga de la tipografía. Sin eso, entre que el navegador pinta con la de
  // reserva y llega Barlow Condensed, las letras se salen del bloque azul o le
  // bailan dentro, y eso se ve en cada carga de página.
  const letras = (
    <text
      x="74"
      y="36"
      textAnchor="middle"
      textLength="56"
      lengthAdjust="spacingAndGlyphs"
      fontFamily="var(--font-display, 'Arial Narrow', sans-serif)"
      fontSize="40"
      fontWeight="800"
      fontStyle="italic"
      fill="#ffffff"
    >
      LM
    </text>
  );

  if (soloBarras) {
    return (
      <svg
        viewBox="0 0 120 48"
        role="presentation"
        aria-hidden="true"
        className={className}
        style={{ aspectRatio: "120 / 48" }}
        preserveAspectRatio="xMidYMid meet"
      >
        {barras}
        {bloqueAzul}
      </svg>
    );
  }

  if (disposicion === "apilada") {
    return (
      <svg
        viewBox="0 0 132 104"
        role="img"
        aria-label={titulo}
        className={className}
        style={{ aspectRatio: "132 / 104" }}
        preserveAspectRatio="xMidYMid meet"
      >
        {barras}
        {bloqueAzul}
        {letras}
        {/* "2006" debajo, alineado con el bloque de arriba. */}
        <text
          x="66"
          y="98"
          textAnchor="middle"
          textLength="104"
          lengthAdjust="spacingAndGlyphs"
          fontFamily="var(--font-display, 'Arial Narrow', sans-serif)"
          fontSize="46"
          fontWeight="800"
          fontStyle="italic"
          fill="currentColor"
        >
          2006
        </text>
        <text x="122" y="62" fontSize="11" fontWeight="700" fill="currentColor" opacity="0.75">
          ©
        </text>
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 230 48"
      role="img"
      aria-label={titulo}
      className={className}
      style={{ aspectRatio: "230 / 48" }}
      preserveAspectRatio="xMidYMid meet"
    >
      {barras}
      {bloqueAzul}
      {letras}
      <text
        x="126"
        y="36"
        textLength="90"
        lengthAdjust="spacingAndGlyphs"
        fontFamily="var(--font-display, 'Arial Narrow', sans-serif)"
        fontSize="40"
        fontWeight="800"
        fontStyle="italic"
        fill="currentColor"
      >
        2006
      </text>
      <text x="220" y="12" fontSize="9" fontWeight="700" fill="currentColor" opacity="0.75">
        ©
      </text>
    </svg>
  );
}
