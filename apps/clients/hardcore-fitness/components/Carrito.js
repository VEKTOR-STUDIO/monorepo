"use client";

import Image from "next/image";
import Link from "next/link";
import { useCarrito } from "@/components/CarritoContext";
import { enDolares, enBolivares, aBolivares } from "@/libs/formato";
import config from "@/config";

const ORDEN = ["contado", "bcv", "pago_movil"];

export default function Carrito({ tasa }) {
  const { items, unidades, totalCon, cambiarCantidad, quitar, vaciar } = useCarrito();

  if (items.length === 0) {
    return (
      <div className="ficha flex flex-col items-center gap-4 px-6 py-20 text-center">
        <p className="display text-2xl text-base-content/30">CARRITO VACÍO</p>
        <p className="max-w-sm text-sm text-base-content/55">
          Todavía no has agregado nada. El catálogo completo está a un clic.
        </p>
        <Link href="/tienda" className="btn btn-primary">
          Ver catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_22rem] lg:items-start">
      <div className="space-y-3">
        {items.map((linea) => (
          <article key={linea.id} className="ficha flex gap-4 p-3 sm:p-4">
            <Link
              href={`/producto/${linea.slug}`}
              className="foto-producto relative size-20 shrink-0 overflow-hidden rounded-lg sm:size-24"
            >
              {linea.imagen && (
                <Image
                  src={linea.imagen}
                  alt={linea.nombre}
                  fill
                  sizes="96px"
                  className="object-contain p-2"
                />
              )}
            </Link>

            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="text-sm font-medium leading-snug">
                    <Link href={`/producto/${linea.slug}`} className="hover:text-primary">
                      {linea.nombre}
                    </Link>
                  </h3>
                  {linea.variacion && (
                    <p className="mt-0.5 text-xs text-base-content/50">{linea.variacion}</p>
                  )}
                  {linea.estado === "transito" && (
                    <p className="mt-1 text-[0.7rem] text-warning">En tránsito</p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => quitar(linea.id)}
                  className="shrink-0 rounded-md p-1.5 text-base-content/35 transition-colors hover:bg-base-300 hover:text-primary"
                  aria-label={`Quitar ${linea.nombre} del carrito`}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
                  </svg>
                </button>
              </div>

              <div className="mt-auto flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center rounded-lg border border-base-content/12">
                  <button
                    type="button"
                    onClick={() => cambiarCantidad(linea.id, linea.cantidad - 1)}
                    className="flex size-8 items-center justify-center text-base-content/60 transition-colors hover:text-primary"
                    aria-label="Quitar una unidad"
                  >
                    −
                  </button>
                  <span className="cifra w-8 text-center text-sm">{linea.cantidad}</span>
                  <button
                    type="button"
                    onClick={() => cambiarCantidad(linea.id, linea.cantidad + 1)}
                    className="flex size-8 items-center justify-center text-base-content/60 transition-colors hover:text-primary"
                    aria-label="Agregar una unidad"
                  >
                    +
                  </button>
                </div>

                <p className="cifra text-sm">
                  <span className="text-base-content/40">
                    {enDolares(linea.precios?.contado)} c/u ·{" "}
                  </span>
                  <span className="font-bold text-primary">
                    {enDolares((linea.precios?.contado ?? 0) * linea.cantidad)}
                  </span>
                </p>
              </div>
            </div>
          </article>
        ))}

        <div className="flex justify-between pt-2">
          <Link href="/tienda" className="btn btn-sm btn-ghost">
            Seguir comprando
          </Link>
          <button type="button" onClick={vaciar} className="btn btn-sm btn-ghost text-base-content/45">
            Vaciar carrito
          </button>
        </div>
      </div>

      <aside className="ficha sticky top-24 p-5">
        <h2 className="rotulo mb-4">Resumen</h2>

        <p className="cifra mb-4 text-sm text-base-content/55">
          {unidades} {unidades === 1 ? "artículo" : "artículos"}
        </p>

        <div className="space-y-2 border-t border-base-content/10 pt-4">
          {ORDEN.map((metodo) => {
            const pago = config.pagos[metodo];
            const total = totalCon(metodo);
            const bolivares = pago.enBolivares ? aBolivares(total, tasa?.valor) : null;

            return (
              <div key={metodo} className="flex items-baseline justify-between gap-3">
                <span
                  className={`text-sm ${metodo === "contado" ? "font-medium" : "text-base-content/55"}`}
                >
                  {pago.nombre}
                </span>
                <span className="text-right">
                  <span
                    className={`cifra block leading-tight ${
                      metodo === "contado" ? "text-lg font-bold text-primary" : "text-sm"
                    }`}
                  >
                    {enDolares(total)}
                  </span>
                  {bolivares !== null && (
                    <span className="cifra block text-[0.7rem] leading-tight text-base-content/45">
                      {enBolivares(bolivares)}
                    </span>
                  )}
                </span>
              </div>
            );
          })}
        </div>

        {tasa ? (
          <p className="cifra mt-4 text-[0.7rem] text-base-content/40">
            Tasa BCV {enBolivares(tasa.valor)} · {tasa.fechaValor}
          </p>
        ) : (
          <p className="mt-4 text-[0.7rem] text-base-content/40">
            Los montos en bolívares se confirman con la tasa del BCV del día.
          </p>
        )}

        <Link href="/checkout" className="btn btn-primary mt-5 w-full">
          Continuar
        </Link>

        <p className="mt-3 text-center text-[0.7rem] text-base-content/40">
          Terminas de cerrar el pedido por WhatsApp.
        </p>
      </aside>
    </div>
  );
}
