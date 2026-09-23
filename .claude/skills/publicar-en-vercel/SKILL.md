---
name: publicar-en-vercel
description: Publica una app de `apps/clients/*` en Vercel y deja un enlace que se le pueda mandar a un cliente por WhatsApp. Cubre crear el proyecto ligado al repo, apuntarlo a la carpeta correcta dentro del monorepo, quitar la protección de Vercel que impediría entrar, poner la contraseña de la demo y verificar que la puerta cierra de verdad. Úsala siempre que se hable de "subir", "publicar", "desplegar", "deployar", "sacar a producción", "poner en línea" o "mandarle el enlace" a un cliente; de crear un proyecto en Vercel; de por qué un enlace pide iniciar sesión, da 404 o entra sin pedir contraseña; y para revisar qué clientes del monorepo siguen sin publicar. También sirve para cambiar la clave o el dominio de una demo ya publicada, y para activar o revisar Web Analytics de Vercel en una demo: úsala cuando se hable de "analytics", "visitas", "cuánta gente entró", "si abrió el enlace" o de dónde ver quién ha visto una demo.
---

# Publicar en Vercel

Cada carpeta de `apps/clients/` es un cliente distinto, y publicarla significa
una cosa muy concreta: que Alessandro pueda pegar un enlace en un chat y que la
persona al otro lado vea la demo y escriba pidiendo precio. Todo lo que sigue
existe para que ese enlace funcione a la primera delante del cliente.

Antes de empezar conviene saber que esta cuenta tiene varias trampas que no se
ven hasta que el enlace ya está mandado. Están todas documentadas abajo, en
"Las trampas de esta cuenta". Vale la pena leerlas antes de tocar nada.

## Antes de publicar

Tres comprobaciones que ahorran un despliegue fallido o una demo que no cuenta
visitas:

**Que el cliente esté en GitHub.** Vercel construye desde el repo, no desde el
disco. Un cliente que solo existe en local es invisible para Vercel:

```bash
git ls-tree --name-only origin/main apps/clients/ | sed 's|apps/clients/||'
```

Si la carpeta no aparece ahí, hay commits sin subir. Compruébalo con
`git rev-list --left-right --count origin/main...HEAD` y avisa antes de seguir.

**Que compile.** Es mucho más rápido verlo en local que esperar a que Vercel
falle:

```bash
pnpm turbo run build --filter=<nombre-del-paquete>
```

El nombre del paquete sale del `package.json` del cliente, que no siempre
coincide con el de la carpeta (unos son `kingscars`, otros
`@alessandrovaru/taller-bmw`).

Una app que use `@supabase` y tenga las credenciales vacías **falla el build**
al prerenderizar. Compruébalo con
`grep -rl "@supabase" <carpeta> --include=*.js --exclude-dir=node_modules`: si
hay resultados, esa app necesita su proyecto de Supabase antes de publicarse, o
el despliegue se cae.

**Que lleve Web Analytics.** Todas las demos publicadas mandan sus visitas al
panel de Vercel: una visita a `/entrar` dice que el prospecto abrió el enlace,
y una a `/` que pasó la puerta. Una carpeta copiada de otra demo ya lo trae;
compruébalo igual, porque sin esto la demo se publica bien pero a ciegas:

```bash
grep -c "@vercel/analytics/next\|<Analytics />" <carpeta>/app/layout.js   # 2
grep -c '"@vercel/analytics"' <carpeta>/package.json                       # 1
grep -c "_vercel" <carpeta>/middleware.js <carpeta>/libs/acceso.js        # 1 y 1
```

Si falta algo, son cuatro toques: `"@vercel/analytics": "^2.0.1"` en
`dependencies`; `import { Analytics } from "@vercel/analytics/next"` y
`<Analytics />` al final del `<body>` de `app/layout.js`; `_vercel` en el
`matcher` de `middleware.js`; y `pathname.startsWith("/_vercel")` en
`rutaLibre` de `libs/acceso.js`. Los dos últimos están en
`demo-de-venta/references/puerta.md` y no son opcionales: `/_vercel/insights/*`
es por donde el script se carga y manda cada visita, y si la puerta lo atrapa,
la visita a `/entrar` —justo la que interesa— se pierde en un 307. Después,
`pnpm install`, porque el paquete tiene que entrar en `pnpm-lock.yaml` y el
lockfile viaja en el mismo commit.

## El procedimiento

Cinco pasos y una verificación. Cuatro usan las herramientas MCP de Vercel; el
de Web Analytics va por el CLI, porque el MCP no lo tiene.

### 1. Crear el proyecto

```
create_git_project(
  repo: "VEKTOR-STUDIO/monorepo",
  teamId: "team_Q1PHqpVOSXU5FigedJ9Jof9O",
  projectName: "<nombre>",
  rootDirectory: "apps/clients/<carpeta>",
  deploy: false
)
```

`deploy: false` es deliberado: primero se configura el proyecto y se ponen las
variables, y solo entonces se despliega. Al revés, el primer build saldría sin
contraseña y con la protección de Vercel puesta.

El nombre del proyecto es el que verá el cliente en la URL, así que llámalo como
se llama el negocio, no como se llama la carpeta. La carpeta `im2006` se publicó
como `lm2006` porque el cliente es LM 2006.

Tras crear, la herramienta suele avisar de que "el git link no pudo
verificarse" con un 404. Es el problema de scope descrito abajo; el enlace sí
quedó hecho y el despliegue lo confirma.

### 2. Configurar

```
update_project(idOrName: "<nombre>", requestBody: {
  framework: "nextjs",
  rootDirectory: "apps/clients/<carpeta>",
  sourceFilesOutsideRootDirectory: true,
  enableAffectedProjectsDeployments: true,
  ssoProtection: null
})
```

Dos de estos campos son los importantes:

`ssoProtection: null` **apaga la Vercel Authentication**, que este equipo trae
activada por defecto en cada proyecto nuevo. Si se deja puesta, quien abra el
enlace ve una pantalla de login de Vercel en vez de la demo — y un cliente no
tiene cuenta de Vercel ni tiene por qué tenerla. La demo no queda desprotegida
por esto: quien la protege es su propia puerta con contraseña.

`enableAffectedProjectsDeployments: true` hace que el proyecto solo se
reconstruya cuando cambie su carpeta. Sin esto, con quince clientes colgando de
`main`, cada commit dispara quince builds que además van en cola de uno en uno.

### 3. Activar Web Analytics

El `<Analytics />` del layout no cuenta nada hasta que el proyecto de Vercel
tiene Web Analytics activado: sin eso, `/_vercel/insights/script.js` ni
existe. Es un interruptor por proyecto y va por el CLI (el subcomando llegó en
la versión 59; la instalada en este WSL es la 48, de ahí el `npx`):

```bash
npx -y vercel@latest project web-analytics <nombre> --scope alessandro-varuzzas-projects
```

Hace falta sesión en el CLI (`npx -y vercel@latest login`), que es interactiva
y la abre el usuario una sola vez. Si no hay sesión, no te pares aquí: sigue
con el resto y deja el comando listo en la entrega. Se puede activar después,
pero entonces hay que volver a desplegar, porque Vercel monta las rutas
`/_vercel/insights/*` en el siguiente despliegue tras activarlo. Por eso va
antes del paso 5. A mano es Proyecto → Analytics → Enable, en el panel.

### 4. Poner las variables

```
create_project_env(idOrName: "<nombre>", upsert: "true", requestBody: [
  {key: "DEMO_PASSWORD", value: "<clave>", type: "encrypted",
   target: ["production", "preview", "development"]},
  {key: "SITE_URL", value: "https://<nombre>.vercel.app", type: "plain",
   target: ["production", "preview", "development"]}
])
```

`DEMO_PASSWORD` no es opcional. Si falta, `libs/acceso.js` cae a una clave de
reserva que está escrita en el repo, o sea pública: la puerta parecería cerrada
sin estarlo. Genera una corta y dictable por teléfono — el patrón
`<negocio>-<4 hex>` funciona bien (`head -c 2 /dev/urandom | xxd -p`) — y
dísela al usuario en claro, porque es él quien se la pasa al cliente.

`SITE_URL` puede que haya que corregirla después del paso 6, si el alias no
resultó ser el esperado.

### 5. Desplegar

```
create_deployment(skipAutoDetectionConfirmation: "1", requestBody: {
  name: "<nombre>", project: "<nombre>", target: "production",
  gitSource: {type: "github", org: "VEKTOR-STUDIO", repo: "monorepo", ref: "main"},
  projectSettings: {framework: "nextjs",
                    rootDirectory: "apps/clients/<carpeta>",
                    sourceFilesOutsideRootDirectory: true}
})
```

Desplegar a producción es una acción que sale al mundo, así que pídele permiso
al usuario antes de la primera vez si no te lo ha dado ya. Y ojo: pedir un
preview **no** es una forma más suave de hacerlo — cualquier despliegue contra
`main` se marca como producción igual, porque `main` es la rama de producción.

### 6. Verificar (esto no es opcional)

Un despliegue en `READY` no significa que el enlace sirva. Hay que mirar dos
cosas.

**Primero, cuál es el enlace de verdad.** Lee el array `alias` del despliegue
con `get_deployment` y usa el que salga ahí. No compongas la URL a mano: el
nombre corto puede estar cogido por otra cuenta de Vercel y entonces el enlace
que creías tuyo es el de un desconocido (ver abajo).

**Después, que la puerta cierra.** Contra el alias real:

```bash
# la raíz debe redirigir a /entrar
curl -s -o /dev/null -w '%{http_code} -> %{redirect_url}\n' https://<alias>
# la clave correcta abre, una falsa no
curl -s -o /dev/null -w '%{http_code}\n' -X POST https://<alias>/api/entrar \
  -H 'Content-Type: application/json' -d '{"clave":"<clave>"}'
curl -s -o /dev/null -w '%{http_code}\n' -X POST https://<alias>/api/entrar \
  -H 'Content-Type: application/json' -d '{"clave":"xxxx"}'
```

Lo correcto es `307` a `/entrar`, luego `200` y `401`. Cualquier otra cosa hay
que investigarla antes de dar el enlace por bueno:

- **La raíz responde `200` sin redirigir** y `/api/entrar` da `404`: casi seguro
  no estás mirando tu sitio, sino el de otra cuenta que tiene ese nombre.
- **Sale una pantalla de login de Vercel**: quedó `ssoProtection` activada.
- **`404` en todo**: el build aún no ha terminado; el alias corto no se asigna
  hasta que el despliegue está `READY`.

**Y que cuenta las visitas.** Contra el mismo alias:

```bash
curl -s -o /dev/null -w '%{http_code} %{content_type}\n' https://<alias>/_vercel/insights/script.js
```

Lo correcto es `200 application/javascript`. Un `404` es que al proyecto le
falta Web Analytics (paso 3) o que no se ha vuelto a desplegar desde que se
activó; un `307` a `/entrar` es que el middleware de esa demo no excluye
`_vercel`. Las visitas se ven en el panel de Vercel, pestaña Analytics del
proyecto, y también por MCP con `count_pageviews` y `aggregate_pageviews`
(agrupando por `path`: `/entrar` es quien abrió el enlace, `/` quien entró).

## Las trampas de esta cuenta

Cuatro cosas que ya han mordido y que no son evidentes.

**El repo es `VEKTOR-STUDIO/monorepo`, no `alessandrovaru/monorepo`.** El remoto
local apunta al nombre personal, pero el repositorio se transfirió a la
organización y GitHub solo redirige. La GitHub App de Vercel está instalada en
la organización, así que usar el nombre personal falla con *"you need to install
the GitHub integration first"*. Son el mismo repo y el mismo commit; compruébalo
con `git ls-remote` de ambos si hace falta.

**Las lecturas por MCP van sin `teamId`.** `get_project`, `list_projects` y
compañía devuelven 404 o una lista vacía si les pasas el `teamId`, y funcionan
bien sin él. En cambio `create_git_project` sí lo exige. Un 404 al leer un
proyecto recién creado casi nunca significa que no exista.

**El nombre `<algo>.vercel.app` puede estar ocupado por cualquiera del mundo.**
Cuando pasa, Vercel asigna otro con sufijo —`veloce-autos` acabó en
`veloce-autos-nine.vercel.app`— y lo hace en silencio. El `alias` del despliegue
es la única fuente fiable. Cuando ocurra, acuérdate de corregir también
`SITE_URL`, que se habrá quedado apuntando al sitio ajeno.

**Plan Hobby: un solo build a la vez.** Varios despliegues lanzados juntos se
encolan y tardan un rato largo. Lánzalos igualmente todos y luego espera:

```bash
for u in <alias1> <alias2>; do
  until [ "$(curl -s -o /dev/null -w '%{http_code}' -L https://$u)" = "200" ]; do
    sleep 20
  done
  echo "$u listo"
done
```

## Ver qué falta por publicar

Cruza las carpetas con los proyectos que ya existen:

```bash
git ls-tree --name-only origin/main apps/clients/ | sed 's|apps/clients/||'
```

y compáralo con `list_projects` (sin `teamId`). Ten en cuenta que los nombres no
siempre coinciden: `frank-manzano` está como `monorepo-frank-manzano`, `im2006`
como `lm2006`.

Una carpeta sin publicar no siempre está lista para publicarse. Lo que suele
faltar, por orden de frecuencia: fotos de los vehículos o productos, el WhatsApp
del negocio, un proyecto de Supabase propio cuando la app lo usa, y el dominio.
Publicar una demo vacía es una decisión del usuario, no tuya: dile lo que le
falta y deja que él decida.

## Después de publicar

Entrega siempre, junto al enlace, la contraseña en claro y una línea de lo que
quedó pendiente en esa demo. El enlace sin la contraseña no sirve de nada, y el
usuario va a copiar ambos en un chat.

Si Web Analytics quedó sin activar porque no había sesión en el CLI, dilo en
esa misma línea de pendientes, con el comando del paso 3 y el recordatorio de
volver a desplegar después.

Para cambiar una clave más tarde basta con `create_project_env` con
`upsert: "true"` y volver a desplegar.
