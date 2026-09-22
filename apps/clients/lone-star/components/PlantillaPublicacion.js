import Silueta from "@/components/Silueta";
import { Estrella } from "@/components/Logo";
import { enMillas } from "@/libs/formato";

// -----------------------------------------------------------------------------
// La plantilla de sus publicaciones, dibujada.
//
// De Lone Star solo hay foto de la Tacoma y del Corolla. Para el resto, en vez
// de dejar rectángulos negros —o, peor, de meter fotos de banco de imágenes
// haciéndolas pasar por suyas—, cada ficha se dibuja con la misma receta con
// la que ellos maquetan su pieza de la Tacoma:
//
//   noche negra con humo rojo  →  el puerto al fondo  →  piso mojado  →  la
//   unidad encima; la marca en blanco y el modelo en rojo arriba a la
//   izquierda, la banda roja de "EN SUBASTA" arriba a la derecha y la tira de
//   datos al pie: millaje, daño primario y si arranca y rueda.
//
// Es decir: el hueco de la foto enseña exactamente el sitio donde va a ir su
// foto, y con su gráfica. El día que la ficha traiga `fotos`, esto desaparece
// solo.
//
// Todo se mide en `cqw` —unidades del ancho del propio contenedor— porque la
// misma pieza se usa a 256 px en el carrusel, a 1.100 px en la ficha y a 90 px
// en las miniaturas. Con `cqw`, la composición se escala entera igual que una
// imagen.
// -----------------------------------------------------------------------------

/**
 * @param {object} vehiculo  la unidad, ya normalizada por libs/vehiculos
 * @param {boolean} compacta  para miniaturas: se queda solo la escena
 */
export default function PlantillaPublicacion({ vehiculo, compacta = false }) {
  const datos = vehiculo?.enSubasta
    ? [
        ["Millaje", Number.isFinite(vehiculo.millas) ? enMillas(vehiculo.millas) : "—"],
        ["Daño", vehiculo.danio || "—"],
        ["Condición", vehiculo.condicionInfo?.corto || "—"],
      ]
    : [
        ["Años", vehiculo?.anioTexto || "A elegir"],
        ["Tipo", vehiculo?.tipo?.singular || "—"],
        ["Entrega", "En tu país"],
      ];

  return (
    <div
      className="absolute inset-0 overflow-hidden"
      style={{ containerType: "inline-size" }}
      aria-hidden="true"
    >
      {/* La noche con el humo rojo, a plena potencia: aquí la pieza ES el
          fondo. */}
      <div className="cielo-pieza absolute inset-0" />

      {/* El puntillado de la esquina, como en sus piezas del Corolla. */}
      <div className="puntillado absolute left-0 top-0 h-[22%] w-[26%] opacity-40" />

      {/* El puerto, contra el rojo. El alto va en `cqw` para que guarde la
          PROPORCIÓN con la tarjeta y no con la pantalla. */}
      <div
        className="horizonte absolute inset-x-0 bottom-[26%] h-[36%] opacity-95"
        style={{ "--horizonte-alto": "20cqw" }}
      />

      {/* El piso mojado donde se posa la unidad. */}
      <div className="asfalto absolute inset-x-0 bottom-0 h-[30%]" />

      {/* La unidad, apoyada en el filo del piso y un pelo más ancha que la
          tarjeta, como en sus piezas: el dibujo es muy apaisado y dentro de
          una tarjeta 4:5 quedaba diminuto. */}
      <div className="absolute inset-x-[-3%] bottom-[19%]">
        <div className="relative">
          <Silueta tipo={vehiculo?.carroceria} className="w-full text-base-content/85" />
          <div className="sombra-piso absolute inset-x-[8%] bottom-[2%] h-[6%]" />
        </div>
      </div>

      {/* El grano, que es lo que evita que el degradado se vea plano. */}
      <div className="textura absolute inset-0" />

      {!compacta && (
        <>
          {/* La cabecera de sus piezas: la estrella y, debajo, la marca en
              blanco y el modelo en rojo. */}
          <div className="absolute left-0 top-0" style={{ padding: "6cqw", maxWidth: "70%" }}>
            <Estrella className="text-base-content" style={{ width: "7cqw", height: "7cqw" }} />
            <p
              className="display mt-[3cqw] text-base-content"
              style={{ fontSize: "8.4cqw", lineHeight: 0.9 }}
            >
              {vehiculo?.marca} {vehiculo?.modelo}
            </p>
            <p className="display text-primary" style={{ fontSize: "8.4cqw", lineHeight: 0.9 }}>
              {[vehiculo?.version, vehiculo?.anio].filter(Boolean).join(" ") ||
                vehiculo?.segmentoInfo?.nombre}
            </p>
          </div>

          {/* La banda roja de arriba a la derecha. */}
          <div className="absolute right-0 top-0" style={{ padding: "6cqw 0" }}>
            <span
              className="display block bg-primary text-primary-content"
              style={{
                fontSize: "3.6cqw",
                padding: "1.6cqw 5cqw 1.6cqw 4cqw",
                clipPath: "polygon(2.4cqw 0, 100% 0, 100% 100%, 0 100%)",
              }}
            >
              {vehiculo?.enSubasta ? "En subasta" : "A pedido"}
            </span>
          </div>

          {/* La tira de datos del pie, en tres casillas. */}
          <dl
            className="absolute inset-x-0 bottom-0 grid grid-cols-3 border-t border-primary/60 bg-base-100/85"
            style={{ padding: "3cqw 4cqw" }}
          >
            {datos.map(([etiqueta, valor]) => (
              <div key={etiqueta} className="min-w-0 text-center">
                <dt
                  className="display-recto text-base-content/55"
                  style={{ fontSize: "2.6cqw", letterSpacing: "0.12em" }}
                >
                  {etiqueta}
                </dt>
                <dd
                  className="display-recto truncate text-base-content"
                  style={{ fontSize: "3.6cqw", marginTop: "0.8cqw" }}
                >
                  {valor}
                </dd>
              </div>
            ))}
          </dl>
        </>
      )}
    </div>
  );
}
