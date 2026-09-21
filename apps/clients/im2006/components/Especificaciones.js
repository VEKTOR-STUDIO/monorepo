import { kilometrajeDe } from "@/libs/formato";

/**
 * La hoja de datos de la unidad: cuatro cifras en fila, separadas por líneas
 * finas. Es lo primero que mira quien compra y lo primero que pregunta quien
 * escribe, así que va antes que cualquier texto de venta.
 *
 * LAS CUATRO CASILLAS CAMBIAN SEGÚN EL SEGMENTO, y no por elegancia: a quien
 * mira un chasis de quince toneladas el kilometraje no le dice nada y la
 * capacidad de carga se lo dice todo. Enseñar "0 km" en las dos es enseñar la
 * casilla equivocada a la mitad del catálogo.
 *
 * La retícula y los separadores están en globals.css (.specs).
 */
export default function Especificaciones({ vehiculo, className = "" }) {
  const datos = vehiculo.esCamion
    ? [
        { etiqueta: "Capacidad", valor: vehiculo.capacidad || "Por confirmar" },
        { etiqueta: "Año", valor: vehiculo.anio },
        { etiqueta: "Motor", valor: vehiculo.motor },
        { etiqueta: "Condición", valor: vehiculo.esNuevo ? "0 km" : "Usado" },
      ]
    : [
        { etiqueta: "Condición", valor: vehiculo.esNuevo ? "0 km" : "Usado" },
        { etiqueta: "Año", valor: vehiculo.anio },
        { etiqueta: "Kilometraje", valor: kilometrajeDe(vehiculo) },
        { etiqueta: "Motor", valor: vehiculo.motor },
      ];

  return (
    <dl className={`specs ${className}`}>
      {datos.map((dato) => (
        <div key={dato.etiqueta}>
          <dt className="text-[0.7rem] uppercase tracking-wider text-base-content/40">
            {dato.etiqueta}
          </dt>
          <dd className="cifra mt-1.5 text-lg font-semibold text-base-content">{dato.valor}</dd>
        </div>
      ))}
    </dl>
  );
}

/** La lista larga, para la ficha de la unidad. */
export function EspecificacionesCompletas({ vehiculo, className = "" }) {
  // Las filas sin dato se caen solas (el `.filter` del final). Eso no es un
  // descuido: sus publicaciones no declaran color, puestos ni tracción, y
  // rellenarlos a ojo sería meter datos falsos en el inventario de un cliente.
  // En cuanto los carguen, las filas aparecen sin tocar nada.
  const datos = [
    { etiqueta: "Segmento", valor: vehiculo.segmentoInfo?.nombre },
    { etiqueta: "Condición", valor: vehiculo.condicionInfo?.nombre },
    { etiqueta: "Marca", valor: vehiculo.marca },
    {
      etiqueta: "Modelo",
      valor: [vehiculo.modelo, vehiculo.version].filter(Boolean).join(" "),
    },
    { etiqueta: "Año", valor: vehiculo.anio },
    { etiqueta: "Capacidad de carga", valor: vehiculo.capacidad },
    { etiqueta: "Kilometraje", valor: vehiculo.esCamion ? null : kilometrajeDe(vehiculo) },
    { etiqueta: "Motor", valor: vehiculo.motor },
    { etiqueta: "Transmisión", valor: vehiculo.transmision },
    { etiqueta: "Tracción", valor: vehiculo.traccion },
    { etiqueta: "Combustible", valor: vehiculo.combustible },
    { etiqueta: "Puestos", valor: vehiculo.puestos },
    { etiqueta: "Color", valor: vehiculo.color },
    { etiqueta: "Financiamiento", valor: vehiculo.financiado ? "Disponible" : null },
    { etiqueta: "Documentos", valor: vehiculo.documentos },
    { etiqueta: "Ubicación", valor: vehiculo.ubicacion },
  ].filter((d) => d.valor);

  return (
    <dl className={`divide-y divide-base-content/10 ${className}`}>
      {datos.map((dato) => (
        <div key={dato.etiqueta} className="flex items-baseline justify-between gap-6 py-3.5">
          <dt className="text-sm text-base-content/45">{dato.etiqueta}</dt>
          <dd className="text-right text-sm font-medium text-base-content">{dato.valor}</dd>
        </div>
      ))}
    </dl>
  );
}
