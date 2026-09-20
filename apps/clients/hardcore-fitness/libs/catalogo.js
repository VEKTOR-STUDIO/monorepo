// -----------------------------------------------------------------------------
// De dónde salen los productos.
//
// La tienda lee de Supabase cuando está configurado y, si no, del archivo
// data/catalogo.json que genera scripts/importar-catalogo.mjs con el PDF. Así
// la tienda se puede ver y trabajar entera antes de tener la base de datos, y
// el día que se conecte no cambia nada más arriba.
//
// Todo lo que sale de aquí tiene la misma forma, venga de donde venga:
//   { slug, nombre, categoria, categoriaSlug, familia, marca, variaciones,
//     estado, precioBcv, precioContado, precioPagoMovil, ofertaFlash,
//     destacado, imagen, pagina }
// -----------------------------------------------------------------------------

// Solo servidor: usa cookies() de Next y la clave de servicio. No importar
// este módulo desde un componente "use client".

import catalogoLocal from "@/data/catalogo.json";
import { createClient } from "@/libs/supabase/server";
import { haySupabase } from "@/libs/supabase/admin";
import { leerTasaVigente } from "@/libs/bcv";
import { FAMILIAS, quitarAcentos } from "@/libs/catalogo-normalizar.mjs";

const CAMPOS =
  "slug, nombre, categoria_slug, categoria_original, marca, variaciones, estado, " +
  "precio_bcv, precio_contado, precio_pago_movil, oferta_flash, destacado, imagen, pagina_catalogo";

function desdeFila(fila, categorias) {
  const categoria = categorias?.get(fila.categoria_slug);
  return {
    slug: fila.slug,
    nombre: fila.nombre,
    categoria: categoria?.nombre || fila.categoria_original || "Otros",
    categoriaSlug: fila.categoria_slug,
    familia: categoria?.familia || "otros",
    marca: fila.marca,
    variaciones: fila.variaciones || [],
    estado: fila.estado,
    precioBcv: fila.precio_bcv === null ? null : Number(fila.precio_bcv),
    precioContado: fila.precio_contado === null ? null : Number(fila.precio_contado),
    precioPagoMovil: fila.precio_pago_movil === null ? null : Number(fila.precio_pago_movil),
    ofertaFlash: fila.oferta_flash,
    destacado: fila.destacado,
    imagen: fila.imagen,
    pagina: fila.pagina_catalogo,
  };
}

/** Lee todo el catálogo una vez; filtrar y ordenar se hace en memoria. */
export async function leerCatalogo() {
  if (haySupabase()) {
    try {
      const supabase = await createClient();
      const [{ data: productos, error }, { data: cats }] = await Promise.all([
        supabase.from("productos").select(CAMPOS).eq("activo", true).order("nombre"),
        supabase.from("categorias").select("slug, nombre, familia"),
      ]);
      if (!error && productos?.length) {
        const categorias = new Map((cats || []).map((c) => [c.slug, c]));
        return {
          origen: "supabase",
          productos: productos.map((f) => desdeFila(f, categorias)),
          importado: null,
        };
      }
    } catch {
      // Sin base de datos o con la migración aún sin correr: seguimos con el JSON.
    }
  }

  return {
    origen: "json",
    productos: catalogoLocal.productos,
    importado: catalogoLocal.importado,
  };
}

const normalizar = (t) => quitarAcentos(String(t || "")).toLowerCase();

/**
 * Filtra y ordena el catálogo.
 * Los filtros vienen de la barra lateral de /tienda.
 */
export function filtrar(productos, filtros = {}) {
  const { familia, categoria, marca, busqueda, estado, soloOfertas, orden } = filtros;

  let lista = productos;

  if (familia) lista = lista.filter((p) => p.familia === familia);
  if (categoria) lista = lista.filter((p) => p.categoriaSlug === categoria);
  if (marca) lista = lista.filter((p) => p.marca === marca);
  if (estado) lista = lista.filter((p) => p.estado === estado);
  if (soloOfertas) lista = lista.filter((p) => p.ofertaFlash);

  if (busqueda) {
    // Todas las palabras tienen que aparecer, en el nombre, la marca,
    // la categoría o alguna variación.
    const palabras = normalizar(busqueda).split(/\s+/).filter(Boolean);
    lista = lista.filter((p) => {
      const heno = normalizar(
        [p.nombre, p.marca, p.categoria, ...(p.variaciones || [])].join(" ")
      );
      return palabras.every((palabra) => heno.includes(palabra));
    });
  }

  const precio = (p) => p.precioContado ?? p.precioBcv ?? Infinity;
  const ordenaciones = {
    relevancia: (a, b) =>
      Number(b.ofertaFlash) - Number(a.ofertaFlash) ||
      (a.estado === "disponible" ? 0 : 1) - (b.estado === "disponible" ? 0 : 1) ||
      a.nombre.localeCompare(b.nombre, "es"),
    "precio-asc": (a, b) => precio(a) - precio(b),
    "precio-desc": (a, b) => precio(b) - precio(a),
    nombre: (a, b) => a.nombre.localeCompare(b.nombre, "es"),
  };

  return [...lista].sort(ordenaciones[orden] || ordenaciones.relevancia);
}

/** Las facetas que se pintan en los filtros, con su número de productos. */
export function facetasDe(productos) {
  const contar = (clave) => {
    const cuenta = new Map();
    for (const p of productos) {
      const v = p[clave];
      if (v) cuenta.set(v, (cuenta.get(v) || 0) + 1);
    }
    return cuenta;
  };

  const porCategoria = new Map();
  for (const p of productos) {
    if (!porCategoria.has(p.categoriaSlug)) {
      porCategoria.set(p.categoriaSlug, {
        slug: p.categoriaSlug,
        nombre: p.categoria,
        familia: p.familia,
        total: 0,
      });
    }
    porCategoria.get(p.categoriaSlug).total++;
  }

  const porFamilia = contar("familia");

  return {
    familias: FAMILIAS.filter(([slug]) => porFamilia.get(slug)).map(([slug, nombre]) => ({
      slug,
      nombre,
      total: porFamilia.get(slug),
    })),
    categorias: [...porCategoria.values()].sort((a, b) => b.total - a.total),
    marcas: [...contar("marca").entries()]
      .map(([nombre, total]) => ({ nombre, total }))
      .sort((a, b) => b.total - a.total || a.nombre.localeCompare(b.nombre, "es")),
  };
}

export async function leerProducto(slug) {
  const { productos } = await leerCatalogo();
  return productos.find((p) => p.slug === slug) || null;
}

/** Otros productos de la misma categoría, para el pie de la ficha. */
export async function leerRelacionados(producto, cuantos = 6) {
  const { productos } = await leerCatalogo();
  const mismos = productos.filter(
    (p) => p.slug !== producto.slug && p.categoriaSlug === producto.categoriaSlug
  );
  const familia = productos.filter(
    (p) =>
      p.slug !== producto.slug &&
      p.categoriaSlug !== producto.categoriaSlug &&
      p.familia === producto.familia
  );
  return [...mismos, ...familia].slice(0, cuantos);
}

/** La tasa del BCV guardada. null si Supabase no está listo o el cron no ha corrido. */
export async function leerTasa() {
  if (!haySupabase()) return null;
  try {
    const supabase = await createClient();
    return await leerTasaVigente(supabase);
  } catch {
    return null;
  }
}
