import { kilometrajeDe, enDolares } from "@/libs/formato";

/**
 * La hoja de datos de la unidad: cuatro casillas en fila, separadas por líneas
 * finas.
 *
 * LAS DOS PRIMERAS SON DEL CRÉDITO —la inicial y el plazo— y no de la mecánica.
 * En un concesionario la primera pregunta es el kilometraje; en una
 * financiadora es "¿cuánto pongo y en cuánto tiempo lo pago?". Poner el motor
 * antes que la inicial sería contestar una pregunta que nadie ha hecho todavía.
 *
 * La cuota no está aquí a propósito: ya va grande justo encima, y repetirla en
 * la tabla le quita fuerza a las dos.
 *
 * La retícula y los separadores están en globals.css (.specs).
 */
export default function Especificaciones({ vehiculo, className = "" }) {
  const anios = Math.round((vehiculo.cuota.plazoMeses / 12) * 10) / 10;

  const datos = [
    { etiqueta: "Inicial", valor: enDolares(vehiculo.inicial) },
    { etiqueta: "Plazo", valor: anios === 1 ? "1 año" : `${anios} años` },
    { etiqueta: "Condición", valor: vehiculo.esNuevo ? "0 km" : "Usado" },
    { etiqueta: "Año", valor: vehiculo.anio },
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
  const anios = Math.round((vehiculo.cuota.plazoMeses / 12) * 10) / 10;

  const datos = [
    // El crédito primero, por lo mismo que arriba.
    { etiqueta: "Cuota", valor: `${enDolares(vehiculo.cuota.monto)} ${vehiculo.cuota.etiqueta}` },
    { etiqueta: "Inicial", valor: `${enDolares(vehiculo.inicial)} (${vehiculo.cuota.inicialPct} %)` },
    { etiqueta: "Plazo máximo", valor: anios === 1 ? "1 año" : `${anios} años` },
    { etiqueta: "Precio de contado", valor: enDolares(vehiculo.precio) },

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
    { etiqueta: "Tipo", valor: vehiculo.segmentoInfo?.singular },
    { etiqueta: "Carrocería", valor: vehiculo.tipo?.singular },
    { etiqueta: "Documentos", valor: vehiculo.documentos },
    { etiqueta: "Dónde se ve", valor: vehiculo.ubicacion },
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
