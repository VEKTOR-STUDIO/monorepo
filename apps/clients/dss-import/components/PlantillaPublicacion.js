import Silueta from "@/components/Silueta";
import { enDolares } from "@/libs/formato";

// -----------------------------------------------------------------------------
// La plantilla de sus publicaciones, dibujada.
//
// Ninguna unidad de este catálogo tiene foto: Instagram limitó las peticiones
// desde esta IP mientras se montaba la página y no se pudo bajar ni una imagen
// de @somosdss. Así que en vez de dejar trece rectángulos negros —o, peor, de
// meter fotos de banco de imágenes haciéndolas pasar por suyas—, cada ficha se
// dibuja con la misma receta con la que ellos maquetan sus posts:
//
//   rótulo DSS arriba  →  "ADQUIERE UN <MODELO>" en condensada  →  cielo dorado
//   con la ciudad al fondo  →  la unidad posada sobre el asfalto  →  y la
//   PASTILLA DE LA CUOTA abajo: "CUOTAS · DESDE 75 · SEMANALES".
//
// Esa pastilla es el centro de su gráfica, no un adorno: es lo único que
// anuncian con número. Por eso aquí va abajo, centrada y en oro, exactamente
// como en sus piezas, y no el precio de contado —que ellos no publican nunca—.
//
// Es decir: el hueco de la foto enseña exactamente el sitio donde va a ir su
// foto, y con su gráfica. El día que suban las suyas desde el panel, esto
// desaparece solo.
//
// Todo se mide en `cqw` —unidades del ancho del propio contenedor— porque la
// misma pieza se usa a 256 px en el carrusel, a 1.100 px en la ficha y a 90 px
// en las miniaturas. Con `rem` habría que escribir cuatro juegos de tamaños y
// alguno se quedaría atrás; con `cqw`, la composición se escala entera igual
// que una imagen.
// -----------------------------------------------------------------------------

/**
 * @param {object} vehiculo  la unidad, ya normalizada por libs/catalogo
 * @param {boolean} compacta  para miniaturas: se queda solo la escena
 */
export default function PlantillaPublicacion({ vehiculo, compacta = false }) {
  const cuota = vehiculo?.cuota;

  return (
    <div
      className="absolute inset-0 overflow-hidden"
      style={{ containerType: "inline-size" }}
      aria-hidden="true"
    >
      {/* El cielo, a plena potencia: aquí no hay texto largo encima que
          proteger, la pieza ES el cielo. */}
      <div className="cielo-pieza absolute inset-0" />

      {/* La ciudad, contra el cielo. El alto de los edificios va en `cqw` y no
          en `vh` como en las secciones: esta misma pieza se dibuja a 256 px en
          el carrusel y a 1.100 px en la ficha, y lo que tiene que mantenerse es
          la PROPORCIÓN con la tarjeta, no un tamaño de pantalla. */}
      <div
        className="horizonte absolute inset-x-0 bottom-[24%] h-[42%] opacity-90"
        style={{ "--horizonte-alto": "26cqw" }}
      />

      {/* El asfalto donde se posa la unidad. */}
      <div className="asfalto absolute inset-x-0 bottom-0 h-[30%]" />

      {/* La unidad. Se apoya justo sobre el filo del asfalto y se sale un pelo
          por los lados, como en sus piezas: el dibujo es muy apaisado y dentro
          de una tarjeta 4:5 quedaba diminuto, con medio cartel de cielo vacío
          encima.

          Las motos van algo más pequeñas y más centradas que los carros: una
          moto estirada a todo el ancho de la tarjeta parece una moto de juguete
          fotografiada de cerca. */}
      <div
        className={
          vehiculo?.esMoto
            ? "absolute inset-x-[12%] bottom-[18%]"
            : "absolute inset-x-[-3%] bottom-[18%]"
        }
      >
        <div className="relative">
          <Silueta
            tipo={vehiculo?.carroceria}
            className="w-full text-base-content/90"
          />
          {/* La sombra va debajo de las ruedas, no del dibujo entero. */}
          <div className="sombra-piso absolute inset-x-[8%] bottom-[2%] h-[6%]" />
        </div>
      </div>

      {/* El grano, que es lo que evita que el degradado se vea plano. */}
      <div className="textura absolute inset-0" />

      {!compacta && (
        <>
          {/* El rótulo de la casa, arriba y centrado, como en todas sus
              piezas. Va en negro y no en blanco: sobre la parte alta del
              degradado —que es la oscura— el blanco competiría con el titular
              que viene justo debajo. */}
          <div
            className="absolute inset-x-0 top-0 flex flex-col items-center"
            style={{ paddingTop: "5cqw" }}
          >
            <span
              className="display leading-none text-base-content"
              style={{ fontSize: "5.5cqw" }}
            >
              DSS
            </span>
            <span
              className="cifra text-base-content/55"
              style={{ fontSize: "1.9cqw", letterSpacing: "0.3em", marginTop: "0.8cqw" }}
            >
              IMPORT &amp; EXPORT
            </span>
          </div>

          {/* "ADQUIERE UN CHEVROLET OPTRA": su titular, palabra por palabra.
              El modelo va en oro claro y la marca en blanco, que es el reparto
              exacto de sus carteles. */}
          <div
            className="absolute inset-x-0 text-center"
            style={{ top: "20cqw", padding: "0 6cqw" }}
          >
            <p
              className="display text-base-content/70"
              style={{ fontSize: "3.2cqw", letterSpacing: "0.12em" }}
            >
              Adquiere {vehiculo?.esMoto ? "una" : "un"}
            </p>
            <p
              className="display text-base-content"
              style={{ fontSize: "7.5cqw", lineHeight: 0.9, marginTop: "1cqw" }}
            >
              {vehiculo?.marca}
            </p>
            <p
              className="display"
              style={{
                fontSize: "8.5cqw",
                lineHeight: 0.9,
                color: "var(--color-oro-claro)",
              }}
            >
              {vehiculo?.modelo}
            </p>
            {vehiculo?.anio && (
              <p
                className="cifra text-base-content/60"
                style={{ fontSize: "2.8cqw", letterSpacing: "0.16em", marginTop: "1.4cqw" }}
              >
                {vehiculo.anio}
              </p>
            )}
          </div>

          {/* La pastilla de la cuota: lo único que ellos anuncian con número.
              Va en tres renglones, como en sus piezas: la palabra "cuotas"
              pequeña arriba, la cifra grande, y el periodo pequeño debajo. */}
          {cuota?.monto && (
            <div
              className="absolute inset-x-0 bottom-0 flex justify-center"
              style={{ padding: "5cqw" }}
            >
              <span
                className="pastilla cifra flex-col"
                style={{
                  padding: "2.2cqw 6cqw",
                  gap: "0.4cqw",
                  lineHeight: 1,
                }}
              >
                <span style={{ fontSize: "2.2cqw", letterSpacing: "0.22em", opacity: 0.75 }}>
                  CUOTAS
                </span>
                <span style={{ fontSize: "6.5cqw", fontWeight: 700 }}>
                  {enDolares(cuota.monto)}
                </span>
                <span style={{ fontSize: "2.2cqw", letterSpacing: "0.22em", opacity: 0.75 }}>
                  {cuota.etiqueta.toUpperCase()}
                </span>
              </span>
            </div>
          )}
        </>
      )}
    </div>
  );
}
