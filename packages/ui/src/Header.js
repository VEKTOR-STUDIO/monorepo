"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

/**
 * Alessandrovaru shared Header.
 *
 * Estructura:
 *  - Logo + appName a la izquierda
 *  - Links centrados
 *  - CTA a la derecha (slot — el caller arma su lógica de auth)
 *  - Menú mobile detrás de un burger button
 *
 * Props:
 *  - appName:   string   — texto al lado del logo.
 *  - logo:      next/image src (StaticImageData o string).
 *  - logoAlt:   string   — alt text; default `${appName} logo`.
 *  - links:     [{ href, label }]
 *  - cta:       ReactNode — botón derecho.
 *  - homeHref:  string   — destino del logo (default "/").
 *  - sticky:    boolean  — header `fixed top-0` con efecto scroll (default true).
 *  - solid:     boolean  — si true, fondo `bg-base-200` siempre (estilo vanilla shipfast clásico).
 *                          Si false (default), arranca transparente y al hacer scroll cambia a `bg-base-100/80`.
 *
 * El gradiente animado para CTAs vive en `@alessandrovaru/ui/styles.css`
 * (clase `.btn-gradient-animated`). Importalo en tu globals.css.
 */
const Header = ({
  appName,
  logo,
  logoAlt,
  links = [],
  cta = null,
  homeHref = "/",
  sticky = true,
  solid = false,
}) => {
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setIsOpen(false);
  }, [searchParams]);

  useEffect(() => {
    if (solid || !sticky) return;
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [solid, sticky]);

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

  const bgClass = solid
    ? "bg-base-200"
    : scrolled
    ? "bg-base-100/80 backdrop-blur-md shadow-lg"
    : "bg-transparent";

  const positionClass = sticky ? "fixed top-0" : "relative";

  return (
    <header
      className={`${positionClass} w-full z-40 transition-all duration-300 ${bgClass}`}
    >
      <nav
        className="container flex items-center justify-between px-8 py-4 mx-auto relative"
        aria-label="Global"
      >
        <div className="flex lg:flex-1 relative z-50">
          <Link
            className="flex items-center gap-2 shrink-0"
            href={homeHref}
            title={`${appName} homepage`}
          >
            {logo ? (
              <Image
                src={logo}
                alt={logoAlt ?? `${appName} logo`}
                className="w-8"
                placeholder={typeof logo === "object" ? "blur" : "empty"}
                priority
                width={32}
                height={32}
              />
            ) : null}
            <span className="font-extrabold text-lg">{appName}</span>
          </Link>
        </div>

        <div className="flex lg:hidden relative z-50">
          <button
            type="button"
            className="relative inline-flex items-center justify-center rounded-md p-3 hover:bg-base-200 active:bg-base-300 transition-colors cursor-pointer touch-manipulation"
            onClick={() => setIsOpen(true)}
            style={{
              WebkitTapHighlightColor: "transparent",
              minWidth: "48px",
              minHeight: "48px",
            }}
          >
            <span className="sr-only">Open main menu</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 text-base-content pointer-events-none"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          </button>
        </div>

        <div className="hidden lg:flex lg:justify-center lg:gap-12 lg:items-center">
          {links.map((link) => (
            <Link
              href={link.href}
              key={link.href}
              className="link link-hover text-base-content/80 hover:text-base-content transition-colors duration-300"
              title={link.label}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {cta ? (
          <div className="hidden lg:flex lg:justify-end lg:flex-1">{cta}</div>
        ) : (
          <div className="hidden lg:flex lg:flex-1" />
        )}
      </nav>

      <div className={`fixed inset-0 z-50 ${isOpen ? "" : "hidden"}`}>
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
          style={{ WebkitTapHighlightColor: "transparent" }}
        />
        <div
          className={`fixed inset-y-0 right-0 z-50 w-full px-8 py-4 overflow-y-auto bg-base-100 sm:max-w-sm sm:ring-1 sm:ring-neutral/10 transform origin-right transition ease-in-out duration-300 ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
          style={{
            willChange: "transform",
            WebkitOverflowScrolling: "touch",
          }}
        >
          <div className="flex items-center justify-between">
            <Link
              className="flex items-center gap-2 shrink-0"
              title={`${appName} homepage`}
              href={homeHref}
            >
              {logo ? (
                <Image
                  src={logo}
                  alt={logoAlt ?? `${appName} logo`}
                  className="w-8"
                  placeholder={typeof logo === "object" ? "blur" : "empty"}
                  priority
                  width={32}
                  height={32}
                />
              ) : null}
              <span className="font-extrabold text-lg">{appName}</span>
            </Link>
            <button
              type="button"
              className="relative inline-flex items-center justify-center rounded-md p-3 hover:bg-base-200 active:bg-base-300 transition-colors cursor-pointer touch-manipulation"
              onClick={() => setIsOpen(false)}
              style={{
                WebkitTapHighlightColor: "transparent",
                minWidth: "48px",
                minHeight: "48px",
              }}
            >
              <span className="sr-only">Close menu</span>
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

          <div className="flow-root mt-6">
            <div className="py-4">
              <div className="flex flex-col gap-y-4 items-start">
                {links.map((link) => (
                  <Link
                    href={link.href}
                    key={link.href}
                    className="link link-hover text-lg"
                    title={link.label}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
            {cta ? (
              <>
                <div className="divider"></div>
                <div className="flex flex-col">{cta}</div>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
