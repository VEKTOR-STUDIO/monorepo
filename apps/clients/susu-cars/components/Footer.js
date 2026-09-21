import Link from "next/link";
import Logo from "@/components/Logo";
import Filetes from "@/components/Filetes";
import config from "@/config";

/**
 * El pie: la marca, dónde está la sede, por dónde se contacta y los enlaces
 * legales.
 *
 * La dirección va grande y con su propio bloque, y no escondida en una línea
 * de texto: este negocio recibe los vehículos en una sede de Av. Casanova, sus
 * propias publicaciones la repiten dos veces, y quien llega a la web buscando
 * "dónde están" —para ir a dejar su carro— tiene que encontrarla sin leer un
 * párrafo.
 *
 * El teléfono solo sale si hay uno configurado; mientras no lo haya, el canal
 * que se enseña es Instagram, que es por donde hoy escribe todo el mundo.
 */
export default function Footer() {
  const { business } = config;
  const anio = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-base-content/10 bg-base-200">
      <Filetes variante="sutil" deslizar={false} />

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <Logo lado={44} />
            <p className="display mt-6 max-w-sm text-2xl leading-tight text-base-content/85">
              {business.tagline}
            </p>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-base-content/50">
              {business.lema}.
            </p>
          </div>

          <div>
            <p className="rotulo">La sede</p>
            <address className="mt-4 not-italic text-sm leading-relaxed text-base-content/65">
              {business.direccion}
              <br />
              {business.ciudad}, {business.estado}
              <br />
              Venezuela
            </address>
            <p className="mt-4 text-sm text-base-content/50">{business.horario}</p>
          </div>

          <div>
            <p className="rotulo">Inventario</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link
                  href="/vehiculos?condicion=nuevo"
                  className="text-base-content/65 transition-colors hover:text-primary"
                >
                  0 km importados
                </Link>
              </li>
              <li>
                <Link
                  href="/vehiculos?condicion=usado"
                  className="text-base-content/65 transition-colors hover:text-primary"
                >
                  Usados verificados
                </Link>
              </li>
              <li>
                <Link
                  href="/vehiculos"
                  className="text-base-content/65 transition-colors hover:text-primary"
                >
                  Todo el catálogo
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
                <Link
                  href="/contacto"
                  className="text-base-content/65 transition-colors hover:text-primary"
                >
                  Escribir
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="banda banda-ancha mt-14 opacity-80" aria-hidden="true" />

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
