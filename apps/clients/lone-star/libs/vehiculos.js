// -----------------------------------------------------------------------------
// El inventario.
//
// La fuente de verdad es data/vehiculos.json. Se lee del disco, no de una base
// de datos, porque un inventario de un par de docenas de unidades que cambia
// un par de veces por semana no necesita más, y así la página funciona sin
// depender de nada externo.
//
// EL CORTE PRINCIPAL DE ESTE NEGOCIO ES QUÉ SE ESTÁ COMPRANDO: un LOTE concreto
// que está ahora mismo en una subasta de Estados Unidos —con sus millas, su
// daño primario y si arranca y rueda—, o un MODELO A PEDIDO, que se busca en
// subasta a la medida de quien lo pide y se entrega "desde" un precio. Son dos
// preguntas distintas ("¿cuánto por esa?" contra "¿cuánto me sale una así?")
// y por eso el `segmento` manda sobre todo lo demás.
//
// Todo lo que pinta la web pasa por aquí: si mañana esto se muda a Supabase,
// se cambia `leerVehiculos` y el resto del sitio ni se entera.
// -----------------------------------------------------------------------------

import catalogo from "@/data/vehiculos.json";

/** El primer corte: el lote en subasta o el modelo que se trae a pedido. */
export const SEGMENTOS = [
  {
    slug: "subasta",
    nombre: "En subasta",
    corto: "Subasta",
    singular: "lote en subasta",
    plural: "lotes en subasta",
    etiquetaPrecio: "Puja estimada",
    resumen:
      "Lotes que están ahora en las subastas de Estados Unidos, con su millaje, su daño primario y si arrancan y ruedan.",
  },
  {
    slug: "pedido",
    nombre: "A pedido",
    corto: "A pedido",
    singular: "modelo a pedido",
    plural: "modelos a pedido",
    etiquetaPrecio: "Desde",
    resumen:
      "Nos dices qué buscas y lo buscamos en subasta: comprado, reparado y exportado hasta tu país.",
  },
];

/** Las carrocerías, en el orden en que se enseñan. */
export const TIPOS = [
  { slug: "pickup", nombre: "Pickups", singular: "pickup", plural: "pickups" },
  { slug: "suv", nombre: "Camionetas", singular: "camioneta", plural: "camionetas" },
  { slug: "sedan", nombre: "Sedanes", singular: "sedán", plural: "sedanes" },
];

/**
 * Cómo está el lote en la subasta. Los nombres van en inglés porque así los
 * escribe la subasta y así los escriben ellos en sus piezas ("Run & Drive");
 * al lado va lo que quiere decir.
 */
export const CONDICIONES = [
  {
    slug: "run-drive",
    nombre: "Run & Drive",
    corto: "Run & Drive",
    resumen: "Arranca y rueda por sus propios medios.",
  },
  {
    slug: "arranca",
    nombre: "Enciende",
    corto: "Enciende",
    resumen: "El motor enciende, pero no se movió en el patio.",
  },
];

/** El daño primario del reporte de subasta, con su traducción al lado. */
export const DANIOS = {
  "Rear End": "trasero",
  "Front End": "frontal",
  Side: "lateral",
  Hail: "granizo",
  "Minor Dent/Scratches": "abolladuras y rayones leves",
};

export const ESTADOS = {
  disponible: { texto: "Disponible", punto: "bg-emerald-500", clase: "text-emerald-400" },
  reservado: { texto: "Reservado", punto: "bg-amber-500", clase: "text-amber-400" },
  vendido: { texto: "Vendido", punto: "bg-base-content/35", clase: "text-base-content/50" },
};

/** Una unidad, con lo derivado ya calculado. */
function normalizar(v) {
  const enSubasta = v.segmento !== "pedido";
  const tituloLargo = [v.marca, v.modelo, v.version].filter(Boolean).join(" ");

  return {
    ...v,
    titulo: `${v.marca} ${v.modelo}`,
    tituloLargo,
    // El nombre con el año, si se sabe. Un modelo a pedido no tiene un año,
    // tiene un rango —o ninguno, si la publicación no lo dice—, y escribir
    // "Corolla null" es peor que no escribir nada.
    nombreCompleto: [tituloLargo, v.anio || v.anios].filter(Boolean).join(" "),
    anioTexto: v.anio ? String(v.anio) : v.anios || "",
    tipo: TIPOS.find((t) => t.slug === v.carroceria) || TIPOS[0],
    segmentoInfo: SEGMENTOS.find((s) => s.slug === v.segmento) || SEGMENTOS[0],
    condicionInfo: CONDICIONES.find((c) => c.slug === v.condicion) || null,
    enSubasta,
    corre: v.condicion === "run-drive",
    danioTexto: v.danio ? `${v.danio}${DANIOS[v.danio] ? ` · ${DANIOS[v.danio]}` : ""}` : "",
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
 * Sus publicaciones casi nunca llevan precio —solo el Corolla, "a partir de
 * $16,000"—, así que el resto son referencias hasta que el cliente cargue los
 * suyos. Lo usa el aviso de la portada y el sello de las fichas.
 */
export function hayPreciosProvisionales() {
  return leerVehiculos().some((v) => v.precioProvisional);
}

/** ¿Y alguna unidad que no salga de su Instagram, sino puesta de muestra? */
export function hayUnidadesDeMuestra() {
  return leerVehiculos().some((v) => v.muestra);
}

/** Cuántas unidades salen, una a una, de su propio Instagram. */
export function totalVerificadas() {
  return leerVehiculos().filter((v) => !v.muestra).length;
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
    precioMin: precios.length ? Math.min(...precios) : 0,
    precioMax: precios.length ? Math.max(...precios) : 0,
  };
}

/**
 * El buscador. Todos los criterios son opcionales y se acumulan.
 *
 * `q` busca en marca, modelo, versión, año y daño a la vez, que es como la
 * gente escribe de verdad: "tacoma 2026", "rav4 frontal", "pickup run drive".
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
    // El modelo a pedido no tiene un año fijo: se busca del año que se pida,
    // así que no se cae del filtro.
    lista = lista.filter((v) => !v.anio || v.anio >= Number(anioMin));
  }

  if (q?.trim()) {
    const palabras = q.toLowerCase().trim().split(/\s+/);
    lista = lista.filter((v) => {
      const heno = `${v.marca} ${v.modelo} ${v.version || ""} ${v.anioTexto} ${v.carroceria} ${
        v.tipo?.singular || ""
      } ${v.enSubasta ? "subasta lote" : "pedido encargo"} ${v.condicionInfo?.nombre || ""} ${
        v.danioTexto
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
      return lista.sort((a, b) => (b.anio || 0) - (a.anio || 0));
    case "millas-asc":
      // El millaje desconocido se va al final: si contara como 0 se colaría
      // delante de los lotes con millaje de verdad.
      return lista.sort(
        (a, b) =>
          (Number.isFinite(a.millas) ? a.millas : Infinity) -
          (Number.isFinite(b.millas) ? b.millas : Infinity)
      );
    default:
      return lista;
  }
}
