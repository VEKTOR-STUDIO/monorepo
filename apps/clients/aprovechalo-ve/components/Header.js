"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "@/components/Logo";
import config from "@/config";

const ENLACES = [
  { href: "/vehiculos", texto: "Vehículos" },
  { href: "/#como-comprar", texto: "Cómo comprar" },
  { href: "/#inmuebles", texto: "Inmuebles" },
  { href: "/contacto", texto: "Contacto" },
];

/**
 * La cabecera: una línea de enlaces en texto, sin cajas ni bordes, translúcida
 * sobre lo que haya debajo. Se pega justo bajo la franja de demo (de ahí el
 * `top` calculado con --alto-barra-demo).
 *
 * Al bajar gana fondo sólido: sobre las fotos claras del escaparate, los
 * enlaces en gris se perderían.
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
        bajado || abierto ? "barra-vidrio border-b border-base-content/8" : ""
      }`}
      style={{ top: "var(--alto-barra-demo)" }}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-4 sm:px-6">
        <Link href="/" className="shrink-0" aria-label={`${config.appName} · inicio`}>
          <Logo />
        </Link>

        <div className="ml-auto hidden items-center gap-7 md:flex">
          {ENLACES.map((enlace) => (
            <Link
              key={enlace.href}
              href={enlace.href}
              className="text-sm font-medium text-base-content/70 transition-colors hover:text-base-content"
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
          className="ml-auto rounded-full p-2 text-base-content/70 transition-colors hover:bg-base-200 md:hidden"
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
        <div className="border-t border-base-content/8 px-4 pb-5 pt-3 md:hidden">
          <div className="flex flex-col gap-1">
            {ENLACES.map((enlace) => (
              <Link
                key={enlace.href}
                href={enlace.href}
                className="rounded-lg px-3 py-2.5 text-base font-medium text-base-content/80 transition-colors hover:bg-base-200"
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
