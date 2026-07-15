-- =============================================================================
-- LMS de entrenamiento funcional — Frank Manzano
-- Crea las tablas de contenido del área de entrenamiento (programas, sesiones,
-- ejercicios y biblioteca de video) con Row Level Security.
--
-- Modelo de datos:
--   programs   1─┐
--                └─< workouts 1─┐
--                               └─< exercises
--   videos     (biblioteca de video independiente / clases sueltas)
--
-- Política de acceso (fase demo, SIN login):
--   - El contenido publicado (is_published = true) es legible por cualquiera
--     (anon + authenticated). Esto permite mostrar el LMS sin login para la prueba.
--   - La escritura queda restringida a administradores (profiles.role = 'admin').
--   Cuando quieras poner el LMS detrás de login, basta con endurecer las políticas
--   de SELECT (cambiar `anon` por `authenticated`) — ver el bloque al final.
-- =============================================================================

-- Requerido para gen_random_uuid()
create extension if not exists "pgcrypto";

-- -----------------------------------------------------------------------------
-- Helper: ¿el usuario actual es admin?  (evita repetir el subquery en cada policy)
-- -----------------------------------------------------------------------------
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where profiles.id = auth.uid()
      and profiles.role = 'admin'
  );
$$;

-- -----------------------------------------------------------------------------
-- Trigger genérico para updated_at
-- -----------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- =============================================================================
-- 1. programs  (Programas / planes de entrenamiento)
-- =============================================================================
create table if not exists public.programs (
  id              uuid primary key default gen_random_uuid(),
  slug            text not null unique,
  title           text not null,
  subtitle        text,
  description     text,
  level           text not null default 'todos'
                    check (level in ('principiante', 'intermedio', 'avanzado', 'todos')),
  category        text,                       -- ej: fuerza, hipertrofia, movilidad, hiit
  cover_image_url text,
  duration_weeks  integer,                     -- duración estimada del plan
  sessions_count  integer,                     -- nº de sesiones (informativo)
  sort_order      integer not null default 0,
  is_published    boolean not null default true,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists idx_programs_published on public.programs (is_published);
create index if not exists idx_programs_sort on public.programs (sort_order);

drop trigger if exists trg_programs_updated_at on public.programs;
create trigger trg_programs_updated_at
  before update on public.programs
  for each row execute function public.set_updated_at();

-- =============================================================================
-- 2. workouts  (Sesiones / rutinas dentro de un programa)
-- =============================================================================
create table if not exists public.workouts (
  id               uuid primary key default gen_random_uuid(),
  program_id       uuid not null references public.programs(id) on delete cascade,
  title            text not null,
  description      text,
  week_number      integer,                    -- semana dentro del plan (opcional)
  day_number       integer,                    -- día dentro de la semana (opcional)
  focus            text,                        -- ej: "tren inferior", "full body"
  duration_minutes integer,
  sort_order       integer not null default 0,
  is_published     boolean not null default true,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create index if not exists idx_workouts_program on public.workouts (program_id);
create index if not exists idx_workouts_sort on public.workouts (program_id, sort_order);

drop trigger if exists trg_workouts_updated_at on public.workouts;
create trigger trg_workouts_updated_at
  before update on public.workouts
  for each row execute function public.set_updated_at();

-- =============================================================================
-- 3. exercises  (Ejercicios dentro de una sesión)
-- =============================================================================
create table if not exists public.exercises (
  id            uuid primary key default gen_random_uuid(),
  workout_id    uuid not null references public.workouts(id) on delete cascade,
  name          text not null,
  description   text,                           -- técnica / cues
  sets          integer,
  reps          text,                           -- texto libre: "10-12", "AMRAP", "30 s"
  rest_seconds  integer,
  tempo         text,                           -- ej: "3-1-1"
  video_url     text,                           -- demo del ejercicio (YouTube/Vimeo/mp4)
  sort_order    integer not null default 0,
  created_at    timestamptz not null default now()
);

create index if not exists idx_exercises_workout on public.exercises (workout_id);
create index if not exists idx_exercises_sort on public.exercises (workout_id, sort_order);

-- =============================================================================
-- 4. videos  (Biblioteca de video / clases independientes)
-- =============================================================================
create table if not exists public.videos (
  id               uuid primary key default gen_random_uuid(),
  title            text not null,
  description      text,
  category         text,                        -- ej: técnica, movilidad, teoría
  level            text default 'todos'
                     check (level in ('principiante', 'intermedio', 'avanzado', 'todos')),
  video_url        text not null,               -- YouTube/Vimeo/mp4
  thumbnail_url    text,
  duration_seconds integer,
  is_free_preview  boolean not null default false,
  sort_order       integer not null default 0,
  is_published     boolean not null default true,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create index if not exists idx_videos_published on public.videos (is_published);
create index if not exists idx_videos_sort on public.videos (sort_order);

drop trigger if exists trg_videos_updated_at on public.videos;
create trigger trg_videos_updated_at
  before update on public.videos
  for each row execute function public.set_updated_at();

-- =============================================================================
-- 5. Row Level Security
-- =============================================================================
alter table public.programs  enable row level security;
alter table public.workouts  enable row level security;
alter table public.exercises enable row level security;
alter table public.videos    enable row level security;

-- ---- programs -------------------------------------------------------------
drop policy if exists "programs_public_read" on public.programs;
create policy "programs_public_read"
  on public.programs for select
  to anon, authenticated
  using (is_published or public.is_admin());

drop policy if exists "programs_admin_write" on public.programs;
create policy "programs_admin_write"
  on public.programs for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ---- workouts -------------------------------------------------------------
drop policy if exists "workouts_public_read" on public.workouts;
create policy "workouts_public_read"
  on public.workouts for select
  to anon, authenticated
  using (
    public.is_admin()
    or (
      is_published
      and exists (
        select 1 from public.programs p
        where p.id = workouts.program_id and p.is_published
      )
    )
  );

drop policy if exists "workouts_admin_write" on public.workouts;
create policy "workouts_admin_write"
  on public.workouts for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ---- exercises ------------------------------------------------------------
drop policy if exists "exercises_public_read" on public.exercises;
create policy "exercises_public_read"
  on public.exercises for select
  to anon, authenticated
  using (
    public.is_admin()
    or exists (
      select 1
      from public.workouts w
      join public.programs p on p.id = w.program_id
      where w.id = exercises.workout_id
        and w.is_published
        and p.is_published
    )
  );

drop policy if exists "exercises_admin_write" on public.exercises;
create policy "exercises_admin_write"
  on public.exercises for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ---- videos ---------------------------------------------------------------
drop policy if exists "videos_public_read" on public.videos;
create policy "videos_public_read"
  on public.videos for select
  to anon, authenticated
  using (is_published or public.is_admin());

drop policy if exists "videos_admin_write" on public.videos;
create policy "videos_admin_write"
  on public.videos for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- =============================================================================
-- 6. Seed de ejemplo (contenido demo de entrenamiento funcional)
--    Idempotente: usa slugs/títulos estables y ON CONFLICT donde aplica.
-- =============================================================================
insert into public.programs (slug, title, subtitle, description, level, category, duration_weeks, sessions_count, sort_order)
values
  ('funcional-base-8-semanas',
   'Funcional Base · 8 semanas',
   'Construye una base sólida de fuerza y movimiento',
   'Programa de entrada al entrenamiento funcional. Patrones básicos (sentadilla, bisagra, empuje, tracción, core) con progresión semanal y video en cada sesión.',
   'principiante', 'fuerza', 8, 24, 1),
  ('acondicionamiento-hiit',
   'Acondicionamiento & HIIT',
   'Capacidad aeróbica y potencia metabólica',
   'Circuitos de alta intensidad e intervalos para mejorar tu condición física, quemar grasa y ganar resistencia.',
   'intermedio', 'hiit', 6, 18, 2),
  ('movilidad-y-prevencion',
   'Movilidad & Prevención',
   'Muévete mejor, entrena sin dolor',
   'Rutinas de movilidad articular, activación y trabajo correctivo para sostener cargas altas y prevenir lesiones.',
   'todos', 'movilidad', 4, 12, 3)
on conflict (slug) do nothing;

-- Sesiones del programa "Funcional Base"
insert into public.workouts (program_id, title, description, week_number, day_number, focus, duration_minutes, sort_order)
select p.id, v.title, v.description, v.week_number, v.day_number, v.focus, v.duration_minutes, v.sort_order
from public.programs p
cross join (values
  ('Semana 1 · Día 1 — Full Body', 'Introducción a los patrones básicos con carga ligera.', 1, 1, 'full body', 45, 1),
  ('Semana 1 · Día 2 — Tren inferior', 'Sentadilla y bisagra de cadera, foco en técnica.', 1, 2, 'tren inferior', 50, 2),
  ('Semana 1 · Día 3 — Tren superior + core', 'Empuje, tracción y estabilidad de core.', 1, 3, 'tren superior', 50, 3)
) as v(title, description, week_number, day_number, focus, duration_minutes, sort_order)
where p.slug = 'funcional-base-8-semanas'
  and not exists (
    select 1 from public.workouts w where w.program_id = p.id and w.title = v.title
  );

-- Ejercicios de la primera sesión
insert into public.exercises (workout_id, name, description, sets, reps, rest_seconds, video_url, sort_order)
select w.id, e.name, e.description, e.sets, e.reps, e.rest_seconds, e.video_url, e.sort_order
from public.workouts w
join public.programs p on p.id = w.program_id
cross join (values
  ('Sentadilla goblet', 'Pecho arriba, rodillas siguen la punta del pie, baja controlado.', 3, '10-12', 90, 'https://www.youtube.com/watch?v=MeIiIdhvXT4', 1),
  ('Flexiones', 'Cuerpo en línea, codos a ~45°.', 3, '8-12', 90, 'https://www.youtube.com/watch?v=IODxDxX7oi4', 2),
  ('Remo con banda', 'Escápulas atrás y abajo, sin balanceo.', 3, '12-15', 60, 'https://www.youtube.com/watch?v=xQNrFHEMhI4', 3),
  ('Plancha', 'Glúteos y abdomen activos, cadera neutra.', 3, '30-45 s', 60, 'https://www.youtube.com/watch?v=ASdvN_XEl_c', 4)
) as e(name, description, sets, reps, rest_seconds, video_url, sort_order)
where p.slug = 'funcional-base-8-semanas'
  and w.title = 'Semana 1 · Día 1 — Full Body'
  and not exists (
    select 1 from public.exercises ex where ex.workout_id = w.id and ex.name = e.name
  );

-- Biblioteca de video (clases sueltas)
insert into public.videos (title, description, category, level, video_url, duration_seconds, is_free_preview, sort_order)
values
  ('Cómo respirar durante el esfuerzo', 'Bracing y respiración para levantar con seguridad.', 'técnica', 'todos', 'https://www.youtube.com/watch?v=2pLT-olgUJs', 480, true, 1),
  ('Calentamiento articular de 8 min', 'Rutina de movilidad para empezar cualquier sesión.', 'movilidad', 'todos', 'https://www.youtube.com/watch?v=3sTf3JCTGKw', 510, true, 2),
  ('Técnica de sentadilla', 'Errores comunes y cómo corregirlos.', 'técnica', 'principiante', 'https://www.youtube.com/watch?v=MeIiIdhvXT4', 600, false, 3)
on conflict do nothing;

-- =============================================================================
-- 7. (OPCIONAL) Poner el LMS detrás de login más adelante
-- -----------------------------------------------------------------------------
-- Cuando quieras exigir sesión para ver el contenido, reemplaza las policies de
-- lectura para que solo apliquen a `authenticated`. Ejemplo para programs:
--
--   drop policy if exists "programs_public_read" on public.programs;
--   create policy "programs_auth_read"
--     on public.programs for select
--     to authenticated
--     using (is_published or public.is_admin());
--
-- (Repite el mismo patrón para workouts, exercises y videos.)
-- =============================================================================
