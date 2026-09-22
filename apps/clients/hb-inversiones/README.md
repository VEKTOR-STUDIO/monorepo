# HB Inversiones · venta e importación de vehículos

Página de catálogo para **HB Inversiones C.A.**
([@hb_inversiones_12](https://www.instagram.com/hb_inversiones_12/) · 10,2 K
seguidores, 423 publicaciones), un concesionario de **Barquisimeto** que en su
bio se presenta como *"Importamos y vendemos el auto de tus sueños 📍
«Visítanos para encontrar la mejor opción para ti»"*.

Base: plantilla Shipfast del monorepo · Next.js 15 (App Router) · Tailwind 4 +
daisyUI 5 · GSAP 3. Sin base de datos: el catálogo es un JSON.

---

## De dónde sale todo

Esta página no se diseñó de cero: se calcó del material que mandó el cliente,
que está guardado en `docs/fuentes/` (fuera de `public/`, para que no se sirva
en la web):

| Archivo | Qué aportó |
|---|---|
| `CATALOGO DE VEHICULOS HB.pdf` | Las **13 unidades**, sus **13 fotos** y sus viñetas, palabra por palabra. También la dirección del local. |
| `instagram-perfil.png` | El **logotipo** (recortado a `public/marca/hb-logo.png`), la bio, la ciudad y las cifras de seguidores. |

El PDF son trece páginas con la misma retícula: negro, rojo y blanco cortados
en diagonal, el modelo en itálica condensada arriba a la izquierda, el logo de
la marca arriba a la derecha, las viñetas abajo a la derecha y la dirección
abajo a la izquierda. **Esa retícula es la identidad**, y la web la hereda
entera. Ver el comentario de cabecera de `app/globals.css`.

---

## Estado

| Pieza | Estado |
|---|---|
| Portada con las diagonales de la casa | ✅ listo |
| Catálogo completo desfilando de lado (GSAP, con `pin`) | ✅ listo |
| Corte 0 km importados / usados verificados | ✅ listo, es el filtro principal |
| Inventario con filtros (condición, tipo, marca, orden) | ✅ listo |
| Ficha por vehículo, con URL propia | ✅ listo |
| Precio en $ con equivalente en Bs. (tasa BCV del día) | ✅ listo, sin configurar nada |
| Contacto y formulario | ✅ listo, **no reenvía a ningún sitio todavía** |
| Modo demo (puerta, muro, precio, bloqueos) | ✅ activo por defecto |
| Logotipo, paleta y tipografía | ✅ sacados de su material |
| Contador de oferta limitada | ✅ con fecha real, **revísala antes de enseñarla** |
| **Precios reales** | ⏳ **pendiente — hoy son de referencia** |
| **Número de WhatsApp** | ⏳ pendiente — los botones caen al DM de Instagram |
| **Dominio** | ⏳ pendiente — hoy `hbinversiones.com` es de trabajo |
| **Panel de administración** | ⏳ no existe; la portada lo anuncia como parte de lo que se vende |

### Los precios son de referencia

El catálogo en PDF **no publica ni un precio**: trae el modelo, el año, el
kilometraje y poco más. Los precios de `data/vehiculos.json` son de referencia
de mercado, puestos para que la página se pueda enseñar funcionando, y cada
vehículo lo dice con `"precioProvisional": true`.

Eso enciende el aviso «Precio de referencia» en la ficha, en el inventario y en
la portada. **Al cargar los precios reales se quita ese campo de cada vehículo
y los avisos desaparecen solos** (`hayPreciosProvisionales()` en
`libs/vehiculos.js`).

Los vehículos y las fotos **sí son los suyos**, así que no hay nada de muestra
que sustituir ahí.

---

## Modo demo

Esta página se le enseña al dueño de HB antes de vendérsela. Con el modo demo
activo se ve casi todo, pero no se puede **usar**.

**El candado está en el servidor, no en la pantalla.** Una portada tapada con
CSS se quita con F12 en diez segundos, y justo quien evalúa comprar un sistema
es quien sabe abrir las herramientas del navegador.

| Qué corta | Dónde | Qué pasa |
|---|---|---|
| Ver cualquier página | `middleware.js` | Sin la cookie de acceso, **307 a `/entrar`**. No se sirve ni una página. |
| Entrar | `app/api/entrar/route.js` | Compara huellas SHA-256, espera 600 ms por fallo y deja una cookie `httpOnly`. |
| El inventario completo | `app/vehiculos/page.js` | Se ven `config.demo.elementosVisibles` (6) nítidos; el resto, difuminado tras `MuroDemo`. |
| Enviar el formulario | `app/api/contacto/route.js` | **403**, aunque se llame a mano con `curl`. |
| Escribir por un vehículo | `components/BotonContacto.js` | No abre WhatsApp: explica qué haría el sistema entregado. |

La contraseña **no está en `config.js`** —ese archivo lo importan componentes
de cliente y acabaría en el bundle—: vive en `libs/acceso.js`, que solo corre
en servidor, y la pisa `DEMO_PASSWORD`. Si la variable falta, se usa la de
reserva (`hbinversiones2026`), para que la demo **nunca quede abierta por un
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
PDF; y el formulario y los botones de WhatsApp empiezan a funcionar. No hay
nada más que tocar en el código.

---

## Las dos voces de la página

Aquí conviven dos cosas y el visitante tiene derecho a saber cuál está leyendo:

- **El escaparate**, que le habla a quien viene a comprar un carro. Va con la
  tipografía de la casa (Barlow Condensed itálica, Archivo).
- **La oferta**, que le habla al dueño de HB sobre el sistema que se le está
  vendiendo. Va en **Microgramma**, la tipografía de la firma de
  Vektor, la misma del crédito del pie.

Entre una y otra se cruza un `Cintillo`, que no es decoración: es el aviso de
que cambia el interlocutor.

En **la puerta** (`/entrar`) la jerarquía se invierte y manda la firma de
Vektor: quien llega todavía no es cliente de HB, es alguien a quien se
le está enseñando un trabajo. Al entrar, vuelve a mandar la marca de HB.

---

## Diseño

Todo está comentado en `app/globals.css`, pero en corto:

- **Fondo negro.** Su catálogo es negro; una web blanca hubiera sido otra
  marca. Y los vehículos que venden son casi todos claros, así que sobre negro
  recortan solos.
- **El corte en diagonal manda**, a −18° (`--angulo-hb`). Está en los fondos
  (`components/Diagonales.js`), en las etiquetas (`.bisel`), en las franjas
  (`.banda`) y en cómo entran las cosas al hacer scroll.
- **El rojo no decora, señala.** Es el precio, el botón y la condición "0 km".
  Si se usara de relleno dejaría de significar nada.
- **Las fotos se enseñan enteras**, sin recortar: son las páginas de su
  catálogo y la gráfica es suya. De ahí que `FotoVehiculo` use `object-contain`
  por defecto.
- **Nada se le superpone a la foto.** Las cuatro esquinas de esas fichas están
  ocupadas —modelo, logo de la marca, viñetas y dirección—, así que la etiqueta
  de condición va **debajo** de la imagen, no encima.

Los botones **no van sesgados** aunque todo lo demás sí: un `skewX` sobre el
botón inclina también su texto, que ya viene inclinado por la itálica, y salían
dos pendientes peleándose.

### El logotipo

- `public/marca/hb-logo.png` es su foto de perfil recortada en círculo, a
  116 px, que es la resolución que hay. **No se usa más grande que eso**; sobre
  el negro de la página el círculo de mármol funciona como una chapa y no hace
  falta fundirlo con ningún `mix-blend-mode`.
- `components/MarcaHB.js` redibuja en vector el trazo del deportivo que su
  logotipo lleva encima de las letras, para cuando hace falta grande. Si se
  toca, hay que mirarlo **al tamaño en que se usa**: la primera versión tenía
  el techo abombado y a tamaño de cabecera se leía como una mancha.

---

## Animación (GSAP)

Todo pasa por `libs/animaciones.js`, que registra los plugins una vez y fija
los tiempos y curvas de la casa. Las piezas:

| Componente | Qué hace |
|---|---|
| `TituloAnimado` | El titular asoma **línea a línea** desde detrás de una máscara (SplitText con `mask: "lines"`). |
| `Revelar` | Las entradas por scroll. Seis variantes; `corte` entra recortado en diagonal. |
| `Diagonales` | Las bandas llegan disparadas y luego se deslizan a distinta velocidad. |
| `CarruselCatalogo` | Las 13 fichas desfilan de lado con la sección **anclada** (`pin` + `scrub`). |
| `Parallax` | Las fotos se mueven más despacio que el texto. |
| `Cifra` | Los números de la portada suben contando. |
| `BarraProgreso` | El hilo rojo de arriba. |
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

## Cargar los precios reales

`data/vehiculos.json`, un objeto por vehículo. Campos que importan:

```jsonc
{
  "slug": "toyota-corolla-cross-2024",  // la URL: /vehiculo/<slug>
  "precio": 38900,                       // en dólares
  "precioProvisional": true,             // QUITAR al poner el precio real
  "condicion": "nuevo",                  // "nuevo" (0 km) | "usado"
  "carroceria": "suv",                   // "suv" | "sedan"
  "km": 0,                               // null si no se sabe → "Km por confirmar"
  "financiado": true,
  "estado": "disponible",                // "disponible" | "reservado" | "vendido"
  "destacado": true,                      // sale en el escaparate de la portada
  "detalles": ["Nuevo 0 km", "Automático", "Financiado"],  // las viñetas del PDF
  "fotos": ["/vehiculos/toyota-corolla-cross-2024.jpg"]
}
```

Ojo con `km`: **`null` no es cero**. Un 0 km importado lleva `0`; un usado del
que el catálogo no dice el kilometraje lleva `null` y la página escribe "Km por
confirmar" en vez de inventarse un dato.

---

## Antes de entregar

```bash
NEXT_PUBLIC_DEMO=false npm run dev   # ¿vuelve a ser el sistema entero?
npx next build && npx next lint      # ¿sigue compilando?
```

Y la lista corta:

- [ ] `business.whatsapp` en `config.js` (hoy vacío → DM de Instagram)
- [ ] Precios reales y quitar `precioProvisional` de cada vehículo
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
pnpm --filter hb-inversiones dev     # http://localhost:3000
pnpm --filter hb-inversiones build
pnpm --filter hb-inversiones generate-favicon   # rehace los iconos
```

Variables de entorno (`.env.local`, y hay un `.env.example` al lado):

```bash
DEMO_PASSWORD=          # contraseña de la puerta; sin ella, la de reserva
NEXT_PUBLIC_DEMO=       # "false" para entregar el sistema completo
SITE_URL=               # dominio, para el sitemap y el SEO
```
