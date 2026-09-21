import Link from "next/link";
import Logo from "@/components/Logo";
import Alas from "@/components/Alas";
import config from "@/config";

/**
 * El pie: la marca, las dos sedes, por dónde se contacta y los enlaces
 * legales.
 *
 * Las sedes van cada una con su cuenta de Instagram y no refundidas en una
 * línea de texto. Es el mismo motivo que en la portada: La Florida y Chacao
 * publican por separado, y un comprador que escribe a la cuenta equivocada
 * acaba rebotando entre las dos.
 *
 * El WhatsApp corporativo sale entero porque ellos lo publican entero en su
 * bio y en su comunicado. Aquí esconderlo no protegería nada.
 */
export default function Footer() {
  const { business } = config;
  const anio = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-base-content/10 bg-base-200">
      <Alas variante="sutil" deslizar={false} />

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <Logo alto={30} />
            <p className="display mt-6 max-w-sm text-2xl leading-tight text-base-content/85">
              {business.tagline}
            </p>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-base-content/50">
              {business.lema}. {business.procedencias.join(" · ")}.
            </p>
          </div>

          <div>
            <p className="rotulo">Las sedes</p>
            <ul className="mt-4 space-y-5">
              {business.sedes.map((sede) => (
                <li key={sede.slug}>
                  <p className="display-recto text-sm text-base-content/85">{sede.corto}</p>
                  <address className="mt-1.5 not-italic text-sm leading-relaxed text-base-content/55">
                    {sede.direccion}
                    <br />
                    {sede.ciudad}
                  </address>
                  <a
                    href={sede.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cifra mt-1.5 inline-block text-xs text-base-content/55 transition-colors hover:text-base-content"
                  >
                    @{sede.instagram}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="rotulo">Inventario</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link
                  href="/vehiculos?entrega=showroom"
                  className="text-base-content/65 transition-colors hover:text-base-content"
                >
                  En showroom
                </Link>
              </li>
              <li>
                <Link
                  href="/vehiculos?entrega=encargo"
                  className="text-base-content/65 transition-colors hover:text-base-content"
                >
                  Importación a pedido
                </Link>
              </li>
              <li>
                <Link
                  href="/vehiculos"
                  className="text-base-content/65 transition-colors hover:text-base-content"
                >
                  Todo el inventario
                </Link>
              </li>
              <li>
                <Link
                  href="/#canales-oficiales"
                  className="text-base-content/65 transition-colors hover:text-base-content"
                >
                  Canales oficiales
                </Link>
              </li>
              {business.whatsappVisible && (
                <li className="cifra text-base-content/65">{business.whatsappVisible}</li>
              )}
              <li>
                <Link
                  href="/contacto"
                  className="text-base-content/65 transition-colors hover:text-base-content"
                >
                  Escribir
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="banda banda-ancha mt-14" aria-hidden="true" />

        <div className="mt-6 flex flex-col gap-3 text-xs text-base-content/40 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {anio} {business.razonSocial}
          </p>
          <div className="flex gap-5">
            <Link href="/tos" className="transition-colors hover:text-base-content">
              Términos
            </Link>
            <Link href="/privacy-policy" className="transition-colors hover:text-base-content">
              Privacidad
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
