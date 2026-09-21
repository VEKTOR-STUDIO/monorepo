import Link from "next/link";
import { getSEOTags } from "@/libs/seo";
import config from "@/config";

export const metadata = getSEOTags({
  title: `Política de privacidad | ${config.appName}`,
  canonicalUrlRelative: "/privacy-policy",
});

// PENDIENTE: repasar con el cliente cuando se decida a dónde llegan los
// mensajes del formulario (hoy no se reenvían a ningún sitio).
export default function Privacidad() {
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

      <h1 className="display mt-8 text-3xl">Política de privacidad</h1>
      <p className="mt-2 text-sm text-base-content/50">Última actualización: {hoy}</p>

      <div className="mt-10 space-y-8 leading-relaxed text-base-content/75">
        <section>
          <h2 className="display text-lg text-base-content">Qué datos recogemos</h2>
          <p className="mt-3">
            Solo los que escribes tú en el formulario de contacto: nombre,
            teléfono y el mensaje. No hay cuentas, no hay registro y no se pide
            ningún dato más.
          </p>
        </section>

        <section>
          <h2 className="display text-lg text-base-content">Para qué los usamos</h2>
          <p className="mt-3">
            Únicamente para responderte sobre la unidad por la que preguntas o para
            cotizarte una importación. No se venden ni se ceden a terceros, y no se usan
            para mandarte publicidad que no hayas pedido.
          </p>
        </section>

        <section>
          <h2 className="display text-lg text-base-content">Lo que nunca te vamos a pedir</h2>
          <p className="mt-3">
            No pedimos códigos de confirmación, contraseñas ni datos bancarios por este
            formulario, ni por ningún otro canal. Si alguien te los pide a nombre de{" "}
            {config.business.nombre}, no somos nosotros: verifícalo en la lista de
            canales oficiales de la portada antes de responder.
          </p>
        </section>

        <section>
          <h2 className="display text-lg text-base-content">Cookies</h2>
          <p className="mt-3">
            El sitio no usa cookies de publicidad ni de seguimiento. Mientras la
            página esté en modo demostración, guarda una única cookie técnica
            para recordar que ya pasaste la pantalla de acceso.
          </p>
        </section>

        <section>
          <h2 className="display text-lg text-base-content">Tus derechos</h2>
          <p className="mt-3">
            Puedes pedirnos que borremos tus datos cuando quieras, escribiendo a{" "}
            <a
              href={config.business.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-base-content underline-offset-4 hover:underline"
            >
              @{config.business.instagram}
            </a>
            .
          </p>
        </section>
      </div>
    </main>
  );
}
