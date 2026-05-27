import Link from "next/link";
import { getSEOTags } from "@/libs/seo";
import config from "@/config";

// CHATGPT PROMPT TO GENERATE YOUR PRIVACY POLICY — replace with your own data 👇

// 1. Go to https://chat.openai.com/
// 2. Copy paste bellow
// 3. Replace the data with your own (if needed)
// 4. Paste the answer from ChatGPT directly in the <pre> tag below

// You are an excellent lawyer.

// I need your help to write a simple privacy policy for my website. Here is some context:
// - Website: https://tudominio.com
// - Name: (tu marca desde config.js)
// - Description: Micropigmentación y arte facial. Microblading, Baby Lips, Laminado de Cejas.
// - User data collected: name, email, phone and appointment information
// - Non-personal data collection: web cookies
// - Purpose of Data Collection: Appointment booking and service delivery
// - Data sharing: we do not share the data with any other parties
// - Children's Privacy: we do not collect any data from children
// - Updates to the Privacy Policy: users will be updated by email
// - Contact information: contacto@tudominio.com

// Please write a simple privacy policy for my site. Add the current date.  Do not add or explain your reasoning. Answer:

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
        <h1 className="text-3xl font-extrabold pb-6">
          Política de Privacidad de {config.appName}
        </h1>

        <pre
          className="leading-relaxed whitespace-pre-wrap"
          style={{ fontFamily: "sans-serif" }}
        >
          {`Última actualización: ${new Date().toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })}

Gracias por visitar ${config.appName} (${config.siteUrl}). Esta Política de Privacidad describe cómo recopilamos, usamos y protegemos tu información personal y no personal cuando utilizas nuestro sitio web.

Al acceder o utilizar el sitio web, aceptas los términos de esta Política de Privacidad. Si no estás de acuerdo con las prácticas descritas en esta política, por favor no utilices el sitio web.

1. Información que Recopilamos

1.1 Datos Personales

Recopilamos la siguiente información personal:

- Nombre: Para personalizar tu experiencia y comunicarnos contigo de manera efectiva
- Email: Para enviarte información importante sobre tus citas, actualizaciones y comunicaciones
- Teléfono (opcional): Para mejorar la comunicación respecto a tu cita
- Empresa (opcional): Para contextualizar tu cita si aplica
- Información de pago: Para procesar tus pagos de forma segura. No almacenamos tu información de pago en nuestros servidores. Los pagos son procesados por procesadores de pago confiables de terceros (Stripe)

1.2 Datos No Personales

Podemos usar cookies web y tecnologías similares para recopilar información no personal como tu dirección IP, tipo de navegador, información del dispositivo y patrones de navegación. Esta información nos ayuda a mejorar tu experiencia de navegación, analizar tendencias y mejorar nuestros servicios.

2. Propósito de la Recopilación de Datos

Recopilamos y usamos tus datos personales para los siguientes propósitos:

- Procesar tus agendamientos de consultoría
- Enviar confirmaciones de citas y recordatorios
- Proporcionar soporte al cliente
- Mantenerte informado sobre el estado de tus citas
- Mejorar nuestros servicios de micropigmentación y arte facial
- Personalizar tu experiencia en el sitio

3. Sistema de Gestión de Citas

Al agendar una cita:
- Almacenamos tu información de cita en una base de datos segura (Supabase)
- Solo tú y los administradores pueden ver tus citas
- Implementamos Row Level Security (RLS) para proteger tus datos
- Puedes cancelar tus citas en cualquier momento desde tu dashboard
- Recibirás notificaciones por email sobre el estado de tu cita

4. Compartición de Datos

No compartimos tus datos personales con terceros, excepto cuando sea necesario para:
- Procesar pagos (compartir información con procesadores de pago como Stripe)
- Cumplir con requisitos legales

No vendemos, intercambiamos ni alquilamos tu información personal a otros.

5. Seguridad de Datos

Implementamos múltiples capas de seguridad:
- Row Level Security (RLS) en la base de datos
- Autenticación segura con Supabase
- Cifrado de datos en tránsito y en reposo
- Acceso restringido solo a usuarios autorizados

6. Privacidad de Menores

El sitio de ${config.appName} no está dirigido a menores de 13 años. No recopilamos intencionalmente información personal de niños. Si eres padre o tutor y crees que tu hijo nos ha proporcionado información personal, contáctanos al email proporcionado a continuación.

7. Tus Derechos

Tienes derecho a:
- Acceder a tus datos personales
- Corregir información inexacta
- Solicitar la eliminación de tus datos
- Cancelar citas agendadas
- Exportar tus datos

8. Cookies

Utilizamos cookies para:
- Mantener tu sesión activa
- Mejorar la experiencia del usuario
- Analizar el uso del sitio web
- Recordar tus preferencias

Puedes desactivar las cookies en tu navegador, aunque esto puede afectar la funcionalidad del sitio.

9. Actualizaciones de la Política de Privacidad

Podemos actualizar esta Política de Privacidad ocasionalmente para reflejar cambios en nuestras prácticas o por razones operativas, legales o regulatorias. Las actualizaciones se publicarán en esta página y te notificaremos por email sobre cambios significativos.

10. Información de Contacto

Si tienes preguntas, inquietudes o solicitudes relacionadas con esta Política de Privacidad, puedes contactarnos en:

Email: ${config.resend.supportEmail}

Para todas las demás consultas, visita el sitio web o nuestras redes.

Al usar el sitio de ${config.appName}, consientes los términos de esta Política de Privacidad.

---

${config.appName} — Plantilla de micropigmentación y belleza. Personaliza este texto con tu marca.`}
        </pre>
      </div>
    </main>
  );
};

export default PrivacyPolicy;
