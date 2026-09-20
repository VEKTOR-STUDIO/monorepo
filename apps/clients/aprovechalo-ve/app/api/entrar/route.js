import { NextResponse } from "next/server";
import {
  COOKIE_ACCESO,
  DIAS_DE_ACCESO,
  claveDeAcceso,
  claveEsCorrecta,
  huellaDe,
} from "@/libs/acceso";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/** Frena los intentos a ciegas sin llegar a molestar a quien sabe la clave. */
const espera = (ms) => new Promise((listo) => setTimeout(listo, ms));

export async function POST(peticion) {
  let cuerpo;
  try {
    cuerpo = await peticion.json();
  } catch {
    return NextResponse.json({ error: "Petición mal formada." }, { status: 400 });
  }

  if (!claveDeAcceso()) {
    return NextResponse.json({ error: "No hay contraseña configurada." }, { status: 500 });
  }

  const intento = String(cuerpo.clave ?? "");

  if (!(await claveEsCorrecta(intento))) {
    // Medio segundo por intento fallido: irrelevante para una persona,
    // incómodo para un script.
    await espera(600);
    return NextResponse.json({ error: "Esa no es." }, { status: 401 });
  }

  const respuesta = NextResponse.json({ ok: true });

  respuesta.cookies.set({
    name: COOKIE_ACCESO,
    value: await huellaDe(claveDeAcceso()),
    // httpOnly para que ni un script de la propia página pueda leerla.
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: DIAS_DE_ACCESO * 24 * 60 * 60,
  });

  return respuesta;
}
