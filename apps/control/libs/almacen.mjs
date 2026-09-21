// El tablero guardado en disco: una carpeta por candidato en data/candidatos,
// con su candidato.json, su material y el registro de la rutina. Sin base de
// datos a propósito — es una herramienta local y así se puede abrir, copiar o
// arreglar a mano con un editor.
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import {
  archivoCandidato,
  carpetaCandidato,
  carpetaCandidatos,
  carpetaMaterial,
  exigirSlug,
} from "./rutas.mjs";

const ahora = () => new Date().toISOString();

export function rutinaVacia() {
  return {
    estado: "inactiva",
    pid: null,
    encolada: null,
    inicio: null,
    fin: null,
    sesion: null,
    costo: null,
    turnos: null,
    resumen: "",
    error: "",
  };
}

function normalizar(c) {
  return {
    id: c.id,
    nombre: c.nombre || "",
    instagram: c.instagram || "",
    ciudad: c.ciudad || "",
    rubro: c.rubro || "",
    whatsapp: c.whatsapp || "",
    web: c.web || "",
    notas: c.notas || "",
    encargo: c.encargo || "",
    etapa: c.etapa || "candidato",
    plantilla: c.plantilla || null,
    carpeta: c.carpeta || null,
    copiada: c.copiada || null,
    enlace: c.enlace || "",
    creado: c.creado || ahora(),
    actualizado: c.actualizado || ahora(),
    rutina: { ...rutinaVacia(), ...(c.rutina || {}) },
    historial: Array.isArray(c.historial) ? c.historial : [],
  };
}

export function leerCandidato(id) {
  exigirSlug(id);
  try {
    return normalizar(JSON.parse(fs.readFileSync(archivoCandidato(id), "utf8")));
  } catch {
    return null;
  }
}

// Se escribe a un temporal y se renombra: el servidor y la rutina tocan el
// mismo archivo, y un renombrado no deja nunca un JSON a medias.
function escribir(candidato) {
  const destino = archivoCandidato(candidato.id);
  fs.mkdirSync(path.dirname(destino), { recursive: true });
  const temporal = `${destino}.${process.pid}.tmp`;
  fs.writeFileSync(temporal, JSON.stringify(candidato, null, 2) + "\n");
  fs.renameSync(temporal, destino);
  return candidato;
}

export function listarCandidatos() {
  let ids = [];
  try {
    ids = fs
      .readdirSync(carpetaCandidatos(), { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => d.name);
  } catch {
    return [];
  }
  return ids
    .map((id) => {
      try {
        return leerCandidato(id);
      } catch {
        return null;
      }
    })
    .filter(Boolean)
    .sort((a, b) => (a.creado < b.creado ? 1 : -1));
}

export function crearCandidato(datos) {
  const id = crypto.randomBytes(4).toString("hex");
  const candidato = normalizar({ ...datos, id, creado: ahora(), actualizado: ahora() });
  candidato.historial.push({ fecha: ahora(), texto: "Entró al tablero." });
  fs.mkdirSync(carpetaMaterial(id), { recursive: true });
  return escribir(candidato);
}

// Siempre se relee justo antes de escribir: `cambio` recibe lo que hay ahora en
// disco, no una copia vieja que pudiera pisar lo que acaba de apuntar la rutina.
export function actualizarCandidato(id, cambio, apunte) {
  const actual = leerCandidato(id);
  if (!actual) throw new Error("Ese candidato ya no existe.");
  const parche = typeof cambio === "function" ? cambio(actual) : cambio;
  const siguiente = normalizar({
    ...actual,
    ...parche,
    rutina: { ...actual.rutina, ...(parche?.rutina || {}) },
    id: actual.id,
    actualizado: ahora(),
  });
  if (apunte) {
    siguiente.historial = [...siguiente.historial, { fecha: ahora(), texto: apunte }].slice(-60);
  }
  return escribir(siguiente);
}

export function borrarCandidato(id) {
  exigirSlug(id);
  fs.rmSync(carpetaCandidato(id), { recursive: true, force: true });
}

// --- Material -----------------------------------------------------------------

// Se queda con el nombre, sin ruta, y sin nada que no sea letra, número, punto,
// guion o espacio. «../../config.js» acaba siendo «config.js» dentro de material/.
export function nombreSeguro(nombre) {
  const base = path.basename(String(nombre || "").replace(/\\/g, "/"));
  const limpio = base
    .normalize("NFC")
    .replace(/[^\p{L}\p{N}._ -]+/gu, "-")
    .replace(/^[.\s-]+/, "")
    .slice(0, 120)
    .trim();
  return limpio || `archivo-${Date.now()}`;
}

export function listarMaterial(id) {
  exigirSlug(id);
  try {
    return fs
      .readdirSync(carpetaMaterial(id), { withFileTypes: true })
      .filter((d) => d.isFile())
      .map((d) => {
        const info = fs.statSync(path.join(carpetaMaterial(id), d.name));
        return { nombre: d.name, peso: info.size, fecha: info.mtime.toISOString() };
      })
      .sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));
  } catch {
    return [];
  }
}

export function guardarMaterial(id, nombre, contenido) {
  exigirSlug(id);
  const carpeta = carpetaMaterial(id);
  fs.mkdirSync(carpeta, { recursive: true });
  const seguro = nombreSeguro(nombre);
  fs.writeFileSync(path.join(carpeta, seguro), contenido);
  return seguro;
}

export function borrarMaterial(id, nombre) {
  exigirSlug(id);
  fs.rmSync(path.join(carpetaMaterial(id), nombreSeguro(nombre)), { force: true });
}
