// -----------------------------------------------------------------------------
// Normalización del catálogo.
//
// El PDF escribe las categorías tal y como las teclea quien arma la lista
// ("Proteina Whey", "BCAAA", "Healty"…). Aquí se traducen a una taxonomía
// estable para poder navegar la tienda, sin tocar el dato original: cada
// producto conserva `categoriaOriginal` con lo que decía el PDF.
//
// Ninguna de estas tablas inventa productos ni precios: solo agrupa y acentúa
// lo que ya venía escrito. Si en un PDF futuro aparece una categoría nueva,
// cae en "Otros" y queda listada en el informe de importación para añadirla.
// -----------------------------------------------------------------------------

// familia -> cómo se llama en el menú de la tienda
export const FAMILIAS = [
  ["proteinas", "Proteínas"],
  ["ganadores", "Ganadores de peso"],
  ["creatina", "Creatina"],
  ["aminoacidos", "Aminoácidos"],
  ["preentreno", "Pre-entreno y energía"],
  ["quemadores", "Quemadores"],
  ["salud", "Salud y vitaminas"],
  ["snacks", "Snacks"],
  ["equipo", "Equipo de entrenamiento"],
  ["hidratacion", "Termos y shakers"],
  ["natacion", "Natación"],
  ["bolsos", "Bolsos y morrales"],
  ["balones", "Balones y deportes"],
  ["lentes", "Lentes de sol"],
  ["otros", "Otros"],
];

// categoría del PDF -> [nombre para mostrar, familia]
const CATEGORIAS = {
  "Proteina Whey": ["Proteína Whey", "proteinas"],
  "Proteina Isolatada": ["Proteína Isolada", "proteinas"],
  "Proteina Caseina": ["Proteína Caseína", "proteinas"],
  "Proteina Vegana": ["Proteína Vegana", "proteinas"],
  "Proteina a Base de Carne": ["Proteína de Carne", "proteinas"],
  "Bebida Proteica": ["Bebida Proteica", "proteinas"],
  "Ganador de Peso": ["Ganador de Peso", "ganadores"],
  Creatina: ["Creatina", "creatina"],
  BCAAA: ["BCAA", "aminoacidos"],
  EAA: ["EAA", "aminoacidos"],
  Amino: ["Aminoácidos", "aminoacidos"],
  Preworkout: ["Pre-entreno", "preentreno"],
  Vasodilatador: ["Vasodilatadores", "preentreno"],
  Electrolito: ["Electrolitos", "preentreno"],
  Bebida: ["Bebidas y geles", "preentreno"],
  "Quemador de Grasa": ["Quemador de Grasa", "quemadores"],
  Vitamina: ["Vitaminas", "salud"],
  Colageno: ["Colágeno", "salud"],
  Healty: ["Salud y bienestar", "salud"],
  "Potenciador Testosterona": ["Potenciador de Testosterona", "salud"],
  Snacks: ["Snacks", "snacks"],
  Accesorio: ["Accesorios", "equipo"],
  Guante: ["Guantes", "equipo"],
  "Guante MMA": ["Guantes MMA", "equipo"],
  Straps: ["Straps", "equipo"],
  Boxeo: ["Boxeo", "equipo"],
  Ligas: ["Ligas", "equipo"],
  Bandas: ["Bandas", "equipo"],
  Pesa: ["Mancuernas", "equipo"],
  "Set De Entrenamiento": ["Sets de Entrenamiento", "equipo"],
  "Cuerda de saltar": ["Cuerdas de Saltar", "equipo"],
  "Faja Unisex": ["Fajas", "equipo"],
  Toalla: ["Toallas", "equipo"],
  Shaker: ["Shakers", "hidratacion"],
  Cooler: ["Coolers", "hidratacion"],
  Natacion: ["Natación", "natacion"],
  "Natacion Niños": ["Natación Niños", "natacion"],
  "Natacion Adulto": ["Natación Adulto", "natacion"],
  Morrales: ["Morrales y Bolsos", "bolsos"],
  "Balon Voleibol": ["Balones de Voleibol", "balones"],
  "Balon Futbol Sala": ["Balones de Fútbol Sala", "balones"],
  "Balon Futbol Campo": ["Balones de Fútbol Campo", "balones"],
  "Balon basket": ["Balones de Basket", "balones"],
  Tenis: ["Tenis", "balones"],
  "Lentes de Sol": ["Lentes de Sol", "lentes"],
};

// Marcas que aparecen en los nombres del catálogo. Se buscan al principio del
// nombre para poder filtrar por marca; el nombre no se modifica.
const MARCAS = [
  "Optimum Nutrition",
  "AllMAX Nutrition",
  "AllMax Nutrition",
  "Ronnie Coleman",
  "Perfect Sports",
  "Perfect Sport",
  "Primeval Labs",
  "Force Factor",
  "Great Value",
  "Pure Protein",
  "MuscleMeds",
  "MuscleTech",
  "Muscletech",
  "BPI Sports",
  "JNX Sports",
  "Mac Gregor",
  "Macgregor",
  "MacGregor",
  "Cellucor",
  "Universal",
  "Tamanaco",
  "Harbinger",
  "Bestronger",
  "Animal Pak",
  "One of One",
  "Momentop",
  "Gaspari",
  "Bestway",
  "Fitplus",
  "Velomix",
  "Ecology",
  "Nutrex",
  "Prozis",
  "Mutant",
  "Zumub",
  "Jogger",
  "Wilson",
  "Vulkan",
  "Vulcan",
  "Torege",
  "Seccco",
  "Rule 1",
  "MO4T",
  "BSN",
  "Now",
  "K6",
  "KX",
];

export function quitarAcentos(texto) {
  return texto.normalize("NFD").replace(/[̀-ͯ]/g, "");
}

export function aSlug(texto) {
  return quitarAcentos(texto)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function categoriaDe(bruta) {
  const limpia = bruta.replace(/\s+/g, " ").trim();
  const conocida = CATEGORIAS[limpia];
  if (conocida) {
    return { nombre: conocida[0], slug: aSlug(conocida[0]), familia: conocida[1] };
  }
  // Categoría nueva: se respeta tal cual y se avisa en el informe.
  return { nombre: limpia || "Otros", slug: aSlug(limpia || "otros"), familia: "otros", nueva: true };
}

export function marcaDe(nombre) {
  const sin = quitarAcentos(nombre).toLowerCase();
  for (const marca of MARCAS) {
    const m = quitarAcentos(marca).toLowerCase();
    // Al principio del nombre, o precedida de un espacio, para no cazar
    // "K6" dentro de otra palabra.
    if (sin.startsWith(m) || sin.includes(` ${m} `) || sin.includes(` ${m}`)) {
      if (new RegExp(`(^|\\s)${m.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(\\s|$)`).test(sin)) {
        return marca;
      }
    }
  }
  return null;
}

// "Disponible" / "Transito" tal y como los escribe el PDF.
export function estadoDe(disponibilidad) {
  const v = quitarAcentos(disponibilidad || "").toLowerCase();
  if (v.startsWith("transito")) return "transito";
  if (v.startsWith("agotado")) return "agotado";
  return "disponible";
}

/**
 * Convierte las filas crudas del PDF en productos de la tienda.
 * Añade slug único, categoría normalizada, marca y estado.
 */
export function normalizarProductos(filas) {
  const vistos = new Map();
  return filas.map((fila, i) => {
    const categoria = categoriaDe(fila.categoria);
    let slug = aSlug(fila.nombre) || `producto-${i + 1}`;
    // Hay nombres repetidos (mismo producto en dos presentaciones escritas
    // igual): se numeran para que el slug siga siendo único y estable.
    const repeticiones = vistos.get(slug) || 0;
    vistos.set(slug, repeticiones + 1);
    if (repeticiones > 0) slug = `${slug}-${repeticiones + 1}`;

    return {
      slug,
      nombre: fila.nombre,
      categoria: categoria.nombre,
      categoriaSlug: categoria.slug,
      familia: categoria.familia,
      categoriaOriginal: fila.categoria,
      marca: marcaDe(fila.nombre),
      variaciones: fila.variaciones,
      estado: estadoDe(fila.disponibilidad),
      disponibilidadOriginal: fila.disponibilidad,
      precioBcv: fila.precioBcv,
      precioContado: fila.precioContado,
      precioPagoMovil: fila.precioPagoMovil,
      ofertaFlash: fila.ofertaFlash,
      pagina: fila.pagina,
      imagenObj: fila.imagenObj,
      imagen: null, // lo rellena el importador
    };
  });
}
