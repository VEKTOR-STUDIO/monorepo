import { NextResponse } from "next/server";
import { esDemo } from "@/libs/demo";

export const dynamic = "force-dynamic";

/**
 * El formulario de contacto.
 *
 * En demo se corta AQUÍ, en el servidor, y no escondiendo el botón: si solo
 * estuviera deshabilitado en pantalla, cualquiera podría llamar a esta ruta a
 * mano y hacerle llegar mensajes falsos al negocio real.
 *
 * PENDIENTE (para el día que se entregue): hoy, fuera de demo, esta ruta acepta
 * el mensaje y responde bien, pero no lo reenvía a ningún sitio —no hay todavía
 * ni número de WhatsApp ni dominio de correo verificado—. Hay que engancharla
 * al canal que elija el cliente antes de apagar el modo demo.
 */
export async function POST(peticion) {
  if (esDemo()) {
    return NextResponse.json(
      {
        error:
          "Esto es una demo: el mensaje no se envía. En la página entregada llega directo al WhatsApp del negocio.",
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
  const mensaje = String(cuerpo.mensaje ?? "").trim();

  if (!nombre || !telefono || !mensaje) {
    return NextResponse.json(
      { error: "Faltan el nombre, el teléfono o el mensaje." },
      { status: 400 }
    );
  }

  console.info("[contacto] mensaje recibido", { nombre, telefono });

  return NextResponse.json({ ok: true });
}
