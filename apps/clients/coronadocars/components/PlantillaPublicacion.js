import Silueta from "@/components/Silueta";
import MarcaCoronado from "@/components/MarcaCoronado";
import config from "@/config";

// -----------------------------------------------------------------------------
// La plantilla de sus publicaciones, dibujada.
//
// Ninguna unidad de este inventario tiene foto suya. Así que en vez de dejar
// rectángulos vacíos —o, peor, de meter fotos de banco de imágenes haciéndolas
// pasar por suyas—, cada ficha se dibuja con la misma receta con la que ellos
// maquetan sus posts (docs/fuentes/post-ficha-yaris-2008.png), que es de las
// más reconocibles de la cuenta:
//
//   la PARED DE PRENSA del local, clara y llena de logos  →  el carro posado
//   en el piso de cemento  →  la ETIQUETA BLANCA con el modelo arriba a la
//   izquierda, con su banda azul cortada en diagonal  →  su recuadro abajo a
//   la derecha  →  el FILETE AMARILLO  →  la fila de cajas: AÑO en azul;
//   MODELO, KILOMETRAJE y TRANSMISIÓN en blanco  →  la pastilla azul con
//   "@CoronadoCarss" y el teléfono.
//
// Va en el mismo orden que la suya y con las mismas etiquetas, palabra por
// palabra. Es decir: el hueco de la foto enseña exactamente el sitio donde va
// a ir su foto, y con su gráfica. El día que suban las suyas, esto desaparece
// solo (components/FotoVehiculo.js).
//
// La pared va SIN el logotipo de la marca hermana (autocom) que comparte con
// ellos en el local: son solo placas. No es nuestro para dibujarlo.
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
  const km = vehiculo?.condicion === "nuevo" ? "0 km" : kilometrajeCorto(vehiculo?.km);
  const caja = transmisionLarga(vehiculo?.transmision);
  // En sus cajas, "MODELO" es la versión ("BELTA" en el Yaris). Si la unidad
  // no la declara, se repite el modelo antes que dejar la caja en blanco.
  const modelo = vehiculo?.version || vehiculo?.modelo;

  return (
    <div
      className="absolute inset-0 overflow-hidden"
      style={{ containerType: "inline-size" }}
      aria-hidden="true"
    >
      {/* La pared del local. */}
      <div className="pared-clara absolute inset-0" />
      {/* Un velo de la propia pared: en sus fotos la pared está desenfocada
          detrás del carro, y a plena nitidez las placas competían con él. */}
      <div className="absolute inset-0 bg-pared/45" />
      {/* Un poco de viñeta: en sus fotos la pared se oscurece hacia los
          bordes, lejos del foco. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 70% at 50% 45%, transparent 45%, rgb(20 28 50 / 0.28) 100%)",
        }}
      />

      {/* El piso de cemento. */}
      <div
        className="piso absolute inset-x-0 bottom-0"
        style={{ height: compacta ? "30%" : "38%" }}
      />

      {/* El carro. En plata, que es lo que recorta contra la pared clara y lo
          que más sale en sus fichas. Cuando la pieza lleva la fila de datos,
          sube para dejarle sitio. */}
      <div
        className="absolute inset-x-[2%]"
        style={{ bottom: compacta ? "14%" : "24%" }}
      >
        <div className="relative">
          <Silueta
            tipo={vehiculo?.carroceria}
            className="silueta-maciza w-full text-[oklch(70%_0.012_263)]"
          />
          <div className="sombra-piso absolute inset-x-[8%] bottom-[2%] h-[6%]" />
        </div>
      </div>

      <div className="textura absolute inset-0 opacity-30" />

      {!compacta && (
        <>
          {/* La etiqueta del modelo: caja blanca y banda azul cortada. */}
          <div className="absolute left-0 flex items-stretch" style={{ top: "8cqw" }}>
            <p
              className="rotulo-post"
              style={{ fontSize: "6cqw", padding: "2.2cqw 3cqw 2.2cqw 5cqw" }}
            >
              {vehiculo?.modelo}
            </p>
            <span
              className="block bg-azul"
              style={{
                width: "5cqw",
                clipPath: "polygon(0 0, 100% 0, 45% 100%, 0 100%)",
              }}
            />
          </div>

          {/* Su recuadro, abajo a la derecha, encima de las cajas. */}
          <div className="absolute" style={{ right: "4cqw", bottom: "24.5cqw", width: "22cqw" }}>
            <MarcaCoronado detalle={false} className="block h-auto w-full shadow-lg" />
          </div>

          {/* El filete amarillo y la fila de cajas. */}
          <div className="absolute inset-x-0" style={{ bottom: "8.5cqw", padding: "0 3cqw" }}>
            <div className="bg-lima" style={{ height: "0.9cqw", marginBottom: "1.4cqw" }} />
            <div className="flex items-stretch" style={{ gap: "1.2cqw" }}>
              <Caja etiqueta="Año" valor={vehiculo?.anio} azul ancho="19%" />
              <Caja etiqueta="Modelo" valor={modelo} ancho="27%" />
              <Caja etiqueta="Kilometraje" valor={km} ancho="27%" />
              <Caja etiqueta="Transmisión" valor={caja} ancho="27%" />
            </div>
          </div>

          {/* La pastilla del pie, con su usuario y su teléfono. */}
          <div className="absolute inset-x-0 flex justify-end" style={{ bottom: "2.4cqw", padding: "0 4cqw" }}>
            <span
              className="pastilla cifra"
              style={{ fontSize: "2.5cqw", padding: "0.9cqw 3cqw", gap: "1.5cqw" }}
            >
              <span>@CoronadoCarss</span>
              <span>{config.business.whatsappVisible}</span>
            </span>
          </div>
        </>
      )}
    </div>
  );
}

/** Una de las cajas del pie. La del año, azul y con el lado cortado. */
function Caja({ etiqueta, valor, azul = false, ancho }) {
  return (
    <span
      className={`tarjeta-dato min-w-0 ${azul ? "tarjeta-dato-azul faceta" : ""}`}
      style={{
        width: ancho,
        padding: azul ? "1.4cqw 3cqw 1.4cqw 1.2cqw" : "1.4cqw 1cqw",
        gap: "0.5cqw",
        boxShadow: "none",
        "--bisel-cc": "2.6cqw",
      }}
    >
      <span className="tarjeta-dato-etiqueta" style={{ fontSize: "2.5cqw" }}>
        {etiqueta}
      </span>
      <span
        className="tarjeta-dato-valor max-w-full truncate"
        style={{ fontSize: azul ? "3.6cqw" : "3.1cqw" }}
      >
        {valor || "—"}
      </span>
    </span>
  );
}

/** 188000 → "188.000", como lo escriben ellos. Vacío si no está declarado. */
function kilometrajeCorto(km) {
  if (km === null || km === undefined || km === "" || !Number.isFinite(Number(km))) {
    return "";
  }
  return new Intl.NumberFormat("es-VE").format(Number(km));
}

/** "Sincrónica" → "Sincrónico": ellos dicen el cambio, no la transmisión. */
function transmisionLarga(transmision) {
  if (!transmision) return "";
  const t = String(transmision).toLowerCase();
  if (t.startsWith("auto")) return "Automático";
  if (t.startsWith("sinc") || t.startsWith("manu")) return "Sincrónico";
  return transmision;
}
