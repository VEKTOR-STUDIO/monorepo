-- ============================================================================
-- RollPrep — Migración: ACADEMIAS + gestión de usuarios desde el panel
-- Ejecutar en el SQL Editor de Supabase (o via `supabase db push`).
-- Es idempotente: se puede correr varias veces.
--
-- Qué agrega:
--   1. academies                → las academias del circuito. Arranca con
--                                 Slam MMA y Élite Jiu-Jitsu; para sumar otra
--                                 basta un insert (no hace falta migración).
--   2. profiles.academy_id      → a qué academia pertenece cada alumno.
--                                 Nulo = todavía sin academia.
--   3. Políticas para que el profesor pueda editar y borrar perfiles
--      (nombre, rol y academia de cualquier alumno desde el panel).
--   4. Cascadas al borrar una cuenta: borrar el usuario de auth arrastra su
--      perfil, sus clases marcadas y sus votos (antes reventaba por FK).
--   5. leaderboard              → ahora arrastra la academia del alumno, para
--                                 pintarla en el ranking.
--   6. admin_users              → vista SOLO para el profesor: todos los
--                                 usuarios con su correo, rol, academia y XP.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. ACADEMIAS
--    El color es el de su chapa en el ranking y en los perfiles.
-- ----------------------------------------------------------------------------
create table if not exists public.academies (
  id uuid primary key default gen_random_uuid(),
  name text not null unique check (char_length(btrim(name)) between 1 and 60),
  slug text not null unique check (slug ~ '^[a-z0-9-]+$'),
  color text not null default '#ef4444',
  created_at timestamptz not null default now()
);

insert into public.academies (name, slug, color)
values
  ('Slam MMA', 'slam-mma', '#ef4444'),
  ('Élite Jiu-Jitsu', 'elite-jiu-jitsu', '#2563eb')
on conflict (slug) do nothing;

alter table public.academies enable row level security;

grant select, insert, update, delete on public.academies to authenticated;

-- Todo el gym ve las academias (salen en el ranking y en los perfiles).
drop policy if exists "academies_select" on public.academies;
create policy "academies_select" on public.academies
  for select to authenticated using (true);

-- Crear / renombrar / borrar academias: solo el profesor.
drop policy if exists "academies_write_admin" on public.academies;
create policy "academies_write_admin" on public.academies
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ----------------------------------------------------------------------------
-- 2. PROFILES: a qué academia pertenece el alumno
--    Si se borra la academia, sus alumnos quedan sin academia (no se borran).
-- ----------------------------------------------------------------------------
alter table public.profiles
  add column if not exists academy_id uuid
  references public.academies (id) on delete set null;

create index if not exists profiles_academy_idx
  on public.profiles (academy_id);

-- ----------------------------------------------------------------------------
-- 3. EL PROFESOR GESTIONA A LOS ALUMNOS
--    Políticas aditivas: la del alumno sobre su propio perfil sigue igual.
--    Cambiar roles ya lo vigila el trigger protect_profile_role.
-- ----------------------------------------------------------------------------
drop policy if exists "profiles_update_admin" on public.profiles;
create policy "profiles_update_admin" on public.profiles
  for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "profiles_delete_admin" on public.profiles;
create policy "profiles_delete_admin" on public.profiles
  for delete to authenticated
  using (public.is_admin());

-- ----------------------------------------------------------------------------
-- 4. BORRAR UNA CUENTA NO DEBE REVENTAR POR CLAVES FORÁNEAS
--    Al eliminar el usuario de auth se va su perfil, y con el perfil se van
--    sus clases marcadas y sus votos. El XP y los comentarios ya cascadeaban
--    desde la migración de gamificación; los topes los limpia el trigger
--    profile_deleted_clean_tournaments.
-- ----------------------------------------------------------------------------
alter table public.profiles
  drop constraint if exists profiles_id_fkey;
alter table public.profiles
  add constraint profiles_id_fkey
  foreign key (id) references auth.users (id) on delete cascade;

alter table public.assignment_completions
  drop constraint if exists assignment_completions_student_id_fkey;
alter table public.assignment_completions
  add constraint assignment_completions_student_id_fkey
  foreign key (student_id) references public.profiles (id) on delete cascade;

alter table public.poll_votes
  drop constraint if exists poll_votes_student_id_fkey;
alter table public.poll_votes
  add constraint poll_votes_student_id_fkey
  foreign key (student_id) references public.profiles (id) on delete cascade;

-- ----------------------------------------------------------------------------
-- 5. LEADERBOARD con academia
--    Misma vista de siempre (corre con permisos del owner a propósito: los
--    totales son públicos, el historial detallado no), ahora con la chapa de
--    la academia de cada alumno.
-- ----------------------------------------------------------------------------
drop view if exists public.leaderboard;

create view public.leaderboard as
select
  p.id as student_id,
  p.full_name,
  coalesce(sum(e.points), 0)::integer as total_points,
  count(e.id) filter (where e.kind = 'assignment_completed')::integer as classes_completed,
  max(e.created_at) as last_activity_at,
  a.id as academy_id,
  a.name as academy_name,
  a.slug as academy_slug,
  a.color as academy_color
from public.profiles p
left join public.point_events e on e.student_id = p.id
left join public.academies a on a.id = p.academy_id
where p.role = 'student'
group by p.id, p.full_name, a.id, a.name, a.slug, a.color;

grant select on public.leaderboard to authenticated;

-- ----------------------------------------------------------------------------
-- 6. ADMIN_USERS: la lista completa del panel del profesor
--    Incluye el correo (vive en auth.users, fuera del alcance de un alumno)
--    y a los admins, que el leaderboard deja fuera. El `where is_admin()`
--    es el candado: para un alumno la vista devuelve cero filas.
-- ----------------------------------------------------------------------------
drop view if exists public.admin_users;

create view public.admin_users as
select
  p.id,
  u.email,
  p.full_name,
  p.role,
  p.created_at,
  u.last_sign_in_at,
  a.id as academy_id,
  a.name as academy_name,
  a.slug as academy_slug,
  a.color as academy_color,
  coalesce(sum(e.points), 0)::integer as total_points,
  count(e.id) filter (where e.kind = 'assignment_completed')::integer as classes_completed
from public.profiles p
join auth.users u on u.id = p.id
left join public.academies a on a.id = p.academy_id
left join public.point_events e on e.student_id = p.id
where public.is_admin()
group by
  p.id, u.email, p.full_name, p.role, p.created_at, u.last_sign_in_at,
  a.id, a.name, a.slug, a.color;

grant select on public.admin_users to authenticated;

-- PostgREST se entera de las tablas y columnas nuevas de una vez.
notify pgrst, 'reload schema';

-- ============================================================================
-- Listo. Después de correr esto:
--   · /dashboard/admin/usuarios lista a todo el mundo: nombre, correo, rol,
--     academia y XP. El profesor edita cualquiera de esos campos y puede
--     eliminar cuentas.
--   · Cada alumno elige su academia desde /dashboard/perfil.
--   · La academia sale como chapa en el ranking y en el HUD del perfil.
--
-- ¿Sumar una academia nueva? Una línea:
--   insert into public.academies (name, slug, color)
--   values ('Nombre', 'nombre-en-slug', '#22c55e');
-- ============================================================================
