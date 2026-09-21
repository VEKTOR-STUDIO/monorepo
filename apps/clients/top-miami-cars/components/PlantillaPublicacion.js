import Silueta from "@/components/Silueta";
import { Escudo } from "@/components/MarcaTopMiami";

// -----------------------------------------------------------------------------
// La pieza de Top Miami Cars, dibujada.
//
// Ninguna unidad de este inventario tiene foto: de ellos solo hay el logotipo y
// la ficha de Google. Así que en vez de dejar una docena de rectángulos grises
// —o, peor, de meter fotos de banco de imágenes haciéndolas pasar por suyas—,
// cada ficha se dibuja con las piezas de su propio logotipo, montadas como una
// publicación:
//
//   el salón blanco  →  su escudo de acero detrás  →  el piso pulido  →  la
//   unidad encima, el modelo arriba a la izquierda con el filete y la sombra
//   de sus letras, y la pastilla azul con el año y el kilometraje abajo.
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
  const anio = vehiculo?.anio;
  const km = vehiculo?.condicion === "nuevo" ? "0 km" : kilometrajeCorto(vehiculo?.km);

  return (
    <div
      className="absolute inset-0 overflow-hidden"
      style={{ containerType: "inline-size" }}
      aria-hidden="true"
    >
      {/* El salón ya lo pinta el contenedor (`.estudio`, en FotoVehiculo). */}

      {/* Su escudo, detrás de la unidad y un poco más alto que ella, como en
          el logotipo: el carro lo cruza, no lo tapa. */}
      <div className="absolute inset-x-[19%] top-[7%] opacity-55">
        <Escudo className="w-full" biseles={!compacta} />
      </div>

      {/* El cepillado del acero, muy tenue, para que el blanco no sea plano. */}
      <div className="textura absolute inset-0" />

      {/* El piso pulido donde se posa. */}
      <div className="piso absolute inset-x-0 bottom-0 h-[27%]" />

      {/* La unidad. Se apoya justo sobre la línea del piso y se sale un pelo
          por los lados: el dibujo es muy apaisado y dentro de una tarjeta 4:5
          quedaba diminuto, con medio cartel vacío encima. */}
      <div className="absolute inset-x-[-2%] bottom-[15%]">
        <div className="relative">
          {/* La sombra va debajo de las ruedas, no del dibujo entero, y ANTES
              que la silueta para que quede por detrás. */}
          <div className="sombra-piso absolute inset-x-[8%] bottom-[1%] h-[7%]" />
          <Silueta tipo={vehiculo?.carroceria} className="relative w-full text-primary" />
        </div>
      </div>

      {!compacta && (
        <>
          {/* El modelo, arriba a la izquierda, con los dos tratamientos de su
              rótulo: la marca como "TOP MIAMI" —blanco con filete— y el modelo
              como "CARS" —azul con filete blanco—. */}
          <div
            className="absolute left-0 top-0"
            style={{ padding: "6cqw", maxWidth: "82%" }}
          >
            <p className="display" style={{ fontSize: "6.6cqw", lineHeight: 1.12 }}>
              <span className="rotulo-marca">{vehiculo?.marca}</span>{" "}
              <span className="rotulo-marca-inverso">{vehiculo?.modelo}</span>
            </p>
            {vehiculo?.version && (
              <p
                className="display-recto text-base-content/60"
                style={{ fontSize: "2.9cqw", marginTop: "2.2cqw", letterSpacing: "0.12em" }}
              >
                {vehiculo.version}
              </p>
            )}
          </div>

          {/* La pastilla del pie: año y kilometraje. */}
          <div
            className="absolute inset-x-0 bottom-0 flex justify-center"
            style={{ padding: "4.6cqw" }}
          >
            <span
              className="pastilla cifra"
              style={{
                fontSize: "3.4cqw",
                padding: "1.6cqw 4.6cqw",
                gap: "2.6cqw",
              }}
            >
              {anio && <span>Año {anio}</span>}
              {anio && km && <span style={{ opacity: 0.55 }}>·</span>}
              {km && <span>{km}</span>}
            </span>
          </div>
        </>
      )}
    </div>
  );
}

/** 48000 → "48.000 km". Vacío cuando el dato no está declarado. */
function kilometrajeCorto(km) {
  if (km === null || km === undefined || km === "" || !Number.isFinite(Number(km))) {
    return "";
  }
  return `${new Intl.NumberFormat("es-VE").format(Number(km))} km`;
}
