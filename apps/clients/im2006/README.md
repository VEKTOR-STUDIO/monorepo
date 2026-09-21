# LM 2006 · concesionario de vehículos y camiones

Página de catálogo para **LM 2006**
([@lm2006.ccs](https://www.instagram.com/lm2006.ccs/) · 9.179 seguidores,
47 publicaciones), un concesionario de **Los Chaguaramos, Caracas** que en su
bio se presenta así:

> 🚙 Concesionario de Vehículos y Camiones
> 🚗 Compra • Venta • Consignación
> 🇻🇪 Los Chaguaramos – Calle Sanz / Caracas

Base: plantilla Shipfast del monorepo · Next.js 15 (App Router) · Tailwind 4 +
daisyUI 5 · GSAP 3. Sin base de datos: el catálogo es un JSON.

---

## De dónde sale todo

Esta página no se diseñó de cero: se calcó de su propio material, que está
guardado en `docs/fuentes/` (fuera de `public/`, para que no se sirva en la
web):

| Archivo | Qué aportó |
|---|---|
| `lm2006-foto-perfil.jpg` | El **logotipo**. De ahí salen los cuatro colores, medidos pixel a pixel, y el ángulo de **−12°**, medido sobre el borde del bloque azul. |
| `instagram-perfil-1.png` / `-2.png` | La **bio**, las cifras del perfil, los destacados (Sinotruk, Contacto, Horario, Ubicación) y **nueve unidades** con su marca, modelo, año y línea de ficha técnica. |

Su plantilla de publicación es siempre la misma: grafito de fondo, el logotipo
arriba a la izquierda, una barrita vertical azul junto al nombre de la marca,
el modelo y el año en condensada pesada, la línea técnica debajo, la unidad
fotografiada en el galpón —con los hexágonos del techo detrás— y las tres
barras de remate al pie. **Esa plantilla es la identidad**, y la web la hereda
entera. Ver el comentario de cabecera de `app/globals.css`.

---

## Estado

| Pieza | Estado |
|---|---|
| Portada con las barras de la casa | ✅ listo |
| Catálogo completo desfilando de lado (GSAP, con `pin`) | ✅ listo |
| Corte **vehículos / camiones** | ✅ listo, es el filtro principal |
| Inventario con filtros (segmento, tipo, marca, orden) | ✅ listo |
| Ficha por unidad, con URL propia | ✅ listo |
| Precio en $ con equivalente en Bs. (tasa BCV del día) | ✅ listo, sin configurar nada |
| Contacto y formulario | ✅ listo, **no reenvía a ningún sitio todavía** |
| Modo demo (puerta, muro, precio, bloqueos) | ✅ activo por defecto |
| Logotipo en vector, paleta y tipografía | ✅ sacados de su material |
| Contador de oferta limitada | ✅ con fecha real, **revísala antes de enseñarla** |
| **Las fotos de las unidades** | ⏳ **pendiente — Instagram limitó las peticiones** |
| **Precios reales** | ⏳ **pendiente — hoy son de referencia salvo uno** |
| **Número de WhatsApp** | ⏳ pendiente — los botones caen al DM de Instagram |
| **Dominio** | ⏳ pendiente — hoy `lm2006.com` es de trabajo |
| **Panel de administración** | ⏳ no existe; la portada lo anuncia como parte de lo que se vende |

### Falta leer el perfil entero, y faltan las fotos

Las nueve unidades del catálogo son suyas de verdad —marca, modelo, año y
ficha técnica copiados literalmente de sus publicaciones— pero salen de leer a
mano la **parte visible de su cuadrícula**, no el perfil completo. Su cuenta
tiene **47 publicaciones**, así que el catálogo de verdad es más largo.

Y no hay ni una foto suya: Instagram devolvió `429` por límite de IP en los dos
intentos de lectura del perfil.

Las dos cosas se arreglan con el mismo comando. Cuando el límite se levante (un
par de horas; insistir lo alarga):

```bash
node tools/instagram/leer-perfil.mjs lm2006.ccs --max 60
node tools/instagram/bajar-fotos.mjs tools/instagram/salida/lm2006.ccs.json \
     --destino apps/clients/im2006/public/vehiculos
```

Después, leyendo el JSON que queda en `tools/instagram/salida/`: se completan
las unidades que falten y a cada una se le pone su archivo en `fotos` y se le
quita `fotoPendiente`. **Los avisos desaparecen solos**
(`hayFotosPendientes()` en `libs/vehiculos.js`).

El `caption` del JSON viene **crudo a propósito**: pasarlo a ficha se hace
leyéndolo, no con un regex. Un año mal adivinado en el inventario de un cliente
se descubre en la primera pregunta de la reunión.

Mientras tanto cada ficha dibuja la **silueta** de su carrocería
(`components/Silueta.js`) y la página lo dice en voz alta en la portada. Es a
propósito: meter fotos de banco de imágenes en el inventario de un
concesionario es justo el detalle que hunde una reunión que iba bien.

### Los precios son de referencia (salvo uno)

Sus publicaciones casi nunca traen precio. El único publicado es el del
**Corolla HEV 2026: 36.500 $**, y ese es el que lleva la ficha.

Los otros ocho son de referencia de mercado, puestos para que la página se
pueda enseñar funcionando, y cada unidad lo dice con `"precioProvisional":
true`. Eso enciende el aviso «Precio de referencia» en la ficha, en el
inventario y en la portada. **Al cargar los precios reales se quita ese campo
de cada unidad y los avisos desaparecen solos**
(`hayPreciosProvisionales()`).

### Lo que no se inventó

Sus publicaciones no declaran color, puestos, tracción ni documentos. Esos
campos están en `null` a propósito y la fila correspondiente **no se pinta**
(`EspecificacionesCompletas` filtra los vacíos). En cuanto los carguen,
aparecen sin tocar código.

---

## El corte del catálogo: vehículos y camiones

Aquí está la diferencia de fondo con el resto de concesionarios del monorepo.
El primer filtro **no** es «0 km / usado»: es **vehículos / camiones**.

Tres razones, y ninguna es de gusto:

1. Es la primera línea de su bio.
2. Tienen un destacado del perfil dedicado entero a **Sinotruk**.
3. Quien entra a comprar un Corolla y quien entra a comprar un chasis de
   quince toneladas no son el mismo comprador ni de lejos.

Vive en `SEGMENTOS` (`libs/vehiculos.js`) y manda en la portada, en los
filtros, en la cabecera, en el pie y en las unidades relacionadas de cada
ficha. La condición (0 km / usado) baja a filtro secundario y **solo aparece
cuando hay de las dos** — hoy todo el catálogo es 0 km, así que no se enseña.

La ficha también cambia según el segmento: en un camión, `Especificaciones`
sustituye el kilometraje por la **capacidad de carga**, porque es el dato por
el que se pregunta.

---

## Modo demo

Esta página se le enseña al dueño de LM 2006 antes de vendérsela. Con el modo
demo activo se ve casi todo, pero no se puede **usar**.

**El candado está en el servidor, no en la pantalla.** Una portada tapada con
CSS se quita con F12 en diez segundos, y justo quien evalúa comprar un sistema
es quien sabe abrir las herramientas del navegador.

| Qué corta | Dónde | Qué pasa |
|---|---|---|
| Ver cualquier página | `middleware.js` | Sin la cookie de acceso, **307 a `/entrar`**. No se sirve ni una página. |
| Entrar | `app/api/entrar/route.js` | Compara huellas SHA-256, espera 600 ms por fallo y deja una cookie `httpOnly`. |
| El inventario completo | `app/vehiculos/page.js` | Se ven `config.demo.elementosVisibles` (6) nítidos; el resto, difuminado tras `MuroDemo`. |
| Enviar el formulario | `app/api/contacto/route.js` | **403**, aunque se llame a mano con `curl`. |
| Escribir por una unidad | `components/BotonContacto.js` | No abre WhatsApp: explica qué haría el sistema entregado. |

La contraseña **no está en `config.js`** —ese archivo lo importan componentes
de cliente y acabaría en el bundle—: vive en `libs/acceso.js`, que solo corre
en servidor, y la pisa `DEMO_PASSWORD`. Si la variable falta, se usa la de
reserva (`lm2006caracas`), para que la demo **nunca quede abierta por un
olvido**.

Comprobarlo, no suponerlo:

```bash
grep -rl "<la-clave>" .next/static/   # no debe devolver nada
```

### Apagarlo el día de la entrega

```bash
NEXT_PUBLIC_DEMO=false
```

Eso solo: desaparecen la puerta, la franja de arriba, el muro del inventario,
el aviso flotante, los cintillos, el bloque de venta y la comparación con el
Instagram; y el formulario y los botones de WhatsApp empiezan a funcionar. No
hay nada más que tocar en el código.

---

## Las dos voces de la página

Aquí conviven dos cosas y el visitante tiene derecho a saber cuál está leyendo:

- **El escaparate**, que le habla a quien viene a comprar. Va con la tipografía
  de la casa (Barlow Condensed itálica, Archivo).
- **La oferta**, que le habla al dueño de LM 2006 sobre el sistema que se le
  está vendiendo. Va en **Microgramma** —la tipografía de la firma de
  Alessandrovaru, la misma del crédito del pie— y sus rótulos, sus cintillos,
  el sello de rebaja y los ticks de la comparación van **en rojo**.

El rojo marca dónde cambia el interlocutor, y no desentona porque también es
suyo: es la barra del medio de su logotipo.

**El azul no se reparte: es la acción.** Botones, enlaces y precios van en azul
en toda la página, incluido el botón de comprar. Se probó a pintar de rojo la
capa de venta entera y quedaba peor: dos colores de botón en la misma página se
leen como dos sistemas distintos, no como dos voces.

Entre una y otra se cruza un `Cintillo`, que no es decoración: es el aviso de
que cambia el interlocutor.

En **la puerta** (`/entrar`) la jerarquía se invierte y manda la firma de
Alessandrovaru: quien llega todavía no es cliente del concesionario, es alguien
a quien se le está enseñando un trabajo. Al entrar, vuelve a mandar la marca de
LM 2006.

---

## Diseño

Todo está comentado en `app/globals.css`, pero en corto:

- **Fondo grafito con degradado, no negro plano.** Es el de su logotipo y el de
  sus publicaciones. Un negro liso se vería más barato que su propio material.
- **Las tres barras mandan.** Plata, rojo y azul, en ese orden, con el azul
  mucho más ancho. Están en el fondo (`components/Diagonales.js`), en los
  acentos (`.banda`), en el remate de ancho completo (`.banda-ancha`, que es la
  cinta del pie de sus posts), en las etiquetas (`.bisel`) y en cómo entran las
  cosas al hacer scroll.
- **El ángulo es −12°** (`--angulo-lm`), medido sobre el borde del bloque azul
  del logotipo (78,3° respecto a la horizontal). No es un número redondo
  elegido a ojo, y a −15 o −18 deja de parecerse a su marca.
- **El azul señala, el rojo acompaña.** El azul es el precio, el botón y el
  enlace. El rojo es una sola barra estrecha en el logotipo y aquí se reserva
  para lo que avisa.
- **Las fotos se enseñan enteras**, sin recortar: son sus publicaciones y la
  gráfica es suya. De ahí que `FotoVehiculo` use `object-contain` por defecto.
- **Nada se le superpone a la foto.** Las cuatro esquinas de sus publicaciones
  están ocupadas —logotipo, modelo, ficha técnica y dirección—, así que la
  etiqueta de condición va **debajo** de la imagen, no encima.
- **Los hexágonos** de `.textura-panal` son el techo de su galpón, que sale
  detrás de cada unidad en sus fotos. Se reservan para las secciones que hablan
  del negocio: en todas dejarían de significar nada.

Los botones **no van sesgados** aunque todo lo demás sí: un `skewX` sobre el
botón inclina también su texto, que ya viene inclinado por la itálica, y salían
dos pendientes peleándose.

### El logotipo

- `components/MarcaLM.js` lo **redibuja en vector**: las tres barras, el bloque
  azul con "LM" dentro y "2006" al lado. Dos montajes, los dos suyos:
  `disposicion="linea"` (el de la esquina de sus publicaciones, y el que se usa
  por defecto) y `disposicion="apilada"` (su foto de perfil). El color de
  "2006" lo pone `currentColor`, así que funciona sobre claro y sobre oscuro.
- El texto del SVG lleva `textLength` + `lengthAdjust`: sin eso, entre que el
  navegador pinta con la tipografía de reserva y llega Barlow Condensed, las
  letras se salen del bloque azul en cada carga.
- `public/marca/lm2006-logo.jpg` es su foto de perfil a 256 px, que usa
  `<LogoChapa />`. Trae su propio fondo grafito, así que en círculo sobre esta
  página se lee como un emblema y no hace falta fundirla con ningún
  `mix-blend-mode`.
- Los iconos de pestaña los genera `scripts/generate-favicon.mjs`: las tres
  barras y "LM", sin el "2006" —a 32 px las cuatro cifras son una mancha gris
  que además le roba sitio al bloque azul—.

---

## Animación (GSAP)

Todo pasa por `libs/animaciones.js`, que registra los plugins una vez y fija
los tiempos y curvas de la casa. Las piezas:

| Componente | Qué hace |
|---|---|
| `TituloAnimado` | El titular asoma **línea a línea** desde detrás de una máscara (SplitText con `mask: "lines"`). |
| `Revelar` | Las entradas por scroll. Seis variantes; `corte` entra recortado en diagonal. |
| `Diagonales` | Los tríos de barras llegan disparados y luego se deslizan a distinta velocidad. |
| `CarruselCatalogo` | Las fichas desfilan de lado con la sección **anclada** (`pin` + `scrub`). |
| `Parallax` | Las fotos se mueven más despacio que el texto. |
| `Cifra` | Los números de la portada suben contando. |
| `BarraProgreso` | El hilo azul de arriba. |
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
de la caja de la línea y en español se comería la tilde de "ÚNICO" o de
"CATÁLOGO". El hueco se lo da `.linea-titulo-mask` en `app/globals.css`.

---

## Cargar unidades y precios

`data/vehiculos.json`, un objeto por unidad. Campos que importan:

```jsonc
{
  "slug": "toyota-corolla-cross-elite-18-2026",  // la URL: /vehiculo/<slug>
  "segmento": "vehiculos",               // "vehiculos" | "camiones"  ← el corte principal
  "carroceria": "suv",                   // suv | sedan | hatchback | pickup | camion | moto
  "condicion": "nuevo",                  // "nuevo" (0 km) | "usado"
  "precio": 39900,                       // en dólares
  "precioProvisional": true,             // QUITAR al poner el precio real
  "fotoPendiente": true,                 // QUITAR al bajar la foto
  "km": 0,                               // null si no se sabe → "Km por confirmar"
  "capacidad": "15 toneladas",           // solo camiones; sustituye al km en la ficha
  "estado": "disponible",                // "disponible" | "reservado" | "vendido"
  "destacado": true,                      // sale en el escaparate de la portada
  "detalles": ["Elite", "1.8L", "Automática"],  // su línea técnica, literal
  "fotos": ["/vehiculos/toyota-corolla-cross-elite-18-2026.jpg"]
}
```

Dos cuidados:

- **`km: null` no es cero.** Un 0 km lleva `0`; un usado del que no se sabe el
  kilometraje lleva `null` y la página escribe "Km por confirmar" en vez de
  inventarse un dato.
- **`detalles` es su línea técnica, copiada tal cual.** No se adorna ni se
  traduce: es lo que ellos escriben en el post y es lo que el cliente va a
  reconocer.

---

## Antes de entregar

```bash
NEXT_PUBLIC_DEMO=false npm run dev   # ¿vuelve a ser el sistema entero?
npx next build && npx next lint      # ¿sigue compilando?
```

Y la lista corta:

- [ ] **Bajar las fotos** de @lm2006.ccs y quitar `fotoPendiente` de cada unidad
- [ ] Precios reales y quitar `precioProvisional` (el Corolla HEV ya lo tiene)
- [ ] `business.whatsapp` en `config.js` (hoy vacío → DM de Instagram)
- [ ] `domainName` / `SITE_URL` con el dominio de verdad
- [ ] `DEMO_PASSWORD` propia antes de repartir el enlace
- [ ] `demo.urlCompra` (hoy vacío → los botones llevan a `/contacto`)
- [ ] `demo.ofertaHasta` con una fecha que todavía no haya pasado
- [ ] Enganchar `app/api/contacto/route.js` al canal que elija el cliente
- [ ] Repasar `/tos` y `/privacy-policy` con el cliente

---

## Desarrollo

```bash
pnpm install
pnpm --filter im2006 dev     # http://localhost:3000
pnpm --filter im2006 build
pnpm --filter im2006 generate-favicon   # rehace los iconos
```

Variables de entorno (`.env.local`, y hay un `.env.example` al lado):

```bash
DEMO_PASSWORD=          # contraseña de la puerta; sin ella, la de reserva
NEXT_PUBLIC_DEMO=       # "false" para entregar el sistema completo
SITE_URL=               # dominio, para el sitemap y el SEO
```
