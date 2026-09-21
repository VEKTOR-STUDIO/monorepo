"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback } from "react";

/**
 * Los filtros del inventario.
 *
 * Todo vive en la URL y no en el estado del componente: así una búsqueda
 * —"camionetas de Dubái hasta 40.000"— se copia y se manda por WhatsApp, que
 * es exactamente lo que hace un vendedor con un cliente. Y al volver atrás, el
 * navegador recupera el filtro.
 *
 * El orden de los cortes no es casual, y es lo que diferencia este inventario
 * del de cualquier otro concesionario:
 *
 *   1. ENTREGA —¿está aquí o hay que traerlo?—. Es la primera pregunta de
 *      todo el que escribe y la que decide si la conversación va de venir
 *      mañana o de encargar a cuatro semanas.
 *   2. PROCEDENCIA. La primera línea de su bio es "Dubái | Europa | China |
 *      USA", así que mucha gente llega buscando por ahí.
 *   3. El resto —tipo, condición, sede, marca— en selectores, que es donde
 *      va lo que se consulta y no lo que se navega.
 */
export default function FiltrosVehiculos({ facetas, total, mostrados }) {
  const router = useRouter();
  const ruta = usePathname();
  const params = useSearchParams();

  const cambiar = useCallback(
    (clave, valor) => {
      const nuevos = new URLSearchParams(params.toString());
      if (!valor) nuevos.delete(clave);
      else nuevos.set(clave, valor);
      const cadena = nuevos.toString();
      router.push(cadena ? `${ruta}?${cadena}` : ruta, { scroll: false });
    },
    [params, router, ruta]
  );

  const entrega = params.get("entrega") || "";
  const origen = params.get("origen") || "";
  const tipo = params.get("tipo") || "";
  const condicion = params.get("condicion") || "";
  const sede = params.get("sede") || "";
  const marca = params.get("marca") || "";
  const orden = params.get("orden") || "";
  const hayFiltro = Boolean(
    entrega || origen || tipo || condicion || sede || marca || orden || params.get("q")
  );

  return (
    <div className="space-y-5">
      {/* 1. ¿Está aquí o hay que traerlo? */}
      <div className="flex flex-wrap gap-2">
        <BotonFiltro activo={entrega === ""} onClick={() => cambiar("entrega", "")} grande>
          Todo
        </BotonFiltro>
        {facetas.entregas.map((e) => (
          <BotonFiltro
            key={e.slug}
            activo={entrega === e.slug}
            onClick={() => cambiar("entrega", e.slug)}
            grande
          >
            {e.nombre}
            <span className="cifra ml-2 opacity-55">{e.total}</span>
          </BotonFiltro>
        ))}
      </div>

      {/* 2. De dónde viene. */}
      <div className="flex flex-wrap gap-2">
        <BotonFiltro activo={origen === ""} onClick={() => cambiar("origen", "")}>
          Cualquier procedencia
        </BotonFiltro>
        {facetas.origenes.map((o) => (
          <BotonFiltro
            key={o.slug}
            activo={origen === o.slug}
            onClick={() => cambiar("origen", o.slug)}
          >
            {o.nombre}
            <span className="cifra ml-1.5 opacity-55">{o.total}</span>
          </BotonFiltro>
        ))}
      </div>

      {/* 3. Lo que se consulta. */}
      <div className="flex flex-wrap items-center gap-3">
        <select
          value={tipo}
          onChange={(e) => cambiar("tipo", e.target.value)}
          className="entrada max-w-45 cursor-pointer py-2 text-sm"
          aria-label="Filtrar por carrocería"
        >
          <option value="">Cualquier tipo</option>
          {facetas.tipos.map((t) => (
            <option key={t.slug} value={t.slug}>
              {t.nombre} ({t.total})
            </option>
          ))}
        </select>

        <select
          value={condicion}
          onChange={(e) => cambiar("condicion", e.target.value)}
          className="entrada max-w-45 cursor-pointer py-2 text-sm"
          aria-label="Filtrar por condición"
        >
          <option value="">Nuevos y usados</option>
          {facetas.condiciones.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.nombre} ({c.total})
            </option>
          ))}
        </select>

        <select
          value={sede}
          onChange={(e) => cambiar("sede", e.target.value)}
          className="entrada max-w-45 cursor-pointer py-2 text-sm"
          aria-label="Filtrar por sede"
        >
          <option value="">Las dos sedes</option>
          {facetas.sedes.map((s) => (
            <option key={s.slug} value={s.slug}>
              {s.corto} ({s.total})
            </option>
          ))}
        </select>

        <select
          value={marca}
          onChange={(e) => cambiar("marca", e.target.value)}
          className="entrada max-w-45 cursor-pointer py-2 text-sm"
          aria-label="Filtrar por marca"
        >
          <option value="">Todas las marcas</option>
          {facetas.marcas.map((m) => (
            <option key={m.valor} value={m.valor}>
              {m.valor} ({m.total})
            </option>
          ))}
        </select>

        <select
          value={orden}
          onChange={(e) => cambiar("orden", e.target.value)}
          className="entrada max-w-52 cursor-pointer py-2 text-sm"
          aria-label="Ordenar"
        >
          <option value="">Orden recomendado</option>
          <option value="precio-asc">Precio: de menor a mayor</option>
          <option value="precio-desc">Precio: de mayor a menor</option>
          <option value="anio-desc">Año: más nuevo primero</option>
          <option value="km-asc">Kilometraje: menos recorrido</option>
        </select>

        {hayFiltro && (
          <button
            type="button"
            onClick={() => router.push(ruta, { scroll: false })}
            className="text-sm text-base-content/50 underline-offset-4 transition-colors hover:text-base-content hover:underline"
          >
            Limpiar filtros
          </button>
        )}

        <p className="cifra ml-auto text-sm text-base-content/45">
          {mostrados === total ? `${total} vehículos` : `${mostrados} de ${total}`}
        </p>
      </div>
    </div>
  );
}

/**
 * Una pestaña de filtro, con el filo sesgado de la casa.
 *
 * El sesgo va en el botón y el contenido se endereza con `.bisel`, así que el
 * texto sale recto aunque la caja esté inclinada.
 */
function BotonFiltro({ activo, onClick, children, grande = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={activo}
      className={`bisel transition-colors ${
        activo
          ? "bg-primary text-primary-content"
          : "bg-base-200 text-base-content/70 hover:bg-base-300 hover:text-base-content"
      }`}
    >
      <span
        className={`display-recto block ${
          grande ? "px-5 py-2.5 text-sm" : "px-4 py-1.5 text-xs"
        }`}
      >
        {children}
      </span>
    </button>
  );
}
