import Link from "next/link";
import Logo from "@/components/Logo";
import Escenario from "@/components/Escenario";
import config from "@/config";

/**
 * El pie: la marca, las dos sedes, por dónde se contacta y los enlaces
 * legales.
 *
 * Las sedes van cada una en su bloque, con su teléfono y su Instagram, y no
 * escondidas en una línea de texto: DealerNauta vende en dos sitios y con dos
 * cuentas —los vehículos en Los Chaguaramos, los camiones en San Antonio de
 * los Altos—, y quien llega a la web buscando "dónde están" tiene que
 * encontrar la suya sin leer un párrafo.
 */
export default function Footer() {
  const { business } = config;
  const anio = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-base-content/10 bg-base-200">
      <Escenario variante="sutil" deslizar={false} />

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="min-w-0 lg:col-span-2">
            <Logo lado={46} />
            <p className="display mt-6 max-w-sm text-2xl leading-tight text-base-content/85">
              {business.tagline}
            </p>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-base-content/50">
              {business.lema}. {business.trayectoria}.
            </p>
          </div>

          {business.sedes.map((sede) => (
            <div key={sede.slug} className="min-w-0">
              <p className="rotulo">{sede.nombre}</p>
              <address className="mt-4 not-italic text-sm leading-relaxed text-base-content/65">
                {sede.zona}
                <br />
                {sede.estado}
                <br />
                Venezuela
              </address>
              <p className="cifra mt-3 text-sm text-base-content/75">{sede.telefono}</p>
              <a
                href={sede.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 inline-block text-sm text-base-content/55 transition-colors hover:text-primary"
              >
                @{sede.instagram}
              </a>
            </div>
          ))}
        </div>

        <div className="mt-12 grid gap-8 border-t border-base-content/10 pt-8 sm:grid-cols-2">
          <div className="min-w-0">
            <p className="rotulo">Inventario</p>
            <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2.5 text-sm">
              <li>
                <Link
                  href="/vehiculos?segmento=auto"
                  className="text-base-content/65 transition-colors hover:text-primary"
                >
                  Vehículos
                </Link>
              </li>
              <li>
                <Link
                  href="/vehiculos?segmento=camion"
                  className="text-base-content/65 transition-colors hover:text-primary"
                >
                  Camiones
                </Link>
              </li>
              <li>
                <Link
                  href="/vehiculos?condicion=nuevo"
                  className="text-base-content/65 transition-colors hover:text-primary"
                >
                  0 km
                </Link>
              </li>
              <li>
                <Link
                  href="/vehiculos?condicion=usado"
                  className="text-base-content/65 transition-colors hover:text-primary"
                >
                  Usados
                </Link>
              </li>
              <li>
                <Link
                  href="/vehiculos"
                  className="text-base-content/65 transition-colors hover:text-primary"
                >
                  Todo el inventario
                </Link>
              </li>
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

          <div className="min-w-0">
            <p className="rotulo">Qué hacemos</p>
            <p className="display mt-4 text-xl leading-tight text-base-content/80">
              {business.arcoLogo}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-base-content/50">
              {business.servicios.join(" · ")}.
            </p>
          </div>
        </div>

        <div className="ala ala-ancha mt-14 opacity-80" aria-hidden="true" />

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
