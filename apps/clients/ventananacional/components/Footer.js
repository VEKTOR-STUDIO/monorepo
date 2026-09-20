import Link from "next/link";
import Logo from "@/components/Logo";
import config from "@/config";

/**
 * El pie: la marca, dónde están las salas, por dónde se contacta y los enlaces
 * legales.
 *
 * Las dos sedes salen de `config.sedes`, igual que en la portada: son el dato
 * que más preguntan y el que distingue a una concesionaria de un particular
 * que vende por Instagram.
 */
export default function Footer() {
  const { business, sedes } = config;
  const anio = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-base-200/40">
      <div className="textura absolute inset-0" aria-hidden="true" />

      <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <Logo />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-base-content/60">
              {business.categoria}. Compra, venta, consignación e importación de
              vehículos, con sala en Caracas y en Barcelona.
            </p>
            <p className="mt-4 text-sm text-base-content/45">{business.horario}</p>
          </div>

          <div>
            <p className="rotulo">Inventario</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link href="/vehiculos" className="text-base-content/60 transition-colors hover:text-primary">
                  Todo el inventario
                </Link>
              </li>
              <li>
                <Link href="/vehiculos?tipo=camioneta" className="text-base-content/60 transition-colors hover:text-primary">
                  Camionetas
                </Link>
              </li>
              <li>
                <Link href="/vehiculos?tipo=sedan" className="text-base-content/60 transition-colors hover:text-primary">
                  Carros
                </Link>
              </li>
              <li>
                <Link href="/vehiculos?tipo=moto" className="text-base-content/60 transition-colors hover:text-primary">
                  Motos
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="rotulo">Dónde estamos</p>
            <ul className="mt-4 space-y-2.5 text-sm text-base-content/60">
              {sedes.map((sede) => (
                <li key={sede.zona}>{sede.zona}</li>
              ))}
            </ul>

            <p className="rotulo mt-7">Contacto</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <a
                  href={business.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-base-content/60 transition-colors hover:text-primary"
                >
                  @{business.instagram}
                </a>
              </li>
              <li>
                <a
                  href={business.instagramInmueblesUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-base-content/60 transition-colors hover:text-primary"
                >
                  @{business.instagramInmuebles}
                </a>
              </li>
              {business.whatsappVisible && (
                <li className="cifra text-base-content/60">{business.whatsappVisible}</li>
              )}
              <li>
                <Link href="/contacto" className="text-base-content/60 transition-colors hover:text-primary">
                  Escribir
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="banda banda-ancha mt-12 opacity-80" aria-hidden="true" />

        <div className="mt-6 flex flex-col gap-3 text-xs text-base-content/40 sm:flex-row sm:items-center sm:justify-between">
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
