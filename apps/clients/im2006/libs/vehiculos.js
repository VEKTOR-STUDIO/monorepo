// -----------------------------------------------------------------------------
// El inventario.
//
// La fuente de verdad es data/vehiculos.json, copiado del feed de @lm2006.ccs:
// una entrada por publicación, con su marca, su modelo, su año y la línea de
// ficha técnica tal como ellos la escriben. Se lee del disco, no de una base de
// datos, porque un catálogo de una decena de unidades que cambia un par de
// veces por semana no necesita más, y así la página funciona sin depender de
// nada externo.
//
// EL CORTE PRINCIPAL NO ES LA CARROCERÍA NI LA CONDICIÓN: ES EL SEGMENTO.
//
// La primera línea de su bio dice «Concesionario de Vehículos y Camiones», y
// tienen un destacado entero dedicado a Sinotruk. Quien entra a comprar un
// Corolla y quien entra a comprar un chasis de quince toneladas no son el mismo
// comprador ni de lejos, así que esa es la primera pregunta que contesta la
// página y el filtro de primer nivel.
//
// La condición (0 km / usado) se queda como dato de ficha y filtro secundario.
// Hoy todo su feed es 0 km, pero la bio ofrece «Compra • Venta • Consignación»,
// así que en cuanto entre una unidad usada el campo ya está y los filtros
// aparecen solos.
//
// Todo lo que pinta la web pasa por aquí: si mañana esto se muda a Supabase,
// se cambia `leerVehiculos` y el resto del sitio ni se entera.
// -----------------------------------------------------------------------------

import catalogo from "@/data/vehiculos.json";

/** El corte principal: lo que se vende con volante y lo que se vende con caja. */
export const SEGMENTOS = [
  {
    slug: "vehiculos",
    nombre: "Vehículos",
    corto: "Vehículos",
    resumen:
      "Carros, camionetas y motos 0 km, con su versión y su motor tal como salen publicados.",
  },
  {
    slug: "camiones",
    nombre: "Camiones",
    corto: "Camiones",
    resumen:
      "Unidades de carga Sinotruk, con su capacidad en toneladas y su motor a la vista.",
  },
];

/** Las carrocerías, en el orden en que se enseñan. */
export const TIPOS = [
  { slug: "suv", nombre: "Camionetas", singular: "camioneta", plural: "camionetas" },
  { slug: "sedan", nombre: "Sedanes", singular: "sedán", plural: "sedanes" },
  { slug: "hatchback", nombre: "Compactos", singular: "compacto", plural: "compactos" },
  { slug: "pickup", nombre: "Pick-ups", singular: "pick-up", plural: "pick-ups" },
  { slug: "camion", nombre: "Camiones", singular: "camión", plural: "camiones" },
  { slug: "moto", nombre: "Motos", singular: "moto", plural: "motos" },
];

/** Dato de ficha y filtro secundario. Ver la nota de arriba. */
export const CONDICIONES = [
  {
    slug: "nuevo",
    nombre: "0 km",
    corto: "0 km",
    resumen: "Unidades nuevas, sin estrenar.",
  },
  {
    slug: "usado",
    nombre: "Usados",
    corto: "Usado",
    resumen: "Revisados uno a uno, con sus papeles y su kilometraje a la vista.",
  },
];

export const ESTADOS = {
  disponible: { texto: "Disponible", punto: "bg-emerald-500", clase: "text-emerald-400" },
  reservado: { texto: "Reservado", punto: "bg-amber-500", clase: "text-amber-400" },
  vendido: { texto: "Vendido", punto: "bg-base-content/35", clase: "text-base-content/50" },
};

/** Una unidad, con lo derivado ya calculado. */
function normalizar(v) {
  return {
    ...v,
    titulo: `${v.marca} ${v.modelo}`,
    tituloLargo: [v.marca, v.modelo, v.version].filter(Boolean).join(" "),
    tipo: TIPOS.find((t) => t.slug === v.carroceria) || TIPOS[1],
    segmentoInfo: SEGMENTOS.find((s) => s.slug === v.segmento) || SEGMENTOS[0],
    condicionInfo: CONDICIONES.find((c) => c.slug === v.condicion) || CONDICIONES[1],
    esCamion: v.segmento === "camiones",
    esNuevo: v.condicion === "nuevo",
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

/**
 * ¿Queda algún precio sin confirmar?
 *
 * Sus publicaciones casi nunca llevan precio —el único que han puesto es el del
 * Corolla HEV—, así que el resto son de referencia hasta que el cliente cargue
 * los suyos. Lo usa el aviso de la portada y el sello de las fichas.
 */
export function hayPreciosProvisionales() {
  return leerVehiculos().some((v) => v.precioProvisional);
}

/**
 * ¿Queda alguna unidad sin su foto?
 *
 * Las fotos se bajan de su Instagram con tools/instagram. Mientras no estén,
 * cada ficha dibuja la silueta de su tipo, y la página lo dice en voz alta en
 * vez de disimularlo con una foto de banco de imágenes que no es suya.
 */
export function hayFotosPendientes() {
  return leerVehiculos().some((v) => v.fotoPendiente || !v.fotos?.length);
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

  // Cada faceta se queda fuera si no tiene nada detrás: mientras todo el
  // catálogo sea 0 km, no tiene sentido enseñar un filtro de condición con una
  // sola opción.
  return {
    segmentos: SEGMENTOS.map((s) => ({
      ...s,
      total: vehiculos.filter((v) => v.segmento === s.slug).length,
    })).filter((s) => s.total > 0),
    marcas: contar("marca"),
    tipos: TIPOS.map((t) => ({
      ...t,
      total: vehiculos.filter((v) => v.carroceria === t.slug).length,
    })).filter((t) => t.total > 0),
    condiciones: CONDICIONES.map((c) => ({
      ...c,
      total: vehiculos.filter((v) => v.condicion === c.slug).length,
    })).filter((c) => c.total > 0),
    ubicaciones: contar("ubicacion"),
    precioMin: precios.length ? Math.min(...precios) : 0,
    precioMax: precios.length ? Math.max(...precios) : 0,
  };
}

/**
 * El buscador. Todos los criterios son opcionales y se acumulan.
 *
 * `q` busca en marca, modelo, versión y año a la vez, que es como la gente
 * escribe de verdad: "corolla 2026", "camión 15 toneladas".
 */
export function filtrar(
  vehiculos,
  { segmento, condicion, tipo, marca, precioMax, anioMin, q, orden } = {}
) {
  let lista = [...vehiculos];

  if (segmento) lista = lista.filter((v) => v.segmento === segmento);
  if (condicion) lista = lista.filter((v) => v.condicion === condicion);
  if (tipo) lista = lista.filter((v) => v.carroceria === tipo);
  if (marca) lista = lista.filter((v) => v.marca === marca);
  if (Number.isFinite(Number(precioMax)) && Number(precioMax) > 0) {
    lista = lista.filter((v) => v.precio <= Number(precioMax));
  }
  if (Number.isFinite(Number(anioMin)) && Number(anioMin) > 0) {
    lista = lista.filter((v) => v.anio >= Number(anioMin));
  }

  if (q?.trim()) {
    const palabras = q.toLowerCase().trim().split(/\s+/);
    lista = lista.filter((v) => {
      const heno = `${v.marca} ${v.modelo} ${v.version || ""} ${v.anio} ${v.carroceria} ${
        v.segmento
      } ${v.motor || ""} ${(v.detalles || []).join(" ")} ${
        v.esNuevo ? "0 km nuevo" : "usado"
      }`.toLowerCase();
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
      // El kilometraje desconocido —que no siempre publican— se va al final:
      // si contara como 0 se colaría delante de los 0 km de verdad.
      return lista.sort(
        (a, b) =>
          (Number.isFinite(a.km) ? a.km : Infinity) -
          (Number.isFinite(b.km) ? b.km : Infinity)
      );
    default:
      return lista;
  }
}
