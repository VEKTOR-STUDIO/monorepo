// -----------------------------------------------------------------------------
// Modo demo.
//
// La tienda se enseña a posibles clientes antes de venderla. En demo se ve casi
// todo —así se entiende qué se compra— pero no se puede usar de verdad:
//
//   · el catálogo se corta al duodécimo producto y el resto queda difuminado,
//   · el pedido no sale hacia el WhatsApp real de Hardcore,
//   · el panel se puede recorrer pero no escribe nada,
//   · el panel nunca consulta pedidos reales, por si algún día hay base de
//     datos conectada con la demo todavía encendida.
//
// Todo pasa por aquí para que apagarlo sea una variable de entorno y no una
// cacería por el código.
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
 * Pedidos de ejemplo para que el panel no se vea vacío en la demo.
 *
 * Son inventados a propósito y se marcan como tales en la interfaz: el nombre
 * del cliente lo dice y la pantalla lleva un aviso. Los productos sí salen del
 * catálogo real, para que se vea cómo queda un pedido de verdad.
 *
 * Nunca se mezclan con datos reales: en demo el panel ni siquiera consulta la
 * tabla de pedidos.
 */
export function pedidosDeEjemplo(productos) {
  if (!productos?.length) return [];

  const elegir = (cuantos, desde) =>
    productos.filter((p) => p.precioContado).slice(desde, desde + cuantos);

  const armar = (codigo, nombre, telefono, metodo, entrega, estado, horasAtras, elegidos) => {
    const items = elegidos.map((producto, i) => {
      const cantidad = i === 0 ? 2 : 1;
      return {
        id: `${codigo}-${i}`,
        nombre: producto.nombre,
        variacion: producto.variaciones?.[0] || null,
        cantidad,
        precio_unitario: producto.precioContado,
        subtotal: Number((producto.precioContado * cantidad).toFixed(2)),
      };
    });

    const subtotal = Number(items.reduce((suma, l) => suma + l.subtotal, 0).toFixed(2));

    return {
      codigo,
      nombre,
      telefono,
      email: null,
      direccion: entrega === "retiro" ? null : "Dirección de ejemplo, Caracas",
      nota: null,
      metodo_pago: metodo,
      entrega,
      subtotal,
      tasa_bcv: null,
      total_bs: null,
      estado,
      creado_en: new Date(Date.now() - horasAtras * 3600 * 1000).toISOString(),
      pedido_items: items,
      esEjemplo: true,
    };
  };

  return [
    armar("HC-0000-DEMO", "Pedido de ejemplo", "0412 000 0000", "contado", "retiro", "nuevo", 3, elegir(2, 0)),
    armar("HC-0001-DEMO", "Pedido de ejemplo", "0414 000 0000", "pago_movil", "delivery", "confirmado", 26, elegir(2, 5)),
    armar("HC-0002-DEMO", "Pedido de ejemplo", "0424 000 0000", "bcv", "envio", "entregado", 70, elegir(1, 12)),
  ];
}
