// -----------------------------------------------------------------------------
// Tasa oficial del BCV (bolívares por dólar).
//
// Dos de las tres formas de pago del catálogo se cobran en bolívares a la tasa
// del día, así que la tienda necesita ese número fresco.
//
// Se pide a una API en el momento en que hace falta. No hay cron ni tabla: el
// caché de fetch de Next guarda la respuesta una hora y la comparte entre todas
// las visitas, así que una tienda con mil visitas hace una consulta por hora,
// no mil. Si la API falla, se prueba la siguiente; si fallan todas, la tienda
// enseña los precios en dólares y dice que el monto en bolívares se confirma al
// cerrar el pedido.
// -----------------------------------------------------------------------------

// Cuánto se reutiliza la misma lectura, en segundos. El BCV publica una vez al
// día, así que una hora va sobrada y deja margen por si corrigen.
const SEGUNDOS_DE_CACHE = 3600;

// En orden de preferencia. Todas sirven el dato del BCV en JSON y con
// certificado válido (la web del propio BCV lo sirve sin el intermedio, que era
// justo lo que obligaba antes a bajarla a mano).
const FUENTES = [
  {
    nombre: "dolarapi",
    url: "https://ve.dolarapi.com/v1/dolares/oficial",
    leer: (json) => ({
      valor: Number(json?.promedio),
      fechaValor: String(json?.fechaActualizacion || "").slice(0, 10),
    }),
  },
  {
    nombre: "bcv.today",
    url: "https://bcv.today/api/v1/rate.json",
    leer: (json) => ({
      valor: Number(json?.USD),
      fechaValor: String(json?.effective_date || "").slice(0, 10),
    }),
  },
];

const HOY = () => new Date().toISOString().slice(0, 10);

async function consultar(fuente) {
  const respuesta = await fetch(fuente.url, {
    headers: { Accept: "application/json" },
    signal: AbortSignal.timeout(8000),
    // Aquí está el ahorro: Next guarda la respuesta y la reparte.
    next: { revalidate: SEGUNDOS_DE_CACHE, tags: ["tasa-bcv"] },
  });

  if (!respuesta.ok) throw new Error(`${fuente.nombre} respondió ${respuesta.status}`);

  const { valor, fechaValor } = fuente.leer(await respuesta.json());

  // Una tasa es un número positivo y, en Venezuela, de un orden concreto. Si
  // llega algo raro es mejor pasar a la siguiente fuente que pintar un disparate
  // en todos los precios de la tienda.
  if (!Number.isFinite(valor) || valor <= 0 || valor > 1_000_000) {
    throw new Error(`${fuente.nombre} devolvió una cifra que no cuadra: ${valor}`);
  }

  return {
    valor,
    fechaValor: /^\d{4}-\d{2}-\d{2}$/.test(fechaValor) ? fechaValor : HOY(),
    fuente: fuente.nombre,
  };
}

/**
 * La tasa que usa la tienda.
 *
 * @returns {Promise<{valor:number, fechaValor:string, fuente:string}|null>}
 *   null si ninguna fuente respondió. Quien la use debe contemplarlo: sin tasa
 *   se enseñan solo los precios en dólares.
 */
export async function obtenerTasa() {
  const fallos = [];

  for (const fuente of FUENTES) {
    try {
      return await consultar(fuente);
    } catch (error) {
      fallos.push(`${fuente.nombre}: ${error.message}`);
    }
  }

  console.error("[bcv] ninguna fuente respondió:", fallos.join(" · "));
  return null;
}

/**
 * Igual que obtenerTasa, pero contando qué pasó. La usa el panel, que sí quiere
 * enseñar el detalle de los fallos.
 */
export async function obtenerTasaConDetalle() {
  const fallos = [];

  for (const fuente of FUENTES) {
    try {
      const tasa = await consultar(fuente);
      return { ...tasa, fallos };
    } catch (error) {
      fallos.push(`${fuente.nombre}: ${error.message}`);
    }
  }

  return null;
}

export const FUENTES_DE_TASA = FUENTES.map((f) => ({ nombre: f.nombre, url: f.url }));
export const CACHE_TASA_SEGUNDOS = SEGUNDOS_DE_CACHE;
