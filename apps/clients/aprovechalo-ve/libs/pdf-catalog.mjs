// -----------------------------------------------------------------------------
// Lector del catálogo de Hardcore en PDF.
//
// Hardcore manda por WhatsApp un PDF con una tabla de una fila por producto:
//
//   Imagen | Categoria | Producto | Variacion | Disponibilidad | Precio | Precio Oferta | Precio PM
//
// Este módulo abre ese PDF sin dependencias externas (solo zlib de Node) y
// devuelve los productos con su foto, para poder repetir la importación cada
// vez que manden una lista nueva. No interpreta nada: lee lo que está escrito.
//
// La gracia está en leer las POSICIONES, no el orden del texto: cada celda se
// asigna a una columna por su coordenada X y a una fila por su coordenada Y,
// que es como se reconstruye la tabla. La foto de cada producto se empareja con
// la fila cuyo alto la contiene.
//
// Lo usan dos sitios:
//   - scripts/importar-catalogo.mjs  (genera data/catalogo.json y las imágenes)
//   - app/api/admin/importar         (el panel, al subir un PDF nuevo)
// -----------------------------------------------------------------------------

import zlib from "node:zlib";

// Bordes en X de cada columna, en puntos PDF. Salen de medir el documento:
// son estables entre listas porque la plantilla de Hardcore no cambia.
const COLUMNAS = [
  ["categoria", 86, 131],
  ["nombre", 131, 300],
  ["variacion", 300, 361],
  ["disponibilidad", 361, 414],
  ["precioBcv", 414, 460],
  ["precioContado", 460, 510],
  ["precioPagoMovil", 510, 600],
];

// Valores que marcan el arranque de una fila en la columna "Disponibilidad".
const ESTADOS = new Set(["Disponible", "Transito", "Tránsito", "Agotado"]);

// Sellos que el diseñador pega encima de la tabla. Caen dentro de la columna
// del nombre, así que hay que apartarlos o acaban dentro del producto.
const SELLOS = new Set(["Oferta", "Flash", "Version Especial", "Versión Especial"]);

function columnaDe(x) {
  for (const [nombre, desde, hasta] of COLUMNAS) {
    if (x >= desde && x < hasta) return nombre;
  }
  return null;
}

// --------------------------------------------------------------------------
// Objetos y streams del PDF
// --------------------------------------------------------------------------

// Trabajamos el PDF como texto latin1: cada byte es un carácter, así que las
// posiciones de las expresiones regulares valen también como offsets del Buffer.
function indexarObjetos(crudo) {
  const objetos = new Map();
  const re = /(?:^|[\r\n>\s])(\d+)\s+0\s+obj/g;
  let m;
  while ((m = re.exec(crudo))) objetos.set(Number(m[1]), m.index + m[0].length);
  return objetos;
}

function cuerpoObjeto(crudo, objetos, num) {
  const inicio = objetos.get(num);
  if (inicio === undefined) return null;
  const fin = crudo.indexOf("endobj", inicio);
  return crudo.slice(inicio, fin === -1 ? undefined : fin);
}

function streamDe(crudo, objetos, num) {
  const cuerpo = cuerpoObjeto(crudo, objetos, num);
  if (!cuerpo) return null;
  const m = /stream\r?\n/.exec(cuerpo);
  if (!m) return null;
  const diccionario = cuerpo.slice(0, m.index);
  let datos = cuerpo.slice(m.index + m[0].length);
  const fin = datos.lastIndexOf("endstream");
  if (fin !== -1) datos = datos.slice(0, fin);
  return { diccionario, datos: datos.replace(/[\r\n]+$/, "") };
}

function inflar(diccionario, datos) {
  const bytes = Buffer.from(datos, "latin1");
  if (!diccionario.includes("FlateDecode")) return bytes;
  try {
    return zlib.inflateSync(bytes);
  } catch {
    // Algunos generadores dejan basura al final del stream; inflateSync se
    // queja pero los datos útiles ya están descomprimidos.
    try {
      return zlib.inflateSync(bytes, { finishFlush: zlib.constants.Z_SYNC_FLUSH });
    } catch {
      return null;
    }
  }
}

function contenidoDe(crudo, objetos, num) {
  const s = streamDe(crudo, objetos, num);
  if (!s) return "";
  const out = inflar(s.diccionario, s.datos);
  return out ? out.toString("latin1") : "";
}

// Páginas en el orden en que aparecen, con el mapa de sus imágenes (/XObject).
function leerPaginas(crudo) {
  const paginas = [];
  const re = /(\d+)\s+0\s+obj\s*<<([\s\S]{0,4000}?)>>\s*endobj/g;
  let m;
  while ((m = re.exec(crudo))) {
    const cuerpo = m[2];
    if (!cuerpo.includes("/Type/Page") || cuerpo.includes("/Type/Pages")) continue;
    const contenido = /\/Contents\s+(\d+)\s+0\s+R/.exec(cuerpo);
    if (!contenido) continue;
    const xobjects = {};
    const bloque = /\/XObject\s*<<([\s\S]*?)>>/.exec(cuerpo);
    if (bloque) {
      const reRef = /\/(\w+)\s+(\d+)\s+0\s+R/g;
      let r;
      while ((r = reRef.exec(bloque[1]))) xobjects[r[1]] = Number(r[2]);
    }
    paginas.push({ contenido: Number(contenido[1]), xobjects });
  }
  return paginas;
}

// --------------------------------------------------------------------------
// Recorrido del stream de contenido
// --------------------------------------------------------------------------

const TOKEN =
  /(\((?:\\[\s\S]|[^\\()])*\))|(\[(?:\\[\s\S]|[^\\[\]])*\])|(\/[^\s/[\]<>(){}]+)|([-+]?\d*\.?\d+)|([A-Za-z'"*]+)/g;

function desescapar(s) {
  return s
    .replace(/\\(\d{1,3})/g, (_, oct) => String.fromCharCode(parseInt(oct, 8)))
    .replace(/\\([()\\])/g, "$1")
    .replace(/\\n/g, "\n")
    .replace(/\\r/g, "")
    .replace(/\\t/g, "\t");
}

// Multiplica dos matrices de transformación [a b c d e f].
function mul(m1, m2) {
  return [
    m1[0] * m2[0] + m1[1] * m2[2],
    m1[0] * m2[1] + m1[1] * m2[3],
    m1[2] * m2[0] + m1[3] * m2[2],
    m1[2] * m2[1] + m1[3] * m2[3],
    m1[4] * m2[0] + m1[5] * m2[2] + m2[4],
    m1[4] * m2[1] + m1[5] * m2[3] + m2[5],
  ];
}

// Devuelve dónde cae cada texto y cada imagen de la página, ya en coordenadas
// de página (aplicando la matriz de transformación vigente).
function leerDisposicion(contenido, xobjects) {
  const textos = [];
  const imagenes = [];
  const pila = [];
  let ctm = [1, 0, 0, 1, 0, 0];
  let tm = [1, 0, 0, 1, 0, 0];
  let tlm = [1, 0, 0, 1, 0, 0];
  let operandos = [];

  TOKEN.lastIndex = 0;
  let m;
  while ((m = TOKEN.exec(contenido))) {
    const operador = m[5];
    if (!operador) {
      operandos.push(m[0]);
      continue;
    }
    const n = (i) => Number(operandos[operandos.length - i]);
    switch (operador) {
      case "q":
        pila.push(ctm.slice());
        break;
      case "Q":
        ctm = pila.pop() || [1, 0, 0, 1, 0, 0];
        break;
      case "cm":
        if (operandos.length >= 6) {
          ctm = mul([n(6), n(5), n(4), n(3), n(2), n(1)], ctm);
        }
        break;
      case "BT":
        tm = tlm = [1, 0, 0, 1, 0, 0];
        break;
      case "Tm":
        if (operandos.length >= 6) {
          tm = tlm = [n(6), n(5), n(4), n(3), n(2), n(1)];
        }
        break;
      case "Td":
      case "TD":
        if (operandos.length >= 2) {
          tlm = mul([1, 0, 0, 1, n(2), n(1)], tlm);
          tm = tlm.slice();
        }
        break;
      case "T*":
        tlm = mul([1, 0, 0, 1, 0, -12], tlm);
        tm = tlm.slice();
        break;
      case "Tj":
      case "TJ":
      case "'":
      case '"': {
        if (operador === "'" || operador === '"') {
          tlm = mul([1, 0, 0, 1, 0, -12], tlm);
          tm = tlm.slice();
        }
        const fuente = operandos[operandos.length - 1] || "";
        const trozos = fuente.match(/\((?:\\[\s\S]|[^\\()])*\)/g) || [];
        const texto = trozos.map((t) => desescapar(t.slice(1, -1))).join("");
        if (texto.trim()) {
          const g = mul(tm, ctm);
          textos.push({ x: redondear(g[4]), y: redondear(g[5]), texto });
        }
        break;
      }
      case "Do": {
        const nombre = (operandos[operandos.length - 1] || "").replace(/^\//, "");
        const obj = xobjects[nombre];
        if (obj) {
          imagenes.push({
            x: redondear(ctm[4]),
            y: redondear(ctm[5]),
            ancho: redondear(ctm[0]),
            alto: redondear(ctm[3]),
            obj,
          });
        }
        break;
      }
      default:
        break;
    }
    operandos = [];
  }
  return { textos, imagenes };
}

const redondear = (v) => Math.round(v * 10) / 10;

// --------------------------------------------------------------------------
// Reconstrucción de las filas
// --------------------------------------------------------------------------

function leerPrecio(texto) {
  // Vienen como "140 $ BCV" / "95 $ Oferta". Nos quedamos con el número.
  const m = /(\d+(?:[.,]\d+)?)/.exec(texto || "");
  if (!m) return null;
  return Number(m[1].replace(",", "."));
}

function limpiar(s) {
  return s.replace(/\s+/g, " ").trim();
}

function filasDePagina(pagina, numeroPagina) {
  const { textos, imagenes } = pagina;

  // Solo las imágenes de la columna izquierda: el logo de la cabecera es más
  // ancho que la columna y se queda fuera por el filtro de ancho.
  const fotos = imagenes
    .filter((i) => i.x >= 45 && i.x <= 95 && i.ancho < 40 && i.alto > 5)
    .sort((a, b) => b.y + b.alto / 2 - (a.y + a.alto / 2));

  const anclas = textos
    .filter((t) => columnaDe(t.x) === "disponibilidad" && ESTADOS.has(t.texto.trim()))
    .sort((a, b) => b.y - a.y);

  const filas = [];
  anclas.forEach((ancla, i) => {
    // El alto de la fila llega hasta la mitad de camino con la fila vecina.
    const arriba = i > 0 ? (anclas[i - 1].y + ancla.y) / 2 : ancla.y + 25;
    const abajo = i < anclas.length - 1 ? (ancla.y + anclas[i + 1].y) / 2 : ancla.y - 25;

    const celdas = {};
    for (const [nombre] of COLUMNAS) celdas[nombre] = [];
    let ofertaFlash = false;

    for (const t of textos) {
      if (t.y <= abajo || t.y > arriba) continue;
      const col = columnaDe(t.x);
      if (!col) continue;
      const valor = t.texto.trim();
      if (SELLOS.has(valor)) {
        if (valor === "Oferta" || valor === "Flash") ofertaFlash = true;
        continue;
      }
      celdas[col].push({ y: t.y, x: t.x, texto: t.texto });
    }
    // De arriba abajo y de izquierda a derecha, que es como se lee.
    for (const col of Object.keys(celdas)) {
      celdas[col].sort((a, b) => b.y - a.y || a.x - b.x);
    }
    const unir = (col) => celdas[col].map((c) => c.texto).join(" ");

    // Las variaciones vienen como "*Chocolate", una por línea, y a veces la
    // línea se parte. Una línea sin "*" continúa la anterior.
    const variaciones = [];
    for (const { texto } of celdas.variacion) {
      const linea = texto.trim();
      if (!linea) continue;
      if (linea.startsWith("*")) variaciones.push(linea.replace(/^\*+/, "").trim());
      else if (variaciones.length) {
        variaciones[variaciones.length - 1] = `${variaciones[variaciones.length - 1]} ${linea}`.trim();
      } else variaciones.push(linea);
    }

    const foto = fotos.find((f) => {
      const centro = f.y + f.alto / 2;
      return centro > abajo && centro <= arriba;
    });

    filas.push({
      pagina: numeroPagina,
      categoria: limpiar(unir("categoria")),
      nombre: limpiar(unir("nombre")),
      variaciones: variaciones.map((v) => limpiar(v).replace(/[.\s]+$/, "")).filter(Boolean),
      disponibilidad: ancla.texto.trim(),
      precioBcv: leerPrecio(unir("precioBcv")),
      precioContado: leerPrecio(unir("precioContado")),
      precioPagoMovil: leerPrecio(unir("precioPagoMovil")),
      ofertaFlash,
      imagenObj: foto ? foto.obj : null,
    });
  });

  return filas;
}

// --------------------------------------------------------------------------
// Imágenes
// --------------------------------------------------------------------------

const TABLA_CRC = (() => {
  const t = new Int32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c;
  }
  return t;
})();

function crc32(buf) {
  let c = -1;
  for (let i = 0; i < buf.length; i++) c = TABLA_CRC[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ -1) >>> 0;
}

function escribirPng(ancho, alto, rgba) {
  const trozo = (tipo, datos) => {
    const cuerpo = Buffer.concat([Buffer.from(tipo, "latin1"), datos]);
    const largo = Buffer.alloc(4);
    largo.writeUInt32BE(datos.length);
    const crc = Buffer.alloc(4);
    crc.writeUInt32BE(crc32(cuerpo));
    return Buffer.concat([largo, cuerpo, crc]);
  };
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(ancho, 0);
  ihdr.writeUInt32BE(alto, 4);
  ihdr[8] = 8; // bits por canal
  ihdr[9] = 6; // RGBA
  // Cada fila del PNG lleva delante su byte de filtro (0 = sin filtro).
  const filas = Buffer.alloc(alto * (ancho * 4 + 1));
  for (let y = 0; y < alto; y++) {
    filas[y * (ancho * 4 + 1)] = 0;
    rgba.copy(filas, y * (ancho * 4 + 1) + 1, y * ancho * 4, (y + 1) * ancho * 4);
  }
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    trozo("IHDR", ihdr),
    trozo("IDAT", zlib.deflateSync(filas, { level: 9 })),
    trozo("IEND", Buffer.alloc(0)),
  ]);
}

function datosImagen(crudo, objetos, num) {
  const s = streamDe(crudo, objetos, num);
  if (!s || !s.diccionario.includes("/Image")) return null;
  const d = s.diccionario;
  const leer = (re) => {
    const m = re.exec(d);
    return m ? m[1] : null;
  };
  return {
    ancho: Number(leer(/\/Width\s+(\d+)/)),
    alto: Number(leer(/\/Height\s+(\d+)/)),
    filtro: leer(/\/Filter\s*\/(\w+)/) || "",
    espacio: /\/ColorSpace\s*\[\s*\/Indexed/.test(d)
      ? "Indexed"
      : leer(/\/ColorSpace\s*\/?(\w+)/) || "",
    bits: Number(leer(/\/BitsPerComponent\s+(\d+)/) || 8),
    paleta: Number(leer(/\/ColorSpace\s*\[\s*\/Indexed\s*\/DeviceRGB\s+\d+\s+(\d+)\s+0\s+R/) || 0),
    mascara: Number(leer(/\/SMask\s+(\d+)\s+0\s+R/) || 0),
    crudo: s.datos,
    diccionario: d,
  };
}

// Saca una imagen del PDF como JPEG (tal cual venía) o como PNG con
// transparencia. Devuelve null si el formato no es de los que aparecen aquí.
export function extraerImagen(crudoPdf, objetos, num) {
  const info = datosImagen(crudoPdf, objetos, num);
  if (!info || !info.ancho || !info.alto) return null;
  const { ancho, alto } = info;

  // El canal alfa viaja aparte, en el objeto /SMask.
  let alfa = null;
  if (info.mascara) {
    const m = datosImagen(crudoPdf, objetos, info.mascara);
    if (m && m.filtro === "FlateDecode" && m.ancho === ancho && m.alto === alto && m.bits === 8) {
      const datos = inflar(m.diccionario, m.crudo);
      if (datos && datos.length >= ancho * alto) alfa = datos;
    }
  }

  if (info.filtro === "DCTDecode") {
    return { extension: "jpg", datos: Buffer.from(info.crudo, "latin1"), ancho, alto };
  }

  if (info.filtro !== "FlateDecode") return null;
  const pixeles = inflar(info.diccionario, info.crudo);
  if (!pixeles) return null;

  const rgba = Buffer.alloc(ancho * alto * 4, 0xff);
  if (info.espacio === "Indexed" && info.paleta) {
    const p = streamDe(crudoPdf, objetos, info.paleta);
    if (!p) return null;
    const paleta = inflar(p.diccionario, p.datos);
    if (!paleta) return null;
    for (let i = 0; i < ancho * alto; i++) {
      const c = (pixeles[i] ?? 0) * 3;
      rgba[i * 4] = paleta[c] ?? 0xff;
      rgba[i * 4 + 1] = paleta[c + 1] ?? 0xff;
      rgba[i * 4 + 2] = paleta[c + 2] ?? 0xff;
      rgba[i * 4 + 3] = alfa ? alfa[i] : 0xff;
    }
  } else if (info.espacio === "DeviceRGB") {
    for (let i = 0; i < ancho * alto; i++) {
      rgba[i * 4] = pixeles[i * 3] ?? 0xff;
      rgba[i * 4 + 1] = pixeles[i * 3 + 1] ?? 0xff;
      rgba[i * 4 + 2] = pixeles[i * 3 + 2] ?? 0xff;
      rgba[i * 4 + 3] = alfa ? alfa[i] : 0xff;
    }
  } else if (info.espacio === "DeviceGray" && info.bits === 8) {
    for (let i = 0; i < ancho * alto; i++) {
      const v = pixeles[i] ?? 0xff;
      rgba[i * 4] = rgba[i * 4 + 1] = rgba[i * 4 + 2] = v;
      rgba[i * 4 + 3] = alfa ? alfa[i] : 0xff;
    }
  } else {
    return null;
  }

  return { extension: "png", datos: escribirPng(ancho, alto, rgba), ancho, alto };
}

// --------------------------------------------------------------------------
// Entrada pública
// --------------------------------------------------------------------------

/**
 * Lee el catálogo de un PDF de Hardcore.
 *
 * @param {Buffer} buffer contenido del PDF
 * @returns {{productos: Array, paginas: number, crudo: string, objetos: Map}}
 *   `crudo` y `objetos` se devuelven para poder pedir después las imágenes con
 *   extraerImagen() sin volver a recorrer el archivo.
 */
export function leerCatalogoPdf(buffer) {
  const crudo = buffer.toString("latin1");
  const objetos = indexarObjetos(crudo);
  const paginas = leerPaginas(crudo);

  const productos = [];
  paginas.forEach((pagina, i) => {
    const contenido = contenidoDe(crudo, objetos, pagina.contenido);
    if (!contenido) return;
    const disposicion = leerDisposicion(contenido, pagina.xobjects);
    productos.push(...filasDePagina(disposicion, i + 1));
  });

  return { productos, paginas: paginas.length, crudo, objetos };
}
