"use server";

import { revalidatePath } from "next/cache";
import {
  actualizarCandidato,
  borrarCandidato,
  borrarMaterial,
  crearCandidato,
  leerCandidato,
} from "@/libs/almacen.mjs";
import { copiarPlantilla } from "@/libs/plantillas.mjs";
import { detener, encolar } from "@/libs/rutina.mjs";
import { aSlug, esSlug } from "@/libs/rutas.mjs";
import { ETAPAS } from "@/libs/etapas";
import { exigirEntornoLocal } from "@/libs/local";

const CAMPOS = ["nombre", "instagram", "ciudad", "rubro", "whatsapp", "web", "notas", "encargo", "enlace"];

const texto = (valor, largo = 4000) => String(valor ?? "").trim().slice(0, largo);

// Todas las acciones devuelven { ok } o { ok: false, error } en vez de lanzar:
// el mensaje de un throw no llega al navegador en producción, y aquí el mensaje
// es justo lo que hay que enseñar.
async function intentar(tarea, rutas = []) {
  try {
    exigirEntornoLocal();
    const resultado = await tarea();
    revalidatePath("/");
    for (const ruta of rutas) revalidatePath(ruta);
    return { ok: true, ...(resultado || {}) };
  } catch (error) {
    return { ok: false, error: error.message || "Algo falló." };
  }
}

export async function crearCandidatoAccion(datos) {
  return intentar(() => {
    const nombre = texto(datos?.nombre, 120);
    if (!nombre) throw new Error("El candidato necesita al menos un nombre.");
    const candidato = crearCandidato({
      nombre,
      instagram: texto(datos?.instagram, 80),
      ciudad: texto(datos?.ciudad, 80),
      rubro: texto(datos?.rubro, 80),
    });
    return { id: candidato.id };
  });
}

export async function guardarDatosAccion(id, datos) {
  return intentar(() => {
    const cambio = {};
    for (const campo of CAMPOS) {
      if (campo in (datos || {})) cambio[campo] = texto(datos[campo], campo === "notas" || campo === "encargo" ? 20000 : 300);
    }
    if ("nombre" in cambio && !cambio.nombre) throw new Error("El nombre no puede quedar vacío.");
    actualizarCandidato(id, cambio);
  }, [`/candidatos/${id}`]);
}

export async function copiarPlantillaAccion(id, origen, carpeta) {
  return intentar(async () => {
    const candidato = leerCandidato(id);
    if (!candidato) throw new Error("Ese candidato ya no existe.");
    if (candidato.carpeta) throw new Error(`Este candidato ya tiene carpeta: apps/clients/${candidato.carpeta}.`);

    const destino = aSlug(carpeta);
    if (!esSlug(destino)) throw new Error("Escribe un nombre de carpeta: minúsculas, números y guiones.");

    const { paquete } = await copiarPlantilla({ origen, carpeta: destino });
    actualizarCandidato(
      id,
      { plantilla: origen, carpeta: destino, copiada: new Date().toISOString(), etapa: "preparando" },
      `Copiada ${origen} → apps/clients/${destino} (${paquete}).`
    );
    return { carpeta: destino };
  }, [`/candidatos/${id}`, "/clientes"]);
}

// Para cuando la carpeta se borró o se renombró a mano: la tarjeta vuelve a
// «Candidatos» y se le puede copiar otra plantilla.
export async function desvincularCarpetaAccion(id) {
  return intentar(() => {
    const candidato = leerCandidato(id);
    if (!candidato) throw new Error("Ese candidato ya no existe.");
    if (candidato.rutina.estado === "corriendo") throw new Error("La rutina está corriendo.");
    actualizarCandidato(
      id,
      { carpeta: null, plantilla: null, copiada: null, etapa: "candidato", rutina: { estado: "inactiva", encolada: null } },
      `Desvinculada de apps/clients/${candidato.carpeta}.`
    );
  }, [`/candidatos/${id}`]);
}

export async function moverCandidatoAccion(id, etapa) {
  return intentar(() => {
    const destino = ETAPAS.find((e) => e.id === etapa);
    if (!destino) throw new Error("Esa columna no existe.");
    if (destino.automatica) throw new Error("A «En proceso» solo entra la rutina. Suéltalo en «Por hacer».");

    const candidato = leerCandidato(id);
    if (!candidato) throw new Error("Ese candidato ya no existe.");
    if (candidato.etapa === etapa) return;
    if (candidato.rutina.estado === "corriendo") {
      throw new Error("La rutina está corriendo. Detenla antes de mover la tarjeta.");
    }
    if (etapa !== "candidato" && !candidato.carpeta) {
      throw new Error("Todavía no tiene carpeta. Ábrelo y cópiale una plantilla primero.");
    }

    if (destino.dispara) {
      encolar(id);
      return;
    }
    // Si estaba esperando turno y se saca de la columna, sale también de la cola.
    const rutina = candidato.rutina.estado === "en-cola" ? { estado: "inactiva", encolada: null } : {};
    actualizarCandidato(id, { etapa, rutina }, `Movido a «${destino.nombre}».`);
  }, [`/candidatos/${id}`]);
}

export async function detenerRutinaAccion(id) {
  return intentar(() => ({ resultado: detener(id) }), [`/candidatos/${id}`]);
}

export async function borrarMaterialAccion(id, nombre) {
  return intentar(() => borrarMaterial(id, nombre), [`/candidatos/${id}`]);
}

// Borra la tarjeta y su material. La carpeta de apps/clients NO se toca: eso es
// código, puede tener trabajo dentro, y se borra a mano y a conciencia.
export async function borrarCandidatoAccion(id) {
  return intentar(() => {
    const candidato = leerCandidato(id);
    if (candidato?.rutina.estado === "corriendo") {
      throw new Error("La rutina está corriendo. Detenla antes de borrar la tarjeta.");
    }
    borrarCandidato(id);
  });
}
