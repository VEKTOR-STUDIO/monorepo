# @alessandrovaru/video — el estudio de video del monorepo

Proyecto de [Remotion](https://remotion.dev): videos escritos como componentes de
React, renderizados a MP4. Un mismo estudio aloja **varios proyectos**, uno por
cliente, cada uno con su marca, sus assets y sus composiciones.

```bash
pnpm run dev --filter @alessandrovaru/video
```

Abre el estudio en `http://localhost:3000`. En la barra lateral cada cliente sale
como una **carpeta** con sus videos dentro.

---

## Estructura

```
apps/video/
├── remotion.config.ts          ← códec, calidad y la regla que incrusta fuentes
├── public/
│   └── <cliente>/              ← assets servidos por HTTP (imágenes)
└── src/
    ├── index.ts                ← registerRoot
    ├── Root.tsx                ← recorre el registro y crea una carpeta por proyecto
    ├── lib/                    ← utilidades compartidas entre TODOS los clientes
    │   ├── project.ts          ← el tipo VideoProject
    │   ├── layout.ts           ← useStage(): la escala que sirve para 9:16 y 16:9
    │   └── anim.ts             ← slamIn, flyIn, riseIn, shake, countTo…
    └── projects/
        ├── index.ts            ← EL REGISTRO. Una línea por cliente.
        ├── concesionarios/     ← 13 marcas de carros, un montaje compartido
        └── roll-prep/
            ├── index.tsx       ← las <Composition /> del cliente
            ├── theme.ts        ← paleta y tipografías de la marca
            ├── fonts.ts        ← carga las fuentes (incrustadas en el bundle)
            ├── assets/fonts/   ← los TTF de la marca
            ├── components/     ← primitivas de marca (Backdrop, CaosCard, Dice…)
            └── videos/
                ├── modo-caos/
                │   ├── ModoCaos.tsx   ← el montaje
                │   ├── timeline.ts    ← duración de cada escena
                │   ├── content.ts     ← todo el copy y las cifras
                │   └── scenes/        ← una escena por archivo
                ├── competidores/      ← la cartelera, un episodio por vez
                │   ├── Competidores.tsx
                │   ├── timeline.ts
                │   ├── content.ts     ← LOS NOMBRES DEL EPISODIO
                │   └── scenes/
                └── recap/             ← cómo terminó el torneo anterior
                    ├── Recap.tsx
                    ├── timeline.ts
                    ├── content.ts     ← CARTAS, RESULTADOS Y RANKING
                    └── scenes/
```

`src/lib/` es de la casa; `src/projects/<cliente>/` es del cliente. Nada de un
cliente se importa desde otro: si dos videos necesitan lo mismo, sube a `lib/`.

---

## Agregar un proyecto nuevo

1. Crea `src/projects/<cliente>/index.tsx` exportando un `VideoProject`:

   ```tsx
   import { Composition } from "remotion";
   import { defineProject } from "../../lib/project";

   const Compositions: React.FC = () => (
     <Composition
       id="mi-video"
       component={MiVideo}
       durationInFrames={900}
       fps={30}
       width={1080}
       height={1920}
     />
   );

   export const miCliente = defineProject({
     id: "mi-cliente",
     folder: "MiCliente",       // solo [A-Za-z0-9-]
     description: "Para qué son estos videos.",
     Compositions,
   });
   ```

2. Pon sus imágenes en `public/<cliente>/` — así nunca chocan dos clientes.

3. Añade una línea en `src/projects/index.ts`:

   ```ts
   export const projects: VideoProject[] = [rollPrep, miCliente];
   ```

Listo: la carpeta aparece sola en el estudio.

---

## Videos publicados

### RollPrep · Modo CAOS

Explicador animado de la modalidad de torneo CAOS, en el lenguaje visual de la
app: negro profundo, volt neón (`#D4FF00`), Anton condensado, cortes en
diagonal, trama halftone y líneas de velocidad. 62 s, 10 escenas.

| Composición | Formato | Para qué |
| --- | --- | --- |
| `caos-vertical` | 1080×1920 | Reels, historias, TikTok |
| `caos-wide` | 1920×1080 | Proyectarlo en clase, YouTube |

```bash
pnpm --filter @alessandrovaru/video run render:caos        # vertical
pnpm --filter @alessandrovaru/video run render:caos-wide   # horizontal
```

Sale en `out/`. Para un frame suelto:

```bash
pnpm --filter @alessandrovaru/video exec remotion still caos-vertical out/frame.png --frame=45
```

**El copy no se inventa.** Las cartas, las probabilidades y las cifras de XP
están copiadas de `apps/clients/roll-prep/libs/caos.js` y `CONCEPTO.md` a
`videos/modo-caos/content.ts`. Si el mazo cambia en la app, ese archivo es el
único que hay que actualizar.

### RollPrep · Competidores (Episodio 02)

La cartelera del episodio: portada con el número, un competidor por escena y
los cuatro juntos al final. Es la versión en movimiento de la story de lineup
que la app genera en `app/api/invitaciones/[slug]/lineup/card.js` — misma
chapa, misma alternancia volt/rojo por puesto, misma chapa de cinturón. 28 s.

| Composición | Formato | Para qué |
| --- | --- | --- |
| `competidores-ep02-vertical` | 1080×1920 | Stories, reels |
| `competidores-ep02-wide` | 1920×1080 | Pantalla del gym, YouTube |

```bash
pnpm --filter @alessandrovaru/video run render:ep02        # vertical
pnpm --filter @alessandrovaru/video run render:ep02-wide   # horizontal
```

**Para el episodio siguiente** basta con duplicar `videos/competidores/` (o
cambiar su `content.ts` si el anterior ya se publicó) y registrar el par de
composiciones en `index.tsx`. Todo lo que cambia de un episodio a otro vive en
`content.ts`: el número, la fecha y los peleadores. Ni el montaje ni las
escenas saben cuántos son — `timeline.ts` construye las escenas de
presentación a partir de `FIGHTERS`, así que quitar o añadir un nombre
recoloca el video entero solo.

Los cinturones salen de `theme.ts` (`belts`), con los mismos hex que
`libs/gamification.js`. Ojo con el nombre: la app lista el morado como
*Violeta*; en pantalla se lee **Morado**, que es como se dice en el gym.

### RollPrep · Recap (Episodio 01)

Cómo terminó el torneo anterior: una escena por pelea —terreno, la carta
partida en sus dos mitades y el resultado— y el tablero final en Puntos de
CAOS. 42 s.

| Composición | Formato | Para qué |
| --- | --- | --- |
| `recap-ep01-vertical` | 1080×1920 | Stories, reels |
| `recap-ep01-wide` | 1920×1080 | Pantalla del gym, YouTube |

```bash
pnpm --filter @alessandrovaru/video run render:recap        # vertical
pnpm --filter @alessandrovaru/video run render:recap-wide   # horizontal
```

**El copy de las cartas no se inventa.** Terrenos, duelos, mitades, arranques y
niveles están copiados literalmente de `apps/clients/roll-prep/libs/caos.js`
(`TERRAINS`, el mazo de duelos y `TIER_LABELS`). Lo único que aporta
`content.ts` es qué salió en cada pelea, quién ganó y cómo quedó el ranking —
ese último con las mismas cifras que `caos_leaderboard` pinta en
`app/dashboard/ranking/caos`.

**El resultado se canta al final, nunca antes.** Primero el terreno, después
las dos mitades, y solo entonces el ganador: contar el resultado antes que las
cartas sería contar el partido por el marcador. La carta que pierde se apaga
en vez de desaparecer, para que se siga leyendo de qué lado le tocó a cada uno.

Una escena por pelea sale de `MATCHES`: un torneo de ocho combates se recorta
solo desde `content.ts` sin tocar el montaje.

### Concesionarios · Video de venta (13 marcas)

Un video de 20 s por cada demo de carros de `apps/clients/`, para mandárselo al
dueño por WhatsApp. Un solo montaje (`src/projects/concesionarios/video/`)
parametrizado por marca: cada video sale con la paleta de su `globals.css`, la
tipografía de titulares de su `layout.js`, su logo, su tagline y cuatro unidades
de su inventario.

| Escena | Qué cuenta |
| --- | --- |
| La marca (3 s) | Logo, nombre, lema y ciudad. Arriba, pequeño: «Alessandrovaru de Vektor presenta». |
| Lo que pasa hoy (3,4 s) | Sus seguidores de Instagram y la pregunta: ¿dónde ven tu inventario? |
| Su web (6,6 s) | Un teléfono con SU web: portada, inventario, ficha y botón de WhatsApp. |
| Diferencial (3,3 s) | El corte de su negocio (consignación, crédito, subastas, camiones…). |
| Cierre (3,7 s) | El enlace de su demo en Vercel, $740 tachado → $449 y «Hecho por Alessandrovaru de Vektor» con los dos dominios. |

Tipografías: **Microgramma** (la firma de la casa, Alessandrovaru de Vektor) en etiquetas, dominio
y firma; **Questrial** como voz de todo el texto corrido; y la de titulares de
cada web (Sora, Saira, Barlow Condensed, Cinzel, Chakra Petch, Russo One, Exo 2).

```bash
pnpm --filter @alessandrovaru/video run render:concesionarios        # 13 verticales
pnpm --filter @alessandrovaru/video run render:concesionarios-wide   # 13 horizontales
scripts/render-concesionarios.sh vertical kingscars                  # solo una
```

Salen en `out/concesionarios/<marca>-<formato>.mp4`.

- **Datos de marca**: `marcas.ts`. **Inventario**: `inventario.ts` (copiado de
  `data/vehiculos.json` de cada cliente; los precios son los de la demo, casi
  todos de muestra). Si llega el inventario real, se cambia ahí y se re-renderiza.
- Solo hay foto donde la demo ya la tiene (Aprovéchalo, Citta y Venta Nacional
  con fotos de stock; HB y Lone Star con las suyas). El resto va con la silueta
  de su carrocería, igual que su web.
- Veloce y Coronado usan su logo en vector (portado de `MarcaVeloce.js` y
  `MarcaCoronado.js`); los demás, su avatar de Instagram recortado en círculo.
- El precio ($740 → $449) es el de todas las demos y vive en `escenas/Cierre.tsx`.
- El enlace (`dominio` en `marcas.ts`) es el alias de producción de cada
  proyecto en Vercel, leído del proyecto y no compuesto a mano: a Veloce le tocó
  `veloce-autos-nine.vercel.app`. El tamaño se ajusta solo a su largo. Cuando un
  cliente compre su dominio, se cambia ahí y se re-renderiza su video.

---

## Cómo están hechas las escenas

**Una unidad para los dos formatos.** `useStage()` devuelve `u`, que es el 1% del
**lado corto**. Un 1080×1920 y un 1920×1080 tienen el mismo lado corto, así que
un titular de `9 * u` se ve del mismo tamaño físico en ambos. Lo único que
cambia entre formatos es cuánto sitio hay en el eje largo: las escenas leen
`vertical` y apilan o ponen en fila. Por eso las dos composiciones comparten el
100% del código.

**El montaje vive en `timeline.ts`.** Cada escena declara su duración; los
frames de entrada se calculan solos y `TOTAL` con ellos. Ninguna escena conoce
su posición absoluta: todas animan desde su frame 0 dentro de su `<Sequence>`.

**Los cortes son secos.** Un fighting game no hace crossfade. Entre escena y
escena solo hay un destello de dos frames.

---

## Notas de render

- **Las fuentes van incrustadas en el bundle**, no en `public/`, y se declaran
  con un `@font-face` normal — sin `delayRender`. La regla `asset/inline` de
  `remotion.config.ts` convierte los TTF en data URI durante el bundling, y
  Remotion ya espera `document.fonts.ready` antes de capturar cada frame, así
  que no hay nada que retener a mano. Las dos alternativas se probaron y las dos
  tumbaban renders largos a mitad de camino: servirlas por HTTP (alguna petición
  se atasca con la concurrencia alta) y esperar `FontFace.load()` con un
  `delayRender` propio (la promesa se cuelga). Con este montaje, el peor caso es
  un frame con la tipografía de respaldo, no un render muerto.
- **Linux necesita las librerías de Chrome headless.** Si el render falla con
  `Failed to launch the browser process`:
  ```bash
  sudo apt-get install -y libnss3 libnspr4 libasound2t64
  ```
- **`NODE_OPTIONS=--max-http-header-size=65536` en los scripts del estudio.** Las
  cookies del navegador no distinguen puerto: las de Supabase que dejan los
  clientes Next en `localhost` se mandan también al estudio y se pasan del tope
  de 16 KB de cabeceras que trae Node, que responde `431 Request Header Fields
  Too Large` y deja la página en blanco. Es la misma bandera que ya lleva
  `apps/clients/roll-prep` en su `dev`. Alternativa manual: borrar las cookies
  de `localhost`.
- `pnpm run build` hace `remotion bundle` a `dist/`; `pnpm run lint` es
  `tsc --noEmit`.
