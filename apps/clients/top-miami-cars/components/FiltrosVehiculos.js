"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback } from "react";

/**
 * Los filtros del inventario.
 *
 * Todo vive en la URL y no en el estado del componente: así una búsqueda
 * —"camionetas hasta 30.000"— se copia y se manda por WhatsApp, que es
 * exactamente lo que hace un vendedor con un cliente. Y al volver atrás, el
 * navegador recupera el filtro.
 *
 * El primer corte es la CARROCERÍA, en una fila propia y más grande que el
 * resto: en un salón de usados lo primero que se pregunta es "¿qué camionetas
 * tienes?". La condición (0 km o usado) solo se enseña si hay de las dos; hoy
 * todo es usado, así que esa fila ni sale.
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

  const condicion = params.get("condicion") || "";
  const tipo = params.get("tipo") || "";
  const marca = params.get("marca") || "";
  const orden = params.get("orden") || "";
  const hayFiltro = Boolean(condicion || tipo || marca || orden || params.get("q"));

  return (
    <div className="space-y-5">
      {/* El corte principal: la carrocería. */}
      <div className="flex flex-wrap gap-2.5">
        <BotonFiltro activo={tipo === ""} onClick={() => cambiar("tipo", "")} grande>
          Todo
        </BotonFiltro>
        {facetas.tipos.map((t) => (
          <BotonFiltro
            key={t.slug}
            activo={tipo === t.slug}
            onClick={() => cambiar("tipo", t.slug)}
            grande
          >
            {t.nombre}
            <span className="cifra ml-2 opacity-55">{t.total}</span>
          </BotonFiltro>
        ))}
      </div>

      {/* La condición, solo si hay de las dos: un filtro con una sola opción
          no filtra nada. */}
      {facetas.condiciones.length > 1 && (
        <div className="flex flex-wrap gap-2">
          <BotonFiltro activo={condicion === ""} onClick={() => cambiar("condicion", "")}>
            Nuevas y usadas
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
          <option value="km-asc">Kilometraje: menos recorrido</option>
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
 * Una pestaña de filtro.
 *
 * Redonda del todo, y con los dos tratamientos del logotipo: apagada es blanca
 * con su borde, encendida es la pastilla azul de "CARS" con el filete blanco y
 * la sombra dura.
 */
function BotonFiltro({ activo, onClick, children, grande = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={activo}
      className={`display-recto rounded-full transition-colors ${
        grande ? "px-5 py-2.5 text-xs" : "px-4 py-1.5 text-[0.65rem]"
      } ${
        activo
          ? "pastilla font-normal!"
          : "border border-base-content/15 bg-base-100 text-base-content/70 hover:border-primary/50 hover:text-primary"
      }`}
    >
      {children}
    </button>
  );
}
