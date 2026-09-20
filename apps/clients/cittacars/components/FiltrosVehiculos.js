"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback } from "react";

/**
 * Los filtros del inventario.
 *
 * Todo vive en la URL y no en el estado del componente: así una búsqueda
 * —"camionetas Toyota hasta 40.000"— se copia y se manda por WhatsApp, que es
 * exactamente lo que hace un vendedor con un cliente. Y al volver atrás, el
 * navegador recupera el filtro.
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

  const tipo = params.get("tipo") || "";
  const marca = params.get("marca") || "";
  const orden = params.get("orden") || "";
  const hayFiltro = Boolean(tipo || marca || orden || params.get("q"));

  return (
    <div className="space-y-5">
      {/* Tipos, como pestañas: es el corte que usa todo el mundo primero. */}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => cambiar("tipo", "")}
          className={`btn btn-sm ${tipo === "" ? "btn-primary" : "btn-ghost border border-base-content/12"}`}
        >
          Todos
        </button>
        {facetas.tipos.map((t) => (
          <button
            key={t.slug}
            type="button"
            onClick={() => cambiar("tipo", t.slug)}
            className={`btn btn-sm ${tipo === t.slug ? "btn-primary" : "btn-ghost border border-base-content/12"}`}
          >
            {t.nombre}
            <span className="cifra ml-1.5 opacity-55">{t.total}</span>
          </button>
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
          <option value="km-asc">Kilometraje: menos recorrido</option>
        </select>

        {hayFiltro && (
          <button
            type="button"
            onClick={() => router.push(ruta, { scroll: false })}
            className="btn btn-ghost btn-sm text-base-content/55"
          >
            Limpiar
          </button>
        )}

        <p className="cifra ml-auto text-sm text-base-content/50">
          {mostrados === total ? `${total} vehículos` : `${mostrados} de ${total}`}
        </p>
      </div>
    </div>
  );
}
