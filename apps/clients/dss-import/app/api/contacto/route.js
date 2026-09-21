import { NextResponse } from "next/server";
import { esDemo } from "@/libs/demo";

export const dynamic = "force-dynamic";

/**
 * La solicitud de crédito.
 *
 * En demo se corta AQUÍ, en el servidor, y no escondiendo el botón: si solo
 * estuviera deshabilitado en pantalla, cualquiera podría llamar a esta ruta a
 * mano y hacerle llegar solicitudes falsas al negocio real. Y en este negocio
 * eso no es una molestia menor: cada solicitud que entra es alguien a quien hay
 * que llamar.
 *
 * PENDIENTE (para el día que se entregue): hoy, fuera de demo, esta ruta acepta
 * la solicitud y responde bien, pero no la reenvía a ningún sitio —no hay
 * todavía dominio de correo verificado ni el WhatsApp de la empresa—. Hay que
 * engancharla al canal que elija el cliente (Resend, o su WhatsApp) antes de
 * apagar el modo demo. Ver el PENDIENTE de config.js.
 *
 * Nota sobre lo que NO llega aquí: el formulario no pide cédula ni documentos a
 * propósito (ver components/FormularioContacto.js). Si algún día se añaden, esta
 * ruta necesita antes un sitio donde guardarlos y una política de retención;
 * hoy solo escribe una línea en el registro del servidor.
 */
export async function POST(peticion) {
  if (esDemo()) {
    return NextResponse.json(
      {
        error:
          "Esto es una demo: la solicitud no se envía a ningún sitio. En la página entregada llega directo al canal del negocio con el plan que pediste ya escrito.",
      },
      { status: 403 }
    );
  }

  let cuerpo;
  try {
    cuerpo = await peticion.json();
  } catch {
    return NextResponse.json({ error: "Petición mal formada." }, { status: 400 });
  }

  const nombre = String(cuerpo.nombre ?? "").trim();
  const telefono = String(cuerpo.telefono ?? "").trim();
  const interes = String(cuerpo.interes ?? "").trim();
  const cuota = String(cuerpo.cuota ?? "").trim();
  const periodo = String(cuerpo.periodo ?? "semanal").trim();
  const mensaje = String(cuerpo.mensaje ?? "").trim();

  if (!nombre || !telefono || !interes || !cuota) {
    return NextResponse.json(
      { error: "Faltan el nombre, el teléfono, qué buscas o cuánto puedes pagar." },
      { status: 400 }
    );
  }

  // El teléfono no se escribe en el registro: es el único dato personal de
  // verdad que entra por aquí y un registro de servidor no es sitio para él.
  console.info("[solicitud] recibida", { interes, cuota, periodo, conMensaje: Boolean(mensaje) });

  return NextResponse.json({ ok: true });
}
