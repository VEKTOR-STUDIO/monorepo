import Link from "next/link";
import { getSEOTags } from "@/libs/seo";
import config from "@/config";

export const metadata = getSEOTags({
  title: `Terms and Conditions | ${config.appName}`,
  canonicalUrlRelative: "/tos",
});

const TOS = () => {
  return (
    <main className="max-w-xl mx-auto">
      <div className="p-5">
        <Link href="/" className="btn btn-ghost">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-5 h-5"
          >
            <path
              fillRule="evenodd"
              d="M15 10a.75.75 0 01-.75.75H7.612l2.158 1.96a.75.75 0 11-1.04 1.08l-3.5-3.25a.75.75 0 010-1.08l3.5-3.25a.75.75 0 111.04 1.08L7.612 9.25h6.638A.75.75 0 0115 10z"
              clipRule="evenodd"
            />
          </svg>
          Back
        </Link>
        <h1 className="text-3xl font-extrabold pb-6">Términos y Condiciones de {config.appName}</h1>

        <pre className="leading-relaxed whitespace-pre-wrap" style={{ fontFamily: "sans-serif" }}>
          {`Última actualización: ${new Date().toLocaleDateString("es-MX", { year: "numeric", month: "long", day: "numeric" })}

Plantilla deportiva / VOD. Sustituye por tus términos legales reales.

1. Aceptación

Al usar ${config.appName} (${config.domainName}) aceptas estos términos de demostración.

2. Servicios

Contenido de entrenamiento, video bajo demanda e información deportiva de ejemplo. No constituye asesoramiento médico.

3. Datos y privacidad

Consulta la Política de Privacidad. Datos de contacto: ${config.resend.supportEmail}.

4. Ley aplicable

Placeholder — define jurisdicción en tu despliegue.

5. Contacto

${config.resend.supportEmail}`}
        </pre>
      </div>
    </main>
  );
};

export default TOS;
