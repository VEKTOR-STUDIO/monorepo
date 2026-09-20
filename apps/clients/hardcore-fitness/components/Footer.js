import Link from "next/link";
import Logo from "@/components/Logo";
import config from "@/config";
import { FAMILIAS } from "@/libs/catalogo-normalizar.mjs";

const { business } = config;

export default function Footer() {
  return (
    <footer className="barra-cristal relative mt-24 border-t border-base-content/10">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Logo ancho={168} />
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-base-content/60">
              {business.tagline} Suplementación deportiva, equipo de entrenamiento y accesorios
              en {business.ciudad}.
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              <a
                href={`https://wa.me/${business.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary btn-sm"
              >
                Escribir por WhatsApp
              </a>
              <a
                href={business.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-sm btn-outline"
              >
                @{business.instagram}
              </a>
            </div>
          </div>

          <nav aria-label="Categorías">
            <p className="rotulo mb-3.5">Catálogo</p>
            <ul className="space-y-2 text-sm">
              {FAMILIAS.filter(([slug]) => slug !== "otros")
                .slice(0, 8)
                .map(([slug, nombre]) => (
                  <li key={slug}>
                    <Link
                      href={`/tienda?familia=${slug}`}
                      className="text-base-content/60 transition-colors hover:text-primary"
                    >
                      {nombre}
                    </Link>
                  </li>
                ))}
              <li>
                <Link href="/tienda" className="text-base-content/60 transition-colors hover:text-primary">
                  Ver todo
                </Link>
              </li>
            </ul>
          </nav>

          <div>
            <p className="rotulo mb-3.5">La tienda</p>
            <address className="space-y-2 text-sm not-italic text-base-content/60">
              <p>{business.direccion}</p>
              <p>{business.ciudad}</p>
              <p>
                <a
                  href={`https://wa.me/${business.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cifra transition-colors hover:text-primary"
                >
                  {business.whatsappVisible}
                </a>
              </p>
              <p className="text-base-content/45">{business.horario}</p>
            </address>

            <ul className="mt-5 space-y-2 text-sm">
              <li>
                <a
                  href={business.mercadoLibre}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-base-content/60 transition-colors hover:text-primary"
                >
                  Tienda en Mercado Libre
                </a>
              </li>
              <li>
                <Link href="/contacto" className="text-base-content/60 transition-colors hover:text-primary">
                  Cómo comprar
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-base-content/10 pt-6 text-xs text-base-content/40 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {business.razonSocial}. Precios sujetos a cambio sin
            previo aviso.
          </p>
          <nav className="flex gap-5" aria-label="Legal">
            <Link href="/tos" className="transition-colors hover:text-base-content/70">
              Términos
            </Link>
            <Link href="/privacy-policy" className="transition-colors hover:text-base-content/70">
              Privacidad
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
