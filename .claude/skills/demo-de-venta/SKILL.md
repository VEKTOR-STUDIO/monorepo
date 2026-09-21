---
name: demo-de-venta
description: Convierte una app de cliente del monorepo (apps/clients/*) en una demo de venta cerrada, para enseñársela a posibles clientes sin regalarles el trabajo — puerta con contraseña, muro que corta el contenido, acciones bloqueadas en el servidor y bloque de precio. Úsala siempre que se hable de enseñar, mostrar o presentar un proyecto a alguien que aún no lo ha pagado; de "ponerle contraseña", "que no entre cualquiera", "modo demo", "versión de muestra", "cerrar la demo", "que se vea pero no se pueda usar"; o de vender un sistema ya construido. También sirve para quitar la demo el día que el cliente compra, y para llenar la demo con el catálogo real del negocio traído desde su Instagram.
---

# Demo de venta

Alessandro construye sistemas para clientes y luego los enseña a otros posibles
clientes para venderlos otra vez. Esta skill añade a una app ya hecha la capa
que permite enseñarla sin regalarla: se ve casi todo, no se puede usar nada, y
en cada pantalla hay una vía para comprarla.

La implementación de referencia, funcionando, está en
`apps/clients/aprovechalo-ve`, que es la más completa; `hardcore-fitness` tiene
la versión anterior, más sobria. Léelas cuando necesites el código exacto de
una pieza en vez de reescribirlo de memoria.

## La idea que sostiene todo

**El candado va en el servidor, nunca en la pantalla.** Una portada tapada con
un overlay, un botón deshabilitado o un `hidden` se quitan con F12 en diez
segundos. Quien esté evaluando comprar el sistema es justo quien tiene el
perfil para abrir las herramientas del navegador. Cada corte tiene que estar
en el middleware, en una server action o en una ruta de API.

Corolario práctico: por cada cosa que bloquees en la interfaz, pregúntate quién
la bloquea en el servidor. Si la respuesta es "nadie", no está bloqueada.

## El contenido que se enseña

Una demo llena de fotos de stock se nota, y lo que resta no es la foto: es la
credibilidad de todo lo demás. La versión que vende enseña el catálogo real del
negocio al que se la estás enseñando —sus vehículos, sus fotos, sus textos— y
quien la abre deja de imaginar si aquello le serviría.

Casi todos estos negocios ya tienen el catálogo publicado en Instagram. Para
traerlo está `tools/instagram/`; léelo antes de usarlo.

```bash
node tools/instagram/leer-perfil.mjs <cuenta> --max 80
node tools/instagram/bajar-fotos.mjs tools/instagram/salida/<cuenta>.json \
     --destino apps/clients/<cliente>/public/<carpeta>
```

Hace falta una cookie de sesión y no hay forma de evitarlo: Instagram cerró
todas las puertas anónimas —la API contesta `require_login` y el embed devuelve
la app sin una sola foto—. De dónde sacarla, y a qué ritmo usarla para que no
limiten la cuenta, está en el README de la herramienta.

El script deja el `caption` **crudo a propósito**. Traducir «RAV4 2019 full
equipo 32mil negociable» a una ficha lo haces tú leyéndolo, no un regex: un
año mal adivinado en el inventario de un cliente se descubre en la primera
pregunta de la reunión.

Dos cosas que esta capa hace posibles, y que van juntas:

- **Lo que no salga de la cuenta, márcalo.** En `aprovechalo-ve` los vehículos
  inventados llevan `"muestra": true`, y las fotos de stock `"fotoStock": true`,
  que pinta el aviso «Foto de referencia». Enseñar sin avisar un vehículo que
  el negocio no tiene es justo el detalle que hunde una reunión que iba bien.
- **La puerta es lo que te permite usar material ajeno.** Contraseña más
  `noindex` significa que el catálogo de un negocio no acaba indexado en Google
  colgando de tu dominio. El corolario incómodo: si algún día apagas la demo
  con contenido de un tercero dentro, vacía el catálogo antes de abrirla.

## Qué construir

Siete piezas. Las tres primeras son el esqueleto; el resto es la venta.

| Pieza | Archivo | Para qué |
|---|---|---|
| Interruptor | `libs/demo.js` | `esDemo()`, enlace de compra, mensaje de bloqueo, datos de ejemplo |
| Puerta | `libs/acceso.js` + `middleware.js` + `app/entrar/` + `app/api/entrar/` + `components/PantallaAcceso.js` | contraseña antes de servir nada, y el escaparate donde se vende |
| Cortes | en cada server action y ruta de API | que la demo no escriba |
| Franja | `components/demo/BarraDemo.js` | "esto es una demo, se vende, $X" |
| Muro | `components/demo/MuroDemo.js` | corta el contenido y pide comprar |
| Cierre | `components/demo/BloqueVenta.js` | qué incluye y cuánto cuesta |
| Aviso | `components/demo/AvisoFlotante.js` | asoma al bajar media página |

Más dos auxiliares que evitan repetir: `BotonComprar.js` (el CTA, en un solo
sitio, para que cambiar el enlace sea cambiar una línea) y `AvisoBloqueado.js`
(el cartel de "esto no se puede hacer aquí").

## Orden de trabajo

Antes del paso 1, el contenido: una demo se enseña mucho mejor llena del
catálogo real del negocio (arriba).

### 1. Configurar antes de construir

En `config.js` del cliente, un bloque `demo`:

```js
demo: {
  activa: process.env.NEXT_PUBLIC_DEMO !== "false",
  precio: "$490",
  precioAnterior: "$690",     // vacío → sin precio tachado ni sello de rebaja
  precioNota: "Pago único · instalación incluida",
  // Fecha REAL de fin de oferta, no una cuenta atrás que se reinicia en cada
  // visita: eso es truco de tienda barata y quien evalúa comprar un sistema lo
  // descubre recargando. Cuando pasa, el contador se va y la rebaja también.
  ofertaHasta: "2026-10-15T23:59:59-04:00",
  urlCompra: "",              // vacío → los botones llevan a /contacto
  textoBoton: "Quiero el sistema",
  elementosVisibles: 12,      // cuántos se ven antes del muro
  incluye: ["...", "..."],    // lo que se lleva quien compre
}
```

`precioAnterior`, `ofertaHasta` e `incluye` los usan a la vez la puerta, la
franja y el bloque de venta. Están en un solo sitio para que no haya dos
verdades que mantener: el sello de descuento se calcula a partir de los dos
precios en vez de escribirse a mano.

`activa` por defecto en `true` y se apaga con `NEXT_PUBLIC_DEMO=false`. Nace
cerrada a propósito: si el valor por defecto fuera "abierta" y alguien
olvidara la variable al desplegar, el sistema quedaría expuesto. Que el
descuido lleve al lado seguro.

**La contraseña no va en `config.js`.** Ese archivo lo importan componentes de
cliente, así que Next lo empaqueta para el navegador y la clave acabaría a la
vista en las DevTools. Va en `libs/acceso.js`, que solo corre en servidor.
Compruébalo antes de dar por buena la puerta:

```bash
grep -rl "<la-clave>" .next/static/   # no debe devolver nada
```

### 2. La puerta

Lee `references/puerta.md`. Lo que no se puede improvisar:

- La huella de la cookie se calcula con **Web Crypto** (`crypto.subtle`), no
  con `node:crypto`: el middleware corre en el runtime edge y `node:crypto` no
  existe ahí.
- La cookie guarda la **huella SHA-256**, no la contraseña. Falsificarla exige
  conocer la clave, que es justo lo que queremos.
- `httpOnly: true`, para que ni un script de la propia página pueda leerla.
- El corte va **al principio del middleware**, antes que la lógica de sesión,
  y deja pasar solo `/entrar`, `/api/entrar`, `/_next` y los archivos que la
  pantalla necesita para pintarse.
- Medio segundo de espera en cada intento fallido: irrelevante para una
  persona, incómodo para un script.
- El destino al que volver se valida (`destinoSeguro`): sin eso tienes un
  redirector abierto hacia cualquier dominio.
- La huella lleva el **nombre del cliente como sal** (`<cliente>::acceso::…`):
  si dos demos acaban con la misma contraseña, la cookie de una no vale en la
  otra.
- `/entrar` va con `dynamic = "force-dynamic"` y metadata **noindex**: sin lo
  primero, Next puede servir la puerta cacheada a quien ya tiene cookie; sin lo
  segundo, la demo del cliente acaba en Google.

Y dos cosas de forma que no son decoración:

- **Cabe en una pantalla, sin scroll.** Es la única pantalla que se ve seguro;
  lo que quede bajo el pliegue no lo lee nadie. El armazón (`h-svh`, columna
  flex, cintas `shrink-0`, `m-auto`), el ritmo vertical en `vh` y el orden en
  que se caen las piezas cuando no caben están en `references/puerta.md`.
- **Se mide, no se mira.** El ojo no distingue "cabe" de "se pasa 40 px y el
  botón queda debajo de la cinta". El método que funciona —Chromium de la
  caché de Playwright, `prefers-reduced-motion` emulado y cuatro tamaños— está
  en `references/trampas.md`.

Y lo que cambió de raíz: **la puerta no es un login, es el escaparate.** Quien
recibe el enlace puede no pasar de ahí —no tiene la clave a mano, la pierde,
mira desde el móvil—, así que es la única pantalla que se ve seguro. Además del
campo de la contraseña lleva la insignia de edición, la lista de lo que
incluye, el precio con el anterior tachado, el sello de descuento, la cuenta
atrás y la firma con enlace. Todo sale de `config.demo`, así que no hay nada
que mantener por duplicado.

Ahí la jerarquía de marca **se invierte**: manda la firma de Alessandrovaru y
no la del cliente, porque quien llega todavía no es cliente del negocio, es
alguien a quien se le está enseñando un trabajo. Al entrar, vuelve a mandar la
marca del cliente.

Aun así, recuerda que todo eso es solo la cara del candado.

### 3. Los cortes

Aquí es donde se gana o se pierde. Patrón:

```js
// En el guardián que ya usen las acciones
async function exigirEscritura() {
  if (esDemo()) throw new Error(MENSAJE_BLOQUEADO);
  return exigirLectura();
}
```

Y en cada ruta de API que escriba:

```js
if (esDemo()) {
  return NextResponse.json({ error: "Esto es una demo." }, { status: 403 });
}
```

Tres decisiones que marcan la diferencia entre una demo que vende y una que
no:

**Deja funcionando lo que solo lee.** En Hardcore, analizar un PDF y ver qué
cambiaría sí funciona en demo; aplicarlo, no. Es lo que de verdad diferencia
al sistema y se puede enseñar sin riesgo. Busca el equivalente en cada
proyecto: la parte que impresiona y no escribe.

**Nada de tocar datos reales.** Si el panel lee pedidos, clientes o mensajes,
en demo **ni siquiera hagas la consulta**. No basta con ocultarlos: el día que
alguien conecte la base de datos con la demo encendida, se filtrarían. Devuelve
datos de ejemplo y márcalos como tales en pantalla.

**Que nada salga hacia el cliente real.** Si el sistema manda WhatsApp, correos
o webhooks, córtalo. Un desconocido probando la demo no puede hacerle llegar
pedidos falsos al negocio.

### 4. La venta

- **Franja** arriba, fina, siempre visible, con el precio y el botón.
- **Muro**: enseña los primeros N elementos nítidos y difumina el resto
  *dejándolo en el HTML*, con `pointer-events-none`, `select-none` y
  `aria-hidden`. Que se vea que hay más detrás es el argumento; poder leerlo,
  no. Recorta el alto para que no queden metros de negro debajo.
- **Cierre** al final de las páginas principales: qué incluye y cuánto cuesta.
- **Aviso flotante** al pasar media página, descartable y que no vuelva en la
  sesión. Insistir después de un "no" solo estorba. Quítalo del panel y de la
  puerta: en uno ya hay un aviso y en la otra todavía no hay a quién venderle.

Donde el sistema bloquee algo, no digas solo "desactivado": explica qué haría
el sistema de verdad. Un bloqueo bien redactado vende; uno seco, frustra.

### 5. La firma

El crédito va en **Microgramma**, la tipografía de la firma de Alessandrovaru,
en `components/FooterFoot.js` montado una vez en el layout raíz. La convención
está en `apps/clients/roll-prep/components/rollprep/FooterFoot.js`; cópiala tal
cual en vez de inventar una nueva.

### 6. Documentar la salida

En el README del cliente, una sección de modo demo con la tabla de qué corta y
cómo se apaga (`NEXT_PUBLIC_DEMO=false`). El día que compren, apagarlo tiene
que ser una variable, no una arqueología por el código.

## Comprobar que funciona

No te fíes de la pantalla. Con el servidor levantado:

```bash
# Sin cookie, todo redirige a la puerta
curl -s -o /dev/null -w "%{http_code} %{redirect_url}\n" http://localhost:3000/

# Cuerpo mal formado: 400, sin reventar la ruta
curl -s -X POST localhost:3000/api/entrar -H "Content-Type: application/json" \
  -d 'no-es-json' -w " [%{http_code}]\n"

# Clave incorrecta
curl -s -X POST localhost:3000/api/entrar -H "Content-Type: application/json" \
  -d '{"clave":"loquesea"}' -w " [%{http_code}]\n"

# Clave correcta: guarda la cookie y entra
curl -s -c /tmp/c.txt -X POST localhost:3000/api/entrar \
  -H "Content-Type: application/json" -d '{"clave":"LA-BUENA"}'
curl -s -b /tmp/c.txt -o /dev/null -w "%{http_code}\n" http://localhost:3000/

# Cookie falsificada: rechazada
curl -s -H "Cookie: <cliente>_acceso=0000" -o /dev/null -w "%{http_code}\n" localhost:3000/tienda

# La ruta que escribe, bloqueada aunque se llame a mano
curl -s -X POST localhost:3000/api/<la-que-escriba> -d '{}' -w " [%{http_code}]\n"
```

Y las dos que se olvidan siempre:

```bash
NEXT_PUBLIC_DEMO=false npm run dev   # ¿vuelve a ser el sistema entero?
npx next build && npx next lint      # ¿sigue compilando?
```

Mira la página entera, de arriba abajo, no solo el primer pantallazo. Los
fallos de esta capa suelen ser secciones que no aparecen, y esas no dan error
en consola.

Y la puerta, además, se mide: en 390×844, 360×800, 360×640 y 1440×800, con
`scrollHeight - clientHeight` a cero en los cuatro. Cómo montar el navegador
que hace falta, en `references/trampas.md`.

## Trampas

`references/trampas.md` tiene ocho que ya costaron caro en este monorepo:
secciones que se quedan invisibles para siempre, tildes que desaparecen, logos
que dejan de fundirse, builds que se caen por una API externa, una columna de
grid que se estira a 1616 px en un móvil de 390, y un pie que el layout raíz
cuelga debajo de tu pantalla completa. Léelo antes de dar el trabajo por
terminado; todas fallan en silencio.
