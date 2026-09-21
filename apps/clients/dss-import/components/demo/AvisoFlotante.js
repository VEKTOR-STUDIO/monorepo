"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import BotonComprar from "@/components/demo/BotonComprar";
import Contador from "@/components/demo/Contador";
import config from "@/config";

const LLAVE = "dss-import.demo.aviso-cerrado";

/**
 * Tarjeta que asoma por abajo cuando el visitante lleva media página bajada.
 *
 * La idea es no interrumpir: mientras mira los vehículos no molesta, y cuando ya ha
 * visto lo suficiente aparece la oferta. Si la cierra, no vuelve en toda la
 * sesión —insistir después de un "no" solo estorba.
 */
export default function AvisoFlotante() {
  const [visible, setVisible] = useState(false);
  const [cerrado, setCerrado] = useState(true); // hasta saber, no se enseña
  const ruta = usePathname();

  // En la puerta todavía no hay a quién venderle nada: primero se entra.
  const fuera = ruta === "/entrar";

  useEffect(() => {
    try {
      setCerrado(window.sessionStorage.getItem(LLAVE) === "1");
    } catch {
      setCerrado(false);
    }
  }, []);

  useEffect(() => {
    if (cerrado || fuera) return;

    const alScrollear = () => {
      const alto = document.documentElement.scrollHeight - window.innerHeight;
      // En páginas cortas no hay recorrido que medir: se enseña sin más.
      const recorrido = alto > 400 ? window.scrollY / alto : 1;
      setVisible(recorrido > 0.5);
    };

    alScrollear();
    window.addEventListener("scroll", alScrollear, { passive: true });
    window.addEventListener("resize", alScrollear);
    return () => {
      window.removeEventListener("scroll", alScrollear);
      window.removeEventListener("resize", alScrollear);
    };
  }, [cerrado, fuera]);

  const cerrar = () => {
    setCerrado(true);
    try {
      window.sessionStorage.setItem(LLAVE, "1");
    } catch {
      // Sin sessionStorage volverá a salir en la próxima página. No es grave.
    }
  };

  if (cerrado || fuera) return null;

  return (
    <div
      className={`pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center px-4 pb-4 transition-all duration-500 sm:justify-end sm:px-6 ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-8 opacity-0"
      }`}
      aria-hidden={!visible}
    >
      <div className="ficha pointer-events-auto w-full max-w-sm p-5 shadow-2xl shadow-black/50">
        <button
          type="button"
          onClick={cerrar}
          className="absolute right-2.5 top-2.5 p-1.5 text-base-content/35 transition-colors hover:bg-base-300 hover:text-base-content"
          aria-label="Cerrar aviso"
          tabIndex={visible ? 0 : -1}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
          </svg>
        </button>

        <p className="microgramma text-[0.65rem] text-primary">Estás viendo una demo</p>

        <p className="mt-2.5 pr-5 text-sm leading-relaxed text-base-content/70">
          Tu Instagram convertido en página: vehículos y motos, la cuota primero y un
          simulador donde el cliente arma su plan. Con tu oro y tu sello.
        </p>

        <div className="mt-4 flex items-center justify-between gap-3">
          <div>
            <p className="flex items-baseline gap-2">
              {config.demo.precioAnterior && (
                <span className="cifra text-sm text-base-content/35 line-through">
                  {config.demo.precioAnterior}
                </span>
              )}
              <span className="cifra text-xl font-bold text-primary">{config.demo.precio}</span>
            </p>
            <p className="text-[0.7rem] text-base-content/40">{config.demo.precioNota}</p>
            <p className="mt-1 flex items-center gap-1.5">
              <span className="microgramma text-[0.55rem] text-base-content/40">quedan</span>
              <Contador formato="compacto" className="text-[0.7rem] text-base-content/70" />
            </p>
          </div>
          <BotonComprar className="btn btn-primary btn-sm shrink-0" />
        </div>
      </div>
    </div>
  );
}
