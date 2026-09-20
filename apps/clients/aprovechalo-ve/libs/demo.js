// -----------------------------------------------------------------------------
// Modo demo.
//
// Esta página se le enseña al dueño de @aprovechalo.ve antes de vendérsela. En
// demo se ve casi todo —así se entiende qué se compra— pero no se puede usar
// de verdad:
//
//   · antes de ver nada hay que pasar una puerta con contraseña,
//   · el listado se corta al sexto vehículo y el resto queda difuminado,
//   · el formulario de contacto no manda nada a ningún teléfono real,
//   · los botones de WhatsApp no abren conversación con el negocio.
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
 * El enlace para escribirle al negocio por un vehículo.
 *
 * En demo devuelve null y quien lo use enseña el cartel de bloqueado en vez
 * del botón: un desconocido probando la demo no puede hacerle llegar mensajes
 * al cliente real.
 *
 * Fuera de demo, si todavía no hay número de WhatsApp configurado, cae al DM
 * de Instagram, que es por donde hoy entra todo el mundo.
 */
export function enlaceDeWhatsapp(vehiculo) {
  if (esDemo()) return null;

  const { whatsapp, instagramUrl } = config.business;
  if (!whatsapp) return instagramUrl;

  const texto = vehiculo
    ? `Hola, me interesa el ${vehiculo.tituloLargo || vehiculo.titulo} ${vehiculo.anio}. ¿Sigue disponible?`
    : "Hola, vi la página y quiero información sobre los vehículos.";

  return `https://wa.me/${whatsapp}?text=${encodeURIComponent(texto)}`;
}
