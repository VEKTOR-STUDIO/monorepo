-- ============================================================================
-- RollPrep — Esquema de base de datos (Supabase / Postgres)
-- App de gestión de alumnos para clase de Jiu-Jitsu Brasileño.
-- Ejecutar en el SQL Editor de Supabase (o via `supabase db push`).
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. PROFILES
-- Perfil de cada usuario. Se crea automáticamente al registrarse (trigger).
-- ----------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role text not null default 'student' check (role in ('admin', 'student')),
  full_name text,
  created_at timestamptz not null default now()
);

-- Helper: ¿el usuario autenticado es admin (profesor)?
-- SECURITY DEFINER para evitar recursión en las políticas de RLS sobre profiles.
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- Trigger: crear el perfil al registrarse un usuario nuevo.
-- El correo del profesor se promueve a admin automáticamente.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.email),
    case
      when lower(new.email) = 'sniperaless117@gmail.com' then 'admin'
      else 'student'
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

-- Trigger: impedir que un alumno se auto-promueva a admin.
-- auth.uid() null = contexto sin usuario (SQL Editor / service role): permitido.
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
    raise exception 'Solo el profesor puede cambiar roles';
  end if;
  return new;
end;
$$;

drop trigger if exists on_profile_role_change on public.profiles;
create trigger on_profile_role_change
  before update on public.profiles
  for each row execute function public.protect_profile_role();

-- ----------------------------------------------------------------------------
-- 2. ASSIGNMENTS (tareas preparatorias con video)
-- ----------------------------------------------------------------------------
create table if not exists public.assignments (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  video_url text not null,
  notes text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists assignments_active_idx
  on public.assignments (is_active, created_at desc);

-- ----------------------------------------------------------------------------
-- 3. ASSIGNMENT_COMPLETIONS ("Visto y Estudiado")
-- ----------------------------------------------------------------------------
create table if not exists public.assignment_completions (
  assignment_id uuid not null references public.assignments (id) on delete cascade,
  student_id uuid not null references public.profiles (id) on delete cascade,
  completed_at timestamptz not null default now(),
  primary key (assignment_id, student_id)
);

-- ----------------------------------------------------------------------------
-- 4. POLLS (votación del fin de semana)
-- ----------------------------------------------------------------------------
create table if not exists public.polls (
  id uuid primary key default gen_random_uuid(),
  question text not null default '¿Qué estudiamos en la próxima clase?',
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists polls_active_idx
  on public.polls (is_active, created_at desc);

create table if not exists public.poll_options (
  id uuid primary key default gen_random_uuid(),
  poll_id uuid not null references public.polls (id) on delete cascade,
  title text not null,
  description text
);

create index if not exists poll_options_poll_idx on public.poll_options (poll_id);

create table if not exists public.poll_votes (
  poll_id uuid not null references public.polls (id) on delete cascade,
  option_id uuid not null references public.poll_options (id) on delete cascade,
  student_id uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  -- Un voto por alumno por encuesta (puede cambiarlo via upsert).
  primary key (poll_id, student_id)
);

-- ----------------------------------------------------------------------------
-- 5. ROW LEVEL SECURITY
-- ----------------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.assignments enable row level security;
alter table public.assignment_completions enable row level security;
alter table public.polls enable row level security;
alter table public.poll_options enable row level security;
alter table public.poll_votes enable row level security;

-- PROFILES: todos los usuarios autenticados pueden leer (el profesor necesita
-- los nombres; los alumnos ven el roster del gym). Cada uno edita su perfil.
drop policy if exists "profiles_select" on public.profiles;
create policy "profiles_select" on public.profiles
  for select to authenticated using (true);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update to authenticated
  using (id = auth.uid() or public.is_admin())
  with check (id = auth.uid() or public.is_admin());

-- ASSIGNMENTS: lectura para todos los autenticados; escritura solo profesor.
drop policy if exists "assignments_select" on public.assignments;
create policy "assignments_select" on public.assignments
  for select to authenticated using (true);

drop policy if exists "assignments_admin_write" on public.assignments;
create policy "assignments_admin_write" on public.assignments
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ASSIGNMENT_COMPLETIONS: el alumno registra y ve lo suyo; el profesor ve todo.
drop policy if exists "completions_select" on public.assignment_completions;
create policy "completions_select" on public.assignment_completions
  for select to authenticated
  using (student_id = auth.uid() or public.is_admin());

drop policy if exists "completions_insert_own" on public.assignment_completions;
create policy "completions_insert_own" on public.assignment_completions
  for insert to authenticated
  with check (
    student_id = auth.uid()
    -- Solo se puede completar la tarea activa.
    and exists (
      select 1 from public.assignments a
      where a.id = assignment_id and a.is_active
    )
  );

-- POLLS y POLL_OPTIONS: lectura autenticados; escritura solo profesor.
drop policy if exists "polls_select" on public.polls;
create policy "polls_select" on public.polls
  for select to authenticated using (true);

drop policy if exists "polls_admin_write" on public.polls;
create policy "polls_admin_write" on public.polls
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "poll_options_select" on public.poll_options;
create policy "poll_options_select" on public.poll_options
  for select to authenticated using (true);

drop policy if exists "poll_options_admin_write" on public.poll_options;
create policy "poll_options_admin_write" on public.poll_options
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- POLL_VOTES: el alumno vota (y puede cambiar su voto) en la encuesta activa;
-- ve su propio voto. El profesor ve todos los votos.
drop policy if exists "votes_select" on public.poll_votes;
create policy "votes_select" on public.poll_votes
  for select to authenticated
  using (student_id = auth.uid() or public.is_admin());

drop policy if exists "votes_insert_own" on public.poll_votes;
create policy "votes_insert_own" on public.poll_votes
  for insert to authenticated
  with check (
    student_id = auth.uid()
    and exists (select 1 from public.polls p where p.id = poll_id and p.is_active)
    and exists (
      select 1 from public.poll_options o
      where o.id = option_id and o.poll_id = poll_votes.poll_id
    )
  );

drop policy if exists "votes_update_own" on public.poll_votes;
create policy "votes_update_own" on public.poll_votes
  for update to authenticated
  using (student_id = auth.uid())
  with check (
    student_id = auth.uid()
    and exists (select 1 from public.polls p where p.id = poll_id and p.is_active)
    and exists (
      select 1 from public.poll_options o
      where o.id = option_id and o.poll_id = poll_votes.poll_id
    )
  );

-- ----------------------------------------------------------------------------
-- 6. REALTIME (métricas en vivo en el panel del profesor)
-- ----------------------------------------------------------------------------
alter publication supabase_realtime add table public.poll_votes;
alter publication supabase_realtime add table public.assignment_completions;

-- ----------------------------------------------------------------------------
-- 7. ADMIN
-- El correo sniperaless117@gmail.com se promueve a admin automáticamente al
-- registrarse (ver handle_new_user). Si ya se había registrado antes de
-- aplicar este esquema, ejecuta:
update public.profiles p
set role = 'admin'
from auth.users u
where u.id = p.id and lower(u.email) = 'sniperaless117@gmail.com';
-- ----------------------------------------------------------------------------
