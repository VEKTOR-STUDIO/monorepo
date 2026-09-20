"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback } from "react";
import config from "@/config";

/**
 * Los filtros del inventario.
 *
 * Todo vive en la URL y no en el estado del componente: así una búsqueda
 * —"camionetas Toyota hasta 40.000 en Caracas"— se copia y se manda por
 * WhatsApp, que es exactamente lo que hace un vendedor con un cliente. Y al
 * volver atrás, el navegador recupera el filtro.
 *
 * La sede es el segundo corte, después del tipo: con dos salas a ocho horas de
 * carretera una de otra, "¿dónde está?" es la pregunta que viene justo después
 * de "¿cuánto cuesta?".
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
  const sede = params.get("sede") || "";
  const orden = params.get("orden") || "";
  const hayFiltro = Boolean(tipo || marca || sede || orden || params.get("q"));

  return (
    <div className="space-y-5">
      {/* Tipos, como pestañas: es el corte que usa todo el mundo primero. */}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => cambiar("tipo", "")}
          className={`btn btn-sm ${tipo === "" ? "btn-primary" : "btn-vidrio"}`}
        >
          Todos
        </button>
        {facetas.tipos.map((t) => (
          <button
            key={t.slug}
            type="button"
            onClick={() => cambiar("tipo", t.slug)}
            className={`btn btn-sm ${tipo === t.slug ? "btn-primary" : "btn-vidrio"}`}
          >
            {t.nombre}
            <span className="cifra ml-1.5 opacity-55">{t.total}</span>
          </button>
        ))}
      </div>

      {/* Las dos salas. */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="rotulo mr-1">Sala</span>
        <button
          type="button"
          onClick={() => cambiar("sede", "")}
          className={`btn btn-xs sm:btn-sm ${sede === "" ? "btn-primary" : "btn-vidrio"}`}
        >
          Las dos
        </button>
        {config.sedes.map((s) => (
          <button
            key={s.ciudad}
            type="button"
            onClick={() => cambiar("sede", s.ciudad)}
            className={`btn btn-xs sm:btn-sm ${sede === s.ciudad ? "btn-primary" : "btn-vidrio"}`}
          >
            {s.zona}
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
