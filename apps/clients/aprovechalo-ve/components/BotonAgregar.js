"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { useCarrito } from "@/components/CarritoContext";

/**
 * Mete un producto al carrito.
 *
 * Si el producto tiene sabores o tallas hay que elegir uno: el catálogo los
 * lista por producto, no como referencias aparte, así que la variación viaja
 * como texto junto a la línea del carrito.
 */
export default function BotonAgregar({ producto, variacionElegida, className = "", tamano = "md" }) {
  const { agregar } = useCarrito();
  const [ocupado, setOcupado] = useState(false);

  const variaciones = producto.variaciones || [];
  const necesitaElegir = variaciones.length > 0 && !variacionElegida;

  const alPulsar = () => {
    if (necesitaElegir) {
      toast("Elige primero una presentación", { icon: "👆" });
      return;
    }

    agregar({
      slug: producto.slug,
      nombre: producto.nombre,
      imagen: producto.imagen,
      variacion: variacionElegida || null,
      estado: producto.estado,
      precios: {
        contado: producto.precioContado,
        bcv: producto.precioBcv,
        pago_movil: producto.precioPagoMovil,
      },
    });

    setOcupado(true);
    setTimeout(() => setOcupado(false), 900);
    toast.success(
      variacionElegida ? `${producto.nombre} · ${variacionElegida}` : producto.nombre,
      { icon: "🛒" }
    );
  };

  return (
    <button
      type="button"
      onClick={alPulsar}
      className={`btn btn-primary ${tamano === "sm" ? "btn-sm" : ""} ${className}`}
      aria-label={`Agregar ${producto.nombre} al carrito`}
    >
      {ocupado ? "Agregado" : "Agregar"}
    </button>
  );
}

/** Selector de sabor/talla + botón, para la ficha del producto. */
export function ElegirYAgregar({ producto }) {
  const variaciones = producto.variaciones || [];
  const [elegida, setElegida] = useState(variaciones.length === 1 ? variaciones[0] : null);

  return (
    <div className="space-y-4">
      {variaciones.length > 0 && (
        <fieldset>
          <legend className="rotulo mb-2.5">
            Presentación{variaciones.length > 1 ? ` · elige una` : ""}
          </legend>
          <div className="flex flex-wrap gap-2">
            {variaciones.map((variacion) => (
              <button
                key={variacion}
                type="button"
                onClick={() => setElegida(variacion)}
                aria-pressed={elegida === variacion}
                className={`rounded-lg border px-3.5 py-2 text-sm transition-colors ${
                  elegida === variacion
                    ? "border-primary bg-primary/12 text-primary"
                    : "border-base-content/15 text-base-content/75 hover:border-base-content/35"
                }`}
              >
                {variacion}
              </button>
            ))}
          </div>
        </fieldset>
      )}

      <BotonAgregar
        producto={producto}
        variacionElegida={elegida}
        className="w-full sm:w-auto sm:min-w-56"
      />
    </div>
  );
}
