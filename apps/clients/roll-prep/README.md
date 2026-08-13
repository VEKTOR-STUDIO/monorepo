# RollPrep 🥋

> 📖 **¿Qué es RollPrep como producto?** El concepto completo —la tesis, la progresión, los
> modos de juego y hacia dónde va— está en [`CONCEPTO.md`](./CONCEPTO.md). Este README es
> solo el setup técnico.

App de gestión de alumnos para una clase de **Jiu-Jitsu Brasileño**, construida sobre la base **ShipFast** (Next.js App Router + Supabase + Tailwind CSS v4 / DaisyUI 5) dentro del monorepo (pnpm workspaces).

Los alumnos entrenan presencial los **martes y jueves**. RollPrep mantiene la conexión fuera del tatami con dos dinámicas que alternan según el día de la semana:

- **Modo Tarea (martes → jueves):** el profesor asigna un video (YouTube/Instagram) y el alumno lo marca con el botón **"Visto y Estudiado"**.
- **Modo Votación (jueves → martes):** encuesta con 3 tarjetas de contenido para elegir el tema de la próxima clase.
- **Videoteca:** archivo histórico de todas las tareas pasadas.

## Estructura

```
app/
  page.js                     # Landing
  signin/                     # Login (Google OAuth + Magic Link, captura full_name)
  dashboard/
    layout.js                 # Guard de sesión + BottomNav mobile-first
    page.js                   # Dashboard del Alumno (lógica condicional tarea/votación)
    actions.js                # Server Actions (marcar tarea, votar, crear tarea/encuesta)
    videoteca/page.js         # Archivo histórico
    admin/
      layout.js               # Guard de rol admin
      page.js                 # Panel del Profesor (formularios + métricas en vivo)
components/rollprep/          # VideoEmbed, CompleteAssignmentButton, PollVoteCards,
                              # AdminAssignmentForm, AdminPollForm, AdminLiveRefresh, BottomNav
libs/rollprep.js              # Lógica de calendario (mar/jue) + parsing de embeds
supabase/schema.sql           # Tablas, RLS, triggers y realtime
```

## Setup

1. Instala dependencias desde la raíz del monorepo:

   ```bash
   pnpm install
   ```

2. Crea un proyecto en [Supabase](https://supabase.com) y ejecuta `supabase/schema.sql` en el SQL Editor.

3. Copia `.env.example` a `.env.local` y completa:

   ```
   NEXT_PUBLIC_SUPABASE_URL=
   NEXT_PUBLIC_SUPABASE_ANON_KEY=
   SUPABASE_SERVICE_ROLE_KEY=
   RESEND_API_KEY=            # magic links / emails
   ```

4. Arranca el dev server:

   ```bash
   pnpm --filter @alessandrovaru/vanilla-template-supabase dev
   ```

5. Regístrate con el correo del profesor (`sniperaless117@gmail.com`) — se promueve a **admin automáticamente** (trigger `handle_new_user`). Cualquier otro correo entra como alumno; para promoverlo manualmente desde el SQL Editor:

   ```sql
   update public.profiles p
   set role = 'admin'
   from auth.users u
   where u.id = p.id and lower(u.email) = 'correo@delprofesor.com';
   ```

## Roles

- **Profesor (admin):** crea la tarea en curso y la votación (cada nueva desactiva la anterior), y ve las métricas en `/dashboard/admin` — lista de alumnos que marcaron "Visto y Estudiado" y conteo de votos en tiempo real (Supabase Realtime).
- **Alumno (student):** ve la tarea o la encuesta activa según el día, marca la tarea, vota (puede cambiar su voto mientras la encuesta esté activa) y consulta la videoteca.

La seguridad se aplica con **RLS** en todas las tablas (`profiles`, `assignments`, `assignment_completions`, `polls`, `poll_options`, `poll_votes`); las Server Actions validan el rol además de la RLS.

## Zona horaria

El modo del dashboard (tarea vs. votación) se calcula con la zona horaria configurada en `config.js` → `timezone` (por defecto `America/Caracas`).

## Invitaciones CAOS

Convocatoria de los torneos CAOS: un solo texto que sale en tres sitios.

```
app/dashboard/admin/invitaciones/      # Panel: crear, preview del flyer, envío
app/api/invitaciones/[slug]/imagen/    # El flyer en PNG (story 9:16 y post 4:5)
app/caos/                              # Cartelera pública + página de cada evento
libs/invites.js                        # Fechas, slugs, formatos y URLs
libs/invite-email.js                   # El correo (HTML + texto)
```

1. **Migración:** correr `supabase/migrations/20260813120000_caos_invites.sql` en el SQL
   Editor. Sin ella el panel avisa cuál falta en vez de romperse.
2. **El flyer** se dibuja con `next/og` (satori) usando las fuentes de `public/fonts`
   (Anton y Barlow en `.ttf`, que satori necesita como archivo) y el logo
   `public/images/caosPrimary.png`. Se descarga desde el panel y desde la página
   pública; es la misma imagen que viaja en el correo y en el preview de los links.
3. **El correo** necesita `RESEND_API_KEY` y el dominio de `config.resend.fromAdmin`
   verificado en Resend (DKIM/SPF en el DNS). Mientras la llave no exista, el botón de
   enviar sale apagado con el aviso; todo lo demás —flyer, página pública, links—
   funciona igual. Al configurarla no hay que tocar código.

El link público (`/caos/<slug>`) se genera al crear y no cambia al editar: lo que ya se
repartió por story o WhatsApp sigue abriendo.
