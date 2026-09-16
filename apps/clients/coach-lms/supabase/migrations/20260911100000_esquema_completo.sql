-- =============================================================================
-- CAMARGO COACH — ESQUEMA COMPLETO
-- High Performance System for Combat Sports · "La ciencia detrás del rendimiento"
--
-- Este ÚNICO archivo crea toda la base de datos de la web, desde cero:
--
--   CUENTAS            profiles (con rol y ficha de peleador), alta automática al registrarse
--   LANDING            disciplines, leads, elite_leads, manifesto_posts
--   CITAS              services, appointments
--   CONTENIDO          programs, workouts, exercises, videos
--   LIBRO              exercise_library  (302 ejercicios con animación,
--                      se cargan aparte con seeds/exercise_library_seed.sql)
--   ENTRENAMIENTO      program_assignments, workout_logs, exercise_logs
--   GAMIFICACIÓN       athlete_stats, achievements, athlete_achievements,
--                      get_leaderboard(), get_my_rank()
--   CLASES             classes, class_bookings (con control de cupo)
--
-- CÓMO APLICARLO
--   Supabase → SQL Editor → New query → pega este archivo → Run.
--   Después ejecuta seeds/exercise_library_seed.sql para el libro.
--
-- ES IDEMPOTENTE: puedes volver a ejecutarlo sin romper nada ni perder datos.
--
-- ¡IMPORTANTE! Cambia el correo del admin en el punto 2 por el del coach.
-- Este esquema es para el proyecto de Supabase PROPIO de Camargo Coach: no lo
-- ejecutes en el de otro cliente.
-- =============================================================================

create extension if not exists "pgcrypto";

-- =============================================================================
-- 1. FUNCIONES BASE
-- =============================================================================

-- updated_at automático.
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
-- 2. profiles — extiende auth.users y guarda el rol
-- =============================================================================
create table if not exists public.profiles (
  id              uuid primary key references auth.users (id) on delete cascade,
  email           text,
  full_name       text,
  image           text,
  role            text not null default 'user' check (role in ('admin', 'user')),

  -- Datos del alumno
  phone           text,
  birth_date      date,
  goal            text,                    -- qué busca conseguir
  level           text check (level is null or level in ('principiante', 'intermedio', 'avanzado')),
  coach_notes     text,                    -- notas privadas del entrenador
  is_active       boolean not null default true,
  show_in_ranking boolean not null default true,

  -- Stripe (por compatibilidad con el boilerplate; hoy no se usa)
  has_access      boolean not null default false,
  customer_id     text,
  price_id        text,

  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- Ficha de peleador: lo que el coach necesita ANTES de armar un plan
-- (récord, peso actual contra categoría, altura, estilo y estrategia).
-- Van con "add column" para que la migración siga siendo idempotente.
alter table public.profiles
  add column if not exists weight_kg      numeric(5, 1),   -- peso actual, en kg
  add column if not exists height_cm      integer,         -- altura, en cm
  add column if not exists weight_class   text,            -- categoría: "155 lb (70,3 kg)"
  add column if not exists discipline     text,            -- striker, grappler, MMA…
  add column if not exists fight_record   text,            -- "5-0 Pro"
  add column if not exists fight_strategy text;            -- la escribe el coach: "presión, control del centro…"

-- ¿El usuario actual es el entrenador?
-- SECURITY DEFINER para que no se muerda la cola con las RLS de profiles.
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

-- Al registrarse alguien, se le crea su perfil.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, image, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name', new.email),
    new.raw_user_meta_data ->> 'avatar_url',
    case
      -- >>> CAMBIA ESTE CORREO POR EL DEL COACH <<<
      when lower(new.email) = 'admin@camargocoach.com' then 'admin'
      else 'user'
    end
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Nadie se asciende a sí mismo a entrenador.
-- auth.uid() nulo = SQL Editor o service role: ahí sí se permite.
create or replace function public.protect_profile_role()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.role is distinct from old.role
     and auth.uid() is not null
     and not public.is_admin() then
    raise exception 'Solo un administrador puede cambiar roles';
  end if;
  return new;
end;
$$;

drop trigger if exists on_profile_role_change on public.profiles;
create trigger on_profile_role_change
  before update on public.profiles
  for each row execute function public.protect_profile_role();

-- El alumno edita sus datos, pero no lo que decide el entrenador.
create or replace function public.protect_coach_fields()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is not null and not public.is_admin() then
    new.coach_notes := old.coach_notes;
    new.level       := old.level;
    new.is_active   := old.is_active;
    new.has_access  := old.has_access;
    new.fight_strategy := old.fight_strategy;
  end if;
  return new;
end;
$$;

drop trigger if exists on_profile_coach_fields on public.profiles;
create trigger on_profile_coach_fields
  before update on public.profiles
  for each row execute function public.protect_coach_fields();

drop trigger if exists trg_profiles_updated_at on public.profiles;
create trigger trg_profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;

drop policy if exists "profiles_select_own_or_admin" on public.profiles;
create policy "profiles_select_own_or_admin" on public.profiles
  for select to authenticated
  using (id = auth.uid() or public.is_admin());

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own" on public.profiles
  for insert to authenticated
  with check (id = auth.uid());

drop policy if exists "profiles_update_own_or_admin" on public.profiles;
create policy "profiles_update_own_or_admin" on public.profiles
  for update to authenticated
  using (id = auth.uid() or public.is_admin())
  with check (id = auth.uid() or public.is_admin());

-- =============================================================================
-- 3. LANDING — disciplines, leads, elite_leads, manifesto_posts
-- =============================================================================

-- Los siete bloques de una sesión del sistema; se muestran en la portada (app/page.js).
create table if not exists public.disciplines (
  id             uuid primary key default gen_random_uuid(),
  name           text not null,
  description    text,
  required_level text default 'todos'
                   check (required_level in ('principiante', 'intermedio', 'avanzado', 'todos')),
  sort_order     integer not null default 0,
  is_published   boolean not null default true,
  created_at     timestamptz not null default now()
);

create index if not exists idx_disciplines_published on public.disciplines (is_published);

alter table public.disciplines enable row level security;

drop policy if exists "disciplines_public_read" on public.disciplines;
create policy "disciplines_public_read" on public.disciplines
  for select to anon, authenticated
  using (is_published or public.is_admin());

drop policy if exists "disciplines_admin_write" on public.disciplines;
create policy "disciplines_admin_write" on public.disciplines
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

insert into public.disciplines (name, description, required_level, sort_order)
select v.name, v.description, v.required_level, v.sort_order
from (values
  ('Warm up', 'Assault bike o cuerda, serie dinámica de cadera, columna torácica y hombros, activación de glúteo y escápula.', 'todos', 1),
  ('Plyometrics', 'Depth jumps, saltos laterales y reactivos: el primer paso explosivo y los cambios de ángulo.', 'todos', 2),
  ('Contrast set', 'Fuerza pesada seguida de un gesto explosivo: box squat con medball slam, peso muerto con lanzamientos y golpeo.', 'todos', 3),
  ('Push + Pull', 'Push press y dominadas balísticas en clusters: potencia de empuje y tracción sin acumular fatiga.', 'todos', 4),
  ('Midsection', 'Rotaciones con landmine y banda terminadas en golpe: transferencia directa a la potencia de puño.', 'todos', 5),
  ('Conditioning', 'Sprints en assault bike y rounds híbridos que simulan intercambios, flurries y derribos.', 'todos', 6),
  ('Breathing', 'Respiración diafragmática 4·6·4·6 para bajar pulsaciones y recuperar entre rounds.', 'todos', 7)
) as v(name, description, required_level, sort_order)
where not exists (select 1 from public.disciplines d where d.name = v.name);

-- Captura simple de correo desde la portada (app/api/lead).
create table if not exists public.leads (
  id         uuid primary key default gen_random_uuid(),
  email      text not null,
  source     text,
  created_at timestamptz not null default now()
);

create unique index if not exists idx_leads_email on public.leads (lower(email));

alter table public.leads enable row level security;

drop policy if exists "leads_public_insert" on public.leads;
create policy "leads_public_insert" on public.leads
  for insert to anon, authenticated with check (true);

drop policy if exists "leads_admin_read" on public.leads;
create policy "leads_admin_read" on public.leads
  for select to authenticated using (public.is_admin());

drop policy if exists "leads_admin_delete" on public.leads;
create policy "leads_admin_delete" on public.leads
  for delete to authenticated using (public.is_admin());

-- Formulario de aplicación al programa "elite" (app/api/elite-lead).
create table if not exists public.elite_leads (
  id                    uuid primary key default gen_random_uuid(),
  name                  text not null,
  phone                 text not null,
  current_fitness_level text,
  goals                 text,
  status                text not null default 'nuevo'
                          check (status in ('nuevo', 'contactado', 'convertido', 'descartado')),
  created_at            timestamptz not null default now()
);

create index if not exists idx_elite_leads_created on public.elite_leads (created_at desc);

alter table public.elite_leads enable row level security;

drop policy if exists "elite_leads_public_insert" on public.elite_leads;
create policy "elite_leads_public_insert" on public.elite_leads
  for insert to anon, authenticated with check (true);

drop policy if exists "elite_leads_admin_manage" on public.elite_leads;
create policy "elite_leads_admin_manage" on public.elite_leads
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Notas / filosofía que publica el entrenador (app/api/manifesto).
create table if not exists public.manifesto_posts (
  id           uuid primary key default gen_random_uuid(),
  title        text not null,
  content      text not null,
  author_id    uuid references auth.users (id) on delete set null,
  is_published boolean not null default true,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists idx_manifesto_created on public.manifesto_posts (created_at desc);

drop trigger if exists trg_manifesto_updated_at on public.manifesto_posts;
create trigger trg_manifesto_updated_at
  before update on public.manifesto_posts
  for each row execute function public.set_updated_at();

alter table public.manifesto_posts enable row level security;

drop policy if exists "manifesto_public_read" on public.manifesto_posts;
create policy "manifesto_public_read" on public.manifesto_posts
  for select to anon, authenticated
  using (is_published or public.is_admin());

drop policy if exists "manifesto_admin_write" on public.manifesto_posts;
create policy "manifesto_admin_write" on public.manifesto_posts
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- =============================================================================
-- 4. CITAS — services, appointments
-- =============================================================================
create table if not exists public.services (
  id               uuid primary key default gen_random_uuid(),
  name             text not null,
  description      text,
  price            numeric(10, 2),
  duration_minutes integer not null default 60,
  image_url        text,
  sort_order       integer not null default 0,
  is_published     boolean not null default true,
  created_at       timestamptz not null default now()
);

alter table public.services enable row level security;

drop policy if exists "services_public_read" on public.services;
create policy "services_public_read" on public.services
  for select to anon, authenticated
  using (is_published or public.is_admin());

drop policy if exists "services_admin_write" on public.services;
create policy "services_admin_write" on public.services
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

insert into public.services (name, description, price, duration_minutes, sort_order)
select v.name, v.description, v.price, v.duration_minutes, v.sort_order
from (values
  ('Evaluación inicial', 'Valoración física, anamnesis y diseño del punto de partida.', 40.00, 60, 1),
  ('Sesión personalizada', 'Entrenamiento uno a uno con corrección técnica.', 30.00, 60, 2),
  ('Seguimiento mensual', 'Planificación, ajustes de carga y revisión de progreso.', 80.00, 45, 3)
) as v(name, description, price, duration_minutes, sort_order)
where not exists (select 1 from public.services s where s.name = v.name);

create table if not exists public.appointments (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid not null references public.profiles (id) on delete cascade,
  service_id       uuid references public.services (id) on delete set null,
  full_name        text not null,
  email            text not null,
  phone            text,
  company          text,
  appointment_date date not null,
  appointment_time time not null,
  timezone         text default 'America/Caracas',
  message          text,
  status           text not null default 'pending'
                     check (status in ('pending', 'confirmed', 'cancelled', 'completed')),
  health_notes     text,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create index if not exists idx_appointments_user   on public.appointments (user_id);
create index if not exists idx_appointments_status on public.appointments (status);
create index if not exists idx_appointments_date   on public.appointments (appointment_date);

drop trigger if exists trg_appointments_updated_at on public.appointments;
create trigger trg_appointments_updated_at
  before update on public.appointments
  for each row execute function public.set_updated_at();

alter table public.appointments enable row level security;

drop policy if exists "appointments_own_or_admin" on public.appointments;
create policy "appointments_own_or_admin" on public.appointments
  for all to authenticated
  using (user_id = auth.uid() or public.is_admin())
  with check (user_id = auth.uid() or public.is_admin());

-- =============================================================================
-- 5. exercise_library — EL LIBRO DE ENTRENAMIENTO
--    Va antes que `exercises` porque este la referencia.
--    Los 302 ejercicios se cargan con seeds/exercise_library_seed.sql
-- =============================================================================
create table if not exists public.exercise_library (
  id                uuid primary key default gen_random_uuid(),
  slug              text not null unique,
  name              text not null,              -- nombre en español
  name_en           text,                       -- original, sirve para buscar
  description       text,
  cues              text,                       -- claves técnicas del entrenador
  equipment         text,                       -- Barra, Mancuernas, Peso corporal…
  primary_muscle    text,
  secondary_muscles text[] not null default '{}',
  exercise_type     text not null default 'weight_reps'
                      check (exercise_type in ('weight_reps', 'bodyweight_reps',
                                               'assisted_bodyweight', 'duration',
                                               'distance_duration')),
  is_stretch        boolean not null default false,
  category          text not null default 'fuerza'
                      check (category in ('fuerza', 'cardio', 'core', 'movilidad')),
  level             text not null default 'todos'
                      check (level in ('principiante', 'intermedio', 'avanzado', 'todos')),
  -- Identificador de la animación (3 fotogramas) en @bryllim/workout-guide.
  -- Si está vacío, la ficha se muestra sin monigote.
  animation_slug    text,
  video_url         text,
  default_sets      integer,
  default_reps      text,
  is_published      boolean not null default true,
  created_by        uuid references auth.users (id) on delete set null,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create index if not exists idx_exlib_category  on public.exercise_library (category);
create index if not exists idx_exlib_muscle    on public.exercise_library (primary_muscle);
create index if not exists idx_exlib_equipment on public.exercise_library (equipment);
create index if not exists idx_exlib_name      on public.exercise_library (lower(name));

drop trigger if exists trg_exlib_updated_at on public.exercise_library;
create trigger trg_exlib_updated_at
  before update on public.exercise_library
  for each row execute function public.set_updated_at();

-- =============================================================================
-- 6. CONTENIDO — programs, workouts, exercises, videos
-- =============================================================================

-- Un plan nace PRIVADO: solo lo ven los alumnos a quienes se asigne.
-- is_public = true lo saca además en el catálogo abierto de /entrenamientos.
create table if not exists public.programs (
  id              uuid primary key default gen_random_uuid(),
  slug            text not null unique,
  title           text not null,
  subtitle        text,
  description     text,
  level           text not null default 'todos'
                    check (level in ('principiante', 'intermedio', 'avanzado', 'todos')),
  category        text,
  cover_image_url text,
  duration_weeks  integer,
  sessions_count  integer,
  sort_order      integer not null default 0,
  is_published    boolean not null default true,
  is_public       boolean not null default false,
  coach_id        uuid references auth.users (id) on delete set null,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists idx_programs_published on public.programs (is_published);

drop trigger if exists trg_programs_updated_at on public.programs;
create trigger trg_programs_updated_at
  before update on public.programs
  for each row execute function public.set_updated_at();

create table if not exists public.workouts (
  id               uuid primary key default gen_random_uuid(),
  program_id       uuid not null references public.programs (id) on delete cascade,
  title            text not null,
  description      text,
  week_number      integer,
  day_number       integer,
  focus            text,
  duration_minutes integer,
  sort_order       integer not null default 0,
  is_published     boolean not null default true,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create index if not exists idx_workouts_program on public.workouts (program_id, sort_order);

drop trigger if exists trg_workouts_updated_at on public.workouts;
create trigger trg_workouts_updated_at
  before update on public.workouts
  for each row execute function public.set_updated_at();

create table if not exists public.exercises (
  id               uuid primary key default gen_random_uuid(),
  workout_id       uuid not null references public.workouts (id) on delete cascade,
  library_id       uuid references public.exercise_library (id) on delete set null,
  name             text not null,
  description      text,                        -- técnica / indicaciones
  sets             integer,
  reps             text,                        -- libre: "10-12", "AMRAP", "30 s"
  rest_seconds     integer,
  tempo            text,
  target_weight_kg numeric(6, 2),
  rpe_target       numeric(3, 1),
  superset_group   text,                        -- ejercicios seguidos: "A", "B"…
  video_url        text,
  animation_slug   text,
  sort_order       integer not null default 0,
  created_at       timestamptz not null default now()
);

-- Cómo prescribe el coach: bloques con nombre (Warm up, Contrast set…),
-- intensidad relativa ("60% 1RM", "RPE 8", "130 BPM") y trabajo por lado.
-- superset_group sigue siendo la letra (A, B, C…) que agrupa la ronda.
alter table public.exercises
  add column if not exists block_name text,
  add column if not exists intensity  text,
  add column if not exists per_side   boolean not null default false;

create index if not exists idx_exercises_workout on public.exercises (workout_id, sort_order);
create index if not exists idx_exercises_library on public.exercises (library_id);

-- Biblioteca de video suelta (clases de técnica, movilidad, teoría).
create table if not exists public.videos (
  id               uuid primary key default gen_random_uuid(),
  title            text not null,
  description      text,
  category         text,
  level            text default 'todos'
                     check (level in ('principiante', 'intermedio', 'avanzado', 'todos')),
  video_url        text not null,
  thumbnail_url    text,
  duration_seconds integer,
  is_free_preview  boolean not null default false,
  sort_order       integer not null default 0,
  is_published     boolean not null default true,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

drop trigger if exists trg_videos_updated_at on public.videos;
create trigger trg_videos_updated_at
  before update on public.videos
  for each row execute function public.set_updated_at();

alter table public.videos enable row level security;

drop policy if exists "videos_public_read" on public.videos;
create policy "videos_public_read" on public.videos
  for select to anon, authenticated
  using (is_published or public.is_admin());

drop policy if exists "videos_admin_write" on public.videos;
create policy "videos_admin_write" on public.videos
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- =============================================================================
-- 7. program_assignments — qué plan tiene cada alumno
-- =============================================================================
create table if not exists public.program_assignments (
  id          uuid primary key default gen_random_uuid(),
  program_id  uuid not null references public.programs (id) on delete cascade,
  athlete_id  uuid not null references public.profiles (id) on delete cascade,
  assigned_by uuid references auth.users (id) on delete set null,
  starts_on   date not null default current_date,
  ends_on     date,
  status      text not null default 'activo'
                check (status in ('activo', 'pausado', 'terminado')),
  notes       text,                              -- indicaciones para el alumno
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  unique (program_id, athlete_id)
);

create index if not exists idx_assign_athlete on public.program_assignments (athlete_id, status);

drop trigger if exists trg_assign_updated_at on public.program_assignments;
create trigger trg_assign_updated_at
  before update on public.program_assignments
  for each row execute function public.set_updated_at();

-- Helpers de lectura. SECURITY DEFINER para no encadenar RLS entre tablas.
create or replace function public.can_read_program(p_program_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.programs p
    where p.id = p_program_id
      and (
        public.is_admin()
        or (p.is_published and p.is_public)
        or exists (
          select 1 from public.program_assignments pa
          where pa.program_id = p.id
            and pa.athlete_id = auth.uid()
            and pa.status in ('activo', 'pausado')
        )
      )
  );
$$;

create or replace function public.can_read_workout(p_workout_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.workouts w
    where w.id = p_workout_id
      and (public.is_admin() or (w.is_published and public.can_read_program(w.program_id)))
  );
$$;

-- =============================================================================
-- 8. REGISTRO — workout_logs, exercise_logs
-- =============================================================================
create table if not exists public.workout_logs (
  id               uuid primary key default gen_random_uuid(),
  athlete_id       uuid not null references public.profiles (id) on delete cascade,
  workout_id       uuid references public.workouts (id) on delete set null,
  assignment_id    uuid references public.program_assignments (id) on delete set null,
  performed_on     date not null default current_date,
  duration_minutes integer,
  perceived_effort smallint check (perceived_effort between 1 and 10),
  notes            text,
  status           text not null default 'completada'
                     check (status in ('completada', 'parcial')),
  xp_awarded       integer not null default 0,
  created_at       timestamptz not null default now()
);

-- Una misma sesión solo puntúa una vez al día (evita farmear XP).
create unique index if not exists idx_wlogs_unique
  on public.workout_logs (athlete_id, workout_id, performed_on)
  where workout_id is not null;

create index if not exists idx_wlogs_athlete on public.workout_logs (athlete_id, performed_on desc);

create table if not exists public.exercise_logs (
  id             uuid primary key default gen_random_uuid(),
  workout_log_id uuid not null references public.workout_logs (id) on delete cascade,
  exercise_id    uuid references public.exercises (id) on delete set null,
  library_id     uuid references public.exercise_library (id) on delete set null,
  exercise_name  text not null,                 -- copia, por si se borra el ejercicio
  set_number     smallint not null default 1,
  reps           integer,
  weight_kg      numeric(6, 2),
  seconds        integer,
  distance_m     integer,
  completed      boolean not null default true,
  created_at     timestamptz not null default now()
);

create index if not exists idx_elogs_log on public.exercise_logs (workout_log_id);

-- =============================================================================
-- 9. GAMIFICACIÓN
-- =============================================================================
create table if not exists public.athlete_stats (
  athlete_id      uuid primary key references public.profiles (id) on delete cascade,
  xp              integer not null default 0,
  level           integer not null default 1,
  current_streak  integer not null default 0,    -- días seguidos entrenando
  longest_streak  integer not null default 0,
  last_workout_on date,
  total_workouts  integer not null default 0,
  total_minutes   integer not null default 0,
  updated_at      timestamptz not null default now()
);

create index if not exists idx_stats_xp on public.athlete_stats (xp desc);

create table if not exists public.achievements (
  id              uuid primary key default gen_random_uuid(),
  code            text not null unique,
  name            text not null,
  description     text,
  icon            text,                           -- emoji: se ve bien y no pesa
  xp_reward       integer not null default 0,
  threshold_type  text not null
                    check (threshold_type in ('workouts', 'streak', 'minutes', 'level')),
  threshold_value integer not null,
  sort_order      integer not null default 0
);

create table if not exists public.athlete_achievements (
  athlete_id     uuid not null references public.profiles (id) on delete cascade,
  achievement_id uuid not null references public.achievements (id) on delete cascade,
  unlocked_at    timestamptz not null default now(),
  primary key (athlete_id, achievement_id)
);

create index if not exists idx_ach_athlete on public.athlete_achievements (athlete_id);

-- Fórmula de niveles.
--   Nivel 2 = 100 XP · Nivel 3 = 400 · Nivel 4 = 900 · Nivel 5 = 1.600 …
--   (cada nivel cuesta un poco más que el anterior). Tope: nivel 50.
create or replace function public.level_for_xp(p_xp integer)
returns integer
language sql
immutable
as $$
  select least(50, greatest(1, floor(sqrt(greatest(p_xp, 0)::numeric / 100))::int + 1));
$$;

create or replace function public.xp_for_level(p_level integer)
returns integer
language sql
immutable
as $$
  select (greatest(p_level, 1) - 1) * (greatest(p_level, 1) - 1) * 100;
$$;

-- Cada alumno arranca con su fila de estadísticas.
create or replace function public.ensure_athlete_stats()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.athlete_stats (athlete_id) values (new.id)
  on conflict (athlete_id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_profile_created_stats on public.profiles;
create trigger on_profile_created_stats
  after insert on public.profiles
  for each row execute function public.ensure_athlete_stats();

-- Por si ya había perfiles antes de crear esta tabla.
insert into public.athlete_stats (athlete_id)
select p.id from public.profiles p
on conflict (athlete_id) do nothing;

-- Desbloqueo de medallas. Se llama solo, tras actualizar las estadísticas.
create or replace function public.check_achievements(p_athlete uuid)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_stats public.athlete_stats%rowtype;
  v_bonus integer := 0;
  v_row   record;
begin
  select * into v_stats from public.athlete_stats where athlete_id = p_athlete;
  if not found then return 0; end if;

  for v_row in
    select a.id, a.xp_reward
    from public.achievements a
    where not exists (
            select 1 from public.athlete_achievements aa
            where aa.athlete_id = p_athlete and aa.achievement_id = a.id
          )
      and case a.threshold_type
            when 'workouts' then v_stats.total_workouts
            when 'streak'   then v_stats.longest_streak
            when 'minutes'  then v_stats.total_minutes
            when 'level'    then v_stats.level
          end >= a.threshold_value
  loop
    insert into public.athlete_achievements (athlete_id, achievement_id)
    values (p_athlete, v_row.id)
    on conflict do nothing;
    v_bonus := v_bonus + v_row.xp_reward;
  end loop;

  -- El XP de las medallas también suma (y puede subir de nivel).
  if v_bonus > 0 then
    update public.athlete_stats
    set xp = xp + v_bonus,
        level = public.level_for_xp(xp + v_bonus),
        updated_at = now()
    where athlete_id = p_athlete;
  end if;

  return v_bonus;
end;
$$;

-- Al registrar una sesión: calcula XP, actualiza racha, totales y medallas.
--
-- XP POR SESIÓN (cambia los números aquí si quieres otra economía):
--   50  base por sesión completada (25 si fue parcial)
--   +1  por minuto entrenado, máximo 60
--   +25 bono si mantiene la racha (entrenó ayer)
create or replace function public.apply_workout_log()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_stats   public.athlete_stats%rowtype;
  v_xp      integer;
  v_streak  integer;
  v_minutes integer := coalesce(new.duration_minutes, 0);
begin
  insert into public.athlete_stats (athlete_id) values (new.athlete_id)
  on conflict (athlete_id) do nothing;

  select * into v_stats from public.athlete_stats where athlete_id = new.athlete_id for update;

  -- Racha: sube si entrenó ayer, se mantiene si ya entrenó hoy, y se reinicia
  -- en cualquier otro caso. Cargar una sesión con fecha atrasada (el entrenador
  -- metiendo una sesión vieja) no rompe la racha actual.
  if v_stats.last_workout_on is not null and new.performed_on < v_stats.last_workout_on then
    v_streak := v_stats.current_streak;
  elsif v_stats.last_workout_on = new.performed_on then
    v_streak := greatest(v_stats.current_streak, 1);
  elsif v_stats.last_workout_on = new.performed_on - 1 then
    v_streak := v_stats.current_streak + 1;
  else
    v_streak := 1;
  end if;

  v_xp := case when new.status = 'completada' then 50 else 25 end
        + least(v_minutes, 60)
        + case when v_streak > 1 then 25 else 0 end;

  new.xp_awarded := v_xp;

  update public.athlete_stats
  set xp              = xp + v_xp,
      level           = public.level_for_xp(xp + v_xp),
      current_streak  = v_streak,
      longest_streak  = greatest(longest_streak, v_streak),
      last_workout_on = greatest(coalesce(last_workout_on, new.performed_on), new.performed_on),
      total_workouts  = total_workouts + 1,
      total_minutes   = total_minutes + v_minutes,
      updated_at      = now()
  where athlete_id = new.athlete_id;

  perform public.check_achievements(new.athlete_id);

  return new;
end;
$$;

drop trigger if exists on_workout_log_insert on public.workout_logs;
create trigger on_workout_log_insert
  before insert on public.workout_logs
  for each row execute function public.apply_workout_log();

-- Si se borra un registro se devuelve el XP (el entrenador puede corregir).
create or replace function public.revert_workout_log()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.athlete_stats
  set xp             = greatest(0, xp - old.xp_awarded),
      level          = public.level_for_xp(greatest(0, xp - old.xp_awarded)),
      total_workouts = greatest(0, total_workouts - 1),
      total_minutes  = greatest(0, total_minutes - coalesce(old.duration_minutes, 0)),
      updated_at     = now()
  where athlete_id = old.athlete_id;
  return old;
end;
$$;

drop trigger if exists on_workout_log_delete on public.workout_logs;
create trigger on_workout_log_delete
  after delete on public.workout_logs
  for each row execute function public.revert_workout_log();

-- RANKING
--   p_period = 'total' -> XP acumulado histórico
--   p_period = 'mes'   -> XP ganado en el mes en curso
-- Solo salen los alumnos con profiles.show_in_ranking = true.
create or replace function public.get_leaderboard(
  p_limit  integer default 20,
  p_period text default 'total'
)
returns table (
  rank           bigint,
  athlete_id     uuid,
  display_name   text,
  avatar_url     text,
  xp             integer,
  level          integer,
  current_streak integer,
  total_workouts integer,
  is_me          boolean
)
language sql
stable
security definer
set search_path = public
as $$
  with base as (
    select
      p.id,
      coalesce(nullif(trim(p.full_name), ''), split_part(coalesce(p.email, 'Atleta'), '@', 1)) as display_name,
      p.image,
      case
        when p_period = 'mes' then coalesce((
          select sum(wl.xp_awarded)::int
          from public.workout_logs wl
          where wl.athlete_id = p.id
            and wl.performed_on >= date_trunc('month', current_date)::date
        ), 0)
        else s.xp
      end as xp,
      s.level,
      s.current_streak,
      s.total_workouts
    from public.profiles p
    join public.athlete_stats s on s.athlete_id = p.id
    where p.show_in_ranking
      and p.is_active
      and coalesce(p.role, 'user') = 'user'
  )
  select
    rank() over (order by b.xp desc, b.total_workouts desc, b.display_name asc),
    b.id,
    b.display_name,
    b.image,
    b.xp,
    b.level,
    b.current_streak,
    b.total_workouts,
    b.id = auth.uid()
  from base b
  where b.xp > 0
  order by 1
  limit greatest(coalesce(p_limit, 20), 1);
$$;

create or replace function public.get_my_rank(p_period text default 'total')
returns table (
  rank          bigint,
  xp            integer,
  level         integer,
  total_players bigint
)
language sql
stable
security definer
set search_path = public
as $$
  with board as (
    select * from public.get_leaderboard(100000, p_period)
  )
  select b.rank, b.xp, b.level, (select count(*) from board)
  from board b
  where b.athlete_id = auth.uid();
$$;

revoke all on function public.get_leaderboard(integer, text) from public, anon;
revoke all on function public.get_my_rank(text) from public, anon;
grant execute on function public.get_leaderboard(integer, text) to authenticated;
grant execute on function public.get_my_rank(text) to authenticated;

-- Catálogo de medallas.
insert into public.achievements (code, name, description, icon, xp_reward, threshold_type, threshold_value, sort_order)
values
  ('primera-sesion',  'Primer paso',      'Completaste tu primera sesión.',             '🔰',  25, 'workouts',   1,  1),
  ('sesiones-5',      'Ya es costumbre',  '5 sesiones registradas.',                    '💪',  50, 'workouts',   5,  2),
  ('sesiones-10',     'Constante',        '10 sesiones registradas.',                   '🏋️',  75, 'workouts',  10,  3),
  ('sesiones-25',     'Disciplina',       '25 sesiones registradas.',                   '🎯', 150, 'workouts',  25,  4),
  ('sesiones-50',     'Medio centenar',   '50 sesiones registradas.',                   '🔥', 250, 'workouts',  50,  5),
  ('sesiones-100',    'Centenario',       '100 sesiones registradas.',                  '🏆', 500, 'workouts', 100,  6),
  ('racha-3',         'Tres seguidos',    '3 días seguidos entrenando.',                '⚡',  40, 'streak',     3, 10),
  ('racha-7',         'Semana perfecta',  '7 días seguidos entrenando.',                '📅', 100, 'streak',     7, 11),
  ('racha-14',        'Dos semanas',      '14 días seguidos entrenando.',               '🚀', 200, 'streak',    14, 12),
  ('racha-30',        'Mes de hierro',    '30 días seguidos entrenando.',               '🛡️', 400, 'streak',    30, 13),
  ('minutos-300',     '5 horas',          '300 minutos de entrenamiento acumulados.',   '⏱️',  60, 'minutes',  300, 20),
  ('minutos-1000',    'Mil minutos',      '1.000 minutos de entrenamiento acumulados.', '⌛', 150, 'minutes', 1000, 21),
  ('minutos-3000',    'Cincuenta horas',  '3.000 minutos de entrenamiento acumulados.', '🕰️', 300, 'minutes', 3000, 22),
  ('nivel-5',         'Nivel 5',          'Alcanzaste el nivel 5.',                     '⭐', 100, 'level',      5, 30),
  ('nivel-10',        'Nivel 10',         'Alcanzaste el nivel 10.',                    '🌟', 250, 'level',     10, 31),
  ('nivel-20',        'Nivel 20',         'Alcanzaste el nivel 20.',                    '👑', 500, 'level',     20, 32)
on conflict (code) do update set
  name            = excluded.name,
  description     = excluded.description,
  icon            = excluded.icon,
  xp_reward       = excluded.xp_reward,
  threshold_type  = excluded.threshold_type,
  threshold_value = excluded.threshold_value,
  sort_order      = excluded.sort_order;

-- =============================================================================
-- 10. CLASES
-- =============================================================================
create table if not exists public.classes (
  id               uuid primary key default gen_random_uuid(),
  title            text not null,
  description      text,
  coach_id         uuid references auth.users (id) on delete set null,
  starts_at        timestamptz not null,
  duration_minutes integer not null default 60,
  capacity         integer not null default 10 check (capacity > 0),
  location         text,
  level            text not null default 'todos'
                     check (level in ('principiante', 'intermedio', 'avanzado', 'todos')),
  is_published     boolean not null default false,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create index if not exists idx_classes_starts on public.classes (starts_at);

drop trigger if exists trg_classes_updated_at on public.classes;
create trigger trg_classes_updated_at
  before update on public.classes
  for each row execute function public.set_updated_at();

create table if not exists public.class_bookings (
  id         uuid primary key default gen_random_uuid(),
  class_id   uuid not null references public.classes (id) on delete cascade,
  athlete_id uuid not null references public.profiles (id) on delete cascade,
  status     text not null default 'reservada'
               check (status in ('reservada', 'cancelada', 'asistio', 'falto')),
  created_at timestamptz not null default now(),
  unique (class_id, athlete_id)
);

create index if not exists idx_bookings_class   on public.class_bookings (class_id);
create index if not exists idx_bookings_athlete on public.class_bookings (athlete_id);

-- No se puede reservar por encima del cupo.
create or replace function public.enforce_class_capacity()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_capacity integer;
  v_taken    integer;
begin
  if new.status <> 'reservada' then
    return new;
  end if;

  select capacity into v_capacity from public.classes where id = new.class_id;
  select count(*) into v_taken
  from public.class_bookings
  where class_id = new.class_id
    and status = 'reservada'
    and id is distinct from new.id;

  if v_taken >= coalesce(v_capacity, 0) then
    raise exception 'La clase ya no tiene cupos disponibles';
  end if;

  return new;
end;
$$;

drop trigger if exists on_class_booking on public.class_bookings;
create trigger on_class_booking
  before insert or update on public.class_bookings
  for each row execute function public.enforce_class_capacity();

-- =============================================================================
-- 11. ROW LEVEL SECURITY del área de entrenamiento
-- =============================================================================
alter table public.programs             enable row level security;
alter table public.workouts             enable row level security;
alter table public.exercises            enable row level security;
alter table public.exercise_library     enable row level security;
alter table public.program_assignments  enable row level security;
alter table public.workout_logs         enable row level security;
alter table public.exercise_logs        enable row level security;
alter table public.athlete_stats        enable row level security;
alter table public.achievements         enable row level security;
alter table public.athlete_achievements enable row level security;
alter table public.classes              enable row level security;
alter table public.class_bookings       enable row level security;

-- ---- contenido: catálogo público + planes asignados ------------------------
drop policy if exists "programs_read" on public.programs;
create policy "programs_read" on public.programs
  for select to anon, authenticated
  using (public.can_read_program(id));

drop policy if exists "programs_admin_write" on public.programs;
create policy "programs_admin_write" on public.programs
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "workouts_read" on public.workouts;
create policy "workouts_read" on public.workouts
  for select to anon, authenticated
  using (public.is_admin() or (is_published and public.can_read_program(program_id)));

drop policy if exists "workouts_admin_write" on public.workouts;
create policy "workouts_admin_write" on public.workouts
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "exercises_read" on public.exercises;
create policy "exercises_read" on public.exercises
  for select to anon, authenticated
  using (public.is_admin() or public.can_read_workout(workout_id));

drop policy if exists "exercises_admin_write" on public.exercises;
create policy "exercises_admin_write" on public.exercises
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ---- el libro es para alumnos con sesión iniciada --------------------------
drop policy if exists "exlib_auth_read" on public.exercise_library;
create policy "exlib_auth_read" on public.exercise_library
  for select to authenticated
  using (is_published or public.is_admin());

drop policy if exists "exlib_admin_write" on public.exercise_library;
create policy "exlib_admin_write" on public.exercise_library
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ---- asignaciones ----------------------------------------------------------
drop policy if exists "assign_read_own_or_admin" on public.program_assignments;
create policy "assign_read_own_or_admin" on public.program_assignments
  for select to authenticated
  using (athlete_id = auth.uid() or public.is_admin());

drop policy if exists "assign_admin_write" on public.program_assignments;
create policy "assign_admin_write" on public.program_assignments
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ---- registros: cada quien los suyos; el entrenador, todos -----------------
drop policy if exists "wlogs_own_or_admin" on public.workout_logs;
create policy "wlogs_own_or_admin" on public.workout_logs
  for all to authenticated
  using (athlete_id = auth.uid() or public.is_admin())
  with check (athlete_id = auth.uid() or public.is_admin());

drop policy if exists "elogs_own_or_admin" on public.exercise_logs;
create policy "elogs_own_or_admin" on public.exercise_logs
  for all to authenticated
  using (
    public.is_admin()
    or exists (
      select 1 from public.workout_logs wl
      where wl.id = exercise_logs.workout_log_id and wl.athlete_id = auth.uid()
    )
  )
  with check (
    public.is_admin()
    or exists (
      select 1 from public.workout_logs wl
      where wl.id = exercise_logs.workout_log_id and wl.athlete_id = auth.uid()
    )
  );

-- ---- estadísticas: el ranking va por función, no por lectura directa -------
drop policy if exists "stats_read_own_or_admin" on public.athlete_stats;
create policy "stats_read_own_or_admin" on public.athlete_stats
  for select to authenticated
  using (athlete_id = auth.uid() or public.is_admin());

drop policy if exists "stats_admin_write" on public.athlete_stats;
create policy "stats_admin_write" on public.athlete_stats
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "ach_auth_read" on public.achievements;
create policy "ach_auth_read" on public.achievements
  for select to authenticated using (true);

drop policy if exists "ach_admin_write" on public.achievements;
create policy "ach_admin_write" on public.achievements
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "athach_read_own_or_admin" on public.athlete_achievements;
create policy "athach_read_own_or_admin" on public.athlete_achievements
  for select to authenticated
  using (athlete_id = auth.uid() or public.is_admin());

-- ---- clases ----------------------------------------------------------------
drop policy if exists "classes_auth_read" on public.classes;
create policy "classes_auth_read" on public.classes
  for select to authenticated
  using (is_published or public.is_admin());

drop policy if exists "classes_admin_write" on public.classes;
create policy "classes_admin_write" on public.classes
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "bookings_own_or_admin" on public.class_bookings;
create policy "bookings_own_or_admin" on public.class_bookings
  for all to authenticated
  using (athlete_id = auth.uid() or public.is_admin())
  with check (athlete_id = auth.uid() or public.is_admin());

-- =============================================================================
-- 12. CONTENIDO DE EJEMPLO — "Camp 8 semanas · Striker"
--     Un bloque completo del sistema, tal como el coach lo entrega en PDF:
--     semanas 1-4 (base de potencia → pico neural), 5-6 (específico) y
--     7-8 (sistema híbrido de rounds). 3 sesiones por semana = 24 sesiones.
--     Sale en el catálogo público (/entrenamientos). Bórralo o despublícalo
--     cuando el coach cargue los planes reales de cada atleta.
-- =============================================================================
insert into public.programs (slug, title, subtitle, description, level, category, duration_weeks, sessions_count, sort_order, is_public)
values
  ('camp-8-semanas-striker',
   'Camp 8 semanas · Striker',
   'Potencia de piernas, velocidad de golpeo y capacidad anaeróbica repetida',
   'Bloque de ejemplo del sistema para un striker que quiere controlar el centro del octágono: presión, velocidad de entrada, potencia corta y capacidad de repetir esfuerzos. Semanas 1-4: base de potencia, velocidad rotacional y pico neural. Semanas 5-6: fase específica con contrast sets y sprints cortos. Semanas 7-8: sistema híbrido de rounds que simula un campeonato. 3 sesiones por semana (lunes, martes y jueves) de 55 a 65 minutos.',
   'avanzado', 'combate', 8, 24, 1, true)
on conflict (slug) do nothing;

-- Una plantilla por semana (o par de semanas), repetida los tres días.
insert into public.workouts (program_id, title, description, week_number, day_number, focus, duration_minutes, sort_order)
select p.id,
       format('Semana %s · Día %s — %s', t.week_number, d.day_number, t.focus),
       t.description,
       t.week_number,
       d.day_number,
       t.focus,
       t.duration_minutes,
       t.week_number * 10 + d.day_number
from public.programs p
cross join (values
  (1, 'Base de potencia',        'Objetivo: reactividad, fuerza rápida y base anaeróbica. Cada repetición explosiva; si baja la velocidad, se termina la serie.', 60),
  (2, 'Velocidad rotacional',    'Objetivo: aumentar velocidad y potencia rotacional. Sube la carga del box squat y entra el medball rotacional.', 60),
  (3, 'Pico de potencia neural', 'Objetivo: pico de potencia neural. Menos repeticiones, más series, cargas al 80-85 %. Controla la intensidad del sparring esta semana.', 60),
  (4, 'Pico de potencia neural', 'Objetivo: pico de potencia neural con más volumen. Última semana del bloque de fuerza: calidad neuromuscular por encima de cantidad de trabajo.', 65),
  (5, 'Específico',              'Objetivo: específico. Contrast set con golpeo y sprints cortos con descanso incompleto. Dormir 8-9 h y evitar conditioning fuera del plan.', 60),
  (6, 'Específico',              'Objetivo: específico. Misma sesión que la semana 5: busca más velocidad en cada golpe y menos caída de potencia entre sprints.', 60),
  (7, 'Sistema híbrido',         'Simula fatiga extrema: sprint en assault bike alternado con drills de combate durante 5 rounds de 5 minutos. Objetivo: simular campeonato.', 55),
  (8, 'Sistema híbrido',         'Última semana. Mismo sistema híbrido: el peso ya debe estar en 74-75 kg para que en fight week solo quede el water cut.', 55)
) as t(week_number, focus, description, duration_minutes)
cross join (values (1), (2), (3)) as d(day_number)
where p.slug = 'camp-8-semanas-striker'
  and not exists (
    select 1 from public.workouts w
    where w.program_id = p.id and w.week_number = t.week_number and w.day_number = d.day_number
  );

-- Ejercicios de cada plantilla. tpl = 'w1'…'w4' para las semanas 1-4,
-- 'w56' para las semanas 5-6 y 'w78' para las 7-8.
-- El descanso va en el ÚLTIMO ejercicio de cada ronda (A, B, C…): así el
-- cronómetro del alumno arranca al cerrar la ronda, como prescribe el coach.
insert into public.exercises (workout_id, name, description, block_name, superset_group, sets, reps, intensity, per_side, rest_seconds, animation_slug, sort_order)
select w.id, e.name, e.description, e.block_name, e.superset_group, e.sets, e.reps, e.intensity, e.per_side, e.rest_seconds, e.animation_slug, e.sort_order
from public.workouts w
join public.programs p on p.id = w.program_id
cross join (values
  -- ---------------------------------------------------------- semana 1 ---
  ('w1', 'Assault bike o cuerda', 'Ritmo suave, solo para subir pulsaciones.', 'Warm up', null, 1, '3 min', null, false, 0, 'assault-bike', 1),
  ('w1', 'Serie dinámica: cadera, T-spine y hombros', 'Termina con activación de glúteo y escápula.', 'Warm up', null, 1, '6-8 min', null, false, 0, null, 2),
  ('w1', 'A1. Depth jump + triple tuck jump', 'Contacto mínimo con el suelo y salida explosiva.', 'Plyometrics', 'A', 3, '2', null, false, 0, null, 3),
  ('w1', 'A2. Lateral bound', 'Controla el espacio: aterriza estable y sal al otro lado. Descanso 60-90 s al cerrar la ronda.', 'Plyometrics', 'A', 3, '4', null, true, 75, null, 4),
  ('w1', 'B1. Speed back box squat', 'Velocidad máxima en la subida. Si baja la velocidad, se termina la serie.', 'Contrast set', 'B', 4, '3', '75 % 1RM', false, 0, 'squat', 5),
  ('w1', 'B2. Overhead medball slam', 'Cada lanzamiento con máxima intención.', 'Contrast set', 'B', 4, '5', null, false, 0, null, 6),
  ('w1', 'B3. Band assisted vertical jump', 'Descanso 2-3 min al cerrar la ronda.', 'Contrast set', 'B', 4, '6', null, false, 150, 'jump-squat', 7),
  ('w1', 'C1. Push press (cluster)', 'Haz 2 repeticiones, pausa 20 s dentro de la serie y sigue hasta completar 6. Igual en las 3 series.', 'Push + Pull', 'C', 3, '2 + 2 + 2', null, false, 0, 'push-press', 8),
  ('w1', 'C2. Ballistic chin ups', 'Explosivo hacia arriba. Descanso 2 min al cerrar la ronda.', 'Push + Pull', 'C', 3, '6', null, false, 120, 'chin-up', 9),
  ('w1', 'D1. Landmine twists', 'Rotación desde la cadera, brazos largos.', 'Midsection', 'D', 3, '8', null, true, 0, null, 10),
  ('w1', 'D2. Rotaciones explosivas con banda', 'Banda a la altura del pecho; remata como un golpe.', 'Midsection', 'D', 3, '8', null, true, 60, 'banded-woodchop', 11),
  ('w1', 'Assault bike: base + sprints', 'Primero 3 min a 130 BPM. Después 7 sprints de 8 s a tope con 2 min de descanso completo. Si la potencia cae demasiado, para.', 'Conditioning', null, 7, '8 s sprint', 'Máximo', false, 120, 'assault-bike', 12),
  ('w1', 'Respiración diafragmática 4·6·4·6', 'Inhala 4, mantén 6, exhala 4, mantén 6. Manos en las costillas: siente que se expanden de adentro hacia afuera.', 'Breathing', null, 1, '3-5 min', null, false, 0, null, 13),
  -- ---------------------------------------------------------- semana 2 ---
  ('w2', 'Assault bike o cuerda', 'Ritmo suave, solo para subir pulsaciones.', 'Warm up', null, 1, '3 min', null, false, 0, 'assault-bike', 1),
  ('w2', 'Serie dinámica: cadera, T-spine y hombros', 'Termina con activación de glúteo y escápula.', 'Warm up', null, 1, '6-8 min', null, false, 0, null, 2),
  ('w2', 'A1. Depth jump + knee drive jump', 'Contacto mínimo y rodilla arriba con intención.', 'Plyometrics', 'A', 3, '3', null, false, 0, null, 3),
  ('w2', 'A2. Lateral bound distance', 'Busca distancia sin perder el aterrizaje. Descanso 60-90 s al cerrar la ronda.', 'Plyometrics', 'A', 3, '4', null, true, 75, null, 4),
  ('w2', 'B1. Speed box squat', 'Velocidad máxima en la subida. Si baja la velocidad, se termina la serie.', 'Contrast set', 'B', 5, '2', '80 % 1RM', false, 0, 'squat', 5),
  ('w2', 'B2. Rotational medball slam', 'Rota desde la cadera y descarga como un gancho.', 'Contrast set', 'B', 5, '4', null, true, 0, null, 6),
  ('w2', 'B3. Band vertical jump', 'Descanso 2-3 min al cerrar la ronda.', 'Contrast set', 'B', 5, '6', null, false, 150, 'jump-squat', 7),
  ('w2', 'C1. Push press (cluster)', 'Haz 2 repeticiones, pausa 20 s y otras 2. Igual en las 4 series.', 'Push + Pull', 'C', 4, '2 + 2', null, false, 0, 'push-press', 8),
  ('w2', 'C2. Explosive chin ups', 'Explosivo hacia arriba. Descanso 2 min al cerrar la ronda.', 'Push + Pull', 'C', 4, '5', null, false, 120, 'chin-up', 9),
  ('w2', 'D1. Landmine rotational punch', 'Termina la rotación en un golpe con la barra.', 'Midsection', 'D', 3, '6', null, true, 0, null, 10),
  ('w2', 'D2. Band rotational punch', 'Golpe recto contra la banda, cadera primero.', 'Midsection', 'D', 3, '8', null, true, 60, 'banded-woodchop', 11),
  ('w2', 'Assault bike: base + sprints', 'Primero 3 min a 130 BPM. Después 6-7 sprints de 10 s a tope con 2 min de descanso completo.', 'Conditioning', null, 7, '10 s sprint', 'Máximo', false, 120, 'assault-bike', 12),
  ('w2', 'Respiración diafragmática 4·6·4·6', 'Inhala 4, mantén 6, exhala 4, mantén 6. Manos en las costillas: siente que se expanden de adentro hacia afuera.', 'Breathing', null, 1, '3-5 min', null, false, 0, null, 13),
  -- ---------------------------------------------------------- semana 3 ---
  ('w3', 'Assault bike o cuerda', 'Ritmo suave, solo para subir pulsaciones.', 'Warm up', null, 1, '3 min', null, false, 0, 'assault-bike', 1),
  ('w3', 'Serie dinámica: cadera, T-spine y hombros', 'Termina con activación de glúteo y escápula.', 'Warm up', null, 1, '6-8 min', null, false, 0, null, 2),
  ('w3', 'A1. Depth jump reactivo', 'Lo más corto posible en el suelo.', 'Plyometrics', 'A', 4, '2', null, false, 0, null, 3),
  ('w3', 'A2. Lateral bound explosivo', 'Descanso 60-90 s al cerrar la ronda.', 'Plyometrics', 'A', 4, '3', null, true, 75, null, 4),
  ('w3', 'B1. Speed box squat', 'Velocidad máxima en la subida. Si baja la velocidad, se termina la serie.', 'Contrast set', 'B', 6, '2', '80-85 % 1RM', false, 0, 'squat', 5),
  ('w3', 'B2. Overhead medball slam', 'Cada lanzamiento con máxima intención.', 'Contrast set', 'B', 6, '4', null, false, 0, null, 6),
  ('w3', 'B3. Band assisted jumps', 'Descanso 2-3 min al cerrar la ronda.', 'Contrast set', 'B', 6, '5', null, false, 150, 'jump-squat', 7),
  ('w3', 'C1. Push press (cluster)', 'Haz 2 repeticiones, pausa 20 s y otras 2. Igual en las 4 series.', 'Push + Pull', 'C', 4, '2 + 2', null, false, 0, 'push-press', 8),
  ('w3', 'C2. Ballistic chin ups', 'Explosivo hacia arriba. Descanso 2 min al cerrar la ronda.', 'Push + Pull', 'C', 4, '4', null, false, 120, 'chin-up', 9),
  ('w3', 'D1. Landmine twists', 'Rotación desde la cadera, brazos largos.', 'Midsection', 'D', 3, '6', null, true, 0, null, 10),
  ('w3', 'D2. Band explosive rotation', 'Banda a la altura del pecho; remata como un golpe.', 'Midsection', 'D', 3, '6', null, true, 60, 'banded-woodchop', 11),
  ('w3', 'Assault bike: base + sprints', 'Primero 3 min a 130 BPM. Después 5-6 sprints de 10 s a tope con 2 min de descanso completo.', 'Conditioning', null, 6, '10 s sprint', 'Máximo', false, 120, 'assault-bike', 12),
  ('w3', 'Respiración diafragmática 4·6·4·6', 'Inhala 4, mantén 6, exhala 4, mantén 6. Manos en las costillas: siente que se expanden de adentro hacia afuera.', 'Breathing', null, 1, '3-5 min', null, false, 0, null, 13),
  -- ---------------------------------------------------------- semana 4 ---
  ('w4', 'Assault bike o cuerda', 'Ritmo suave, solo para subir pulsaciones.', 'Warm up', null, 1, '3 min', null, false, 0, 'assault-bike', 1),
  ('w4', 'Serie dinámica: cadera, T-spine y hombros', 'Termina con activación de glúteo y escápula.', 'Warm up', null, 1, '6-8 min', null, false, 0, null, 2),
  ('w4', 'A1. Depth jump reactivo', 'Lo más corto posible en el suelo.', 'Plyometrics', 'A', 4, '5', null, false, 0, null, 3),
  ('w4', 'A2. Lateral bound explosivo', 'Descanso 60-90 s al cerrar la ronda.', 'Plyometrics', 'A', 4, '5', null, true, 75, null, 4),
  ('w4', 'B1. Speed box squat', 'Velocidad máxima en la subida. Si baja la velocidad, se termina la serie.', 'Contrast set', 'B', 6, '4', '80-85 % 1RM', false, 0, 'squat', 5),
  ('w4', 'B2. Overhead medball slam', 'Cada lanzamiento con máxima intención.', 'Contrast set', 'B', 6, '6', null, false, 0, null, 6),
  ('w4', 'B3. Band assisted jumps', 'Descanso 2-3 min al cerrar la ronda.', 'Contrast set', 'B', 6, '7', null, false, 150, 'jump-squat', 7),
  ('w4', 'C1. Push press (cluster)', 'Haz 2 repeticiones, pausa 20 s y otras 2. Igual en las 5 series.', 'Push + Pull', 'C', 5, '2 + 2', null, false, 0, 'push-press', 8),
  ('w4', 'C2. Ballistic chin ups', 'Explosivo hacia arriba. Descanso 2 min al cerrar la ronda.', 'Push + Pull', 'C', 5, '4', null, false, 120, 'chin-up', 9),
  ('w4', 'D1. Landmine twists', 'Rotación desde la cadera, brazos largos.', 'Midsection', 'D', 3, '8', null, true, 0, null, 10),
  ('w4', 'D2. Band explosive rotation', 'Banda a la altura del pecho; remata como un golpe.', 'Midsection', 'D', 3, '8', null, true, 60, 'banded-woodchop', 11),
  ('w4', 'Assault bike: base + sprints', 'Primero 3 min a 130 BPM. Después 8 sprints de 10 s a tope con 2 min de descanso completo.', 'Conditioning', null, 8, '10 s sprint', 'Máximo', false, 120, 'assault-bike', 12),
  ('w4', 'Respiración diafragmática 4·6·4·6', 'Inhala 4, mantén 6, exhala 4, mantén 6. Manos en las costillas: siente que se expanden de adentro hacia afuera.', 'Breathing', null, 1, '3-5 min', null, false, 0, null, 13),
  -- ------------------------------------------------------- semanas 5-6 ---
  ('w56', 'Assault bike o cuerda', 'Ritmo suave, solo para subir pulsaciones.', 'Warm up', null, 1, '3 min', null, false, 0, 'assault-bike', 1),
  ('w56', 'Serie dinámica: cadera, T-spine y hombros', 'Termina con activación de glúteo y escápula.', 'Warm up', null, 1, '6-8 min', null, false, 0, null, 2),
  ('w56', 'A1. Peso muerto', '15 s y pasa al siguiente ejercicio de la ronda.', 'Contrast set', 'A', 3, '3', '60 % 1RM', false, 15, 'deadlift', 3),
  ('w56', 'A2. Landmine row', '15 s y pasa al siguiente.', 'Contrast set', 'A', 3, '8', null, true, 15, 't-bar-row', 4),
  ('w56', 'A3. Medball throws + golpeo', 'Lanza y remata con golpe. 15 s y pasa al siguiente.', 'Contrast set', 'A', 3, '5', null, true, 15, null, 5),
  ('w56', 'A4. Push up con banda elástica al pecho', 'Al terminar: 60-90 s de descanso activo y vuelve a A1.', 'Contrast set', 'A', 3, '12', null, false, 75, 'push-up', 6),
  ('w56', 'B1. Landmine twists', 'Rotación desde la cadera, brazos largos.', 'Midsection', 'B', 3, '6', null, true, 0, null, 7),
  ('w56', 'B2. Band explosive rotation con golpeo', 'Cada rotación termina en golpe.', 'Midsection', 'B', 3, '12', null, true, 0, 'banded-woodchop', 8),
  ('w56', 'B3. Salto de vallas o cajones + golpeo', '3 estaciones. Termina con golpeo rápido e intenso, sobre todo los últimos golpes. La salida, desde las rodillas.', 'Midsection', 'B', 3, '4', null, false, 60, null, 9),
  ('w56', 'Assault bike: base + sprints cortos', 'Primero 3 min a 130 BPM. Después 8 sprints de 10 s con solo 50 s de descanso.', 'Conditioning', null, 8, '10 s sprint', 'Máximo', false, 50, 'assault-bike', 10),
  ('w56', 'Pelotas de tenis: rebote con la palma', 'Dos pelotas de tenis. Golpea al suelo con la palma y que reboten una y otra vez. 20 s de descanso entre series.', 'Conditioning', null, 3, '1 min', null, false, 20, null, 11),
  ('w56', 'Respiración diafragmática 4·6·4·6', 'Inhala 4, mantén 6, exhala 4, mantén 6. Manos en las costillas: siente que se expanden de adentro hacia afuera.', 'Breathing', null, 1, '3-5 min', null, false, 0, null, 12),
  -- ------------------------------------------------------- semanas 7-8 ---
  ('w78', 'Assault bike o cuerda', 'Ritmo suave, solo para subir pulsaciones.', 'Warm up', null, 1, '3 min', null, false, 0, 'assault-bike', 1),
  ('w78', 'Serie dinámica: cadera, T-spine y hombros', 'Termina con activación de glúteo y escápula.', 'Warm up', null, 1, '6-8 min', null, false, 0, null, 2),
  ('w78', 'Round híbrido: 45 s sprint + 45 s drill', 'Alterna 45 s de sprint en assault bike con 45 s de drill fuerte hasta completar 5 min. Drills: ground and pound al saco, clinch wall drill, medball slam, sprawls, combinaciones de 2, trabajo con dos compañeros de sparring con objetivos distintos. 1 min de descanso entre rounds: toma las pelotas de tenis. Objetivo: simular campeonato. Total 25 min.', 'Conditioning', null, 5, '5 min', 'Fatiga extrema', false, 60, 'assault-bike', 3),
  ('w78', 'Pelota de tenis: rectos sin que caiga', 'Lanza rectos con la pelota de tenis sin que toque el suelo. 20 s de descanso entre series.', 'Conditioning', null, 3, '1 min', null, false, 20, null, 4),
  ('w78', 'Respiración diafragmática 4·6·4·6', 'Inhala 4, mantén 6, exhala 4, mantén 6. Manos en las costillas: siente que se expanden de adentro hacia afuera.', 'Breathing', null, 1, '3-5 min', null, false, 0, null, 5)
) as e(tpl, name, description, block_name, superset_group, sets, reps, intensity, per_side, rest_seconds, animation_slug, sort_order)
where p.slug = 'camp-8-semanas-striker'
  and e.tpl = case
                when w.week_number <= 4 then 'w' || w.week_number
                when w.week_number in (5, 6) then 'w56'
                else 'w78'
              end
  and not exists (select 1 from public.exercises ex where ex.workout_id = w.id and ex.name = e.name);

insert into public.videos (title, description, category, level, video_url, duration_seconds, is_free_preview, sort_order)
select v.title, v.description, v.category, v.level, v.video_url, v.duration_seconds, v.is_free_preview, v.sort_order
from (values
  ('Cómo respirar durante el esfuerzo', 'Bracing y respiración para levantar con seguridad y recuperar entre rounds.', 'respiración', 'todos', 'https://www.youtube.com/watch?v=2pLT-olgUJs', 480, true, 1),
  ('Calentamiento articular de 8 min', 'Serie dinámica de cadera, columna torácica y hombros para empezar cualquier sesión.', 'movilidad', 'todos', 'https://www.youtube.com/watch?v=3sTf3JCTGKw', 510, true, 2)
) as v(title, description, category, level, video_url, duration_seconds, is_free_preview, sort_order)
where not exists (select 1 from public.videos existing where existing.title = v.title);

-- =============================================================================
-- FIN. Ahora ejecuta seeds/exercise_library_seed.sql (los 302 ejercicios).
--
-- Y si el coach ya se había registrado con otro correo, hazlo admin:
--   update public.profiles set role = 'admin' where email = 'su-correo@ejemplo.com';
-- =============================================================================
