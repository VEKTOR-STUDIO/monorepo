"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FAMILIAS } from "@/libs/catalogo-normalizar.mjs";
import { useCarrito } from "@/components/CarritoContext";
import config from "@/config";

const ENLACES = [
  { href: "/tienda", texto: "Tienda" },
  { href: "/tienda?ofertas=1", texto: "Ofertas" },
  { href: "/contacto", texto: "Contacto" },
];

function Logo({ className = "" }) {
  return (
    <Link href="/" className={`group flex items-center gap-2.5 ${className}`}>
      <span className="relative flex size-8 items-center justify-center rounded-lg bg-primary text-primary-content">
        <span className="display text-base leading-none">H</span>
        <span className="absolute inset-0 rounded-lg bg-primary opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-70" />
      </span>
      <span className="display text-lg tracking-tight">
        HARDCORE
        <span className="ml-1.5 align-middle text-[0.6rem] font-medium tracking-[0.2em] text-base-content/40">
          FIT SHOP
        </span>
      </span>
    </Link>
  );
}

export default function Header() {
  const [abierto, setAbierto] = useState(false);
  const [encogido, setEncogido] = useState(false);
  const { unidades } = useCarrito();
  const ruta = usePathname();

  // La cabecera se compacta al bajar, para dejar sitio a la cuadrícula.
  useEffect(() => {
    const alScrollear = () => setEncogido(window.scrollY > 12);
    alScrollear();
    window.addEventListener("scroll", alScrollear, { passive: true });
    return () => window.removeEventListener("scroll", alScrollear);
  }, []);

  // Cambiar de página cierra el menú móvil.
  useEffect(() => setAbierto(false), [ruta]);

  return (
    <header
      // Se pega debajo de la franja de demo, que mide --alto-barra-demo
      // (0 cuando no hay demo).
      style={{ top: "var(--alto-barra-demo)" }}
      className={`sticky z-50 border-b transition-all duration-300 ${
        encogido
          ? "border-base-content/10 bg-base-100/85 backdrop-blur-xl"
          : "border-transparent bg-base-100"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6">
        <Logo />

        <nav className="ml-4 hidden items-center gap-1 lg:flex" aria-label="Principal">
          <MenuFamilias />
          {ENLACES.map((enlace) => (
            <Link
              key={enlace.href}
              href={enlace.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-base-content/70 transition-colors hover:bg-base-200 hover:text-base-content"
            >
              {enlace.texto}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <Buscador />

          <Link
            href="/carrito"
            className="relative flex size-10 items-center justify-center rounded-lg text-base-content/80 transition-colors hover:bg-base-200 hover:text-base-content"
            aria-label={`Carrito${unidades ? `, ${unidades} artículos` : " vacío"}`}
          >
            <IconoCarrito />
            {unidades > 0 && (
              <span className="cifra absolute -right-0.5 -top-0.5 flex min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[0.65rem] font-bold text-primary-content">
                {unidades > 99 ? "99+" : unidades}
              </span>
            )}
          </Link>

          <button
            type="button"
            onClick={() => setAbierto((v) => !v)}
            className="flex size-10 items-center justify-center rounded-lg text-base-content/80 transition-colors hover:bg-base-200 lg:hidden"
            aria-expanded={abierto}
            aria-label="Menú"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {abierto ? (
                <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
              ) : (
                <path d="M3 6h18M3 12h18M3 18h18" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {abierto && (
        <div className="border-t border-base-content/10 bg-base-100 lg:hidden">
          <nav className="mx-auto max-w-7xl px-4 py-4 sm:px-6" aria-label="Principal móvil">
            <div className="grid grid-cols-2 gap-1.5">
              {FAMILIAS.filter(([slug]) => slug !== "otros").map(([slug, nombre]) => (
                <Link
                  key={slug}
                  href={`/tienda?familia=${slug}`}
                  className="rounded-lg px-3 py-2.5 text-sm text-base-content/75 transition-colors hover:bg-base-200"
                >
                  {nombre}
                </Link>
              ))}
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5 border-t border-base-content/10 pt-3">
              {ENLACES.map((enlace) => (
                <Link
                  key={enlace.href}
                  href={enlace.href}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-base-content/75 transition-colors hover:bg-base-200"
                >
                  {enlace.texto}
                </Link>
              ))}
              <a
                href={`https://wa.me/${config.business.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg px-3 py-2 text-sm font-medium text-primary"
              >
                WhatsApp
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

function MenuFamilias() {
  const [abierto, setAbierto] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setAbierto(true)}
      onMouseLeave={() => setAbierto(false)}
    >
      <button
        type="button"
        onClick={() => setAbierto((v) => !v)}
        className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-base-content/70 transition-colors hover:bg-base-200 hover:text-base-content"
        aria-expanded={abierto}
      >
        Categorías
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {abierto && (
        <div className="absolute left-0 top-full w-[30rem] pt-2">
          <div className="grid grid-cols-2 gap-1 rounded-xl border border-base-content/10 bg-base-200 p-2 shadow-2xl shadow-black/60">
            {FAMILIAS.filter(([slug]) => slug !== "otros").map(([slug, nombre]) => (
              <Link
                key={slug}
                href={`/tienda?familia=${slug}`}
                className="rounded-lg px-3 py-2 text-sm text-base-content/75 transition-colors hover:bg-primary/12 hover:text-primary"
              >
                {nombre}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Buscador() {
  const router = useRouter();
  const parametros = useSearchParams();
  const [texto, setTexto] = useState(parametros.get("q") || "");

  const enviar = (evento) => {
    evento.preventDefault();
    const limpio = texto.trim();
    router.push(limpio ? `/tienda?q=${encodeURIComponent(limpio)}` : "/tienda");
  };

  return (
    <form onSubmit={enviar} className="hidden sm:block" role="search">
      <div className="relative">
        <svg
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40"
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" strokeLinecap="round" />
        </svg>
        <input
          type="search"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="Buscar producto o marca"
          aria-label="Buscar en el catálogo"
          className="h-10 w-44 rounded-lg border border-base-content/12 bg-base-200/60 pl-9 pr-3 text-sm outline-none transition-all placeholder:text-base-content/35 focus:w-64 focus:border-primary/60 focus:bg-base-200"
        />
      </div>
    </form>
  );
}

function IconoCarrito() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path
        d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.5L21 8H6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="10" cy="20" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="18" cy="20" r="1.4" fill="currentColor" stroke="none" />
    </svg>
  );
}
