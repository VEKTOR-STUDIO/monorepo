import { NextResponse } from "next/server";
import { guardarMaterial, leerCandidato, listarMaterial } from "@/libs/almacen.mjs";
import { esSlug } from "@/libs/rutas.mjs";
import { rechazoSiNoEsLocal } from "@/libs/local";

export const dynamic = "force-dynamic";

// Va por una ruta y no por una server action porque las actions cortan el
// cuerpo a 1 MB, y aquí lo normal es un PDF de catálogo de veinte.
const TOPE = 200 * 1024 * 1024;

export async function POST(request, { params }) {
  const rechazo = rechazoSiNoEsLocal(request);
  if (rechazo) return rechazo;

  const { id } = await params;
  if (!esSlug(id) || !leerCandidato(id)) {
    return NextResponse.json({ error: "Ese candidato no existe." }, { status: 404 });
  }

  let formulario;
  try {
    formulario = await request.formData();
  } catch {
    return NextResponse.json({ error: "No pude leer los archivos." }, { status: 400 });
  }

  const guardados = [];
  for (const archivo of formulario.getAll("archivos")) {
    if (typeof archivo === "string" || !archivo.size) continue;
    if (archivo.size > TOPE) {
      return NextResponse.json({ error: `«${archivo.name}» pasa de 200 MB.` }, { status: 413 });
    }
    guardados.push(guardarMaterial(id, archivo.name, Buffer.from(await archivo.arrayBuffer())));
  }

  return NextResponse.json({ guardados, material: listarMaterial(id) });
}
