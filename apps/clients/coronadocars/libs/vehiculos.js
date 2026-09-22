// -----------------------------------------------------------------------------
// El inventario.
//
// La fuente de verdad es data/vehiculos.json. Se lee del disco, no de una base
// de datos, porque un inventario de un par de docenas de unidades que cambia
// un par de veces por semana no necesita más, y así la página funciona sin
// depender de nada externo.
//
// EL CORTE PRINCIPAL DE ESTE NEGOCIO ES LA CONDICIÓN: USADO CONTRA 0 KM. No la
// carrocería, y no una división por sedes: Coronado Carss tiene un solo local,
// en el Grupo Autos del Centro de Valencia, y la ficha de cada post empieza por
// el AÑO, que es lo primero que mira quien compra usado. Son dos compradores
// que no se parecen: uno busca el mejor usado que le alcance y el otro viene a
// estrenar. Por eso la `condicion` manda y la carrocería queda en segundo nivel.
//
// Aquí NO hay `segmento`: se quitó al reidentificar la página. Esta casa vende
// carros, punto, y un campo que siempre vale lo mismo es un campo que alguien
// acabará rellenando mal.
//
// Todo lo que pinta la web pasa por aquí: si mañana esto se muda a Supabase,
// se cambia `leerVehiculos` y el resto del sitio ni se entera.
// -----------------------------------------------------------------------------

import catalogo from "@/data/vehiculos.json";

/**
 * El primer corte: usados y 0 km.
 *
 * El usado va PRIMERO porque es lo que de verdad mueve esta casa: lo que se ve
 * en su cuenta es casi todo de segunda mano —el Yaris 2008 con 188.000 km es
 * el ejemplo típico— y ahí es donde tienen el ojo.
 */
export const CONDICIONES = [
  {
    slug: "usado",
    nombre: "Usados",
    corto: "Usado",
    singular: "usado",
    plural: "usados",
    resumen:
      "Fotografiados en el local, con su año, su modelo, su kilometraje y su transmisión a la vista.",
  },
  {
    slug: "nuevo",
    nombre: "0 km",
    corto: "0 km",
    singular: "0 km",
    plural: "0 km",
    resumen: "Unidades nuevas, sin rodar, listas para salir con su documentación.",
  },
];

/**
 * Las carrocerías, en el orden en que se enseñan.
 *
 * Son las cinco que se mueven en el mercado de usados de Valencia, que es
 * donde vende esta casa. No hay camiones ni furgones: esa es otra clase de negocio y
 * dejar la opción puesta solo invita a rellenarla.
 */
export const TIPOS = [
  { slug: "sedan", nombre: "Sedanes", singular: "sedán", plural: "sedanes" },
  { slug: "suv", nombre: "Camionetas", singular: "camioneta", plural: "camionetas" },
  { slug: "hatchback", nombre: "Hatchbacks", singular: "hatchback", plural: "hatchbacks" },
  { slug: "pickup", nombre: "Pick-ups", singular: "pick-up", plural: "pick-ups" },
  { slug: "coupe", nombre: "Coupés", singular: "coupé", plural: "coupés" },
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
    condicionInfo: CONDICIONES.find((c) => c.slug === v.condicion) || CONDICIONES[0],
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
 * Coronado Carss no publica precios en sus fichas —ni en el Yaris que sí es
 * suyo—, así que todos los del JSON son referencias de mercado hasta que el
 * cliente cargue los suyos. Lo usa el aviso de la
 * portada y el sello de las fichas.
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
 * `q` busca en marca, modelo, versión, año, carrocería y transmisión a la vez,
 * que es como la gente escribe de verdad: "corolla 2006", "camioneta 4x4",
 * "sedán automático usado".
 */
export function filtrar(
  vehiculos,
  { condicion, tipo, marca, precioMax, anioMin, q, orden } = {}
) {
  let lista = [...vehiculos];

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
        v.tipo?.singular || ""
      } carro vehiculo ${v.esNuevo ? "0 km nuevo" : "usado"} ${
        v.transmision || ""
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
