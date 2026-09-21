// -----------------------------------------------------------------------------
// Modo demo.
//
// Esta página se le enseña a DealerNauta Cars antes de vendérsela. En demo se
// ve casi todo —así se entiende qué se compra— pero no se puede usar de
// verdad:
//
//   · antes de ver nada hay que pasar una puerta con contraseña,
//   · el inventario se corta a la sexta unidad y el resto queda difuminado,
//   · el formulario de contacto no manda nada a ningún teléfono real,
//   · los botones de WhatsApp no abren conversación con ninguna de las dos
//     sedes.
//
// Ese último corte no es cosmético: los dos números de DealerNauta son reales
// y están publicados en su Instagram, así que si el botón abriera de verdad,
// cualquiera que esté probando la demo les estaría mandando pedidos falsos.
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
 * Los camiones se venden en San Antonio de los Altos y los vehículos en
 * Caracas: es la división real del negocio, la misma que tienen partida en dos
 * cuentas de Instagram. Por eso el botón de WhatsApp de cada ficha escribe al
 * número que corresponde y no siempre al mismo.
 */
export function sedeDe(vehiculo) {
  const sedes = config.business.sedes || [];
  const slug = vehiculo?.sede || (vehiculo?.segmento === "camion" ? "san-antonio" : "caracas");
  return sedes.find((s) => s.slug === slug) || sedes[0] || null;
}

/**
 * El mensaje con el que llega un comprador por una unidad concreta.
 *
 * Sin unidad —el botón general de la portada, o el de una sede, que solo lleva
 * `sede`— se manda el mensaje genérico: escribir "me interesa el undefined" es
 * peor que no personalizar nada.
 */
export function mensajePorVehiculo(vehiculo) {
  const nombre = vehiculo?.tituloLargo || vehiculo?.titulo;
  if (!nombre) {
    return "Hola, vi la página de DealerNauta Cars y quiero información sobre las unidades disponibles.";
  }

  const cual = `${nombre} ${vehiculo.anio}`;
  if (vehiculo.segmento === "camion") {
    return `Hola, me interesa el ${cual}. ¿Sigue disponible y qué documentación trae?`;
  }
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
 * no tuviera número, cae al general y, sin ninguno, al DM de Instagram.
 */
export function enlaceDeWhatsapp(vehiculo) {
  if (esDemo()) return null;

  const sede = sedeDe(vehiculo);
  const numero = sede?.whatsapp || config.business.whatsapp;
  if (!numero) return config.business.instagramUrl;

  return `https://wa.me/${numero}?text=${encodeURIComponent(mensajePorVehiculo(vehiculo))}`;
}
