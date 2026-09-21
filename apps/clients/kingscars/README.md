# Kings Cars · concesionario en el C.C.C.T.

Página de inventario para **Kings Cars** ([@kingscars.ccct](https://www.instagram.com/kingscars.ccct/)),
un concesionario de vehículos dentro del **Centro Comercial Ciudad Tamanaco**,
en Caracas. 902 publicaciones, 6.567 seguidores.

Su bio dice en tres líneas de qué va el negocio, y la web no intenta decirlo
mejor:

> ¿Comprar o vender tu vehículo? Para eso estamos.
> Publica tu vehículo gratis.
> 📍 Caracas | C.C.C.T · Previa cita.

Dos cosas de ahí mandan sobre toda la página:

- **Se compra Y se vende.** No es un catálogo con un formulario de contacto al
  final: son dos caminos de igual peso desde la portada, y vender tiene página
  propia (`/vender`) con su formulario de avalúo.
- **Se atiende con cita previa.** No hay horario publicado a propósito, y cada
  botón de contacto pide la cita en el mismo mensaje.

Base: plantilla Shipfast del monorepo · Next.js 15 (App Router) · Tailwind 4 +
daisyUI 5 · GSAP 3. Sin base de datos: el inventario es un JSON.

---

## De dónde sale todo

Esta página no se diseñó de cero: se calcó de su material, que está guardado en
`docs/fuentes/` (fuera de `public/`, para que no se sirva en la web).

| Archivo | Qué aportó |
|---|---|
| `public/marca/kings-cars.jpg` | El **emblema**, tal cual, a 1.080 px: su foto de perfil. De ahí salen la corona, el blanco y la losa de piedra del fondo. |
| `docs/fuentes/instagram-perfil.png` | La bio, las cifras, las destacadas (Clientes · Info · Ofertas · **Detailing** · Contacto · Ubicación) y las publicaciones fijadas, de donde sale la sección de vender. |
| `docs/fuentes/post-ficha-corolla-2006.png` | **La ficha de una unidad, entera**: el marco blanco, la corona al agua arriba, el rótulo del modelo y las tres tarjetas blancas de datos. Y el único vehículo real del inventario. |

---

## La identidad, en cinco reglas

Están escritas largo en la cabecera de `app/globals.css`; en corto:

- **La marca es MONOCROMA.** Su emblema no tiene un solo color: es una corona
  geométrica blanca calada sobre piedra. La web no le inventa uno.
- **El fondo no es negro, es PIEDRA.** Su avatar está sobre una losa gris
  veteada, no sobre negro plano. Eso es `.piedra` y `.piedra-vetas`.
- **El rojo SEÑALA y nada más.** En 902 publicaciones aparece contado: la
  palabra «CARRO» del post de vender y la aguja del velocímetro. Aquí hace lo
  mismo: precio, condición 0 km y la llamada a vender. El botón principal es
  **blanco**, no rojo, porque gastar el único color de acento en un botón es
  quedarse sin color para lo que importa.
- **Esquinas cortadas, no redondeadas.** Las letras de «KING CARS» tienen los
  vértices biselados y la corona está hecha de triángulos y rombos. De ahí
  `.faceta`, `.corte` (chaflán) y `.bisel`, `.filo` (el rombo de la base).
  `--angulo-kc: -16deg` es esa inclinación, y es la **única** de toda la marca:
  los titulares van a plomo, sin itálica.
- **Las tarjetas de datos SÍ se redondean.** Es la única excepción y es suya.

### La pieza de la casa

El pie de cada publicación suya lleva tres tarjetas blancas con **Kilometraje ·
Transmisión · Precio $**, con las etiquetas pequeñas arriba y el dato en negro
muy gordo debajo. Es lo que más se repite en toda la cuenta.

Aquí eso es `.tarjeta-dato` (`app/globals.css`) y `components/PlantillaPublicacion.js`,
con las mismas tres etiquetas, en el mismo orden y con los mismos formatos
—`161.000`, `AUT.`, `13.900,00` con sus dos decimales—. Es lo que hace que una
tarjeta se lea como un post de Kings Cars y no como una plantilla.

### El logotipo

- `public/marca/kings-cars.jpg` es su emblema tal cual, a 1.080 px.
- Su fondo de piedra **se recorta con el filtro SVG `marca-alfa`**, declarado
  una sola vez en `app/layout.js`. **El umbral es propio de este archivo**: el
  fondo no es negro puro sino una piedra gris con vetas claras, así que el corte
  está mucho más arriba que en el resto del monorepo (`0.7·(R+G+B) − 0.72`).
  Con el umbral de siempre la losa se quedaba medio visible y la corona salía
  dentro de un cuadrado gris. Si se toca, mírala sobre fondo claro: ahí se ve el
  halo.
- **No se usa `mix-blend-mode: screen`**: el blend mezcla con el contexto de
  apilamiento del padre y se apaga en cuanto un ancestro tiene `z-index`,
  `opacity` o `backdrop-filter` —la puerta de acceso, sin ir más lejos—. Al
  filtro le da igual dónde esté.
- `components/MarcaCorona.js` redibuja la corona en vector, para cuando hace
  falta grande, pequeña o de otro color. **Todos los huecos van con `evenodd`
  sobre un solo trazado**, porque la corona se pinta lo mismo sobre la losa que
  sobre una tarjeta o dentro de una ficha: rellenar los huecos del color del
  fondo funcionaría en un sitio y dejaría un parche gris en los otros tres.
- Los favicons son la corona sola (`scripts/generate-favicon.mjs`). A 16 px va
  **maciza**, sin rombos ni estrella: esos huecos miden ahí medio píxel.

### La tipografía

**Chakra Petch**, derecha y en mayúsculas. Es lo más cerca que se llega de
«KING CARS» con una tipografía libre: cuadrada, ancha y con los vértices
cortados. **Sin itálica nunca**: en su logotipo no hay una sola inclinación.

---

## Lo que NO se pudo traer, y por qué

Esto es lo primero que hay que leer antes de enseñar la demo, porque es lo que
el cliente va a preguntar.

**Instagram limitó las peticiones desde esta IP** mientras se montaba la página:
`tools/instagram` entró bien con la sesión (`@torneocaos`) y aun así devolvió
429 dos veces seguidas. Es un límite **de la IP, no de la cuenta**, y se quita
solo en un par de horas. Por eso:

| Qué falta | Qué hay en su lugar | Cómo se arregla |
|---|---|---|
| **Las fotos.** Cero fotos suyas en el proyecto | Cada ficha dibuja **la plantilla de sus propios posts** (`components/PlantillaPublicacion.js`): la losa, la corona al agua, la silueta, el rótulo y las tres tarjetas | `tools/instagram` (abajo) |
| **17 de las 18 unidades** | Unidades de muestra del mercado de usados de Caracas, marcadas con `"deMuestra": true` | Cargar el inventario real |
| **17 de los 18 precios** | Referencias de mercado, marcadas con `"precioProvisional": true` | Cargar los precios reales |
| **El WhatsApp** | Nada: `business.whatsapp` está **vacío** y los botones caen al DM de Instagram | Pedírselo |

Lo que **sí** es suyo: el **Toyota Corolla GLI 2006**, con su kilometraje
(161.000), su transmisión (automática) y su precio ($13.900,00) leídos de su
propia publicación. Es la única unidad sin `deMuestra` ni `precioProvisional`.

Meter fotos de banco de imágenes haciéndolas pasar por suyas habría quedado más
lucido y habría sido mentira. La página lo dice en voz alta en cuatro sitios: el
aviso de la portada, `AvisoPrecioProvisional`, `AvisoDeMuestra` y el pie del
bloque de venta.

### Traer el inventario real

```bash
node tools/instagram/leer-perfil.mjs kingscars.ccct --max 80
node tools/instagram/bajar-fotos.mjs tools/instagram/salida/kingscars.ccct.json \
     --destino apps/clients/kingscars/public/vehiculos
```

Necesita un `sessionid` en `tools/instagram/.env.local`, que ya está puesto. Con
sus 902 publicaciones de ahí sale el catálogo entero con fotos, y los captions
llevan el precio escrito (su tarjeta «Precio $» lo publica siempre).

Luego, pasar cada `caption` a ficha **leyéndolo**, que es como está pensado: el
script no interpreta los textos a propósito.

---

## Estado

| Pieza | Estado |
|---|---|
| Portada con la gráfica de la casa (losa, corona al agua, rombos) | ✅ listo |
| **Ficha calcada de sus posts** (marco, rótulo y las tres tarjetas) | ✅ listo |
| Corte **usados / 0 km** | ✅ listo, es el filtro principal |
| Página **«publica tu vehículo gratis»** (`/vender`) con formulario de avalúo | ✅ listo |
| Inventario completo desfilando de lado (GSAP, con `pin`) | ✅ listo |
| Inventario con filtros (condición, carrocería, marca, orden) | ✅ listo |
| Ficha por unidad, con URL propia | ✅ listo |
| Precio en $ con equivalente en Bs. (tasa BCV del día) | ✅ listo, sin configurar nada |
| Contacto y formularios | ✅ listos, **no reenvían a ningún sitio todavía** |
| Modo demo (puerta, muro, precio, bloqueos) | ✅ activo por defecto |
| Emblema, paleta y tipografía | ✅ sacados de su material |
| Contador de oferta limitada | ✅ con fecha real, **revísala antes de enseñarla** |
| **Fotos reales** | ⏳ **pendiente — hoy se dibuja la plantilla de sus posts** |
| **Inventario real** | ⏳ **pendiente — 1 de 18 sale de su Instagram** |
| **Precios reales** | ⏳ **pendiente — 17 de 18 son de referencia** |
| **El WhatsApp** | ⏳ **pendiente — no publican ninguno; hoy todo cae al DM** |
| **Dominio** | ⏳ pendiente — hoy `kingscars.com.ve` es de trabajo |
| **Panel de administración** | ⏳ no existe; la portada lo anuncia como parte de lo que se vende |

---

## Modo demo

Esta página se le enseña a Kings Cars antes de vendérsela. Con el modo demo
activo se ve casi todo, pero no se puede **usar**.

**El candado está en el servidor, no en la pantalla.** Una portada tapada con
CSS se quita con F12 en diez segundos, y justo quien evalúa comprar un sistema
es quien sabe abrir las herramientas del navegador.

| Qué corta | Dónde | Qué pasa |
|---|---|---|
| Ver cualquier página | `middleware.js` | Sin la cookie de acceso, **307 a `/entrar`**. No se sirve ni una página. |
| Entrar | `app/api/entrar/route.js` | Compara huellas SHA-256, espera 600 ms por fallo y deja una cookie `httpOnly`. |
| El inventario completo | `app/vehiculos/page.js` | Se ven `config.demo.elementosVisibles` (6) nítidas; el resto, difuminado tras `MuroDemo`. |
| Enviar el contacto | `app/api/contacto/route.js` | **403**, aunque se llame a mano con `curl`. |
| Pedir un avalúo | `app/api/vender/route.js` | **403**, igual. |
| Escribir por una unidad | `components/BotonContacto.js` | No abre nada: explica qué haría el sistema entregado. |

Esos cortes **no son cosméticos aquí**: Kings Cars atiende **con cita previa**,
así que un mensaje falso no es ruido, es una hora de local apartada para nadie.

La contraseña **no está en `config.js`** —ese archivo lo importan componentes de
cliente y acabaría en el bundle—: vive en `libs/acceso.js`, que solo corre en
servidor, y la pisa `DEMO_PASSWORD`. Si la variable falta, se usa la de reserva
(`corona2026`), para que la demo **nunca quede abierta por un olvido**.

Comprobado, no supuesto:

```bash
grep -rl "corona2026" .next/static/    # no devuelve nada
```

La huella de la cookie lleva el nombre del cliente como sal
(`kings-cars::acceso::…`), así que aunque dos demos acabaran con la misma
contraseña, la cookie de una no vale en la otra.

### Apagarlo el día de la entrega

```bash
NEXT_PUBLIC_DEMO=false
```

Eso solo: desaparecen la puerta, la franja de arriba, el muro del inventario,
el aviso flotante, los cintillos, el bloque de venta y la comparación con
Instagram; y los formularios y los botones de contacto empiezan a funcionar. No
hay nada más que tocar en el código.

---

## Las dos voces de la página

Aquí conviven dos cosas y el visitante tiene derecho a saber cuál está leyendo:

- **El escaparate**, que le habla a quien viene a comprar o a vender un carro.
  Va con la tipografía de la casa (Chakra Petch, Archivo).
- **La oferta**, que le habla al dueño de Kings Cars sobre el sistema que se le
  está vendiendo. Va en **Microgramma**, la tipografía de la firma de
  Alessandrovaru, la misma del crédito del pie.

Entre una y otra se cruza un `Cintillo`, que no es decoración: es el aviso de
que cambia el interlocutor.

En **la puerta** (`/entrar`) la jerarquía se invierte y manda la firma de
Alessandrovaru: quien llega todavía no es cliente de Kings Cars, es alguien a
quien se le está enseñando un trabajo. Al entrar, vuelve a mandar su marca.

La objeción que contesta `SeccionPorQue` **es la suya**: *"¿y para qué, si ya
tengo Instagram?"*. La fila que más pesa es la de **vender**: publican gratis el
carro de cualquiera y hoy eso solo lo sabe quien se lee la bio.

---

## Animación (GSAP)

Todo pasa por `libs/animaciones.js`, que registra los plugins una vez y fija los
tiempos y curvas de la casa. Aquí las cosas **no barren: asoman y se posan**, y
nada gira ni se inclina.

| Componente | Qué hace |
|---|---|
| `TituloAnimado` | El titular asoma **línea a línea** desde detrás de una máscara (SplitText con `mask: "lines"`). |
| `Revelar` | Las entradas por scroll. Seis variantes; `corte` entra recortado en diagonal. |
| `Escenario` | La losa, los rombos deslizándose y la corona al agua, cada capa a su velocidad. |
| `CarruselCatalogo` | Las fichas desfilan de lado con la sección **anclada** (`pin` + `scrub`). |
| `Parallax` | Las imágenes se mueven más despacio que el texto. |
| `Cifra` | Los números de la portada suben contando. |
| `BarraProgreso` | El hilo rojo de arriba. |
| `Header` | Se esconde al bajar, vuelve al subir. |

Tres cosas que **no** son negociables:

1. **Todo pasa por `contexto()`**, que usa `gsap.matchMedia`. Quien pida
   `prefers-reduced-motion: reduce` no ve ni un movimiento y los elementos se
   quedan **visibles**, no invisibles.
2. **`fromTo` y nunca `from`** para lo que entra. El CSS deja `[data-anima]` en
   `opacity: 0` para que no dé un salto al hidratar; `from` animaría de 0 a 0 y
   la sección no aparecería jamás.
3. **El carrusel se ancla solo en escritorio.** Secuestrar el scroll en un
   teléfono es de las peores cosas que se le pueden hacer a alguien que entró a
   ver carros; en móvil la misma lista se arrastra con el dedo.

Cuidado con el recorte de líneas y **las tildes**: `mask: "lines"` recorta a ras
de la caja de la línea y en español se comería la de "VEHÍCULO" o "AVALÚO". El
hueco se lo da `.linea-titulo-mask` en `app/globals.css`.

---

## Cargar el inventario real

`data/vehiculos.json`, un objeto por unidad. Campos que importan:

```jsonc
{
  "slug": "toyota-corolla-gli-2006",  // la URL: /vehiculo/<slug>
  "condicion": "usado",               // "usado" | "nuevo"  ← el corte principal
  "carroceria": "sedan",              // sedan | suv | hatchback | pickup | coupe
  "precio": 13900,                    // en dólares
  "precioProvisional": true,          // QUITAR al poner el precio real
  "deMuestra": true,                  // QUITAR: marca las que no son suyas
  "km": 161000,                       // null si no se sabe → "Km por confirmar"
  "transmision": "Automática",        // sale en la tarjeta del medio, como "AUT."
  "estado": "disponible",             // "disponible" | "reservado" | "vendido"
  "destacado": true,                  // sale en el escaparate de la portada
  "detalles": ["Año 2006", "161.000 km", "Automático"],
  "fotos": []                         // vacío → se dibuja la plantilla del post
}
```

Tres avisos que se apagan solos al rellenar los datos, sin tocar nada más:

| Campo | Qué enciende | Se apaga cuando |
|---|---|---|
| `precioProvisional` | «Precio de referencia» en ficha, inventario y portada | se quita de **todas** las unidades |
| `deMuestra` | «Unidad de muestra» y el conteo del aviso de la portada | se quita de **todas** las unidades |
| `fotos: []` | La plantilla dibujada y el «Aquí va tu foto» | hay al menos una ruta en `fotos` |

Ojo con `km`: **`null` no es cero**. Un 0 km lleva `0`; un usado del que no se
sabe el kilometraje lleva `null` y la página escribe "Km por confirmar" en vez
de inventarse un dato.

Y ojo con `transmision`: es lo que llena la tarjeta del medio de cada ficha. Si
falta, sale un guion donde su publicación pone "AUT." o "SINC.".

---

## Antes de entregar

```bash
NEXT_PUBLIC_DEMO=false npx next dev   # ¿vuelve a ser el sistema entero?
npx next build && npx next lint       # ¿sigue compilando?
```

Y la lista corta:

- [ ] Inventario real con `tools/instagram` y quitar `deMuestra` de cada unidad
- [ ] Fotos reales en `public/vehiculos/` y rellenar `fotos` de cada unidad
- [ ] Precios reales y quitar `precioProvisional` de cada unidad
- [ ] **El WhatsApp**: `business.whatsapp` y `whatsappVisible` están vacíos
- [ ] Confirmar si tienen correo (no publican ninguno)
- [ ] `domainName` / `SITE_URL` con el dominio de verdad
- [ ] `DEMO_PASSWORD` propia antes de repartir el enlace
- [ ] `demo.precio` / `demo.precioAnterior` confirmados (hoy $690 / $990)
- [ ] `demo.urlCompra` (hoy vacío → los botones llevan a `/contacto`)
- [ ] `demo.ofertaHasta` con una fecha que todavía no haya pasado
- [ ] Enganchar `app/api/contacto/route.js` y `app/api/vender/route.js` al canal
      que elija el cliente
- [ ] Repasar `/tos` y `/privacy-policy` con el cliente

---

## Desarrollo

```bash
pnpm install
pnpm --filter kingscars dev     # http://localhost:3000
pnpm --filter kingscars build
pnpm --filter kingscars generate-favicon   # rehace los iconos
```

Variables de entorno (`.env.local`, y hay un `.env.example` al lado):

```bash
DEMO_PASSWORD=          # contraseña de la puerta; sin ella, la de reserva
NEXT_PUBLIC_DEMO=       # "false" para entregar el sistema completo
SITE_URL=               # dominio, para el sitemap y el SEO
```
