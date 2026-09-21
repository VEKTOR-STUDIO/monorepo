import { kilometrajeDe } from "@/libs/formato";

/**
 * La hoja de datos del vehículo: cuatro cifras en fila, separadas por líneas
 * finas. Es lo primero que mira quien compra y lo primero que pregunta quien
 * escribe, así que va antes que cualquier texto de venta.
 *
 * La primera casilla es el AÑO: aquí todo es usado, así que lo que de verdad
 * separa una unidad de otra es de cuándo es y cuánto ha rodado. La transmisión
 * va la tercera porque en Caracas es la pregunta que sigue.
 *
 * La retícula y los separadores están en globals.css (.specs).
 */
export default function Especificaciones({ vehiculo, className = "" }) {
  const datos = [
    { etiqueta: "Año", valor: vehiculo.anio },
    { etiqueta: "Kilometraje", valor: kilometrajeDe(vehiculo) },
    { etiqueta: "Transmisión", valor: vehiculo.transmision },
    { etiqueta: "Motor", valor: vehiculo.motor },
  ];

  return (
    <dl className={`specs ${className}`}>
      {datos.map((dato) => (
        <div key={dato.etiqueta}>
          <dt className="text-[0.7rem] uppercase tracking-wider text-base-content/55">
            {dato.etiqueta}
          </dt>
          <dd className="cifra mt-1.5 text-base font-semibold text-base-content">{dato.valor}</dd>
        </div>
      ))}
    </dl>
  );
}

/** La lista larga, para la ficha del vehículo. */
export function EspecificacionesCompletas({ vehiculo, className = "" }) {
  const datos = [
    { etiqueta: "Condición", valor: vehiculo.condicionInfo?.nombre },
    { etiqueta: "Marca", valor: vehiculo.marca },
    {
      etiqueta: "Modelo",
      valor: [vehiculo.modelo, vehiculo.version].filter(Boolean).join(" "),
    },
    { etiqueta: "Año", valor: vehiculo.anio },
    { etiqueta: "Kilometraje", valor: kilometrajeDe(vehiculo) },
    { etiqueta: "Motor", valor: vehiculo.motor },
    { etiqueta: "Transmisión", valor: vehiculo.transmision },
    { etiqueta: "Tracción", valor: vehiculo.traccion },
    { etiqueta: "Combustible", valor: vehiculo.combustible },
    { etiqueta: "Puestos", valor: vehiculo.puestos },
    { etiqueta: "Color", valor: vehiculo.color },
    { etiqueta: "Carrocería", valor: vehiculo.tipo?.singular },
    { etiqueta: "Documentos", valor: vehiculo.documentos },
    { etiqueta: "Ubicación", valor: vehiculo.ubicacion },
  ].filter((d) => d.valor);

  return (
    <dl className={`divide-y divide-base-content/10 ${className}`}>
      {datos.map((dato) => (
        <div key={dato.etiqueta} className="flex items-baseline justify-between gap-6 py-3.5">
          <dt className="text-sm text-base-content/55">{dato.etiqueta}</dt>
          <dd className="text-right text-sm font-medium text-base-content">{dato.valor}</dd>
        </div>
      ))}
    </dl>
  );
}
