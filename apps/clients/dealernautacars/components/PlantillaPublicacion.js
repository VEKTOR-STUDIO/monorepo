import Silueta from "@/components/Silueta";

// -----------------------------------------------------------------------------
// La plantilla de sus publicaciones, dibujada.
//
// Ninguna unidad de este inventario tiene foto: Instagram devuelve un muro de
// acceso y no deja descargar ni una imagen de @dealernautacars. Así que en vez
// de dejar trece rectángulos negros —o, peor, de meter fotos de banco de
// imágenes haciéndolas pasar por suyas—, cada ficha se dibuja con la misma
// receta con la que ellos maquetan sus posts:
//
//   cielo naranja  →  la ciudad recortada  →  asfalto  →  el vehículo encima,
//   el modelo en condensada arriba a la izquierda, el emblema arriba a la
//   derecha y la pastilla naranja con el año y el kilometraje abajo.
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
      {/* El cielo, a plena potencia: aquí no hay texto encima que proteger, la
          pieza ES el cielo. */}
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

      {/* El vehículo. Se apoya justo sobre el filo del asfalto y se sale un
          pelo por los lados, como en sus piezas: el dibujo es muy apaisado y
          dentro de una tarjeta 4:5 quedaba diminuto, con medio cartel de cielo
          vacío encima. */}
      <div className="absolute inset-x-[-3%] bottom-[18%]">
        <div className="relative">
          <Silueta
            tipo={vehiculo?.carroceria}
            className="w-full text-base-content/85"
          />
          {/* La sombra va debajo de las ruedas, no del dibujo entero. */}
          <div className="sombra-piso absolute inset-x-[8%] bottom-[2%] h-[6%]" />
        </div>
      </div>

      {/* El grano, que es lo que evita que el degradado se vea plano. */}
      <div className="textura absolute inset-0" />

      {!compacta && (
        <>
          {/* El modelo, arriba a la izquierda, como en sus piezas. */}
          <div
            className="absolute left-0 top-0"
            style={{ padding: "6cqw", maxWidth: "76%" }}
          >
            <p
              className="display text-base-content"
              style={{ fontSize: "8.5cqw", lineHeight: 0.88 }}
            >
              {vehiculo?.marca}{" "}
              <span className="text-primary">{vehiculo?.modelo}</span>
            </p>
            {vehiculo?.version && (
              <p
                className="display-recto mt-[2cqw] text-base-content/60"
                style={{ fontSize: "3.4cqw", letterSpacing: "0.1em" }}
              >
                {vehiculo.version}
              </p>
            )}
          </div>

          {/* La pastilla del pie: año y kilometraje, que es lo que ellos
              ponen. */}
          <div
            className="absolute inset-x-0 bottom-0 flex justify-center"
            style={{ padding: "5cqw" }}
          >
            <span
              className="pastilla cifra"
              style={{
                fontSize: "3.6cqw",
                padding: "1.8cqw 5cqw",
                gap: "3cqw",
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
