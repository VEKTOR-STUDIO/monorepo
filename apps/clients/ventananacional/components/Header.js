"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "@/components/Logo";
import { esDemo } from "@/libs/demo";
import config from "@/config";

const ENLACES = [
  { href: "/vehiculos", texto: "Inventario" },
  { href: "/#operaciones", texto: "Qué hacemos" },
  { href: "/#sedes", texto: "Sedes" },
  { href: "/contacto", texto: "Contacto" },
];

// Atajo a la comparación con Instagram. Solo existe mientras se está vendiendo
// la página: es un argumento para el dueño, no para quien viene a ver carros.
const ENLACE_DEMO = { href: "/#por-que", texto: "¿Y si ya vendo por Instagram?" };

/**
 * La cabecera: una línea de enlaces en texto, translúcida sobre lo que haya
 * debajo. Se pega justo bajo la franja de demo (de ahí el `top` calculado con
 * --alto-barra-demo).
 *
 * Arriba del todo va sin fondo, para que la foto de portada llegue hasta el
 * borde de la pantalla; en cuanto se baja un poco se convierte en cristal, que
 * es lo que mantiene legibles los enlaces sobre las fotos claras.
 */
export default function Header() {
  const [bajado, setBajado] = useState(false);
  const [abierto, setAbierto] = useState(false);
  const ruta = usePathname();

  useEffect(() => {
    const alScrollear = () => setBajado(window.scrollY > 24);
    alScrollear();
    window.addEventListener("scroll", alScrollear, { passive: true });
    return () => window.removeEventListener("scroll", alScrollear);
  }, []);

  // Al cambiar de página, el menú de móvil se cierra solo.
  useEffect(() => setAbierto(false), [ruta]);

  return (
    <header
      className={`sticky z-50 transition-colors duration-300 ${
        bajado || abierto ? "barra-vidrio border-b border-white/10" : ""
      }`}
      style={{ top: "var(--alto-barra-demo)" }}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-4 sm:px-6">
        <Link href="/" className="shrink-0" aria-label={`${config.appName} · inicio`}>
          <Logo />
        </Link>

        <div className="ml-auto hidden items-center gap-7 md:flex">
          {(esDemo() ? [...ENLACES, ENLACE_DEMO] : ENLACES).map((enlace) => (
            <Link
              key={enlace.href}
              href={enlace.href}
              className="text-sm font-medium text-base-content/65 transition-colors hover:text-primary"
            >
              {enlace.texto}
            </Link>
          ))}
          <Link href="/vehiculos" className="btn btn-primary btn-sm px-5">
            Ver inventario
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setAbierto((v) => !v)}
          className="ml-auto rounded-xl p-2 text-base-content/70 transition-colors hover:bg-white/10 md:hidden"
          aria-label={abierto ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={abierto}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            {abierto ? (
              <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
            ) : (
              <path d="M3 7h18M3 17h18" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </nav>

      {abierto && (
        <div className="border-t border-white/10 px-4 pb-5 pt-3 md:hidden">
          <div className="flex flex-col gap-1">
            {(esDemo() ? [...ENLACES, ENLACE_DEMO] : ENLACES).map((enlace) => (
              <Link
                key={enlace.href}
                href={enlace.href}
                className="rounded-xl px-3 py-2.5 text-base font-medium text-base-content/80 transition-colors hover:bg-white/8"
              >
                {enlace.texto}
              </Link>
            ))}
          </div>
          <Link href="/vehiculos" className="btn btn-primary mt-3 w-full">
            Ver inventario
          </Link>
        </div>
      )}
    </header>
  );
}
