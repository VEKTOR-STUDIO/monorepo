# La puerta con contraseña

Cuatro archivos. El código de referencia, funcionando, está en
`apps/clients/hardcore-fitness`; aquí va lo esencial y el porqué de cada
decisión, que es lo que no se ve leyendo el código a secas.

## 1. `libs/acceso.js` — solo servidor

```js
import { esDemo } from "@/libs/demo";

// Un nombre por cliente, para que la cookie de una demo no valga en otra.
export const COOKIE_ACCESO = "<cliente>_acceso";
export const DIAS_DE_ACCESO = 7;

// Contraseña de reserva. Existe para que la demo nazca CERRADA: si el valor
// por defecto fuera vacío y alguien olvidara la variable al desplegar, el
// sistema quedaría abierto a cualquiera.
//
// Este módulo no llega nunca al navegador —lo importan el middleware, la ruta
// /api/entrar y app/entrar/page.js, todos servidor—, así que la clave no viaja
// en el bundle. Por eso NO está en config.js.
const CLAVE_POR_DEFECTO = "cambiame";

export function claveDeAcceso() {
  return (process.env.DEMO_PASSWORD || CLAVE_POR_DEFECTO).trim();
}

export function hayCandado() {
  return esDemo() && claveDeAcceso().length > 0;
}

// Web Crypto y no node:crypto: esto también corre en el middleware, que va
// sobre el runtime edge, donde node:crypto no existe.
export async function huellaDe(clave) {
  const datos = new TextEncoder().encode(`acceso::${clave}`);
  const resumen = await crypto.subtle.digest("SHA-256", datos);
  return [...new Uint8Array(resumen)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function igualesEnTiempoFijo(a, b) {
  if (typeof a !== "string" || typeof b !== "string" || a.length !== b.length) return false;
  let diferencia = 0;
  for (let i = 0; i < a.length; i++) diferencia |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diferencia === 0;
}

export async function cookieEsValida(valor) {
  if (!valor) return false;
  return igualesEnTiempoFijo(valor, await huellaDe(claveDeAcceso()));
}

export async function claveEsCorrecta(intento) {
  const esperada = claveDeAcceso();
  if (!esperada) return false;
  // Se comparan las huellas, no los textos: así el tiempo de respuesta no
  // depende de cuántas letras se acertaron.
  return igualesEnTiempoFijo(await huellaDe(String(intento ?? "")), await huellaDe(esperada));
}

export function rutaLibre(pathname) {
  return (
    pathname === "/entrar" ||
    pathname === "/api/entrar" ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/marca/") ||   // lo que la pantalla necesita para pintarse
    pathname === "/favicon.ico"
  );
}

// Sin esto tendrías un redirector abierto: alguien podría mandar a la gente a
// /entrar?destino=https://otro-sitio y salir de tu dominio tras acertar.
export function destinoSeguro(destino) {
  if (typeof destino !== "string") return "/";
  if (!destino.startsWith("/") || destino.startsWith("//")) return "/";
  if (destino.startsWith("/entrar")) return "/";
  return destino;
}
```

## 2. `middleware.js` — el corte de verdad

El orden importa: la puerta va **antes** que la lógica de sesión. Si la app ya
tiene un `updateSession` de Supabase, se llama después.

```js
export async function middleware(request) {
  const { pathname, search } = request.nextUrl;

  if (hayCandado() && !rutaLibre(pathname)) {
    const cookie = request.cookies.get(COOKIE_ACCESO)?.value;

    if (!(await cookieEsValida(cookie))) {
      const puerta = request.nextUrl.clone();
      puerta.pathname = "/entrar";
      puerta.search = "";
      if (pathname !== "/") puerta.searchParams.set("destino", `${pathname}${search}`);
      return NextResponse.redirect(puerta);
    }
  }

  return await updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
```

Si la app usa Supabase, comprueba también que `updateSession` no reviente
cuando faltan las credenciales: `createServerClient` lanza, y eso deja el
sitio entero en 500. Ver `trampas.md`.

## 3. `app/api/entrar/route.js`

```js
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const espera = (ms) => new Promise((listo) => setTimeout(listo, ms));

export async function POST(peticion) {
  const { clave } = await peticion.json();

  if (!(await claveEsCorrecta(clave))) {
    await espera(600);  // frena los intentos a ciegas sin molestar a quien la sabe
    return NextResponse.json({ error: "Esa no es." }, { status: 401 });
  }

  const respuesta = NextResponse.json({ ok: true });
  respuesta.cookies.set({
    name: COOKIE_ACCESO,
    value: await huellaDe(claveDeAcceso()),
    httpOnly: true,            // ni un script de la página puede leerla
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: DIAS_DE_ACCESO * 24 * 60 * 60,
  });
  return respuesta;
}
```

## 4. `app/entrar/page.js` y la pantalla

La página comprueba en servidor y redirige si no hace falta enseñarla:

```js
export default async function Entrar({ searchParams }) {
  const destino = destinoSeguro((await searchParams)?.destino);
  if (!hayCandado()) redirect(destino);

  const guardada = (await cookies()).get(COOKIE_ACCESO)?.value;
  if (await cookieEsValida(guardada)) redirect(destino);

  return <PantallaAcceso destino={destino} />;
}
```

La pantalla (`components/PantallaAcceso.js`) es lo primero que ve quien va a
pagar, así que merece cuidado: el logo entrando, el formulario después. Dos
detalles que se olvidan:

- **Campo de usuario oculto.** Un formulario de contraseña sin `username` hace
  que los gestores no sepan a qué cuenta asociarla y Chrome se queja en
  consola. Uno `readOnly`, `tabIndex={-1}`, `aria-hidden` y `sr-only` resuelve.
- **La animación no puede bloquear.** Quien ya sabe la clave tiene que poder
  escribirla desde el primer momento; el foco automático llega al final de la
  entrada, no al principio.

Al acertar, navega con `window.location.href` y no con el router del cliente:
la cookie acaba de ponerse y hace falta que el servidor la lea de nuevo.

## Entorno

```bash
# Vacío o cualquier cosa = demo ACTIVA. `false` la apaga entera.
NEXT_PUBLIC_DEMO=

# La contraseña de la puerta. Vacía → la de reserva de libs/acceso.js.
DEMO_PASSWORD=
```
