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

## 3. `transform` o `filter` rompen `mix-blend-mode`

**Síntoma:** un logo que se fundía con el fondo aparece dentro de un recuadro
negro.

Cualquiera de los dos crea un contexto de apilado, y dentro de él la fusión
deja de ver el fondo de la página. GSAP los deja puestos en línea al terminar
(`transform: translate(0px, 0px)`), aunque no muevan nada.

**Arreglo:** `clearProps: "filter,transform"` en el tween.

Para diagnosticarlo, mira los estilos que quedan en el DOM en vez de adivinar:

```bash
chrome --headless --dump-dom URL | grep -oE 'data-x="logo"[^>]{0,160}'
```

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

## Cómo mirar la pantalla sin navegador

En WSL, Chrome de Windows sirve para capturar:

```bash
CHROME="/mnt/c/Program Files/Google/Chrome/Application/chrome.exe"
"$CHROME" --headless=new --disable-gpu --no-sandbox \
  --window-size=1280,5200 --virtual-time-budget=14000 \
  --screenshot="C:\\temp\\captura.png" "http://localhost:3000/"
```

Dos avisos:

- **La ventana alta captura la página entera.** Los fallos de esta capa son
  secciones que faltan; con 1000 px solo ves el hero y no te enteras.
- **El tiempo virtual adelanta temporizadores pero no frames**, así que GSAP se
  queda congelado en el fotograma 0 y parece que todo está roto. Si necesitas
  ver el estado final, sirve la página por un proxy que cambie
  `requestAnimationFrame` por `setTimeout`. Lo mismo vale para meter la cookie
  de la puerta, que es `httpOnly` y no se puede poner desde Chrome.
