// Qué se puede copiar y cómo se copia. Es el `cp -r` que se hacía a mano para
// estrenar un cliente, con las cuatro cosas que a mano se olvidan.
import fs from "node:fs";
import path from "node:path";
import { carpetaClientes, exigirSlug, raiz } from "./rutas.mjs";

// Las plantillas en blanco del monorepo, además de los clientes ya hechos.
const BASES = ["apps/vanilla-template", "apps/vanilla-template-supabase"];

// Lo que no viaja en la copia:
//   · node_modules, .next, .turbo, out → se regeneran, y node_modules en pnpm
//     son enlaces simbólicos que copiados no sirven.
//   · .vercel → es el vínculo con el proyecto de Vercel DEL ORIGEN. Copiado, el
//     primer `vercel deploy` del cliente nuevo pisaría la demo del otro.
const NUNCA = new Set(["node_modules", ".next", ".turbo", ".vercel", "out"]);

// Y docs/fuentes, que es el material del negocio de origen (su PDF, sus
// capturas): mezclado con el del negocio nuevo, la rutina no sabría de quién es
// cada cosa.
const MATERIAL_AJENO = path.join("docs", "fuentes");

function leerPaquete(carpeta) {
  try {
    return JSON.parse(fs.readFileSync(path.join(carpeta, "package.json"), "utf8"));
  } catch {
    return null;
  }
}

function describir(ruta, grupo) {
  const absoluta = path.join(raiz(), ruta);
  const paquete = leerPaquete(absoluta);
  if (!paquete) return null;
  return {
    ruta,
    grupo,
    carpeta: path.basename(ruta),
    paquete: paquete.name || path.basename(ruta),
    descripcion: paquete.description || "",
    tieneDemo: fs.existsSync(path.join(absoluta, "libs", "demo.js")),
    tieneSupabase: Boolean(
      paquete.dependencies?.["@supabase/supabase-js"] || paquete.dependencies?.["@supabase/ssr"]
    ),
  };
}

export function listarPlantillas() {
  let clientes = [];
  try {
    clientes = fs
      .readdirSync(carpetaClientes(), { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => describir(path.join("apps", "clients", d.name), "cliente"));
  } catch {
    clientes = [];
  }
  const bases = BASES.map((ruta) => describir(ruta, "base"));
  return [...clientes, ...bases]
    .filter(Boolean)
    .sort((a, b) => a.carpeta.localeCompare(b.carpeta, "es"));
}

export const existeCliente = (carpeta) =>
  fs.existsSync(path.join(carpetaClientes(), exigirSlug(carpeta, "nombre de carpeta")));

export async function copiarPlantilla({ origen, carpeta }) {
  exigirSlug(carpeta, "nombre de carpeta");

  // El origen no se fía del navegador: tiene que ser uno de la lista.
  const plantilla = listarPlantillas().find((p) => p.ruta === origen);
  if (!plantilla) throw new Error("Esa plantilla no existe en el monorepo.");

  const desde = path.join(raiz(), plantilla.ruta);
  const hasta = path.join(carpetaClientes(), carpeta);
  if (fs.existsSync(hasta)) {
    throw new Error(`Ya existe apps/clients/${carpeta}. Elige otro nombre de carpeta.`);
  }

  try {
    await fs.promises.cp(desde, hasta, {
      recursive: true,
      errorOnExist: true,
      force: false,
      filter: (archivo) => {
        const relativa = path.relative(desde, archivo);
        if (!relativa) return true;
        if (relativa === MATERIAL_AJENO) return false;
        return !relativa.split(path.sep).some((trozo) => NUNCA.has(trozo));
      },
    });

    // El nombre del paquete, con la misma convención que traía el origen: unos
    // clientes van como «@alessandrovaru/x» y otros como «x» a secas.
    const archivoPaquete = path.join(hasta, "package.json");
    const paquete = leerPaquete(hasta);
    if (paquete) {
      const conAmbito = String(paquete.name || "").startsWith("@alessandrovaru/");
      paquete.name = conAmbito ? `@alessandrovaru/${carpeta}` : carpeta;
      fs.writeFileSync(archivoPaquete, JSON.stringify(paquete, null, 2) + "\n");
    }

    fs.mkdirSync(path.join(hasta, MATERIAL_AJENO), { recursive: true });
    return { paquete: paquete?.name || carpeta, tieneEnv: fs.existsSync(path.join(hasta, ".env.local")) };
  } catch (error) {
    // Una copia a medias es peor que ninguna: la próxima vez diría «ya existe».
    fs.rmSync(hasta, { recursive: true, force: true });
    throw error;
  }
}
