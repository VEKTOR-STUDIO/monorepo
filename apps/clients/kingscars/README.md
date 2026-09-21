# DealerNauta Cars · vehículos y camiones

Página de inventario para **DealerNauta Cars**, un concesionario con **dos
sedes** y **dos cuentas de Instagram**:

| Cuenta | Sede | Qué vende | Teléfono |
|---|---|---|---|
| [@dealernautacars](https://www.instagram.com/dealernautacars/) · 68,4 K seguidores, 1.107 publicaciones | San Antonio de los Altos, Miranda | Camiones nuevos y usados. *"N.º 1 en venta de camiones a nivel nacional"* | 0414-2097517 |
| [@dealernautacarsccs](https://www.instagram.com/dealernautacarsccs/) | Los Chaguaramos, Caracas | Vehículos 0 km y usados. *"Tu dealer de vehículos y camiones"* | 0424-1388112 |

Sus piezas repiten tres frases: *"Tu vehículo soñado convertido en realidad"*,
*"+6 años siendo el N.º 1 en el mercado"* y *"Compra · Venta · Consignación"*,
que es lo que dice el arco de su emblema.

Base: plantilla Shipfast del monorepo · Next.js 15 (App Router) · Tailwind 4 +
daisyUI 5 · GSAP 3. Sin base de datos: el inventario es un JSON.

---

## De dónde sale todo

Esta página no se diseñó de cero: se calcó de su material, que está guardado en
`docs/fuentes/` (fuera de `public/`, para que no se sirva en la web).

| Archivo | Qué aportó |
|---|---|
| `public/marca/dealernauta-cars.jpg` | El **emblema**, tal cual, a 1.080 px: su foto de perfil. De ahí salen el naranja, la plata y el reparto del rótulo. |
| `docs/fuentes/instagram-dealernautacarsccs.png` | La cuadrícula de la sede de Caracas: **los seis modelos con su año y su kilometraje**, las frases de portada y la gráfica de sus piezas. |
| `docs/fuentes/instagram-dealernautacars.png` | La bio, las cifras, el WhatsApp publicado, las marcas que mueven y la cuadrícula de camiones. |

Todas sus publicaciones montan la misma escena, de arriba abajo: **cielo
naranja → la ciudad recortada → asfalto → el vehículo encima**, con el modelo en
condensada arriba a la izquierda, el emblema al otro lado y una **pastilla
naranja** con el año y el kilometraje al pie. **Esa escena es la identidad**, y
la web la hereda entera: es `components/Escenario.js`. Ver el comentario de
cabecera de `app/globals.css`.

---

## Lo que NO se pudo traer, y por qué

Esto es lo primero que hay que leer antes de enseñar la demo, porque es lo que
el cliente va a preguntar.

**Instagram no deja leer las publicaciones.** Comprobado, no supuesto: un `curl`
al perfil devuelve un muro de acceso y la API web responde `require_login`. Por
eso:

| Qué falta | Qué hay en su lugar | Cómo se arregla |
|---|---|---|
| **Las fotos.** Cero fotos suyas en el proyecto | Cada ficha dibuja la **plantilla de sus propios posts** (`components/PlantillaPublicacion.js`): cielo, ciudad, asfalto y la silueta de la carrocería | Que carguen las suyas, o `tools/instagram` (abajo) |
| **8 de las 14 unidades** | Unidades de muestra entre **las marcas que ellos mueven**, marcadas con `"deMuestra": true` | Cargar el inventario real |
| **Todos los precios** | Referencias de mercado, marcadas con `"precioProvisional": true` | Cargar los precios reales |

Lo que **sí** es suyo: las **seis primeras unidades** salen de la cuadrícula de
@dealernautacarsccs con su modelo, su año y su kilometraje tal como los escribe
el cartel de cada post (Frontlander 2026 0 km, Serie 76 2026 0 km sincrónico,
GAZ Gazelle 2022 ambulancia, Corolla SEG 2.0 2024 7.000 km, Agya 2026 0 km
automático, 4Runner 2026 0 km Off Road).

Meter fotos de banco de imágenes haciéndolas pasar por suyas habría quedado más
lucido y habría sido mentira. La página lo dice en voz alta en tres sitios: el
aviso de la portada, `AvisoPrecioProvisional` y `AvisoDeMuestra`.

### Traer el inventario real

El monorepo tiene `tools/instagram`, que sí lee las publicaciones, pero
**necesita un `sessionid`** de una cuenta secundaria de Instagram en
`tools/instagram/.env.local`. Hoy ese archivo no existe. Con él:

```bash
node tools/instagram/leer-perfil.mjs dealernautacarsccs --max 80
node tools/instagram/bajar-fotos.mjs tools/instagram/salida/dealernautacarsccs.json \
     --destino apps/clients/dealernautacars/public/vehiculos
```

Y luego pasar cada `caption` a ficha **leyéndolo**, que es como está pensado: el
script no interpreta los textos a propósito.

---

## Estado

| Pieza | Estado |
|---|---|
| Portada con la escena de la casa (cielo, ciudad, asfalto) | ✅ listo |
| Inventario completo desfilando de lado (GSAP, con `pin`) | ✅ listo |
| Corte **vehículos / camiones** | ✅ listo, es el filtro principal |
| Las **dos sedes**, cada una con su teléfono, su Instagram y su WhatsApp | ✅ listo |
| Inventario con filtros (segmento, condición, carrocería, marca, orden) | ✅ listo |
| Ficha por unidad, con URL propia | ✅ listo |
| Precio en $ con equivalente en Bs. (tasa BCV del día) | ✅ listo, sin configurar nada |
| Contacto y formulario | ✅ listo, **no reenvía a ningún sitio todavía** |
| Modo demo (puerta, muro, precio, bloqueos) | ✅ activo por defecto |
| Emblema, paleta y tipografía | ✅ sacados de su material |
| Contador de oferta limitada | ✅ con fecha real, **revísala antes de enseñarla** |
| **Fotos reales** | ⏳ **pendiente — hoy se dibuja la plantilla de sus posts** |
| **Inventario real** | ⏳ **pendiente — 6 de 14 salen de su Instagram, el resto son de muestra** |
| **Precios reales** | ⏳ **pendiente — hoy son de referencia** |
| **Dominio** | ⏳ pendiente — hoy `dealernautacars.com` es de trabajo |
| **El correo de sus piezas** | ⏳ pendiente — no se lee bien en la captura, hay que pedírselo |
| **Panel de administración** | ⏳ no existe; la portada lo anuncia como parte de lo que se vende |

El **WhatsApp sí es real**: `584142097517` sale del enlace de la bio de
@dealernautacars, y el de Caracas (`584241388112`) del teléfono impreso en sus
publicaciones. En modo demo **no se usa**, a propósito (ver abajo).

---

## Modo demo

Esta página se le enseña a DealerNauta antes de vendérsela. Con el modo demo
activo se ve casi todo, pero no se puede **usar**.

**El candado está en el servidor, no en la pantalla.** Una portada tapada con
CSS se quita con F12 en diez segundos, y justo quien evalúa comprar un sistema
es quien sabe abrir las herramientas del navegador.

| Qué corta | Dónde | Qué pasa |
|---|---|---|
| Ver cualquier página | `middleware.js` | Sin la cookie de acceso, **307 a `/entrar`**. No se sirve ni una página. |
| Entrar | `app/api/entrar/route.js` | Compara huellas SHA-256, espera 600 ms por fallo y deja una cookie `httpOnly`. |
| El inventario completo | `app/vehiculos/page.js` | Se ven `config.demo.elementosVisibles` (6) nítidas; el resto, difuminado tras `MuroDemo`. |
| Enviar el formulario | `app/api/contacto/route.js` | **403**, aunque se llame a mano con `curl`. |
| Escribir por una unidad | `components/BotonContacto.js` | No abre WhatsApp: explica qué haría el sistema entregado, y a qué sede escribiría. |

Ese último corte **no es cosmético aquí**: los dos números son reales y están
publicados por ellos, así que si el botón abriera de verdad, cualquiera que esté
probando la demo les estaría mandando pedidos falsos.

La contraseña **no está en `config.js`** —ese archivo lo importan componentes
de cliente y acabaría en el bundle—: vive en `libs/acceso.js`, que solo corre
en servidor, y la pisa `DEMO_PASSWORD`. Si la variable falta, se usa la de
reserva (`dealernauta2026`), para que la demo **nunca quede abierta por un
olvido**.

Comprobarlo, no suponerlo:

```bash
grep -rl "<la-clave>" .next/static/   # no debe devolver nada
```

La huella de la cookie lleva el nombre del cliente como sal
(`dealernauta-cars::acceso::…`), así que aunque dos demos acabaran con la misma
contraseña, la cookie de una no vale en la otra.

### Apagarlo el día de la entrega

```bash
NEXT_PUBLIC_DEMO=false
```

Eso solo: desaparecen la puerta, la franja de arriba, el muro del inventario,
el aviso flotante, los cintillos, el bloque de venta y la comparación con
Instagram; y el formulario y los botones de WhatsApp empiezan a funcionar. No
hay nada más que tocar en el código.

---

## Las dos voces de la página

Aquí conviven dos cosas y el visitante tiene derecho a saber cuál está leyendo:

- **El escaparate**, que le habla a quien viene a comprar un carro o un camión.
  Va con la tipografía de la casa (Barlow Condensed itálica, Archivo).
- **La oferta**, que le habla al dueño de DealerNauta sobre el sistema que se le
  está vendiendo. Va en **Microgramma**, la tipografía de la firma de
  Alessandrovaru, la misma del crédito del pie.

Entre una y otra se cruza un `Cintillo`, que no es decoración: es el aviso de
que cambia el interlocutor.

En **la puerta** (`/entrar`) la jerarquía se invierte y manda la firma de
Alessandrovaru: quien llega todavía no es cliente de DealerNauta, es alguien a
quien se le está enseñando un trabajo. Al entrar, vuelve a mandar su marca.

La objeción que contesta `SeccionPorQue` **es la suya**, no una genérica: *"¿y
para qué, si ya tengo Instagram?"*. Con 68,4 K seguidores esa pregunta es justa,
así que la sección empieza reconociendo que les funciona, y el argumento es
otro: Instagram es un río —lo de hoy tapa lo de ayer— y esto es el almacén
donde queda todo. Y la cuenta no es suya; el dominio sí.

---

## Diseño

Todo está comentado en `app/globals.css`, pero en corto:

- **Fondo negro.** Su emblema está calado sobre negro puro y sus piezas usan el
  negro como respiro entre naranjas. Una web clara habría sido otra marca.
- **El naranja no decora, señala.** Es el precio, el botón, la condición "0 km"
  y el cielo de la portada. Si llenara la pantalla dejaría de ser un cielo y
  sería un fondo de color.
- **La plata es el tercer color**, no un gris cualquiera: las dos alas del
  emblema son plateadas, y aquí esa plata es la de los bordes y los filetes.
- **Arcos, no esquinas.** El logotipo son dos alas curvas y un arco de texto,
  así que el radio único de la casa sube a `0.375rem` y las etiquetas de año y
  kilometraje son **pastillas redondas** (`.pastilla`), como al pie de sus
  posts.
- **El ángulo es casi horizontal**, −11° (`--angulo-dn` en CSS, `ANGULO` en
  `libs/animaciones.js`; los dos tienen que ir a la par). En el emblema las
  alas están tumbadas, no cortadas en diagonal dura.
- **Las imágenes se enseñan enteras**, sin recortar: sus posts son cuadrados y
  ya llevan el modelo rotulado. De ahí que `FotoVehiculo` use `object-contain`
  por defecto.
- **Nada se le superpone a la imagen.** Las cuatro esquinas de sus
  publicaciones están ocupadas, así que la etiqueta de condición va **debajo**.

Los botones **no van sesgados** aunque las etiquetas sí: un `skewX` sobre el
botón inclina también su texto, que ya viene inclinado por la itálica, y salían
dos pendientes peleándose.

### El logotipo

- `public/marca/dealernauta-cars.jpg` es su emblema tal cual, a 1.080 px.
- Su **fondo negro se recorta con el filtro SVG `marca-alfa`**, declarado una
  sola vez en `app/layout.js`: el alfa sale del brillo del píxel, así que el
  negro desaparece y el naranja, la plata y el blanco se quedan.
  **No se usa `mix-blend-mode: screen`**: el blend mezcla con el contexto de
  apilamiento del padre y se apaga en cuanto un ancestro tiene `z-index`,
  `opacity` o `backdrop-filter` —la puerta de acceso, sin ir más lejos—, y
  volvía el recuadro negro. Al filtro le da igual dónde esté.
- `components/MarcaDealernauta.js` redibuja en vector el **gesto** del emblema
  —las dos alas y el perfil del deportivo—, para cuando hace falta grande o
  pequeño. El escudo completo, con el arco de texto y las estrellas, a tamaño de
  cabecera es una mancha. Si se toca, hay que mirarlo **al tamaño en que se
  usa**.
- Los favicons son ese gesto reducido a lo que sobrevive a 32 px: el ala naranja
  y las siglas `DC` que van dentro del carro de su logotipo.

---

## Animación (GSAP)

Todo pasa por `libs/animaciones.js`, que registra los plugins una vez y fija
los tiempos y curvas de la casa. Las piezas:

| Componente | Qué hace |
|---|---|
| `TituloAnimado` | El titular asoma **línea a línea** desde detrás de una máscara (SplitText con `mask: "lines"`). |
| `Revelar` | Las entradas por scroll. Seis variantes; `corte` entra recortado en diagonal. |
| `Escenario` | Las alas llegan barriendo y luego se deslizan a distinta velocidad; la ciudad se desplaza más despacio, como al pasar por delante. |
| `CarruselCatalogo` | Las fichas desfilan de lado con la sección **anclada** (`pin` + `scrub`). |
| `Parallax` | Las imágenes se mueven más despacio que el texto. |
| `Cifra` | Los números de la portada suben contando. |
| `BarraProgreso` | El hilo naranja de arriba. |
| `Header` | Se esconde al bajar, vuelve al subir. |

Tres cosas que **no** son negociables y están puestas a propósito:

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
de la caja de la línea y en español se comería la tilde de "CAMIÓN" o de
"CONSIGNACIÓN". El hueco se lo da `.linea-titulo-mask` en `app/globals.css`.

---

## Cargar el inventario real

`data/vehiculos.json`, un objeto por unidad. Campos que importan:

```jsonc
{
  "slug": "toyota-frontlander-2026",  // la URL: /vehiculo/<slug>
  "segmento": "auto",                 // "auto" | "camion"  ← el corte principal
  "sede": "caracas",                  // "caracas" | "san-antonio"; manda el WhatsApp
  "precio": 33900,                    // en dólares
  "precioProvisional": true,          // QUITAR al poner el precio real
  "deMuestra": true,                  // QUITAR: marca las unidades que no son suyas
  "condicion": "nuevo",               // "nuevo" (0 km) | "usado"
  "carroceria": "suv",                // suv | sedan | pickup | camion | furgon
  "km": 0,                            // null si no se sabe → "Km por confirmar"
  "estado": "disponible",             // "disponible" | "reservado" | "vendido"
  "destacado": true,                  // sale en el escaparate de la portada
  "detalles": ["Año 2026", "0 km", "Automático"],   // la pastilla de sus posts
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

Y ojo con `segmento`: es lo que decide a qué WhatsApp escribe el botón de la
ficha (`sedeDe()` en `libs/demo.js`). Un camión mal marcado manda al comprador
a la sede equivocada.

---

## Antes de entregar

```bash
NEXT_PUBLIC_DEMO=false npm run dev   # ¿vuelve a ser el sistema entero?
npx next build && npx next lint      # ¿sigue compilando?
```

Y la lista corta:

- [ ] Inventario real (o `tools/instagram` con un `sessionid`) y quitar `deMuestra`
- [ ] Fotos reales en `public/vehiculos/` y rellenar `fotos` de cada unidad
- [ ] Precios reales y quitar `precioProvisional` de cada unidad
- [ ] Confirmar el correo que sale en sus piezas (no se lee en la captura)
- [ ] `domainName` / `SITE_URL` con el dominio de verdad
- [ ] `DEMO_PASSWORD` propia antes de repartir el enlace
- [ ] `demo.precio` / `demo.precioAnterior` confirmados (hoy $690 / $990)
- [ ] `demo.urlCompra` (hoy vacío → los botones llevan a `/contacto`)
- [ ] `demo.ofertaHasta` con una fecha que todavía no haya pasado
- [ ] Enganchar `app/api/contacto/route.js` al canal que elija el cliente
- [ ] Repasar `/tos` y `/privacy-policy` con el cliente

---

## Desarrollo

```bash
pnpm install
pnpm --filter dealernautacars dev     # http://localhost:3000
pnpm --filter dealernautacars build
pnpm --filter dealernautacars generate-favicon   # rehace los iconos
```

Variables de entorno (`.env.local`, y hay un `.env.example` al lado):

```bash
DEMO_PASSWORD=          # contraseña de la puerta; sin ella, la de reserva
NEXT_PUBLIC_DEMO=       # "false" para entregar el sistema completo
SITE_URL=               # dominio, para el sitemap y el SEO
```
