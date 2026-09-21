# SUSU CARS · compra, venta y consignación de vehículos

Página de catálogo y consignación para **SUSU CARS**
([@susucars](https://www.instagram.com/susucars/) · también
[@susucarsoficial](https://www.instagram.com/susucarsoficial/)), en **Caracas,
Av. Casanova**, que en sus publicaciones se presenta así:

> **Vende tu vehículo en tiempo récord y con seguridad.**
> ¡Olvídate de complicaciones!
> · Consignaciones *(Sede Caracas, Av. Casanova)*
> · Seguridad garantizada *(máxima exposición y contacto)*
> · Venta rápida *(conectamos con el comprador ideal)*

Base: plantilla Shipfast del monorepo · Next.js 15 (App Router) · Tailwind 4 +
daisyUI 5 · GSAP 3. Sin base de datos: el catálogo es un JSON.

---

## De dónde sale todo

Esta página no se diseñó de cero: se calcó de su material.

| Fuente | Qué aportó |
|---|---|
| `public/marca/susu-logo.jpg` (su foto de perfil, 320 px) | **La identidad entera**: el negro, el oro, el trazo del deportivo y las capitales romanas. |
| Su publicación de consignación | El **titular de la portada**, el lema, los **tres pilares**, la sede y las dos cuentas. |

Dos cosas que **no** salieron de ahí y hay que cerrar antes de entregarla: el
catálogo (hoy es de muestra, ver abajo) y el número de WhatsApp.

### El eje del negocio no es el catálogo

Un concesionario cualquiera pone su inventario y ya. SUSU vende otra cosa:
**vender el tuyo sin complicaciones**. Por eso la web tiene dos entradas y no
una —comprar y consignar—, la sección de consignación va **antes** que el
catálogo, y el primer botón de la portada es "Consignar mi vehículo". Quien
llega desde su Instagram muchas veces no viene a comprar: viene a preguntar
cuánto le cobran por vender el suyo.

---

## Estado

| Pieza | Estado |
|---|---|
| Portada con su frase y su gráfica | ✅ listo |
| Sección de consignación con sus tres pilares | ✅ listo |
| Formulario que separa comprar / consignar | ✅ listo |
| Catálogo desfilando de lado (GSAP, con `pin`) | ✅ listo |
| Catálogo con filtros (condición, tipo, marca, orden) | ✅ listo |
| Ficha por vehículo, con URL propia | ✅ listo |
| Precio en $ con equivalente en Bs. (tasa BCV del día) | ✅ listo, sin configurar nada |
| Contacto y formulario | ✅ listo, **no reenvía a ningún sitio todavía** |
| Modo demo (puerta, muro, precio, bloqueos) | ✅ activo por defecto |
| Paleta, tipografía y logotipo | ✅ sacados de su logo |
| Contador de oferta limitada | ✅ con fecha real, **revísala antes de enseñarla** |
| **El catálogo** | ⏳ **de muestra — 13 fichas inventadas, sin una sola foto suya** |
| **Número de WhatsApp** | ⏳ pendiente de confirmar — los botones caen al DM de Instagram |
| **Cifras de Instagram** | ⏳ sin leer; la portada las omite sola |
| **Dominio** | ⏳ pendiente — hoy `susucars.com` es de trabajo |
| **Panel de administración** | ⏳ no existe; la portada lo anuncia como parte de lo que se vende |

### El catálogo es de muestra, y se nota a propósito

Las 13 fichas de `data/vehiculos.json` están **inventadas**. Llevan
`"muestra": true`, que enciende el aviso «Ficha de muestra» en la tarjeta, en
la ficha y en la portada, y desaparece solo al quitar el campo
(`hayVehiculosDeMuestra()` en `libs/vehiculos.js`).

**Y no hay ni una foto.** Las que traía la plantilla eran las trece páginas del
catálogo en PDF de *otro* concesionario, con su logotipo y su rojo impresos
encima: enseñar el inventario ajeno en la web de SUSU es justo el detalle que
hunde una reunión que iba bien, así que se borraron. En su lugar, cada ficha
dibuja la silueta de su tipo de vehículo con el cartel «Foto pendiente».

No es un apaño: es lo honesto mientras no haya material suyo, y se arregla en
diez minutos en cuanto Instagram deje leer el perfil.

### El número de WhatsApp está sin confirmar

En su publicación se lee **0412 133 5486** → `584121335486`. No está puesto en
`config.js` a propósito: la captura de la que salió tiene 283 px de ancho, y un
dígito mal transcrito manda a un desconocido al teléfono de otra persona.
Mientras `business.whatsapp` siga vacío, todos los botones caen al DM de
Instagram, que es por donde hoy escribe todo el mundo. Se rellena en cuanto el
cliente lo diga en voz alta.

---

## Cargar el catálogo real

El día que Instagram deje de limitar:

```bash
# Desde la raíz del monorepo. Necesita el sessionid de tools/instagram/.env.local
node tools/instagram/leer-perfil.mjs susucars --max 80
node tools/instagram/bajar-fotos.mjs tools/instagram/salida/susucars.json \
     --destino apps/clients/susu-cars/public/vehiculos
```

Y después, a mano: leer los `caption` y pasarlos a fichas. El script deja el
texto **crudo a propósito**; traducir «4Runner 2018 full equipo 39mil
negociable» a una ficha lo hace quien lo lee, no un regex. Un año mal adivinado
se descubre en la primera pregunta de la reunión.

Campos que importan en `data/vehiculos.json`:

```jsonc
{
  "slug": "toyota-4runner-2018",   // la URL: /vehiculo/<slug>
  "muestra": true,                  // QUITAR cuando la ficha sea real
  "precio": 39500,                  // en dólares
  "condicion": "usado",             // "nuevo" (0 km) | "usado"
  "consignado": true,               // false = unidad de la casa, no de un tercero
  "carroceria": "suv",              // "suv" | "sedan" | "pickup"
  "km": 74000,                      // null si no se sabe → "Km por confirmar"
  "estado": "disponible",           // "disponible" | "reservado" | "vendido"
  "destacado": true,                // sale en el escaparate de la portada
  "detalles": ["Un solo dueño", "Cauchos nuevos"],
  "fotos": ["/vehiculos/toyota-4runner-2018.jpg"]
}
```

Ojo con `km`: **`null` no es cero**. Un 0 km lleva `0`; un usado cuyo
kilometraje no se sabe lleva `null` y la página escribe "Km por confirmar" en
vez de inventarse un dato.

Y `consignado` por defecto es `true`: en esta casa lo normal es la
consignación, así que una ficha que se olvide el campo dice la verdad más
probable.

---

## Modo demo

Esta página se le enseña al dueño de SUSU antes de vendérsela. Con el modo demo
activo se ve casi todo, pero no se puede **usar**.

**El candado está en el servidor, no en la pantalla.** Una portada tapada con
CSS se quita con F12 en diez segundos, y justo quien evalúa comprar un sistema
es quien sabe abrir las herramientas del navegador.

| Qué corta | Dónde | Qué pasa |
|---|---|---|
| Ver cualquier página | `middleware.js` | Sin la cookie de acceso, **307 a `/entrar`**. No se sirve ni una página. |
| Entrar | `app/api/entrar/route.js` | Compara huellas SHA-256, espera 600 ms por fallo y deja una cookie `httpOnly`. |
| El catálogo completo | `app/vehiculos/page.js` | Se ven `config.demo.elementosVisibles` (6) nítidos; el resto, difuminado tras `MuroDemo`. |
| Enviar el formulario | `app/api/contacto/route.js` | **403**, aunque se llame a mano con `curl`. |
| Escribir por un vehículo | `components/BotonContacto.js` | No abre WhatsApp: explica qué haría el sistema entregado. |

La contraseña **no está en `config.js`** —ese archivo lo importan componentes
de cliente y acabaría en el bundle—: vive en `libs/acceso.js`, que solo corre
en servidor, y la pisa `DEMO_PASSWORD`. Si la variable falta, se usa la de
reserva (`susucars2026`), para que la demo **nunca quede abierta por un
olvido**.

Comprobarlo, no suponerlo:

```bash
grep -rl "<la-clave>" .next/static/   # no debe devolver nada
```

### Apagarlo el día de la entrega

```bash
NEXT_PUBLIC_DEMO=false
```

Eso solo: desaparecen la puerta, la franja de arriba, el muro del catálogo, el
aviso flotante, los cintillos, el bloque de venta y la comparación con
Instagram; y el formulario y los botones de WhatsApp empiezan a funcionar. No
hay nada más que tocar en el código.

**Antes de apagarla, vacía el catálogo de muestra.** Con la puerta puesta y
`noindex`, lo que hay dentro no acaba en Google; sin puerta, sí.

---

## Las dos voces de la página

Aquí conviven dos cosas y el visitante tiene derecho a saber cuál está leyendo:

- **El escaparate**, que le habla a quien viene a comprar un carro o a dejar el
  suyo. Va con la tipografía de la casa (Cinzel, Archivo).
- **La oferta**, que le habla al dueño de SUSU sobre el sistema que se le está
  vendiendo. Va en **Microgramma**, la tipografía de la firma de
  Alessandrovaru, la misma del crédito del pie.

Entre una y otra se cruza un `Cintillo`, que no es decoración: es el aviso de
que cambia el interlocutor.

En **la puerta** (`/entrar`) la jerarquía se invierte y manda la firma de
Alessandrovaru: quien llega todavía no es cliente de SUSU, es alguien a quien
se le está enseñando un trabajo. Al entrar, vuelve a mandar la marca de SUSU.

---

## Diseño

Todo está comentado en `app/globals.css`, pero en corto:

- **Fondo negro.** Su logotipo vive sobre negro y el oro solo brilla sobre
  oscuro: sobre blanco se apaga y se vuelve mostaza.
- **El oro no decora, señala.** Es el precio, el botón y el filete que separa.
  Usado de relleno dejaría de parecer oro y parecería amarillo. El único sitio
  donde llena es el cintillo de venta, que tiene que verse de lejos.
- **La línea manda, no el bloque.** El logotipo es un trazo fino, así que la
  gráfica de fondo son filetes de 1 px (`components/Filetes.js`), no bandas de
  color. Ninguno pasa de 2 px, y esa es la regla que lo mantiene en su sitio.
- **Capitales romanas en los titulares.** Cinzel es la letra de "SUSU" y es
  libre. De ahí que `.display` **no** lleve itálica: el logotipo está recto.
- **Casi nada se inclina.** `--angulo-susu` es −8°, y solo lo usan el sello de
  rebaja y los rombos de las cintas.

### Cuidado al cambiar la tipografía

Cinzel en caja alta ocupa **mucho más ancho** que una condensada. El titular de
la portada venía en `text-7xl` y se iba a cinco líneas; toda la escala de
`.display` está bajada dos escalones respecto a la plantilla original. Si se
cambia la letra, hay que volver a mirar los titulares, no solo el CSS.

Y las tildes: `line-height` está en 1.1 porque con 1.02 la tilde de "VEHÍCULO"
chocaba con la línea de encima. El hueco del recorte de SplitText lo da
`.linea-titulo-mask`.

### El logotipo

- `public/marca/susu-logo.jpg` es su foto de perfil, 320 px. Se usa **solo en
  la puerta**, donde va grande: en la cabecera, a 34 px, el logotipo completo
  —carro, "SUSU" y "CARS" uno encima de otro— es una mancha.
- `components/MarcaSusu.js` redibuja en vector el trazo del deportivo, que es
  lo que se reconoce a distancia. Ese es el que va en la cabecera, en el pie y
  en la portada. Si se toca, hay que mirarlo **al tamaño en que se usa**.
- Va en `stroke` y nunca en `fill`: el logotipo es una línea, y una silueta
  maciza sería otra marca.

---

## Animación (GSAP)

Todo pasa por `libs/animaciones.js`, que registra los plugins una vez y fija
los tiempos y curvas de la casa. Las piezas:

| Componente | Qué hace |
|---|---|
| `TituloAnimado` | El titular asoma **línea a línea** desde detrás de una máscara (SplitText con `mask: "lines"`). |
| `Revelar` | Las entradas por scroll. Seis variantes; `corte` entra recortado. |
| `Filetes` | Los trazos de oro se **dibujan** de lado a lado y luego se deslizan a distinta velocidad. |
| `CarruselCatalogo` | Las fichas desfilan de lado con la sección **anclada** (`pin` + `scrub`). |
| `Parallax` | Las fotos se mueven más despacio que el texto. |
| `Cifra` | Los números de la portada suben contando. |
| `BarraProgreso` | El hilo de oro de arriba. |
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

---

## Antes de entregar

```bash
NEXT_PUBLIC_DEMO=false npm run dev   # ¿vuelve a ser el sistema entero?
npx next build && npx next lint      # ¿sigue compilando?
```

Y la lista corta:

- [ ] Confirmar el WhatsApp con el cliente y ponerlo en `business.whatsapp`
- [ ] Cargar el catálogo real y quitar `"muestra"` de cada ficha
- [ ] Rellenar `business.seguidores` / `publicaciones` al leer el perfil
- [ ] `domainName` / `SITE_URL` con el dominio de verdad
- [ ] `DEMO_PASSWORD` propia antes de repartir el enlace
- [ ] `demo.urlCompra` (hoy vacío → los botones llevan a `/contacto`)
- [ ] `demo.ofertaHasta` con una fecha que todavía no haya pasado
- [ ] Enganchar `app/api/contacto/route.js` al canal que elija el cliente
- [ ] Repasar `/tos` y `/privacy-policy` con el cliente

La puerta, además, **se mide**: 390×844, 360×800, 360×640 y 1440×800, con
`scrollHeight - clientHeight` a cero en los cuatro. Trece píxeles de desborde
no se ven a ojo y dejan el botón debajo de la cinta; los dos umbrales de
`@media (height < …)` de `globals.css` están puestos con esa medida en la mano.

---

## Desarrollo

```bash
pnpm install
pnpm --filter susu-cars dev     # http://localhost:3000
pnpm --filter susu-cars build
pnpm --filter susu-cars generate-favicon   # rehace los iconos
```

Variables de entorno (`.env.local`, y hay un `.env.example` al lado):

```bash
DEMO_PASSWORD=          # contraseña de la puerta; sin ella, la de reserva
NEXT_PUBLIC_DEMO=       # "false" para entregar el sistema completo
SITE_URL=               # dominio, para el sitemap y el SEO
```
