// El centro de control escribe en el disco y lanza procesos: solo tiene
// sentido —y solo es seguro— en tu máquina. Esto es lo que lo mantiene ahí.
import { NextResponse } from "next/server";

const LOCALES = new Set(["localhost", "127.0.0.1", "[::1]"]);

const soloNombre = (host) => String(host || "").replace(/:\d+$/, "");

// Por si algún día alguien lo despliega sin querer.
export function exigirEntornoLocal() {
  if (process.env.VERCEL) {
    throw new Error("El centro de control solo funciona en local.");
  }
}

// Para las rutas de API. Las server actions ya comparan Origin con Host por su
// cuenta; una ruta normal no, y un formulario de cualquier web abierta en el
// navegador puede hacer POST a 127.0.0.1. Se exige que la petición venga de la
// propia página y que el Host sea local (corta también el DNS rebinding).
export function rechazoSiNoEsLocal(request) {
  if (process.env.VERCEL) {
    return NextResponse.json({ error: "Solo en local." }, { status: 403 });
  }
  const host = request.headers.get("host");
  if (!LOCALES.has(soloNombre(host))) {
    return NextResponse.json({ error: "Solo en local." }, { status: 403 });
  }
  const origen = request.headers.get("origin");
  if (origen) {
    let mismo = false;
    try {
      mismo = new URL(origen).host === host;
    } catch {
      // Un Origin que ni siquiera es una URL se queda en «no es el mismo».
    }
    if (!mismo) return NextResponse.json({ error: "Origen no permitido." }, { status: 403 });
  } else if (request.method !== "GET") {
    return NextResponse.json({ error: "Falta el origen de la petición." }, { status: 403 });
  }
  return null;
}
