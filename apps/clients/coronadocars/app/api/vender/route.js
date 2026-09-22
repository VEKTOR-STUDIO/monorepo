import { NextResponse } from "next/server";
import { esDemo } from "@/libs/demo";

export const dynamic = "force-dynamic";

/**
 * El formulario de «vende o consigna tu carro».
 *
 * En demo se corta AQUÍ, en el servidor, y no escondiendo el botón: si solo
 * estuviera deshabilitado en pantalla, cualquiera podría llamar a esta ruta a
 * mano y hacerle llegar avalúos falsos al negocio real. Y aquí eso pesa más que
 * en un formulario de contacto cualquiera: un avalúo falso hace que alguien
 * salga a ver un carro que no existe.
 *
 * PENDIENTE (para el día que se entregue): hoy, fuera de demo, esta ruta acepta
 * la solicitud y responde bien, pero no la reenvía a ningún sitio —no hay
 * todavía dominio de correo verificado ni la API de WhatsApp del cliente—.
 * Hay que engancharla al canal que elija antes de apagar el modo demo.
 */
export async function POST(peticion) {
  if (esDemo()) {
    return NextResponse.json(
      {
        error:
          "Esto es una demo: la solicitud no se envía. En la página entregada te llega con la marca, el año y el kilometraje ya ordenados, lista para hacer el avalúo.",
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
  const vehiculo = String(cuerpo.vehiculo ?? "").trim();
  const anio = String(cuerpo.anio ?? "").trim();

  if (!nombre || !telefono || !vehiculo || !anio) {
    return NextResponse.json(
      { error: "Faltan el nombre, el teléfono, el vehículo o el año." },
      { status: 400 }
    );
  }

  console.info("[vender] solicitud de avalúo", { nombre, telefono, vehiculo, anio });

  return NextResponse.json({ ok: true });
}
