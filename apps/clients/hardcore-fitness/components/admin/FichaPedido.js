"use client";

import { useActionState, useState } from "react";
import { cambiarEstadoPedido } from "@/app/admin/acciones";
import EtiquetaEstado from "@/components/admin/EtiquetaEstado";
import { enDolares, enBolivares, fechaLarga } from "@/libs/formato";
import config from "@/config";

const ESTADOS = ["nuevo", "confirmado", "entregado", "cancelado"];

export default function FichaPedido({ pedido }) {
  const [abierto, setAbierto] = useState(false);
  const [resultado, cambiar, cambiando] = useActionState(cambiarEstadoPedido, null);

  const pago = config.pagos[pedido.metodo_pago];
  const entrega = config.entregas[pedido.entrega];
  const telefono = String(pedido.telefono || "").replace(/\D/g, "");

  return (
    <li className="ficha overflow-hidden">
      <button
        type="button"
        onClick={() => setAbierto((v) => !v)}
        className="flex w-full items-center gap-4 p-4 text-left"
        aria-expanded={abierto}
      >
        <div className="min-w-0 flex-1">
          <p className="cifra text-sm font-bold">{pedido.codigo}</p>
          <p className="truncate text-xs text-base-content/55">
            {pedido.nombre} · {pedido.telefono}
          </p>
          <p className="mt-0.5 text-[0.7rem] text-base-content/35">
            {fechaLarga(pedido.creado_en)}
          </p>
        </div>

        <div className="shrink-0 text-right">
          <p className="cifra text-base font-bold text-primary">{enDolares(pedido.subtotal)}</p>
          {pedido.total_bs && (
            <p className="cifra text-[0.7rem] text-base-content/45">
              {enBolivares(pedido.total_bs)}
            </p>
          )}
        </div>

        <EtiquetaEstado estado={pedido.estado} />
      </button>

      {abierto && (
        <div className="border-t border-base-content/10 p-4">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h3 className="rotulo mb-3">Qué pidió</h3>
              <ul className="space-y-2">
                {(pedido.pedido_items || []).map((linea) => (
                  <li key={linea.id} className="flex justify-between gap-3 text-sm">
                    <span className="min-w-0">
                      <span className="cifra text-base-content/45">{linea.cantidad}× </span>
                      {linea.nombre}
                      {linea.variacion && (
                        <span className="block text-xs text-base-content/45">{linea.variacion}</span>
                      )}
                    </span>
                    <span className="cifra shrink-0">{enDolares(linea.subtotal)}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="rotulo mb-3">Datos</h3>
              <dl className="space-y-2 text-sm">
                <Fila termino="Pago" valor={pago?.nombre || pedido.metodo_pago} />
                <Fila termino="Entrega" valor={entrega?.nombre || pedido.entrega} />
                {pedido.direccion && <Fila termino="Dirección" valor={pedido.direccion} />}
                {pedido.email && <Fila termino="Correo" valor={pedido.email} />}
                {pedido.tasa_bcv && (
                  <Fila termino="Tasa usada" valor={enBolivares(pedido.tasa_bcv)} />
                )}
                {pedido.nota && <Fila termino="Nota" valor={pedido.nota} />}
              </dl>

              {telefono && (
                <a
                  href={`https://wa.me/${telefono.startsWith("58") ? telefono : `58${telefono.replace(/^0/, "")}`}?text=${encodeURIComponent(
                    `Hola ${pedido.nombre}, te escribimos de Hardcore por tu pedido ${pedido.codigo}.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-sm btn-outline mt-4"
                >
                  Escribir al cliente
                </a>
              )}
            </div>
          </div>

          <form action={cambiar} className="mt-6 flex flex-wrap items-center gap-2 border-t border-base-content/10 pt-4">
            <input type="hidden" name="codigo" value={pedido.codigo} />
            <span className="mr-1 text-xs text-base-content/45">Marcar como:</span>
            {ESTADOS.filter((e) => e !== pedido.estado).map((estado) => (
              <button
                key={estado}
                type="submit"
                name="estado"
                value={estado}
                disabled={cambiando}
                className="btn btn-xs btn-outline"
              >
                {estado}
              </button>
            ))}
            {resultado?.ok && <span className="text-xs text-success">{resultado.mensaje}</span>}
            {resultado && !resultado.ok && (
              <span className="text-xs text-error">{resultado.error}</span>
            )}
          </form>
        </div>
      )}
    </li>
  );
}

function Fila({ termino, valor }) {
  return (
    <div className="flex gap-3">
      <dt className="w-24 shrink-0 text-base-content/45">{termino}</dt>
      <dd className="min-w-0 flex-1">{valor}</dd>
    </div>
  );
}
