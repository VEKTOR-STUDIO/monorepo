// -----------------------------------------------------------------------------
// Modo demo.
//
// Esta página se le enseña a Coronado Carss antes de vendérsela. En demo se ve
// casi todo —así se entiende qué se compra— pero no se puede usar de verdad:
//
//   · antes de ver nada hay que pasar una puerta con contraseña,
//   · el inventario se corta a la sexta unidad y el resto queda difuminado,
//   · el formulario de contacto no manda nada a ningún sitio,
//   · el formulario de «vende o consigna tu carro» tampoco,
//   · los botones de WhatsApp no abren conversación con el negocio.
//
// Ese último corte no es cosmético: su WhatsApp es el de la bio de una cuenta
// de 71,8 mil seguidores, el mismo que atiende a los compradores de verdad. Un
// desconocido probando la demo no puede hacerle llegar avalúos falsos ni
// preguntas por carros que no existen.
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
 * El canal es el WhatsApp de su bio ("Link Directo al WhatsApp 👇"), el mismo
 * que imprimen al pie de cada publicación. Si algún día se vaciara
 * `config.business.whatsapp`, los botones caen al DM de Instagram en vez de a
 * un enlace roto.
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
  // Se pide verlo en el mismo mensaje: preguntar "¿sigue disponible?" y tener
  // que escribir otra vez para ir al local son dos mensajes donde cabe uno.
  return vehiculo.esNuevo
    ? `Hola, me interesa el ${cual} 0 km que vi en la página. ¿Sigue disponible? Quisiera ir a verlo.`
    : `Hola, me interesa el ${cual} que vi en la página. ¿Sigue disponible? Quisiera ir a verlo.`;
}

/** El mensaje de quien viene a PONER su carro a la venta, no a comprar. */
export function mensajeParaVender() {
  return `Hola, quiero vender mi carro con ${config.business.nombre} (compra o consignación). ¿Cómo hacemos el avalúo?`;
}

/**
 * El enlace para escribirle al negocio por una unidad.
 *
 * En demo devuelve null y quien lo use enseña el cartel de bloqueado en vez del
 * botón: un desconocido probando la demo no puede hacerle llegar mensajes al
 * cliente real.
 *
 * Fuera de demo escribe por WhatsApp, con la unidad ya puesta en el mensaje.
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
