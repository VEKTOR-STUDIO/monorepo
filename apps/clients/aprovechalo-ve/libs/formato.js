// Formatos de dinero y de texto que usa toda la tienda.
//
// Los precios del catálogo están en dólares. Dos de las tres formas de pago
// (transferencia BCV y Pago Móvil) se cobran en bolívares a la tasa del día,
// así que casi siempre hay que enseñar las dos cifras juntas.

import config from "@/config";

const DOLAR = new Intl.NumberFormat("es-VE", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

const BOLIVAR = new Intl.NumberFormat("es-VE", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function enDolares(valor) {
  if (valor === null || valor === undefined || Number.isNaN(Number(valor))) return "—";
  return DOLAR.format(Number(valor));
}

export function enBolivares(valor) {
  if (valor === null || valor === undefined || Number.isNaN(Number(valor))) return "—";
  return `Bs. ${BOLIVAR.format(Number(valor))}`;
}

/** Convierte dólares a bolívares con la tasa dada. Sin tasa, null. */
export function aBolivares(dolares, tasa) {
  if (!tasa || dolares === null || dolares === undefined) return null;
  return Number(dolares) * Number(tasa);
}

/** Los tres precios de un producto, listos para pintar. */
export function preciosDe(producto) {
  return [
    { id: "contado", precio: producto.precio_contado ?? producto.precioContado },
    { id: "bcv", precio: producto.precio_bcv ?? producto.precioBcv },
    { id: "pago_movil", precio: producto.precio_pago_movil ?? producto.precioPagoMovil },
  ].map((p) => ({ ...p, ...config.pagos[p.id] }));
}

/** El precio de un producto según cómo vaya a pagar el cliente. */
export function precioSegunPago(producto, metodoPago) {
  const campo = config.pagos[metodoPago]?.campoPrecio || "precio_contado";
  const camelCase = campo.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
  const valor = producto[campo] ?? producto[camelCase];
  return valor === null || valor === undefined ? null : Number(valor);
}

export const ESTADOS = {
  disponible: { texto: "Disponible", clase: "text-success", punto: "bg-success" },
  transito: { texto: "En tránsito", clase: "text-warning", punto: "bg-warning" },
  agotado: { texto: "Agotado", clase: "text-base-content/50", punto: "bg-base-content/40" },
};

export function fechaCorta(valor) {
  if (!valor) return "—";
  return new Date(valor).toLocaleDateString("es-VE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function fechaLarga(valor) {
  if (!valor) return "—";
  return new Date(valor).toLocaleString("es-VE", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
