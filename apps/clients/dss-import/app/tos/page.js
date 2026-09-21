import Link from "next/link";
import { getSEOTags } from "@/libs/seo";
import config from "@/config";

export const metadata = getSEOTags({
  title: `Términos y condiciones | ${config.appName}`,
  canonicalUrlRelative: "/tos",
});

// PENDIENTE, Y AQUÍ MÁS QUE EN OTROS CLIENTES: esto es un texto de partida, no
// un documento revisado por un abogado.
//
// DSS no vende vehículos: otorga CRÉDITO, y el crédito al consumo en Venezuela
// está regulado. Un texto de plantilla copiado de un concesionario no sirve, y
// publicar condiciones financieras mal redactadas puede comprometer al negocio.
// Antes de apagar el modo demo hay que repasar con el cliente, como mínimo:
//
//   · si las cuotas publicadas llevan intereses, gastos o seguro, y cómo se
//     expresan (la web hoy dice explícitamente que son estimaciones);
//   · qué pasa con la inicial si el crédito no se aprueba o el cliente desiste;
//   · a nombre de quién queda la unidad durante el pago y cuándo se traspasa;
//   · qué ocurre ante el atraso o el incumplimiento de las cuotas;
//   · el tratamiento de los datos personales que se entregan en la oficina.
//
// Hasta que eso esté revisado, este texto dice lo que la página hace y poco
// más, que es lo único que se puede afirmar sin riesgo.
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
            Es el catálogo de {config.business.razonSocial}, que ofrece planes de crédito
            para la adquisición de vehículos y motos en {config.business.ciudad}, estado{" "}
            {config.business.estado}. Aquí se publica lo que se puede financiar; toda
            solicitud se evalúa y se firma en la oficina. La página no cobra, no procesa
            pagos, no aprueba créditos y no retiene dinero de ninguna operación.
          </p>
        </section>

        <section>
          <h2 className="display text-lg text-base-content">
            2. Las cuotas publicadas son referenciales
          </h2>
          <p className="mt-3">
            Las cuotas, iniciales y plazos que aparecen en el catálogo y en el simulador
            son <strong>estimaciones orientativas</strong>, calculadas repartiendo el
            monto pendiente entre los pagos del plazo. No incluyen intereses, gastos
            administrativos, seguros ni ningún otro concepto, y no constituyen una oferta
            de crédito ni una aprobación. La cuota definitiva, sus condiciones y su costo
            total se informan por escrito en la oficina antes de firmar.
          </p>
        </section>

        <section>
          <h2 className="display text-lg text-base-content">3. Disponibilidad y datos</h2>
          <p className="mt-3">
            Los datos de cada unidad —año, kilometraje, motor, condición y documentos— se
            publican de buena fe y pueden cambiar sin aviso, igual que la disponibilidad.
            Antes de firmar, quien solicita el crédito debe verificar la unidad y sus
            documentos por su cuenta, e inspeccionarla en persona o llevarla a un taller
            de confianza.
          </p>
        </section>

        <section>
          <h2 className="display text-lg text-base-content">4. La solicitud</h2>
          <p className="mt-3">
            El formulario de este sitio solo sirve para iniciar una conversación: recoge
            tu nombre, un teléfono, qué buscas y cuánto puedes pagar. No se piden por aquí
            cédula, dirección ni documentos, y no debes enviarlos por este medio. Enviar
            una solicitud no genera ningún compromiso para ninguna de las dos partes.
          </p>
        </section>

        <section>
          <h2 className="display text-lg text-base-content">5. Contacto</h2>
          <p className="mt-3">
            <span className="font-semibold text-base-content">
              {config.business.nombre}
            </span>
            , {config.business.ciudad}, estado {config.business.estado} ·{" "}
            <a
              href={config.business.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              @{config.business.instagram}
            </a>
            {config.business.whatsappVisible && <> · {config.business.whatsappVisible}</>}
          </p>
        </section>

        <section>
          <h2 className="display text-lg text-base-content">6. Ley aplicable</h2>
          <p className="mt-3">
            Estos términos se rigen por las leyes de la República Bolivariana de
            Venezuela.
          </p>
        </section>
      </div>
    </main>
  );
}
