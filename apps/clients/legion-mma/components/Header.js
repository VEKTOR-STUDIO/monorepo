"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import config from "@/config";

const links = [
  { href: "/#proximo-evento", label: "Próximo Evento" },
  { href: "/#cartelera", label: "Cartelera" },
  { href: "/#peleadores", label: "Peleadores" },
  { href: "/#ediciones", label: "Ediciones" },
  { href: "/#faq", label: "FAQ" },
];

const Header = () => {
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setIsOpen(false);
  }, [searchParams]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const scrollY = window.scrollY;
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
      window.scrollTo(0, scrollY);
    };
  }, [isOpen]);

  const cta = (
    <div className="flex items-center gap-2">
      <Link
        href={config.auth?.loginUrl ?? "/signin"}
        className="btn btn-ghost btn-sm border border-primary/50 text-primary hover:bg-primary hover:text-primary-content"
      >
        Soy Peleador
      </Link>
      <a
        href={config.event?.ticketUrl ?? "#proximo-evento"}
        target="_blank"
        rel="noopener noreferrer"
        className="btn btn-primary btn-sm"
      >
        Entradas
      </a>
    </div>
  );

  return (
    <header
      className={`fixed top-0 w-full z-40 transition-all duration-300 ${
        scrolled
          ? "bg-base-100/95 backdrop-blur-md border-b-2 border-primary"
          : "bg-gradient-to-b from-base-100/80 to-transparent"
      }`}
    >
      <nav
        className="container flex items-center justify-between px-6 lg:px-10 py-4 mx-auto relative"
        aria-label="Global"
      >
        <div className="flex lg:flex-1 relative z-50">
          <Link
            className="flex items-center gap-3 shrink-0 group"
            href="/"
            title={`${config.appName} — Inicio`}
          >
            <div
              className="w-7 h-7 bg-primary group-hover:bg-accent transition-colors shadow-[0_0_18px_rgba(212,175,55,0.35)]"
              style={{ clipPath: "polygon(0 0, 100% 0, 80% 100%, 0% 100%)" }}
            />
            <span
              className="font-display text-2xl tracking-wide text-base-content"
            >
              LEGIÓN <span className="text-primary">MMA</span>
            </span>
          </Link>
        </div>

        <div className="flex lg:hidden relative z-50">
          <button
            type="button"
            className="relative inline-flex items-center justify-center p-3 hover:text-primary transition-colors cursor-pointer touch-manipulation"
            onClick={() => setIsOpen(true)}
            style={{ WebkitTapHighlightColor: "transparent", minWidth: "48px", minHeight: "48px" }}
          >
            <span className="sr-only">Abrir menú</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 pointer-events-none">
              <path strokeLinecap="square" strokeLinejoin="miter" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
        </div>

        <div className="hidden lg:flex lg:justify-center lg:gap-8 lg:items-center">
          {links.map((link) => (
            <Link
              href={link.href}
              key={link.href}
              className="text-base-content/70 hover:text-primary transition-colors duration-200 text-xs tracking-[0.18em] uppercase font-bold"
              title={link.label}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden lg:flex lg:justify-end lg:flex-1 lg:items-center">
          {cta}
        </div>
      </nav>

      <div className={`fixed inset-0 z-50 ${isOpen ? "" : "hidden"}`}>
        <div
          className="fixed inset-0 bg-base-100/70 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
          style={{ WebkitTapHighlightColor: "transparent" }}
        />
        <div
          className={`fixed inset-y-0 right-0 z-50 w-full px-8 py-6 overflow-y-auto bg-base-100 sm:max-w-sm border-l-4 border-primary transform origin-right transition ease-in-out duration-300 ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
          style={{ willChange: "transform", WebkitOverflowScrolling: "touch" }}
        >
          <div className="flex items-center justify-between mb-10">
            <Link className="flex items-center gap-2 shrink-0" href="/" title="Inicio">
              <div className="w-5 h-5 bg-primary shadow-[0_0_14px_rgba(212,175,55,0.35)]" style={{ clipPath: "polygon(0 0, 100% 0, 80% 100%, 0% 100%)" }} />
              <span className="font-display text-xl tracking-wide text-base-content">
                LEGIÓN <span className="text-primary">MMA</span>
              </span>
            </Link>
            <button
              type="button"
              className="p-3 hover:text-primary transition-colors touch-manipulation"
              onClick={() => setIsOpen(false)}
              style={{ WebkitTapHighlightColor: "transparent", minWidth: "48px", minHeight: "48px" }}
            >
              <span className="sr-only">Cerrar menú</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 pointer-events-none">
                <path strokeLinecap="square" strokeLinejoin="miter" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex flex-col gap-1">
            {links.map((link) => (
              <Link
                href={link.href}
                key={link.href}
                className="text-base-content/80 hover:text-primary transition-colors text-base tracking-[0.18em] uppercase font-bold border-b border-base-content/10 py-4"
                title={link.label}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="mt-10">{cta}</div>
        </div>
      </div>
    </header>
  );
};

export default Header;
