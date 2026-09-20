# Hardcore · tienda online

Tienda de suplementación deportiva y equipo de entrenamiento de **Hardcore**
(Centro Lido, El Rosal, Caracas · [@hardcore.fitshop](https://instagram.com/hardcore.fitshop/)).

La fuente de verdad del catálogo es el **PDF que Hardcore manda por WhatsApp**.
Este proyecto lo lee, lo convierte en tienda y permite repetir la operación cada
vez que sale una lista nueva, sin escribir un producto a mano.

Base: plantilla Shipfast del monorepo · Next.js 15 (App Router) · Tailwind 4 +
daisyUI 5 · Supabase.

---

## Estado

| Pieza | Estado |
|---|---|
| Catálogo (231 productos, 231 fotos, del PDF de septiembre) | ✅ listo |
| Tienda, filtros, ficha, carrito, checkout | ✅ listo |
| Panel de administración e importador de PDF | ✅ listo, **necesita Supabase para guardar** |
| Modo demo (muro, precio, bloqueos) | ✅ activo por defecto |
| Puerta con contraseña antes de entrar | ✅ activa, **cambia la contraseña** |
| Pedidos guardados | ⏳ **necesita Supabase** |
| Tasa del BCV del día | ✅ listo, sin configurar nada |
| Login con Google | ⏳ **lo configuras tú en Supabase** |
| Dominio propio | ⏳ pendiente |

Sin Supabase la tienda **funciona igual**: lee el catálogo de
`data/catalogo.json` y la tasa del BCV de una API pública. Lo único que falta es
guardar los pedidos.

> **Ahora mismo está en modo demo y con contraseña.** Ver [Modo demo](#modo-demo):
> antes de ver nada hay que pasar la puerta, el catálogo se corta, los pedidos no
> se envían y el panel no escribe. Todo se apaga con `NEXT_PUBLIC_DEMO=false`.

---

## Lo que tienes que hacer tú

### 1. Crear el proyecto de Supabase

Uno **propio de Hardcore**. El `.env.local` venía copiado de otro cliente y
apuntaba al proyecto de `frank-manzano`; se vació a propósito.

Copia de *Project Settings → API* a `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

### 2. Crear el esquema y cargar el catálogo

En el **SQL Editor** de Supabase, en este orden:

1. `supabase/migrations/20260920000000_tienda.sql` — tablas, RLS y el bucket de
   fotos.
2. `supabase/seeds/catalogo.sql` — los 231 productos del PDF.

Las fotos ya están en `public/productos/` y el seed apunta a ellas, así que no
hace falta subir nada para empezar.

### 3. Darte el rol de admin

Entra una vez a `/signin` para que se cree tu perfil, y luego:

```sql
update public.perfiles set rol = 'admin' where email = 'tu@correo.com';
```

Sin eso, `/admin` te dice que no tienes permisos (y te enseña justo esta
consulta con tu correo puesto).

### 4. Activar Google en Supabase

*Authentication → Providers → Google*. En la consola de Google Cloud, la URL de
redirección es:

```
https://<tu-proyecto>.supabase.co/auth/v1/callback
```

Y en *Authentication → URL Configuration* añade tu dominio a las *Redirect URLs*.
El código ya está: `/signin` ofrece Google y enlace mágico por correo.

### 5. La tasa del BCV

Nada que configurar. Se consulta a una API pública en el momento en que hace
falta y Next guarda la respuesta una hora. Ver [De dónde sale la
tasa](#de-dónde-sale-la-tasa).

### 6. Dominio

Cambia `domainName` y `siteUrl` en `config.js` y `SITE_URL` en el entorno. Ahora
mismo lleva `hardcorestore.ve` como ejemplo.

---

## Actualizar el catálogo cuando llegue un PDF nuevo

**Opción A — Hardcore, desde la web** (la que usarán ellos)

`/admin/importar` → subir el PDF → ver el resumen de cambios → *Aplicar*.

El resumen dice cuántos productos son nuevos, a cuáles les cambió el precio o la
disponibilidad y cuáles dejaron de venir en la lista. Nada se escribe hasta que
se aprueba. Lo que desaparece de la lista **se oculta, no se borra**: los pedidos
viejos siguen apuntando a ese producto.

**Opción B — tú, desde la terminal** (para meter los cambios al repositorio)

```bash
npm run importar-catalogo -- "public/Catalogo Hardcore 3 precios.pdf"
```

Genera `data/catalogo.json`, las imágenes en `public/productos/` y
`supabase/seeds/catalogo.sql`.

### Cómo se lee el PDF

`libs/pdf-catalog.mjs` abre el PDF sin dependencias externas (solo `zlib` de
Node) y reconstruye la tabla **por coordenadas**: cada celda se asigna a su
columna por la posición X y a su fila por la Y, y la foto de cada producto es la
que cae dentro del alto de esa fila. Por eso funciona aunque el texto venga
desordenado en el archivo.

De ahí salen: categoría, nombre, variaciones (sabores/tallas), disponibilidad,
los tres precios y el sello de *Oferta flash*.

`libs/catalogo-normalizar.mjs` traduce las categorías tal y como las teclean
("Proteina Whey", "BCAAA", "Healty") a una taxonomía con acentos y agrupada en
14 familias. **El dato original se conserva** en `categoriaOriginal`. Si en un
PDF futuro aparece una categoría que no está en la tabla, cae en "Otros" y el
importador la lista para que la añadas.

---

## Los tres precios

El catálogo trae tres precios por producto y la tienda los muestra los tres:

| Columna del PDF | En la tienda | Se cobra |
|---|---|---|
| Precio Oferta | **Contado en divisas** | Efectivo o Zelle. Es el más bajo. |
| Precio | **Transferencia en bolívares** | En Bs. a la tasa del BCV del día. |
| Precio PM | **Pago Móvil** | En Bs. a la tasa del BCV. Sin Cashea. |

Los dos que se cobran en bolívares muestran también el equivalente en Bs.,
calculado con la tasa del día.

> **Supuesto a confirmar con Hardcore:** se interpretó que "Precio" (BCV) y
> "Precio PM" se pagan en bolívares a la tasa, y que "Precio Oferta" es contado
> en divisas, según el pie del PDF ("Venta de Contado $" / "Venta PM SIN
> CASHEA"). Si alguno se cobra de otra forma, se cambia en `config.pagos`.

### De dónde sale la tasa

`libs/bcv.js` la pide a una API en el momento en que hace falta. **No hay cron ni
tabla**: el caché de `fetch` de Next guarda la respuesta una hora y la comparte
entre todas las visitas, así que una tienda con mil visitas hace una consulta por
hora, no mil.

Se prueban en orden `ve.dolarapi.com` y `bcv.today`, y se usa la primera que
conteste con una cifra razonable. Si fallan las dos, la tienda no se rompe: deja
de mostrar los bolívares y avisa de que el monto se confirma al cerrar el pedido.

La tasa que se aplicó a cada pedido queda guardada **en el propio pedido**, así
que una tasa que cambie mañana no altera lo que ya se cobró.

En `/admin/tasa` se ve la vigente, de qué fuente salió, y hay un botón para
forzar una lectura nueva sin esperar a que caduque el caché.

---

## Modo demo

Esta misma tienda se le enseña a posibles clientes antes de venderla. Con el modo
demo activo **se ve casi todo, pero no se puede usar**.

Se apaga con una variable:

```bash
NEXT_PUBLIC_DEMO=false   # tienda real
```

Todo lo demás —precio, enlace de compra, cuántos productos se ven— está en
`config.js`, bloque `demo`:

```js
demo: {
  precio: "$490",
  precioNota: "Pago único · instalación y catálogo cargado incluidos",
  urlCompra: "",          // ← PENDIENTE: poner el enlace de compra
  productosVisibles: 12,
  incluye: [ ... ],       // la lista de "qué te llevas"
}
```

> **Pendiente antes de enseñarla:** `urlCompra` está vacío, así que los botones
> llevan a `/contacto`. Pon ahí tu enlace (web, Calendly, lo que uses) y todos
> los botones del sitio apuntan solos. Revisa también que `precio` sea el que
> quieres cobrar.

### La puerta

Antes de la tienda hay una pantalla con el logo que pide contraseña. El logo se
enciende, gira un anillo rojo alrededor y después aparece el campo.

```bash
DEMO_PASSWORD=loquetuquieras
```

> **PENDIENTE: cámbiala.** Si no pones nada se usa la de reserva que hay en
> `libs/acceso.js` (`hardcore2026`). Existe para que la demo nazca cerrada:
> si el valor por defecto fuera vacío y se olvidara la variable al desplegar,
> la tienda quedaría abierta a cualquiera.

Cómo funciona, y por qué así:

- **El candado está en el middleware**, no en la pantalla. Sin la cookie
  correcta el servidor no sirve ni una página de la tienda, así que borrar el
  overlay con F12 no lleva a ninguna parte.
- **La cookie no guarda la contraseña**, guarda su huella SHA-256. Es `httpOnly`,
  así que ni un script de la propia página puede leerla, y dura 7 días.
- **La contraseña no viaja al navegador.** Por eso vive en `libs/acceso.js`
  (solo servidor) y no en `config.js`, que sí se empaqueta para el cliente.
- Cada intento fallido tarda medio segundo: irrelevante para una persona,
  incómodo para un script.
- Al acertar, se vuelve a donde se iba: `/tienda` con la puerta delante lleva a
  `/entrar?destino=/tienda` y de vuelta a `/tienda`.

Con `NEXT_PUBLIC_DEMO=false` la puerta desaparece entera.

### Qué corta la demo

| Sitio | Qué pasa |
|---|---|
| Antes de todo | Pantalla con el logo animado pidiendo contraseña |
| Franja superior | "Demo · el sistema está a la venta · $490" + botón, en todas las páginas |
| `/tienda` | 12 productos nítidos, el resto difuminado detrás de la oferta |
| Al bajar media página | Asoma una tarjeta con el precio. Si la cierras, no vuelve en la sesión |
| Final de portada, ficha, tienda y contacto | Bloque de venta con qué incluye y el precio |
| `/checkout` | El botón de confirmar se cambia por un aviso. **`/api/checkout` devuelve 403**, así que tampoco se puede forzar desde fuera |
| `/admin` | Abierto sin login a propósito: enseñarlo vende. No escribe nada |
| Acciones del panel | Todas cortadas en el servidor, en `exigirAdmin()` |
| `/admin/pedidos` | Tres pedidos de ejemplo, marcados como tales. **Nunca consulta la tabla real** |
| `/admin/importar` | Analizar el PDF **sí funciona** (solo lee y compara). Aplicar, no |

Lo de dejar analizar el PDF es a propósito: es lo que de verdad diferencia al
sistema, y se puede enseñar sin riesgo porque no escribe nada.

Los cortes que importan están **en el servidor**, no solo en pantalla: un botón
deshabilitado no impide llamar al endpoint a mano.

---

## Cómo se compra

1. Carrito (vive en el navegador, sin cuenta).
2. `/checkout`: datos, forma de pago y entrega. El total se recalcula al cambiar
   la forma de pago.
3. Al confirmar: el pedido se guarda en Supabase con un código (`HC-2609-K3F8`)
   y se abre WhatsApp con el resumen escrito.
4. El pago y la entrega se cierran en el chat, como hasta ahora.

**Los precios los pone el servidor, nunca el navegador.** `/api/checkout`
ignora lo que le manden y recalcula todo contra el catálogo; también descarta
variaciones que el producto no tiene y topa las cantidades.

En modo demo los pasos 3 y 4 no ocurren: ver [Modo demo](#modo-demo).

---

## Desarrollo

```bash
pnpm install          # desde la raíz del monorepo
npm run dev           # http://localhost:3000
npm run build
```

`NEXT_PUBLIC_DEV_NO_LOGIN=true` en `.env.local` deja entrar a `/admin` sin
sesión. **Solo local**: se ignora con `NODE_ENV=production`.

### Mapa

```
app/
  page.js                  portada
  tienda/                  catálogo con filtros (el estado vive en la URL)
  producto/[slug]/         ficha, con los tres precios y las presentaciones
  carrito/ checkout/ pedido/[codigo]/
  contacto/                cómo comprar y preguntas frecuentes
  cuenta/                  pedidos del cliente que inició sesión
  admin/                   panel (resumen, importar, productos, pedidos, tasa)
    acciones.js            server actions; comprueban rol admin y modo demo
  entrar/                  la puerta: logo animado y contraseña
  api/
    checkout/              crea el pedido y arma el mensaje de WhatsApp
    entrar/                comprueba la contraseña y pone la cookie

libs/
  pdf-catalog.mjs          lector del PDF (texto + imágenes, por coordenadas)
  catalogo-normalizar.mjs  taxonomía, marcas y slugs
  catalogo.js              acceso a datos: Supabase y, si no, catalogo.json
  bcv.js                   tasa del BCV, pedida a una API y cacheada
  demo.js                  el modo demo: qué se corta y qué se bloquea
  acceso.js                la puerta con contraseña (solo servidor)
  formato.js               dinero, fechas y estados

data/catalogo.json         el catálogo importado
public/productos/          las 231 fotos sacadas del PDF
supabase/                  migración y seed
```

### La firma

El crédito de autoría va en **Microgramma**, la tipografía de la firma de
Alessandrovaru, igual que en RollPrep y en los demás proyectos del monorepo.
La fuente vive en `public/fonts/microgramma.otf` y se declara en
`app/layout.js` con `next/font/local` como `--microgramma-font`. **No es del
tema de la tienda**: solo se usa para la firma.

Aparece en dos sitios:

- `components/FooterFoot.js` — la franja del final del documento, montada una
  sola vez en el layout raíz, así que sale en todas las páginas incluida la
  puerta de acceso.
- `components/Footer.js` — la línea "Tienda hecha por ALESSANDROVARU" junto al
  copyright del cliente.

La franja no es fija: se ve al llegar abajo. En modo demo la tarjeta flotante
de venta se posa justo ahí, así que `globals.css` le da aire en pantalla
estrecha (regla `html[data-demo="true"] .footer-foot`). Las pantallas que
ocupan el alto completo, como la puerta, se descuentan su alto con la variable
`--alto-credito`.

### El logo

`components/Logo.js`. El original es su foto de perfil de Instagram: un cuadrado
de 638×638 con las letras arqueadas y mucho negro alrededor.

- `<Logo />` recorta solo las letras (medidas: x 70→579, y 259→404) y las escala
  al ancho que se le pida. El recorte se hace con CSS, no con un editor: si
  mandan un logo nuevo, se cambia el archivo y como mucho cuatro números.
- `<LogoCuadrado />` usa el cuadrado entero, en la puerta.
- Los dos llevan `mix-blend-mode: screen`, que hace desaparecer el negro del
  JPEG sobre cualquier fondo oscuro. No hace falta una versión con transparencia.

### Estilo

Tema `hardcore` en `app/globals.css`: negro y rojo de marca con acabado de
**cristal**, el aire de un bote de suplementos. Tipografía geométrica: **Sora**
en titulares, **Outfit** en el cuerpo y **JetBrains Mono** en precios y códigos,
para que las cifras alineen en columna.

Para mover el rojo: `--color-primary` en `globals.css` y `colors.main` en
`config.js`.

**La gráfica de envase** (lo que hace que se reconozca como marca de
suplementos y no como una web cualquiera):

| Clase | Qué es |
|---|---|
| `.cromo` | letras cromadas con bisel, como los wordmarks de los botes |
| `.panal` | textura hexagonal de fondo (la de la serie Cell-Tech) |
| `.rayos` | la ráfaga que sale por detrás de los productos |
| `.insignia` | etiqueta sesgada de filo duro, nada de píldoras redondas |
| `.tajo` | banda diagonal para separar secciones |

> `.cromo` lleva `padding` arriba y abajo a propósito. `background-clip: text`
> solo pinta dentro de la caja del elemento y `.display` usa `line-height:
> 0.95`, así que sin ese hueco **las tildes se quedan fuera y desaparecen**
> ("POR CATEGORÍA" salía "POR CATEGORIA"). El hueco se compensa con padding y
> no con margen negativo: estas reglas van sin capa y le ganarían a las
> utilidades `mt-*` de Tailwind.

**Las piezas del cristal:**

| Clase | Dónde |
|---|---|
| `.cristal` | paneles sueltos (precios, formulario de la puerta, avisos) |
| `.ficha` | tarjetas de producto; mismo acabado, más el reflejo al pasar por encima |
| `.barra-cristal` | cabecera, franja de demo y pie, sin esquinas ni borde en caja |
| `.cristal-solido` | variante más opaca para lo que tiene que dejar leer |
| `.reflejo` | la luz que cruza la tarjeta al pasar el ratón |

Dos detalles que conviene no deshacer sin querer:

- El borde va en un `::before` con máscara, no en `border`, porque un borde
  normal no admite degradados: así el filo puede ir de blanco a rojo.
- `<Ambiente />` (en el layout) pinta tres manchas de color que se mueven muy
  despacio por detrás de todo. **El cristal no se ve sin ellas**: sobre un negro
  plano, `backdrop-filter` no tiene nada que desenfocar y los paneles quedan
  como cajas grises.
- `.foto-producto` es blanco opaco a propósito y anula el cristal. Las fotos del
  PDF traen fondo blanco: sobre cualquier degradado se vería su recuadro.

### Animaciones

Todo GSAP, con ScrollTrigger, centralizado en `libs/animaciones.js`: allí se
registra el plugin una vez y se fijan las curvas y los tiempos, para que una
tarjeta que entra en la portada se sienta igual que una del catálogo.

| Dónde | Qué hace |
|---|---|
| `Ambiente` | las manchas del fondo, en bucle lento |
| `Revelar` | entrada al asomar en pantalla (`once`: no se repite al subir) |
| `HeroTienda` | una línea de tiempo encadena rótulo, renglones del titular, texto, botones y cifras; las cifras cuentan desde cero; el collage hace paralaje al bajar |
| `RejillaProductos` | entrada escalonada por filas con `ScrollTrigger.batch` |
| `CintaMarcas` | la cinta acelera con la velocidad del scroll y se para al pasar el ratón |
| `PantallaAcceso` | el logo se enciende, gira el anillo, sube el formulario; y al acertar, la salida |
| `Header` | despliegue del menú móvil y salto del globo del carrito |

**Todo pasa por `contexto()`**, que envuelve `gsap.context` y `matchMedia`. Dos
cosas que da gratis: se limpia solo al cambiar de página (sin disparadores
huérfanos apuntando a nodos muertos) y atiende `prefers-reduced-motion`, que
deja el contenido quieto y visible.

Lo que va a entrar animado lleva `data-anima` y el CSS lo oculta de entrada,
para que no dé un salto entre que el servidor lo pinta y GSAP toma el control.
Sin JavaScript el `<noscript>` del layout lo vuelve a mostrar.

> **Cuidado con dejar `transform` o `filter` puestos sobre algo que use
> `mix-blend-mode`.** Cualquiera de los dos crea un contexto de apilado, y
> dentro de él la fusión deja de ver el fondo de la página: el logo pasaba de
> ser solo las letras rojas a un recuadro negro. Por eso la animación de la
> puerta lleva `clearProps: "filter,transform"`.

> **Cuidado con `gsap.from()` sobre algo que lleve `data-anima`.** El CSS ya lo
> dejó en `opacity: 0`, y `from` anima *desde* el valor que le des *hasta* el
> actual: de 0 a 0. El elemento no aparece nunca. Se ve venir mal porque no da
> error, solo deja la sección en blanco. Con `data-anima` hay que usar
> `fromTo` y decir el destino a mano, que es lo que hace `Revelar`.

---

## Limitaciones conocidas

- **Las fotos son pequeñas.** Salen del PDF y miden unos 90×126 px. Se muestran
  a tamaño contenido para que no se deshagan. Cuando Hardcore tenga fotos
  mejores, se suben desde el panel y sustituyen a las del PDF sin tocar código.
- **Los productos se identifican por su nombre.** Si en un PDF nuevo cambian
  cómo se escribe un producto, entra como nuevo y el anterior se oculta. El
  resumen previo a la importación deja verlo antes de aplicar.
- **Los datos son de la lista de septiembre** y el propio Hardcore avisa de que
  los precios cambian. La fecha de la última importación se ve en `/admin`.
- **El catálogo no trae descripciones** de producto: el PDF solo tiene nombre,
  presentación y precios. No se inventó ninguna.
