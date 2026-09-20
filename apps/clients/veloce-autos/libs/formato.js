// Formatos de dinero, distancia y fecha que usa toda la página.
//
// Los precios del inventario están en dólares, que es como se negocia un
// vehículo en Venezuela. El equivalente en bolívares se calcula con la tasa
// del BCV del día (libs/bcv.js) y se enseña debajo, más pequeño: orienta sin
// competir con la cifra que de verdad importa.

const DOLAR = new Intl.NumberFormat("es-VE", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const MILES = new Intl.NumberFormat("es-VE", { maximumFractionDigits: 0 });

export function enDolares(valor) {
  if (valor === null || valor === undefined || Number.isNaN(Number(valor))) return "—";
  return DOLAR.format(Number(valor));
}

export function enBolivares(valor) {
  if (valor === null || valor === undefined || Number.isNaN(Number(valor))) return "—";
  return `Bs. ${MILES.format(Number(valor))}`;
}

/** Convierte dólares a bolívares con la tasa dada. Sin tasa, null. */
export function aBolivares(dolares, tasa) {
  if (!tasa || dolares === null || dolares === undefined) return null;
  return Number(dolares) * Number(tasa);
}

/** 96000 → "96.000 km". Lo primero que mira todo comprador. */
export function enKilometros(valor) {
  if (valor === null || valor === undefined || Number.isNaN(Number(valor))) return "—";
  return `${MILES.format(Number(valor))} km`;
}

export function fechaCorta(valor) {
  if (!valor) return "—";
  return new Date(valor).toLocaleDateString("es-VE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/**
 * El kilometraje tal como hay que leerlo en la tarjeta.
 *
 * Tres casos, y los tres importan en este catálogo: el 0 km importado, el
 * usado con su cifra, y el que el catálogo no declara —que no es cero, es
 * desconocido, y decir "0 km" ahí sería mentir—.
 */
export function kilometrajeDe(vehiculo) {
  if (vehiculo?.condicion === "nuevo") return "0 km";

  // Ojo con el null: `Number(null)` es 0, no NaN, así que comprobarlo solo con
  // `Number.isFinite` daba por bueno el kilometraje desconocido y acababa
  // enseñando un guion donde tenía que decir que falta el dato.
  const km = vehiculo?.km;
  if (km === null || km === undefined || km === "") return "Km por confirmar";
  if (!Number.isFinite(Number(km))) return "Km por confirmar";

  return enKilometros(km);
}
