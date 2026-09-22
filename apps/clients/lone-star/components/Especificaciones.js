import { millajeDe, enKilometrosDesdeMillas } from "@/libs/formato";

/**
 * La hoja de datos: cuatro cifras en fila, separadas por líneas finas. Es lo
 * primero que mira quien puja y lo primero que pregunta quien escribe, así que
 * va antes que cualquier texto de venta.
 *
 * En un lote de subasta las cuatro son las de su pieza de la Tacoma: millaje,
 * daño primario, condición y motor. En un modelo a pedido no hay ni millas ni
 * daño —todavía no es un carro concreto—, así que ahí va lo que sí se sabe.
 *
 * La retícula y los separadores están en globals.css (.specs).
 */
export default function Especificaciones({ vehiculo, className = "" }) {
  const datos = vehiculo.enSubasta
    ? [
        { etiqueta: "Millaje", valor: millajeDe(vehiculo) },
        { etiqueta: "Daño primario", valor: vehiculo.danio || "—" },
        { etiqueta: "Condición", valor: vehiculo.condicionInfo?.nombre || "—" },
        { etiqueta: "Motor", valor: vehiculo.motor || "—" },
      ]
    : [
        { etiqueta: "Años", valor: vehiculo.anioTexto || "A elegir" },
        { etiqueta: "Tipo", valor: vehiculo.tipo?.singular },
        { etiqueta: "Motor", valor: vehiculo.motor || "A elegir" },
        { etiqueta: "Entrega", valor: "En tu país" },
      ];

  return (
    <dl className={`specs ${className}`}>
      {datos.map((dato) => (
        <div key={dato.etiqueta} className="min-w-0">
          <dt className="text-[0.7rem] uppercase tracking-wider text-base-content/40">
            {dato.etiqueta}
          </dt>
          <dd className="cifra mt-1.5 text-base leading-snug font-semibold text-base-content">
            {dato.valor}
          </dd>
        </div>
      ))}
    </dl>
  );
}

/** La lista larga, para la ficha. Lo que no se sabe no se escribe. */
export function EspecificacionesCompletas({ vehiculo, className = "" }) {
  const km = enKilometrosDesdeMillas(vehiculo.millas);

  const datos = [
    { etiqueta: "Estado", valor: vehiculo.segmentoInfo?.nombre },
    { etiqueta: "Marca", valor: vehiculo.marca },
    {
      etiqueta: "Modelo",
      valor: [vehiculo.modelo, vehiculo.version].filter(Boolean).join(" "),
    },
    { etiqueta: vehiculo.anio ? "Año" : "Años", valor: vehiculo.anioTexto },
    vehiculo.enSubasta && {
      etiqueta: "Millaje",
      valor: km ? `${millajeDe(vehiculo)} · ${km}` : millajeDe(vehiculo),
    },
    { etiqueta: "Daño primario", valor: vehiculo.danioTexto },
    { etiqueta: "Condición", valor: vehiculo.condicionInfo?.nombre },
    { etiqueta: "Motor", valor: vehiculo.motor },
    { etiqueta: "Transmisión", valor: vehiculo.transmision },
    { etiqueta: "Tracción", valor: vehiculo.traccion },
    { etiqueta: "Combustible", valor: vehiculo.combustible },
    { etiqueta: "Color", valor: vehiculo.color },
    { etiqueta: "Carrocería", valor: vehiculo.tipo?.singular },
    { etiqueta: "Patio de la subasta", valor: vehiculo.ubicacion },
  ].filter((d) => d && d.valor);

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
