"use client";

import { usePathname } from "next/navigation";
import BotonComprar from "@/components/demo/BotonComprar";
import { esDemo } from "@/libs/demo";
import config from "@/config";

/**
 * La franja de arriba del todo: esto es una demo y se vende.
 *
 * Va pegada al borde superior y la cabecera del sitio se coloca justo
 * debajo, desplazada por la variable --alto-barra-demo que pone el layout.
 * Si el modo demo está apagado, no existe y la cabecera vuelve a top: 0.
 *
 * En la pantalla de acceso no sale: a quien todavía no ha entrado no se le
 * vende nada, primero se le deja pasar.
 */
export default function BarraDemo() {
  const ruta = usePathname();

  if (!esDemo() || ruta === "/entrar") return null;

  return (
    <div className="barra-vidrio sticky top-0 z-60 h-10 border-b border-primary/25">
      <div className="mx-auto flex h-full max-w-7xl items-center gap-3 px-4 sm:px-6">
        <span className="flex items-center gap-2">
          <span
            className="inline-block size-1.5 animate-[latido_3.5s_ease-in-out_infinite] rounded-full bg-primary"
            aria-hidden="true"
          />
          <span className="rotulo text-primary">Demo</span>
        </span>

        <p className="min-w-0 truncate text-xs text-base-content/70">
          <span className="hidden sm:inline">
            Página de demostración. El sistema completo está a la venta ·{" "}
          </span>
          <span className="cifra font-bold text-base-content">{config.demo.precio}</span>
        </p>

        <BotonComprar className="btn btn-primary btn-xs ml-auto shrink-0 sm:btn-sm" />
      </div>
    </div>
  );
}
