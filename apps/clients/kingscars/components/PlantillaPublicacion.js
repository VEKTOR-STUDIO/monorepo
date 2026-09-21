import Silueta from "@/components/Silueta";
import MarcaCorona from "@/components/MarcaCorona";

// -----------------------------------------------------------------------------
// La plantilla de sus publicaciones, dibujada.
//
// Ninguna unidad de este inventario tiene foto suya: Instagram limitó las
// peticiones mientras se montaba la página. Así que en vez de dejar catorce
// rectángulos grises —o, peor, de meter fotos de banco de imágenes haciéndolas
// pasar por suyas—, cada ficha se dibuja con la misma receta con la que ellos
// maquetan sus posts, que es de las más reconocibles que hay:
//
//   marco blanco redondeado  →  la corona al agua arriba y al centro  →  el
//   vehículo  →  el rótulo blanco con el modelo y el año  →  TRES TARJETAS
//   BLANCAS con Kilometraje, Transmisión y Precio $.
//
// Esa fila de tres tarjetas es la pieza que más se repite en las 902
// publicaciones de la cuenta, y es lo que hace que un cuadrado se lea como un
// post de Kings Cars y no como una tarjeta de plantilla. Va en el mismo orden
// que la suya y con las mismas etiquetas, palabra por palabra.
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
 * @param {object} vehiculo  la unidad, ya normalizada por libs/vehiculos
 * @param {boolean} compacta  para miniaturas: se queda solo la escena
 */
export default function PlantillaPublicacion({ vehiculo, compacta = false }) {
  const km = vehiculo?.condicion === "nuevo" ? "0" : kilometrajeCorto(vehiculo?.km);
  const caja = transmisionCorta(vehiculo?.transmision);
  const precio = precioCorto(vehiculo?.precio);

  return (
    <div
      className="absolute inset-0 overflow-hidden estudio"
      style={{ containerType: "inline-size" }}
      aria-hidden="true"
    >
      {/* La losa donde se posa la unidad. */}
      <div className="piedra absolute inset-0" />
      <div className="piedra-vetas absolute inset-0" />

      {/* La corona al agua, arriba y al centro, como en todas sus piezas. */}
      <div
        className="absolute left-1/2 -translate-x-1/2"
        style={{ top: "6cqw", width: "26cqw" }}
      >
        <MarcaCorona
          className="h-auto w-full text-base-content"
          detalle={!compacta}
        />
      </div>

      {/* El vehículo. Se sale un pelo por los lados, como en sus piezas: el
          dibujo es muy apaisado y dentro de una tarjeta 4:5 quedaba diminuto,
          con medio cartel vacío encima.

          Cuando la pieza lleva las tarjetas de datos, el vehículo sube para
          dejarles sitio; en miniatura se centra, porque ahí es lo único que
          hay. */}
      <div
        className="absolute inset-x-[-6%]"
        style={{ bottom: compacta ? "24%" : "33%" }}
      >
        <div className="relative">
          <Silueta tipo={vehiculo?.carroceria} className="w-full text-base-content/85" />
          {/* La sombra va debajo de las ruedas, no del dibujo entero. */}
          <div className="sombra-piso absolute inset-x-[8%] bottom-[2%] h-[6%]" />
        </div>
      </div>

      {/* El grano, que es lo que evita que el fondo se vea plano. */}
      <div className="textura absolute inset-0" />

      {!compacta && (
        <>
          {/* El rótulo del modelo y el año, tal como lo escriben: separados por
              una barra y todo en mayúsculas. */}
          <div
            className="absolute inset-x-0"
            style={{ bottom: "24cqw", padding: "0 6cqw" }}
          >
            <p
              className="rotulo-post text-center"
              style={{ fontSize: "6.4cqw" }}
            >
              {[vehiculo?.marca, vehiculo?.modelo, vehiculo?.version]
                .filter(Boolean)
                .join(" ")}
              {vehiculo?.anio ? ` / ${vehiculo.anio}` : ""}
            </p>
          </div>

          {/* Las tres tarjetas. Es LA pieza de la casa. */}
          <div
            className="absolute inset-x-0 bottom-0 grid grid-cols-3"
            style={{ gap: "2.5cqw", padding: "0 4cqw 5cqw" }}
          >
            <TarjetaDato etiqueta="Kilometraje" valor={km} icono="velocimetro" />
            <TarjetaDato etiqueta="Transmisión" valor={caja} />
            <TarjetaDato etiqueta="Precio $" valor={precio} fuerte />
          </div>

          {/* El marco blanco que envuelve la pieza entera. Va el último para
              que quede por encima de todo, que es como está impreso en sus
              publicaciones. */}
          <div className="marco-post absolute inset-[2cqw]" />
        </>
      )}
    </div>
  );
}

/** Una de las tres tarjetas blancas del pie. */
function TarjetaDato({ etiqueta, valor, icono, fuerte = false }) {
  return (
    <span
      className={`tarjeta-dato ${fuerte ? "tarjeta-dato-fuerte" : ""}`}
      style={{ borderRadius: "2.6cqw", padding: "2cqw 1.5cqw", gap: "0.4cqw" }}
    >
      <span
        className="tarjeta-dato-etiqueta"
        style={{ fontSize: "2.6cqw" }}
      >
        {etiqueta}
      </span>
      <span
        className="tarjeta-dato-valor flex items-center"
        style={{ fontSize: fuerte ? "4.6cqw" : "4.2cqw", gap: "1.2cqw" }}
      >
        {/* La aguja del velocímetro es lo único rojo de la pieza, igual que en
            sus posts: señala el dato y no decora la tarjeta. */}
        {icono === "velocimetro" && (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            style={{ width: "4cqw", height: "4cqw", flexShrink: 0 }}
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="9" stroke="#111" strokeWidth="2" />
            <path
              d="M12 12 L17 8"
              stroke="var(--color-rojo, #e11b2c)"
              strokeWidth="2.6"
              strokeLinecap="round"
            />
            <circle cx="12" cy="12" r="1.8" fill="var(--color-rojo, #e11b2c)" />
          </svg>
        )}
        {valor || "—"}
      </span>
    </span>
  );
}

/** 161000 → "161.000". Vacío cuando el dato no está declarado. */
function kilometrajeCorto(km) {
  if (km === null || km === undefined || km === "" || !Number.isFinite(Number(km))) {
    return "";
  }
  return new Intl.NumberFormat("es-VE").format(Number(km));
}

/** "Automática" → "AUT.", que es como lo abrevian ellos en la tarjeta. */
function transmisionCorta(transmision) {
  if (!transmision) return "";
  const t = String(transmision).toLowerCase();
  if (t.startsWith("auto")) return "Aut.";
  if (t.startsWith("sinc") || t.startsWith("manu")) return "Sinc.";
  return transmision;
}

/** 13900 → "13.900,00", con los dos decimales que ellos escriben siempre. */
function precioCorto(precio) {
  if (!Number.isFinite(Number(precio))) return "";
  return new Intl.NumberFormat("es-VE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(precio));
}
