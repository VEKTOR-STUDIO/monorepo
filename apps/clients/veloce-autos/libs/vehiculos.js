// -----------------------------------------------------------------------------
// El inventario.
//
// La fuente de verdad es data/vehiculos.json. Se lee del disco, no de una base
// de datos, porque un inventario de una veintena de unidades que cambia varias
// veces por semana no necesita más, y así la página funciona sin depender de
// nada externo.
//
// Los ejes por los que se corta este inventario NO son los de un concesionario
// cualquiera. Salen, uno a uno, de lo que Veloce publica de sí misma:
//
//   · PROCEDENCIA — la primera línea de su bio es "Importación Directa •
//     Dubái | Europa | China | USA". Es lo primero que dicen de sí mismos, así
//     que es un filtro de primer nivel y no un dato escondido en la ficha.
//   · ENTREGA — lo que está hoy en el showroom contra lo que se trae por
//     encargo. Es la pregunta que abre cualquier conversación con ellos.
//   · CONDICIÓN — "autos nuevos y usados premium", también de la bio.
//   · SEDE — La Florida y Chacao tienen cuentas distintas (lo dice su
//     comunicado), así que una unidad sin sede manda al comprador a la
//     equivocada.
//
// Todo lo que pinta la web pasa por aquí: si mañana esto se muda a una base de
// datos, se cambia `leerVehiculos` y el resto del sitio ni se entera.
// -----------------------------------------------------------------------------

import catalogo from "@/data/vehiculos.json";
import config from "@/config";

/** Las carrocerías, en el orden en que se enseñan. */
export const TIPOS = [
  { slug: "suv", nombre: "Camionetas", singular: "camioneta", plural: "camionetas" },
  { slug: "pickup", nombre: "Pick-ups", singular: "pick-up", plural: "pick-ups" },
  { slug: "sedan", nombre: "Sedanes", singular: "sedán", plural: "sedanes" },
  { slug: "deportivo", nombre: "Deportivos", singular: "deportivo", plural: "deportivos" },
  { slug: "hatchback", nombre: "Hatchbacks", singular: "hatchback", plural: "hatchbacks" },
];

/**
 * El corte principal: lo que está aquí contra lo que se trae.
 *
 * Es la primera pregunta de cualquiera que escribe —"¿lo tienes?"— y la que
 * decide si la conversación va de venir mañana al showroom o de encargar una
 * unidad a cuatro semanas.
 */
export const ENTREGAS = [
  {
    slug: "showroom",
    nombre: "En showroom",
    corto: "En showroom",
    resumen:
      "Unidades que están hoy en La Florida o en Chacao. Se ven, se prueban y se pueden llevar esta semana.",
  },
  {
    slug: "encargo",
    nombre: "Importación a pedido",
    corto: "A pedido",
    resumen:
      "Se busca en origen con la versión y el color que quieras, y llega nacionalizada y con sus papeles.",
  },
];

/** Nuevos y usados, tal como lo dice su bio. */
export const CONDICIONES = [
  { slug: "nuevo", nombre: "Nuevos", corto: "0 km" },
  { slug: "usado", nombre: "Usados premium", corto: "Usado" },
];

/**
 * Las cuatro procedencias de su bio, en el mismo orden en que las escriben.
 *
 * El `detalle` no es relleno de catálogo: es lo que de verdad cambia entre
 * traer un carro de Dubái y traerlo de Miami, y es justo lo que un comprador
 * pregunta cuando duda entre dos unidades del mismo modelo.
 */
export const ORIGENES = [
  {
    slug: "dubai",
    nombre: "Dubái",
    detalle: "Full equipo de fábrica y kilometraje bajo. Es de donde llegan casi todos los 0 km.",
  },
  {
    slug: "europa",
    nombre: "Europa",
    detalle: "Alemanas y premium, con su historial de servicio documentado.",
  },
  {
    slug: "china",
    nombre: "China",
    detalle: "Marcas nuevas con mucho equipamiento por el precio. Garantía de fábrica incluida.",
  },
  {
    slug: "usa",
    nombre: "USA",
    detalle: "Lo que se vende en Estados Unidos, con su reporte de historial a la vista.",
  },
];

export const ESTADOS = {
  disponible: { texto: "Disponible", punto: "bg-emerald-400", clase: "text-emerald-300" },
  reservado: { texto: "Reservado", punto: "bg-amber-400", clase: "text-amber-300" },
  vendido: { texto: "Vendido", punto: "bg-base-content/35", clase: "text-base-content/50" },
};

/** Las dos sedes salen de config: son datos del negocio, no del inventario. */
export const SEDES = config.business.sedes;

/** Un vehículo, con lo derivado ya calculado. */
function normalizar(v) {
  return {
    ...v,
    titulo: `${v.marca} ${v.modelo}`,
    tituloLargo: [v.marca, v.modelo, v.version].filter(Boolean).join(" "),
    tipo: TIPOS.find((t) => t.slug === v.carroceria) || TIPOS[0],
    condicionInfo: CONDICIONES.find((c) => c.slug === v.condicion) || CONDICIONES[1],
    entregaInfo: ENTREGAS.find((e) => e.slug === v.entrega) || ENTREGAS[0],
    origenInfo: ORIGENES.find((o) => o.slug === v.origen) || null,
    sedeInfo: SEDES.find((s) => s.slug === v.sede) || null,
    esNuevo: v.condicion === "nuevo",
    enShowroom: v.entrega === "showroom",
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
 * ¿Queda alguna unidad que no salga de su Instagram?
 *
 * Mientras el inventario real no esté cargado, la página lo dice en voz alta
 * en la portada, en el inventario y en cada ficha. Enseñar como suyo un
 * vehículo que el negocio no tiene es el detalle que hunde una reunión que iba
 * bien, y avisarlo cuesta una línea.
 *
 * Desaparece solo en cuanto las fichas dejan de llevar `muestra`.
 */
export function hayMuestras() {
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

  const conTotal = (lista, campo) =>
    lista
      .map((x) => ({ ...x, total: vehiculos.filter((v) => v[campo] === x.slug).length }))
      .filter((x) => x.total > 0);

  const precios = vehiculos.map((v) => v.precio).filter(Number.isFinite);

  return {
    marcas: contar("marca"),
    tipos: conTotal(TIPOS, "carroceria"),
    condiciones: conTotal(CONDICIONES, "condicion"),
    entregas: conTotal(ENTREGAS, "entrega"),
    origenes: conTotal(ORIGENES, "origen"),
    sedes: conTotal(SEDES, "sede"),
    precioMin: precios.length ? Math.min(...precios) : 0,
    precioMax: precios.length ? Math.max(...precios) : 0,
  };
}

/**
 * El buscador. Todos los criterios son opcionales y se acumulan.
 *
 * `q` busca en marca, modelo, versión, año y procedencia a la vez, que es como
 * la gente escribe de verdad: "prado dubai", "camioneta 2024", "usado europa".
 */
export function filtrar(
  vehiculos,
  { entrega, condicion, origen, sede, tipo, marca, precioMax, anioMin, q, orden } = {}
) {
  let lista = [...vehiculos];

  if (entrega) lista = lista.filter((v) => v.entrega === entrega);
  if (condicion) lista = lista.filter((v) => v.condicion === condicion);
  if (origen) lista = lista.filter((v) => v.origen === origen);
  if (sede) lista = lista.filter((v) => v.sede === sede);
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
        v.origenInfo?.nombre || ""
      } ${v.esNuevo ? "0 km nuevo" : "usado"} ${
        v.enShowroom ? "showroom disponible" : "encargo importación a pedido"
      }`
        .toLowerCase()
        // "dubái" se escribe sin tilde la mitad de las veces.
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "");
      return palabras.every((p) =>
        heno.includes(p.normalize("NFD").replace(/[̀-ͯ]/g, ""))
      );
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
