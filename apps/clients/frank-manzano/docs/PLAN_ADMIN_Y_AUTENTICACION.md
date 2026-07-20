# Plan — Admin, autenticación y gestión de contenido (Frank Manzano)

Documento de planificación. Define cómo tendrá el sistema un **panel de administración**
para gestionar el contenido y cómo los **usuarios** inician sesión para verlo.
El modelo se basa en el patrón ya probado en `roll-prep` (mismo monorepo).

---

## 1. Objetivo

- **Admin** (Frank / staff): entra con su cuenta y administra el contenido
  (programas, sesiones, ejercicios, videos y disciplinas) desde un panel privado.
- **Usuarios / atletas**: se registran, inician sesión y consumen el contenido
  publicado (área de entrenamientos, videoteca, su progreso).
- **Público (sin login)**: ve la landing y, en fase demo, el contenido publicado.
  Cuando se decida cerrar el acceso, basta con endurecer las policies de lectura.

---

## 2. Roles

Un solo eje de permisos en `public.profiles.role`:

| Rol     | Puede |
|---------|-------|
| `admin` | Todo: crear/editar/borrar contenido + ver todos los perfiles |
| `user`  | Ver contenido publicado + gestionar su propio perfil/progreso |

- El rol vive en la base de datos (nunca en `user_metadata`, que es editable por
  el propio usuario — ver checklist de seguridad de Supabase).
- `is_admin()` (SECURITY DEFINER) centraliza la comprobación en las policies RLS.
- El trigger `protect_profile_role` impide que un `user` se auto-promueva.
- El trigger `handle_new_user` crea el perfil al registrarse y promueve el correo
  del admin automáticamente.

> Todo esto ya queda creado por la migración
> `supabase/migrations/20260715110000_create_base_auth_and_disciplines.sql`.

---

## 3. Autenticación (ya cableada en el proyecto)

Ya existe la infraestructura de Supabase Auth:

- `libs/supabase/client.js`, `server.js`, `middleware.js`
- `app/api/auth/callback/route.js` (intercambio de código OAuth)
- `middleware.js` (refresca sesión)
- `app/signin/page.js` (login con Google — habilitar OAuth en Supabase)

**Pendiente para activarlo de verdad:**

1. En Supabase → Authentication → Providers: activar **Google** (client id/secret)
   y añadir la Redirect URL `https://<tu-dominio>/api/auth/callback`.
2. Variables en `.env.local`: `NEXT_PUBLIC_SUPABASE_URL`,
   `NEXT_PUBLIC_SUPABASE_ANON_KEY` (o publishable key).
3. Cambiar el correo del admin en la migración (`ADMIN EMAIL`) antes de aplicarla.

---

## 4. Modelo de contenido (lo que administra el admin)

Ya está definido en `20260715120000_create_lms_training_tables.sql`:

```
programs ─< workouts ─< exercises        videos (biblioteca suelta)
disciplines (líneas de entrenamiento, landing)
```

- **RLS de escritura** ya restringida a `is_admin()` en todas estas tablas.
- **RLS de lectura**: hoy pública (`anon`) para permitir la demo sin login.
  Para cerrarla: cambiar `to anon, authenticated` → `to authenticated`
  (bloque 7 comentado de esa misma migración).

No hace falta crear tablas nuevas para el admin: administra las que ya existen.

---

## 5. Gating de rutas (middleware)

Ampliar `middleware.js` para proteger:

- `/dashboard/**` → requiere sesión (cualquier `user`).
- `/dashboard/admin/**` → requiere sesión **y** `role = 'admin'`.

Patrón (como en roll-prep): en el layout del panel admin
(`app/dashboard/admin/layout.js`) leer el perfil en el servidor y hacer
`redirect('/dashboard')` si `profile.role !== 'admin'`. El middleware protege
rápido; el layout es la barrera real de autorización.

---

## 6. UI del panel admin (a construir — NO en este turno de estilo)

Estructura propuesta, reutilizando el mismo lenguaje visual Nike ya aplicado
(display Anton, negro + rojo, bordes rectos):

```
/dashboard                 -> vista del atleta (contenido publicado + progreso)
/dashboard/admin           -> resumen (nº alumnos, contenido, últimas altas)
/dashboard/admin/programas -> CRUD de programs + workouts + exercises
/dashboard/admin/videos    -> CRUD de la videoteca
/dashboard/admin/disciplinas -> CRUD de disciplines
/dashboard/admin/usuarios  -> lista de perfiles, promover/quitar admin
```

- Formularios con **Server Actions** (como `app/dashboard/actions.js` de roll-prep).
- Componentes en `components/admin/` (form + tablas), estilo póster.
- Toggle `is_published` para controlar qué ve el público/usuario.

---

## 7. Roadmap sugerido

1. **[Hecho]** Estilo Nike de toda la web (este turno).
2. Aplicar la migración base (profiles + roles + disciplines) y activar OAuth.
3. Middleware + guard de `/dashboard/admin`.
4. CRUD admin de `disciplines` (el más simple) como primer vertical.
5. CRUD admin de `videos`, luego `programs/workouts/exercises`.
6. Vista de usuario: progreso / "visto" por sesión (tabla de completions,
   igual que `assignment_completions` en roll-prep).
7. Cerrar lectura pública (pasar policies a `authenticated`) cuando toque.
```
