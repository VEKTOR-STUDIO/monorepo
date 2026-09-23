---
name: video-de-venta
description: Crea el video corto de venta (20 s, vertical 9:16 y horizontal 16:9) de una app de `apps/clients/*` con el estudio de Remotion de `apps/video` — un montaje con la identidad del cliente que le enseña al dueño SU web en un teléfono y termina en el enlace de la demo publicada, el precio y la firma «Hecho por Alessandrovaru de Vektor». Úsala siempre que se hable de un "video", "reel", "clip", "historia", "animación" o "algo para mandar por WhatsApp o Instagram" de una demo o de un cliente; de añadir una marca nueva a los videos de concesionarios; de re-renderizar porque cambió el precio, el dominio, el inventario o el crédito; de hacer un montaje para otro tipo de negocio (tienda, coach, clínica, cursos) a partir del de concesionarios; o de por qué un render de Remotion falla. También sirve para revisar un video ya hecho sacando fotogramas sin renderizarlo entero.
---

# Video de venta

Cada demo de `apps/clients` se enseña con dos cosas: el enlace publicado en
Vercel (ver `publicar-en-vercel`) y un video de 20 segundos que se manda junto
al enlace por WhatsApp. El video no es un anuncio del negocio a su público: **le
habla al dueño** y le vende la web que ya está hecha para él. Esta skill cubre
cómo se hace ese video para un cliente nuevo y cómo se mantiene el de uno viejo.

La implementación de referencia, con trece marcas funcionando, está en
`apps/video/src/projects/concesionarios/`. Léela cuando necesites el código
exacto de una pieza en vez de reescribirlo de memoria; la mayoría de lo que
sigue es el porqué de cada decisión, no el código.

## Lo que sostiene todo

**Un montaje, muchas marcas.** El video es un solo componente (`VentaWeb.tsx`)
parametrizado por marca. Lo que cambia entre clientes —paleta, tipografía de
titulares, logo, inventario, copy del diferencial, dominio— vive en datos
(`marcas.ts`, `inventario.ts`), no en escenas duplicadas. Añadir un cliente es
añadir una entrada, no copiar una carpeta. Si te encuentras copiando escenas
para cambiarles un color, te has salido del camino.

**Todo lo que dice el video es verdad y sale de la demo.** La paleta es la de su
`globals.css`, la letra de titulares la de su `layout.js`, el tagline y la
ciudad los de su `config.js`, el inventario el de su `data/vehiculos.json`, el
precio el de `config.demo` de todas las demos ($740 tachado → $449, ver
[[precio-demo-monorepo]] en memoria) y el enlace es el alias real de Vercel.
Quien recibe el video va a abrir el enlace acto seguido: si el video promete
algo que la demo no enseña, la venta se cae en ese clic.

**Primero su marca, la nuestra pequeña.** El dueño tiene que reconocerse en el
primer segundo: su logo, su nombre, su lema, su color. La firma de la casa va
arriba y pequeña en la portada («Alessandrovaru de Vektor presenta») y vuelve
grande al final («Hecho por Alessandrovaru de Vektor», con los dos dominios).
Los dos nombres, siempre, en Microgramma: es el mismo crédito que llevan la
puerta y el pie de cada demo (ver [[credito-vektor-microgramma]]).

## El estudio

`apps/video` es un proyecto de Remotion que aloja varios **proyectos** de video,
uno por cliente o por familia de clientes, cada uno como una carpeta en la barra
lateral del estudio:

```
apps/video/
├── remotion.config.ts          códec, CRF 16, concurrencia y la regla que incrusta fuentes
├── public/<proyecto>/          imágenes servidas por HTTP (logos, fotos)
└── src/
    ├── lib/                    de la casa, compartido: useStage() (la unidad u), anim.ts
    └── projects/
        ├── index.ts            EL REGISTRO: una línea por proyecto
        ├── concesionarios/     el montaje de venta, 13 marcas  ← la referencia
        └── roll-prep/          videos de contenido de un cliente (otro género)
```

Dentro de `concesionarios/`:

| Archivo | Qué es |
| --- | --- |
| `marcas.ts` | Una entrada por cliente: identidad, dominio, diferencial. |
| `inventario.ts` | Las cuatro unidades que enseña el teléfono, por marca. |
| `types.ts` | `Marca`, `Unidad`, `Logo`: lo que puede y no puede variar. |
| `fonts.ts` | Las tipografías, incrustadas en el bundle. `FAMILIAS` es el catálogo. |
| `components/` | Primitivas de marca: `Fondo`, `Tipos` (Titular, Voz, Etiqueta), `Logo`, `Telefono`, `Silueta`, `Columna`. |
| `video/timeline.ts` | Las cinco escenas y su duración; `TOTAL` se calcula solo. |
| `video/VentaWeb.tsx` | El montaje: una `<Sequence>` por escena y un barrido entre ellas. |
| `video/escenas/` | Una escena por archivo. |
| `index.tsx` | Dos composiciones por marca (`<id>-vertical`, `<id>-wide`) en su carpeta. |

Arranque y render:

```bash
pnpm --filter @alessandrovaru/video run dev        # el estudio, en http://localhost:3000
pnpm --filter @alessandrovaru/video run lint       # tsc --noEmit
scripts/render-concesionarios.sh vertical kingscars  # un video; sin marca, las trece
```

## El guion de cinco escenas

Veinte segundos justos, iguales para todas las marcas. Cambiar una duración en
`timeline.ts` recoloca las demás.

| # | Escena | Dura | Qué cuenta |
| --- | --- | --- | --- |
| 01 | La marca | 3 s | Logo, nombre en su letra, lema y ciudad. Arriba, pequeño: «Alessandrovaru de Vektor presenta». |
| 02 | Lo que pasa hoy | 3,4 s | Sus seguidores de Instagram y la pregunta: ¿dónde ven tu inventario? Sin seguidores, un `problema` propio en `marcas.ts`. |
| 03 | Su web | 6,6 s | Un teléfono con SU web: portada, inventario, ficha y botón de WhatsApp. Es la escena más larga porque es lo que se vende. |
| 04 | Diferencial | 3,3 s | El corte de su negocio en dos a cuatro palabras grandes (consignación, crédito, subastas, camiones…). |
| 05 | Cierre | 3,7 s | El enlace de su demo, $740 tachado → $449 y la firma. |

El orden no es decorativo: reconocimiento → dolor → solución → por qué esta y
no otra → cómo comprarla. Si un negocio no encaja en una escena, se ajusta el
contenido de esa escena en sus datos, no se cambia el orden.

## Los dos caminos

### A. Es un concesionario o vende vehículos → una marca más

El montaje ya existe. El trabajo es de datos y assets, y está descrito paso a
paso en [`references/marca-nueva.md`](references/marca-nueva.md). En resumen:

1. Entrada en `marcas.ts` con la identidad sacada de SU web (paleta en hex,
   tipografía de titulares, tagline, ciudad, seguidores, logo, diferencial).
2. El `dominio` es el alias de producción del proyecto en Vercel, leído con el
   MCP (`get_project` → primer valor de `domains`). No se compone a mano: a
   Veloce le tocó `veloce-autos-nine.vercel.app` y un enlace inventado manda al
   dueño a un 404.
3. Cuatro unidades en `inventario.ts`, copiadas de su `data/vehiculos.json`:
   primero las destacadas, luego las que tienen foto, carrocerías variadas.
4. Logo en `public/concesionarios/<id>/logo.jpg` (su avatar de Instagram) y las
   fotos que la demo ya tenga; donde no hay foto, la silueta de su carrocería,
   igual que hace su web.
5. Si su tipografía de titulares es nueva, la TTF en `assets/fonts/`, una
   entrada en `FAMILIAS` y una línea `face()` en `fonts.ts`, con el peso exacto
   que usa su `.display`.
6. Su id en la lista del `render-concesionarios.sh`, fotogramas de prueba,
   render y registro en el README de `apps/video`.

### B. Es otro tipo de negocio → un montaje nuevo a partir de este

Una tienda, un coach, una clínica o una plataforma de cursos no enseñan
"inventario" en el teléfono, pero el guion de cinco escenas les sirve igual: lo
que cambia es qué se ve en la escena 03 y cómo se formula el diferencial. El
camino es crear un proyecto hermano (`src/projects/<familia>/`) copiando la
arquitectura de `concesionarios`, no sus escenas una a una. Está detallado en
[`references/montaje-nuevo.md`](references/montaje-nuevo.md).

Lo que se conserva sin discutir: la unidad `u`, los dos formatos desde el mismo
código, el barrido entre escenas, Microgramma y Questrial como voz de la casa,
el precio de `config.demo`, la firma con los dos nombres y el enlace real de
Vercel. Lo que se rehace: los tipos (`Marca`, y lo que sustituya a `Unidad`),
la escena 03 (qué pantalla de SU web se recorre) y la 04.

## Cómo están hechas las escenas

- **Una unidad para los dos formatos.** `useStage()` devuelve `u`, el 1 % del
  lado corto. Un titular de `9 * u` mide lo mismo en 1080×1920 y en 1920×1080;
  lo único que cambia es cuánto sitio hay en el eje largo, y cada escena lee
  `vertical` para apilar o poner en fila. Por eso las dos composiciones
  comparten el 100 % del código.
- **Nada conoce su posición absoluta.** Cada escena anima desde su frame 0
  dentro de su `<Sequence>`; `timeline.ts` decide dónde cae.
- **Las animaciones son las de `lib/anim.ts`**: `riseIn`, `slamIn`, `flyIn`,
  `progress`, `countTo`, `shake`, `breathe`. Cortes secos con `Barrido`, sin
  crossfades.
- **La tipografía se ajusta al texto, no al revés.** Microgramma es extendida:
  un dominio de 33 caracteres o «Alessandrovaru de Vektor» no caben a tamaño
  fijo en 9:16. `tamEtiqueta(texto, tope, vertical ? 56 : 110)` y
  `tamParaCaber()` devuelven el tamaño que sí cabe; úsalos en todo lo que
  venga de datos (nombres, dominios, la firma).
- **Las fuentes van incrustadas en el bundle**, con un `@font-face` normal y
  sin `delayRender`. Servirlas por HTTP o esperar `FontFace.load()` a mano
  tumbaba renders largos; con esto el peor caso es un frame con la letra de
  respaldo, no un render muerto.

## Verificar antes de renderizar

Un render entero son unos 30 s por video; un fotograma, dos segundos. Mira
primero la portada y el cierre en los dos formatos, que es donde están el
nombre, el dominio y la firma, es decir, lo que más cambia entre marcas:

```bash
cd apps/video
npx remotion bundle --out-dir=dist
npx remotion still dist <id>-vertical /tmp/portada.png --frame=60
npx remotion still dist <id>-vertical /tmp/cierre.png  --frame=595   # el último tramo del cierre
npx remotion still dist <id>-wide     /tmp/cierre-w.png --frame=595
```

Ábrelos y comprueba: que el nombre cabe en una línea (o en las que
`nombreCorto` reparte), que el dominio se lee entero, que la firma dice
«Alessandrovaru de Vektor» con los dos dominios debajo, y que el logo no sale
sobre un fondo del color equivocado. Si la marca tiene tema claro, `claro: true`
en `marcas.ts` cambia velos y sombras; sin él, el logo se pierde.

Luego el render:

```bash
scripts/render-concesionarios.sh vertical <id>     # out/concesionarios/<id>-vertical.mp4
scripts/render-concesionarios.sh wide <id>
```

Y `pnpm run lint` antes de dar por terminado: el estudio es TypeScript y un
campo que falte en `Marca` se ve ahí, no en el render.

## Cuándo se re-renderiza

El video es una foto de la demo en un momento. Hay que renderizarlo otra vez
cuando cambia cualquiera de estas cosas, y solo entonces:

- el precio de las demos (`escenas/Cierre.tsx`, `PRECIO`),
- el crédito o la firma (`Cierre.tsx` y `Portada.tsx`),
- el dominio de una marca (compró dominio propio, o cambió el alias de Vercel),
- su inventario real (llegaron fotos o precios de verdad),
- su identidad (rehízo el logo o la paleta de la web).

Un cambio que toca a todas (precio, firma) se renderiza para todas con el
script sin argumentos; un cambio de una marca, solo esa.

## Trampas

- **`Marca desconocida: <id>`** al renderizar: el id de la composición y el de
  `marcas.ts` no coinciden, o falta el registro en `src/projects/index.ts`.
- **El aviso de `zod` («Version mismatch… installed 3.x, required 4.x»)** sale
  en cada comando y no rompe nada. Ignóralo; no actualices paquetes para
  quitarlo en medio de un render.
- **`Failed to launch the browser process`** en Linux: faltan librerías del
  Chrome sin cabeza. `sudo apt-get install -y libnss3 libnspr4 libasound2t64`.
  En este WSL hay una copia de `libasound.so.2` en
  `~/.cache/wadoom-pdf/lib`, que sirve como `LD_LIBRARY_PATH` si no hay sudo
  (ver [[capturar-puertas-wsl]]).
- **El estudio abre en blanco con `431 Request Header Fields Too Large`**: son
  las cookies de Supabase de los clientes Next en `localhost`. Los scripts ya
  llevan `NODE_OPTIONS=--max-http-header-size=65536`; si lo lanzas a mano,
  ponlo tú o borra las cookies de `localhost`.
- **Un render antiguo en `out/` no se distingue de uno nuevo** más que por la
  fecha. Tras cambiar algo común, comprueba con `ls -la` que se regeneraron
  las trece y no solo la que probaste.
- **El `folder` de un proyecto solo admite `[A-Za-z0-9-]`.** Con acentos o
  espacios el estudio no arranca.
- **No inventes inventario ni fotos.** Donde la demo tiene silueta, el video
  tiene silueta. Un video con fotos de stock que la web no tiene es la misma
  mentira que una demo llena de stock, y se nota igual.
- **taller-bmw no tiene video** a propósito: es la plantilla de ShipFast, no
  un negocio. Tampoco lo tienen las apps sin demo de venta (vitalform,
  roll-prep, legion-mma, frank-manzano).

## Después

1. Registra el video en el README de `apps/video` (sección «Videos
   publicados»): qué es, cómo se renderiza y de dónde salen sus datos.
2. Deja en memoria lo que no se deduce del código: qué marcas tienen video,
   qué dato era provisional (inventario de muestra, dominio de Vercel) y qué
   habría que cambiar el día que el cliente compre.
3. El video se manda por WhatsApp junto al enlace de la demo y su contraseña,
   nunca solo: el cierre promete un enlace que tiene que abrir.
