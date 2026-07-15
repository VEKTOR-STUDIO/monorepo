# LMS de Entrenamiento — Área de atletas

Área de contenido para el entrenador (videos, rutinas y entrenamientos), construida sobre la base ShipFast + Supabase del proyecto.

> **Fase actual: SIN login.** Todo el contenido publicado es visible sin iniciar sesión, pensado para la demo. El sistema ya está preparado para moverlo detrás de login cuando quieras (ver la sección final).

---

## 1. Qué se agregó

### Rutas (frontend)
| Ruta | Descripción |
|------|-------------|
| `/entrenamientos` | Home del LMS: grid de **programas** + **biblioteca de video**. |
| `/entrenamientos/[slug]` | Detalle de un programa: reproductor + sesiones (**workouts**) con sus **ejercicios**. |

Enlaces actualizados a `/entrenamientos` (antes iban a `/signin`): `Header`, `HeroFrank`, `CTASection`.

### Archivos nuevos
```
app/entrenamientos/page.js               # Home del LMS
app/entrenamientos/[slug]/page.js        # Detalle de programa
components/lms/ProgramCard.js            # Tarjeta de programa
components/lms/ProgramContent.js         # Reproductor + acordeón de sesiones (client)
components/lms/VideoPlayer.js            # Reproductor YouTube/Vimeo/mp4 (client)
components/lms/VideoLibrary.js           # Biblioteca de video (client)
libs/lms.js                              # Capa de datos (lee Supabase, con fallback demo)
libs/lms-utils.js                        # Helpers puros (embed de video, formato, labels)
supabase/migrations/20260715120000_create_lms_training_tables.sql
```

**Importante:** si Supabase no tiene datos aún (o la migración no se ha aplicado), las páginas muestran **contenido demo** automáticamente, así la prueba funciona igual.

---

## 2. Base de datos

La app apunta a su propio proyecto Supabase (`NEXT_PUBLIC_SUPABASE_URL` en `.env.local`).
Ese proyecto **no** es el mismo al que está conectado el MCP de este entorno, por eso la migración se entrega como archivo SQL para que la apliques tú.

### Modelo de datos
```
programs   1─┐
             └─< workouts 1─┐
                            └─< exercises
videos     (biblioteca de video independiente)
```

| Tabla | Para qué |
|-------|----------|
| `programs` | Programas / planes (ej. "Funcional Base · 8 semanas"). |
| `workouts` | Sesiones/rutinas dentro de un programa (semana/día, foco, duración). |
| `exercises` | Ejercicios de una sesión (series, reps, descanso, video demo). |
| `videos` | Biblioteca de video suelta (clases de técnica, movilidad, teoría). |

### Cómo aplicar la migración

**Opción A — Supabase CLI (recomendado):**
```bash
cd apps/clients/frank-manzano
supabase link --project-ref <TU_PROJECT_REF>   # el ref de kmtfmivwhgtfvdljtjfy...
supabase db push
```

**Opción B — SQL Editor del dashboard:**
Copia el contenido de `supabase/migrations/20260715120000_create_lms_training_tables.sql` y ejecútalo en el SQL Editor del proyecto.

La migración:
- Crea las 4 tablas, índices y triggers `updated_at`.
- Crea la función `public.is_admin()`.
- Activa RLS y las políticas (lectura pública de lo publicado; escritura solo admin).
- Inserta contenido **seed** de ejemplo (idempotente).

---

## 3. Permisos (RLS)

- **Lectura:** cualquier visitante (anon) puede ver el contenido con `is_published = true`. Esto es lo que permite mostrar el LMS sin login en la demo.
- **Escritura (crear/editar/borrar):** solo usuarios con `profiles.role = 'admin'`.

Para volver admin a un usuario:
```sql
update public.profiles set role = 'admin' where email = 'entrenador@ejemplo.com';
```

---

## 4. Cargar contenido real

Inserta desde el SQL Editor o construye un panel admin más adelante. Ejemplo:

```sql
-- Programa
insert into public.programs (slug, title, subtitle, description, level, category, duration_weeks, sessions_count, sort_order)
values ('fuerza-avanzada', 'Fuerza Avanzada', 'Bloque de fuerza máxima', '...', 'avanzado', 'fuerza', 12, 36, 4);

-- Sesión del programa
insert into public.workouts (program_id, title, focus, duration_minutes, sort_order)
select id, 'Semana 1 · Día 1', 'sentadilla', 60, 1 from public.programs where slug = 'fuerza-avanzada';

-- Ejercicio con video
insert into public.exercises (workout_id, name, sets, reps, rest_seconds, video_url, sort_order)
select w.id, 'Sentadilla trasera', 5, '5', 180, 'https://www.youtube.com/watch?v=XXXXXXXXXXX', 1
from public.workouts w join public.programs p on p.id = w.program_id
where p.slug = 'fuerza-avanzada' and w.title = 'Semana 1 · Día 1';

-- Video de biblioteca
insert into public.videos (title, description, category, level, video_url, duration_seconds, sort_order)
values ('Movilidad de cadera', '...', 'movilidad', 'todos', 'https://vimeo.com/123456789', 420, 10);
```

`video_url` acepta YouTube, Vimeo o un archivo directo (`.mp4/.webm/...`); el reproductor detecta el tipo automáticamente.

---

## 5. Poner el LMS detrás de login (más adelante)

Cuando quieras exigir sesión para ver el contenido:

1. **Middleware** (`libs/supabase/middleware.js`): agrega la ruta a `protectedRoutes`:
   ```js
   const protectedRoutes = ['/dashboard', '/entrenamientos'];
   ```
2. **RLS**: cambia las políticas de lectura de `anon, authenticated` a solo `authenticated` (hay un bloque de ejemplo comentado al final del archivo de migración).

Con esos dos cambios, el contenido queda protegido tanto a nivel de red (middleware) como de base de datos (RLS).
