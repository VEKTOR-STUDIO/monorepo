import Link from "next/link";
import config from "@/config";

const Footer = () => {
  const year = new Date().getFullYear();
  const { business } = config;
  const mailto = business?.email
    ? `mailto:${business.email}`
    : "mailto:support@yourdomain.com";
  const tel = business?.phone?.replace(/\s/g, "") ?? "";
  const whatsapp = business?.whatsapp?.replace(/\s/g, "") ?? "";

  return (
    <footer className="relative border-t border-base-300 bg-base-100">
      <div className="mx-auto max-w-7xl px-6 py-16 sm:px-8">
        <div className="grid grid-cols-1 items-start gap-10 md:grid-cols-3 md:gap-12">
          <div className="flex flex-col gap-4">
            <Link href="/" aria-current="page" className="group">
              <span className="display text-2xl leading-none">
                Frank<span className="text-primary">Manzano</span>
              </span>
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-base-content/50">
              {config.appDescription}
            </p>
          </div>

          <div>
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-base-content/40">
              Contacto
            </p>
            <div className="flex flex-col gap-3 text-sm">
              <p className="leading-relaxed text-base-content/60">
                {business?.address}
              </p>
              {business?.phone && (
                <a
                  href={`tel:${tel}`}
                  className="text-base-content/60 transition-colors hover:text-primary"
                >
                  {business.phone}
                </a>
              )}
              <a
                href={mailto}
                className="break-all text-base-content/60 transition-colors hover:text-primary"
              >
                {business?.email || "support@yourdomain.com"}
              </a>
              {business?.instagram && (
                <a
                  href={business.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-base-content/60 transition-colors hover:text-primary"
                >
                  Red social
                </a>
              )}
            </div>
          </div>

          <div className="flex flex-col items-start gap-4 md:items-end">
            <p className="max-w-xs text-sm leading-relaxed text-base-content/50 md:text-right">
              {config.business?.tagline}
            </p>
            {(whatsapp || tel) && (
              <a
                href={whatsapp ? `https://wa.me/${whatsapp}` : `tel:${tel}`}
                className="btn btn-primary btn-sm"
              >
                {whatsapp ? "Mensaje" : "Llamar"}
              </a>
            )}
            <p className="text-xs text-base-content/40 md:text-right">
              {business?.location ?? "City, Country"}
            </p>
          </div>
        </div>

        <div className="mt-12 h-px bg-base-300" />

        <div className="flex flex-col items-center justify-between gap-4 pt-6 text-xs uppercase tracking-widest text-base-content/40 md:flex-row">
          <p>
            © {year} {config.appName}
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="/privacy-policy"
              className="transition-colors hover:text-primary"
            >
              Privacidad
            </Link>
            <Link href="/tos" className="transition-colors hover:text-primary">
              Términos
            </Link>
            <a
              href="https://wadoom.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold transition-colors hover:text-primary"
            >
              WADOOM
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
