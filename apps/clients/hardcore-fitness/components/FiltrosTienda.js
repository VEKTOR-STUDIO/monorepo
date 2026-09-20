"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

/**
 * Filtros del catálogo, en dos piezas.
 *
 *   <BarraTienda>    va a todo lo ancho, encima de la cuadrícula
 *   <PanelFiltros>   va en la columna de la izquierda
 *
 * Están separadas porque ocupan celdas distintas del layout; si fueran un solo
 * componente, la barra caería dentro de la columna estrecha.
 *
 * Todo el estado vive en la URL, no en React: así un filtro se puede compartir
 * por WhatsApp ("mira, /tienda?familia=proteinas"), el botón de atrás funciona
 * y el servidor puede renderizar la cuadrícula ya filtrada.
 */

const CLAVES = ["familia", "categoria", "marca", "estado", "ofertas", "q"];

function useFiltros() {
  const router = useRouter();
  const ruta = usePathname();
  const parametros = useSearchParams();

  const cambiar = (clave, valor) => {
    const nuevos = new URLSearchParams(parametros);
    if (!valor || nuevos.get(clave) === valor) nuevos.delete(clave);
    else nuevos.set(clave, valor);

    // Cambiar de familia invalida la categoría elegida dentro de la anterior.
    if (clave === "familia") nuevos.delete("categoria");

    const cadena = nuevos.toString();
    router.push(cadena ? `${ruta}?${cadena}` : ruta, { scroll: false });
  };

  return { parametros, cambiar, limpiar: () => router.push(ruta, { scroll: false }) };
}

// -----------------------------------------------------------------------------

export function BarraTienda({ facetas, total, mostrados }) {
  const { parametros, cambiar, limpiar } = useFiltros();
  const activos = CLAVES.filter((clave) => parametros.get(clave));

  return (
    <div className="mb-8 border-b border-base-content/10 pb-5">
      <div className="flex flex-wrap items-center gap-4">
        <p className="cifra text-sm text-base-content/50">
          {mostrados === total ? `${total} productos` : `${mostrados} de ${total} productos`}
        </p>

        <div className="ml-auto flex items-center gap-2">
          <label htmlFor="orden" className="text-xs text-base-content/45">
            Ordenar
          </label>
          <select
            id="orden"
            value={parametros.get("orden") || "relevancia"}
            onChange={(e) =>
              cambiar("orden", e.target.value === "relevancia" ? null : e.target.value)
            }
            className="h-9 rounded-lg border border-base-content/12 bg-base-200/60 px-3 text-sm outline-none focus:border-primary/60"
          >
            <option value="relevancia">Recomendados</option>
            <option value="precio-asc">Precio: menor primero</option>
            <option value="precio-desc">Precio: mayor primero</option>
            <option value="nombre">Nombre A-Z</option>
          </select>
        </div>
      </div>

      {activos.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {activos.map((clave) => (
            <button
              key={clave}
              type="button"
              onClick={() => cambiar(clave, null)}
              className="flex items-center gap-1.5 rounded-lg border border-primary/40 bg-primary/10 px-3 py-1 text-xs text-primary transition-colors hover:bg-primary/20"
            >
              {etiquetaDe(clave, parametros.get(clave), facetas)}
              <span aria-hidden="true">×</span>
              <span className="sr-only">Quitar filtro</span>
            </button>
          ))}
          <button
            type="button"
            onClick={limpiar}
            className="text-xs text-base-content/45 underline-offset-2 hover:underline"
          >
            Limpiar todo
          </button>
        </div>
      )}
    </div>
  );
}

// -----------------------------------------------------------------------------

export function PanelFiltros({ facetas }) {
  const { parametros, cambiar } = useFiltros();
  const activos = CLAVES.filter((clave) => parametros.get(clave)).length;

  // En pantalla estrecha el panel se pliega; en ancha siempre está abierto.
  const categoriasVisibles = parametros.get("familia")
    ? facetas.categorias.filter((c) => c.familia === parametros.get("familia"))
    : facetas.categorias.slice(0, 14);

  const contenido = (
    <div className="space-y-7">
      <Grupo titulo="Categoría">
        {facetas.familias.map((familia) => (
          <Opcion
            key={familia.slug}
            activa={parametros.get("familia") === familia.slug}
            onClick={() => cambiar("familia", familia.slug)}
          >
            {familia.nombre}
            <Cuenta>{familia.total}</Cuenta>
          </Opcion>
        ))}
      </Grupo>

      {categoriasVisibles.length > 1 && (
        <Grupo titulo="Tipo">
          {categoriasVisibles.map((categoria) => (
            <Opcion
              key={categoria.slug}
              activa={parametros.get("categoria") === categoria.slug}
              onClick={() => cambiar("categoria", categoria.slug)}
            >
              {categoria.nombre}
              <Cuenta>{categoria.total}</Cuenta>
            </Opcion>
          ))}
        </Grupo>
      )}

      <Grupo titulo="Disponibilidad">
        <Opcion
          activa={parametros.get("estado") === "disponible"}
          onClick={() => cambiar("estado", "disponible")}
        >
          Disponible ahora
        </Opcion>
        <Opcion
          activa={parametros.get("estado") === "transito"}
          onClick={() => cambiar("estado", "transito")}
        >
          En tránsito
        </Opcion>
        <Opcion activa={parametros.get("ofertas") === "1"} onClick={() => cambiar("ofertas", "1")}>
          Solo ofertas flash
        </Opcion>
      </Grupo>

      <Grupo titulo="Marca">
        <div className="max-h-72 space-y-0.5 overflow-y-auto pr-1">
          {facetas.marcas.map((marca) => (
            <Opcion
              key={marca.nombre}
              activa={parametros.get("marca") === marca.nombre}
              onClick={() => cambiar("marca", marca.nombre)}
            >
              {marca.nombre}
              <Cuenta>{marca.total}</Cuenta>
            </Opcion>
          ))}
        </div>
      </Grupo>
    </div>
  );

  return (
    <aside aria-label="Filtros del catálogo">
      <details className="ficha mb-6 px-4 py-3 lg:hidden">
        <summary className="cursor-pointer text-sm font-medium">
          Filtros
          {activos > 0 && (
            <span className="cifra ml-2 rounded-lg bg-primary px-1.5 text-primary-content">
              {activos}
            </span>
          )}
        </summary>
        <div className="pt-5">{contenido}</div>
      </details>

      <div className="hidden lg:block">{contenido}</div>
    </aside>
  );
}

// -----------------------------------------------------------------------------

function Grupo({ titulo, children }) {
  return (
    <section>
      <h2 className="rotulo mb-3">{titulo}</h2>
      <div className="flex flex-col items-start gap-0.5">{children}</div>
    </section>
  );
}

function Opcion({ activa, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={activa}
      className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-sm transition-colors ${
        activa
          ? "bg-primary/12 text-primary"
          : "text-base-content/65 hover:bg-base-200 hover:text-base-content"
      }`}
    >
      {children}
    </button>
  );
}

function Cuenta({ children }) {
  return <span className="cifra ml-auto text-[0.65rem] text-base-content/35">{children}</span>;
}

function etiquetaDe(clave, valor, facetas) {
  if (clave === "ofertas") return "Ofertas flash";
  if (clave === "q") return `"${valor}"`;
  if (clave === "estado") return valor === "transito" ? "En tránsito" : "Disponible";
  if (clave === "familia") return facetas.familias.find((f) => f.slug === valor)?.nombre || valor;
  if (clave === "categoria") return facetas.categorias.find((c) => c.slug === valor)?.nombre || valor;
  return valor;
}
