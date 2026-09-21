import fs from "node:fs";
import { NextResponse } from "next/server";
import { leerCandidato } from "@/libs/almacen.mjs";
import { archivoRegistro, esSlug } from "@/libs/rutas.mjs";
import { rutinaEnMarcha } from "@/libs/rutina.mjs";
import { rechazoSiNoEsLocal } from "@/libs/local";

export const dynamic = "force-dynamic";

// El registro se pide por trozos: `desde` es el byte hasta donde ya leyó el
// navegador, y solo viaja lo nuevo. Una rutina larga deja cientos de KB y
// mandarlo entero cada dos segundos no tiene sentido.
export async function GET(request, { params }) {
  const rechazo = rechazoSiNoEsLocal(request);
  if (rechazo) return rechazo;

  const { id } = await params;
  if (!esSlug(id)) return NextResponse.json({ error: "No existe." }, { status: 404 });

  // De paso recoge una rutina que se hubiera cortado sin avisar.
  rutinaEnMarcha();

  const candidato = leerCandidato(id);
  if (!candidato) return NextResponse.json({ error: "No existe." }, { status: 404 });

  let desde = Number(new URL(request.url).searchParams.get("desde")) || 0;
  let texto = "";
  let hasta = 0;
  try {
    const archivo = archivoRegistro(id);
    hasta = fs.statSync(archivo).size;
    // Si el archivo es más corto que lo ya leído, es que empezó otra rutina.
    if (desde > hasta) desde = 0;
    if (hasta > desde) {
      const trozo = Buffer.alloc(hasta - desde);
      const fd = fs.openSync(archivo, "r");
      fs.readSync(fd, trozo, 0, trozo.length, desde);
      fs.closeSync(fd);
      texto = trozo.toString("utf8");
    }
  } catch {
    // Sin registro todavía: la rutina de este candidato nunca se ha lanzado.
  }

  return NextResponse.json({
    texto,
    desde,
    hasta,
    etapa: candidato.etapa,
    rutina: candidato.rutina,
  });
}
