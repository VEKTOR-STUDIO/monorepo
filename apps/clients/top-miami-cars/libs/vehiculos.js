// -----------------------------------------------------------------------------
// El inventario.
//
// La fuente de verdad es data/vehiculos.json. Se lee del disco, no de una base
// de datos, porque un inventario de un par de docenas de unidades que cambia
// un par de veces por semana no necesita más, y así la página funciona sin
// depender de nada externo.
//
// EL CORTE PRINCIPAL DE ESTE NEGOCIO ES LA CARROCERÍA. Top Miami Cars es, según
// su ficha de Google, un "concesionario de automóviles usados": no hay 0 km
// contra usados ni carros contra camiones que separar. Lo primero que pregunta
// quien entra a un salón de usados es "¿qué camionetas tienes?" o "¿tienes
// algún sedán?", y por eso la carrocería manda sobre todo lo demás.
//
// La condición (0 km / usado) se conserva en el dato por si algún día entra una
// unidad nueva, pero mientras todo sea usado el filtro ni se enseña.
//
// Todo lo que pinta la web pasa por aquí: si mañana esto se muda a Supabase,
// se cambia `leerVehiculos` y el resto del sitio ni se entera.
// -----------------------------------------------------------------------------

import catalogo from "@/data/vehiculos.json";

/** Las carrocerías, en el orden en que se enseñan. */
export const TIPOS = [
  {
    slug: "suv",
    nombre: "Camionetas",
    singular: "camioneta",
    plural: "camionetas",
    resumen: "Altas, con espacio y buen despeje: lo que más se mueve en Caracas.",
  },
  {
    slug: "sedan",
    nombre: "Sedanes",
    singular: "sedán",
    plural: "sedanes",
    resumen: "Para el día a día: rinden, se consiguen los repuestos y se revenden bien.",
  },
  {
    slug: "pickup",
    nombre: "Pick-ups",
    singular: "pick-up",
    plural: "pick-ups",
    resumen: "De trabajo y de paseo, doble cabina, 4x2 y 4x4.",
  },
  {
    slug: "hatchback",
    nombre: "Compactos",
    singular: "compacto",
    plural: "compactos",
    resumen: "Pequeños, rendidores y fáciles de estacionar.",
  },
  {
    slug: "coupe",
    nombre: "Deportivos",
    singular: "deportivo",
    plural: "deportivos",
    resumen: "Dos puertas, motor grande y pocas unidades.",
  },
];

/** El segundo corte, que hoy no se enseña: todo lo que hay es usado. */
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
    resumen: "Revisados uno a uno, con su kilometraje a la vista.",
  },
];

export const ESTADOS = {
  disponible: { texto: "Disponible", punto: "bg-emerald-600", clase: "text-emerald-700" },
  reservado: { texto: "Reservado", punto: "bg-amber-500", clase: "text-amber-700" },
  vendido: { texto: "Vendido", punto: "bg-base-content/35", clase: "text-base-content/50" },
};

/** Una unidad, con lo derivado ya calculado. */
function normalizar(v) {
  return {
    ...v,
    titulo: `${v.marca} ${v.modelo}`,
    tituloLargo: [v.marca, v.modelo, v.version].filter(Boolean).join(" "),
    tipo: TIPOS.find((t) => t.slug === v.carroceria) || TIPOS[0],
    condicionInfo: CONDICIONES.find((c) => c.slug === v.condicion) || CONDICIONES[1],
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
 * De Top Miami Cars no hay inventario publicado que leer, así que los precios
 * del JSON son de referencia hasta que el cliente cargue los suyos. Lo usa el
 * aviso de la portada y el sello de las fichas.
 */
export function hayPreciosProvisionales() {
  return leerVehiculos().some((v) => v.precioProvisional);
}

/** ¿Y alguna unidad que no sea suya, sino puesta de muestra? Hoy, todas. */
export function hayUnidadesDeMuestra() {
  return leerVehiculos().some((v) => v.deMuestra);
}

/** Cuántas unidades son de verdad suyas. Hoy, ninguna. */
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
 * `q` busca en marca, modelo, versión y año a la vez, que es como la gente
 * escribe de verdad: "4runner 2018", "camioneta automática", "corolla".
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
    // Sin tildes por los dos lados: "sedan" tiene que encontrar "sedán".
    const llano = (t) => t.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const palabras = llano(q).trim().split(/\s+/);
    lista = lista.filter((v) => {
      const heno = `${v.marca} ${v.modelo} ${v.version || ""} ${v.anio} ${v.tipo.singular} ${
        v.tipo.plural
      } ${v.transmision || ""} ${v.esNuevo ? "0 km nuevo" : "usado"}`;
      return palabras.every((p) => llano(heno).includes(p));
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
