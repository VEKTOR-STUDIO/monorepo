"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import config from "@/config";

const links = [
  { href: "/#intro", label: "Filosofía" },
  { href: "/entrenamientos", label: "Entrenamientos" },
  { href: "/#horarios", label: "Horarios" },
];

const Wordmark = ({ className = "" }) => (
  <span className={`display leading-none ${className}`}>
    Frank<span className="text-primary">Manzano</span>
  </span>
);

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

  const cta = (
    <Link
      href="/entrenamientos"
      className="btn btn-primary btn-sm md:btn-md"
      title="Ver entrenamientos"
    >
      Área atletas
    </Link>
  );

  return (
    <header
      className={`fixed top-0 w-full z-40 transition-all duration-300 ${
        scrolled
          ? "bg-base-100/95 backdrop-blur border-b border-base-300"
          : "bg-transparent"
      }`}
    >
      <nav
        className="container flex items-center justify-between px-6 sm:px-8 py-4 mx-auto"
        aria-label="Global"
      >
        <div className="flex lg:flex-1 relative z-50">
          <Link
            className="flex items-center gap-2 shrink-0 group"
            href="/"
            title={`${config.appName} — Inicio`}
          >
            <Wordmark className="text-xl md:text-2xl" />
          </Link>
        </div>

        <div className="flex lg:hidden relative z-50">
          <button
            type="button"
            className="p-3 hover:text-primary transition-colors cursor-pointer touch-manipulation"
            onClick={() => setIsOpen(true)}
            style={{
              WebkitTapHighlightColor: "transparent",
              minWidth: "48px",
              minHeight: "48px",
            }}
          >
            <span className="sr-only">Abrir menú</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 pointer-events-none"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          </button>
        </div>

        <div className="hidden lg:flex lg:justify-center lg:gap-8 lg:items-center">
          {links.map((link) => (
            <Link
              href={link.href}
              key={link.href}
              className="text-base-content/60 hover:text-primary transition-colors text-xs font-bold uppercase tracking-[0.15em]"
              title={link.label}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden lg:flex lg:justify-end lg:flex-1 lg:items-center lg:gap-3">
          {cta}
        </div>
      </nav>

      <div className={`fixed inset-0 z-50 ${isOpen ? "" : "hidden"}`}>
        <div
          className="fixed inset-0 bg-base-100/90"
          onClick={() => setIsOpen(false)}
          style={{ WebkitTapHighlightColor: "transparent" }}
        />
        <div
          className={`fixed inset-y-0 right-0 z-50 w-full px-8 py-6 overflow-y-auto bg-base-100 border-l border-base-300 ${
            isOpen ? "translate-x-0" : "translate-x-full"
          } transition-transform duration-200 ease-out`}
          style={{ maxWidth: "20rem" }}
        >
          <div className="flex items-center justify-between mb-10">
            <Link
              className="flex items-center gap-2 shrink-0"
              href="/"
              title="Inicio"
            >
              <Wordmark className="text-lg" />
            </Link>
            <button
              type="button"
              className="p-3 hover:text-primary transition-colors touch-manipulation"
              onClick={() => setIsOpen(false)}
              style={{
                WebkitTapHighlightColor: "transparent",
                minWidth: "48px",
                minHeight: "48px",
              }}
            >
              <span className="sr-only">Cerrar menú</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 pointer-events-none"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div className="flex flex-col gap-1">
            {links.map((link) => (
              <Link
                href={link.href}
                key={link.href}
                className="display text-3xl text-base-content/80 hover:text-primary transition-colors border-b border-base-300 py-4"
                title={link.label}
                onClick={() => setIsOpen(false)}
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
