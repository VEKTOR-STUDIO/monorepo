import Link from "next/link";
import { getSEOTags } from "@/libs/seo";
import config from "@/config";

export const metadata = getSEOTags({
  title: `Términos y condiciones | ${config.appName}`,
  canonicalUrlRelative: "/tos",
});

// PENDIENTE: esto es un texto de partida, no un documento revisado por un
// abogado. Antes de publicar el sitio de verdad hay que repasarlo con el
// cliente, sobre todo lo que toca a la consignación, a la compra de vehículos
// usados y a la responsabilidad sobre el estado de la unidad.
export default function Terminos() {
  const hoy = new Date().toLocaleDateString("es-VE", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <main className="mx-auto max-w-2xl px-5 py-12">
      <Link href="/" className="btn btn-filo btn-sm">
        ← Volver
      </Link>

      <h1 className="display mt-8 text-3xl">Términos y condiciones</h1>
      <p className="mt-2 text-sm text-base-content/50">Última actualización: {hoy}</p>

      <div className="mt-10 space-y-8 leading-relaxed text-base-content/75">
        <section>
          <h2 className="display text-lg text-base-content">1. Qué es este sitio</h2>
          <p className="mt-3">
            Es el escaparate de {config.business.razonSocial}, que compra vehículos en subastas de
            Estados Unidos por encargo de sus clientes, los repara y los exporta a{" "}
            {config.business.destinos.map((d) => d.nombre).join(", ")}{" "}
            {config.business.destinosNota}. Aquí se publican lotes y modelos de referencia; cada
            operación se acuerda por WhatsApp. La página no cobra, no procesa pagos y no retiene
            dinero de ninguna operación.
          </p>
        </section>

        <section>
          <h2 className="display text-lg text-base-content">2. La información publicada</h2>
          <p className="mt-3">
            Los datos de cada lote —año, millaje, motor, daño primario y condición— se transcriben
            del reporte de la subasta y se publican de buena fe. La puja estimada y el precio desde
            son referenciales: el precio final depende de la subasta, de la reparación y del envío a
            cada país, y se confirma caso por caso. La disponibilidad de un lote termina cuando
            cierra su subasta.
          </p>
        </section>

        <section>
          <h2 className="display text-lg text-base-content">3. Pagos</h2>
          <p className="mt-3">
            {config.business.pagos.nota} Los métodos aceptados son{" "}
            {config.business.pagos.metodos.map((m) => m.nombre).join(", ")}; los detalles de cada
            operación se acuerdan directamente con el equipo.
          </p>
        </section>

        <section>
          <h2 className="display text-lg text-base-content">4. Contacto</h2>
          <p className="mt-3">
            WhatsApp {config.business.whatsappVisible} ·{" "}
            <a
              href={config.business.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              @{config.business.instagram}
            </a>
          </p>
        </section>

        <section>
          <h2 className="display text-lg text-base-content">5. Ley aplicable</h2>
          <p className="mt-3">
            Estos términos se rigen por las leyes del estado de Texas, Estados Unidos.
          </p>
        </section>
      </div>
    </main>
  );
}
