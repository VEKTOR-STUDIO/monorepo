// -----------------------------------------------------------------------------
// El inventario.
//
// La fuente de verdad es data/vehiculos.json. Se lee del disco, no de una base
// de datos, porque un inventario de un par de docenas de unidades que cambia
// un par de veces por semana no necesita más, y así la página funciona sin
// depender de nada externo.
//
// EL CORTE PRINCIPAL DE ESTE NEGOCIO NO ES LA CARROCERÍA NI LA CONDICIÓN: ES
// VEHÍCULOS CONTRA CAMIONES. DealerNauta lo tiene partido hasta en dos cuentas
// de Instagram y en dos sedes —los carros en Los Chaguaramos, los camiones en
// San Antonio de los Altos—, y son dos compradores que no se parecen en nada:
// uno viene a cambiar de carro y el otro viene a montar una flota. Por eso el
// `segmento` manda sobre todo lo demás, y la condición (0 km / usado) queda en
// segundo nivel.
//
// Todo lo que pinta la web pasa por aquí: si mañana esto se muda a Supabase,
// se cambia `leerVehiculos` y el resto del sitio ni se entera.
// -----------------------------------------------------------------------------

import catalogo from "@/data/vehiculos.json";

/** El primer corte: los dos negocios que conviven bajo la misma marca. */
export const SEGMENTOS = [
  {
    slug: "auto",
    nombre: "Vehículos",
    corto: "Vehículos",
    singular: "vehículo",
    plural: "vehículos",
    resumen:
      "0 km recién llegados y usados en perfectas condiciones, revisados antes de salir a la venta.",
    sede: "caracas",
  },
  {
    slug: "camion",
    nombre: "Camiones",
    corto: "Camiones",
    singular: "camión",
    plural: "camiones",
    resumen:
      "Nuevos y usados, de carga liviana a pesada. Es el flanco con el que son el N.º 1 a nivel nacional.",
    sede: "san-antonio",
  },
];

/** Las carrocerías, en el orden en que se enseñan. */
export const TIPOS = [
  { slug: "suv", nombre: "Camionetas", singular: "camioneta", plural: "camionetas" },
  { slug: "sedan", nombre: "Sedanes", singular: "sedán", plural: "sedanes" },
  { slug: "pickup", nombre: "Pick-ups", singular: "pick-up", plural: "pick-ups" },
  { slug: "camion", nombre: "Camiones de carga", singular: "camión", plural: "camiones" },
  { slug: "furgon", nombre: "Furgonetas", singular: "furgoneta", plural: "furgonetas" },
];

/** El segundo corte: lo que entra 0 km y lo que entra usado. */
export const CONDICIONES = [
  {
    slug: "nuevo",
    nombre: "0 km",
    corto: "0 km",
    resumen: "Unidades nuevas, sin rodar, listas para salir con su documentación.",
  },
  {
    slug: "usado",
    nombre: "Usados",
    corto: "Usado",
    resumen: "En perfectas condiciones, revisados uno a uno, con su kilometraje a la vista.",
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
    tipo: TIPOS.find((t) => t.slug === v.carroceria) || TIPOS[0],
    segmentoInfo: SEGMENTOS.find((s) => s.slug === v.segmento) || SEGMENTOS[0],
    condicionInfo: CONDICIONES.find((c) => c.slug === v.condicion) || CONDICIONES[1],
    esNuevo: v.condicion === "nuevo",
    esCamion: v.segmento === "camion",
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
 * Instagram no deja leer las publicaciones una a una, así que los precios del
 * JSON son de referencia hasta que el cliente cargue los suyos. Lo usa el
 * aviso de la portada y el sello de las fichas.
 */
export function hayPreciosProvisionales() {
  return leerVehiculos().some((v) => v.precioProvisional);
}

/** ¿Y alguna unidad que no salga de su Instagram, sino puesta de muestra? */
export function hayUnidadesDeMuestra() {
  return leerVehiculos().some((v) => v.deMuestra);
}

/** Cuántas unidades salen, una a una, de su propio Instagram. */
export function totalVerificadas() {
  return leerVehiculos().filter((v) => !v.deMuestra).length;
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
    segmentos: SEGMENTOS.map((s) => ({
      ...s,
      total: vehiculos.filter((v) => v.segmento === s.slug).length,
    })).filter((s) => s.total > 0),
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
 * escribe de verdad: "4runner 2026", "camión 0 km", "corolla usado".
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
        v.segmento === "camion" ? "camion camiones carga" : "vehiculo carro"
      } ${v.esNuevo ? "0 km nuevo" : "usado"}`.toLowerCase();
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
      // El kilometraje desconocido se va al final: si contara como 0 se
      // colaría delante de los 0 km de verdad.
      return lista.sort(
        (a, b) =>
          (Number.isFinite(a.km) ? a.km : Infinity) -
          (Number.isFinite(b.km) ? b.km : Infinity)
      );
    default:
      return lista;
  }
}
