import Link from "next/link";
import { getSEOTags } from "@/libs/seo";
import config from "@/config";

export const metadata = getSEOTags({
  title: `Términos y condiciones | ${config.appName}`,
  canonicalUrlRelative: "/tos",
});

// PENDIENTE: esto es un texto de partida, no un documento revisado por un
// abogado. Antes de publicar el sitio de verdad hay que repasarlo con el
// cliente, sobre todo lo que toca a la importación, al financiamiento y a la
// responsabilidad sobre el estado del vehículo.
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
            Es el escaparate de {config.business.razonSocial}, que importa y vende
            vehículos en {config.business.ciudad}. Aquí se publica lo que hay en el
            local; la venta se cierra en persona o por WhatsApp. La página no cobra,
            no procesa pagos y no retiene dinero de ninguna operación.
          </p>
        </section>

        <section>
          <h2 className="display text-lg text-base-content">2. La información publicada</h2>
          <p className="mt-3">
            Los datos de cada vehículo —año, kilometraje, motor, condición,
            documentos y precio— se publican de buena fe. El precio es referencial y
            puede cambiar sin aviso; la disponibilidad también. Las condiciones de
            financiamiento se acuerdan caso por caso y no forman parte de lo
            publicado aquí. Antes de cerrar cualquier trato, el comprador debe
            verificar el vehículo y sus documentos por su cuenta.
          </p>
        </section>

        <section>
          <h2 className="display text-lg text-base-content">3. Revisión del vehículo</h2>
          <p className="mt-3">
            Recomendamos siempre inspeccionar el vehículo en persona —en{" "}
            {config.business.direccion}, {config.business.ciudad}— y llevarlo a un
            taller de confianza antes de comprar. La inspección es responsabilidad
            del comprador.
          </p>
        </section>

        <section>
          <h2 className="display text-lg text-base-content">4. Contacto</h2>
          <p className="mt-3">
            Por Instagram en{" "}
            <a
              href={config.business.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              @{config.business.instagram}
            </a>
            {config.business.whatsappVisible
              ? ` o por WhatsApp al ${config.business.whatsappVisible}.`
              : " o por WhatsApp."}
          </p>
        </section>

        <section>
          <h2 className="display text-lg text-base-content">5. Ley aplicable</h2>
          <p className="mt-3">
            Estos términos se rigen por las leyes de la República Bolivariana de
            Venezuela.
          </p>
        </section>
      </div>
    </main>
  );
}
