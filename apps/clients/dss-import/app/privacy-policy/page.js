import Link from "next/link";
import { getSEOTags } from "@/libs/seo";
import config from "@/config";

export const metadata = getSEOTags({
  title: `Política de privacidad | ${config.appName}`,
  canonicalUrlRelative: "/privacy-policy",
});

// PENDIENTE: repasar con el cliente cuando se decida a dónde llegan las
// solicitudes del formulario (hoy no se reenvían a ningún sitio). Si algún día
// se decide pedir cédula o documentos por la web —hoy NO se piden, y es
// deliberado—, este texto se queda corto: haría falta decir dónde se guardan,
// cuánto tiempo y quién los ve.
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
            Solo los que escribes tú en la solicitud: nombre, teléfono, qué quieres
            financiar y cuánto puedes pagar. No hay cuentas ni registro.{" "}
            <strong>No pedimos cédula, dirección ni documentos por la web</strong>, y no
            debes enviarlos por este medio: esos se entregan en la oficina, al firmar.
          </p>
        </section>

        <section>
          <h2 className="display text-lg text-base-content">Para qué los usamos</h2>
          <p className="mt-3">
            Únicamente para contestarte y armar el plan de crédito que pediste. No se
            venden ni se ceden a terceros, no se consultan en ningún buró y no se usan
            para mandarte publicidad que no hayas pedido.
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
              className="text-primary hover:underline"
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
