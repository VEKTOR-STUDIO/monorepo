import Link from "next/link";
import EditorProducto from "@/components/admin/EditorProducto";
import { createAdminClient, haySupabase } from "@/libs/supabase/admin";
import { quitarAcentos } from "@/libs/catalogo-normalizar.mjs";

export const dynamic = "force-dynamic";

const POR_PAGINA = 40;

export default async function Productos({ searchParams }) {
  const p = (await searchParams) || {};
  const busqueda = (p.q || "").trim();
  const filtro = p.filtro || "todos";
  const pagina = Math.max(1, Number(p.pagina) || 1);

  if (!haySupabase()) {
    return (
      <Vacio
        titulo="SIN BASE DE DATOS"
        texto="Conecta Supabase y corre la migración para poder editar el catálogo desde aquí."
      />
    );
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("productos")
    .select(
      "slug, nombre, marca, categoria_original, estado, precio_bcv, precio_contado, precio_pago_movil, oferta_flash, destacado, activo, imagen"
    )
    .order("nombre");

  if (error || !data) {
    return (
      <Vacio
        titulo="NO SE PUDO LEER EL CATÁLOGO"
        texto="Revisa que la migración esté aplicada y que la service role key sea la correcta."
      />
    );
  }

  const normalizar = (t) => quitarAcentos(String(t || "")).toLowerCase();
  const palabras = normalizar(busqueda).split(/\s+/).filter(Boolean);

  const filtrados = data.filter((producto) => {
    if (filtro === "ocultos" && producto.activo) return false;
    if (filtro === "ofertas" && !producto.oferta_flash) return false;
    if (filtro === "transito" && producto.estado !== "transito") return false;
    if (filtro === "sin-foto" && producto.imagen) return false;

    if (!palabras.length) return true;
    const heno = normalizar(
      [producto.nombre, producto.marca, producto.categoria_original].join(" ")
    );
    return palabras.every((palabra) => heno.includes(palabra));
  });

  const totalPaginas = Math.max(1, Math.ceil(filtrados.length / POR_PAGINA));
  const paginaActual = Math.min(pagina, totalPaginas);
  const visibles = filtrados.slice((paginaActual - 1) * POR_PAGINA, paginaActual * POR_PAGINA);

  const enlace = (cambios) => {
    const nuevos = new URLSearchParams();
    if (busqueda) nuevos.set("q", busqueda);
    if (filtro !== "todos") nuevos.set("filtro", filtro);
    for (const [clave, valor] of Object.entries(cambios)) {
      if (valor === null) nuevos.delete(clave);
      else nuevos.set(clave, String(valor));
    }
    return `/admin/productos?${nuevos.toString()}`;
  };

  const FILTROS = [
    ["todos", "Todos", data.length],
    ["ofertas", "Ofertas flash", data.filter((x) => x.oferta_flash).length],
    ["transito", "En tránsito", data.filter((x) => x.estado === "transito").length],
    ["ocultos", "Ocultos", data.filter((x) => !x.activo).length],
    ["sin-foto", "Sin foto", data.filter((x) => !x.imagen).length],
  ];

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="display text-3xl">PRODUCTOS</h1>
          <p className="mt-2 text-sm text-base-content/55">
            Los precios los pone la importación del PDF. Aquí se corrigen casos puntuales.
          </p>
        </div>
        <Link href="/admin/importar" className="btn btn-sm btn-primary">
          Importar PDF
        </Link>
      </div>

      <form method="get" className="mt-6 flex flex-wrap gap-3">
        <input
          type="search"
          name="q"
          defaultValue={busqueda}
          placeholder="Buscar por nombre, marca o categoría"
          className="entrada max-w-sm"
          aria-label="Buscar productos"
        />
        {filtro !== "todos" && <input type="hidden" name="filtro" value={filtro} />}
        <button type="submit" className="btn btn-sm">
          Buscar
        </button>
      </form>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {FILTROS.map(([id, texto, cuenta]) => (
          <Link
            key={id}
            href={enlace({ filtro: id === "todos" ? null : id, pagina: null })}
            className={`rounded-lg px-3 py-1.5 text-sm transition-colors ${
              filtro === id
                ? "bg-primary/12 text-primary"
                : "text-base-content/60 hover:bg-base-200"
            }`}
          >
            {texto} <span className="cifra text-[0.65rem] text-base-content/35">{cuenta}</span>
          </Link>
        ))}
      </div>

      <p className="cifra mt-5 text-sm text-base-content/45">
        {filtrados.length} {filtrados.length === 1 ? "producto" : "productos"}
        {totalPaginas > 1 && ` · página ${paginaActual} de ${totalPaginas}`}
      </p>

      <ul className="ficha mt-4 px-4">
        {visibles.length === 0 ? (
          <li className="py-14 text-center text-sm text-base-content/45">
            Nada coincide con esa búsqueda.
          </li>
        ) : (
          visibles.map((producto) => <EditorProducto key={producto.slug} producto={producto} />)
        )}
      </ul>

      {totalPaginas > 1 && (
        <nav className="mt-6 flex items-center justify-center gap-3" aria-label="Páginas">
          {paginaActual > 1 && (
            <Link href={enlace({ pagina: paginaActual - 1 })} className="btn btn-sm btn-outline">
              Anterior
            </Link>
          )}
          <span className="cifra text-sm text-base-content/45">
            {paginaActual} / {totalPaginas}
          </span>
          {paginaActual < totalPaginas && (
            <Link href={enlace({ pagina: paginaActual + 1 })} className="btn btn-sm btn-outline">
              Siguiente
            </Link>
          )}
        </nav>
      )}
    </div>
  );
}

function Vacio({ titulo, texto }) {
  return (
    <div className="ficha px-6 py-16 text-center">
      <h1 className="display text-2xl">{titulo}</h1>
      <p className="mx-auto mt-4 max-w-md text-sm text-base-content/55">{texto}</p>
    </div>
  );
}
