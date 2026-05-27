"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/libs/supabase/client";
import config from "@/config";

const links = [
  {
    href: "/#servicios",
    label: "Servicios",
  },
  {
    href: "/#how-it-works",
    label: "El Proceso",
  },
  {
    href: "/#faq",
    label: "Preguntas",
  },
];

const Header = () => {
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const supabase = createClient();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  useEffect(() => {
    setIsOpen(false);
  }, [searchParams]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isOpen) {
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
    }
  }, [isOpen]);

  const cta = user ? (
    <Link
      href="/dashboard"
      className="btn btn-primary btn-sm"
      style={{ borderRadius: 0, letterSpacing: "0.12em", fontSize: "0.7rem", fontWeight: 600 }}
      title="Mi Área"
    >
      MI ÁREA
    </Link>
  ) : (
    <Link
      href={config.auth?.loginUrl ?? "/signin"}
      className="btn btn-primary btn-sm"
      style={{ borderRadius: 0, letterSpacing: "0.12em", fontSize: "0.7rem", fontWeight: 600 }}
      title="Agendar Cita"
    >
      AGENDAR CITA
    </Link>
  );

  return (
    <header
      className={`fixed top-0 w-full z-40 transition-all duration-500 ${
        scrolled
          ? "bg-base-100/90 backdrop-blur-md border-b border-primary/10"
          : "bg-transparent"
      }`}
    >
      <nav
        className="container flex items-center justify-between px-8 py-5 mx-auto relative"
        aria-label="Global"
      >
        {/* Brand name */}
        <div className="flex lg:flex-1 relative z-50">
          <Link
            className="flex items-center gap-3 shrink-0 group"
            href="/"
            title={`${config.appName} — Inicio`}
          >
            {/* Diamond logo mark */}
            <div className="w-5 h-5 border border-primary rotate-45 group-hover:scale-110 transition-transform duration-300" />
            <span
              className="font-bold text-sm tracking-widest uppercase text-base-content/90 group-hover:text-primary transition-colors duration-300"
              style={{ letterSpacing: "0.2em" }}
            >
              {config.appName}
            </span>
          </Link>
        </div>

        {/* Burger button — mobile */}
        <div className="flex lg:hidden relative z-50">
          <button
            type="button"
            className="relative inline-flex items-center justify-center p-3 hover:text-primary transition-colors cursor-pointer touch-manipulation"
            onClick={() => setIsOpen(true)}
            style={{ WebkitTapHighlightColor: "transparent", minWidth: "48px", minHeight: "48px" }}
          >
            <span className="sr-only">Abrir menú</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5 pointer-events-none"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
        </div>

        {/* Nav links — desktop */}
        <div className="hidden lg:flex lg:justify-center lg:gap-10 lg:items-center">
          {links.map((link) => (
            <Link
              href={link.href}
              key={link.href}
              className="text-base-content/60 hover:text-primary transition-colors duration-300 text-xs tracking-[0.2em] uppercase font-medium"
              title={link.label}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* CTA — desktop */}
        <div className="hidden lg:flex lg:justify-end lg:flex-1 lg:items-center">
          {cta}
        </div>
      </nav>

      {/* Mobile menu */}
      <div className={`fixed inset-0 z-50 ${isOpen ? "" : "hidden"}`}>
        <div
          className="fixed inset-0 bg-base-100/60 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
          style={{ WebkitTapHighlightColor: "transparent" }}
        />
        <div
          className={`fixed inset-y-0 right-0 z-50 w-full px-8 py-6 overflow-y-auto bg-base-100 sm:max-w-sm border-l border-primary/20 transform origin-right transition ease-in-out duration-300 ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
          style={{ willChange: "transform", WebkitOverflowScrolling: "touch" }}
        >
          {/* Header mobile */}
          <div className="flex items-center justify-between mb-10">
            <Link
              className="flex items-center gap-2 shrink-0"
              href="/"
              title="Inicio"
            >
              <div className="w-4 h-4 border border-primary rotate-45" />
              <span className="font-bold text-xs tracking-[0.2em] uppercase text-base-content/80">
                {config.appName}
              </span>
            </Link>
            <button
              type="button"
              className="p-3 hover:text-primary transition-colors touch-manipulation"
              onClick={() => setIsOpen(false)}
              style={{ WebkitTapHighlightColor: "transparent", minWidth: "48px", minHeight: "48px" }}
            >
              <span className="sr-only">Cerrar menú</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5 pointer-events-none"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Nav links mobile */}
          <div className="flex flex-col gap-6">
            {links.map((link) => (
              <Link
                href={link.href}
                key={link.href}
                className="text-base-content/70 hover:text-primary transition-colors text-xs tracking-[0.25em] uppercase font-medium border-b border-base-content/10 pb-4"
                title={link.label}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="mt-10">
            {cta}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
