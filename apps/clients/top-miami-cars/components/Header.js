"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "@/components/Logo";
import { usarGsap } from "@/libs/animaciones";
import { esDemo } from "@/libs/demo";
import config from "@/config";

// El menú es el del salón: primero las carrocerías, que es por donde pregunta
// la gente, y después todo el inventario, dónde están y el contacto.
const ENLACES = [
  { href: "/vehiculos?tipo=suv", texto: "Camionetas" },
  { href: "/vehiculos?tipo=sedan", texto: "Sedanes" },
  { href: "/vehiculos?tipo=pickup", texto: "Pick-ups" },
  { href: "/vehiculos", texto: "Todo el inventario" },
  { href: "/#sedes", texto: "El salón" },
  { href: "/contacto", texto: "Contacto" },
];

// Atajo a la comparación con vender solo por redes. Solo existe mientras se
// está vendiendo la página: es un argumento para el dueño, no para quien viene
// a ver carros.
const ENLACE_DEMO = { href: "/#por-que", texto: "¿Por qué una página?" };

/**
 * La cabecera.
 *
 * Se pega justo bajo la franja de demo (de ahí el `top` calculado con
 * --alto-barra-demo) y se esconde al bajar, vuelve al subir. En una página
 * cuyo contenido son fotos a pantalla casi completa, una barra fija todo el
 * rato se come el sitio justo donde está el vehículo; y al querer volver
 * arriba, el gesto natural es subir, así que aparecer ahí es aparecer cuando
 * se la necesita.
 */
export default function Header() {
  const [abierto, setAbierto] = useState(false);
  const barra = useRef(null);
  const ruta = usePathname();

  useEffect(() => {
    const nodo = barra.current;
    if (!nodo) return;

    const { gsap, ScrollTrigger } = usarGsap();
    const reducido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Fondo sólido en cuanto se despega de arriba: sobre una foto clara, los
    // enlaces en gris se perderían.
    // Sin `trigger`, ScrollTrigger entiende start/end como posiciones de
    // scroll en píxeles, que es justo lo que hace falta aquí: esto no
    // reacciona a ningún elemento, reacciona a cuánto se ha bajado.
    const vidrio = ScrollTrigger.create({
      start: 24,
      end: "max",
      onUpdate: (self) => nodo.classList.toggle("con-fondo", self.progress > 0),
      onToggle: (self) => nodo.classList.toggle("con-fondo", self.isActive),
    });

    if (reducido) return () => vidrio.kill();

    const esconder = gsap.to(nodo, {
      yPercent: -100,
      paused: true,
      duration: 0.4,
      ease: "power2.out",
    });

    const ocultar = ScrollTrigger.create({
      start: 160,
      end: "max",
      onUpdate: (self) => {
        // Con el menú de móvil abierto no se esconde nada: sería tragarse el
        // menú que el visitante acaba de abrir.
        if (nodo.dataset.abierto === "true") return esconder.reverse();
        self.direction === 1 ? esconder.play() : esconder.reverse();
      },
    });

    return () => {
      vidrio.kill();
      ocultar.kill();
      esconder.kill();
    };
  }, []);

  // Al cambiar de página, el menú de móvil se cierra solo.
  useEffect(() => setAbierto(false), [ruta]);

  const enlaces = esDemo() ? [...ENLACES, ENLACE_DEMO] : ENLACES;

  return (
    <header
      ref={barra}
      data-abierto={abierto ? "true" : "false"}
      className={`sticky z-50 transition-colors duration-300 ${
        abierto ? "barra-vidrio border-b border-base-content/10" : ""
      }`}
      style={{ top: "var(--alto-barra-demo)" }}
    >
      <nav className="mx-auto flex h-[4.5rem] max-w-7xl items-center gap-6 px-4 sm:px-6">
        <Link href="/" className="shrink-0" aria-label={`${config.appName} · inicio`}>
          <Logo />
        </Link>

        <div className="ml-auto hidden items-center gap-5 xl:gap-6 lg:flex">
          {enlaces.map((enlace) => (
            <Link
              key={enlace.href}
              href={enlace.href}
              className="display-recto text-[0.7rem] text-base-content/70 transition-colors hover:text-primary"
            >
              {enlace.texto}
            </Link>
          ))}
          <Link href="/contacto" className="btn btn-primary btn-sm px-5">
            Escríbenos
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setAbierto((v) => !v)}
          className="ml-auto p-2 text-base-content/70 transition-colors hover:text-primary lg:hidden"
          aria-label={abierto ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={abierto}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {abierto ? (
              <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
            ) : (
              <path d="M3 7h18M3 17h18" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </nav>

      {abierto && (
        <div className="border-t border-base-content/10 px-4 pb-5 pt-3 lg:hidden">
          <div className="flex flex-col">
            {enlaces.map((enlace) => (
              <Link
                key={enlace.href}
                href={enlace.href}
                className="display-recto border-b border-base-content/8 py-3.5 text-sm text-base-content/80 transition-colors hover:text-primary"
              >
                {enlace.texto}
              </Link>
            ))}
          </div>
          <Link href="/contacto" className="btn btn-primary mt-4 w-full">
            Escríbenos
          </Link>
        </div>
      )}
    </header>
  );
}
