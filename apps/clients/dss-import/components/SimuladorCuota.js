"use client";

import { useState } from "react";
import { enDolares } from "@/libs/formato";
import { PERIODOS } from "@/libs/catalogo";
import config from "@/config";

// -----------------------------------------------------------------------------
// El simulador de cuota.
//
// Es la pieza que convierte esta página en la de una financiadora y no en la de
// un concesionario. Toda publicación de DSS dice lo mismo —"nuestras cuotas se
// adaptan a tu presupuesto"— y eso, en un post, no se puede comprobar: hay que
// escribirles y esperar. Aquí se mueve la inicial, se mueve el plazo y la cuota
// cambia delante de quien mira.
//
// EL SIMULADOR PARTE DE SU CUOTA PUBLICADA Y SE MUEVE DESDE AHÍ.
//
// Esto es lo más importante del archivo y costó un intento. La primera versión
// repartía el saldo entre los pagos del plazo, sin más, y con las condiciones
// por defecto daba OTRO número que el de la ficha: la Toro Power TP180 decía
// "$75 mensual" arriba y el simulador, justo debajo y con los mismos datos,
// decía "$36 mensual". Dos cifras distintas para el mismo plan en la misma
// pantalla. Para quien mira hay dos lecturas y las dos son malas: o la página
// está rota, o DSS cobra el doble de lo que debería. En la web del propio
// negocio, la segunda es la que hace daño.
//
// La razón del hueco es real y no un fallo de cuentas: la cuota que ellos
// publican lleva dentro su margen y el costo del financiamiento, y un reparto
// a pelo del saldo no lleva nada. Sus cuotas salen entre 2 y 3 veces por encima
// del reparto simple, según la unidad.
//
// Así que el simulador no recalcula desde cero: toma la PROPORCIÓN de su plan
// publicado —cuánto es su cuota respecto al reparto simple de ese mismo plan— y
// la mantiene al mover la inicial o el plazo. Con los valores de fábrica el
// factor se cancela y sale exactamente su cuota publicada, que es lo único
// aceptable; al moverlos, la cifra se mueve en la misma proporción.
//
// LO QUE SÍ SE MANTIENE DE LA IDEA ORIGINAL:
//
//   · EL CÁLCULO SE ENSEÑA. Debajo del número está escrito cuánto se financia y
//     entre cuántos pagos va. Un simulador de crédito que escupe una cifra sin
//     explicarla es justo lo que hace desconfiar a quien ya desconfía.
//   · ES UNA ESTIMACIÓN Y LO DICE. La cuota definitiva se confirma en la
//     oficina. Prometer una cifra exacta que luego no se cumple sería hacerle
//     daño al cliente en su propia web.
// -----------------------------------------------------------------------------

const PLAZOS = [6, 12, 18, 24];

/** El reparto simple de un plan: lo que queda por pagar entre sus pagos. */
function repartoSimple(precio, inicialPct, plazoMeses, periodo) {
  const info = PERIODOS[periodo] || PERIODOS.semanal;
  const financiado = precio * (1 - inicialPct / 100);
  const pagos = Math.max(1, Math.round((plazoMeses / 12) * info.porAnio));
  return { financiado, pagos, cuota: financiado / pagos };
}

export default function SimuladorCuota({ vehiculo, className = "" }) {
  const base = vehiculo.cuota;

  const [inicialPct, setInicialPct] = useState(base.inicialPct);
  const [plazoMeses, setPlazoMeses] = useState(base.plazoMeses);
  const [periodo, setPeriodo] = useState(base.periodo);

  // El factor de la casa: cuántas veces su cuota publicada es el reparto simple
  // de ese mismo plan. Ahí dentro están su margen y el costo del crédito. Con
  // los valores de fábrica se cancela y sale su cuota exacta.
  const referencia = repartoSimple(
    vehiculo.precio,
    base.inicialPct,
    base.plazoMeses,
    base.periodo
  );
  const factor = referencia.cuota > 0 ? base.monto / referencia.cuota : 1;

  const info = PERIODOS[periodo] || PERIODOS.semanal;
  const inicial = Math.round(vehiculo.precio * (inicialPct / 100));
  const actual = repartoSimple(vehiculo.precio, inicialPct, plazoMeses, periodo);
  const pagos = actual.pagos;
  const cuota = Math.round(actual.cuota * factor);
  const total = inicial + cuota * pagos;

  // ¿Se ha tocado algo respecto al plan que la unidad trae publicado?
  const cambiado =
    inicialPct !== base.inicialPct || plazoMeses !== base.plazoMeses || periodo !== base.periodo;

  return (
    <div className={`panel p-6 sm:p-7 ${className}`}>
      <div className="flex items-baseline justify-between gap-3">
        <p className="rotulo">Arma tu cuota</p>
        {cambiado && (
          <button
            type="button"
            onClick={() => {
              setInicialPct(base.inicialPct);
              setPlazoMeses(base.plazoMeses);
              setPeriodo(base.periodo);
            }}
            className="text-xs text-base-content/45 underline-offset-4 transition-colors hover:text-primary hover:underline"
          >
            Volver al plan publicado
          </button>
        )}
      </div>

      {/* El resultado, arriba: es lo que se viene a ver. */}
      <div className="mt-5 border-b border-base-content/10 pb-6">
        <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span className="cuota text-4xl leading-none sm:text-5xl">{enDolares(cuota)}</span>
          <span className="cuota-periodo text-base">{info.adjetivo}</span>
        </p>
        <p className="cifra mt-2.5 text-xs leading-relaxed text-base-content/45">
          {enDolares(inicial)} de inicial · {pagos} pagos {info.cada} ·{" "}
          {enDolares(total)} en total
        </p>
        {!cambiado && (
          <p className="mt-2 text-xs leading-relaxed text-primary/70">
            Este es el plan que publicamos para esta unidad. Muévelo si no te entra.
          </p>
        )}
      </div>

      {/* La inicial. */}
      <div className="mt-6">
        <div className="flex items-baseline justify-between gap-3">
          <label htmlFor="inicial" className="text-sm text-base-content/70">
            Inicial
          </label>
          <span className="cifra text-sm font-semibold text-base-content">
            {inicialPct} % · {enDolares(inicial)}
          </span>
        </div>
        <input
          id="inicial"
          type="range"
          min={10}
          max={70}
          step={5}
          value={inicialPct}
          onChange={(e) => setInicialPct(Number(e.target.value))}
          className="deslizador mt-3 w-full"
        />
        <div className="mt-1 flex justify-between text-[0.65rem] text-base-content/35">
          <span>10 %</span>
          <span>70 %</span>
        </div>
      </div>

      {/* El plazo. */}
      <div className="mt-6">
        <p className="text-sm text-base-content/70">Plazo</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {PLAZOS.filter((m) => m <= config.credito.plazoMesesMax).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setPlazoMeses(m)}
              aria-pressed={plazoMeses === m}
              className={`display-recto rounded-full px-4 py-1.5 text-xs tracking-wide transition-colors ${
                plazoMeses === m
                  ? "pastilla"
                  : "bg-base-300/60 text-base-content/70 hover:bg-base-300 hover:text-base-content"
              }`}
            >
              {m} meses
            </button>
          ))}
        </div>
      </div>

      {/* El ritmo de pago. */}
      <div className="mt-6">
        <p className="text-sm text-base-content/70">Pago</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {Object.entries(PERIODOS).map(([slug, p]) => (
            <button
              key={slug}
              type="button"
              onClick={() => setPeriodo(slug)}
              aria-pressed={periodo === slug}
              className={`display-recto rounded-full px-4 py-1.5 text-xs tracking-wide capitalize transition-colors ${
                periodo === slug
                  ? "pastilla"
                  : "bg-base-300/60 text-base-content/70 hover:bg-base-300 hover:text-base-content"
              }`}
            >
              {p.adjetivo}
            </button>
          ))}
        </div>
      </div>

      <p className="mt-6 text-xs leading-relaxed text-base-content/40">
        Es una estimación. Parte de la cuota publicada para esta unidad y mantiene su
        misma proporción al cambiar la inicial o el plazo. La cuota definitiva, con todas
        sus condiciones, se confirma por escrito en la oficina, donde además se ajusta a
        lo que puedas pagar.
      </p>
    </div>
  );
}
