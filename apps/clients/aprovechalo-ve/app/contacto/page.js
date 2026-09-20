import { Suspense } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BloqueVenta from "@/components/demo/BloqueVenta";
import Revelar from "@/components/Revelar";
import ComoComprar from "@/components/ComoComprar";
import { getSEOTags } from "@/libs/seo";
import config from "@/config";

const { business } = config;

export const metadata = getSEOTags({
  title: "Contacto y cómo comprar · Hardcore",
  description: `Hardcore en ${business.direccion}, ${business.ciudad}. Pedidos por WhatsApp, retiro en tienda, delivery en Caracas y envío nacional.`,
  canonicalUrlRelative: "/contacto",
});

export default function Contacto() {
  return (
    <>
      <Suspense>
        <Header />
      </Suspense>

      <main>
        <section className="relative overflow-hidden">
          <div className="humo absolute inset-0" aria-hidden="true" />

          <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6">
            <Revelar>
              <p className="rotulo">Estamos aquí</p>
              <h1 className="display mt-4 text-4xl sm:text-5xl">HABLEMOS</h1>
              <p className="mt-5 max-w-lg text-lg text-base-content/60">
                Lo más rápido es WhatsApp. Si prefieres, pásate por la tienda.
              </p>
            </Revelar>

            <div className="mt-12 grid gap-4 md:grid-cols-3">
              <Revelar>
                <a
                  href={`https://wa.me/${business.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ficha group block h-full p-6"
                >
                  <p className="rotulo">WhatsApp</p>
                  <p className="cifra mt-3 text-xl font-bold transition-colors group-hover:text-primary">
                    {business.whatsappVisible}
                  </p>
                  <p className="mt-2 text-sm text-base-content/55">{business.horario}</p>
                </a>
              </Revelar>

              <Revelar retraso={70}>
                <div className="ficha h-full p-6">
                  <p className="rotulo">La tienda</p>
                  <p className="mt-3 text-lg font-semibold">{business.direccion}</p>
                  <p className="mt-1 text-sm text-base-content/55">{business.ciudad}</p>
                  <a
                    href="https://maps.google.com/?q=Centro+Lido+El+Rosal+Caracas"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-block text-sm text-primary underline-offset-4 hover:underline"
                  >
                    Ver en el mapa
                  </a>
                </div>
              </Revelar>

              <Revelar retraso={140}>
                <div className="ficha h-full p-6">
                  <p className="rotulo">También estamos en</p>
                  <ul className="mt-3 space-y-2.5 text-sm">
                    <li>
                      <a
                        href={business.instagramUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="transition-colors hover:text-primary"
                      >
                        Instagram · @{business.instagram}
                      </a>
                    </li>
                    <li>
                      <a
                        href={business.mercadoLibre}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="transition-colors hover:text-primary"
                      >
                        Mercado Libre · Tienda oficial
                      </a>
                    </li>
                    <li>
                      <a
                        href={business.linktree}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="transition-colors hover:text-primary"
                      >
                        Todos nuestros enlaces
                      </a>
                    </li>
                  </ul>
                </div>
              </Revelar>
            </div>
          </div>
        </section>

        <ComoComprar />

        <section className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
          <Revelar>
            <p className="rotulo">Dudas frecuentes</p>
            <h2 className="display mt-3 text-3xl">LO QUE SIEMPRE PREGUNTAN</h2>
          </Revelar>

          <div className="mt-8 space-y-3">
            {PREGUNTAS.map((pregunta, i) => (
              <Revelar key={pregunta.titulo} retraso={i * 50}>
                <details className="ficha group px-5 py-4">
                  <summary className="cursor-pointer list-none text-sm font-medium marker:hidden">
                    <span className="flex items-center justify-between gap-4">
                      {pregunta.titulo}
                      <span
                        className="shrink-0 text-primary transition-transform group-open:rotate-45"
                        aria-hidden="true"
                      >
                        +
                      </span>
                    </span>
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-base-content/60">
                    {pregunta.respuesta}
                  </p>
                </details>
              </Revelar>
            ))}
          </div>

          <Revelar retraso={200}>
            <div className="mt-10 text-center">
              <Link href="/tienda" className="btn btn-primary">
                Ir al catálogo
              </Link>
            </div>
          </Revelar>
        </section>
      </main>

      <BloqueVenta />
      <Footer />
    </>
  );
}

const PREGUNTAS = [
  {
    titulo: "¿Por qué hay tres precios distintos?",
    respuesta:
      "Porque el precio depende de cómo pagues: contado en divisas es el más bajo, y transferencia en bolívares y Pago Móvil se cobran a la tasa del BCV del día. En cada producto ves los tres.",
  },
  {
    titulo: "¿Qué significa que un producto esté «en tránsito»?",
    respuesta:
      "Que viene en camino pero todavía no está en la tienda. Se puede reservar: al confirmar el pedido te decimos por WhatsApp la fecha estimada de llegada.",
  },
  {
    titulo: "¿La tasa BCV que muestran es la de hoy?",
    respuesta:
      "Sí. La tienda consulta la tasa oficial del día y la muestra junto a cada precio con su fecha. Al cerrar el pedido se confirma el monto exacto en bolívares.",
  },
  {
    titulo: "¿Hacen envíos fuera de Caracas?",
    respuesta:
      "Sí, por encomienda a todo el país. El costo del envío se cotiza aparte por WhatsApp según el destino y el peso del pedido.",
  },
  {
    titulo: "¿Tengo que crear una cuenta para comprar?",
    respuesta:
      "No. Armas el carrito, confirmas y se abre WhatsApp con el resumen. La cuenta solo sirve para tener el historial de tus pedidos.",
  },
  {
    titulo: "¿Los precios del catálogo están siempre al día?",
    respuesta:
      "Se actualizan cada vez que sale una lista nueva. Cada ficha muestra la disponibilidad real; si algo cambió, te lo decimos al confirmar.",
  },
];
