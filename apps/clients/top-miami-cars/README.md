# Top Miami Cars · usados en Caracas

Página de inventario para **Top Miami Cars**, concesionario de automóviles
usados en la **Av. Los Mangos, Caracas**.

| Dato | Valor | De dónde sale |
|---|---|---|
| Nombre | Top Miami Cars | Su logotipo y su ficha de Google |
| Categoría | Concesionario de automóviles usados | Ficha de Google, literal |
| Dirección | 1050 Av. Los Mangos, Caracas 1050, Distrito Capital | Ficha de Google, literal |
| Teléfono | +58 414-1198290 | Ficha de Google, literal |
| Horario | — | Google dice «Agrega el horario completo»: no lo tienen cargado |
| Sitio web | — | Google dice «Agregar sitio web»: **es justo lo que se les vende** |
| Instagram | — | No mandaron ninguna cuenta. No se inventa |
| Opiniones | 4,0 (1 opinión) | No se enseña: con una sola opinión no es un argumento |

Base: plantilla Shipfast del monorepo · Next.js 15 (App Router) · Tailwind 4 +
daisyUI 5 · GSAP 3. Sin base de datos: el inventario es un JSON.

---

## De dónde sale todo

De **dos cosas**, y nada más:

| Material | Qué aportó |
|---|---|
| `public/marca/unnamed.webp` | El **logotipo**, tal cual llegó (1.020 px, fondo transparente). De ahí sale TODA la gráfica. |
| Su ficha de Google | Nombre, categoría, dirección y teléfono. |

`public/marca/top-miami-cars.webp` es el mismo logotipo con el margen
transparente recortado (640×484): el original es un cuadrado con más de la mitad
vacía, y al pedirle 48 px de alto el logo medía 22.

La gráfica no se inventó, se **midió sobre el archivo**:

- **Azul marino `#001478`** — el filete de «TOP MIAMI», el relleno de «CARS» y
  la línea del deportivo.
- **Acero cepillado** — el escudo: bandas de `#404848` a `#e0e0e0` con el blanco
  del reflejo entre medias. Es `--cromo` en `app/globals.css` y `<Acero>` en
  `components/MarcaTopMiami.js`; **si se toca una, se toca la otra**.
- **La letra** — ancha, pesada, de esquinas redondeadas, con la O casi
  rectangular. **Russo One** es de esa misma familia de formas y es libre.
- **Filete y sombra dura** — sus letras llevan contorno y una sombra gris sin
  difuminar, caída abajo a la derecha. Hay dos tratamientos y uno es el negativo
  del otro: «TOP MIAMI» (blanco, filete azul) y «CARS» (azul, filete blanco).
  Son `.rotulo-marca` y `.rotulo-marca-inverso`, y también los dos botones.
- **El escudo y la línea del carro** — los dos gestos del emblema, redibujados
  en vector para poder animarlos: `components/MarcaTopMiami.js`.

**El tema es claro, y tiene que seguir siéndolo.** El logotipo está hecho para
blanco: sobre oscuro la línea del carro desaparece. Las secciones en azul
(`.sobre-azul`) llevan la marca **escrita**, nunca la imagen.

---

## Lo que NO hay, y cómo está marcado

**No hay inventario, ni precios, ni una sola foto suya.** No mandaron nada de
eso y no tienen dónde leerlo. La demo se enseña llena igualmente, y lo dice:

| Bandera en `data/vehiculos.json` | Aviso en pantalla | Cuántas |
|---|---|---|
| `deMuestra: true` | «Unidad de ejemplo» | las 14 |
| `precioProvisional: true` | «Precio de referencia: aquí va el tuyo» | las 14 |
| `fotos: []` | «Aquí va tu foto» + la pieza dibujada | las 14 |

Los avisos salen en los tres sitios donde se mira —**tarjeta, ficha y
portada**— y desaparecen solos al quitar la bandera. Arriba del JSON hay un
`_nota` que lo explica con el archivo delante.

**El hueco de la foto se dibuja**, no se rellena con fotos de banco de imágenes:
`components/PlantillaPublicacion.js` monta su propia pieza —el salón blanco, su
escudo de acero detrás, la silueta de la carrocería en su azul, el modelo con el
filete de sus letras y la pastilla del año y el kilometraje—. Las siluetas
(`components/Silueta.js`) son genéricas, de perfil, y no son el contorno de
ningún modelo ni de ninguna marca.

Tampoco se inventan datos del negocio: **sin Instagram confirmado, `instagram`
va vacío y la web no enseña ningún enlace; sin horario, no se enseña horario**.
El lema («Usados top, listos para rodar») **es mío, no suyo**: no publican
ninguno. Se cambia en `config.js`.

---

## Estado

Hecho:

- Portada, inventario con filtros, ficha por unidad, contacto, legales, 404.
- El corte principal es la **carrocería** (camionetas, sedanes, pick-ups,
  compactos, deportivos): es un salón de usados y es por donde pregunta la
  gente. La condición 0 km / usado se conserva en el dato pero el filtro solo
  sale si hay de las dos.
- Precio en dólares con su equivalente en bolívares a la tasa del BCV.
- Modo demo completo: puerta, franja, muro, bloque de venta, aviso flotante.

Falta:

- **El panel** que anuncia la portada todavía no existe: hoy el inventario es
  el JSON.
- El reenvío del formulario de contacto (ver el PENDIENTE de
  `app/api/contacto/route.js`).
- Todo lo de «Antes de entregar», abajo.

---

## Modo demo

Esta página se le enseña a Top Miami Cars antes de vendérsela. Con el modo demo
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
| Escribir por una unidad | `components/BotonContacto.js` | No abre WhatsApp: explica qué haría el sistema entregado. |

Ese último corte **no es cosmético aquí**: el +58 414-1198290 es el teléfono
real de su ficha de Google, así que si el botón abriera de verdad, cualquiera
que esté probando la demo les estaría mandando pedidos falsos. Lo único que sí
sale hacia fuera es «Cómo llegar», que abre Google Maps, no al negocio.

La contraseña **no está en `config.js`** —ese archivo lo importan componentes
de cliente y acabaría en el bundle—: vive en `libs/acceso.js`, que solo corre
en servidor, y la pisa `DEMO_PASSWORD`. Si la variable falta, se usa la de
reserva (`topmiami2026`), para que la demo **nunca quede abierta por un
olvido**. **Cámbiala antes de repartir el enlace.**

Comprobarlo, no suponerlo:

```bash
grep -rl "<la-clave>" .next/static/   # no debe devolver nada
```

La huella de la cookie lleva el nombre del cliente como sal
(`top-miami-cars::acceso::…`), así que aunque dos demos acabaran con la misma
contraseña, la cookie de una no vale en la otra.

**La puerta es lo que permite enseñar material ajeno**: contraseña más
`noindex` significa que su logotipo no acaba indexado en Google colgando de otro
dominio. Si algún día se apaga la demo sin que hayan comprado, **se vacía el
catálogo y se quita el logotipo antes de abrirla**.

La puerta cabe en una pantalla sin scroll y está **medida**, no mirada
(`scrollHeight - clientHeight` a cero): 390×844, 360×800, 360×640, 1440×800,
1440×900 y 1920×1080. Si crece la lista de `config.demo.incluye`, se vuelve a
medir.

### Apagarlo el día de la entrega

```bash
NEXT_PUBLIC_DEMO=false
```

Eso solo: desaparecen la puerta, la franja de arriba, el muro del inventario,
el aviso flotante, los cintillos, el bloque de venta y la comparación con
vender solo por WhatsApp; y el formulario y los botones de WhatsApp empiezan a
funcionar. No hay nada más que tocar en el código.

---

## Las dos voces de la página

- **El escaparate** le habla a quien viene a comprar un carro. Va con la
  tipografía de la casa (Russo One + Titillium Web).
- **La oferta** le habla al dueño de Top Miami Cars sobre el sistema que se le
  vende. Va en **Microgramma**, la tipografía de la firma de Alessandrovaru.

Entre una y otra se cruza un cintillo azul animado (`components/Cintillo.js`),
con un escudo pequeño de separador. En la puerta la jerarquía se invierte: manda
la firma de Alessandrovaru, porque quien llega todavía no es cliente de nadie.

---

## Diseño

| Pieza | Dónde | Qué es |
|---|---|---|
| Tema `topmiami` | `app/globals.css` | Claro. Blanco, gris frío, azul `#001478` y acero. |
| `.display` | `app/globals.css` | Russo One. **Un solo peso**: nada de `font-bold` encima, el navegador fabricaría una negrita falsa. Para precios grandes se usa `display`, no `cifra font-bold`. |
| `.rotulo-marca` / `-inverso` | `app/globals.css` | El filete y la sombra dura de sus letras. **Solo titulares grandes**: por debajo de ~22 px el contorno empasta. |
| `.btn-primary` / `.btn-filo` | `app/globals.css` | «CARS» y «TOP MIAMI» hechos botón, con la sombra dura que se aplasta al pulsar. |
| `.ficha` | `app/globals.css` | Tarjeta blanca con el borde de arriba en acero; al pasar por encima se levanta y deja la sombra dura. |
| `.sobre-azul` / `.sobre-claro` | `app/globals.css` | Secciones en azul que recalculan la tinta por variable, y la tarjeta blanca que la deshace dentro. |
| `--escudo` | `app/globals.css` | El contorno del escudo como `clip-path`: viñetas, separador del cintillo, sello de rebaja. |
| `Escenario` | `components/Escenario.js` | El escudo y la línea del carro como capa de fondo de una sección. |
| `Emblema`, `Escudo`, `LineaCarro` | `components/MarcaTopMiami.js` | Los dos gestos, en vector. |

### El logotipo

`components/Logo.js`. El archivo trae fondo transparente, así que no hace falta
ni filtro ni `mix-blend-mode`. A tamaño de cabecera el rótulo de dentro del logo
son 9 px de letra y no se lee: por eso `<Logo />` lo repite escrito al lado, con
el mismo reparto («TOP MIAMI» arriba, «CARS» debajo).

Los iconos (`app/icon.svg`, `public/favicon*.svg`) se generan con
`scripts/generate-favicon.mjs`: el escudo de acero y la línea azul, que es lo
que sobrevive a 32 px.

---

## Animación (GSAP)

Todo pasa por `libs/animaciones.js`, que registra los plugins una vez y fija
los tiempos y curvas de la casa. Las piezas:

| Componente | Qué hace |
|---|---|
| `Escenario` | **La línea del carro se dibuja sola** (`stroke-dashoffset`, con `pathLength="1"`) y el escudo llega desde el desenfoque, como una chapa que se posa. Al hacer scroll, cada pieza va a su velocidad. |
| `TituloAnimado` | El titular asoma **línea a línea** desde detrás de una máscara (SplitText con `mask: "lines"`). |
| `Revelar` | Las entradas por scroll. Seis variantes; `corte` entra recortado en diagonal. |
| `CarruselCatalogo` | Las fichas desfilan de lado con la sección **anclada** (`pin` + `scrub`). |
| `Parallax` | Las imágenes se mueven más despacio que el texto. |
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

Cuidado con el recorte de líneas: `mask: "lines"` recorta a ras de la caja de la
línea y se comería **las tildes** de las mayúsculas y, aquí además, **el filete
y la sombra** del rótulo. El hueco se lo da `.linea-titulo-mask` en
`app/globals.css`.

---

## Cargar el inventario real

Hoy todo vive en `data/vehiculos.json`. Por cada unidad suya:

1. Se escribe la ficha **leyéndola**, no con un script: marca, modelo, versión,
   año, kilometraje y precio literales, tal como los publiquen o los manden por
   WhatsApp. Un año mal adivinado se descubre en la primera pregunta de la
   reunión.
2. Lo que no digan —color, puestos, tracción, documentos— se deja **vacío**,
   nunca a ojo. La ficha técnica ya esconde sola los campos vacíos.
3. `carroceria` es una de `suv`, `sedan`, `pickup`, `hatchback`, `coupe`. Si
   venden otra cosa, se añade en `TIPOS` (`libs/vehiculos.js`) y se dibuja su
   silueta en `components/Silueta.js`.
4. Las fotos van en `public/vehiculos/<slug>/` y se listan en `fotos`. En cuanto
   una ficha trae `fotos`, la pieza dibujada desaparece sola.
5. Se **quitan** `deMuestra` y `precioProvisional`. Los avisos de la tarjeta, de
   la ficha y de la portada se van solos; cuando no quede ninguna, desaparece
   también el bloque «Sobre este inventario» de la portada.
6. Se borran las 14 unidades de ejemplo y se actualiza `_nota` y `actualizado`.

---

## Antes de entregar

- [ ] **Cambiar la clave** de la demo (`DEMO_PASSWORD`) antes de mandar el enlace.
- [ ] **Confirmar el WhatsApp.** El +58 414-1198290 es el teléfono de Google; es
      un móvil, pero hay que confirmar que atiende WhatsApp.
- [ ] **Instagram**, si tienen: `config.business.instagram` e `instagramUrl` (y
      los de `sedes[0]`). Aparece solo en el pie, en contacto y en la portada.
- [ ] **Horario**: `config.business.horario`. Vacío, la web dice «con cita
      previa por WhatsApp».
- [ ] **Dominio**: `topmiamicars.com` es un supuesto. `config.domainName`,
      `SITE_URL` y `next-sitemap.config.js`.
- [ ] **El lema** y los textos de la portada, que son míos.
- [ ] **Confirmar la urbanización.** Solo se escribe lo que dice Google («Av. Los
      Mangos, Caracas 1050»); no se añadió ninguna zona a ojo.
- [ ] El inventario real, los precios y las fotos (arriba).
- [ ] `urlCompra` en `config.demo`, si el botón de comprar debe ir a un enlace de
      pago y no a `/contacto`.
- [ ] Que pongan la página en su ficha de Google, donde hoy dice «Agregar sitio
      web».

---

## Desarrollo

```bash
pnpm install
pnpm --filter top-miami-cars dev     # http://localhost:3000
pnpm --filter top-miami-cars build
pnpm --filter top-miami-cars generate-favicon   # rehace los iconos
```

Variables de entorno (`.env.local`, y hay un `.env.example` al lado):

```bash
DEMO_PASSWORD=          # contraseña de la puerta; sin ella, la de reserva
NEXT_PUBLIC_DEMO=       # "false" para entregar el sistema completo
SITE_URL=               # dominio, para el sitemap y el SEO
```

Comprobar antes de dar algo por hecho:

```bash
npx next build && npx next lint
NEXT_PUBLIC_DEMO=false npm run dev   # ¿vuelve a ser el sistema entero?
```

Y mirar la pantalla entera, de arriba abajo: los fallos de esta capa son
secciones que no aparecen, y esas no dan error en consola.
