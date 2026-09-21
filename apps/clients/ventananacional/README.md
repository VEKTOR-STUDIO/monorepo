# Venta Nacional · concesionaria de automóviles

Página para **Venta Nacional** ([@ventanacional](https://instagram.com/ventanacional/)
· 160 mil seguidores · 27.230 publicaciones), que en Instagram se presenta como
*"Concesionaria de automóviles · Barcelona, Anzoátegui / El Rosal, Caracas 📍 ·
COMPRA / VENTA / CONSIGNACIÓN / IMPORTACIÓN · 🏠 @VENTANACIONAL.INMUEBLES"*.

Es una concesionaria con **dos salas**, no un particular que vende por
Instagram: la página gira sobre el inventario, sobre las cuatro operaciones y
sobre en cuál de las dos salas está cada vehículo. La pata inmobiliaria se
reconoce al final y lleva a su cuenta hermana.

Base: plantilla Shipfast del monorepo · Next.js 15 (App Router) · Tailwind 4 +
daisyUI 5. Sin base de datos: el inventario es un JSON.

---

## Estado

| Pieza | Estado |
|---|---|
| Portada oscura y glasmórfica, con escaparate a pantalla completa | ✅ listo |
| Inventario con filtros (tipo, sala, marca, orden) | ✅ listo |
| Ficha por vehículo, con URL propia | ✅ listo |
| Las dos salas: filtro, etiqueta en cada ficha y sección propia | ✅ listo |
| Origen nacional / importado en cada vehículo | ✅ listo |
| Precio en $ con equivalente en Bs. (tasa BCV del día) | ✅ listo, sin configurar nada |
| WhatsApp del perfil (`+58 414 999 7557`) | ✅ en `config.js` |
| Contacto y formulario | ✅ listo, **no reenvía a ningún sitio todavía** |
| Modo demo (puerta, muro, precio, bloqueos) | ✅ activo por defecto |
| Imágenes del landing (hero, categorías, inmuebles…) | ✅ de stock, en `public/landing/` |
| Cintillos de venta y comparación con Instagram | ✅ solo visibles en demo |
| Contador de oferta limitada | ✅ con fecha real, **revísala antes de enseñarla** |
| Logotipo dibujado (hexágono + VN + alas) e iconos | ✅ montados |
| **Vehículos reales del Instagram** | ⏳ **pendiente — hoy son de muestra, con fotos de stock** |
| Panel para publicar vehículos | ⏳ **anunciado en la portada, sin construir** |
| Dominio propio | ⏳ pendiente (hoy el enlace del perfil es el WhatsApp) |

> **Ahora mismo está en modo demo y con contraseña.** Antes de ver nada hay que
> pasar la puerta, el inventario se corta al sexto vehículo y el contacto no
> sale hacia ningún teléfono. Todo se apaga con `NEXT_PUBLIC_DEMO=false`.

---

## Lo que hay que hacer antes de enseñarla

1. **Cambiar la contraseña.** Está en `libs/acceso.js` como valor de reserva
   (`ventanacional2026`). Se pisa con `DEMO_PASSWORD` en el entorno.
2. **Revisar el precio.** `config.demo.precio` es **$449** y
   `precioAnterior` el **$740** que sale tachado al lado, el mismo par que el
   resto del monorepo. Es una decisión, no un dato: se cambia en una línea y
   cambia en toda la página.
3. **Mover `demo.ofertaHasta`** a una fecha que tenga sentido para la
   conversación que vas a tener.
4. **Cargar los vehículos reales.** Ver la sección siguiente.
5. **Poner `demo.urlCompra`** si hay enlace de pago. Mientras esté vacío, los
   botones llevan a `/contacto`.

---

## Cargar los vehículos reales

La fuente de verdad es **`data/vehiculos.json`**. Hoy lleva 14 vehículos de
muestra —inventados— porque Instagram no deja leer las publicaciones de una
cuenta sin iniciar sesión. Todos están marcados con `"muestra": true` y la
portada lo dice en voz alta mientras quede alguno.

**Sobre las fotos.** Son de banco de imágenes (Unsplash, licencia de uso
comercial), descargadas a `public/vehiculos/`. Cada una corresponde al modelo
que dice su ficha —la foto del Mercedes es un Mercedes—, pero **no son la
unidad en venta**, y por eso llevan `"fotoStock": true`, que pinta el aviso
«Foto de referencia del modelo, no del vehículo en venta» debajo de la foto.

El catálogo se escribió *a partir de* las fotos y no al revés: una búsqueda de
stock por "camioneta" devuelve la marca que le da la gana, así que emparejar al
revés dejaba la ficha de un Toyota con la foto de un Kia. Al cargar los
vehículos reales, quita `fotoStock` de cada entrada y el aviso desaparece.

Para sustituirlos, una entrada por publicación:

```json
{
  "slug": "toyota-hilux-2020",
  "marca": "Toyota",
  "modelo": "Hilux",
  "version": "Doble cabina 4x4",
  "anio": 2020,
  "carroceria": "pickup",
  "precio": 47500,
  "km": 52000,
  "transmision": "Sincrónica",
  "combustible": "Diésel",
  "traccion": "4x4",
  "motor": "2.8 turbodiésel",
  "puestos": 5,
  "color": "Gris",
  "ubicacion": "Barcelona, Anzoátegui",
  "origen": "Nacional",
  "estado": "disponible",
  "destacado": true,
  "documentos": "Título propio, solvente",
  "detalles": ["Turbodiésel, rinde en carretera"],
  "descripcion": "El texto del post, tal cual.",
  "fotos": ["/vehiculos/toyota-hilux-2020-1.jpg"]
}
```

Reglas que importan:

- **`carroceria`** manda en los filtros y en la silueta. Solo cuatro valores:
  `camioneta`, `pickup`, `sedan`, `moto`.
- **`ubicacion`** es la sala donde está el vehículo y tiene que ser una de las
  dos de `config.sedes`: `"El Rosal, Caracas"` o `"Barcelona, Anzoátegui"`. El
  filtro de sala busca *dentro* de la cadena (`?sede=Caracas`), así que basta
  con que la ciudad aparezca.
- **`origen`**: `"Nacional"` o `"Importado"`. El importado lleva etiqueta azul
  en el listado y fila propia en la ficha técnica.
- **`estado`**: `disponible`, `reservado` o `vendido`. El vendido no se borra,
  se atenúa y baja al final: enseñar lo que ya se vendió vende.
- **`destacado: true`** mete el vehículo en el escaparate de la portada. Con
  cuatro basta; de más, se ignoran.
- **`precio`** en dólares y sin decimales. El equivalente en bolívares lo
  calcula la página sola con la tasa del BCV del día.
- **`slug`** es la URL (`/vehiculo/<slug>`) y no debe cambiar una vez
  publicada: es el enlace que se pega en el post de Instagram.
- **`fotos`** es una lista de rutas dentro de `public/`. Deja `[]` y la página
  dibuja la silueta del tipo de vehículo en vez de un hueco gris. La primera
  foto es la que sale en el listado.
- Quita `"muestra": true` de las entradas reales: cuando no quede ninguna,
  desaparece solo el aviso de "catálogo de muestra" de la portada.

Las fotos van en `public/vehiculos/`. Conviene recortarlas todas a 4:3, que es
la proporción del listado.

---

## Modo demo

La página se le enseña a la cuenta antes de vendérsela: se ve casi todo, no se
puede usar nada, y en cada pantalla hay una vía para comprarla.

| Qué | Dónde está el corte | Qué pasa en demo |
|---|---|---|
| Entrar al sitio | `middleware.js` + `libs/acceso.js` | Sin la cookie correcta, **el servidor no sirve ninguna página**: todo redirige a `/entrar` |
| Inventario | `app/vehiculos/page.js` + `components/demo/MuroDemo.js` | Se ven 6 vehículos nítidos; el resto, difuminado tras el muro |
| Contacto por un vehículo | `components/BotonContacto.js` | El botón no abre WhatsApp: explica qué haría |
| Formulario de contacto | `app/api/contacto/route.js` | Responde **403 aunque se llame a mano** |
| Franja, aviso flotante y bloque de precio | `components/demo/*` | Solo existen en demo |

El candado está **en el servidor, no en la pantalla**: una pantalla de bloqueo
pintada con CSS se quita con F12 en diez segundos, y quien evalúa comprar el
sistema es justo quien sabe abrir las herramientas del navegador.

La cookie guarda una **huella SHA-256** de la contraseña, no la contraseña, y
lleva el nombre del cliente como sal (`ventanacional::acceso::…`): si dos demos
del monorepo acaban con la misma clave, la cookie de una no vale en la otra.

La contraseña **no está en `config.js`** a propósito: ese archivo lo importan
componentes del navegador y acabaría en el bundle. Vive en `libs/acceso.js`,
que solo corre en servidor. Para comprobarlo después de tocar algo:

```bash
grep -rl "<la-clave>" .next/static/   # no debe devolver nada
```

### Apagarlo el día que lo compren

```bash
NEXT_PUBLIC_DEMO=false
```

Una variable, nada más. Ojo: se hornea **en tiempo de compilación**, así que
hay que **volver a construir**, no solo reiniciar el servidor.

Con eso desaparecen la puerta, el muro, la franja, el aviso flotante y el
bloque de precio, y el contacto empieza a funcionar de verdad.

---

## Las dos voces de la página

La portada le habla a dos personas distintas y conviene no mezclarlas:

- **El escaparate** (hero, vehículos, operaciones, salas, cómo comprar,
  inmuebles) le habla a quien viene a comprar un carro. Va con la tipografía de
  la casa y con el hexágono de su marca.
- **La oferta** (el panel, la comparación con Instagram, el precio) le habla a
  @ventanacional sobre el sistema que se le está vendiendo. Va en
  **Microgramma**, la tipografía de la firma, con la clase `.microgramma`.

Entre una y otra se cruza un **cintillo animado** (`components/Cintillo.js`),
que se pausa al pasar el ratón y se detiene entero con `prefers-reduced-motion`.

La **puerta de acceso** (`/entrar`) va aparte: ahí manda la firma de
Alessandrovaru y la marca del cliente aparece debajo, como lo que hay detrás de
la puerta. Quien llega todavía no es cliente de la concesionaria, es alguien a
quien se le está enseñando un trabajo. Al entrar, la jerarquía se invierte.

Todo lo de la segunda voz **desaparece con `NEXT_PUBLIC_DEMO=false`**. La única
que se queda es la sección del panel, porque al comprador de un carro también
le sirve saber que el inventario lo actualizan ellos mismos.

### La comparación con Instagram

`components/SeccionInstagram.js` responde de frente la objeción real de esta
cuenta: *"¿y esto para qué, si ya vendo por Instagram?"*. Está escrita
reconociendo que Instagram les funciona —27.230 publicaciones y 160 mil
seguidores no son casualidad—, que es lo que da credibilidad al resto. El
argumento no es que Instagram sea malo: es que un catálogo de 27.230
publicaciones no se recorre, no se filtra y no se enlaza vehículo a vehículo.
Las siete filas son comprobables en esta misma página, y el cierre propone
convivir, no sustituir.

---

## La oferta con fecha

El precio rebajado lleva una cuenta atrás (`components/demo/Contador.js`) en la
franja de arriba, el muro del inventario, el aviso flotante y el bloque final.

Cuelga de **`config.demo.ofertaHasta`**, que es una **fecha real**
(`2026-10-15T23:59:59-04:00` ahora mismo). No es un contador que se reinicia en
cada visita: eso es un truco de tienda barata y quien está evaluando comprar un
sistema lo descubre recargando la página. Cuando la fecha pasa, el contador
desaparece solo y el precio se queda sin rebaja.

---

## Marca y diseño

Todo sale del logotipo de la cuenta: un hexágono negro con el monograma VN, un
caucho a un lado y una casa al otro, sobre unas alas con la bandera —amarillo,
azul, rojo— y una franja de asfalto, sobre un degradado gris de chapa pulida.

De ahí salen las tres decisiones del tema, comentadas en `app/globals.css`:

- **Fondo oscuro.** El logo vive sobre grafito y su negro no se sostiene sobre
  blanco; además una sala de exposición se enseña con luz dirigida.
- **Cristal.** Las superficies son paneles translúcidos con desenfoque por
  detrás (`.vidrio`, `.ficha`, `.panel`, `.barra-vidrio`), no cajas opacas. Van
  montados sobre `--color-luz` —siempre blanco— y **no** sobre
  `--color-base-100`, que aquí es casi negro: un borde hecho con el color del
  fondo sería invisible sobre el fondo.
- **La bandera como acento.** Amarillo para lo que se pulsa, azul para lo
  informativo, rojo para lo urgente. Nunca los tres en el mismo bloque.

El signo está **dibujado** en `components/Marca.js` —`<Marca />` es el hexágono
con el monograma y `<MarcaAlada />` lleva además las alas y el asfalto—, no
recortado del JPEG: el original viene sobre un degradado gris que no hay forma
de fundir con ningún `mix-blend-mode`, y a 24 px de alto no se lee. La foto de
perfil original se usa solo en la puerta de la demo, enmarcada en cristal
(`LogoFoto`), que es como se reconoce una cuenta.

Los iconos (`app/icon.svg`, `app/apple-icon.svg` y los cuatro de `public/`) los
genera `scripts/generate-favicon.mjs` a partir del mismo dibujo: `pnpm --filter
ventananacional generate-favicon`. Por debajo de 40 px se queda solo el
hexágono, porque el monograma se convierte en una mancha.

Las siluetas de vehículo (`components/Silueta.js`) son formas genéricas
dibujadas para el proyecto, no el contorno de ningún modelo ni de ninguna
marca. Las texturas (`.textura`, `.textura-hex`) se usan como capa absoluta
dentro de la sección, igual que `.malla`, y nunca como pseudoelemento del
contenedor: con `z-index` negativo la capa acabaría por detrás del fondo de la
propia sección y no se vería.

---

## El panel de publicación

La portada tiene una sección (`components/SeccionPanel.js`) que explica que el
inventario lo suben ellos mismos desde un panel, con una maqueta de la interfaz
dibujada en HTML.

**Ese panel todavía no existe en este proyecto.** La sección lo describe como
parte de lo que se entrega, que es la promesa de venta; construirlo es trabajo
aparte y hay que contarlo en el precio. Mientras no esté, el inventario se
actualiza editando `data/vehiculos.json` a mano.

Cuando se construya, lo razonable es que escriba en ese mismo JSON o en una
tabla de Supabase, y que `libs/vehiculos.js` sea el único archivo que haya que
tocar para cambiar de origen.

---

## Lo que falta para que el contacto funcione

Hoy, con la demo apagada, `app/api/contacto/route.js` acepta el mensaje y
responde bien, pero **no lo reenvía a ningún sitio**: no hay todavía dominio de
correo verificado. Antes de entregar hay que engancharla al canal que elija el
cliente.

Los botones de "me interesa" sí funcionan sin tocar nada en cuanto se apaga la
demo: abren WhatsApp con el vehículo ya escrito en el mensaje, contra el número
del perfil que ya está en `config.js`.

---

## De dónde salen los datos

`referencia/` guarda la captura del perfil de Instagram de la que se sacaron la
categoría, las dos sedes, las cuatro operaciones, el WhatsApp, la cuenta de
inmuebles y las cifras que se citan en la página. Está **fuera de `public/`** a
propósito: es material de trabajo, no un activo del sitio. El logotipo original
sí se sirve, en `public/marca/ventanacional.jpg`, y se usa en la puerta.

---

## Desarrollo

```bash
pnpm install
pnpm --filter ventananacional dev     # http://localhost:3000
pnpm --filter ventananacional build
pnpm --filter ventananacional generate-favicon   # rehace los iconos
```

Variables de entorno (`.env.local`):

```bash
DEMO_PASSWORD=          # contraseña de la puerta; sin ella, la de reserva
NEXT_PUBLIC_DEMO=       # "false" para entregar el sistema completo
SITE_URL=               # dominio, para el sitemap y el SEO
```
