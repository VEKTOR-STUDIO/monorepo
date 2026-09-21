// -----------------------------------------------------------------------------
// La V de Veloce.
//
// No está redibujada a ojo: es el trazado exacto de su foto de perfil
// (public/marca/Insta_Saver_@veloce.autos_dp_HD.jpg), sacado decodificando el
// JPG, persiguiendo el borde entre el negro y el blanco y simplificando el
// contorno. El logotipo son puras rectas, así que el vector no pierde nada
// respecto al original: 26 puntos y ni una curva.
//
// Después se simetrizó —la foto trae unas décimas de desvío por el JPEG— para
// que el eje caiga exactamente en la mitad de la caja. Así el mismo dibujo
// sirve de 12 px en un favicon a 600 px en una portada sin que se note dónde
// se hizo.
//
// Va en `currentColor` a propósito: sobre negro es blanca, sobre blanco negra,
// y no hay dos archivos que mantener.
//
// Dos versiones:
//
//   <MarcaVeloce />                 la marca entera, con las dos púas internas
//   <MarcaVeloce compacta />        solo el cuerpo, para tamaños diminutos
//
// Lo de `compacta` no es un capricho. Las púas van separadas del cuerpo por un
// hueco de menos de dos unidades de las 143 de ancho: por debajo de unos 20 px
// ese hueco no cabe en un píxel, las púas se pegan al cuerpo y la marca se
// convierte en una mancha. A ese tamaño se quitan y el gesto se sigue leyendo.
// -----------------------------------------------------------------------------

/** El cuerpo: las dos alas exteriores y la V central, de una sola pieza. */
const CUERPO =
  "M143.1 0.1L136.3 10.2L93.7 30.9L81.1 85.2L71.6 100L62 85.2L49.5 30.9L6.8 10.2L0 0.1L58.4 26.4L71.6 87.4L84.7 26.4Z";

/** Las dos púas interiores, una el reflejo de la otra. */
const PUAS = [
  "M89.2 71L97.8 33.7L133.3 16.1L126 27.6L106.8 37.9L104.5 48.1Z",
  "M53.9 71L45.3 33.7L9.8 16.1L17.1 27.6L36.3 37.9L38.6 48.1Z",
];

export default function MarcaVeloce({ className = "", compacta = false, titulo, style }) {
  return (
    <svg
      viewBox="0 0 143.1 100"
      className={className}
      style={style}
      preserveAspectRatio="xMidYMid meet"
      fill="currentColor"
      {...(titulo
        ? { role: "img", "aria-label": titulo }
        : { role: "img", "aria-hidden": "true" })}
    >
      <path d={CUERPO} />
      {!compacta && PUAS.map((d) => <path key={d} d={d} />)}
    </svg>
  );
}

/**
 * La marca con el nombre debajo, como en su foto de perfil y en su comunicado:
 * la V arriba, "VELOCE" debajo y "AUTOS" en pequeñito y muy espaciado.
 *
 * El texto va en la tipografía de la casa y no vectorizado, que es lo que
 * permite que herede el color, se seleccione y lo lea un buscador.
 */
export function MarcaVeloceFirmada({ className = "", tamano = "md" }) {
  const medidas = {
    sm: { marca: "h-6", nombre: "text-lg", sub: "text-[0.45rem]" },
    md: { marca: "h-10", nombre: "text-3xl", sub: "text-[0.55rem]" },
    lg: { marca: "h-16", nombre: "text-5xl sm:text-6xl", sub: "text-[0.7rem]" },
  }[tamano];

  return (
    <span className={`inline-flex flex-col items-center ${className}`}>
      <MarcaVeloce className={`${medidas.marca} w-auto`} />
      <span className={`display mt-2 leading-none ${medidas.nombre}`}>Veloce</span>
      <span className={`display mt-1 leading-none tracking-[0.55em] opacity-50 ${medidas.sub}`}>
        Autos
      </span>
    </span>
  );
}
