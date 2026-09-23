import fs from "node:fs";
import { NextResponse } from "next/server";
import { leerProspecto, rutaVideo } from "@/libs/prospectos.mjs";
import { esSlug } from "@/libs/rutas.mjs";
import { rechazoSiNoEsLocal } from "@/libs/local";

export const dynamic = "force-dynamic";

// Sirve el MP4 del estudio para verlo en la ficha o bajarlo y arrastrarlo a
// WhatsApp. Con soporte de rangos: sin él, el <video> del navegador no puede
// saltar en la línea de tiempo. `?bajar=1` lo entrega como descarga.
export async function GET(request, { params }) {
  const rechazo = rechazoSiNoEsLocal(request);
  if (rechazo) return rechazo;

  const { id } = await params;
  if (!esSlug(id) || !leerProspecto(id)) {
    return NextResponse.json({ error: "Ese prospecto no existe." }, { status: 404 });
  }

  const url = new URL(request.url);
  const formato = url.searchParams.get("formato") === "wide" ? "wide" : "vertical";
  let ruta;
  let info;
  try {
    ruta = rutaVideo(id, formato);
    info = fs.statSync(ruta);
  } catch {
    return NextResponse.json({ error: "Ese video no está renderizado." }, { status: 404 });
  }

  const nombre = `${id}-${formato}.mp4`;
  const cabeceras = {
    "Content-Type": "video/mp4",
    "Accept-Ranges": "bytes",
    "Cache-Control": "no-store",
    "Content-Disposition": `${url.searchParams.get("bajar") ? "attachment" : "inline"}; filename="${nombre}"`,
  };

  const rango = request.headers.get("range")?.match(/^bytes=(\d*)-(\d*)$/);
  if (rango) {
    const inicio = rango[1] ? Number(rango[1]) : 0;
    const fin = rango[2] ? Math.min(Number(rango[2]), info.size - 1) : info.size - 1;
    if (inicio > fin || inicio >= info.size) {
      return new Response(null, { status: 416, headers: { "Content-Range": `bytes */${info.size}` } });
    }
    const trozo = fs.createReadStream(ruta, { start: inicio, end: fin });
    return new Response(aStream(trozo), {
      status: 206,
      headers: {
        ...cabeceras,
        "Content-Range": `bytes ${inicio}-${fin}/${info.size}`,
        "Content-Length": String(fin - inicio + 1),
      },
    });
  }

  return new Response(aStream(fs.createReadStream(ruta)), {
    status: 200,
    headers: { ...cabeceras, "Content-Length": String(info.size) },
  });
}

// De stream de Node a ReadableStream del estándar, que es lo que Response entiende.
function aStream(lector) {
  return new ReadableStream({
    start(control) {
      lector.on("data", (trozo) => control.enqueue(new Uint8Array(trozo)));
      lector.on("end", () => control.close());
      lector.on("error", (e) => control.error(e));
    },
    cancel() {
      lector.destroy();
    },
  });
}
