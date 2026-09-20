"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { enDolares, enBolivares } from "@/libs/formato";
import config from "@/config";

/**
 * Confirmación del pedido.
 *
 * El resumen lo dejó el checkout en sessionStorage: así la página funciona
 * aunque el pedido no se haya podido guardar todavía en Supabase, y no hace
 * falta exponer una consulta pública de pedidos por código.
 */
export default function PedidoConfirmado({ codigo }) {
  const [pedido, setPedido] = useState(undefined);

  useEffect(() => {
    try {
      const guardado = window.sessionStorage.getItem(`hardcore.pedido.${codigo}`);
      setPedido(guardado ? JSON.parse(guardado) : null);
    } catch {
      setPedido(null);
    }
  }, [codigo]);

  const pago = pedido?.metodoPago ? config.pagos[pedido.metodoPago] : null;
  const entrega = pedido?.entrega ? config.entregas[pedido.entrega] : null;

  return (
    <div className="mx-auto max-w-xl">
      <div className="ficha p-8 text-center">
        <span
          className="mx-auto flex size-14 items-center justify-center rounded-full bg-success/15 text-2xl text-success"
          aria-hidden="true"
        >
          ✓
        </span>

        <h1 className="display mt-6 text-3xl">PEDIDO REGISTRADO</h1>

        <p className="cifra mt-4 inline-block rounded-lg border border-primary/40 bg-primary/8 px-4 py-2 text-lg font-bold text-primary">
          {codigo}
        </p>

        <p className="mt-5 text-sm leading-relaxed text-base-content/60">
          Guarda ese código. Si no se abrió WhatsApp, escríbenos con él y lo ubicamos enseguida.
        </p>

        {pedido && (
          <div className="mt-7 space-y-3 border-t border-base-content/10 pt-6 text-left">
            {pedido.items?.length > 0 && (
              <ul className="space-y-1.5 text-sm text-base-content/65">
                {pedido.items.map((linea, i) => (
                  <li key={i}>
                    <span className="cifra text-base-content/40">{linea.cantidad}× </span>
                    {linea.nombre}
                    {linea.variacion && (
                      <span className="text-base-content/40"> · {linea.variacion}</span>
                    )}
                  </li>
                ))}
              </ul>
            )}

            <div className="flex items-baseline justify-between border-t border-base-content/10 pt-3">
              <span className="text-sm text-base-content/55">Total</span>
              <span className="text-right">
                <span className="cifra block text-xl font-bold text-primary">
                  {enDolares(pedido.total)}
                </span>
                {pedido.totalBs && (
                  <span className="cifra block text-xs text-base-content/50">
                    {enBolivares(pedido.totalBs)}
                  </span>
                )}
              </span>
            </div>

            {pago && (
              <p className="text-xs text-base-content/50">
                {pago.nombre}
                {entrega ? ` · ${entrega.nombre}` : ""}
              </p>
            )}

            {pedido.guardado === false && (
              <p className="rounded-lg border border-warning/30 bg-warning/8 px-3.5 py-2.5 text-xs text-warning">
                El pedido se envió por WhatsApp pero no quedó guardado en el sistema. Confirma por
                el chat que lo recibimos.
              </p>
            )}
          </div>
        )}

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {pedido?.whatsapp && (
            <a
              href={pedido.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
            >
              Abrir WhatsApp de nuevo
            </a>
          )}
          <Link href="/tienda" className="btn btn-outline">
            Seguir comprando
          </Link>
        </div>
      </div>

      {pedido === null && (
        <p className="mt-6 text-center text-xs text-base-content/40">
          No encontramos el detalle en este navegador, pero el pedido{" "}
          <span className="cifra">{codigo}</span> sigue siendo válido.
        </p>
      )}
    </div>
  );
}
