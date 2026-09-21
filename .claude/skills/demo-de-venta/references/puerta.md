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
apilan.

**Y cabe en una pantalla, sin scroll.** No es un capricho: es la única pantalla
que se ve seguro, y lo que quede por debajo del pliegue no lo lee nadie. Nada
de `sticky` —sin scroll no pega nada— y nada de `min-h-svh`, que deja crecer.
Cómo se consigue, más abajo.

Lo que se monta encima de `config.demo`:

```js
// "$740" y "$449" → 39. Null si no hay rebaja que anunciar.
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
- **El hueco del error se reserva siempre**, con `opacity-0` cuando no hay
  error. Si el párrafo aparece y desaparece, el botón salta bajo el cursor.
- **El error se limpia al primer tecleo**, no al reenviar.
- **Accesibilidad del formulario**: `aria-invalid` en el campo,
  `aria-describedby` apuntando al párrafo y `role="alert"` en él.

### El fondo: capas, y ninguna de plástico

El fondo de la puerta se monta como una pila de `absolute inset-0` dentro del
`<main>`, en este orden: la foto o las barras de la marca (`opacity-25`), el
velo del color base, la malla, la textura de ruido y el halo difuminado. El
contenido se queda por encima porque sube con `z-10`.

**El plástico está retirado.** Hubo una capa `.plastico` —una foto de bolsa
arrugada tirada en `mix-blend-mode: screen` sobre todo el fondo— y se quitó de
las once demos que la tenían. Ensuciaba igual en todas y hacía que once
clientes distintos se parecieran entre sí, que es exactamente lo contrario de
lo que la puerta tiene que conseguir. No la vuelvas a montar ni la arrastres al
copiar un cliente viejo; si aparece un `plasticTexture.jpg` en `public/`, es
resto de antes.

Una textura encima sí puede sumar, pero entonces **tiene que ser de ese
cliente**: el papel sucio de un taller, la fibra de carbono de un concesionario
deportivo, el grano de la foto de un gimnasio, el tramado de su propia marca.
Sale de su material, no de un archivo que se arrastra de proyecto en proyecto,
y se prueba contra su fondo real antes de dejarla. Si no se te ocurre cuál es
la suya, no pongas ninguna: el fondo limpio no falla nunca, y una textura
genérica se nota.

Cuando pongas una, el modo de fusión lo decide la textura y no el gusto:
**oscura con detalle claro → `screen`; clara con detalle oscuro → `multiply`**.
Va como última capa del fondo, después del halo, para que toque también el
resplandor, y siempre con `pointer-events: none`. Cuidado con los contextos de
apilamiento, que apagan `mix-blend-mode` (trampa 3 de `references/trampas.md`).

Y antes de ponerte a apilar capas, lee lo que viene: si solo hay tiempo para
una cosa, no es esta.

### Lo que de verdad paga: la animación de entrada

Lo que hace que la puerta parezca cara no es la textura del fondo, es cómo
entra. Una capa más son cinco minutos y no la nota nadie; una línea de tiempo
bien escalonada es lo que hace que quien abre el enlace se quede mirando en vez
de buscar el campo y salir. **Si hay que repartir el esfuerzo, va aquí.**

Es una sola `gsap.timeline()` dentro del contexto del `<main>`, con posiciones
absolutas en segundos —no encadenadas— para poder afinar una pieza sin mover
las demás:

```js
useEffect(
  () =>
    contexto((g) => {
      const linea = g.timeline();

      linea
        .from("[data-puerta='halo']", { opacity: 0, scale: 0.4, duration: 1.4 }, 0)
        .from("[data-puerta='logo']", {
          opacity: 0, scale: 0.82,
          filter: "blur(14px) brightness(2.2)",
          duration: 1, clearProps: "filter,transform",
        }, 0)
        .from("[data-puerta='marca']",    { opacity: 0, y: -12 }, 0.6)
        .from("[data-puerta='insignia']", { opacity: 0, xPercent: -30, duration: 0.7 }, 0.85)
        .from("[data-puerta='titulo']",   { opacity: 0, y: 16 }, 1.0)
        .from("[data-puerta='caja']",     { opacity: 0, y: 24, duration: 0.9 }, 1.1)
        .from("[data-puerta='dlc'] > *",  { opacity: 0, x: -18, duration: 0.5, stagger: 0.07 }, 1.3)
        .from("[data-puerta='sello']",    { opacity: 0, scale: 0.4, rotate: -40, duration: 0.6 }, 1.5)
        .from("[data-puerta='pie']",      { opacity: 0, y: 12 }, 1.8);
    }, raiz),
  []
);
```

El orden no es decorativo, cuenta el argumento de venta: primero el halo y el
logo —de quién es esto—, después la marca y la insignia de edición, luego el
título y la caja donde va a escribir, y al final el sello de rebaja, la lista
de lo que incluye y la firma. Cada pieza se marca con su `data-puerta` en vez
de seleccionar por clase, para que retocar el estilo no rompa la animación.

Las reglas que no se negocian:

- **Nunca bloquea.** Quien ya sabe la clave escribe desde el primer fotograma;
  el foco automático llega al final (`setTimeout` de ~1.7 s), no al principio.
- **`prefers-reduced-motion`.** `libs/animaciones.js` lo atiende y deja todo en
  su estado final. Se comprueba emulándolo, no confiando.
- **Lo animado se oculta desde CSS** con `[data-anima] { opacity: 0 }` para que
  no salte al hidratar —y entonces `gsap.from()` anima de 0 a 0. Cómo se
  resuelve: trampa 1 de `references/trampas.md`.
- **El fallo también se anima**: sacudida corta sobre el contenedor del campo
  (`gsap.fromTo(..., { x: -9 }, { x: 0, ease: "elastic.out(1, 0.35)" })`), se
  vacía el campo y vuelve el foco.
- **El acierto se cierra, no se corta**: el logo crece un punto, la pantalla se
  va en ~0.45 s y solo entonces `window.location.href = destino` —navegación
  completa y no el router del cliente, porque la cookie acaba de ponerse y hace
  falta que el servidor la lea de nuevo. Con `abierto` bloqueando el envío, o
  un doble clic dispara dos navegaciones.

### Una sola pantalla

El armazón es una columna de tres piezas: cinta, cuerpo, cinta. Las cintas no
se encogen y el cuerpo se queda con lo que sobre.

```jsx
<main ref={raiz} className="puerta relative flex h-svh flex-col overflow-hidden">
  {/* capas de fondo, todas absolute inset-0 */}
  <Cintillo variante="puerta" className="relative z-20 shrink-0" />

  <div className="relative z-10 flex min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-contain">
    <div className="m-auto grid w-full max-w-6xl gap-x-[clamp(1.5rem,4vw,3.5rem)] gap-y-[var(--puerta-v4)] px-5 py-[var(--puerta-v2)] lg:grid-cols-[1.15fr_1fr]">
      <div className="flex min-w-0 flex-col items-center text-center lg:items-start lg:text-left">…</div>
      <div className="min-w-0 lg:self-center">…</div>
    </div>
  </div>

  <Cintillo variante="puertaInversa" invertido className="relative z-20 shrink-0" />
</main>
```

Cada decisión de ahí paga algo:

- **`h-svh`, no `vh` ni `min-h-`.** `vh` mide como si la barra del navegador
  del móvil no existiera y deja el pie fuera de la pantalla; `min-h-` permite
  crecer, que es justo lo que no queremos.
- **`m-auto` en el grid, no `items-center` en el padre.** Si en alguna pantalla
  rara el contenido no cupiera, `items-center` lo centra y recorta el
  principio, que queda inalcanzable; los márgenes automáticos se anulan solos
  cuando no hay hueco y dejan el contenido desde arriba, alcanzable con el
  scroll interno.
- **`min-h-0 flex-1 overflow-y-auto` en el cuerpo.** Es la red: el `overflow`
  no se usa nunca en las medidas comprobadas, pero en un móvil raro vale más un
  desplazamiento dentro del hueco que un botón cortado. La página, por fuera,
  nunca hace scroll.
- **`min-w-0` en las dos columnas.** Esta muerde: sin ella, un hijo ancho
  —el carrusel de "lo que incluye"— estira la columna del grid hasta su
  `min-content` (medido: 1616 px en una pantalla de 390) y el texto se sale por
  los dos lados. Ver `trampas.md`.

### El ritmo vertical se mide en `vh`

Los `mt-5/7/8/9`, `p-6 sm:p-7`, `gap-10 lg:gap-14` fijos no caben en un
portátil de 720 px. Cuatro variables en `app/globals.css`, sobre `.puerta`:

```css
.puerta {
  --puerta-v1: clamp(0.3rem, 0.9vh, 0.75rem); /* una etiqueta y su dato */
  --puerta-v2: clamp(0.5rem, 1.6vh, 1.25rem); /* piezas de un mismo bloque */
  --puerta-v3: clamp(0.7rem, 2.4vh, 1.75rem); /* de un bloque al siguiente */
  --puerta-v4: clamp(0.9rem, 3.2vh, 3.5rem);  /* entre las dos columnas */
  --puerta-logo: clamp(4rem, 11vh, 8.25rem);  /* el máximo es el de antes */
}
```

Se usan como `mt-[var(--puerta-v3)]`. El hueco **horizontal** entre columnas no
va aquí: no tiene nada que ver con el alto, va en `vw`. El precio y el rótulo
también encogen: `text-[clamp(1.9rem,5vh,3rem)]`.

Los logotipos se piden en píxeles porque el mismo componente sirve en la
cabecera. Para que encojan, se les enseña a aceptar una medida CSS —dos líneas
en `components/Logo.js`, compatible hacia atrás:

```js
const medida = typeof lado === "number" ? `${lado}px` : lado;  // para el style
const servir = typeof lado === "number" ? lado : 200;          // para next/image
```

y la puerta le pasa `lado="var(--puerta-logo)"`. Si el logotipo es apaisado
—un rótulo de 6.4:1 mide 52 px de alto— no hace falta: ahí aprieta el ancho, y
de eso se encarga el `max-w-full` del componente.

### Qué se cae cuando no cabe, por orden

En el móvil la columna es estrecha y todo se apila, así que hay que elegir. El
orden está pensado para que lo último que se toque sea a lo que se viene: el
logotipo, el precio y el formulario.

| Dónde | Qué se va | Por qué no se pierde nada |
|---|---|---|
| `<lg` (una columna) | el párrafo de presentación | lo cuentan la insignia, el carrusel y las cintas |
| `<lg` | la insignia de edición | la cinta de arriba dice literalmente lo mismo, girando |
| `<lg` | la segunda frase del pie | la firma con enlace se queda |
| `<lg` | las cuatro cajas del contador → `formato="compacto"` | misma cuenta, una línea, junto a su etiqueta |
| `height < 45rem` | la etiqueta "Demo privada de" | adorno |
| `height < 45rem` | **toda** la lista de lo que incluye | es lo único que se cuenta dos veces: las dos cintas llevan girando esas mismas ventajas |
| `height < 46rem` **o** `<lg` | el párrafo de presentación | (la regla es `@media (width >= 64rem) and (height >= 46rem)`) |

Cuidado con el umbral: `height < 40rem` deja fuera justo los 640 px, que es la
pantalla que hay que rescatar. 45rem (720 px) recoge el 640, el 667 del SE y el
portátil bajo, y no toca los móviles de 800 para arriba.

Y la lista de "lo que incluye", que es la pieza más alta (siete u ocho
renglones), en móvil se tumba: una fila que se arrastra de lado, con los puntos
enganchados, saliéndose del margen para que se vea que hay más a la derecha.

```css
.puerta-incluye {
  display: flex;
  gap: 0.5rem;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  margin-inline: -1.25rem;   /* se come el px-5 del grid */
  padding-inline: 1.25rem;
  scrollbar-width: none;
}
.puerta-incluye::-webkit-scrollbar { display: none; }
.puerta-incluye > li { flex: 0 0 14rem; scroll-snap-align: start; }

@media (width >= 64rem) {
  .puerta-incluye {
    display: grid;
    gap: var(--puerta-v1);
    overflow: visible;
    margin-inline: 0;
    padding-inline: 0;
  }
  .puerta-incluye > li { flex: initial; }
}
```

En escritorio vuelve a ser la lista vertical de siempre, que es como se lee
mejor. Bajar el texto de los puntos a `text-xs` hace que en una columna de
~560 px la mayoría quepa en un renglón: siete puntos pasan de 350 px a 230.

Si un cliente apila foto + rótulo escrito + `@handle` (Venta Nacional), eso son
150 px de marca antes de llegar al precio: en móvil van en fila —foto a la
izquierda, nombre a la derecha— y de `lg` en adelante vuelve la carátula
apilada.

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
  precio: "$449",
  precioAnterior: "$740",          // vacío → sin sello de rebaja
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
