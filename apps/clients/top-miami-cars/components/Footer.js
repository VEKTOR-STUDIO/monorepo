import Link from "next/link";
import Logo from "@/components/Logo";
import Escenario from "@/components/Escenario";
import config from "@/config";

/**
 * El pie: la marca, el salón, por dónde se contacta y los enlaces legales.
 *
 * La dirección va entera y en su propio bloque, no escondida en una línea de
 * texto: quien llega a la web buscando "dónde están" tiene que encontrarla sin
 * leer un párrafo. Es la de su ficha de Google, tal cual.
 */
export default function Footer() {
  const { business } = config;
  const sede = business.sedes[0];
  const anio = new Date().getFullYear();

  const inventario = [
    { href: "/vehiculos?tipo=suv", texto: "Camionetas" },
    { href: "/vehiculos?tipo=sedan", texto: "Sedanes" },
    { href: "/vehiculos?tipo=pickup", texto: "Pick-ups" },
    { href: "/vehiculos", texto: "Todo el inventario" },
    { href: "/#como-comprar", texto: "Cómo comprar" },
    { href: "/contacto", texto: "Escribir" },
  ];

  return (
    <footer className="relative overflow-hidden border-t border-base-content/10 bg-base-200">
      <Escenario variante="pie" deslizar={false} />

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="min-w-0 lg:col-span-2">
            <Logo alto={64} />
            <p className="display mt-6 max-w-sm text-xl leading-tight text-primary">
              {business.tagline}
            </p>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-base-content/60">
              {business.lema}.
            </p>
          </div>

          <div className="min-w-0">
            <p className="rotulo">El salón</p>
            <address className="mt-4 not-italic text-sm leading-relaxed text-base-content/70">
              {sede.zona}
              <br />
              {business.ciudad} {sede.codigoPostal}, {sede.estado}
              <br />
              Venezuela
            </address>
            <p className="cifra mt-3 text-sm text-base-content/80">{sede.telefono}</p>
            {business.instagram && (
              <a
                href={business.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 inline-block text-sm text-base-content/60 transition-colors hover:text-primary"
              >
                @{business.instagram}
              </a>
            )}
          </div>

          <div className="min-w-0">
            <p className="rotulo">Inventario</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              {inventario.map((enlace) => (
                <li key={enlace.href}>
                  <Link
                    href={enlace.href}
                    className="text-base-content/70 transition-colors hover:text-primary"
                  >
                    {enlace.texto}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-base-content/10 pt-8">
          <p className="rotulo">Qué hacemos</p>
          <p className="mt-3 text-sm leading-relaxed text-base-content/60">
            {business.servicios.join(" · ")}.
          </p>
        </div>

        <div className="filete filete-ancho mt-12" aria-hidden="true" />

        <div className="mt-6 flex flex-col gap-3 text-xs text-base-content/50 sm:flex-row sm:items-center sm:justify-between">
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
