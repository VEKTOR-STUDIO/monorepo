// Los prospectos: los negocios que ya tienen demo publicada y video, y a los
// que hay que escribir. Uno por archivo en data/prospectos/<id>.json, con el
// mismo criterio que los candidatos: sin base de datos, se abre con un editor.
//
// Lo que se guarda aquí es la conversación (estado, fechas, respuesta, notas,
// el mensaje si se retocó). Lo que se puede leer del disco cada vez —si el
// video existe, qué clave tiene la demo— no se guarda: se mira al abrir.
import fs from "node:fs";
import path from "node:path";
import { claveDemo } from "./clientes.mjs";
import { ESTADOS } from "./contacto.js";
import {
  archivoMarcasVideo,
  archivoMensaje,
  archivoProspecto,
  carpetaClientes,
  carpetaProspectos,
  carpetaVideos,
  exigirSlug,
} from "./rutas.mjs";

const ahora = () => new Date().toISOString();

// El mensaje con el que nace la plantilla. Se edita desde la página y se
// guarda en data/prospectos/mensaje.md; esto solo vale la primera vez.
export const MENSAJE_INICIAL = `Hola, ¿qué tal? Soy Alessandro, de Vektor.

Vi el Instagram de {nombre} y me gustó tanto lo que hacen que les hice su página web completa: su inventario, sus colores, su logo, todo listo.

Ya está en línea para que la vean con calma:
{enlace}
Contraseña: {clave}

Les mando también un video corto de cómo quedó. Si les gusta, la dejamos con su dominio esta misma semana. Cualquier cosa me escriben por aquí.`;

function normalizar(p) {
  const estados = new Set(ESTADOS.map((e) => e.id));
  return {
    id: p.id,
    carpeta: p.carpeta || "",
    nombre: p.nombre || "",
    ciudad: p.ciudad || "",
    instagram: p.instagram || "",
    whatsapp: p.whatsapp || "",
    persona: p.persona || "",
    enlace: p.enlace || "",
    clave: p.clave || "",
    claveOrigen: p.claveOrigen || "",
    estado: estados.has(p.estado) ? p.estado : "por-contactar",
    canal: p.canal || "whatsapp",
    contactadoEl: p.contactadoEl || null,
    ultimoContacto: p.ultimoContacto || null,
    respuesta: p.respuesta || "",
    proximoPaso: p.proximoPaso || "",
    seguimientoEl: p.seguimientoEl || "",
    notas: p.notas || "",
    // Vacío = se usa la plantilla común. Con texto = este prospecto tiene el suyo.
    mensaje: p.mensaje || "",
    creado: p.creado || ahora(),
    actualizado: p.actualizado || ahora(),
    historial: Array.isArray(p.historial) ? p.historial : [],
  };
}

export function leerProspecto(id) {
  exigirSlug(id);
  try {
    return normalizar(JSON.parse(fs.readFileSync(archivoProspecto(id), "utf8")));
  } catch {
    return null;
  }
}

// Temporal y renombrado: nunca queda un JSON a medias.
function escribir(prospecto) {
  const destino = archivoProspecto(prospecto.id);
  fs.mkdirSync(path.dirname(destino), { recursive: true });
  const temporal = `${destino}.${process.pid}.tmp`;
  fs.writeFileSync(temporal, JSON.stringify(prospecto, null, 2) + "\n");
  fs.renameSync(temporal, destino);
  return prospecto;
}

export function listarProspectos() {
  let archivos = [];
  try {
    archivos = fs.readdirSync(carpetaProspectos()).filter((n) => n.endsWith(".json"));
  } catch {
    return [];
  }
  return archivos
    .map((n) => leerProspecto(n.replace(/\.json$/, "")))
    .filter(Boolean)
    .sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));
}

export function actualizarProspecto(id, cambio, apunte) {
  const actual = leerProspecto(id);
  if (!actual) throw new Error("Ese prospecto ya no existe.");
  const parche = typeof cambio === "function" ? cambio(actual) : cambio;
  const siguiente = normalizar({ ...actual, ...parche, id: actual.id, actualizado: ahora() });
  if (apunte) {
    siguiente.historial = [...siguiente.historial, { fecha: ahora(), texto: apunte }].slice(-80);
  }
  return escribir(siguiente);
}

export function borrarProspecto(id) {
  exigirSlug(id);
  fs.rmSync(archivoProspecto(id), { force: true });
}

// --- La plantilla del mensaje -------------------------------------------------

export function leerPlantillaMensaje() {
  try {
    return fs.readFileSync(archivoMensaje(), "utf8");
  } catch {
    return MENSAJE_INICIAL;
  }
}

export function guardarPlantillaMensaje(texto) {
  fs.mkdirSync(carpetaProspectos(), { recursive: true });
  fs.writeFileSync(archivoMensaje(), String(texto || "").trim() + "\n");
}

// El mensaje final: la plantilla (o la propia del prospecto) con sus datos.
// Lo que falte se deja a la vista entre corchetes en vez de desaparecer: un
// «[clave]» en el mensaje se nota antes de mandarlo; un hueco, no.
export function componerMensaje(prospecto, plantilla = leerPlantillaMensaje()) {
  const base = prospecto.mensaje?.trim() ? prospecto.mensaje : plantilla;
  const valores = {
    nombre: prospecto.nombre,
    ciudad: prospecto.ciudad,
    enlace: prospecto.enlace,
    clave: prospecto.clave,
    instagram: prospecto.instagram ? `@${prospecto.instagram.replace(/^@/, "")}` : "",
  };
  return base.replace(/\{(nombre|ciudad|enlace|clave|instagram)\}/g, (_, k) => valores[k] || `[${k}]`);
}

// --- Lo que se lee del disco al abrir ------------------------------------------

function leerTexto(ruta) {
  try {
    return fs.readFileSync(ruta, "utf8");
  } catch {
    return "";
  }
}

const valorDe = (texto, clave) => {
  // La primera aparición de `clave: "…"` al principio de línea. Sirve para
  // config.js de los clientes y para marcas.ts del estudio, que escriben así.
  const m = texto.match(new RegExp(`^\\s*${clave}:\\s*"([^"]*)"`, "m"));
  return m ? m[1] : "";
};

// La clave con la que se entra a la demo publicada. Primero la del .env.local
// (es la que la skill publicar-en-vercel manda a Vercel); si no hay, la de
// reserva escrita en libs/acceso.js. Ojo: si en Vercel se puso otra a mano,
// aquí no se ve; por eso la ficha deja editarla.
export function claveDeLaDemo(carpeta) {
  const env = claveDemo(carpeta);
  if (env) return { clave: env, origen: "env" };
  const acceso = leerTexto(path.join(carpetaClientes(), carpeta, "libs", "acceso.js"));
  const m = acceso.match(/CLAVE_POR_DEFECTO\s*=\s*"([^"]+)"/);
  return m ? { clave: m[1], origen: "reserva" } : { clave: "", origen: "" };
}

function datosDelCliente(carpeta) {
  const config = leerTexto(path.join(carpetaClientes(), carpeta, "config.js"));
  return {
    whatsapp: valorDe(config, "whatsapp"),
    instagram: valorDe(config, "instagram"),
  };
}

// Los videos que hay en apps/video/out para este prospecto, con su peso y fecha.
export function videosDe(id) {
  exigirSlug(id);
  return ["vertical", "wide"].map((formato) => {
    const ruta = path.join(carpetaVideos(), `${id}-${formato}.mp4`);
    try {
      const info = fs.statSync(ruta);
      return { formato, existe: true, ruta, peso: info.size, fecha: info.mtime.toISOString() };
    } catch {
      return { formato, existe: false, ruta, peso: 0, fecha: null };
    }
  });
}

export const rutaVideo = (id, formato) => {
  exigirSlug(id);
  if (formato !== "vertical" && formato !== "wide") throw new Error("Formato desconocido.");
  return path.join(carpetaVideos(), `${id}-${formato}.mp4`);
};

// --- Importar desde los videos --------------------------------------------------

// Las marcas del estudio de video son la lista de a quién hay que escribir:
// tener video significa que la demo está adaptada, publicada y presentable.
// Se lee marcas.ts como texto —solo hacen falta cinco campos de cadena— para
// no meter TypeScript del estudio en el centro de control.
export function marcasConVideo() {
  const texto = leerTexto(archivoMarcasVideo());
  const bloques = texto.split(/\n  \{\n/).slice(1);
  return bloques
    .map((b) => ({
      id: valorDe(b, "id"),
      carpeta: valorDe(b, "cliente"),
      nombre: valorDe(b, "nombre"),
      ciudad: valorDe(b, "ciudad"),
      dominio: valorDe(b, "dominio"),
    }))
    .filter((m) => m.id && m.carpeta);
}

// Crea los que falten; los que ya están no se tocan (su conversación manda).
// Devuelve cuántos entraron y cuáles ya estaban.
export function importarDesdeVideos() {
  const marcas = marcasConVideo();
  if (!marcas.length) throw new Error("No encuentro marcas en apps/video (marcas.ts).");
  const nuevos = [];
  const existentes = [];
  for (const marca of marcas) {
    if (leerProspecto(marca.id)) {
      existentes.push(marca.id);
      continue;
    }
    const { clave, origen } = claveDeLaDemo(marca.carpeta);
    const contacto = datosDelCliente(marca.carpeta);
    const prospecto = normalizar({
      id: marca.id,
      carpeta: marca.carpeta,
      nombre: marca.nombre,
      ciudad: marca.ciudad,
      instagram: contacto.instagram,
      whatsapp: contacto.whatsapp,
      enlace: marca.dominio ? `https://${marca.dominio}` : "",
      clave,
      claveOrigen: origen,
      canal: contacto.whatsapp ? "whatsapp" : "instagram",
    });
    prospecto.historial.push({
      fecha: ahora(),
      texto: `Entró desde los videos (apps/video). Clave leída de ${origen === "env" ? ".env.local" : "libs/acceso.js"}.`,
    });
    escribir(prospecto);
    nuevos.push(marca.id);
  }
  return { nuevos, existentes };
}
