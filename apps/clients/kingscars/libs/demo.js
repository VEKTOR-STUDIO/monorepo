// -----------------------------------------------------------------------------
// Modo demo.
//
// Esta página se le enseña a Kings Cars antes de vendérsela. En demo se ve casi
// todo —así se entiende qué se compra— pero no se puede usar de verdad:
//
//   · antes de ver nada hay que pasar una puerta con contraseña,
//   · el inventario se corta a la sexta unidad y el resto queda difuminado,
//   · el formulario de contacto no manda nada a ningún sitio,
//   · el formulario de «publica tu vehículo» tampoco,
//   · los botones de escribir no abren conversación con el negocio.
//
// Ese último corte no es cosmético: un desconocido probando la demo no puede
// hacerle llegar avalúos falsos ni citas inventadas a un negocio que atiende
// SOLO CON CITA PREVIA. Ahí una cita falsa no es un mensaje de más: es una hora
// de local reservada para nadie.
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
 * Por dónde se contacta de verdad con esta casa.
 *
 * AQUÍ NO HAY UN NÚMERO DE WHATSAPP, y no es un olvido: Kings Cars no publica
 * ninguno. Su bio manda a un enlace de agenda y en sus piezas no aparece un
 * teléfono. Así que mientras `config.business.whatsapp` esté vacío, el canal
 * es el DM de Instagram, que es por donde los contactan hoy.
 *
 * Se resuelve en un solo sitio para que el día que den el número solo haya que
 * rellenar el config y todos los botones de la web cambien a la vez.
 */
export function canalDeContacto() {
  return config.business.whatsapp?.trim() ? "whatsapp" : "instagram";
}

/**
 * El mensaje con el que llega un comprador por una unidad concreta.
 *
 * Sin unidad —el botón general de la portada— se manda el mensaje genérico:
 * escribir "me interesa el undefined" es peor que no personalizar nada.
 */
export function mensajePorVehiculo(vehiculo) {
  const nombre = vehiculo?.tituloLargo || vehiculo?.titulo;
  if (!nombre) {
    return `Hola, vi la página de ${config.business.nombre} y quiero información sobre las unidades disponibles.`;
  }

  const cual = `${nombre} ${vehiculo.anio}`;
  // Se pide la cita en el mismo mensaje porque aquí se atiende con cita previa:
  // preguntar "¿sigue disponible?" y tener que escribir otra vez para agendar
  // son dos mensajes donde cabe uno.
  return vehiculo.esNuevo
    ? `Hola, me interesa el ${cual} 0 km. ¿Sigue disponible? Quisiera agendar una cita para verlo.`
    : `Hola, me interesa el ${cual}. ¿Sigue disponible? Quisiera agendar una cita para verlo.`;
}

/** El mensaje de quien viene a PONER su carro a la venta, no a comprar. */
export function mensajeParaVender() {
  return `Hola, quiero publicar mi vehículo con ${config.business.nombre}. ¿Cómo hacemos el avalúo?`;
}

/**
 * El enlace para escribirle al negocio por una unidad.
 *
 * En demo devuelve null y quien lo use enseña el cartel de bloqueado en vez del
 * botón: un desconocido probando la demo no puede hacerle llegar mensajes al
 * cliente real.
 *
 * Fuera de demo escribe por WhatsApp si algún día dan un número, y mientras
 * tanto al perfil de Instagram, que es lo que hay.
 */
export function enlaceDeContacto(vehiculo) {
  if (esDemo()) return null;

  const numero = config.business.whatsapp?.trim();
  if (!numero) return config.business.instagramUrl;

  return `https://wa.me/${numero}?text=${encodeURIComponent(mensajePorVehiculo(vehiculo))}`;
}

/** Igual que el anterior, pero para quien viene a vender su carro. */
export function enlaceParaVender() {
  if (esDemo()) return null;

  const numero = config.business.whatsapp?.trim();
  if (!numero) return config.business.instagramUrl;

  return `https://wa.me/${numero}?text=${encodeURIComponent(mensajeParaVender())}`;
}
