"use server";

// -----------------------------------------------------------------------------
// Lo que el panel puede cambiar.
//
// Todas las acciones empiezan igual: comprobando que quien llama es admin.
// Una server action es un endpoint público aunque solo se invoque desde una
// página protegida, así que el permiso se verifica aquí, no en la pantalla.
// -----------------------------------------------------------------------------

import { revalidatePath, revalidateTag } from "next/cache";
import { createClient } from "@/libs/supabase/server";
import { createAdminClient } from "@/libs/supabase/admin";
import { leerCatalogo } from "@/libs/catalogo";
import { obtenerTasaConDetalle } from "@/libs/bcv";
import { leerCatalogoPdf, extraerImagen } from "@/libs/pdf-catalog.mjs";
import { normalizarProductos } from "@/libs/catalogo-normalizar.mjs";
import { esDemo, MENSAJE_BLOQUEADO } from "@/libs/demo";
import { DEV_NO_LOGIN } from "@/libs/dev-mode";

// Cuántas fotos se suben como mucho en una importación. Subir 231 en una sola
// petición se sale del tiempo de una función serverless; se hace por tandas y
// se avisa de cuántas quedan.
const MAXIMO_FOTOS_POR_TANDA = 40;

/** Quién puede mirar el panel. En demo se deja mirar: es lo que se vende. */
async function exigirLectura() {
  if (esDemo() || DEV_NO_LOGIN) return { id: null };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Necesitas iniciar sesión.");

  const { data: perfil } = await supabase
    .from("perfiles")
    .select("rol")
    .eq("id", user.id)
    .maybeSingle();

  if (perfil?.rol !== "admin") throw new Error("Tu cuenta no tiene permisos de administración.");
  return user;
}

/** Quién puede cambiar algo. En demo, nadie. */
async function exigirAdmin() {
  // Se corta aquí, en el servidor: una server action es un endpoint público
  // aunque el botón que la dispara esté deshabilitado en pantalla.
  if (esDemo()) throw new Error(MENSAJE_BLOQUEADO);
  return exigirLectura();
}

function refrescarTienda() {
  revalidatePath("/");
  revalidatePath("/tienda");
  revalidatePath("/producto/[slug]", "page");
}

// -----------------------------------------------------------------------------
// Importar un PDF
// -----------------------------------------------------------------------------

async function leerPdfDeFormulario(formData) {
  const archivo = formData.get("pdf");
  if (!archivo || typeof archivo.arrayBuffer !== "function") {
    throw new Error("Adjunta el PDF del catálogo.");
  }
  if (archivo.size > 25 * 1024 * 1024) {
    throw new Error("El PDF pesa más de 25 MB. ¿Seguro que es el catálogo?");
  }

  const buffer = Buffer.from(await archivo.arrayBuffer());
  if (buffer.subarray(0, 5).toString("latin1") !== "%PDF-") {
    throw new Error("Ese archivo no es un PDF.");
  }

  const { productos: filas, paginas, crudo, objetos } = leerCatalogoPdf(buffer);
  if (!filas.length) {
    throw new Error(
      "No se encontró ningún producto. El PDF tiene que ser la lista de Hardcore con sus columnas de siempre."
    );
  }

  return { nombre: archivo.name, productos: normalizarProductos(filas), paginas, crudo, objetos };
}

/**
 * Compara el PDF con lo que hay en la base y cuenta qué cambiaría.
 * No escribe nada: es la pantalla de "esto es lo que va a pasar".
 */
export async function analizarPdf(_previo, formData) {
  try {
    // Analizar solo lee y compara, no escribe: se deja hacer también en la
    // demo, porque es justo lo que hay que enseñar.
    await exigirLectura();
    const { nombre, productos, paginas } = await leerPdfDeFormulario(formData);

    // Se compara contra lo que la tienda está sirviendo ahora mismo, venga de
    // Supabase o del catálogo en JSON. Así el análisis funciona igual antes de
    // conectar la base de datos.
    const { productos: catalogoActual } = await leerCatalogo();
    const actuales = catalogoActual.map((p) => ({
      slug: p.slug,
      nombre: p.nombre,
      precio_bcv: p.precioBcv,
      precio_contado: p.precioContado,
      precio_pago_movil: p.precioPagoMovil,
      estado: p.estado,
      activo: true,
      imagen: p.imagen,
    }));

    const porSlug = new Map(actuales.map((p) => [p.slug, p]));
    const enElPdf = new Set(productos.map((p) => p.slug));

    const nuevos = [];
    const cambios = [];
    const sinFoto = [];

    for (const producto of productos) {
      const actual = porSlug.get(producto.slug);
      if (!actual) {
        nuevos.push(producto);
        continue;
      }
      if (!actual.imagen && producto.imagenObj) sinFoto.push(producto);

      const diferencias = [];
      const comparar = (etiqueta, antes, ahora) => {
        if (Number(antes ?? -1) !== Number(ahora ?? -1)) {
          diferencias.push({ etiqueta, antes, ahora });
        }
      };
      comparar("Contado", actual.precio_contado, producto.precioContado);
      comparar("BCV", actual.precio_bcv, producto.precioBcv);
      comparar("Pago Móvil", actual.precio_pago_movil, producto.precioPagoMovil);

      if (actual.estado !== producto.estado) {
        diferencias.push({ etiqueta: "Estado", antes: actual.estado, ahora: producto.estado });
      }
      if (!actual.activo) {
        diferencias.push({ etiqueta: "Vuelve a la lista", antes: "oculto", ahora: "activo" });
      }

      if (diferencias.length) cambios.push({ ...producto, diferencias });
    }

    const desaparecidos = actuales.filter((p) => !enElPdf.has(p.slug));

    return {
      ok: true,
      resumen: {
        archivo: nombre,
        paginas,
        total: productos.length,
        yaEstaban: productos.length - nuevos.length,
        nuevos: nuevos.slice(0, 50),
        totalNuevos: nuevos.length,
        cambios: cambios.slice(0, 50),
        totalCambios: cambios.length,
        desaparecidos: desaparecidos.slice(0, 50),
        totalDesaparecidos: desaparecidos.length,
        fotasPendientes: sinFoto.length + nuevos.filter((n) => n.imagenObj).length,
        primeraVez: actuales.length === 0,
      },
    };
  } catch (error) {
    return { ok: false, error: error.message };
  }
}

/** Escribe el catálogo del PDF en la base de datos. */
export async function aplicarImportacion(_previo, formData) {
  try {
    const usuario = await exigirAdmin();
    const subirFotos = formData.get("subirFotos") === "on";
    const { nombre, productos, crudo, objetos } = await leerPdfDeFormulario(formData);
    const supabase = createAdminClient();

    // --- categorías ---
    const categorias = new Map();
    for (const p of productos) {
      categorias.set(p.categoriaSlug, {
        slug: p.categoriaSlug,
        nombre: p.categoria,
        familia: p.familia,
      });
    }
    const { error: errorCategorias } = await supabase
      .from("categorias")
      .upsert([...categorias.values()], { onConflict: "slug" });
    if (errorCategorias) throw errorCategorias;

    // --- qué había antes ---
    const { data: actuales } = await supabase.from("productos").select("slug, imagen, activo");
    const porSlug = new Map((actuales || []).map((p) => [p.slug, p]));
    const nuevos = productos.filter((p) => !porSlug.has(p.slug));

    // --- fotos ---
    // Solo las que faltan: las que ya están no se vuelven a subir, porque el
    // PDF trae siempre las mismas y Hardcore puede haber puesto una mejor.
    let fotosSubidas = 0;
    let fotosPendientes = 0;

    if (subirFotos) {
      const cache = new Map();
      for (const producto of productos) {
        const actual = porSlug.get(producto.slug);
        if (actual?.imagen) continue;
        if (!producto.imagenObj) continue;

        if (fotosSubidas >= MAXIMO_FOTOS_POR_TANDA) {
          fotosPendientes++;
          continue;
        }

        let imagen = cache.get(producto.imagenObj);
        if (imagen === undefined) {
          imagen = extraerImagen(crudo, objetos, producto.imagenObj);
          cache.set(producto.imagenObj, imagen);
        }
        if (!imagen) continue;

        const ruta = `${producto.slug}.${imagen.extension}`;
        const { error: errorSubida } = await supabase.storage
          .from("productos")
          .upload(ruta, imagen.datos, {
            contentType: imagen.extension === "jpg" ? "image/jpeg" : "image/png",
            upsert: true,
          });

        if (!errorSubida) {
          const { data } = supabase.storage.from("productos").getPublicUrl(ruta);
          producto.imagen = data.publicUrl;
          fotosSubidas++;
        }
      }
    }

    // --- productos ---
    const filas = productos.map((p) => ({
      slug: p.slug,
      nombre: p.nombre,
      categoria_slug: p.categoriaSlug,
      categoria_original: p.categoriaOriginal,
      marca: p.marca,
      variaciones: p.variaciones,
      estado: p.estado,
      precio_bcv: p.precioBcv,
      precio_contado: p.precioContado,
      precio_pago_movil: p.precioPagoMovil,
      oferta_flash: p.ofertaFlash,
      pagina_catalogo: p.pagina,
      activo: true,
      actualizado_en: new Date().toISOString(),
      // Solo se manda imagen si acabamos de subirla: si va null, el upsert
      // borraría la que ya tenía.
      ...(p.imagen ? { imagen: p.imagen } : {}),
    }));

    // Por tandas, que un upsert de 231 filas de golpe es pesado.
    for (let i = 0; i < filas.length; i += 100) {
      const { error } = await supabase
        .from("productos")
        .upsert(filas.slice(i, i + 100), { onConflict: "slug" });
      if (error) throw error;
    }

    // --- lo que ya no viene en la lista ---
    const slugs = productos.map((p) => p.slug);
    const desaparecidos = (actuales || []).filter((p) => p.activo && !slugs.includes(p.slug));
    if (desaparecidos.length) {
      const { error } = await supabase
        .from("productos")
        .update({ activo: false, actualizado_en: new Date().toISOString() })
        .in(
          "slug",
          desaparecidos.map((p) => p.slug)
        );
      if (error) throw error;
    }

    await supabase.from("importaciones").insert({
      archivo: nombre,
      total: productos.length,
      nuevos: nuevos.length,
      actualizados: productos.length - nuevos.length,
      desactivados: desaparecidos.length,
      usuario_id: usuario?.id ?? null,
      detalle: { fotosSubidas, fotosPendientes },
    });

    refrescarTienda();
    revalidatePath("/admin");
    revalidatePath("/admin/importar");
    revalidatePath("/admin/productos");

    return {
      ok: true,
      aplicado: {
        total: productos.length,
        nuevos: nuevos.length,
        actualizados: productos.length - nuevos.length,
        desactivados: desaparecidos.length,
        fotosSubidas,
        fotosPendientes,
      },
    };
  } catch (error) {
    return { ok: false, error: error.message };
  }
}

// -----------------------------------------------------------------------------
// Tasa
// -----------------------------------------------------------------------------

/**
 * Vuelve a preguntar la tasa sin esperar a que caduque el caché.
 *
 * No guarda nada: la tasa se consulta a una API y Next la cachea una hora.
 * Esto tira ese caché y fuerza una lectura nueva.
 */
export async function actualizarTasaAhora() {
  try {
    await exigirAdmin();

    revalidateTag("tasa-bcv");
    const tasa = await obtenerTasaConDetalle();
    if (!tasa) {
      return { ok: false, error: "Ninguna fuente respondió.", avisos: [] };
    }

    refrescarTienda();
    revalidatePath("/admin/tasa");

    return {
      ok: true,
      tasa: { valor: tasa.valor, fechaValor: tasa.fechaValor, fuente: tasa.fuente },
      avisos: tasa.fallos,
    };
  } catch (error) {
    return { ok: false, error: error.message, avisos: [] };
  }
}

// -----------------------------------------------------------------------------
// Productos y pedidos
// -----------------------------------------------------------------------------

export async function guardarProducto(_previo, formData) {
  try {
    await exigirAdmin();
    const supabase = createAdminClient();

    const slug = String(formData.get("slug") || "");
    if (!slug) throw new Error("Falta el producto.");

    const numero = (campo) => {
      const valor = formData.get(campo);
      if (valor === null || valor === "") return null;
      const n = Number(valor);
      if (!Number.isFinite(n) || n < 0) throw new Error(`"${campo}" no es un precio válido.`);
      return n;
    };

    const { error } = await supabase
      .from("productos")
      .update({
        precio_contado: numero("precio_contado"),
        precio_bcv: numero("precio_bcv"),
        precio_pago_movil: numero("precio_pago_movil"),
        estado: String(formData.get("estado") || "disponible"),
        oferta_flash: formData.get("oferta_flash") === "on",
        destacado: formData.get("destacado") === "on",
        activo: formData.get("activo") === "on",
        actualizado_en: new Date().toISOString(),
      })
      .eq("slug", slug);

    if (error) throw error;

    refrescarTienda();
    revalidatePath("/admin/productos");
    return { ok: true, mensaje: "Guardado." };
  } catch (error) {
    return { ok: false, error: error.message };
  }
}

export async function cambiarEstadoPedido(_previo, formData) {
  try {
    await exigirAdmin();
    const supabase = createAdminClient();

    const codigo = String(formData.get("codigo") || "");
    const estado = String(formData.get("estado") || "");
    if (!["nuevo", "confirmado", "entregado", "cancelado"].includes(estado)) {
      throw new Error("Ese estado no existe.");
    }

    const { error } = await supabase.from("pedidos").update({ estado }).eq("codigo", codigo);
    if (error) throw error;

    revalidatePath("/admin/pedidos");
    revalidatePath("/admin");
    return { ok: true, mensaje: `Pedido ${codigo}: ${estado}.` };
  } catch (error) {
    return { ok: false, error: error.message };
  }
}
