"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback } from "react";

/**
 * Los filtros del catálogo.
 *
 * Todo vive en la URL y no en el estado del componente: así una búsqueda
 * —"motos por menos de 70 al mes"— se copia y se manda por WhatsApp, que es
 * exactamente lo que hace un vendedor con un cliente. Y al volver atrás, el
 * navegador recupera el filtro.
 *
 * EL PRIMER CORTE ES EL SEGMENTO —vehículo o moto—, en una fila propia y más
 * grande que el resto: es la división que DSS escribe en su propia bio y son
 * dos compradores que no se parecen en nada.
 *
 * EL SEGUNDO ES LA CUOTA MÁXIMA, y es el filtro que de verdad usa quien compra
 * a crédito. Nadie llega preguntando "¿qué carros tienen de menos de 7.000?";
 * llegan preguntando "¿qué me llevo por 75 a la semana?". Por eso está antes
 * que la condición y que la carrocería, y por eso los topes están puestos
 * alrededor de las cifras que ellos anuncian (65, 75, 100).
 *
 * Los topes se comparan siempre en su equivalente SEMANAL —lo hace `filtrar` en
 * libs/catalogo.js—, porque si no un plan mensual de 260 se colaría en una
 * búsqueda de "hasta 75" por ser 260 un número más grande que 75 en la misma
 * escala equivocada.
 */

const TOPES_CUOTA = [
  { valor: "65", texto: "Hasta $65 sem." },
  { valor: "75", texto: "Hasta $75 sem." },
  { valor: "100", texto: "Hasta $100 sem." },
];

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
  const cuotaMax = params.get("cuotaMax") || "";
  const hayFiltro = Boolean(
    segmento || condicion || tipo || marca || orden || cuotaMax || params.get("q")
  );

  return (
    <div className="space-y-5">
      {/* El corte principal: vehículos o motos. */}
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

      {/* La cuota máxima: el filtro que usa quien compra a crédito. */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="rotulo mr-1 shrink-0">Cuota</span>
        <BotonFiltro activo={cuotaMax === ""} onClick={() => cambiar("cuotaMax", "")}>
          Cualquiera
        </BotonFiltro>
        {TOPES_CUOTA.map((t) => (
          <BotonFiltro
            key={t.valor}
            activo={cuotaMax === t.valor}
            onClick={() => cambiar("cuotaMax", t.valor)}
          >
            {t.texto}
          </BotonFiltro>
        ))}
      </div>

      {/* La condición, en tercer plano. */}
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

      {/* La carrocería, ya en cuarto plano. */}
      <div className="flex flex-wrap gap-2">
        <BotonFiltro activo={tipo === ""} onClick={() => cambiar("tipo", "")}>
          Cualquier tipo
        </BotonFiltro>
        {facetas.tipos.map((t) => (
          <BotonFiltro key={t.slug} activo={tipo === t.slug} onClick={() => cambiar("tipo", t.slug)}>
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
          <option value="cuota-asc">Cuota: de menor a mayor</option>
          <option value="cuota-desc">Cuota: de mayor a menor</option>
          <option value="precio-asc">Contado: de menor a mayor</option>
          <option value="anio-desc">Año: más nuevo primero</option>
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
 * Una pestaña de filtro, con la forma de pastilla de sus publicaciones.
 *
 * Redonda del todo y no rectangular a propósito: la etiqueta de la cuota que
 * ellos ponen al pie de cada post es un óvalo dorado, y esta es la misma pieza
 * haciendo otro trabajo.
 */
function BotonFiltro({ activo, onClick, children, grande = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={activo}
      className={`display-recto rounded-full tracking-wide transition-colors ${
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
