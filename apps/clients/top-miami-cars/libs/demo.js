// -----------------------------------------------------------------------------
// Modo demo.
//
// Esta página se le enseña a Top Miami Cars antes de vendérsela. En demo se ve
// casi todo —así se entiende qué se compra— pero no se puede usar de verdad:
//
//   · antes de ver nada hay que pasar una puerta con contraseña,
//   · el inventario se corta a la sexta unidad y el resto queda difuminado,
//   · el formulario de contacto no manda nada a ningún teléfono real,
//   · los botones de WhatsApp no abren conversación con el negocio.
//
// Ese último corte no es cosmético: el +58 414-1198290 es el teléfono real de
// su ficha de Google, así que si el botón abriera de verdad, cualquiera que
// esté probando la demo les estaría mandando pedidos falsos.
//
// Todo pasa por aquí para que apagarlo sea una variable de entorno y no una
// cacería por el código: NEXT_PUBLIC_DEMO=false.
// -----------------------------------------------------------------------------

import config from "@/config";

/** ¿Estamos enseñando la demo? */
export function esDemo() {
  return Boolean(config.demo?.activa);
}

/** A dónde lleva el botón de comprar. Sin enlace configurado, al contacto. */
export function enlaceDeCompra() {
  return config.demo?.urlCompra?.trim() || "/contacto";
}

/** ¿El enlace de compra sale del sitio? Define si abre pestaña nueva. */
export function compraEsExterna() {
  return Boolean(config.demo?.urlCompra?.trim());
}

/** Mensaje único para cuando algo está bloqueado por ser una demo. */
export const MENSAJE_BLOQUEADO =
  "Esto es una demo: la acción está desactivada. El sistema completo sí la hace.";

/**
 * A qué sede le toca una unidad.
 *
 * Hoy hay una sola —el salón de la Av. Los Mangos—, así que siempre devuelve
 * esa. Se conserva la pregunta porque el botón de WhatsApp y la ficha la hacen,
 * y el día que abran otra sede basta con añadirla en config.js y poner `sede`
 * en cada unidad.
 */
export function sedeDe(vehiculo) {
  const sedes = config.business.sedes || [];
  return sedes.find((s) => s.slug === vehiculo?.sede) || sedes[0] || null;
}

/**
 * El mensaje con el que llega un comprador por una unidad concreta.
 *
 * Sin unidad —el botón general de la portada, o el de la sede, que solo lleva
 * `sede`— se manda el mensaje genérico: escribir "me interesa el undefined" es
 * peor que no personalizar nada.
 */
export function mensajePorVehiculo(vehiculo) {
  const nombre = vehiculo?.tituloLargo || vehiculo?.titulo;
  if (!nombre) {
    return "Hola, vi la página de Top Miami Cars y quiero información sobre las unidades disponibles.";
  }

  const cual = `${nombre} ${vehiculo.anio}`;
  return vehiculo.esNuevo
    ? `Hola, me interesa el ${cual} 0 km. ¿Sigue disponible?`
    : `Hola, me interesa el ${cual}. ¿Sigue disponible?`;
}

/**
 * El enlace para escribirle al negocio por una unidad.
 *
 * En demo devuelve null y quien lo use enseña el cartel de bloqueado en vez
 * del botón: un desconocido probando la demo no puede hacerle llegar mensajes
 * al cliente real.
 *
 * Fuera de demo escribe al número de la sede donde está la unidad; si esa sede
 * no tuviera número, cae al general. Sin ningún número devuelve null: no hay
 * Instagram al que caer, y un botón que no lleva a ningún sitio no se enseña.
 */
export function enlaceDeWhatsapp(vehiculo) {
  if (esDemo()) return null;

  const sede = sedeDe(vehiculo);
  const numero = sede?.whatsapp || config.business.whatsapp;
  if (!numero) return config.business.instagramUrl || null;

  return `https://wa.me/${numero}?text=${encodeURIComponent(mensajePorVehiculo(vehiculo))}`;
}
