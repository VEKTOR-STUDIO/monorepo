import Link from "next/link";
import Logo from "@/components/Logo";
import config from "@/config";

/**
 * El pie: la marca, lo que hace el negocio, por dónde se contacta y los
 * enlaces legales.
 *
 * El teléfono solo sale si hay uno configurado; mientras no lo haya, el canal
 * que se enseña es Instagram, que es por donde hoy escribe todo el mundo.
 */
export default function Footer() {
  const { business } = config;
  const anio = new Date().getFullYear();

  return (
    <footer className="border-t border-base-content/10 bg-base-200">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <Logo ancho={160} />
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-base-content/60">
              {business.tagline}. Venta de camionetas, pick-up y carros en{" "}
              {business.ciudad}, con taller de accesorios y detailing propio.
            </p>
            <p className="mt-4 text-sm text-base-content/50">{business.horario}</p>
          </div>

          <div>
            <p className="rotulo">Vehículos</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link href="/vehiculos" className="text-base-content/65 transition-colors hover:text-primary">
                  Todo el inventario
                </Link>
              </li>
              <li>
                <Link href="/vehiculos?tipo=camioneta" className="text-base-content/65 transition-colors hover:text-primary">
                  Camionetas
                </Link>
              </li>
              <li>
                <Link href="/vehiculos?tipo=pickup" className="text-base-content/65 transition-colors hover:text-primary">
                  Pick-up
                </Link>
              </li>
              <li>
                <Link href="/vehiculos?tipo=sedan" className="text-base-content/65 transition-colors hover:text-primary">
                  Carros
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="rotulo">El negocio</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link href="/#taller" className="text-base-content/65 transition-colors hover:text-primary">
                  Taller y detailing
                </Link>
              </li>
              <li>
                <Link href="/#consignacion" className="text-base-content/65 transition-colors hover:text-primary">
                  Consignación
                </Link>
              </li>
              <li>
                <a
                  href={business.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-base-content/65 transition-colors hover:text-primary"
                >
                  @{business.instagram}
                </a>
              </li>
              {business.whatsappVisible && (
                <li className="cifra text-base-content/65">{business.whatsappVisible}</li>
              )}
              <li>
                <Link href="/contacto" className="text-base-content/65 transition-colors hover:text-primary">
                  Escribir
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="banda banda-ancha mt-12 opacity-80" aria-hidden="true" />

        <div className="mt-6 flex flex-col gap-3 text-xs text-base-content/45 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {anio} {business.razonSocial}
          </p>
          <div className="flex gap-5">
            <Link href="/tos" className="transition-colors hover:text-primary">
              Términos
            </Link>
            <Link href="/privacy-policy" className="transition-colors hover:text-primary">
              Privacidad
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
