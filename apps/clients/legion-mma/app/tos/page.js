import Link from "next/link";
import { getSEOTags } from "@/libs/seo";
import config from "@/config";

// CHATGPT PROMPT TO GENERATE YOUR TERMS & SERVICES — replace with your own data 👇

// 1. Go to https://chat.openai.com/
// 2. Copy paste bellow
// 3. Replace the data with your own (if needed)
// 4. Paste the answer from ChatGPT directly in the <pre> tag below

// You are an excellent lawyer.

// I need your help to write a simple Terms & Services for my website. Here is some context:
// - Website: https://tudominio.com
// - Name: (desde config.js)
// - Contact information: contacto@tudominio.com
// - Description: Micropigmentación y arte facial. Microblading, Baby Lips, Laminado de Cejas.
// - User data collected: name, email, phone and appointment information
// - Non-personal data collection: web cookies
// - Link to privacy-policy: https://tudominio.com/privacy-policy
// - Governing Law: Venezuela / México
// - Updates to the Terms: users will be updated by email

// Please write a simple Terms & Services for my site. Add the current date. Do not add or explain your reasoning. Answer:

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
        <h1 className="text-3xl font-extrabold pb-6">
          Términos y Condiciones de {config.appName}
        </h1>

        <pre
          className="leading-relaxed whitespace-pre-wrap"
          style={{ fontFamily: "sans-serif" }}
        >
          {`Última actualización: ${new Date().toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })}

¡Bienvenido a ${config.appName}!

Estos Términos y Condiciones ("Términos") rigen el uso del sitio web de ${config.appName} (${config.siteUrl}) y los servicios de micropigmentación y arte facial descritos en esta plantilla. Al utilizar nuestro sitio web y servicios, aceptas estos Términos.

1. Sobre ${config.appName}

${config.appName} es una plantilla de estudio de belleza / PMU: sustituye este párrafo por la descripción legal y comercial de tu negocio.

2. Servicios Ofrecidos

- Sesiones de micropigmentación (microblading, Baby Lips, laminado de cejas, etc.)
- Diseño de cejas y arte facial personalizado
- Consulta y asesoría previa a la cita
- Seguimiento y retoques según el servicio

3. Política de Reembolso

Las políticas de cancelación y reembolso se comunican al agendar. Las citas pueden cancelarse desde tu panel según lo indicado.

4. Agendamiento de Citas

Al agendar una cita:
- Las citas requieren confirmación por parte del equipo
- Recibirás recordatorios por email
- Puedes cancelar o modificar tu cita desde tu dashboard cuando esté disponible

5. Privacidad y Datos de Usuario

Recopilamos y almacenamos datos de usuario (nombre, email, teléfono, datos de cita) según sea necesario para prestar nuestros servicios. Para más detalles, consulta nuestra Política de Privacidad.

6. Uso de Cookies

Utilizamos cookies web para mejorar la experiencia del usuario y el funcionamiento del sitio.

7. Jurisdicción

Estos Términos se rigen por las leyes aplicables en Venezuela/México, según corresponda.

8. Actualizaciones de los Términos

Podemos actualizar estos Términos ocasionalmente. Los usuarios serán notificados de cambios relevantes por email.

9. Contacto

Para cualquier pregunta sobre estos Términos:
Email: ${config.resend.supportEmail}

¡Gracias por usar ${config.appName}!`}
        </pre>
      </div>
    </main>
  );
};

export default TOS;
