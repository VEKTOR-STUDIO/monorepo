#!/usr/bin/env node
// -----------------------------------------------------------------------------
// Leer las publicaciones de una cuenta de Instagram.
//
// Instagram cerró todas las puertas anónimas: la API web contesta
// {"require_login": true}, y /p/<post>/embed/ devuelve el armazón de la app sin
// una sola foto. No hay forma de leer un perfil sin credencial. Esta es la vía
// de la cookie: le prestamos al script la sesión de una cuenta nuestra y él
// pide lo mismo que pediría el navegador.
//
//   node tools/instagram/leer-perfil.mjs aprovechalo.ve
//   node tools/instagram/leer-perfil.mjs aprovechalo.ve --max 120 --desde 2026-01-01
//
// La credencial sale de IG_SESSIONID (entorno) o de tools/instagram/.env.local,
// que está en .gitignore. Cómo sacarla, el ritmo seguro y qué hacer cuando
// caduca: README.md, al lado de este archivo.
//
// Escribe un JSON crudo, sin interpretar: publicación, texto y URLs de foto tal
// como las da Instagram. Quien traduce ese texto a una ficha de vehículo es
// quien lea el JSON después, no este script: cada cuenta escribe sus anuncios a
// su manera y adivinar aquí sería inventarse el inventario del cliente.
//
// Ojo: las URLs del CDN van firmadas y caducan en unas horas. Descarga las
// fotos el mismo día (bajar-fotos.mjs) o vuelve a ejecutar esto.
// -----------------------------------------------------------------------------

import { readFile, writeFile, mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const AQUI = dirname(fileURLToPath(import.meta.url));

// El id de la app web de Instagram. Es público y fijo: va en cada petición que
// hace instagram.com desde el navegador, y sin él la API contesta 403.
const APP_ID = "936619743392459";
const NAVEGADOR =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";

// Instagram no publica un límite. Estas pausas imitan a alguien bajando por el
// perfil; bajarlas es la forma más rápida de que te limiten la cuenta.
const PAUSA_MIN = 2500;
const PAUSA_MAX = 6000;

// -----------------------------------------------------------------------------
// Argumentos
// -----------------------------------------------------------------------------

function leerArgumentos(argv) {
  const [usuarioCrudo, ...resto] = argv;
  const opciones = { max: 60, salida: null, desde: null };

  for (let i = 0; i < resto.length; i += 2) {
    const clave = resto[i];
    const valor = resto[i + 1];
    if (valor === undefined) fallar(`La opción ${clave} se quedó sin valor.`);
    if (clave === "--max") opciones.max = Number(valor);
    else if (clave === "--salida") opciones.salida = valor;
    else if (clave === "--desde") opciones.desde = new Date(`${valor}T00:00:00Z`);
    else fallar(`No conozco la opción ${clave}.`);
  }

  if (!usuarioCrudo || usuarioCrudo.startsWith("--")) {
    fallar(
      "Falta la cuenta.\n\n" +
        "  node tools/instagram/leer-perfil.mjs <usuario> [--max 60] [--desde 2026-01-01] [--salida ruta.json]"
    );
  }
  if (!Number.isFinite(opciones.max) || opciones.max < 1) fallar("--max tiene que ser un número mayor que cero.");
  if (opciones.desde && Number.isNaN(opciones.desde.getTime())) fallar("--desde va en formato YYYY-MM-DD.");

  // Acepta @cuenta y también un enlace pegado del navegador.
  const usuario = usuarioCrudo
    .replace(/^https?:\/\/(www\.)?instagram\.com\//i, "")
    .replace(/[/?#].*$/, "")
    .replace(/^@/, "")
    .trim();

  opciones.salida ||= join(AQUI, "salida", `${usuario}.json`);
  return { usuario, opciones };
}

function fallar(mensaje) {
  console.error(`\n✖ ${mensaje}\n`);
  process.exit(1);
}

// -----------------------------------------------------------------------------
// La credencial
// -----------------------------------------------------------------------------

/** IG_SESSIONID del entorno, o de tools/instagram/.env.local si no está. */
async function leerSesion() {
  if (process.env.IG_SESSIONID) return process.env.IG_SESSIONID.trim();

  let archivo;
  try {
    archivo = await readFile(join(AQUI, ".env.local"), "utf8");
  } catch {
    fallar(
      "No hay sesión de Instagram.\n\n" +
        "  Copia tools/instagram/.env.example a .env.local y pega ahí tu IG_SESSIONID,\n" +
        "  o expórtala en el entorno. El README explica de dónde sacarla."
    );
  }

  const linea = archivo.match(/^\s*IG_SESSIONID\s*=\s*(.+)$/m);
  if (!linea) fallar("tools/instagram/.env.local existe pero no tiene una línea IG_SESSIONID=…");
  return linea[1].trim().replace(/^["']|["']$/g, "");
}

// -----------------------------------------------------------------------------
// Las peticiones
// -----------------------------------------------------------------------------

const dormir = (ms) => new Promise((r) => setTimeout(r, ms));
const pausaHumana = () => dormir(PAUSA_MIN + Math.random() * (PAUSA_MAX - PAUSA_MIN));

/**
 * Abre instagram.com como haría un navegador antes de tocar la API.
 *
 * No es ceremonia: la API mira cookies que solo se reparten al cargar la web
 * (`csrftoken`, `mid`, `ig_did`). Pidiendo con el `sessionid` a secas, las
 * respuestas salen peor. De paso confirma con qué cuenta estamos entrando,
 * que es mejor saberlo antes de gastar peticiones que después.
 */
async function abrirSesion(sesion) {
  let respuesta;
  try {
    respuesta = await fetch("https://www.instagram.com/", {
      headers: {
        "User-Agent": NAVEGADOR,
        Accept: "text/html,application/xhtml+xml",
        "Accept-Language": "es-ES,es;q=0.9,en;q=0.8",
        Cookie: `sessionid=${sesion}`,
      },
    });
  } catch (error) {
    fallar(`No se pudo conectar con Instagram: ${error.message}`);
  }

  const html = await respuesta.text();
  const galletas = new Map([["sessionid", sesion]]);
  for (const cruda of respuesta.headers.getSetCookie?.() ?? []) {
    const par = cruda.split(";")[0];
    const corte = par.indexOf("=");
    if (corte < 1) continue;
    const nombre = par.slice(0, corte).trim();
    const valor = par.slice(corte + 1).trim();
    if (valor && valor !== '""') galletas.set(nombre, valor);
  }

  const usuario = html.match(/"username":"([^"]{1,30})"/)?.[1] ?? null;
  if (/class="no-js not-logged-in/.test(html) || (!usuario && !/logged-in/.test(html))) {
    fallar(
      "El sessionid no vale: Instagram sirve la web como visitante anónimo.\n\n" +
        "  Se invalida al cerrar sesión en el navegador de donde salió, y también\n" +
        "  solo por antigüedad. Saca uno nuevo (README, «Sacar el sessionid»)."
    );
  }

  return {
    cookies: [...galletas].map(([k, v]) => `${k}=${v}`).join("; "),
    csrf: galletas.get("csrftoken") ?? "",
    usuario,
  };
}

/**
 * Pide una URL de la API interna con la sesión puesta.
 * Reintenta ante 429 y ante fallos de red, esperando cada vez más.
 *
 * Lo que costó descubrir: ante un 429 Instagram no devuelve JSON, devuelve la
 * página de error, y esa página lleva escrito en el `<html>` si te reconoce o
 * no. Ahí está la diferencia entre «tu cookie no sirve» y «esta IP ha pedido
 * demasiado», que son el mismo 429 y arreglos opuestos. Por eso se mira.
 */
async function pedir(url, sesion, { referer, intentos = 3 } = {}) {
  for (let intento = 1; intento <= intentos; intento++) {
    let respuesta;
    try {
      respuesta = await fetch(url, {
        headers: {
          "User-Agent": NAVEGADOR,
          "x-ig-app-id": APP_ID,
          "x-asbd-id": "129477",
          "x-ig-www-claim": "0",
          "x-csrftoken": sesion.csrf,
          "X-Requested-With": "XMLHttpRequest",
          Accept: "*/*",
          "Accept-Language": "es-ES,es;q=0.9,en;q=0.8",
          "Sec-Fetch-Site": "same-origin",
          "Sec-Fetch-Mode": "cors",
          "Sec-Fetch-Dest": "empty",
          Referer: referer || "https://www.instagram.com/",
          Cookie: sesion.cookies,
        },
      });
    } catch (error) {
      if (intento === intentos) fallar(`No se pudo conectar con Instagram: ${error.message}`);
      await dormir(intento * 5000);
      continue;
    }

    const texto = await respuesta.text();

    if (respuesta.status === 429 || respuesta.status === 560) {
      if (/not-logged-in/.test(texto)) {
        fallar(
          "El sessionid dejó de valer a mitad del recorrido.\n\n" +
            "  Saca uno nuevo (README, «Sacar el sessionid»)."
        );
      }
      if (intento === intentos) {
        fallar(
          "Instagram está limitando las peticiones desde aquí.\n\n" +
            `  La sesión es buena${sesion.usuario ? ` (entra como @${sesion.usuario})` : ""}: el límite es de la IP,\n` +
            "  no de la cuenta. Se quita solo, normalmente en un par de horas.\n" +
            "  Insistir lo alarga. Vuelve más tarde y repite el mismo comando."
        );
      }
      const espera = intento * 20000;
      console.log(`   Instagram pide calma (${respuesta.status}). Espero ${espera / 1000}s…`);
      await dormir(espera);
      continue;
    }

    if (respuesta.status === 401 || respuesta.status === 403) {
      fallar(
        `Instagram rechazó la sesión (${respuesta.status}).\n\n` +
          "  Casi siempre es que el sessionid caducó: se invalida al cerrar sesión en\n" +
          "  el navegador y cada cierto tiempo por su cuenta. Saca uno nuevo (README)."
      );
    }

    if (!respuesta.ok) fallar(`Instagram contestó ${respuesta.status} en ${url}`);

    let cuerpo;
    try {
      cuerpo = JSON.parse(texto);
    } catch {
      fallar(
        `Instagram devolvió una página en vez de datos en ${url}\n\n` +
          "  Suele ser el límite de peticiones disfrazado de 200. Prueba más tarde."
      );
    }
    if (cuerpo.require_login || cuerpo.status === "fail") {
      fallar(
        `Instagram no aceptó la petición: ${cuerpo.message || "require_login"}.\n\n` +
          "  Si dice 'Please wait a few minutes', para hoy y vuelve mañana."
      );
    }
    return cuerpo;
  }
  fallar("Instagram no dejó completar la lectura. Déjalo reposar unas horas.");
}

// -----------------------------------------------------------------------------
// Normalizar
// -----------------------------------------------------------------------------

/** De todas las resoluciones que ofrece Instagram, la más grande. */
function mejorFoto(media) {
  const candidatas = media?.image_versions2?.candidates;
  if (!Array.isArray(candidatas) || candidatas.length === 0) return null;
  return [...candidatas].sort((a, b) => (b.width || 0) - (a.width || 0))[0].url;
}

/** Una publicación tal cual la da Instagram, traducida a lo que nos importa. */
function normalizar(item) {
  const esCarrusel = Array.isArray(item.carousel_media) && item.carousel_media.length > 0;
  const piezas = esCarrusel ? item.carousel_media : [item];

  return {
    shortcode: item.code,
    url: `https://www.instagram.com/p/${item.code}/`,
    fecha: new Date(item.taken_at * 1000).toISOString(),
    tipo: esCarrusel ? "carrusel" : item.media_type === 2 ? "video" : "imagen",
    // El texto del anuncio: marca, modelo, año, precio y teléfono suelen estar
    // todos aquí, en prosa. Se guarda entero y sin tocar.
    caption: item.caption?.text ?? "",
    likes: item.like_count ?? null,
    comentarios: item.comment_count ?? null,
    fijado: Array.isArray(item.timeline_pinned_user_ids) && item.timeline_pinned_user_ids.length > 0,
    imagenes: piezas.map(mejorFoto).filter(Boolean),
    videos: piezas.map((p) => p.video_versions?.[0]?.url).filter(Boolean),
  };
}

// -----------------------------------------------------------------------------
// El recorrido
// -----------------------------------------------------------------------------

async function leerPerfil(usuario, sesion) {
  const url = `https://www.instagram.com/api/v1/users/web_profile_info/?username=${encodeURIComponent(usuario)}`;
  const cuerpo = await pedir(url, sesion, { referer: `https://www.instagram.com/${usuario}/` });
  const u = cuerpo?.data?.user;
  if (!u) fallar(`No encontré la cuenta @${usuario}. ¿Está bien escrita?`);
  if (u.is_private) {
    fallar(
      `@${usuario} es privada.\n\n` +
        "  Solo se puede leer si la cuenta de la sesión la sigue y se lo han aceptado."
    );
  }
  return {
    id: u.id,
    usuario: u.username,
    nombre: u.full_name || "",
    bio: u.biography || "",
    web: u.external_url || "",
    seguidores: u.edge_followed_by?.count ?? null,
    publicaciones: u.edge_owner_to_timeline_media?.count ?? null,
    verificada: !!u.is_verified,
    foto: u.profile_pic_url_hd || u.profile_pic_url || "",
  };
}

async function leerPublicaciones(perfil, sesion, opciones) {
  const posts = [];
  let cursor = null;
  let pagina = 0;

  while (posts.length < opciones.max) {
    if (pagina > 0) await pausaHumana();
    pagina++;

    const params = new URLSearchParams({ count: "33" });
    if (cursor) params.set("max_id", cursor);
    const url = `https://www.instagram.com/api/v1/feed/user/${perfil.id}/?${params}`;
    const cuerpo = await pedir(url, sesion, { referer: `https://www.instagram.com/${perfil.usuario}/` });

    const items = Array.isArray(cuerpo.items) ? cuerpo.items : [];
    if (items.length === 0) break;

    let agotadoPorFecha = false;
    for (const item of items) {
      const post = normalizar(item);
      // Los fijados salen arriba aunque sean viejos: no cortan el recorrido.
      if (opciones.desde && new Date(post.fecha) < opciones.desde) {
        if (!post.fijado) agotadoPorFecha = true;
        continue;
      }
      posts.push(post);
      if (posts.length >= opciones.max) break;
    }

    console.log(`   Página ${pagina}: ${posts.length} publicación(es) recogidas.`);
    if (agotadoPorFecha) {
      console.log("   Llegué a publicaciones anteriores a --desde. Paro.");
      break;
    }
    if (!cuerpo.more_available) break;
    cursor = cuerpo.next_max_id;
    if (!cursor) break;
  }

  return posts;
}

// -----------------------------------------------------------------------------

async function main() {
  const { usuario, opciones } = leerArgumentos(process.argv.slice(2));
  const credencial = await leerSesion();

  console.log("\n▸ Abriendo Instagram…");
  const sesion = await abrirSesion(credencial);
  console.log(`   Entrando como @${sesion.usuario ?? "?"}.`);

  console.log(`▸ Leyendo @${usuario}…`);
  const perfil = await leerPerfil(usuario, sesion);
  console.log(`   ${perfil.nombre || perfil.usuario} · ${perfil.publicaciones ?? "?"} publicaciones en total.`);

  await pausaHumana();
  const posts = await leerPublicaciones(perfil, sesion, opciones);

  const salida = {
    _nota:
      "Lectura cruda de Instagram, sin interpretar. Las URLs de imagen van firmadas " +
      "y caducan en unas horas: pásalas por bajar-fotos.mjs hoy mismo o vuelve a leer.",
    cuenta: perfil.usuario,
    leido: new Date().toISOString(),
    perfil,
    posts,
  };

  await mkdir(dirname(opciones.salida), { recursive: true });
  await writeFile(opciones.salida, `${JSON.stringify(salida, null, 2)}\n`, "utf8");

  const fotos = posts.reduce((n, p) => n + p.imagenes.length, 0);
  console.log(`\n✓ ${posts.length} publicaciones y ${fotos} fotos → ${opciones.salida}`);
  console.log(`   Siguiente: node tools/instagram/bajar-fotos.mjs ${opciones.salida} --destino <carpeta>\n`);
}

main();
