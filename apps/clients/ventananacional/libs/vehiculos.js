// -----------------------------------------------------------------------------
// El inventario.
//
// La fuente de verdad es data/vehiculos.json, que replica cómo publica la
// cuenta: un vehículo por publicación, con su ficha y su texto. Se lee del
// disco, no de una base de datos, porque un inventario de decenas de vehículos
// que cambia un par de veces por semana no necesita más, y así la página
// funciona sin depender de nada externo.
//
// Todo lo que pinta la web pasa por aquí: si mañana esto se muda a Supabase,
// se cambia `leerVehiculos` y el resto del sitio ni se entera.
// -----------------------------------------------------------------------------

import catalogo from "@/data/vehiculos.json";

/** Las carrocerías, en el orden en que se enseñan. */
export const TIPOS = [
  { slug: "camioneta", nombre: "Camionetas", plural: "camionetas" },
  { slug: "pickup", nombre: "Pick-up", plural: "pick-up" },
  { slug: "sedan", nombre: "Carros", plural: "carros" },
  { slug: "moto", nombre: "Motos", plural: "motos" },
];

// Los tonos son los claros de cada color: sobre el grafito de la casa, un
// verde o un ámbar oscuros no se leen.
export const ESTADOS = {
  disponible: { texto: "Disponible", punto: "bg-emerald-400", clase: "text-emerald-300" },
  reservado: { texto: "Reservado", punto: "bg-amber-400", clase: "text-amber-300" },
  vendido: { texto: "Vendido", punto: "bg-base-content/35", clase: "text-base-content/50" },
};

/** Un vehículo, con lo derivado ya calculado. */
function normalizar(v) {
  return {
    ...v,
    titulo: `${v.marca} ${v.modelo}`,
    tituloLargo: [v.marca, v.modelo, v.version].filter(Boolean).join(" "),
    tipo: TIPOS.find((t) => t.slug === v.carroceria) || TIPOS[2],
    disponible: v.estado === "disponible",
  };
}

/** Todo el inventario. El vendido va al final: se enseña, pero no estorba. */
export function leerVehiculos() {
  const lista = (catalogo.vehiculos || []).map(normalizar);
  const orden = { disponible: 0, reservado: 1, vendido: 2 };
  return lista.sort((a, b) => (orden[a.estado] ?? 9) - (orden[b.estado] ?? 9));
}

export function vehiculoPorSlug(slug) {
  return leerVehiculos().find((v) => v.slug === slug) || null;
}

/** ¿Queda algún dato inventado en el catálogo? Lo usa el aviso de la portada. */
export function hayMuestra() {
  return leerVehiculos().some((v) => v.muestra);
}

export function actualizadoEn() {
  return catalogo.actualizado || null;
}

/** De qué se pueden armar filtros, contando cuántos hay de cada cosa. */
export function facetasDe(vehiculos) {
  const contar = (campo) => {
    const mapa = new Map();
    for (const v of vehiculos) {
      const valor = v[campo];
      if (!valor) continue;
      mapa.set(valor, (mapa.get(valor) || 0) + 1);
    }
    return [...mapa.entries()]
      .map(([valor, total]) => ({ valor, total }))
      .sort((a, b) => b.total - a.total || String(a.valor).localeCompare(String(b.valor)));
  };

  const precios = vehiculos.map((v) => v.precio).filter(Number.isFinite);

  return {
    marcas: contar("marca"),
    tipos: TIPOS.map((t) => ({
      ...t,
      total: vehiculos.filter((v) => v.carroceria === t.slug).length,
    })).filter((t) => t.total > 0),
    ubicaciones: contar("ubicacion"),
    precioMin: precios.length ? Math.min(...precios) : 0,
    precioMax: precios.length ? Math.max(...precios) : 0,
  };
}

/**
 * El buscador. Todos los criterios son opcionales y se acumulan.
 *
 * `q` busca en marca, modelo, versión y año a la vez, que es como la gente
 * escribe de verdad: "hilux 4x4", "corolla 2019".
 *
 * `sede` no compara la cadena entera sino que busca dentro: la ficha guarda
 * "El Rosal, Caracas" y el enlace de la portada manda solo "Caracas".
 */
export function filtrar(vehiculos, { tipo, marca, sede, precioMax, anioMin, q, orden } = {}) {
  let lista = [...vehiculos];

  if (tipo) lista = lista.filter((v) => v.carroceria === tipo);
  if (marca) lista = lista.filter((v) => v.marca === marca);
  if (sede) {
    const buscado = String(sede).toLowerCase();
    lista = lista.filter((v) => (v.ubicacion || "").toLowerCase().includes(buscado));
  }
  if (Number.isFinite(Number(precioMax)) && Number(precioMax) > 0) {
    lista = lista.filter((v) => v.precio <= Number(precioMax));
  }
  if (Number.isFinite(Number(anioMin)) && Number(anioMin) > 0) {
    lista = lista.filter((v) => v.anio >= Number(anioMin));
  }

  if (q?.trim()) {
    const palabras = q.toLowerCase().trim().split(/\s+/);
    lista = lista.filter((v) => {
      const heno = `${v.marca} ${v.modelo} ${v.version || ""} ${v.anio} ${v.carroceria}`.toLowerCase();
      return palabras.every((p) => heno.includes(p));
    });
  }

  switch (orden) {
    case "precio-asc":
      return lista.sort((a, b) => a.precio - b.precio);
    case "precio-desc":
      return lista.sort((a, b) => b.precio - a.precio);
    case "anio-desc":
      return lista.sort((a, b) => b.anio - a.anio);
    case "km-asc":
      return lista.sort((a, b) => a.km - b.km);
    default:
      return lista;
  }
}
