"use client";

// -----------------------------------------------------------------------------
// El carrito.
//
// Vive en el navegador (localStorage) hasta que el cliente pulsa "confirmar":
// ahí se manda a /api/checkout, que es quien lo guarda en Supabase. Así se
// puede comprar sin cuenta, que es como compra casi todo el mundo por WhatsApp.
//
// De cada producto guardamos los TRES precios, no solo el de la forma de pago
// elegida, porque el cliente puede cambiar de idea en el checkout y el total
// tiene que recalcularse sin volver a consultar el catálogo.
// -----------------------------------------------------------------------------

import { createContext, useContext, useEffect, useMemo, useReducer } from "react";

const LLAVE = "hardcore.carrito.v1";

const CarritoContexto = createContext(null);

// Un producto con dos variaciones distintas son dos líneas del carrito.
const lineaId = (slug, variacion) => `${slug}::${variacion || ""}`;

function reducer(estado, accion) {
  switch (accion.tipo) {
    case "cargar":
      return accion.items;

    case "agregar": {
      const id = lineaId(accion.item.slug, accion.item.variacion);
      const existe = estado.find((l) => l.id === id);
      if (existe) {
        return estado.map((l) =>
          l.id === id ? { ...l, cantidad: Math.min(l.cantidad + accion.item.cantidad, 99) } : l
        );
      }
      return [...estado, { ...accion.item, id }];
    }

    case "cantidad":
      return estado
        .map((l) => (l.id === accion.id ? { ...l, cantidad: accion.cantidad } : l))
        .filter((l) => l.cantidad > 0);

    case "quitar":
      return estado.filter((l) => l.id !== accion.id);

    case "vaciar":
      return [];

    default:
      return estado;
  }
}

export function CarritoProvider({ children }) {
  const [items, despachar] = useReducer(reducer, []);

  // Primera carga desde localStorage. Si está corrupto, se empieza de cero:
  // no merece la pena romper la tienda por un carrito viejo.
  useEffect(() => {
    try {
      const guardado = window.localStorage.getItem(LLAVE);
      if (guardado) despachar({ tipo: "cargar", items: JSON.parse(guardado) });
    } catch {
      window.localStorage.removeItem(LLAVE);
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(LLAVE, JSON.stringify(items));
    } catch {
      // Modo privado o almacenamiento lleno: el carrito sigue funcionando en
      // esta pestaña, simplemente no sobrevive a la recarga.
    }
  }, [items]);

  const valor = useMemo(() => {
    const unidades = items.reduce((suma, l) => suma + l.cantidad, 0);

    // Total con cada forma de pago. Una línea sin precio para esa forma
    // (pasa en algún producto del catálogo) cuenta como 0 y se avisa aparte.
    const totalCon = (metodo) =>
      items.reduce((suma, l) => suma + (l.precios?.[metodo] ?? 0) * l.cantidad, 0);

    const sinPrecio = (metodo) =>
      items.filter((l) => l.precios?.[metodo] === null || l.precios?.[metodo] === undefined);

    return {
      items,
      unidades,
      lineas: items.length,
      totalCon,
      sinPrecio,
      agregar: (item) => despachar({ tipo: "agregar", item: { cantidad: 1, ...item } }),
      cambiarCantidad: (id, cantidad) =>
        despachar({ tipo: "cantidad", id, cantidad: Math.max(0, Math.min(99, cantidad)) }),
      quitar: (id) => despachar({ tipo: "quitar", id }),
      vaciar: () => despachar({ tipo: "vaciar" }),
    };
  }, [items]);

  return <CarritoContexto.Provider value={valor}>{children}</CarritoContexto.Provider>;
}

export function useCarrito() {
  const contexto = useContext(CarritoContexto);
  if (!contexto) throw new Error("useCarrito necesita estar dentro de <CarritoProvider>");
  return contexto;
}
