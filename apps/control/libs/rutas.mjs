// Dónde está cada cosa en el disco. Es .mjs y solo usa módulos de Node porque
// lo importan dos mundos: el servidor de Next y scripts/rutina.mjs, que corre
// suelto, fuera de Next, para sobrevivir a los reinicios del servidor.
import fs from "node:fs";
import path from "node:path";
import { aSlug, esSlug } from "./slug.mjs";

export { aSlug, esSlug };

let raizCache = null;

// La raíz del monorepo es la carpeta que tiene pnpm-workspace.yaml. Se busca
// hacia arriba desde donde se esté corriendo: Next arranca en apps/control y
// la rutina en la raíz, y así ninguno de los dos depende de una ruta fija.
export function raiz() {
  if (raizCache) return raizCache;
  let carpeta = process.env.CONTROL_RAIZ || process.cwd();
  for (let i = 0; i < 8; i++) {
    if (fs.existsSync(path.join(carpeta, "pnpm-workspace.yaml"))) {
      raizCache = carpeta;
      return carpeta;
    }
    const arriba = path.dirname(carpeta);
    if (arriba === carpeta) break;
    carpeta = arriba;
  }
  throw new Error(
    "No encuentro la raíz del monorepo (pnpm-workspace.yaml). Arranca el centro de control desde dentro del repo."
  );
}

export const carpetaControl = () => path.join(raiz(), "apps", "control");
export const carpetaClientes = () => path.join(raiz(), "apps", "clients");
export const carpetaDatos = () => path.join(carpetaControl(), "data");
export const carpetaCandidatos = () => path.join(carpetaDatos(), "candidatos");
export const archivoCerrojo = () => path.join(carpetaDatos(), "rutina.lock");

export const carpetaCandidato = (id) => path.join(carpetaCandidatos(), id);
export const archivoCandidato = (id) =>
  path.join(carpetaCandidato(id), "candidato.json");
export const carpetaMaterial = (id) => path.join(carpetaCandidato(id), "material");
export const archivoRegistro = (id) => path.join(carpetaCandidato(id), "registro.log");
export const archivoRegistroCrudo = (id) =>
  path.join(carpetaCandidato(id), "registro.jsonl");

export function exigirSlug(valor, queEs = "identificador") {
  if (!esSlug(valor)) throw new Error(`El ${queEs} «${valor}» no es válido.`);
  return valor;
}
