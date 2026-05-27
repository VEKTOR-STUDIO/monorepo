import Link from "next/link";
import { getSEOTags } from "@/libs/seo";
import config from "@/config";

export const metadata = getSEOTags({
  title: `Privacy Policy | ${config.appName}`,
  canonicalUrlRelative: "/privacy-policy",
});

const PrivacyPolicy = () => {
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
          </svg>{" "}
          Back
        </Link>
        <h1 className="text-3xl font-extrabold pb-6">Política de Privacidad de {config.appName}</h1>

        <pre className="leading-relaxed whitespace-pre-wrap" style={{ fontFamily: "sans-serif" }}>
          {`Última actualización: ${new Date().toLocaleDateString("es-MX", { year: "numeric", month: "long", day: "numeric" })}

Plantilla deportiva. ${config.appName} (${config.domainName}) — texto de reemplazo.

1. Datos que podemos recopilar

Nombre, email, datos de aplicación a programas deportivos y autenticación según configures Supabase y políticas RLS.

2. Finalidad

Prestar el servicio, soporte (${config.resend.supportEmail}) y mejoras del producto.

3. Cookies y sesión

Uso de cookies/sesión según implementación (Supabase Auth, preferencias).

4. Menores

Placeholder: ajusta edad mínima y política según tu mercado.

5. Cambios

Podrás publicar actualizaciones en esta página.

6. Contacto

${config.resend.supportEmail}

Desarrollo: WADOOM (crédito de plantilla).`}
        </pre>
      </div>
    </main>
  );
};

export default PrivacyPolicy;
