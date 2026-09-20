# Trampas

Seis fallos reales de este monorepo. Comparten un patrón: **ninguno da error en
consola**. El build pasa, el lint pasa, y el destrozo solo se ve mirando la
pantalla. Por eso hay que mirarla, entera y de arriba abajo, antes de dar algo
por terminado.

---

## 1. `gsap.from()` sobre algo que el CSS ya dejó invisible

**Síntoma:** secciones enteras en blanco. Media portada en negro.

Para que no dé un salto al hidratar, lo que va a entrar animado se oculta desde
el CSS:

```css
[data-anima] { opacity: 0; }
```

Y entonces esto no funciona nunca:

```js
g.from(nodo, { opacity: 0, y: 30 });   // anima de 0 a… 0
```

`from` anima *desde* el valor que le das *hasta* el actual. El actual es 0. El
elemento no aparece jamás.

**Arreglo:** `fromTo` con el destino explícito, y quitar el marcador al acabar
para que el elemento deje de depender de nada:

```js
g.fromTo(nodo,
  { opacity: 0, y: 30 },
  { opacity: 1, y: 0, onComplete: () => nodo.removeAttribute("data-anima") }
);
```

Cuidado con `clearProps: "opacity"`: borraría el estilo en línea y la regla del
CSS volvería a ocultarlo.

---

## 2. `background-clip: text` se come las tildes

**Síntoma:** "POR CATEGORÍA" se lee "POR CATEGORIA".

El degradado solo se pinta dentro de la caja del elemento. Con un
`line-height` menor que 1 —habitual en titulares— las tildes quedan por encima
de esa caja, se quedan sin degradado y desaparecen.

**Arreglo:** hueco vertical.

```css
.cromo {
  display: inline-block;
  padding-top: 0.3em;
  padding-bottom: 0.14em;
}
```

Compensa con `padding` y **no** con margen negativo: el CSS del proyecto va sin
capa y le ganaría a las utilidades `mt-*` de Tailwind, dejando los titulares
pegados a lo de arriba.

En español esto no es cosmético. Revisa siempre un titular con tilde.

---

## 3. Cualquier contexto de apilado rompe `mix-blend-mode`

**Síntoma:** un logo que se fundía con el fondo aparece dentro de un recuadro
negro.

La fusión solo ve lo que se ha pintado antes **dentro de su contexto de
apilado**. Lo abren más cosas de las que parece: `transform`, `filter`,
`opacity` distinto de 1, `backdrop-filter`, `isolation: isolate`,
`will-change`, y —la que más cuesta ver— **un `z-index` sobre algo
posicionado**. GSAP deja `transform: translate(0px, 0px)` puesto en línea al
terminar, aunque no mueva nada.

**Arreglos:** `clearProps: "filter,transform"` en el tween; y para el z-index,
quitarlo cuando no haga falta. En la puerta, el cuerpo lleva `relative z-10`
sobre un fondo que son hermanos **anteriores** en el árbol: `relative` a secas
ya lo deja encima, así que el `z-10` sobra y es justo lo que apaga el blend.
Antes de quitarlo, mira cómo queda: en un logotipo que es un cuadrado de
Instagram, comerse el negro deja el rótulo flotando en un hueco vacío y puede
verse peor que el azulejo.

No lo adivines: recorre los ancestros y pregunta quién abre el contexto.

```js
// dentro de page.evaluate()
for (let n = document.querySelector("[data-puerta='logo'] img"); n; n = n.parentElement) {
  const s = getComputedStyle(n);
  const abre = [];
  if (s.position !== "static" && s.zIndex !== "auto") abre.push(`z-index:${s.zIndex}`);
  if (s.transform !== "none") abre.push("transform");
  if (s.filter !== "none") abre.push("filter");
  if (s.opacity !== "1") abre.push("opacity");
  if (s.backdropFilter !== "none") abre.push("backdrop-filter");
  if (s.isolation === "isolate") abre.push("isolation");
  if (abre.length) console.log(n.tagName, n.className, "→", abre.join(", "));
}
```

La alternativa definitiva, si el blend sigue estorbando, es el filtro SVG de
alfa por brillo (`marca-alfa` en el layout raíz de cittacars): hace lo mismo y
le da igual el contexto de apilado.

---

## 4. Secretos en `config.js`

`config.js` lo importan componentes de cliente, así que Next lo empaqueta para
el navegador. Cualquier cosa ahí dentro es pública.

**Arreglo:** los secretos van en un módulo que solo importen servidor,
middleware o rutas de API. Y se comprueba, no se supone:

```bash
grep -rl "<el-secreto>" .next/static/    # no debe devolver nada
```

---

## 5. Una API externa en 200 páginas estáticas tumba el build

**Síntoma:** `Failed to build /producto/[slug] … took more than 60 seconds`.

Cada página prerenderizada llamaba a la misma API. Doscientas llamadas
simultáneas, la API corta, cada página espera su tiempo de espera y el
generador se rinde.

**Arreglo:** memoria por proceso, por encima del caché de `fetch` de Next.

```js
let recordado = null;   // { valor, momento }
let enCurso = null;     // promesa compartida

export async function obtener() {
  if (recordado && Date.now() - recordado.momento < VIDA) return recordado.valor;
  if (enCurso) return enCurso;          // otra página ya está preguntando
  enCurso = (async () => { /* … */ })();
  return enCurso;
}
```

Recuerda también los fallos, un minuto, para no insistir contra una API caída.

---

## 6. El middleware revienta sin credenciales

**Síntoma:** 500 en **todas** las páginas, incluida la portada.

`createServerClient` de Supabase lanza si faltan la URL o la clave. En el
middleware eso tumba el sitio entero, aunque la portada no necesite base de
datos para nada.

**Arreglo:** dejar pasar cuando no hay credenciales. Las rutas privadas se
defienden solas más adelante.

```js
const hayCredenciales =
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!hayCredenciales) return NextResponse.next({ request });
```

Este se destapa justo al poner `NEXT_PUBLIC_DEMO=false`, que suele ser el peor
momento posible. Prueba las dos combinaciones antes de entregar.

---

## 7. `min-width: auto` estira la columna del grid

**Síntoma:** en el móvil el texto se sale por los dos lados a la vez, centrado.
La página no tiene scroll horizontal (`scrollWidth` es correcto), así que
parece un problema de tipografía. No lo es: la columna mide más que la
pantalla y su contenido, centrado dentro de ella, desborda simétricamente.

Los hijos de un grid o un flex tienen `min-width: auto`, así que **no bajan de
su `min-content`**. Y el `min-content` se hereda hacia arriba desde el hijo más
ancho: un carrusel horizontal de siete tarjetas de 14rem estiraba la columna a
**1616 px** dentro de una pantalla de 390. El `overflow-x: auto` del carrusel
no basta; eso solo pone `min-width: 0` si el propio carrusel es el hijo del
flex, y aquí hay dos bloques de por medio.

**Arreglo:** `min-w-0` en cada hijo del grid. Se olvida siempre.

Para cazarla, mide en vez de mirar:

```js
[...document.querySelectorAll("body *")]
  .filter((n) => n.getBoundingClientRect().width > innerWidth + 1)
  .map((n) => `${n.tagName}.${n.className} → ${Math.round(n.getBoundingClientRect().width)}px`);
```

---

## 8. El layout raíz cuelga cosas debajo de tu pantalla completa

**Síntoma:** el `<main>` mide exactamente `100svh` y aun así la página hace
scroll. Medido: `main` 844 px, `document.scrollHeight` 1015.

El crédito de autoría (`FooterFoot`) y la barra de demo se montan **una sola
vez en `app/layout.js`**, así que también caen debajo de la puerta. Y en modo
demo el crédito lleva `padding-bottom: 9.5rem` para no quedar tapado por la
tarjeta flotante: 171 px que no estaban en ningún sitio donde mirases.

**Arreglo:** que la propia página lo apague, sin tocar el layout ni inventar
un route group.

```css
/* La puerta lleva su propia firma; el crédito del layout ahí sobra. */
body:has(main.puerta) .footer-foot { display: none; }
```

Antes de dar por buena una pantalla completa, comprueba **los hermanos del
`main`**, no solo lo que hay dentro:

```js
[...document.body.children].map((n) => `${n.tagName}.${n.className} h=${Math.round(n.getBoundingClientRect().height)}`);
```

---

## Cómo mirar y medir la pantalla de verdad

Esto no es opcional en una pantalla que tiene que caber entera: el ojo no
distingue "cabe" de "se pasa 40 px y el botón queda debajo de la cinta". Hay
que sacar números.

**Chrome de Windows no vale.** Desde WSL se lanza y arranca, pero no llega al
servidor de WSL: `localhost` no está reenviado y con la IP de WSL el firewall
de Windows devuelve `ERR_NETWORK_ACCESS_DENIED`. Se pierde media hora.

Lo que sí funciona: el Chromium que Playwright ya tiene en caché. Le falta una
librería de audio que se saca sin permisos de administrador.

```bash
# 1. La librería que falta, extraída sin instalar nada
apt-get download libasound2t64 && dpkg-deb -x libasound2t64_*.deb ext
export LD_LIBRARY_PATH="$PWD/ext/usr/lib/x86_64-linux-gnu:$LD_LIBRARY_PATH"

# 2. El binario (chrome-headless-shell pide menos dependencias que chrome)
ls ~/.cache/ms-playwright/chromium_headless_shell-*/chrome-headless-shell-linux64/

# 3. Para conducirlo
npm i puppeteer-core
```

Y el detalle que lo cambia todo:

```js
await pagina.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
```

`libs/animaciones.js` atiende `prefers-reduced-motion` y deja todo en su estado
final. Sin eso, `gsap.from()` pone los elementos a `opacity: 0` y la captura
sale con media página en blanco: parece que está rota y no lo está. Es mucho
más fiable que pelearse con `--virtual-time-budget`.

La medida que importa, con el servidor de producción levantado (`next build &&
next start`, no `dev`):

```js
await pagina.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
const m = await pagina.evaluate(() => {
  const cuerpo = document.querySelector(".puerta > div.flex.min-h-0");
  return {
    scrollDeLaPagina: document.documentElement.scrollHeight - innerHeight, // tiene que ser 0
    cuerpoDesborda: cuerpo.scrollHeight - cuerpo.clientHeight,             // tiene que ser 0
  };
});
```

Los cuatro tamaños que hay que pasar, y por qué:

| Tamaño | Qué representa |
|---|---|
| 390 × 844 | iPhone normal; el caso principal |
| 360 × 800 | Android común, el más repetido |
| 360 × 640 | gama baja / iPhone SE; el que revienta |
| 1440 × 800 | portátil; el que revienta por poco alto, no por poco ancho |

Aparte, para las páginas largas (tienda, ficha, muro) sigue valiendo una
ventana muy alta y mirarla entera: los fallos de la capa de demo son secciones
que no aparecen, y esas no dan error en consola.

La cookie de la puerta es `httpOnly`, así que para ver lo que hay **detrás**
hay que ponerla con `page.setCookie()` usando la huella que calcula
`libs/acceso.js`, o levantar con `NEXT_PUBLIC_DEMO=false`.
