// -----------------------------------------------------------------------------
// La puerta de la demo.
//
// La página de muestra no es para todo el mundo: antes de ver nada hay que
// escribir una contraseña. Quien acierta se lleva una cookie firmada y ya no
// se le vuelve a pedir en una semana.
//
// La cookie NO guarda la contraseña: guarda su huella. Falsificarla exige
// conocer la contraseña, que es exactamente lo que queremos.
//
// Esto vive aparte de Supabase a propósito: es un candado para enseñar el
// trabajo, no el sistema de cuentas del sitio. El día que se entregue, con
// NEXT_PUBLIC_DEMO=false el candado desaparece entero.
// -----------------------------------------------------------------------------

import { esDemo } from "@/libs/demo";

export const COOKIE_ACCESO = "coronado_acceso";
export const DIAS_DE_ACCESO = 7;

/**
 * Contraseña de reserva, por si falta DEMO_PASSWORD en el entorno.
 *
 * Existe para que la demo nazca CERRADA: si el valor por defecto fuera vacío y
 * alguien olvidara la variable al desplegar, la página quedaría abierta a
 * cualquiera, que es justo lo que no queremos. Cámbiala por DEMO_PASSWORD
 * antes de repartir el enlace.
 *
 * Este módulo no llega nunca al navegador —lo importan el middleware, la ruta
 * /api/entrar y app/entrar/page.js, todos servidor—, así que la contraseña no
 * viaja en el bundle. Por eso no está en config.js.
 */
const CLAVE_POR_DEFECTO = "coronado2026";

/** La contraseña configurada. El entorno manda. */
export function claveDeAcceso() {
  return (process.env.DEMO_PASSWORD || CLAVE_POR_DEFECTO).trim();
}

/** ¿Hay que pedir contraseña? Solo en demo y solo si hay una puesta. */
export function hayCandado() {
  return esDemo() && claveDeAcceso().length > 0;
}

/**
 * La huella que se guarda en la cookie.
 *
 * Web Crypto en vez de node:crypto porque esto también corre en el middleware,
 * que va sobre el runtime edge.
 */
export async function huellaDe(clave) {
  const datos = new TextEncoder().encode(`coronado-carss::acceso::${clave}`);
  const resumen = await crypto.subtle.digest("SHA-256", datos);
  return [...new Uint8Array(resumen)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

/** Comparación que no se acorta al primer byte distinto. */
function igualesEnTiempoFijo(a, b) {
  if (typeof a !== "string" || typeof b !== "string" || a.length !== b.length) return false;
  let diferencia = 0;
  for (let i = 0; i < a.length; i++) diferencia |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diferencia === 0;
}

/** ¿La cookie que trae esta petición vale? */
export async function cookieEsValida(valor) {
  if (!valor) return false;
  return igualesEnTiempoFijo(valor, await huellaDe(claveDeAcceso()));
}

export async function claveEsCorrecta(intento) {
  const esperada = claveDeAcceso();
  if (!esperada) return false;
  // Se comparan las huellas, no los textos: así el tiempo de respuesta no
  // depende de cuántas letras se acertaron.
  return igualesEnTiempoFijo(await huellaDe(String(intento ?? "")), await huellaDe(esperada));
}

/**
 * Rutas que se sirven aunque no se haya pasado la puerta: la propia puerta,
 * su formulario y lo que la pantalla necesita para pintarse.
 */
export function rutaLibre(pathname) {
  return (
    pathname === "/entrar" ||
    pathname === "/api/entrar" ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/_vercel") ||
    pathname.startsWith("/marca/") ||
    pathname === "/favicon.ico"
  );
}

/** A dónde mandar a alguien después de abrir. Solo rutas de este sitio. */
export function destinoSeguro(destino) {
  if (typeof destino !== "string") return "/";
  // Sin "//" ni esquemas: si no, esto sería un redirector abierto a otro sitio.
  if (!destino.startsWith("/") || destino.startsWith("//")) return "/";
  if (destino.startsWith("/entrar")) return "/";
  return destino;
}
