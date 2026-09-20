import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { obtenerTasaDelBcv, guardarTasa } from "@/libs/bcv";
import { createAdminClient } from "@/libs/supabase/admin";

// Lee la página del BCV con el módulo https de Node: hace falta runtime Node.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Trae la tasa del día y la guarda.
 *
 * Lo llama el cron de Vercel (ver vercel.json). Se protege con CRON_SECRET:
 * Vercel manda `Authorization: Bearer <CRON_SECRET>` en sus cron jobs, y sin
 * ese encabezado la ruta responde 401. Así nadie puede dispararla a voluntad.
 *
 * Para probarlo a mano:
 *   curl -H "Authorization: Bearer $CRON_SECRET" https://.../api/cron/tasa-bcv
 */
export async function GET(peticion) {
  const secreto = process.env.CRON_SECRET;

  if (!secreto) {
    return NextResponse.json(
      { error: "Falta CRON_SECRET en el entorno." },
      { status: 500 }
    );
  }

  const autorizacion = peticion.headers.get("authorization");
  if (autorizacion !== `Bearer ${secreto}`) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  try {
    const tasa = await obtenerTasaDelBcv();
    const supabase = createAdminClient();
    await guardarTasa(supabase, tasa);

    // Los precios en bolívares se pintan en páginas cacheadas: hay que
    // rehacerlas o seguirían mostrando la tasa de ayer.
    revalidatePath("/");
    revalidatePath("/tienda");
    revalidatePath("/producto/[slug]", "page");

    return NextResponse.json({
      ok: true,
      valor: tasa.valor,
      fechaValor: tasa.fechaValor,
      fuente: tasa.fuente,
      avisos: tasa.avisos,
    });
  } catch (error) {
    console.error("[cron/tasa-bcv]", error?.message, error?.avisos);
    return NextResponse.json(
      { ok: false, error: error.message, avisos: error.avisos || [] },
      { status: 502 }
    );
  }
}
