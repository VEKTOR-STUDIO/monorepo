# Un montaje para otro tipo de negocio

Cuando el cliente no vende vehículos —una tienda (hardcore-fitness), un coach
(coach-lms), una clínica, una plataforma de cursos— el montaje de
concesionarios no le sirve tal cual: la escena 03 recorre un inventario de
carros y la 04 habla de consignación y crédito. Pero la arquitectura sí le
sirve entera. Se crea un proyecto hermano copiando la estructura, no las
escenas.

## Qué copiar y qué rehacer

```
src/projects/<familia>/            p. ej. tiendas, coaches, clinicas
├── index.tsx                      ← copiar: dos composiciones por marca, Folder por marca
├── fonts.ts                       ← copiar; deja Microgramma y Questrial, cambia las de titulares
├── assets/fonts/                  ← Microgramma.otf y Questrial-Regular.ttf + las de la familia
├── types.ts                       ← rehacer: Marca se queda casi igual; Unidad se sustituye
├── marcas.ts                      ← nuevo, con el mismo esquema de campos
├── <catalogo>.ts                  ← lo que sustituye a inventario.ts (productos, planes, servicios)
├── components/
│   ├── Fondo.tsx, Tipos.tsx, Columna.tsx, Logo.tsx   ← copiar tal cual
│   ├── Telefono.tsx               ← copiar y cambiar SOLO lo que pinta dentro de la pantalla
│   └── Silueta.tsx                ← sustituir por el «hueco» que use esa familia (o quitar)
└── video/
    ├── timeline.ts                ← copiar: las cinco escenas y sus duraciones
    ├── <Montaje>.tsx              ← copiar de VentaWeb.tsx cambiando el nombre
    └── escenas/
        ├── Portada.tsx            ← copiar tal cual
        ├── Problema.tsx           ← copiar; revisa que la pregunta tenga sentido para ese negocio
        ├── Web.tsx                ← REHACER: qué pantallas de SU web se recorren
        ├── Diferencial.tsx        ← copiar; el contenido viene de marcas.ts
        └── Cierre.tsx             ← copiar tal cual (precio, dominio, firma)
```

Y una línea en `src/projects/index.ts` y una carpeta `public/<familia>/`.

Antes de copiar, pregúntate si lo que necesitas es de la casa: si dos
proyectos van a compartir `Tipos.tsx` o `Fondo.tsx` sin cambios, súbelos a
`src/lib/` en vez de tener dos copias que divergen. La regla del estudio es
que nada de un proyecto se importa desde otro.

## La escena 03 es la que se piensa

Es la más larga (6,6 s) y la que vende. En concesionarios el teléfono recorre
portada → inventario → ficha → WhatsApp, con cuatro golpes en frames fijos
(ver `Web.tsx`, `GOLPES`). Para otra familia se decide el recorrido con la
misma lógica: **qué cuatro pantallas de su web demuestran que la web ya hace
lo que él hace a mano hoy**.

| Negocio | Recorrido que tiene sentido |
| --- | --- |
| Tienda (hardcore-fitness) | Portada → catálogo con precios en Bs y $ → carrito → pedido por WhatsApp. |
| Coach (coach-lms) | Portada → acceso del atleta → su plan de la semana → registro de una sesión. |
| Clínica | Portada → tratamientos con precio → ficha → pedir cita. |
| Cursos | Portada → el curso → una lección → el acceso. |

Cada pantalla se pinta con datos reales de su demo (productos de su
`catalogo.json`, planes de su seed, tratamientos de su CMS), con la misma
regla que el inventario: donde la demo tiene un hueco dibujado, el video tiene
el mismo hueco.

## La escena 02 y la 04 son de datos

- **Problema.** Con seguidores de Instagram, la escena se arma sola («160 mil
  personas te siguen; ¿dónde ven lo que vendes?»). Un negocio sin Instagram
  fuerte necesita `problema: { a, b }` en su marca: dos líneas con lo que le
  pasa hoy (el PDF que reenvía por WhatsApp, la agenda en un cuaderno).
- **Diferencial.** `kicker` + 2-4 palabras grandes + una nota. Sale de su web,
  se redacta una vez y no vuelve a tocarse.

## Lo que no cambia

- `timeline.ts`: 3 + 3,4 + 6,6 + 3,3 + 3,7 s. Si una familia necesita otro
  ritmo, se cambia ahí y para toda la familia, no por marca.
- `Cierre.tsx`: `PRECIO` es el de todas las demos; la firma es «Hecho por
  Alessandrovaru de Vektor» con `alessandrovaru.com · vektorstudio.tech`; el
  dominio es el alias de Vercel con `tamEtiqueta` para que quepa.
- `Portada.tsx`: «Alessandrovaru de Vektor presenta», pequeño y arriba.
- Los dos formatos desde el mismo código, con `u` y `vertical`.

## Nombres

- El proyecto se llama por la familia, en plural y en español, como
  `concesionarios`: `tiendas`, `coaches`, `clinicas`. Su `folder` en el
  estudio, en mayúscula inicial y sin acentos (`Tiendas`).
- Las composiciones, `<marcaId>-vertical` y `<marcaId>-wide`, para que el
  script de render sirva con un cambio de carpeta de salida
  (`out/<familia>/`).
- El script de render se copia de `render-concesionarios.sh` con su lista de
  marcas y su carpeta de salida.
