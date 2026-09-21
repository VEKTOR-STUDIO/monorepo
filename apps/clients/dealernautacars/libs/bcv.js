// -----------------------------------------------------------------------------
// Tasa oficial del BCV (bolívares por dólar).
//
// Los precios se negocian en dólares, pero buena parte de los pagos se hacen en
// bolívares a la tasa del día, así que la página necesita ese número fresco
// para enseñar el equivalente debajo de cada precio.
//
// Se pide a una API en el momento en que hace falta. No hay cron ni tabla: el
// caché de fetch de Next guarda la respuesta una hora y la comparte entre todas
// las visitas, así que una página con mil visitas hace una consulta por hora,
// no mil. Si la API falla, se prueba la siguiente; si fallan todas, la página
// enseña los precios en dólares y no pinta el equivalente, que es un extra y
// nunca debe tumbar la página.
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

// Memoria del proceso, por encima del caché de fetch de Next.
//
// Hace falta porque al construir el sitio se genera una ficha por unidad y
// todas piden la tasa: sin esto, cada worker sale a la red por cada página, la
// API acaba cortando y la build se cae por tiempo de espera. Con la memoria,
// cada proceso consulta una vez y reparte el resultado.
let recordado = null; // { tasa, momento }
let enCurso = null; // promesa compartida mientras se consulta
const MEMORIA_FALLO_MS = 60_000;

async function consultar(fuente) {
  const respuesta = await fetch(fuente.url, {
    headers: { Accept: "application/json" },
    // Corto a propósito: si una fuente tarda, se pasa a la siguiente antes de
    // que el generador de páginas pierda la paciencia.
    signal: AbortSignal.timeout(5000),
    // Aquí está el ahorro entre peticiones: Next guarda la respuesta.
    next: { revalidate: SEGUNDOS_DE_CACHE, tags: ["tasa-bcv"] },
  });

  if (!respuesta.ok) throw new Error(`${fuente.nombre} respondió ${respuesta.status}`);

  const { valor, fechaValor } = fuente.leer(await respuesta.json());

  // Una tasa es un número positivo y, en Venezuela, de un orden concreto. Si
  // llega algo raro es mejor pasar a la siguiente fuente que pintar un disparate
  // en todos los precios.
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
 * La tasa que usa la página.
 *
 * @returns {Promise<{valor:number, fechaValor:string, fuente:string}|null>}
 *   null si ninguna fuente respondió. Quien la use debe contemplarlo: sin tasa
 *   se enseñan solo los precios en dólares.
 */
export async function obtenerTasa() {
  const ahora = Date.now();

  // ¿Ya la tenemos en este proceso y sigue fresca? Los fallos también se
  // recuerdan, un minuto, para no insistir contra una API caída.
  if (recordado) {
    const vida = recordado.tasa ? SEGUNDOS_DE_CACHE * 1000 : MEMORIA_FALLO_MS;
    if (ahora - recordado.momento < vida) return recordado.tasa;
  }

  // Si otra página ya está preguntando, esperamos a esa misma respuesta en
  // vez de abrir una consulta nueva.
  if (enCurso) return enCurso;

  enCurso = (async () => {
    const detalle = await obtenerTasaConDetalle();
    if (!detalle) console.error("[bcv] ninguna fuente respondió");

    recordado = {
      tasa: detalle
        ? { valor: detalle.valor, fechaValor: detalle.fechaValor, fuente: detalle.fuente }
        : null,
      momento: Date.now(),
    };
    enCurso = null;
    return recordado.tasa;
  })();

  return enCurso;
}

/**
 * Tira la memoria del proceso.
 *
 * La usa el botón "actualizar ahora" del panel: sin esto, invalidar el caché
 * de Next no serviría de nada porque esta memoria seguiría devolviendo la
 * cifra vieja.
 */
export function olvidarTasa() {
  recordado = null;
  enCurso = null;
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
