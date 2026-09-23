"use server";

import { revalidatePath } from "next/cache";
import {
  actualizarProspecto,
  borrarProspecto,
  guardarPlantillaMensaje,
  importarDesdeVideos,
} from "@/libs/prospectos.mjs";
import { CANALES, ESTADOS, estadoPorId } from "@/libs/contacto";
import { exigirEntornoLocal } from "@/libs/local";
import { esSlug } from "@/libs/rutas.mjs";

const CAMPOS = [
  "nombre", "ciudad", "instagram", "whatsapp", "persona", "enlace", "clave",
  "respuesta", "proximoPaso", "seguimientoEl", "notas", "mensaje",
];

const texto = (valor, largo = 4000) => String(valor ?? "").trim().slice(0, largo);

// Como en acciones.js: { ok } o { ok: false, error }, nunca un throw.
async function intentar(tarea, rutas = ["/prospectos"]) {
  try {
    exigirEntornoLocal();
    const resultado = await tarea();
    for (const ruta of rutas) revalidatePath(ruta);
    return { ok: true, ...(resultado || {}) };
  } catch (error) {
    return { ok: false, error: error.message || "Algo falló." };
  }
}

export async function importarProspectosAccion() {
  return intentar(() => importarDesdeVideos());
}

export async function guardarProspectoAccion(id, datos) {
  return intentar(() => {
    if (!esSlug(id)) throw new Error("Ese prospecto no existe.");
    const parche = Object.fromEntries(CAMPOS.map((c) => [c, texto(datos?.[c], c === "mensaje" ? 4000 : 400)]));
    if (!parche.nombre) throw new Error("El prospecto necesita un nombre.");
    if (datos?.canal && CANALES.some((c) => c.id === datos.canal)) parche.canal = datos.canal;
    actualizarProspecto(id, parche);
  }, ["/prospectos", `/prospectos/${id}`]);
}

export async function cambiarEstadoAccion(id, estado) {
  return intentar(() => {
    if (!esSlug(id)) throw new Error("Ese prospecto no existe.");
    if (!ESTADOS.some((e) => e.id === estado)) throw new Error("Ese estado no existe.");
    actualizarProspecto(id, { estado }, `Pasó a «${estadoPorId(estado).nombre}».`);
  }, ["/prospectos", `/prospectos/${id}`]);
}

// El gesto de «ya le escribí»: fecha el primer contacto si es el primero,
// renueva el último, y si estaba por contactar lo pasa a contactado. Si ya
// había conversación, el estado se respeta: un segundo mensaje no la reinicia.
export async function marcarContactadoAccion(id, canal) {
  return intentar(() => {
    if (!esSlug(id)) throw new Error("Ese prospecto no existe.");
    const porDonde = CANALES.find((c) => c.id === canal) || CANALES[0];
    const fecha = new Date().toISOString();
    actualizarProspecto(
      id,
      (actual) => ({
        canal: porDonde.id,
        contactadoEl: actual.contactadoEl || fecha,
        ultimoContacto: fecha,
        estado: actual.estado === "por-contactar" ? "contactado" : actual.estado,
      }),
      `Mensaje enviado por ${porDonde.nombre}.`
    );
  }, ["/prospectos", `/prospectos/${id}`]);
}

export async function guardarPlantillaAccion(textoPlantilla) {
  return intentar(() => {
    const limpio = texto(textoPlantilla, 4000);
    if (!limpio) throw new Error("La plantilla no puede quedar vacía.");
    guardarPlantillaMensaje(limpio);
  });
}

export async function borrarProspectoAccion(id) {
  return intentar(() => {
    if (!esSlug(id)) throw new Error("Ese prospecto no existe.");
    borrarProspecto(id);
  });
}
