"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/libs/supabase/client";
import config from "@/config";
import { useTheme } from "@/contexts/ThemeContext";
import { Heart, Package } from "lucide-react";

const VITALFORM_LINKS = [
  { href: "/#servicios", label: "Servicios" },
  { href: "/#como-funciona", label: "Cómo funciona" },
  { href: "/#faq", label: "Preguntas" },
];

const TOTUMA_LINKS = [
  { href: "/#productos", label: "Totumas" },
  { href: "/#delivery", label: "Delivery / Pick up" },
  { href: "/#faq", label: "Preguntas" },
];

const Header = () => {
  const searchParams = useSearchParams();
  const { activeProfile, setActiveProfile } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const supabase = createClient();

  const links = activeProfile === "vitalform" ? VITALFORM_LINKS : TOTUMA_LINKS;
  const brandName = activeProfile === "vitalform" ? "VitalForm Fit" : "Totuma Mealpreps";

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

  const whatsappUrl = activeProfile === "vitalform"
    ? `${config.business?.whatsapp || "#"}?text=${encodeURIComponent(config.business?.whatsappMessageVitalform || "Hola, me gustaría agendar una consulta nutricional con VitalForm Fit.")}`
    : `${config.business?.whatsapp || "#"}?text=${encodeURIComponent(config.business?.whatsappMessageTotuma || "Hola, quiero hacer un pedido de Totuma Mealpreps (delivery/pick up).")}`;

  const loginUrl = config.auth?.loginUrl ?? "/signin";

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
    <>
      <Link
        href={loginUrl}
        className="btn btn-ghost btn-sm border border-primary/30"
        style={{ borderRadius: 0, letterSpacing: "0.12em", fontSize: "0.7rem", fontWeight: 600 }}
        title="Iniciar sesión"
      >
        INICIAR SESIÓN
      </Link>
      {activeProfile === "vitalform" ? (
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary btn-sm"
          style={{ borderRadius: 0, letterSpacing: "0.12em", fontSize: "0.7rem", fontWeight: 600 }}
          title="Agendar consulta nutricional"
        >
          AGENDAR CONSULTA
        </a>
      ) : (
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary btn-sm"
          style={{ borderRadius: 0, letterSpacing: "0.12em", fontSize: "0.7rem", fontWeight: 600 }}
          title="Pedir por WhatsApp"
        >
          PEDIR POR WHATSAPP
        </a>
      )}
    </>
  );

  const profileSwitch = (
    <div
      className="flex shrink-0 rounded-lg border border-primary/25 overflow-hidden bg-base-200/90 shadow-sm min-w-[200px] lg:min-w-[220px]"
      role="group"
      aria-label="Cambiar entre VitalForm Fit y Totuma Mealpreps"
    >
      <button
        type="button"
        onClick={() => setActiveProfile("vitalform")}
        className={`flex flex-1 items-center justify-center gap-1.5 px-3 py-2 min-h-[44px] lg:min-h-[40px] text-xs font-semibold uppercase transition-all duration-300 touch-manipulation min-w-0 ${
          activeProfile === "vitalform"
            ? "bg-primary text-primary-content"
            : "text-base-content/60 hover:text-base-content hover:bg-base-300/50"
        }`}
        style={{ letterSpacing: "0.1em", WebkitTapHighlightColor: "transparent" }}
        title="VitalForm Fit — Nutrición"
      >
        <Heart className="w-4 h-4 shrink-0" aria-hidden />
        <span className="whitespace-nowrap truncate">VitalForm</span>
      </button>
      <button
        type="button"
        onClick={() => setActiveProfile("totuma")}
        className={`flex flex-1 items-center justify-center gap-1.5 px-3 py-2 min-h-[44px] lg:min-h-[40px] text-xs font-semibold uppercase transition-all duration-300 touch-manipulation min-w-0 ${
          activeProfile === "totuma"
            ? "giro-totuma-active"
            : "text-base-content/60 hover:text-base-content hover:bg-base-300/50"
        }`}
        style={{ letterSpacing: "0.1em", WebkitTapHighlightColor: "transparent" }}
        title="Totuma Mealpreps — Delivery"
      >
        <Package className="w-4 h-4 shrink-0" aria-hidden />
        <span className="whitespace-nowrap truncate">Totuma</span>
      </button>
    </div>
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
        className="container flex flex-col lg:flex-row lg:items-center lg:justify-between gap-0 lg:gap-8 px-4 sm:px-6 lg:px-8 py-4 lg:py-5 mx-auto relative"
        aria-label="Global"
      >
        <div className="flex lg:hidden items-center justify-between w-full min-h-[44px]">
          <Link
            className="flex items-center gap-2 sm:gap-3 shrink-0 group"
            href="/"
            title={`${brandName} — Inicio`}
          >
            <div className="w-5 h-5 border border-primary rotate-45 group-hover:scale-110 transition-transform duration-300 shrink-0" />
            <span
              className="font-bold text-xs sm:text-sm tracking-widest uppercase text-base-content/90 group-hover:text-primary transition-colors duration-300 truncate"
              style={{ letterSpacing: "0.2em" }}
            >
              {brandName}
            </span>
          </Link>
          <button
            type="button"
            className="relative inline-flex items-center justify-center p-3 hover:text-primary transition-colors cursor-pointer touch-manipulation min-h-[44px] min-w-[44px]"
            onClick={() => setIsOpen(true)}
            style={{ WebkitTapHighlightColor: "transparent" }}
          >
            <span className="sr-only">Abrir menú</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 pointer-events-none">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
        </div>

        <div className="flex lg:hidden w-full pt-2 pb-1 justify-center">
          {profileSwitch}
        </div>

        <div className="hidden lg:flex lg:flex-1 lg:items-center lg:gap-4 min-w-0">
          <Link
            className="flex items-center gap-2 sm:gap-3 shrink-0 group"
            href="/"
            title={`${brandName} — Inicio`}
          >
            <div className="w-5 h-5 border border-primary rotate-45 group-hover:scale-110 transition-transform duration-300 shrink-0" />
            <span
              className="font-bold text-sm tracking-widest uppercase text-base-content/90 group-hover:text-primary transition-colors duration-300 truncate"
              style={{ letterSpacing: "0.2em" }}
            >
              {brandName}
            </span>
          </Link>
          {profileSwitch}
        </div>

        <div className="hidden lg:flex lg:justify-center lg:gap-10 lg:items-center shrink-0">
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

        <div className="hidden lg:flex lg:justify-end lg:flex-1 lg:items-center lg:gap-2">
          {cta}
        </div>
      </nav>

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
          <div className="flex items-center justify-between mb-10">
            <Link className="flex items-center gap-2 shrink-0" href="/" title="Inicio">
              <div className="w-4 h-4 border border-primary rotate-45" />
              <span className="font-bold text-xs tracking-[0.2em] uppercase text-base-content/80">
                {brandName}
              </span>
            </Link>
            <button
              type="button"
              className="p-3 hover:text-primary transition-colors touch-manipulation"
              onClick={() => setIsOpen(false)}
              style={{ WebkitTapHighlightColor: "transparent", minWidth: "48px", minHeight: "48px" }}
            >
              <span className="sr-only">Cerrar menú</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 pointer-events-none">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex gap-2 mb-6">
            <button
              type="button"
              onClick={() => { setActiveProfile("vitalform"); setIsOpen(false); }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-semibold uppercase rounded border ${
                activeProfile === "vitalform" ? "bg-primary text-primary-content border-primary" : "border-primary/20"
              }`}
            >
              <Heart className="w-4 h-4" /> VitalForm
            </button>
            <button
              type="button"
              onClick={() => { setActiveProfile("totuma"); setIsOpen(false); }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-semibold uppercase rounded border ${
                activeProfile === "totuma" ? "giro-totuma-active border-[#3a683a]" : "border-primary/20"
              }`}
            >
              <Package className="w-4 h-4" /> Totuma
            </button>
          </div>

          <div className="flex flex-col gap-6">
            {links.map((link) => (
              <Link
                href={link.href}
                key={link.href}
                className="text-base-content/70 hover:text-primary transition-colors text-xs tracking-[0.25em] uppercase font-medium border-b border-base-content/10 pb-4"
                title={link.label}
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="mt-10 flex flex-col gap-2">
            {cta}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
