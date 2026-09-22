# Veloce Autos · importación directa de vehículos

Página de inventario para **Veloce Autos**
([@veloce.autos](https://www.instagram.com/veloce.autos/) · 222 K seguidores,
2.391 publicaciones), importadora de **Caracas** con showroom en La Florida y
segunda sede en Chacao. En su bio se presentan así:

> 🌐 Importación Directa • Dubái | Europa | China | USA
> 📍 Av. Los Mangos, La Florida (Showroom)
> 🏁 Autos nuevos y usados premium

Base: plantilla Shipfast del monorepo · Next.js 15 (App Router) · Tailwind 4 +
daisyUI 5 · GSAP 3. Sin base de datos: el inventario es un JSON.

---

## De dónde sale todo

Esta página no se diseñó de cero: se calcó de lo que ellos mismos publican. El
material de partida está en `docs/fuentes/` (fuera de `public/`, para que no se
sirva en la web):

| Archivo | Qué aportó |
|---|---|
| `veloce-perfil-instagram.jpg` | **El logotipo**, del que salió el vector de `components/MarcaVeloce.js`. |
| `instagram-perfil.png` | La bio, las cuatro procedencias, la dirección, el WhatsApp y las cifras. |
| `instagram-comunicado.png` | Su comunicado fijado: los cuatro canales oficiales, las dos advertencias de seguridad y —sobre todo— la frase que sostiene toda la venta: *"No tenemos página web"*. |

### El logotipo no está redibujado a ojo

`components/MarcaVeloce.js` es el **trazado exacto** de su foto de perfil. Se
sacó decodificando el JPG, persiguiendo el borde entre el negro y el blanco y
simplificando el contorno con Douglas-Peucker; el logotipo son puras rectas,
así que el vector no pierde nada: **26 puntos y ni una curva**. Después se
simetrizó, porque la foto trae unas décimas de desvío del JPEG.

El resultado sirve de 12 px en un favicon a 600 px en una portada, va en
`currentColor` y no hay ni un PNG detrás. Los iconos salen del mismo trazado
con `npm run generate-favicon`.

---

## Estado

| Pieza | Estado |
|---|---|
| Identidad monocroma a partir de su logotipo | ✅ listo |
| Logotipo vectorizado (exacto, no redibujado) | ✅ listo |
| Portada con las alas de la casa | ✅ listo |
| Inventario desfilando de lado (GSAP, con `pin`) | ✅ listo |
| Corte showroom / importación a pedido | ✅ listo, es el filtro principal |
| Filtro por procedencia (Dubái, Europa, China, USA) | ✅ listo |
| Las dos sedes separadas, cada una con su cuenta | ✅ listo |
| Sección de canales oficiales (de su comunicado) | ✅ listo |
| Inventario con filtros y ficha por unidad con URL propia | ✅ listo |
| Precio en $ con equivalente en Bs. (tasa BCV del día) | ✅ listo, sin configurar nada |
| Contacto y formulario | ✅ listo, **no reenvía a ningún sitio todavía** |
| Modo demo (puerta, muro, precio, bloqueos) | ✅ activo por defecto |
| Contador de oferta limitada | ✅ con fecha real, **revísala antes de enseñarla** |
| **Inventario real** | ⏳ **pendiente — hoy son 16 unidades de ejemplo** |
| **Fotos** | ⏳ pendiente — ninguna ficha tiene foto; se dibuja la silueta |
| Precio de la demo | ✅ `$449` (antes `$740`), el mismo de todo el monorepo |
| **Dominio** | ⏳ pendiente — hoy `veloceautos.com` es de trabajo |
| **Panel de administración** | ⏳ no existe; la portada lo anuncia como parte de lo que se vende |

### Las unidades son de ejemplo

**Esto es lo más importante que hay que saber antes de enseñar la página.**

Las 16 unidades de `data/vehiculos.json` **no son el inventario de Veloce**.
Son modelos plausibles para una importadora premium de Caracas, con precios de
referencia, y cada una lleva `"muestra": true`, que enciende el aviso «Unidad
de ejemplo» en la tarjeta, en la ficha, en el inventario y en la portada.

El inventario real está en su Instagram y no se pudo traer: la herramienta
(`tools/instagram`) se topó con el límite de peticiones de Instagram el día que
se montó esto. Ver **Cargar el inventario real**, más abajo.

Lo que **sí** es suyo, tomado de lo que publican: el logotipo, las cuatro
procedencias, las dos sedes con sus cuentas, los canales oficiales, las dos
advertencias de seguridad, la dirección, el WhatsApp y las cifras del perfil.

---

## Modo demo

Esta página se le enseña a Veloce antes de vendérsela. Con el modo demo activo
se ve casi todo, pero no se puede **usar**.

**El candado está en el servidor, no en la pantalla.** Una portada tapada con
CSS se quita con F12 en diez segundos, y justo quien evalúa comprar un sistema
es quien sabe abrir las herramientas del navegador.

| Qué corta | Dónde | Qué pasa |
|---|---|---|
| Ver cualquier página | `middleware.js` | Sin la cookie de acceso, **307 a `/entrar`**. No se sirve ni una página. |
| Entrar | `app/api/entrar/route.js` | Compara huellas SHA-256, espera 600 ms por fallo y deja una cookie `httpOnly`. |
| El inventario completo | `app/vehiculos/page.js` | Se ven `config.demo.elementosVisibles` (6) nítidas; el resto, difuminado tras `MuroDemo`. |
| Enviar el formulario | `app/api/contacto/route.js` | **403**, aunque se llame a mano con `curl`. |
| Escribir por una unidad | `components/BotonContacto.js` | No abre WhatsApp: explica qué haría el sistema entregado. |

Ese último corte pesa más de lo normal aquí: el número que lleva esta demo es
el **WhatsApp corporativo que ellos publican y que está en uso**. Un
desconocido probando la demo no puede acabar escribiéndoles.

La contraseña **no está en `config.js`** —ese archivo lo importan componentes
de cliente y acabaría en el bundle—: vive en `libs/acceso.js`, que solo corre
en servidor, y la pisa `DEMO_PASSWORD`. Si la variable falta, se usa la de
reserva (`veloceautos2026`), para que la demo **nunca quede abierta por un
olvido**.

Comprobarlo, no suponerlo:

```bash
grep -rl "<la-clave>" .next/static/   # no debe devolver nada
```

### La puerta hace un segundo trabajo

Esta demo lleva dentro el logotipo, la dirección, el WhatsApp y los canales de
un negocio que todavía no la ha comprado, y **su propio comunicado avisa de que
"cualquier portal web que use nuestro nombre no es oficial"**.

Contraseña más `noindex` es lo que impide que esto acabe indexado en Google
colgando de un dominio ajeno y dándoles la razón. Corolario incómodo: **si
algún día se apaga la demo con este contenido dentro, hay que vaciarlo antes**.

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

- **El escaparate**, que le habla a quien viene a comprar un carro. Va con la
  tipografía de la casa (Saira, y Michroma en el rótulo de la marca).
- **La oferta**, que le habla a Veloce sobre el sistema que se le está
  vendiendo. Va en **Microgramma**, la tipografía de la firma de
  Vektor, la misma del crédito del pie.

Entre una y otra se cruza un `Cintillo`, que no es decoración: es el aviso de
que cambia el interlocutor.

**Con este cliente eso hay que cuidarlo más que de costumbre.** Michroma y el
rótulo de Veloce vienen del mismo esqueleto cuadrado y de lejos se parecen, así
que lo que de verdad separa las dos voces es dónde aparece cada una:
**Microgramma no sale nunca fuera de las zonas marcadas por el cintillo.**

En **la puerta** (`/entrar`) la jerarquía se invierte y manda la firma de
Vektor: quien llega todavía no es cliente de Veloce, es alguien a quien
se le está enseñando un trabajo. Al entrar, vuelve a mandar la marca de Veloce.

---

## Diseño

Todo está comentado en `app/globals.css`, pero en corto:

- **No hay color de acento.** Veloce tiene una sola pieza gráfica y es negra
  sobre blanca; el `--color-primary` de esta página es **el blanco**. Donde
  otra web pondría un rojo —el precio, el botón, lo destacado— aquí va blanco
  sobre gris: **la jerarquía la da el contraste, no el tono**. Verde, ámbar y
  rojo sobreviven en un solo sitio, el estado de la unidad, porque ahí el color
  es información.
- **El vértice manda**, a −21° (`--angulo-veloce`). El gesto de la marca —dos
  alas que bajan a un punto— está en los fondos (`components/Alas.js`), en las
  etiquetas (`.bisel`), en los remates (`.banda`), en los recortes (`.corte`) y
  en cómo entran las cosas al hacer scroll.
- **Fondo negro y luz fría.** Los grises tiran a azul (0.004 de croma a 265°):
  es luz de showroom, no de calle. `.estudio` imita el charco de luz de sus
  fotos, con el foco alto y un rebote abajo, porque el piso del local es
  pulido.
- **Radio cero.** El logotipo son doce puntas y ni una curva. Solo
  `rounded-full` sobrevive, para los puntos de estado.

Los botones **no van sesgados** aunque las etiquetas sí: con un tracking tan
abierto, un `skewX` sobre el botón deja el texto ilegible en los tamaños
pequeños.

### Las siluetas no son un plan B

Mientras no haya fotos reales, **ninguna ficha tiene imagen** y lo que se ve es
la silueta de la carrocería (`components/Silueta.js`, cinco tipos) sobre el
fondo de showroom, con la V de marca de agua detrás.

Es una decisión: una demo llena de fotos de banco de imágenes se nota, y lo que
resta no es la foto, es la credibilidad de todo lo demás. Un dibujo declarado
no engaña a nadie y sobre este negro se lee como una ficha técnica.

---

## Animación (GSAP)

Todo pasa por `libs/animaciones.js`, que registra los plugins una vez y fija
los tiempos y curvas de la casa. Las piezas:

| Componente | Qué hace |
|---|---|
| `TituloAnimado` | El titular asoma **línea a línea** desde detrás de una máscara (SplitText con `mask: "lines"`). |
| `Revelar` | Las entradas por scroll. Seis variantes; `corte` se abre desde el eje hacia los lados. |
| `Alas` | Los galones nacen cerrados contra su vértice y **se abren**; luego se deslizan a distinta velocidad. |
| `CarruselCatalogo` | Las fichas desfilan de lado con la sección **anclada** (`pin` + `scrub`). |
| `Parallax` | Las unidades se mueven más despacio que el texto. |
| `Cifra` | Los números de la portada suben contando. |
| `BarraProgreso` | El hilo de arriba. |
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
de la caja de la línea y en español se comería la tilde de "IMPORTACIÓN". El
hueco se lo da `.linea-titulo-mask` en `app/globals.css`, que además deja aire
por la derecha porque esta tipografía va muy espaciada.

---

## Cargar el inventario real

El inventario de Veloce está en su Instagram. Para traerlo:

```bash
# 1. Leer el perfil → JSON crudo en tools/instagram/salida/
node tools/instagram/leer-perfil.mjs veloce.autos --max 80

# 2. Bajar las fotos a esta app
node tools/instagram/bajar-fotos.mjs tools/instagram/salida/veloce.autos.json \
     --destino apps/clients/veloce-autos/public/vehiculos
```

Necesita una cookie de sesión; el porqué y de dónde sacarla están en
`tools/instagram/README.md`. **Si contesta que Instagram está limitando las
peticiones, el límite es de la IP y se quita solo en un par de horas; insistir
lo alarga.** Es lo que pasó el día que se montó esta página.

El script deja el `caption` **crudo a propósito**: pasar de «Prado 2025 full
equipo, recién llegada de Dubái» a una ficha lo haces tú leyéndolo. Un año mal
adivinado en el inventario de un cliente se descubre en la primera pregunta de
la reunión.

### El formato

`data/vehiculos.json`, un objeto por unidad. Campos que importan:

```jsonc
{
  "slug": "toyota-land-cruiser-prado-2025",  // la URL: /vehiculo/<slug>
  "muestra": true,          // QUITAR cuando la unidad sea suya de verdad
  "precio": 89900,          // en dólares
  "entrega": "showroom",    // "showroom" | "encargo"  ← el corte principal
  "origen": "dubai",        // "dubai" | "europa" | "china" | "usa"
  "sede": "la-florida",     // "la-florida" | "chacao"
  "condicion": "nuevo",     // "nuevo" (0 km) | "usado"
  "carroceria": "suv",      // suv | pickup | sedan | deportivo | hatchback
  "km": 0,                  // null si no se sabe → "Km por confirmar"
  "estado": "disponible",   // "disponible" | "reservado" | "vendido"
  "destacado": true,        // sale en el escaparate de la portada
  "detalles": ["0 km", "Full equipo de fábrica"],
  "fotos": ["/vehiculos/toyota-land-cruiser-prado-2025.jpg"]
}
```

Ojo con `km`: **`null` no es cero**. Un 0 km lleva `0`; un usado del que no se
sabe el kilometraje lleva `null` y la página escribe "Km por confirmar" en vez
de inventarse un dato.

Sin `fotos`, la ficha dibuja la silueta de su `carroceria`. Al quitar
`"muestra": true` de todas las unidades, los avisos de «Unidad de ejemplo»
desaparecen solos de toda la web.

---

## Antes de entregar

```bash
NEXT_PUBLIC_DEMO=false npm run dev   # ¿vuelve a ser el sistema entero?
npx next build && npx next lint      # ¿sigue compilando?
```

Y la lista corta:

- [ ] Cargar el inventario real desde su Instagram y quitar `"muestra": true`
- [ ] Bajar sus fotos a `public/vehiculos/`
- [ ] `domainName` / `SITE_URL` con el dominio de verdad
- [ ] `DEMO_PASSWORD` propia antes de repartir el enlace
- [ ] `demo.urlCompra` (hoy vacío → los botones llevan a `/contacto`)
- [ ] `demo.ofertaHasta` con una fecha que todavía no haya pasado
- [ ] Enganchar `app/api/contacto/route.js` al canal que elijan (será el WhatsApp)
- [ ] Repasar `/tos` y `/privacy-policy` con el cliente
- [ ] Si se apaga la demo sin haberla vendido, **vaciar el inventario antes**

---

## Desarrollo

```bash
pnpm install
pnpm --filter veloce-autos dev     # http://localhost:3000
pnpm --filter veloce-autos build
pnpm --filter veloce-autos generate-favicon   # rehace los iconos
```

Variables de entorno (`.env.local`, y hay un `.env.example` al lado):

```bash
DEMO_PASSWORD=          # contraseña de la puerta; sin ella, la de reserva
NEXT_PUBLIC_DEMO=       # "false" para entregar el sistema completo
SITE_URL=               # dominio, para el sitemap y el SEO
```
