// Formatos de dinero, distancia y fecha que usa toda la página.
//
// Todo está en dólares, que es como se negocia un vehículo y como DSS escribe
// sus cuotas ("DESDE 75$ SEMANALES"). El equivalente en bolívares se calcula
// con la tasa del BCV del día (libs/bcv.js) y se enseña debajo, más pequeño:
// orienta sin competir con la cifra que de verdad importa.
//
// Y aquí la cifra que de verdad importa es LA CUOTA, no el precio: ver
// `enCuota` al final del archivo y el comentario de libs/catalogo.js.

// `narrowSymbol` y no el formato por defecto: en es-VE, `style: "currency"` con
// USD escribe "USD 6.500", y aquí un precio se escribe "$6.500". Es lo que
// pone el cliente en sus publicaciones y lo que espera leer cualquiera que
// entre.
const DOLAR = new Intl.NumberFormat("es-VE", {
  style: "currency",
  currency: "USD",
  currencyDisplay: "narrowSymbol",
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
 * Tres casos, y los tres importan en este catálogo: el 0 km, el usado con su
 * cifra, y el que la publicación no declara —que no es cero, es desconocido, y
 * decir "0 km" ahí sería mentir—.
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

/**
 * La cuota, escrita como la escribe DSS.
 *
 * Sus piezas dicen "DESDE 75 SEMANALES" y "DESDE 65$ MENSUAL": el número
 * grande, el periodo al lado y sin decimales nunca. Aquí se parte en dos
 * piezas —cifra y periodo— para que la interfaz pueda darles tamaños distintos,
 * que es lo que hacen ellos.
 *
 * Los céntimos se van a propósito: una cuota de "$74,83" no existe en una
 * oficina de crédito, se redondea al hablar. Ver `cuotaDe` en libs/catalogo.
 */
export function enCuota(cuota) {
  if (!cuota || !Number.isFinite(Number(cuota.monto))) {
    return { cifra: "—", periodo: "", texto: "—" };
  }

  const cifra = enDolares(cuota.monto);
  const periodo = cuota.etiqueta || "";

  return {
    cifra,
    periodo,
    // Para los sitios donde solo cabe una línea: el mensaje de WhatsApp, el
    // título de una ficha, el texto alternativo de una imagen.
    texto: periodo ? `${cifra} ${periodo}` : cifra,
  };
}

/** "75 semanales durante 2 años, con 50% de inicial", para la letra pequeña. */
export function condicionesDe(cuota) {
  if (!cuota) return "";
  const anios = Math.round((cuota.plazoMeses / 12) * 10) / 10;
  const plazo = anios === 1 ? "1 año" : `${anios} años`;
  return `${enDolares(cuota.monto)} ${cuota.etiqueta} · hasta ${plazo} · ${cuota.inicialPct}% de inicial`;
}
