"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback } from "react";

/**
 * Los filtros del inventario.
 *
 * Todo vive en la URL y no en el estado del componente: así una búsqueda
 * —"pickups Run & Drive hasta 30,000"— se copia y se manda por WhatsApp, que es
 * exactamente lo que hace un vendedor con un cliente. Y al volver atrás, el
 * navegador recupera el filtro.
 *
 * El primer corte es el SEGMENTO —en subasta o a pedido—, en una fila propia y
 * más grande que el resto: "¿cuánto por esa?" y "¿cuánto me sale una así?" son
 * dos preguntas distintas. La condición del lote (Run & Drive o solo enciende)
 * viene después, y la carrocería ya en tercer plano.
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

  const segmento = params.get("segmento") || "";
  const condicion = params.get("condicion") || "";
  const tipo = params.get("tipo") || "";
  const marca = params.get("marca") || "";
  const orden = params.get("orden") || "";
  const hayFiltro = Boolean(segmento || condicion || tipo || marca || orden || params.get("q"));

  return (
    <div className="space-y-5">
      {/* El corte principal: en subasta o a pedido. */}
      <div className="flex flex-wrap gap-2">
        <BotonFiltro activo={segmento === ""} onClick={() => cambiar("segmento", "")} grande>
          Todo
        </BotonFiltro>
        {facetas.segmentos.map((s) => (
          <BotonFiltro
            key={s.slug}
            activo={segmento === s.slug}
            onClick={() => cambiar("segmento", s.slug)}
            grande
          >
            {s.nombre}
            <span className="cifra ml-2 opacity-55">{s.total}</span>
          </BotonFiltro>
        ))}
      </div>

      {/* La condición del lote, en segundo plano. Solo tiene sentido en
          subasta: un modelo a pedido todavía no es un carro concreto. */}
      {segmento !== "pedido" && (
        <div className="flex flex-wrap gap-2">
          <BotonFiltro activo={condicion === ""} onClick={() => cambiar("condicion", "")}>
            Cualquier condición
          </BotonFiltro>
          {facetas.condiciones.map((c) => (
            <BotonFiltro
              key={c.slug}
              activo={condicion === c.slug}
              onClick={() => cambiar("condicion", c.slug)}
            >
              {c.nombre}
              <span className="cifra ml-1.5 opacity-55">{c.total}</span>
            </BotonFiltro>
          ))}
        </div>
      )}

      {/* La carrocería, ya en tercer plano. */}
      <div className="flex flex-wrap gap-2">
        <BotonFiltro activo={tipo === ""} onClick={() => cambiar("tipo", "")}>
          Cualquier carrocería
        </BotonFiltro>
        {facetas.tipos.map((t) => (
          <BotonFiltro
            key={t.slug}
            activo={tipo === t.slug}
            onClick={() => cambiar("tipo", t.slug)}
          >
            {t.nombre}
            <span className="cifra ml-1.5 opacity-55">{t.total}</span>
          </BotonFiltro>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3">
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
          <option value="millas-asc">Millaje: menos recorrido</option>
        </select>

        {hayFiltro && (
          <button
            type="button"
            onClick={() => router.push(ruta, { scroll: false })}
            className="text-sm text-base-content/50 underline-offset-4 transition-colors hover:text-primary hover:underline"
          >
            Limpiar filtros
          </button>
        )}

        <p className="cifra ml-auto text-sm text-base-content/45">
          {mostrados === total ? `${total} unidades` : `${mostrados} de ${total}`}
        </p>
      </div>
    </div>
  );
}

/**
 * Una pestaña de filtro, con la forma de las bandas rojas de sus piezas: recta
 * y con el texto blanco cuando está activa.
 */
function BotonFiltro({ activo, onClick, children, grande = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={activo}
      className={`display-recto tracking-wide transition-colors ${
        grande ? "px-5 py-2.5 text-sm" : "px-4 py-1.5 text-xs"
      } ${
        activo
          ? "pastilla"
          : "bg-base-200 text-base-content/70 hover:bg-base-300 hover:text-base-content"
      }`}
    >
      {children}
    </button>
  );
}
