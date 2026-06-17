import Link from "next/link";
import Image from "next/image";
import config from "@/config";

const SocialIcon = ({ children, href, label }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="text-base-content/50 hover:text-primary transition-colors duration-200"
    aria-label={label}
  >
    {children}
  </a>
);

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="relative bg-base-200 border-t-2 border-primary">
      <div className="absolute top-0 left-0 right-0 h-1 bg-primary" />

      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr_1fr_1fr] gap-12 md:gap-10">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center group">
              <Image
                src="/dorado.png"
                alt={`${config.appName} — Logo`}
                width={1645}
                height={1502}
                className="h-20 w-auto transition-transform group-hover:scale-105"
              />
            </Link>
            <p className="text-base-content/60 text-sm leading-relaxed mt-5 max-w-xs">
              {config.business?.tagline}
            </p>

            <div className="flex gap-5 mt-6">
              {config.social?.instagram && (
                <SocialIcon href={config.social.instagram} label="Instagram">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
                </SocialIcon>
              )}
              {config.social?.x && (
                <SocialIcon href={config.social.x} label="X / Twitter">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                </SocialIcon>
              )}
              {config.social?.facebook && (
                <SocialIcon href={config.social.facebook} label="Facebook">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" /></svg>
                </SocialIcon>
              )}
            </div>
          </div>

          {/* Liga */}
          <div>
            <p className="font-display text-base text-base-content/50 tracking-[0.3em] uppercase mb-5">
              Liga
            </p>
            <div className="flex flex-col gap-3 text-sm">
              <Link href="/#proximo-evento" className="text-base-content/70 hover:text-primary transition-colors">
                Próximo Evento
              </Link>
              <Link href="/#cartelera" className="text-base-content/70 hover:text-primary transition-colors">
                Cartelera
              </Link>
              <Link href="/#peleadores" className="text-base-content/70 hover:text-primary transition-colors">
                Peleadores
              </Link>
              <Link href="/#ediciones" className="text-base-content/70 hover:text-primary transition-colors">
                Ediciones
              </Link>
            </div>
          </div>

          {/* Contacto */}
          <div>
            <p className="font-display text-base text-base-content/50 tracking-[0.3em] uppercase mb-5">
              Contacto
            </p>
            <div className="flex flex-col gap-3 text-sm">
              <a
                href={config.event?.ticketUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-base-content/70 hover:text-primary transition-colors"
              >
                Entradas
              </a>
              {config.resend?.supportEmail && (
                <a
                  href={`mailto:${config.resend.supportEmail}`}
                  className="text-base-content/70 hover:text-primary transition-colors"
                >
                  {config.resend.supportEmail}
                </a>
              )}
              <span className="text-base-content/50">{config.business?.location}</span>
            </div>
          </div>

          {/* Legal */}
          <div>
            <p className="font-display text-base text-base-content/50 tracking-[0.3em] uppercase mb-5">
              Legal
            </p>
            <div className="flex flex-col gap-3 text-sm">
              <Link href="/privacy-policy" className="text-base-content/70 hover:text-primary transition-colors">
                Privacidad
              </Link>
              <Link href="/tos" className="text-base-content/70 hover:text-primary transition-colors">
                Términos
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-14 pt-6 border-t border-base-content/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-base-content/40 tracking-wide">
          <p>&copy; {year} {config.appName}. Todos los derechos reservados.</p>
          <p>
            Sitio por{" "}
            <a
              href="https://alessandrovaru.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors uppercase tracking-[0.25em] font-bold"
            >
              Alessandrovaru
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
