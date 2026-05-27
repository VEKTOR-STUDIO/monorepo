import Link from "next/link";
import config from "@/config";

const Footer = () => {
  const year = new Date().getFullYear();
  const { business } = config;
  const mailto = business?.email ? `mailto:${business.email}` : "mailto:support@yourdomain.com";
  const tel = business?.phone?.replace(/\s/g, "") ?? "";
  const whatsapp = business?.whatsapp?.replace(/\s/g, "") ?? "";

  return (
    <footer className="relative bg-base-100 border-t border-base-300 rounded-none">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12 items-start">
          <div className="flex flex-col gap-4">
            <Link href="/" aria-current="page" className="flex gap-2 items-center group">
              <div className="text-base font-bold text-base-content">
                <span className="text-primary">Athlete</span>VOD
              </div>
            </Link>
            <p className="text-sm text-base-content/60 max-w-xs leading-relaxed">{config.appDescription}</p>
          </div>

          <div>
            <p className="font-semibold text-base-content/50 tracking-wide text-xs mb-4 uppercase">Contacto</p>
            <div className="flex flex-col gap-3 text-sm">
              <p className="text-base-content/70 leading-relaxed">{business?.address}</p>
              {business?.phone && (
                <a href={`tel:${tel}`} className="text-base-content/60 hover:text-primary transition-colors">
                  {business.phone}
                </a>
              )}
              <a href={mailto} className="text-base-content/60 hover:text-primary transition-colors break-all">
                {business?.email || "support@yourdomain.com"}
              </a>
              {business?.instagram && (
                <a
                  href={business.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-base-content/60 hover:text-primary transition-colors"
                >
                  Red social
                </a>
              )}
            </div>
          </div>

          <div className="flex flex-col items-start md:items-end gap-4">
            <p className="text-base-content/50 text-sm md:text-right max-w-xs leading-relaxed">{config.business?.tagline}</p>
            {(whatsapp || tel) && (
              <a
                href={whatsapp ? `https://wa.me/${whatsapp}` : `tel:${tel}`}
                className="btn btn-primary btn-sm rounded-md border border-primary/80 shadow-sm"
              >
                {whatsapp ? "Mensaje" : "Llamar"}
              </a>
            )}
            <p className="text-xs text-base-content/40 md:text-right">{business?.location ?? "City, Country"}</p>
          </div>
        </div>

        <div className="mt-10 h-px bg-base-300" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-base-content/40">
          <p>© {year} {config.appName}</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy-policy" className="hover:text-primary transition-colors">
              Privacidad
            </Link>
            <Link href="/tos" className="hover:text-primary transition-colors">
              Términos
            </Link>
            <a
              href="https://wadoom.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors font-semibold"
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
