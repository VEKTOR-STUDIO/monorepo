# La puerta con contraseña

Cinco archivos. La implementación de referencia, y la más completa, está en
`apps/clients/aprovechalo-ve`; `apps/clients/hardcore-fitness` tiene la primera
versión, más sobria, por si el proyecto no da para carátula. Aquí va lo
esencial y el porqué de cada decisión, que es lo que no se ve leyendo el código
a secas.

## La puerta no es un login: es el escaparate

Es el cambio grande respecto a la primera versión, y conviene entenderlo antes
de tocar código.

Quien recibe el enlace puede no pasar de aquí: si no tiene la contraseña a
mano, si la pierde, si solo echa un vistazo desde el móvil. **Esta es la única
pantalla que se ve seguro.** Tratarla como un formulario de acceso desperdicia
el único momento garantizado de la venta.

Así que la puerta lleva, además del campo de la clave:

- la insignia de edición ("Edición completa · Acceso anticipado"),
- la lista de lo que incluye, sacada de `config.demo.incluye`,
- el precio, el precio anterior tachado y el sello de descuento,
- la cuenta atrás de la oferta,
- las cintas de texto corriendo arriba y abajo,
- y la firma, con enlace, de quien lo construyó.

Todo lo que anuncia sale de `config.demo`, así que no hay dos verdades que
mantener: si se vacía `precioAnterior`, el sello desaparece solo; si pasa
`ofertaHasta`, el contador se va.

**La jerarquía de marca se invierte.** En la puerta manda la firma de
Alessandrovaru y no la marca del cliente: quien llega todavía no es cliente del
negocio, es alguien a quien se le está enseñando un trabajo. Al entrar, la
jerarquía vuelve a la normal y manda la marca del cliente.

Y lo de siempre: esto es la **cara** del candado. El candado está en el
middleware.

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
//
// El prefijo lleva el nombre del cliente y hace de sal: si dos demos acaban
// con la misma contraseña, la cookie de una NO sirve en la otra.
export async function huellaDe(clave) {
  const datos = new TextEncoder().encode(`<cliente>::acceso::${clave}`);
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

Al añadir a `rutaLibre` lo que la pantalla necesita, sé tacaño: cada ruta que
abres es una que se sirve sin contraseña. En aprovechalo es `/marca/`, porque
ahí vive el logo. El resto de imágenes de la puerta pasan por `/_next/image`,
que ya está fuera del matcher.

## 2. `middleware.js` — el corte de verdad

El orden importa: la puerta va **antes** que cualquier lógica de sesión.

```js
export async function middleware(request) {
  const { pathname, search } = request.nextUrl;

  if (hayCandado() && !rutaLibre(pathname)) {
    const cookie = request.cookies.get(COOKIE_ACCESO)?.value;

    if (!(await cookieEsValida(cookie))) {
      const puerta = request.nextUrl.clone();
      puerta.pathname = "/entrar";
      puerta.search = "";
      // Para devolver a la gente a donde iba en cuanto abra.
      if (pathname !== "/") puerta.searchParams.set("destino", `${pathname}${search}`);
      return NextResponse.redirect(puerta);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
```

Si la app tiene sesiones de Supabase, la última línea es
`return await updateSession(request)` en vez de `NextResponse.next()`, y hay
que comprobar que `updateSession` no reviente cuando faltan las credenciales:
`createServerClient` lanza, y eso deja el sitio entero en 500. Ver
`trampas.md`. Si la app no tiene sesiones —el caso de aprovechalo—, no montes
Supabase solo para esto.

## 3. `app/api/entrar/route.js`

```js
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const espera = (ms) => new Promise((listo) => setTimeout(listo, ms));

export async function POST(peticion) {
  // Un POST sin cuerpo o con basura no puede tumbar la ruta.
  let cuerpo;
  try {
    cuerpo = await peticion.json();
  } catch {
    return NextResponse.json({ error: "Petición mal formada." }, { status: 400 });
  }

  // Sin contraseña configurada no se entra: mejor un 500 ruidoso que una
  // puerta que se abre sola.
  if (!claveDeAcceso()) {
    return NextResponse.json({ error: "No hay contraseña configurada." }, { status: 500 });
  }

  if (!(await claveEsCorrecta(String(cuerpo.clave ?? "")))) {
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

## 4. `app/entrar/page.js`

Comprueba en servidor y redirige si no hace falta enseñar la pantalla:

```js
export const dynamic = "force-dynamic";

// Que la puerta no acabe en Google. Es una demo privada, no una página del
// negocio, y el cliente no quiere su marca indexada bajo "acceso restringido".
export const metadata = getSEOTags({
  title: "Acceso · <Cliente>",
  description: "Página de demostración con acceso restringido.",
  extraTags: { robots: { index: false, follow: false } },
});

export default async function Entrar({ searchParams }) {
  const destino = destinoSeguro(((await searchParams) || {}).destino);
  if (!hayCandado()) redirect(destino);

  const guardada = (await cookies()).get(COOKIE_ACCESO)?.value;
  if (await cookieEsValida(guardada)) redirect(destino);

  return <PantallaAcceso destino={destino} />;
}
```

`force-dynamic` no es opcional: sin él Next puede prerenderizar la página y
servir la puerta cacheada a alguien que ya tiene la cookie.

## 5. `components/PantallaAcceso.js` — la carátula

Dos columnas: la carátula a la izquierda (insignia, logo, lo que incluye) y la
caja de acceso a la derecha, que es donde la vista termina cayendo. En móvil se
apilan. La caja va `sticky` en escritorio para que no se pierda al bajar por la
lista.

Lo que se monta encima de `config.demo`:

```js
// "$690" y "$399" → 42. Null si no hay rebaja que anunciar.
function calcularDescuento(antes, ahora) {
  const limpiar = (v) => Number(String(v ?? "").replace(/[^\d.]/g, ""));
  const a = limpiar(antes), b = limpiar(ahora);
  if (!a || !b || b >= a) return null;
  return Math.round((1 - b / a) * 100);
}
```

El sello sale de ahí, no de un número escrito a mano: así no puede contradecir
a los precios. El contador es el mismo `components/demo/Contador.js` que usa la
franja, en `formato="completo"`.

Detalles que se olvidan y cuestan:

- **Campo de usuario oculto.** Un formulario de contraseña sin `username` hace
  que los gestores no sepan a qué cuenta asociarla y Chrome se queja en
  consola. Uno `readOnly`, `tabIndex={-1}`, `aria-hidden` y `sr-only` resuelve.
- **La animación no puede bloquear.** Quien ya sabe la clave tiene que poder
  escribirla desde el primer momento; el foco automático llega al final de la
  entrada, no al principio.
- **El hueco del error se reserva siempre**, con `opacity-0` cuando no hay
  error. Si el párrafo aparece y desaparece, el botón salta bajo el cursor.
- **Al fallar, se vacía el campo y vuelve el foco**, más una sacudida corta
  (`elastic.out`) sobre el contenedor. El error se limpia al primer tecleo.
- **Accesibilidad del formulario**: `aria-invalid` en el campo,
  `aria-describedby` apuntando al párrafo y `role="alert"` en él.
- **Al acertar**, la pantalla se cierra con una animación y se navega con
  `window.location.href`, no con el router del cliente: la cookie acaba de
  ponerse y hace falta que el servidor la lea de nuevo. Bloquea el envío
  mientras tanto (`abierto`), o un doble clic dispara dos navegaciones.

Las clases de apoyo (`insignia-edicion`, `sello-descuento`, `linea-dlc`,
`resplandor`, `@keyframes pulso`) están en `app/globals.css` de aprovechalo.
Cópialas de ahí en vez de reinventarlas.

## Entorno

```bash
# Vacío o cualquier cosa = demo ACTIVA. `false` la apaga entera.
NEXT_PUBLIC_DEMO=

# La contraseña de la puerta. Vacía → la de reserva de libs/acceso.js.
DEMO_PASSWORD=
```

Y lo que alimenta la carátula, en `config.js`:

```js
demo: {
  precio: "$399",
  precioAnterior: "$690",          // vacío → sin sello de rebaja
  ofertaHasta: "2026-10-15T23:59:59-04:00",  // fecha real; vacía → sin contador
  precioNota: "Pago único · dominio, montaje y carga del catálogo incluidos",
  incluye: ["...", "..."],         // sale en la puerta y en el bloque de venta
}
```

## Comprobar

```bash
# Sin cookie, todo redirige a la puerta
curl -s -o /dev/null -w "%{http_code} %{redirect_url}\n" http://localhost:3000/

# Cuerpo mal formado → 400, sin reventar
curl -s -X POST localhost:3000/api/entrar -H "Content-Type: application/json" \
  -d 'no-es-json' -w " [%{http_code}]\n"

# Clave incorrecta → 401 y ~600ms
curl -s -X POST localhost:3000/api/entrar -H "Content-Type: application/json" \
  -d '{"clave":"loquesea"}' -w " [%{http_code}]\n"

# Clave correcta: guarda la cookie y entra
curl -s -c /tmp/c.txt -X POST localhost:3000/api/entrar \
  -H "Content-Type: application/json" -d '{"clave":"LA-BUENA"}'
curl -s -b /tmp/c.txt -o /dev/null -w "%{http_code}\n" http://localhost:3000/

# Cookie falsificada: rechazada
curl -s -H "Cookie: <cliente>_acceso=0000" -o /dev/null -w "%{http_code}\n" localhost:3000/

# La clave no viaja al navegador
grep -rl "LA-BUENA" .next/static/    # no debe devolver nada
```
