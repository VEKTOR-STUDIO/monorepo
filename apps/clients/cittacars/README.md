# Citta Cars · concesionario

Página del concesionario **Citta Cars**
([@cittacars](https://instagram.com/cittacars/) · 5.427 seguidores), que en
Instagram se presenta así:

> *"Somos tu concesionario de confianza 💎 · Tenemos taller de accesorios y
> detailing 💧 · Arma la camioneta de tus sueños 🚀 · Profesionalismo y
> experiencia ⚡"*

Son **tres patas** y las tres están en la página: el inventario del
concesionario, el taller de accesorios y detailing, y la consignación —que es
una de sus historias destacadas: *"¿Quieres dejar tu vehículo a
consignación?"*.

Base: plantilla Shipfast del monorepo · Next.js 15 (App Router) · Tailwind 4 +
daisyUI 5. Sin base de datos: el inventario es un JSON.

---

## Estado

| Pieza | Estado |
|---|---|
| Portada con escaparate a pantalla completa | ✅ listo |
| Inventario con filtros (tipo, marca, orden) | ✅ listo |
| Ficha por vehículo, con URL propia | ✅ listo |
| Sección de taller y sección de consignación | ✅ listas, salen de `config.taller` |
| Precio en $ con equivalente en Bs. (tasa BCV del día) | ✅ listo, sin configurar nada |
| Contacto y formulario | ✅ listo, **no reenvía a ningún sitio todavía** |
| Modo demo (puerta, muro, precio, bloqueos) | ✅ activo por defecto |
| Logotipo del cliente y paleta negro/rojo | ✅ montados |
| Imágenes del landing y del catálogo | ✅ de stock, en `public/landing/` y `public/vehiculos/` |
| **Vehículos reales del Instagram** | ⏳ **pendiente — hoy son de muestra, con fotos de stock** |
| Panel para publicar vehículos | ⏳ **anunciado en la portada, sin construir** |
| Número de WhatsApp | ⏳ **pendiente** |
| Ciudad y dirección del showroom | ⏳ **pendiente — el perfil no la dice y no se ha inventado** |
| Dominio propio | ⏳ pendiente (`cittacars.com` está por comprobar) |

> **Ahora mismo está en modo demo y con contraseña.** Antes de ver nada hay que
> pasar la puerta, el inventario se corta al sexto vehículo y el contacto no
> sale hacia ningún teléfono. Todo se apaga con `NEXT_PUBLIC_DEMO=false`.

---

## Lo que hay que hacer antes de enseñarla

1. **Cambiar la contraseña.** Está en `libs/acceso.js` como valor de reserva
   (`cittacars2026`). Se pisa con `DEMO_PASSWORD` en el entorno.
2. **Mover la fecha de la oferta** (`config.demo.ofertaHasta`) a una que tenga
   sentido para la conversación que vas a tener.
3. **Cargar los vehículos reales.** Ver la sección siguiente.
4. **Poner el WhatsApp** en `config.js` → `business.whatsapp` (formato
   internacional sin `+`, p. ej. `58412XXXXXXX`). Mientras esté vacío, todos
   los botones de contacto caen al DM de Instagram.
5. **Preguntar la ciudad.** `business.ciudad` dice hoy "Venezuela" y la ficha
   de cada vehículo dice "Showroom Citta Cars": ninguna de las dos inventa un
   local que no sabemos dónde está. En cuanto el cliente lo diga, se cambia en
   `config.js` y en `data/vehiculos.json`.
6. **Poner `demo.urlCompra`** si hay enlace de pago. El precio ya está en
   `config.js`: `demo.precio` es **$449** y `demo.precioAnterior` el **$740**
   que sale tachado al lado. Vaciando `precioAnterior` desaparece la rebaja.

---

## Cargar los vehículos reales

La fuente de verdad es **`data/vehiculos.json`**. Hoy lleva 12 vehículos de
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
  "ubicacion": "Showroom Citta Cars",
  "estado": "disponible",
  "destacado": true,
  "documentos": "Título propio, solvente",
  "detalles": ["Estribos y parrilla montados en el taller"],
  "descripcion": "El texto del post, tal cual.",
  "fotos": ["/vehiculos/toyota-hilux-2020-1.jpg"]
}
```

Reglas que importan:

- **`carroceria`** manda en los filtros y en la silueta. Solo tres valores:
  `camioneta`, `pickup`, `sedan`. Citta Cars no vende motos, así que la
  carrocería `moto` se quitó de `libs/vehiculos.js`; si algún día entra otra,
  se añade ahí con su foto en `public/landing/tipo-<slug>.jpg`.
- **`estado`**: `disponible`, `reservado` o `vendido`. El vendido no se borra,
  se atenúa y baja al final: enseñar lo que ya se vendió vende.
- **`destacado: true`** mete el vehículo en el escaparate de la portada. Con
  cuatro basta; de más, se ignoran.
- **`precio`** en dólares y sin decimales. El equivalente en bolívares lo
  calcula la página sola con la tasa del BCV del día.
- **`slug`** es la URL (`/vehiculo/<slug>`) y no debe cambiar una vez publicada:
  es el enlace que se pega en el post de Instagram.
- **`detalles`** es donde se nombra lo que le montó el taller (estribos, forro
  de batea, ahumado…). Es lo que diferencia a este concesionario del de al
  lado, así que conviene usarlo.
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

## Las dos voces de la página

La portada le habla a dos personas distintas y conviene no mezclarlas:

- **El escaparate** (portada, vehículos, tipos, taller, consignación, cómo
  comprar) le habla a quien viene a comprar una camioneta. Va con la tipografía
  de la casa y con el logotipo de Citta Cars.
- **La oferta** (el panel, la comparación con Linktree, el precio) le habla al
  dueño de @cittacars sobre el sistema que se le está vendiendo. Va en
  **Microgramma**, la tipografía de la firma, con la clase `.microgramma`.

Entre una y otra se cruza un **cintillo animado** (`components/Cintillo.js`),
que se pausa al pasar el ratón y se detiene entero con `prefers-reduced-motion`.

La **puerta de acceso** (`/entrar`) va aparte: ahí manda la firma de
Vektor y la marca del cliente aparece debajo, como lo que hay detrás de
la puerta. Quien llega todavía no es cliente de Citta Cars, es alguien a quien
se le está enseñando un trabajo. Al entrar, la jerarquía se invierte.

Todo lo de la segunda voz **desaparece con `NEXT_PUBLIC_DEMO=false`**. La única
que se queda es la sección del panel, porque al comprador de una camioneta
también le sirve saber que el inventario lo actualizan ellos mismos.

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

## Marca y textura

- **El logotipo es el suyo**, tal cual: `public/marca/cittacars.jpg`, el rótulo
  blanco sobre negro con las tres barras verde-blanco-rojo delante. El archivo
  es cuadrado y el rótulo va en la franja central, así que `components/Logo.js`
  lo recorta con `object-cover` dentro de una caja apaisada en vez de servir
  medio JPEG de negro. El fondo negro del archivo desaparece con
  `mix-blend-mode: screen`.
- **Por eso el tema es oscuro**, y no al revés: sobre fondo claro no hay blend
  que salve un JPEG con fondo negro. Además es lo que hace su Instagram.
- **La paleta** son los colores del logotipo: negro de showroom, blanco de
  rótulo, el **rojo** como único color que llama y el verde con cuentagotas.
- **Las tres barras** se dibujan en `components/Barras.js` y se repiten como
  línea (`.banda`) y como trama de fondo (`.textura-barras`,
  `.textura-barras-color`).
- **Las texturas** se usan como capa absoluta dentro de la sección, igual que
  `.malla`, y nunca como pseudoelemento del contenedor: con `z-index` negativo
  la capa acabaría por detrás del fondo de la propia sección y no se vería.
  Sobre fondo oscuro el grano va en `soft-light`, no en `multiply`: multiplicar
  ruido gris sobre negro no se ve.

---

## El taller y la consignación

Las dos secciones nuevas respecto a un catálogo de vehículos normal, y las dos
salen de su propia bio:

- **El taller** (`#taller`) se arma con `config.taller`: el titular, la entrada
  y los seis servicios. Cambiar la lista es tocar `config.js`, no la portada.
- **La consignación** (`#consignacion`) es una franja con su propio botón de
  contacto. Es la vía por la que entra inventario, así que tiene sitio propio
  en la portada y en el pie.

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

## Desarrollo

```bash
pnpm install
pnpm --filter cittacars dev              # http://localhost:3000
pnpm --filter cittacars build
pnpm --filter cittacars generate-favicon # rehace los iconos (negro + barras)
```

Variables de entorno (`.env.local`):

```bash
DEMO_PASSWORD=          # contraseña de la puerta; sin ella, la de reserva
NEXT_PUBLIC_DEMO=       # "false" para entregar el sistema completo
SITE_URL=               # dominio, para el sitemap y el SEO
```
