// -----------------------------------------------------------------------------
// Modo demo.
//
// Esta página se le enseña a DSS Import & Export antes de vendérsela. En demo
// se ve casi todo —así se entiende qué se compra— pero no se puede usar de
// verdad:
//
//   · antes de ver nada hay que pasar una puerta con contraseña,
//   · el catálogo se corta a la sexta unidad y el resto queda difuminado,
//   · el formulario de solicitud de crédito no manda nada a ningún sitio,
//   · los botones de WhatsApp e Instagram no abren conversación con ellos.
//
// Ese último corte es el que más importa en ESTE negocio y no es cosmético: lo
// que llega por esos botones no es una consulta cualquiera, es una SOLICITUD DE
// CRÉDITO con los datos de una persona. Si el botón abriera de verdad, un
// desconocido probando la demo les estaría metiendo solicitudes falsas en la
// bandeja, y a ellos les cuesta tiempo real contestarlas.
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
 * El mensaje con el que llega un interesado por una unidad concreta.
 *
 * Pregunta por la CUOTA y no por el precio, que es como se pregunta en este
 * negocio: nadie escribe "¿cuánto cuesta el Optra?", escriben "¿en cuánto me
 * queda la semanal?". Si el mensaje no hablara de cuotas, quien atiende tendría
 * que empezar de cero cada conversación.
 *
 * Sin unidad —el botón general de la portada— se manda el mensaje genérico:
 * escribir "me interesa el undefined" es peor que no personalizar nada.
 */
export function mensajePorVehiculo(vehiculo) {
  const nombre = vehiculo?.tituloLargo || vehiculo?.titulo;
  if (!nombre) {
    return "Hola, vi la página de DSS y quiero información sobre los planes de crédito.";
  }

  const cual = `${nombre} ${vehiculo.anio}`;
  const cuota = vehiculo?.cuota;

  if (cuota?.monto) {
    return `Hola, me interesa ${vehiculo.esMoto ? "la" : "el"} ${cual}. Vi que la cuota es de $${cuota.monto} ${cuota.etiqueta}. ¿Qué necesito para aplicar?`;
  }

  return `Hola, me interesa ${vehiculo.esMoto ? "la" : "el"} ${cual}. ¿Cómo quedaría la cuota?`;
}

/**
 * El enlace para escribirle al negocio por una unidad.
 *
 * En demo devuelve null y quien lo use enseña el cartel de bloqueado en vez del
 * botón: un desconocido probando la demo no puede mandarle solicitudes al
 * cliente real.
 *
 * Fuera de demo escribe a su WhatsApp. HOY NO HAY NÚMERO —su bio lleva a
 * beacons.ai y el teléfono no está publicado, ver el PENDIENTE de config.js—,
 * así que mientras tanto cae al DM de Instagram, que sí es suyo y sí está
 * publicado. Cae con el mensaje perdido, eso sí: Instagram no admite texto
 * prerrellenado en un enlace. Es una razón más para pedirles el número.
 */
export function enlaceDeWhatsapp(vehiculo) {
  if (esDemo()) return null;

  const numero = config.business.whatsapp;
  if (!numero) return config.business.instagramUrl;

  return `https://wa.me/${numero}?text=${encodeURIComponent(mensajePorVehiculo(vehiculo))}`;
}

/** ¿Tenemos por dónde escribirles de verdad, o solo el Instagram? */
export function hayWhatsapp() {
  return Boolean(config.business.whatsapp?.trim());
}
