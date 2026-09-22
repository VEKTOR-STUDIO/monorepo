// Formatos de dinero, distancia y fecha que usa toda la página.
//
// Lone Star compra y cobra en Estados Unidos, y lo escribe como allá: "$16,000"
// y "1,186 MI", con la coma de los miles. Así se leen en sus piezas y así se
// leen aquí; cambiar a "16.000" en la web haría que el mismo precio pareciera
// otro según dónde se mire.
//
// No hay equivalente en bolívares ni en pesos: todos los pagos son en USD, y lo
// dicen ellos mismos en su pieza de métodos de pago.

const DOLAR = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const MILES = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });

const KM_POR_MILLA = 1.609344;

export function enDolares(valor) {
  if (valor === null || valor === undefined || Number.isNaN(Number(valor))) return "—";
  return DOLAR.format(Number(valor));
}

/** 1186 → "1,186 mi". Lo primero que mira quien puja. */
export function enMillas(valor) {
  if (valor === null || valor === undefined || Number.isNaN(Number(valor))) return "—";
  return `${MILES.format(Number(valor))} mi`;
}

/**
 * 1186 → "1,909 km". El comprador de Caracas o de Bogotá piensa en
 * kilómetros, así que la equivalencia va al lado, más pequeña.
 */
export function enKilometrosDesdeMillas(millas) {
  if (millas === null || millas === undefined || !Number.isFinite(Number(millas))) return "";
  return `${MILES.format(Math.round(Number(millas) * KM_POR_MILLA))} km`;
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
 * El millaje tal como hay que leerlo en la tarjeta.
 *
 * Tres casos: el lote con su cifra, el lote que no la declara —que no es cero,
 * es desconocido— y el modelo a pedido, que no tiene millaje porque todavía no
 * es un carro concreto.
 */
export function millajeDe(vehiculo) {
  if (!vehiculo?.enSubasta) return "Se busca a tu medida";

  // Ojo con el null: `Number(null)` es 0, no NaN, así que comprobarlo solo con
  // `Number.isFinite` daba por bueno el millaje desconocido.
  const millas = vehiculo?.millas;
  if (millas === null || millas === undefined || millas === "") return "Millaje por confirmar";
  if (!Number.isFinite(Number(millas))) return "Millaje por confirmar";

  return enMillas(millas);
}
