// -----------------------------------------------------------------------------
// Modo demo.
//
// Esta página se le enseña a Lone Star All In Autos antes de vendérsela. En
// demo se ve casi todo —así se entiende qué se compra— pero no se puede usar
// de verdad:
//
//   · antes de ver nada hay que pasar una puerta con contraseña,
//   · el inventario se corta a la sexta unidad y el resto queda difuminado,
//   · el formulario de contacto no manda nada a ningún teléfono real,
//   · los botones de WhatsApp no abren conversación con el negocio.
//
// Ese último corte no es cosmético: el +1 (281) 692-8067 es real y va impreso
// en su emblema, así que si el botón abriera de verdad, cualquiera que esté
// probando la demo les estaría mandando pedidos falsos.
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
 * Quién atiende una unidad. Hoy hay una sola base, en Texas; la función existe
 * para que el día que haya dos no haya que tocar los botones.
 */
export function sedeDe(vehiculo) {
  const sedes = config.business.sedes || [];
  return sedes.find((s) => s.slug === vehiculo?.sede) || sedes[0] || null;
}

/**
 * El mensaje con el que llega un comprador por una unidad concreta.
 *
 * Sin unidad —el botón general de la portada— se manda el mensaje genérico:
 * escribir "me interesa el undefined" es peor que no personalizar nada.
 */
export function mensajePorVehiculo(vehiculo) {
  const nombre = vehiculo?.nombreCompleto || vehiculo?.titulo;
  if (!nombre) {
    return "Hola, vi la página de Lone Star All In Autos y quiero información para traer un vehículo.";
  }

  if (vehiculo.enSubasta === false) {
    return `Hola, quiero cotizar un ${nombre} a pedido. ¿Cuánto me sale puesto en mi país?`;
  }
  return `Hola, me interesa el ${nombre} que está en subasta. ¿Sigue disponible y cuánto sería puesto en mi país?`;
}

/**
 * El enlace para escribirle al negocio por una unidad.
 *
 * En demo devuelve null y quien lo use enseña el cartel de bloqueado en vez
 * del botón: un desconocido probando la demo no puede hacerle llegar mensajes
 * al cliente real.
 */
export function enlaceDeWhatsapp(vehiculo) {
  if (esDemo()) return null;

  const sede = sedeDe(vehiculo);
  const numero = sede?.whatsapp || config.business.whatsapp;
  if (!numero) return config.business.instagramUrl;

  return `https://wa.me/${numero}?text=${encodeURIComponent(mensajePorVehiculo(vehiculo))}`;
}
