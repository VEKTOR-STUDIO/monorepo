# Aprovéchalo · venta de vehículos

Página de venta de vehículos para **Aprovéchalo**
([@aprovechalo.ve](https://instagram.com/aprovechalo.ve/) · 42,7 K seguidores),
que en Instagram se presenta como *"Consultor Inmobiliario | Inversiones |
Compra | Venta | Alquiler 🏡 Cumpliendo sueños 🍾 VENTA DE VEHICULOS 🚘🏍"*.

Esta página cubre la pata de **vehículos**. La inmobiliaria se reconoce en la
portada y lleva al mismo contacto, para no enseñar medio negocio.

Base: plantilla Shipfast del monorepo · Next.js 15 (App Router) · Tailwind 4 +
daisyUI 5. Sin base de datos: el inventario es un JSON.

---

## Estado

| Pieza | Estado |
|---|---|
| Portada, escaparate a pantalla completa | ✅ listo |
| Inventario con filtros (tipo, marca, orden) | ✅ listo |
| Ficha por vehículo, con URL propia | ✅ listo |
| Precio en $ con equivalente en Bs. (tasa BCV del día) | ✅ listo, sin configurar nada |
| Contacto y formulario | ✅ listo, **no reenvía a ningún sitio todavía** |
| Modo demo (puerta, muro, precio, bloqueos) | ✅ activo por defecto |
| **Vehículos reales del Instagram** | ⏳ **pendiente — hoy son de muestra, con fotos de stock** |
| Panel para publicar vehículos | ⏳ **anunciado en la portada, sin construir** |
| Número de WhatsApp | ⏳ **pendiente** |
| Dominio propio | ⏳ pendiente |

> **Ahora mismo está en modo demo y con contraseña.** Antes de ver nada hay que
> pasar la puerta, el inventario se corta al sexto vehículo y el contacto no
> sale hacia ningún teléfono. Todo se apaga con `NEXT_PUBLIC_DEMO=false`.

---

## Lo que hay que hacer antes de enseñarla

1. **Cambiar la contraseña.** Está en `libs/acceso.js` como valor de reserva
   (`aprovechalo2026`). Se pisa con `DEMO_PASSWORD` en el entorno.
2. **Cargar los vehículos reales.** Ver la sección siguiente.
3. **Poner el WhatsApp** en `config.js` → `business.whatsapp` (formato
   internacional sin `+`, p. ej. `58412XXXXXXX`). Mientras esté vacío, todos
   los botones de contacto caen al DM de Instagram.
4. **Confirmar el precio de venta** en `config.js` → `demo.precio` y poner
   `demo.urlCompra` si hay enlace de pago.

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
  "ubicacion": "Puerto Ordaz",
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
- **`estado`**: `disponible`, `reservado` o `vendido`. El vendido no se borra,
  se atenúa y baja al final: enseñar lo que ya se vendió vende.
- **`destacado: true`** mete el vehículo en el escaparate de la portada (las
  pantallas completas). Con cuatro basta; de más, se ignoran.
- **`precio`** en dólares y sin decimales. El equivalente en bolívares lo
  calcula la página sola con la tasa del BCV del día.
- **`slug`** es la URL (`/vehiculo/<slug>`) y no debe cambiar una vez publicada:
  es el enlace que se pega en el post de Instagram.
- **`fotos`** es una lista de rutas dentro de `public/`. Deja `[]` y la página
  dibuja la silueta del tipo de vehículo en vez de un hueco gris. La primera
  foto es la que sale en el listado.
- Quita `"muestra": true` de las entradas reales: cuando no quede ninguna,
  desaparece solo el aviso de "catálogo de muestra" de la portada.

Las fotos van en `public/vehiculos/`. Conviene recortarlas todas a 4:3, que es
la proporción del listado.

---

## Modo demo

La página se le enseña al dueño de la cuenta antes de vendérsela: se ve casi
todo, no se puede usar nada, y en cada pantalla hay una vía para comprarla.

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
responde bien, pero **no lo reenvía a ningún sitio**: no hay todavía ni número
de WhatsApp ni dominio de correo verificado. Antes de entregar hay que
engancharla al canal que elija el cliente.

Los botones de "me interesa" sí funcionan sin tocar nada: en cuanto haya
número en `config.js`, abren WhatsApp con el vehículo ya escrito en el mensaje.

---

## Diseño

Dos referencias, cada una en su sitio, y el detalle está comentado en
`app/globals.css`:

- **La estructura** es de escaparate de coches moderno: fondo claro, secciones
  que ocupan la pantalla entera, una sola idea por pantalla, titular arriba y
  botones de cápsula abajo.
- **La gráfica** es de ingeniería automotriz alemana: azul técnico y rojo sobre
  gris claro, titulares en mayúsculas muy apretados, cifras que se leen como
  una hoja de especificaciones y las tres franjas diagonales de acento.

Todo es propio: el logotipo es tipográfico (`components/Logo.js`), la banda de
tres franjas es de la casa y las siluetas de vehículo (`components/Silueta.js`)
son formas genéricas dibujadas para el proyecto, no el contorno de ningún
modelo ni de ninguna marca.

---

## Desarrollo

```bash
pnpm install
pnpm --filter aprovechalo-ve dev     # http://localhost:3000
pnpm --filter aprovechalo-ve build
pnpm --filter aprovechalo-ve generate-favicon   # rehace los iconos
```

Variables de entorno (`.env.local`):

```bash
DEMO_PASSWORD=          # contraseña de la puerta; sin ella, la de reserva
NEXT_PUBLIC_DEMO=       # "false" para entregar el sistema completo
SITE_URL=               # dominio, para el sitemap y el SEO
```
