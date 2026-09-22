import Link from "next/link";
import Logo from "@/components/Logo";
import Escenario from "@/components/Escenario";
import Bandera from "@/components/Bandera";
import config from "@/config";

/**
 * El pie: la marca, a dónde mandan, por dónde se contacta y los enlaces
 * legales.
 *
 * Lo que va en grande es el número de WhatsApp, igual que en la banda de abajo
 * de todas sus piezas: en este negocio no hay salón que visitar, todo empieza
 * por un mensaje.
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
            <Logo />
            <p className="display mt-6 max-w-sm text-2xl leading-tight text-base-content/85">
              Tu vehículo, <span className="text-primary">nuestro compromiso</span>
            </p>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-base-content/50">
              {business.lema}. Desde {business.direccion}, con envíos a{" "}
              {business.destinos.map((d) => d.nombre).join(", ")} {business.destinosNota}.
            </p>
          </div>

          <div className="min-w-0">
            <p className="rotulo">Escríbenos</p>
            <p className="cifra mt-4 text-lg font-bold text-base-content">
              {business.whatsappVisible}
            </p>
            <p className="mt-1 text-sm text-base-content/55">Por WhatsApp o por DM</p>
            <a
              href={business.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-block text-sm text-base-content/65 transition-colors hover:text-primary"
            >
              @{business.instagram}
            </a>
          </div>

          <div className="min-w-0">
            <p className="rotulo">Enviamos a</p>
            <ul className="mt-4 space-y-2.5">
              {business.destinos.map((d) => (
                <li key={d.slug} className="flex items-center gap-3 text-sm text-base-content/70">
                  <Bandera codigo={d.bandera} nombre={d.nombre} className="size-5" />
                  {d.nombre}
                </li>
              ))}
              <li className="text-sm text-base-content/45">…{business.destinosNota}</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 grid gap-8 border-t border-base-content/10 pt-8 sm:grid-cols-2">
          <div className="min-w-0">
            <p className="rotulo">Inventario</p>
            <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2.5 text-sm">
              {[
                ["/vehiculos?segmento=subasta", "En subasta"],
                ["/vehiculos?segmento=pedido", "A pedido"],
                ["/vehiculos?tipo=pickup", "Pickups"],
                ["/vehiculos?tipo=suv", "Camionetas"],
                ["/vehiculos", "Todo el inventario"],
                ["/contacto", "Escribir"],
              ].map(([href, texto]) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-base-content/65 transition-colors hover:text-primary"
                  >
                    {texto}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="min-w-0">
            <p className="rotulo">Qué hacemos</p>
            <p className="display mt-4 text-xl leading-tight text-base-content/80">
              {business.lema}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-base-content/50">{business.remate}.</p>
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
