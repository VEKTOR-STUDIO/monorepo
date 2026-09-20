// Las tres formas de pago del catálogo, una al lado de otra.
//
// Hardcore no tiene un precio: tiene tres, según cómo se pague. Enseñar solo
// uno obliga a preguntar por WhatsApp, que es justo lo que la tienda evita.
// El de contado va primero porque es el más bajo.

import config from "@/config";
import { enDolares, enBolivares, aBolivares } from "@/libs/formato";

const ORDEN = ["contado", "bcv", "pago_movil"];

/** Bloque completo, para la ficha del producto. */
export default function Precios({ producto, tasa, className = "" }) {
  const precios = {
    contado: producto.precioContado,
    bcv: producto.precioBcv,
    pago_movil: producto.precioPagoMovil,
  };

  return (
    <div className={`grid gap-2 ${className}`}>
      {ORDEN.map((metodo) => {
        const pago = config.pagos[metodo];
        const valor = precios[metodo];
        const bolivares = pago.enBolivares ? aBolivares(valor, tasa?.valor) : null;

        return (
          <div
            key={metodo}
            className={`flex items-baseline justify-between gap-4 rounded-lg border px-3.5 py-2.5 transition-colors ${
              metodo === "contado"
                ? "border-primary/45 bg-primary/8"
                : "border-base-content/10 bg-base-200/40"
            }`}
          >
            <div className="min-w-0">
              <p className="text-sm font-medium leading-tight">{pago.nombre}</p>
              <p className="text-[0.7rem] leading-tight text-base-content/55">{pago.detalle}</p>
            </div>
            <div className="shrink-0 text-right">
              <p
                className={`cifra text-lg font-bold leading-none ${
                  metodo === "contado" ? "text-primary" : ""
                }`}
              >
                {enDolares(valor)}
              </p>
              {bolivares !== null && (
                <p className="cifra mt-1 text-[0.7rem] leading-none text-base-content/55">
                  {enBolivares(bolivares)}
                </p>
              )}
            </div>
          </div>
        );
      })}

      {tasa ? (
        <p className="cifra pt-0.5 text-[0.7rem] text-base-content/45">
          Tasa BCV {enBolivares(tasa.valor)} · {tasa.fechaValor}
        </p>
      ) : (
        <p className="pt-0.5 text-[0.7rem] text-base-content/45">
          Los montos en bolívares se calculan con la tasa del BCV del día.
        </p>
      )}
    </div>
  );
}

/** Versión compacta para la tarjeta de la cuadrícula. */
export function PreciosCompactos({ producto, className = "" }) {
  const filas = [
    ["Contado", producto.precioContado, true],
    ["BCV", producto.precioBcv, false],
    ["P. Móvil", producto.precioPagoMovil, false],
  ];

  return (
    <dl className={`flex items-end gap-3 ${className}`}>
      {filas.map(([etiqueta, valor, principal]) => (
        <div key={etiqueta} className={principal ? "" : "hidden sm:block"}>
          <dt
            className={`text-[0.6rem] uppercase tracking-wider ${
              principal ? "text-primary/80" : "text-base-content/40"
            }`}
          >
            {etiqueta}
          </dt>
          <dd
            className={`cifra leading-none ${
              principal ? "text-xl font-bold text-primary" : "text-sm text-base-content/70"
            }`}
          >
            {enDolares(valor)}
          </dd>
        </div>
      ))}
    </dl>
  );
}
