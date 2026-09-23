# Añadir una marca al montaje de concesionarios

Todo lo que necesita una marca nueva está en cuatro archivos y una carpeta.
Ninguna escena se toca.

## 1. De dónde sale cada dato

| Campo de `Marca` | De dónde | Cómo |
| --- | --- | --- |
| `id` | tú | Slug corto, sin acentos. Compone el id de las composiciones (`<id>-vertical`) y la carpeta `public/concesionarios/<id>/`. |
| `cliente` | la carpeta en `apps/clients/` | Solo documentación, pero ponlo: es cómo se vuelve a encontrar la fuente. |
| `nombre`, `nombreCorto` | `config.js` → `appName` / la marca visible | `nombreCorto` solo si el nombre no cabe en un titular de 9:16 (`tamParaCaber` avisa a ojo: fotograma 60). |
| `tagline`, `ciudad` | `config.js` → `business.tagline`, `business.location` | Tal cual los enseña la web. |
| `dominio` | **Vercel, por el MCP** | `get_project` del proyecto → primer valor de `domains`. Nunca a mano: el alias real puede llevar sufijo (`veloce-autos-nine`). |
| `seguidores` | su perfil de Instagram, como lo escribe Instagram | «42,7 K», «5.427», «160 mil». Vacío si no hay; entonces rellena `problema`. |
| `colores` | `app/globals.css` del cliente | Sus tokens del tema (oklch) pasados a hex. Ocho campos: fondo, superficie, línea, tinta, humo, primario, sobrePrimario, acento. |
| `claro` | el tema | `true` si el fondo de la web es claro (Aprovéchalo, Top Miami). Cambia velos y sombras. |
| `display` | `app/layout.js` del cliente | La familia y el peso exactos de su clase `.display` (y `italic`/`tracking` si los usa). |
| `logo` | `public/` del cliente o su Instagram | `{ kind: "imagen", src, fondo }` con el avatar recortado en círculo; o un `kind` vectorial si su marca es un trazado (Veloce, Coronado). |
| `franja` | su identidad | Solo si la marca tiene una franja de colores (bandera, tricolor). |
| `problema` | tú, a partir de su web | Dos líneas: lo que le pasa hoy. Solo si no hay seguidores con los que armar la escena 02. |
| `diferencial` | tú, resumiendo su web | `kicker` (2-3 palabras), `lineas` (2-4 palabras grandes, la última en su color), `nota` (una frase). Es lo único del video que se redacta; sale de las secciones de su web, no se inventa. |
| `llamadaPrecio` | su web | Solo si la primera llamada del molde («precio en dólares») no le sirve (DSS: la cuota). |

Para pasar oklch a hex sin adivinar: abre la demo en el navegador y lee el
color calculado en las herramientas de desarrollo, o usa cualquier conversor.
Comprueba el contraste de `tinta` sobre `fondo` y de `sobrePrimario` sobre
`primario`: es lo que lleva el botón del teléfono y el precio del cierre.

## 2. La entrada en `marcas.ts`

```ts
{
  id: "kingscars",
  cliente: "kingscars",
  nombre: "Kings Cars",
  tagline: "Usados y 0 km en el C.C.C.T.",
  ciudad: "Caracas",
  dominio: "kingscars.vercel.app",          // leído de Vercel, no escrito
  seguidores: "12,3 K",
  colores: {
    fondo: "#0A0A0A", superficie: "#141414", linea: "#232323",
    tinta: "#F4F4F4", humo: "#8A8A8A",
    primario: "#C8102E", sobrePrimario: "#FFFFFF", acento: "#F4F4F4",
  },
  display: { family: FAMILIAS.chakra, weight: 700 },
  logo: { kind: "imagen", src: "concesionarios/kingscars/logo.jpg", fondo: "#000000" },
  diferencial: {
    kicker: "Publica gratis",
    lineas: ["Usados.", "0 km.", "Tu carro, publicado."],
    nota: "Cualquiera puede publicar su vehículo desde la web sin pagar nada.",
  },
},
```

El orden del arreglo es el de la barra lateral del estudio: pon la marca nueva
al final.

## 3. El inventario en `inventario.ts`

Cuatro unidades de `apps/clients/<cliente>/data/vehiculos.json` (`catalogo.json`
en dss-import), en este orden: las marcadas como destacadas, luego las que
tienen foto, y con carrocerías distintas para que la vitrina no parezca de un
solo modelo.

```ts
"kingscars": [
  { marca: "Toyota", modelo: "Fortuner", anio: 2022, precio: 41000, tipo: "suv", km: 38000 },
  { marca: "Chevrolet", modelo: "Silverado", anio: 2021, precio: 39500, tipo: "pickup", km: 52000 },
  { marca: "Hyundai", modelo: "Elantra", anio: 2024, precio: 29900, tipo: "sedan", km: 0 },
  { marca: "Toyota", modelo: "Hilux", anio: 2019, precio: 33000, tipo: "pickup", km: 91000 },
],
```

- `foto` solo si la demo ya tiene esa foto; se copia a
  `public/concesionarios/<id>/` con un nombre que diga qué es. Sin `foto`, el
  teléfono pinta la silueta de `tipo`, igual que la web.
- `tipo` admite `suv | sedan | pickup | camion | furgon | moto`. Si el negocio
  vende algo que no está ahí (lanchas, maquinaria), añade la silueta en
  `components/Silueta.tsx` antes de inventar un `tipo`.
- Lone Star cuenta en millas (`millas`), DSS en cuota (`cuota`, `periodo`). Si
  el negocio nuevo tiene una medida propia, es un campo opcional más en
  `Unidad` y una línea en la tarjeta del teléfono, no un montaje aparte.

## 4. Los assets

```
public/concesionarios/<id>/
├── logo.jpg                 el avatar de Instagram, cuadrado, sin recortar (el aro lo pone Logo)
└── <marca-modelo-anio>.jpg  solo las fotos que la demo ya tiene
```

Con `fondo` en `logo` se rellena lo que el avatar deja transparente o de otro
color al recortarlo en círculo. Si la marca es un trazado (no una foto), pórtalo
como componente en `components/Logo.tsx` y añade un `kind` en `types.ts`; es lo
que se hizo con la V de Veloce y el recuadro de Coronado.

## 5. Una tipografía nueva

Si su `.display` usa una familia que no está en `FAMILIAS`:

1. La TTF del peso exacto a `assets/fonts/` (un solo peso por familia: el que
   usa la web).
2. `import nuevaFuente from "./assets/fonts/Nueva-Bold.ttf";` en `fonts.ts`.
3. Una clave en `FAMILIAS` con prefijo `CV ` (`nueva: "CV Nueva"`), para no
   chocar con otros proyectos del estudio.
4. Una línea `face(FAMILIAS.nueva, nuevaFuente, { weight: 700 })` en
   `CONCESIONARIOS_FONT_CSS`. `format: "opentype"` si es `.otf`.

La regla `asset/inline` de `remotion.config.ts` la incrusta en el bundle: no
hay nada que servir ni que esperar.

## 6. Render y registro

1. Añade el id a la lista de marcas del `scripts/render-concesionarios.sh`.
2. `pnpm --filter @alessandrovaru/video run lint`.
3. Fotogramas 60 y 595 en vertical y wide (ver «Verificar antes de renderizar»
   en el SKILL.md).
4. `scripts/render-concesionarios.sh vertical <id>` y, si se va a enseñar en
   reunión, `wide`.
5. Una fila en la tabla de marcas del README de `apps/video` y la nota en
   memoria de qué era provisional.
