import Link from "next/link";
import Logo from "@/components/Logo";
import Escenario from "@/components/Escenario";
import config from "@/config";

/**
 * El pie: la marca, la oficina, por dónde se contacta y los enlaces legales.
 *
 * La oficina va en su propio bloque y no escondida en una línea de texto,
 * porque en un negocio de crédito la dirección física ES el argumento: ellos
 * mismos la publican como una de sus tres razones ("contamos con oficina
 * física"). Quien está decidiendo si entregarle una inicial a alguien quiere
 * saber dónde está ese alguien.
 */
export default function Footer() {
  const { business, credito } = config;
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
              {business.lema}. {business.trayectoria}, con cuotas que se adaptan a tu
              presupuesto.
            </p>
          </div>

          <div className="min-w-0">
            <p className="rotulo">La oficina</p>
            <address className="mt-4 not-italic text-sm leading-relaxed text-base-content/65">
              {business.ciudad}
              <br />
              Estado {business.estado}
              <br />
              Venezuela
            </address>
            {business.whatsappVisible && (
              <p className="cifra mt-3 text-sm text-base-content/75">
                {business.whatsappVisible}
              </p>
            )}
            <a
              href={business.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-block text-sm text-base-content/55 transition-colors hover:text-primary"
            >
              @{business.instagram}
            </a>
          </div>

          <div className="min-w-0">
            <p className="rotulo">El plan</p>
            <dl className="mt-4 space-y-2.5 text-sm">
              <div className="flex items-baseline justify-between gap-3">
                <dt className="text-base-content/50">Plazo</dt>
                <dd className="cifra text-base-content/80">{credito.plazoTexto}</dd>
              </div>
              <div className="flex items-baseline justify-between gap-3">
                <dt className="text-base-content/50">Inicial</dt>
                <dd className="cifra text-base-content/80">{credito.inicialPct} %</dd>
              </div>
              <div className="flex items-baseline justify-between gap-3">
                <dt className="text-base-content/50">Cuota desde</dt>
                <dd className="cifra text-primary">
                  ${credito.cuotaDesde} {credito.cuotaDesdePeriodo}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="mt-12 grid gap-8 border-t border-base-content/10 pt-8 sm:grid-cols-2">
          <div className="min-w-0">
            <p className="rotulo">Catálogo</p>
            <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2.5 text-sm">
              <li>
                <Link
                  href="/catalogo?segmento=auto"
                  className="text-base-content/65 transition-colors hover:text-primary"
                >
                  Vehículos
                </Link>
              </li>
              <li>
                <Link
                  href="/catalogo?segmento=moto"
                  className="text-base-content/65 transition-colors hover:text-primary"
                >
                  Motos
                </Link>
              </li>
              <li>
                <Link
                  href="/catalogo?condicion=nuevo"
                  className="text-base-content/65 transition-colors hover:text-primary"
                >
                  0 km
                </Link>
              </li>
              <li>
                <Link
                  href="/catalogo?condicion=usado"
                  className="text-base-content/65 transition-colors hover:text-primary"
                >
                  Usados
                </Link>
              </li>
              <li>
                <Link
                  href="/catalogo"
                  className="text-base-content/65 transition-colors hover:text-primary"
                >
                  Todo el catálogo
                </Link>
              </li>
              <li>
                <Link
                  href="/contacto"
                  className="text-base-content/65 transition-colors hover:text-primary"
                >
                  Solicitar crédito
                </Link>
              </li>
            </ul>
          </div>

          <div className="min-w-0">
            <p className="rotulo">Qué hacemos</p>
            <p className="display mt-4 text-xl leading-tight text-base-content/80">
              {business.lema}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-base-content/50">
              {business.servicios.join(" · ")}.
            </p>
          </div>
        </div>

        <div className="filete filete-ancho mt-14 opacity-80" aria-hidden="true" />

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
