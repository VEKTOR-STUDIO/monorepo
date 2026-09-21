// -----------------------------------------------------------------------------
// El catálogo.
//
// La fuente de verdad es data/catalogo.json. Se lee del disco, no de una base
// de datos, porque un catálogo de un par de docenas de unidades que cambia un
// par de veces por semana no necesita más, y así la página funciona sin
// depender de nada externo.
//
// DOS COSAS MANDAN AQUÍ, Y LAS DOS SALEN DE SU INSTAGRAM:
//
//   1. EL CORTE ES VEHÍCULOS CONTRA MOTOS. Lo dice su propia bio —"planes de
//      créditos para vehículos y motos"— y son dos compradores que no se
//      parecen: uno financia a dos años un carro familiar, el otro se lleva una
//      moto de trabajo con cuota mensual. Por eso `segmento` manda sobre la
//      carrocería y sobre todo lo demás.
//
//   2. LO QUE SE ANUNCIA ES LA CUOTA, NO EL PRECIO. DSS no vende al contado:
//      ninguna de sus publicaciones lleva precio de venta, todas llevan
//      "CUOTAS DESDE 75 SEMANALES" o "DESDE 65$ MENSUAL". Así que cada unidad
//      trae un bloque `credito` y la web enseña esa cifra primero. El precio de
//      contado se guarda porque hace falta para ordenar y para calcular, pero
//      va en segundo plano en toda la interfaz.
//
// Todo lo que pinta la web pasa por aquí: si mañana esto se muda a Supabase, se
// cambia `leerVehiculos` y el resto del sitio ni se entera.
// -----------------------------------------------------------------------------

import catalogo from "@/data/catalogo.json";
import config from "@/config";

/** El primer corte: los dos productos de su bio. */
export const SEGMENTOS = [
  {
    slug: "auto",
    nombre: "Vehículos",
    corto: "Vehículos",
    singular: "vehículo",
    plural: "vehículos",
    resumen:
      "Carros financiados hasta 2 años, con cuotas semanales que se ajustan a lo que puedes pagar.",
  },
  {
    slug: "moto",
    nombre: "Motos",
    corto: "Motos",
    singular: "moto",
    plural: "motos",
    resumen:
      "Motos nuevas con cuota mensual. Es lo que más entregan, y lo que sale de la oficina en menos tiempo.",
  },
];

/** Las carrocerías, en el orden en que se enseñan. */
export const TIPOS = [
  { slug: "sedan", nombre: "Sedanes", singular: "sedán", plural: "sedanes" },
  { slug: "hatchback", nombre: "Hatchbacks", singular: "hatchback", plural: "hatchbacks" },
  { slug: "suv", nombre: "Camionetas", singular: "camioneta", plural: "camionetas" },
  { slug: "pickup", nombre: "Pick-ups", singular: "pick-up", plural: "pick-ups" },
  { slug: "scooter", nombre: "Scooters", singular: "scooter", plural: "scooters" },
  { slug: "moto", nombre: "Motos de calle", singular: "moto", plural: "motos" },
];

/** El segundo corte. */
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
    resumen: "Revisados uno a uno, con su año y su kilometraje a la vista.",
  },
];

export const ESTADOS = {
  disponible: { texto: "Disponible", punto: "bg-emerald-500", clase: "text-emerald-400" },
  reservado: { texto: "Reservado", punto: "bg-amber-500", clase: "text-amber-400" },
  entregado: { texto: "Entregado", punto: "bg-base-content/35", clase: "text-base-content/50" },
};

/**
 * Los dos ritmos de pago que ellos anuncian, con su plural y su adjetivo.
 *
 * Están aquí y no escritos a mano en cada componente porque "semanal" aparece
 * en la ficha, en la tarjeta, en el filtro, en el simulador y en el mensaje de
 * WhatsApp: escribirlo seis veces es garantizar que un día digan cinco cosas.
 */
export const PERIODOS = {
  semanal: { adjetivo: "semanal", cada: "por semana", porAnio: 52, corto: "sem" },
  mensual: { adjetivo: "mensual", cada: "por mes", porAnio: 12, corto: "mes" },
};

/**
 * La cuota de una unidad, ya resuelta.
 *
 * SI EL JSON TRAE UNA CUOTA ESCRITA, MANDA ESA, SIEMPRE. Es el dato que sale
 * del cartel de su publicación y no se toca.
 *
 * SI NO LA TRAE, NO SE INVENTA UNA CIFRA: se usa el ancla de la casa
 * (config.credito.cuotaDesde para vehículos, cuotaMotoDesde para motos) y se
 * marca `calculada` para que la interfaz diga que es una estimación.
 *
 * ESTO ÚLTIMO NO ES PEREZA, ES LO QUE ELLOS HACEN. Mirando sus publicaciones:
 * el Aveo 2006 y el Dodge Caliber 2007 llevan los dos "CUOTAS DESDE 75
 * SEMANALES", y entre uno y otro hay 2.400 dólares de diferencia de precio. El
 * 75 no es el resultado de dividir nada: es el punto de entrada con el que
 * anuncian todo, y el plan de verdad se arma después, en la oficina.
 *
 * La primera versión de esto repartía el saldo entre los pagos del plazo, y el
 * resultado era peor de lo que parece: daba entre 25 y 47 dólares, muy por
 * debajo de los 65-75 que ellos publican de verdad. En una página que enseña
 * las dos cosas juntas, eso hace que su oferta real parezca cara al lado de una
 * cifra que me había inventado yo. Un reparto sin intereses no es el crédito de
 * nadie.
 */
export function cuotaDe(v) {
  const c = v?.credito || {};
  const periodo = PERIODOS[c.periodo] || PERIODOS.semanal;
  const plazoMeses = c.plazoMeses || config.credito.plazoMesesMax;
  const inicialPct = Number.isFinite(c.inicialPct) ? c.inicialPct : config.credito.inicialPct;

  const comun = {
    periodo: c.periodo || "semanal",
    etiqueta: periodo.adjetivo,
    cada: periodo.cada,
    plazoMeses,
    inicialPct,
  };

  if (Number.isFinite(c.cuota)) {
    return { ...comun, monto: c.cuota, calculada: false };
  }

  // El ancla de la casa, la que ellos anuncian para ese tipo de unidad.
  const esMoto = v?.segmento === "moto";
  const ancla = esMoto ? config.credito.cuotaMotoDesde : config.credito.cuotaDesde;
  const periodoAncla = esMoto
    ? config.credito.cuotaMotoDesdePeriodo
    : config.credito.cuotaDesdePeriodo;
  const infoAncla = PERIODOS[periodoAncla] || PERIODOS.semanal;

  return {
    ...comun,
    monto: ancla,
    periodo: periodoAncla,
    etiqueta: infoAncla.adjetivo,
    cada: infoAncla.cada,
    calculada: true,
  };
}

/** Una unidad, con lo derivado ya calculado. */
function normalizar(v) {
  const credito = cuotaDe(v);

  return {
    ...v,
    titulo: `${v.marca} ${v.modelo}`,
    tituloLargo: [v.marca, v.modelo, v.version].filter(Boolean).join(" "),
    tipo: TIPOS.find((t) => t.slug === v.carroceria) || TIPOS[0],
    segmentoInfo: SEGMENTOS.find((s) => s.slug === v.segmento) || SEGMENTOS[0],
    condicionInfo: CONDICIONES.find((c) => c.slug === v.condicion) || CONDICIONES[1],
    esNuevo: v.condicion === "nuevo",
    esMoto: v.segmento === "moto",
    disponible: v.estado === "disponible",
    // La cuota resuelta, que es la cifra que manda en toda la interfaz.
    cuota: credito,
    inicial: Math.round(Number(v?.precio || 0) * (credito.inicialPct / 100)),
  };
}

/** Todo el catálogo. Lo entregado va al final: se enseña, pero no estorba. */
export function leerVehiculos() {
  const lista = (catalogo.vehiculos || []).map(normalizar);
  const orden = { disponible: 0, reservado: 1, entregado: 2 };
  return lista.sort((a, b) => (orden[a.estado] ?? 9) - (orden[b.estado] ?? 9));
}

export function vehiculoPorSlug(slug) {
  return leerVehiculos().find((v) => v.slug === slug) || null;
}

/**
 * ¿Queda algún precio sin confirmar?
 *
 * Sus publicaciones no llevan precio de contado —solo la cuota—, así que los
 * precios del JSON son referencias de mercado hasta que el cliente cargue los
 * suyos. Lo usa el aviso de la portada y el sello de las fichas.
 */
export function hayPreciosProvisionales() {
  return leerVehiculos().some((v) => v.precioProvisional);
}

/** ¿Y alguna unidad que no salga de su Instagram, sino puesta de muestra? */
export function hayUnidadesDeMuestra() {
  return leerVehiculos().some((v) => v.deMuestra);
}

/** Cuántas unidades salen, una a una, de sus propias publicaciones. */
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
  // Las cuotas se comparan DENTRO de su periodo: 75 a la semana y 75 al mes no
  // son la misma cifra, y meterlas en el mismo mínimo daría un "desde" falso.
  const cuotasSemanales = vehiculos
    .filter((v) => v.cuota?.periodo === "semanal")
    .map((v) => v.cuota.monto);
  const cuotasMensuales = vehiculos
    .filter((v) => v.cuota?.periodo === "mensual")
    .map((v) => v.cuota.monto);

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
    cuotaSemanalMin: cuotasSemanales.length ? Math.min(...cuotasSemanales) : 0,
    cuotaMensualMin: cuotasMensuales.length ? Math.min(...cuotasMensuales) : 0,
  };
}

/**
 * La cuota más baja de una lista, con su periodo.
 *
 * Devuelve la unidad entera y no solo el número porque quien lo usa —la
 * portada, las tarjetas de los dos caminos— siempre acaba queriendo decir
 * "desde 75$ semanales" y no "desde 75".
 */
export function cuotaMasBaja(vehiculos) {
  const conCuota = vehiculos.filter((v) => Number.isFinite(v.cuota?.monto));
  if (!conCuota.length) return null;

  // Se comparan normalizadas a un año para que un semanal barato no pierda
  // contra un mensual que parece más pequeño solo por el periodo.
  const alAnio = (v) => v.cuota.monto * (PERIODOS[v.cuota.periodo]?.porAnio || 52);
  return conCuota.reduce((mejor, v) => (alAnio(v) < alAnio(mejor) ? v : mejor)).cuota;
}

/**
 * El buscador. Todos los criterios son opcionales y se acumulan.
 *
 * `q` busca en marca, modelo, versión y año a la vez, que es como la gente
 * escribe de verdad: "optra 2011", "moto 0 km", "aveo usado".
 */
export function filtrar(
  vehiculos,
  { segmento, condicion, tipo, marca, cuotaMax, precioMax, anioMin, q, orden } = {}
) {
  let lista = [...vehiculos];

  if (segmento) lista = lista.filter((v) => v.segmento === segmento);
  if (condicion) lista = lista.filter((v) => v.condicion === condicion);
  if (tipo) lista = lista.filter((v) => v.carroceria === tipo);
  if (marca) lista = lista.filter((v) => v.marca === marca);

  // El filtro que de verdad usa quien compra a crédito: "¿qué me llevo por 75
  // a la semana?". Se compara contra la cuota semanal equivalente, para que un
  // mensual de 260 no se cuele en una búsqueda de 75 semanales.
  if (Number.isFinite(Number(cuotaMax)) && Number(cuotaMax) > 0) {
    const tope = Number(cuotaMax);
    lista = lista.filter((v) => {
      const p = PERIODOS[v.cuota?.periodo] || PERIODOS.semanal;
      const semanal = (v.cuota.monto * p.porAnio) / 52;
      return semanal <= tope;
    });
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
      const heno = `${v.marca} ${v.modelo} ${v.version || ""} ${v.anio} ${v.carroceria} ${
        v.segmento === "moto" ? "moto motos scooter" : "vehiculo carro auto"
      } ${v.esNuevo ? "0 km nuevo" : "usado"}`.toLowerCase();
      return palabras.every((p) => heno.includes(p));
    });
  }

  const cuotaSemanal = (v) => {
    const p = PERIODOS[v.cuota?.periodo] || PERIODOS.semanal;
    return (v.cuota.monto * p.porAnio) / 52;
  };

  switch (orden) {
    case "cuota-asc":
      return lista.sort((a, b) => cuotaSemanal(a) - cuotaSemanal(b));
    case "cuota-desc":
      return lista.sort((a, b) => cuotaSemanal(b) - cuotaSemanal(a));
    case "precio-asc":
      return lista.sort((a, b) => a.precio - b.precio);
    case "anio-desc":
      return lista.sort((a, b) => b.anio - a.anio);
    default:
      return lista;
  }
}
