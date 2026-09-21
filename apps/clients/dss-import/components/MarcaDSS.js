// -----------------------------------------------------------------------------
// El rótulo de DSS, el que encabeza todas sus publicaciones.
//
// Su marca tiene DOS piezas y no una, y conviene no confundirlas:
//
//   · EL SELLO: el disco de pan de oro con el monograma S/D calado. Es la foto
//     de perfil y lo que va en la cabecera. Está en components/Logo.js, que usa
//     el archivo de verdad (public/marca/dss-import.jpg).
//   · EL RÓTULO: "DSS" en condensada muy pesada con "IMPORT & EXPORT" debajo,
//     separado por un filete. Es lo que llevan impreso arriba TODAS sus piezas
//     de Instagram, y es lo que se dibuja aquí.
//
// Este es el rótulo, y va en texto y no en SVG a propósito: son letras, así que
// con la tipografía ya cargada de la página se leen mejor, se seleccionan, las
// entiende un lector de pantalla y no hay un trazado que mantener.
//
// Se intentó redibujar el monograma en vector para poder usarlo sin cargar la
// imagen, y se descartó: la S es caligráfica, cruza por delante de la D con un
// grosor que cambia en cada tramo, y un calco a mano se nota exactamente en el
// tamaño grande, que es donde se mira. Para eso está el archivo original, que
// es el suyo y no una aproximación.
//
// TODO se mide en `em`, así que el rótulo entero escala con el `font-size` que
// le ponga quien lo use: `text-[0.72rem]` en la cabecera, `text-[1.5rem]` en
// una portada, y las proporciones internas no se mueven.
// -----------------------------------------------------------------------------

/**
 * @param {boolean} centrado  apilado al centro (portadas) o a la izquierda
 * @param {boolean} arco      si se escribe "IMPORT & EXPORT" debajo
 * @param {"oro"|"heredado"} tono  de qué color van las siglas
 */
export default function MarcaDSS({
  className = "",
  centrado = false,
  arco = true,
  tono = "heredado",
}) {
  return (
    <span
      className={`inline-flex flex-col leading-none ${
        centrado ? "items-center text-center" : "items-start text-left"
      } ${className}`}
    >
      <span
        className={`display text-[1.6em] tracking-tight ${
          tono === "oro" ? "text-primary" : ""
        }`}
      >
        DSS
      </span>

      {arco && (
        <>
          {/* El filete que separa las siglas del rótulo, como en sus piezas.
              Va en `em` y no en `w-full`: dentro de una columna alineada a un
              lado, `w-full` no tiene un ancho de referencia y colapsa. */}
          <span
            className="filete mt-[0.24em] h-[0.09em] w-[5.4em] shrink-0"
            aria-hidden="true"
          />
          <span className="cifra mt-[0.24em] text-[0.42em] tracking-[0.3em] text-base-content/60">
            IMPORT &amp; EXPORT
          </span>
        </>
      )}
    </span>
  );
}
