# Centro de control

El tablero del monorepo. Lleva un negocio desde «lo vi en Instagram» hasta
«demo lista para enseñar» sin salir de una página: se apunta el candidato, se
le copia el proyecto que más se le parezca, se le carga su material y, al
pasarlo a **Por hacer**, una sesión de Claude adapta la copia con la skill
`demo-de-venta`.

**Solo funciona en local.** Escribe en el disco del repo y lanza procesos: no
se despliega, y se niega a hacer nada si detecta que corre en Vercel.

```bash
pnpm --filter @alessandrovaru/control dev     # http://127.0.0.1:4000
```

Va en el 4000 para no chocar con el cliente que tengas abierto en el 3000, y
escucha solo en `127.0.0.1`: nadie de tu red puede entrar.

## El recorrido de una tarjeta

| Columna | Qué significa | Cómo se entra |
|---|---|---|
| **Candidatos** | Un negocio al que venderle. Sin carpeta. | «+ Nuevo candidato» |
| **Preparando** | Ya tiene su copia en `apps/clients`. Se le carga material y encargo. | Sola, al copiar la plantilla |
| **Por hacer** | En la cola de la rutina. | Arrastrándola, o con el botón de la ficha. **Lanza a Claude.** |
| **En proceso** | Claude está trabajando. | Solo la rutina; a mano no se puede |
| **Revisión** | La rutina terminó. Toca mirarla entera. | Sola, al terminar |
| **Publicada** | En línea y con el enlace repartido. | A mano, después de `/publicar-en-vercel` |

Si la rutina falla, la tarjeta vuelve a **Por hacer** marcada como «Falló», con
el motivo en la ficha, y no se relanza sola. Si la detienes, vuelve a
**Preparando**.

## Qué hace «Copiar plantilla»

Es el `cp -r` de siempre con lo que a mano se olvida:

- Copia la carpeta entera **menos** `node_modules`, `.next`, `.turbo`, `out`,
  **`.vercel`** y **`docs/fuentes`**.
  - `.vercel` es el vínculo con el proyecto de Vercel del original: copiado, el
    primer despliegue del cliente nuevo pisaría la demo del otro.
  - `docs/fuentes` es el material del otro negocio. Mezclado con el nuevo, la
    rutina no sabría de quién es cada cosa.
- Renombra el `name` del `package.json`, respetando si el original iba con
  `@alessandrovaru/` o sin él.
- Si algo falla a mitad, borra lo copiado: no deja carpetas a medias.

`.env.local` **sí** viaja, para que la copia arranque. La rutina tiene orden de
ponerle una `DEMO_PASSWORD` nueva y vaciar las credenciales heredadas.

Se puede copiar cualquier carpeta de `apps/clients` y las dos plantillas en
blanco (`vanilla-template` y `vanilla-template-supabase`).

## Qué hace la rutina

`scripts/rutina.mjs <id>`, lanzado suelto del servidor de Next — si reinicias
el centro de control o cierras la terminal, la rutina sigue hasta acabar.

1. Deja en `apps/clients/<carpeta>/docs/fuentes/` el material y un `encargo.md`
   con los datos del negocio, tus notas y lo que pediste.
2. `pnpm install` en la raíz, para que el cliente nuevo entre al workspace.
3. `claude -p` desde la raíz del repo, con el prompt de `libs/rutina.mjs`
   (`redactarPrompt`): cargar `demo-de-venta`, leer todo el material,
   reidentificar el cliente entero, seguir la skill, comprobar con build, lint
   y curl, y no terminar mientras quede rastro del cliente de origen.
4. Claude deja `docs/PENDIENTES.md` en el cliente y un resumen que sale en la
   ficha. La tarjeta pasa a **Revisión**.
5. Se lanza la siguiente de la cola.

**Corre una a la vez.** Dos sesiones instalando y compilando en el mismo
monorepo se pisan el `pnpm-lock.yaml` y la caché; las demás esperan turno.

La ficha enseña el registro en vivo y, al acabar, el comando
`claude --resume <sesión>` para seguir esa misma conversación en la terminal.

### Lo que la rutina no puede hacer

Está en `PROHIBIDAS` (`libs/rutina.mjs`) y vale también en el modo sin
preguntas: **ni commit, ni push, ni Vercel, ni Supabase**. Todo lo que sale del
disco se decide a mano, después de revisar. Tampoco `pkill`: el centro de
control es un `next dev`, y un `pkill -f "next dev"` lo tumbaría. Cada rutina
prueba su cliente en un puerto propio (43xx) y lo cierra con `fuser`.

### Permisos

Por defecto `acceptEdits`: edita archivos sin preguntar y, de la terminal, solo
ejecuta lo que hay en `PERMITIDAS`. En modo headless nadie contesta a un
permiso, así que lo que no esté en la lista se deniega y Claude se busca otra
manera. Si ves en el registro muchas líneas `✗` por permisos, o amplías la
lista o pones en `apps/control/.env.local`:

```bash
CONTROL_CLAUDE_MODO=bypassPermissions
```

Ahí mismo se cambian el modelo (`CONTROL_CLAUDE_MODELO`) y la ruta del
ejecutable (`CONTROL_CLAUDE_BIN`). Ver `.env.example`.

## Dónde se guarda todo

```
apps/control/data/              ← fuera de git (.gitignore)
├── rutina.lock                 ← quién está corriendo ahora
├── prospectos/
│   ├── mensaje.md              ← la plantilla común del mensaje
│   └── <id>.json               ← la ficha: contacto, estado, respuesta, notas
└── candidatos/<id>/
    ├── candidato.json          ← la tarjeta: datos, etapa, rutina, historial
    ├── material/               ← lo que subiste
    ├── registro.log            ← lo que se ve en la ficha
    └── registro.jsonl          ← los eventos de Claude, en crudo
```

Sin base de datos a propósito: es una herramienta local y así se puede abrir,
copiar o arreglar con un editor. **No se sube** porque son prospectos y
material que todavía no es de nadie; lo que sí se sube es lo que la rutina deja
dentro de `apps/clients/<carpeta>`. Si quieres conservar el tablero, haz copia
de `data/`.

Borrar una tarjeta borra su carpeta de `data/` y **nunca** la de
`apps/clients`: eso es código y se borra a mano.

## La página de Clientes

Todas las carpetas de `apps/clients`, leídas del disco y de git en el momento:
si llevan la capa de demo, si está apagada, si están vinculadas a Vercel en
este equipo, cuántos cambios tienen sin subir, su último commit, en qué columna
del tablero están y el comando para levantarlas.

## La página de Prospectos

La fase que viene después de «Publicada»: hablar con la persona. Un prospecto
es un negocio que ya tiene demo publicada **y video** (ver `apps/video` y la
skill `video-de-venta`): tener video significa que la demo está adaptada,
presentable y en línea, así que es alguien a quien escribir.

- **Importar desde los videos** lee `marcas.ts` del estudio y crea una ficha
  por marca que no exista aún, con su enlace de Vercel, su Instagram y su
  WhatsApp (del `config.js` del cliente) y la contraseña de la demo (la del
  `.env.local` o, si no hay, la de reserva de `libs/acceso.js`). Los que ya
  existen no se tocan: su conversación vale más que los datos de origen.
- Cada ficha lleva el **estado** de la conversación (por contactar →
  contactado → respondió → negociando → vendido / descartado), con quién se
  habla y por dónde, qué contestó, el siguiente paso y una fecha de
  seguimiento (vencida, sube arriba en la lista).
- **El mensaje** sale de una plantilla común (`data/prospectos/mensaje.md`,
  editable desde la lista) rellenada con `{nombre}`, `{enlace}`, `{clave}`,
  `{ciudad}` e `{instagram}`. Se copia con un clic o se abre WhatsApp con el
  texto ya escrito (`wa.me`). Si se retoca en una ficha, se guarda solo para
  ese prospecto. Lo que falte sale entre corchetes para que se note.
- **El video** se ve y se descarga desde la ficha
  (`/api/prospectos/<id>/video?formato=vertical|wide`); WhatsApp no deja
  adjuntarlo desde un enlace, así que se arrastra al chat a mano.
- **«Ya lo mandé»** fecha el primer contacto, renueva el último y pasa la
  ficha a «Contactado» si estaba por contactar.

Ojo con la contraseña: es la que hay en el disco. Si al publicar se puso una
`DEMO_PASSWORD` distinta en Vercel, hay que corregirla en la ficha, que avisa
de dónde la leyó.

## Mapa del código

| Archivo | Qué hay |
|---|---|
| `libs/etapas.js` | Las columnas y sus reglas (`dispara`, `automatica`) |
| `libs/almacen.mjs` | Leer y escribir tarjetas y material |
| `libs/plantillas.mjs` | Qué se puede copiar y la copia |
| `libs/rutina.mjs` | El prompt, los permisos, el cerrojo y la cola |
| `scripts/rutina.mjs` | El proceso de la rutina |
| `libs/clientes.mjs` | El estado de cada carpeta de `apps/clients` |
| `libs/prospectos.mjs` | Las fichas de prospectos, la plantilla del mensaje y la importación desde `apps/video` |
| `libs/contacto.js` | Los estados de la conversación y los canales |
| `app/acciones-prospectos.js` | Todo lo que la página de Prospectos puede cambiar |
| `libs/local.js` | Lo que impide usarlo desde fuera de tu máquina |
| `app/acciones.js` | Todo lo que el tablero puede cambiar |

Los `.mjs` solo usan módulos de Node: los importan a la vez el servidor de Next
y el script de la rutina, que corre fuera de Next.

## Por dónde seguir

- Botón para levantar la demo desde **Revisión** y abrirla, en vez de copiar el
  comando.
- Una segunda rutina para **Publicada** con la skill `publicar-en-vercel`. Hoy
  se queda a mano a propósito: es lo único del recorrido que sale a internet.
- Traer los candidatos desde fuera (una hoja, un formulario) en vez de
  apuntarlos uno a uno.
