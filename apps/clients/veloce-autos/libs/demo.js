// -----------------------------------------------------------------------------
// Modo demo.
//
// Esta página se le enseña a Veloce Autos antes de vendérsela. En demo se ve
// casi todo —así se entiende qué se compra— pero no se puede usar de verdad:
//
//   · antes de ver nada hay que pasar una puerta con contraseña,
//   · el inventario se corta a la sexta unidad y el resto queda difuminado,
//   · el formulario de contacto no manda nada a ningún teléfono real,
//   · los botones de WhatsApp no abren conversación con el negocio.
//
// Lo último importa más que de costumbre: el número que lleva esta demo es el
// WhatsApp corporativo que ellos publican, y está en uso. Un desconocido
// probando la demo no puede acabar escribiéndoles.
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

/** El mensaje con el que llega un comprador por un vehículo concreto. */
export function mensajePorVehiculo(vehiculo) {
  if (!vehiculo) {
    return "Hola, vi la página de Veloce Autos y quiero información sobre los vehículos.";
  }

  const cual = `${vehiculo.tituloLargo || vehiculo.titulo} ${vehiculo.anio}`;
  // Dos mensajes distintos porque son dos conversaciones distintas: una se
  // resuelve viniendo al showroom y la otra empieza un encargo.
  return vehiculo.enShowroom
    ? `Hola, me interesa el ${cual} que tienen en ${vehiculo.sedeInfo?.corto || "showroom"}. ¿Sigue disponible?`
    : `Hola, quiero cotizar un ${cual} por importación directa. ¿Cuánto sale puesto en Caracas y cuánto tarda?`;
}

/**
 * El enlace para escribirle al negocio por un vehículo.
 *
 * En demo devuelve null y quien lo use enseña el cartel de bloqueado en vez
 * del botón: un desconocido probando la demo no puede hacerle llegar mensajes
 * al cliente real.
 *
 * Fuera de demo va al WhatsApp corporativo que publican en la bio. Si algún
 * día se vacía ese número, cae al DM de Instagram.
 */
export function enlaceDeWhatsapp(vehiculo) {
  if (esDemo()) return null;

  const { whatsapp, instagramUrl } = config.business;
  if (!whatsapp) return instagramUrl;

  return `https://wa.me/${whatsapp}?text=${encodeURIComponent(mensajePorVehiculo(vehiculo))}`;
}
