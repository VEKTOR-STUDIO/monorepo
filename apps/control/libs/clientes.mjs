// El estado de cada carpeta de apps/clients, leído del disco y de git. No
// guarda nada: cada vez que se abre la página se vuelve a mirar.
import fs from "node:fs";
import path from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { carpetaClientes, exigirSlug, raiz } from "./rutas.mjs";

const git = promisify(execFile);

async function ultimoCommit(ruta) {
  try {
    const { stdout } = await git("git", ["log", "-1", "--format=%cs\t%s", "--", ruta], { cwd: raiz() });
    const [fecha, asunto] = stdout.trim().split("\t");
    return fecha ? { fecha, asunto: asunto || "" } : null;
  } catch {
    return null;
  }
}

// Cambios sin subir dentro de la carpeta: lo que más interesa saber antes de
// publicar o de lanzarle otra rutina encima.
async function cambiosSinSubir(ruta) {
  try {
    const { stdout } = await git("git", ["status", "--porcelain", "--", ruta], { cwd: raiz() });
    return stdout.split("\n").filter(Boolean).length;
  } catch {
    return 0;
  }
}

function leerEnv(carpeta) {
  try {
    const texto = fs.readFileSync(path.join(carpetaClientes(), carpeta, ".env.local"), "utf8");
    const valores = {};
    for (const linea of texto.split("\n")) {
      const m = linea.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (m) valores[m[1]] = m[2].replace(/^["']|["']$/g, "");
    }
    return valores;
  } catch {
    return null;
  }
}

export function claveDemo(carpeta) {
  exigirSlug(carpeta, "nombre de carpeta");
  return leerEnv(carpeta)?.DEMO_PASSWORD || "";
}

export function leerPendientes(carpeta) {
  exigirSlug(carpeta, "nombre de carpeta");
  try {
    return fs.readFileSync(path.join(carpetaClientes(), carpeta, "docs", "PENDIENTES.md"), "utf8");
  } catch {
    return "";
  }
}

export async function listarClientes() {
  let carpetas = [];
  try {
    carpetas = fs
      .readdirSync(carpetaClientes(), { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => d.name);
  } catch {
    return [];
  }

  const clientes = await Promise.all(
    carpetas.map(async (carpeta) => {
      const absoluta = path.join(carpetaClientes(), carpeta);
      const ruta = path.join("apps", "clients", carpeta);
      let paquete = {};
      try {
        paquete = JSON.parse(fs.readFileSync(path.join(absoluta, "package.json"), "utf8"));
      } catch {}
      const env = leerEnv(carpeta);
      const [commit, cambios] = await Promise.all([ultimoCommit(ruta), cambiosSinSubir(ruta)]);
      return {
        carpeta,
        paquete: paquete.name || carpeta,
        descripcion: paquete.description || "",
        tieneDemo: fs.existsSync(path.join(absoluta, "libs", "demo.js")),
        demoApagada: env?.NEXT_PUBLIC_DEMO === "false",
        tieneEnv: Boolean(env),
        enVercel: fs.existsSync(path.join(absoluta, ".vercel", "project.json")),
        tienePendientes: fs.existsSync(path.join(absoluta, "docs", "PENDIENTES.md")),
        commit,
        cambios,
      };
    })
  );

  // Lo último que se tocó, arriba. Lo que nunca se ha subido va primero.
  return clientes.sort((a, b) => (b.commit?.fecha || "9999").localeCompare(a.commit?.fecha || "9999"));
}
