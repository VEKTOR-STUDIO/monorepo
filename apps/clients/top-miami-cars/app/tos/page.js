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

      <h1 className="display mt-8 text-2xl text-primary sm:text-3xl">Términos y condiciones</h1>
      <p className="mt-2 text-sm text-base-content/50">Última actualización: {hoy}</p>

      <div className="mt-10 space-y-8 leading-relaxed text-base-content/75">
        <section>
          <h2 className="display text-base text-base-content">1. Qué es este sitio</h2>
          <p className="mt-3">
            Es el escaparate de {config.business.razonSocial}, concesionario de
            vehículos usados en {config.business.direccion}. Aquí se publica lo que hay en
            el salón; la venta se cierra en persona o por WhatsApp. La página no cobra,
            no procesa pagos y no retiene dinero de ninguna operación.
          </p>
        </section>

        <section>
          <h2 className="display text-base text-base-content">2. La información publicada</h2>
          <p className="mt-3">
            Los datos de cada unidad —año, kilometraje, motor, condición, documentos y
            precio— se publican de buena fe. El precio es referencial y puede cambiar
            sin aviso; la disponibilidad también. Las condiciones de pago o de parte de
            pago se acuerdan caso por caso y no forman parte de lo publicado aquí. Antes
            de cerrar cualquier trato, el comprador debe verificar la unidad y sus
            documentos por su cuenta.
          </p>
        </section>

        <section>
          <h2 className="display text-base text-base-content">3. Revisión del vehículo</h2>
          <p className="mt-3">
            Recomendamos siempre inspeccionar la unidad en persona —en{" "}
            {config.business.sedes[0].direccion}— y llevarla a un taller de confianza
            antes de comprar. La inspección es responsabilidad del comprador.
          </p>
        </section>

        <section>
          <h2 className="display text-base text-base-content">4. Contacto</h2>
          <p className="mt-3">
            {config.business.direccionLarga} · Teléfono y WhatsApp:{" "}
            <span className="font-semibold text-base-content">
              {config.business.telefonoInternacional}
            </span>
          </p>
        </section>

        <section>
          <h2 className="display text-base text-base-content">5. Ley aplicable</h2>
          <p className="mt-3">
            Estos términos se rigen por las leyes de la República Bolivariana de
            Venezuela.
          </p>
        </section>
      </div>
    </main>
  );
}
