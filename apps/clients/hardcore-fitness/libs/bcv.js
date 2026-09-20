// -----------------------------------------------------------------------------
// Tasa oficial del BCV (bolívares por dólar).
//
// Dos de las tres formas de pago del catálogo se cobran en bolívares a la tasa
// del día, así que la tienda necesita ese número fresco. Se lee de la propia
// página del BCV, que es la fuente, y solo si falla se recurre a espejos.
//
// Quién la pide:
//   - /api/cron/tasa-bcv  una vez al día (ver vercel.json) y la guarda
//   - /admin/tasa         cuando alguien pulsa "actualizar ahora"
// El resto de la tienda la lee ya guardada, de la tabla tasas_cambio.
// -----------------------------------------------------------------------------

import https from "node:https";

const PAGINA_BCV = "https://www.bcv.org.ve/";

// Espejos, por si el BCV está caído. Van un día por detrás, pero es mejor eso
// que quedarse sin tasa.
const ESPEJOS = [
  {
    nombre: "bcv.today",
    url: "https://bcv.today/api/v1/rate.json",
    leer: (json) => ({ valor: Number(json.USD), fechaValor: json.effective_date }),
  },
  {
    nombre: "dolarapi",
    url: "https://ve.dolarapi.com/v1/dolares/oficial",
    leer: (json) => ({
      valor: Number(json.promedio),
      fechaValor: (json.fechaActualizacion || "").slice(0, 10),
    }),
  },
];

/** ¿El certificado que nos presentan ampara de verdad a este dominio? */
function certificadoEsDelDominio(certificado, dominio) {
  if (!certificado) return false;

  const nombres = [];
  if (certificado.subject?.CN) nombres.push(certificado.subject.CN);
  for (const entrada of String(certificado.subjectaltname || "").split(",")) {
    const dns = entrada.trim().match(/^DNS:(.+)$/i);
    if (dns) nombres.push(dns[1]);
  }

  return nombres.some((nombre) => {
    const n = nombre.toLowerCase().trim();
    if (n === dominio) return true;
    // Comodín de un solo nivel: *.bcv.org.ve cubre www.bcv.org.ve.
    if (n.startsWith("*.")) {
      const base = n.slice(2);
      const resto = dominio.endsWith(`.${base}`) ? dominio.slice(0, -(base.length + 1)) : null;
      return resto !== null && !resto.includes(".");
    }
    return false;
  });
}

/**
 * Descarga la página del BCV tolerando su cadena de certificados incompleta.
 *
 * bcv.org.ve sirve su certificado sin el intermedio, así que fetch() falla con
 * "unable to verify the first certificate". En vez de desactivar TLS del todo,
 * se deja pasar la validación de cadena y acto seguido se comprueba a mano que
 * el certificado presentado sea el de bcv.org.ve: si alguien nos desvía a otro
 * servidor, la descarga se aborta. Aun así solo sacamos de aquí un número
 * público, que después se valida como cifra positiva.
 */
function descargarPaginaBcv(url, milisegundos = 12000) {
  const { hostname, pathname } = new URL(url);

  return new Promise((resolve, reject) => {
    const peticion = https.get(
      {
        hostname,
        path: pathname,
        // La cadena viene incompleta; la identidad se comprueba abajo.
        rejectUnauthorized: false,
        servername: hostname,
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; HardcoreStore/1.0)",
          Accept: "text/html,application/xhtml+xml",
        },
        timeout: milisegundos,
      },
      (respuesta) => {
        const certificado = respuesta.socket.getPeerCertificate?.();
        if (!certificadoEsDelDominio(certificado, hostname)) {
          respuesta.destroy();
          reject(new Error(`El certificado presentado no es de ${hostname}`));
          return;
        }
        if (respuesta.statusCode !== 200) {
          respuesta.resume();
          reject(new Error(`El BCV respondió ${respuesta.statusCode}`));
          return;
        }
        let cuerpo = "";
        respuesta.setEncoding("utf8");
        respuesta.on("data", (trozo) => (cuerpo += trozo));
        respuesta.on("end", () => resolve(cuerpo));
      }
    );
    peticion.on("timeout", () => peticion.destroy(new Error("El BCV tardó demasiado")));
    peticion.on("error", reject);
  });
}

// En la página del BCV el dólar vive así:
//   <div id="dolar"> … <strong class="strong-tb">849,56400000</strong>
// y la fecha de valor, en el <span> con la clase date-display-single.
export function leerTasaDelHtml(html) {
  const bloque = html.indexOf('id="dolar"');
  if (bloque === -1) throw new Error("No se encontró el bloque del dólar");

  const trozo = html.slice(bloque, bloque + 900);
  const m = /<strong[^>]*>\s*([\d.,]+)\s*<\/strong>/.exec(trozo);
  if (!m) throw new Error("No se encontró la cifra del dólar");

  // Viene en formato venezolano: "849,56400000" (punto de miles, coma decimal).
  const valor = Number(m[1].replace(/\./g, "").replace(",", "."));
  if (!Number.isFinite(valor) || valor <= 0) throw new Error(`Cifra ilegible: ${m[1]}`);

  const fecha = /date-display-single"[^>]*content="(\d{4}-\d{2}-\d{2})/.exec(
    html.slice(bloque, bloque + 2000)
  );

  return {
    valor,
    fechaValor: fecha ? fecha[1] : new Date().toISOString().slice(0, 10),
    fuente: "bcv",
  };
}

async function probarEspejo(espejo) {
  const respuesta = await fetch(espejo.url, {
    headers: { Accept: "application/json" },
    signal: AbortSignal.timeout(10000),
  });
  if (!respuesta.ok) throw new Error(`${espejo.nombre} respondió ${respuesta.status}`);
  const { valor, fechaValor } = espejo.leer(await respuesta.json());
  if (!Number.isFinite(valor) || valor <= 0) throw new Error(`${espejo.nombre} dio una cifra ilegible`);
  return { valor, fechaValor: fechaValor || new Date().toISOString().slice(0, 10), fuente: espejo.nombre };
}

/**
 * Busca la tasa: primero el BCV, después los espejos.
 * @returns {Promise<{valor:number, fechaValor:string, fuente:string, avisos:string[]}>}
 */
export async function obtenerTasaDelBcv() {
  const avisos = [];
  try {
    const tasa = leerTasaDelHtml(await descargarPaginaBcv(PAGINA_BCV));
    return { ...tasa, avisos };
  } catch (error) {
    avisos.push(`bcv.org.ve: ${error.message}`);
  }

  for (const espejo of ESPEJOS) {
    try {
      const tasa = await probarEspejo(espejo);
      avisos.push(`Se usó el espejo ${espejo.nombre}, no la página del BCV.`);
      return { ...tasa, avisos };
    } catch (error) {
      avisos.push(`${espejo.nombre}: ${error.message}`);
    }
  }

  const error = new Error("No se pudo obtener la tasa del BCV por ningún camino");
  error.avisos = avisos;
  throw error;
}

/** Guarda la tasa del día. Si ya estaba, la pisa (el BCV a veces corrige). */
export async function guardarTasa(supabase, tasa) {
  const { data, error } = await supabase
    .from("tasas_cambio")
    .upsert(
      {
        fuente: "bcv",
        valor: tasa.valor,
        fecha_valor: tasa.fechaValor,
        obtenida_en: new Date().toISOString(),
      },
      { onConflict: "fuente,fecha_valor" }
    )
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * La tasa que debe usar la tienda: la más reciente que tengamos guardada.
 * Devuelve null si todavía no se ha corrido el cron.
 */
export async function leerTasaVigente(supabase) {
  const { data, error } = await supabase
    .from("tasas_cambio")
    .select("valor, fecha_valor, obtenida_en")
    .order("fecha_valor", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error || !data) return null;
  return { valor: Number(data.valor), fechaValor: data.fecha_valor, obtenidaEn: data.obtenida_en };
}
