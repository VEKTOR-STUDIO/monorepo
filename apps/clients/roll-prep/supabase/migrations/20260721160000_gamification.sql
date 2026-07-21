-- ============================================================================
-- RollPrep — Migración: Gamificación + Comentarios + Calendario
-- Ejecutar en el SQL Editor de Supabase (o via `supabase db push`).
--
-- Agrega:
--   1. assignments.scheduled_for  → fecha de la clase (para el calendario)
--   2. point_events               → historial de puntos (XP) por alumno
--   3. assignment_comments        → comentarios/preguntas por clase
--   4. Triggers que otorgan puntos automáticamente:
--        - signup                +20  (al crearse el perfil)
--        - profile_completed     +25  (al completar el nombre, una sola vez)
--        - assignment_completed  +50  (al marcar "Visto y Estudiado")
--        - poll_voted            +10  (al votar; cambiar el voto no suma)
--        - comment_posted        +5   (primer comentario en cada clase)
--   5. Vista leaderboard          → ranking de alumnos por puntos
--   6. Backfill retroactivo de puntos para datos existentes
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. ASSIGNMENTS: fecha de la clase (calendario)
-- ----------------------------------------------------------------------------
alter table public.assignments
  add column if not exists scheduled_for date;

-- Backfill: la fecha de la clase = día en que se publicó (hora de Caracas).
update public.assignments
set scheduled_for = (created_at at time zone 'America/Caracas')::date
where scheduled_for is null;

alter table public.assignments
  alter column scheduled_for set default ((now() at time zone 'America/Caracas')::date);

alter table public.assignments
  alter column scheduled_for set not null;

create index if not exists assignments_scheduled_idx
  on public.assignments (scheduled_for desc);

-- ----------------------------------------------------------------------------
-- 2. POINT_EVENTS: historial de puntos (XP)
-- ----------------------------------------------------------------------------
create table if not exists public.point_events (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles (id) on delete cascade,
  kind text not null check (
    kind in (
      'signup',
      'profile_completed',
      'assignment_completed',
      'poll_voted',
      'comment_posted'
    )
  ),
  points integer not null check (points > 0),
  -- Referencia opcional al recurso que generó los puntos
  -- (assignment_id, poll_id, etc.). Evita duplicados junto con el kind.
  ref_id uuid,
  created_at timestamptz not null default now()
);

-- Un evento por (alumno, tipo, recurso): no se puede farmear la misma clase.
create unique index if not exists point_events_unique_ref_idx
  on public.point_events (student_id, kind, ref_id)
  where ref_id is not null;

-- Eventos únicos de por vida (signup, profile_completed).
create unique index if not exists point_events_unique_lifetime_idx
  on public.point_events (student_id, kind)
  where ref_id is null;

create index if not exists point_events_student_idx
  on public.point_events (student_id, created_at desc);

alter table public.point_events enable row level security;

-- Cada alumno lee su propio historial; el profesor lee todo.
-- Nadie inserta directamente: los puntos solo los otorgan los triggers
-- (security definer), así ningún alumno puede regalarse XP.
drop policy if exists "point_events_select" on public.point_events;
create policy "point_events_select" on public.point_events
  for select to authenticated
  using (student_id = auth.uid() or public.is_admin());

-- ----------------------------------------------------------------------------
-- 3. Función central para otorgar puntos (idempotente)
-- ----------------------------------------------------------------------------
create or replace function public.award_points(
  p_student_id uuid,
  p_kind text,
  p_points integer,
  p_ref_id uuid default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.point_events (student_id, kind, points, ref_id)
  values (p_student_id, p_kind, p_points, p_ref_id)
  on conflict do nothing;
end;
$$;

-- ----------------------------------------------------------------------------
-- 4. ASSIGNMENT_COMMENTS: comentarios / preguntas por clase
-- ----------------------------------------------------------------------------
create table if not exists public.assignment_comments (
  id uuid primary key default gen_random_uuid(),
  assignment_id uuid not null references public.assignments (id) on delete cascade,
  student_id uuid not null references public.profiles (id) on delete cascade,
  body text not null check (char_length(btrim(body)) between 1 and 1000),
  created_at timestamptz not null default now()
);

create index if not exists assignment_comments_assignment_idx
  on public.assignment_comments (assignment_id, created_at asc);

alter table public.assignment_comments enable row level security;

-- Todos los autenticados leen los comentarios (es la conversación del gym).
drop policy if exists "comments_select" on public.assignment_comments;
create policy "comments_select" on public.assignment_comments
  for select to authenticated using (true);

-- Cada uno comenta a su nombre.
drop policy if exists "comments_insert_own" on public.assignment_comments;
create policy "comments_insert_own" on public.assignment_comments
  for insert to authenticated
  with check (student_id = auth.uid());

-- Borra el autor o el profesor (moderación).
drop policy if exists "comments_delete" on public.assignment_comments;
create policy "comments_delete" on public.assignment_comments
  for delete to authenticated
  using (student_id = auth.uid() or public.is_admin());

-- ----------------------------------------------------------------------------
-- 5. TRIGGERS que otorgan puntos
-- ----------------------------------------------------------------------------

-- +50 por marcar "Visto y Estudiado" (una vez por clase, garantizado por PK).
create or replace function public.on_completion_award_points()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  perform public.award_points(new.student_id, 'assignment_completed', 50, new.assignment_id);
  return new;
end;
$$;

drop trigger if exists completion_award_points on public.assignment_completions;
create trigger completion_award_points
  after insert on public.assignment_completions
  for each row execute function public.on_completion_award_points();

-- +10 por votar. Solo en INSERT: cambiar el voto (UPDATE del upsert) no suma.
create or replace function public.on_vote_award_points()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  perform public.award_points(new.student_id, 'poll_voted', 10, new.poll_id);
  return new;
end;
$$;

drop trigger if exists vote_award_points on public.poll_votes;
create trigger vote_award_points
  after insert on public.poll_votes
  for each row execute function public.on_vote_award_points();

-- +5 por el PRIMER comentario en cada clase (ref = assignment_id, así el
-- índice único bloquea puntos por comentarios repetidos en la misma clase).
create or replace function public.on_comment_award_points()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  perform public.award_points(new.student_id, 'comment_posted', 5, new.assignment_id);
  return new;
end;
$$;

drop trigger if exists comment_award_points on public.assignment_comments;
create trigger comment_award_points
  after insert on public.assignment_comments
  for each row execute function public.on_comment_award_points();

-- +20 por registrarse (al crearse el perfil).
create or replace function public.on_profile_created_award_points()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  perform public.award_points(new.id, 'signup', 20, null);
  return new;
end;
$$;

drop trigger if exists profile_created_award_points on public.profiles;
create trigger profile_created_award_points
  after insert on public.profiles
  for each row execute function public.on_profile_created_award_points();

-- +25 por completar el perfil (cambiar el nombre a algo propio, una vez).
create or replace function public.on_profile_updated_award_points()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.full_name is distinct from old.full_name
     and new.full_name is not null
     and char_length(btrim(new.full_name)) > 0 then
    perform public.award_points(new.id, 'profile_completed', 25, null);
  end if;
  return new;
end;
$$;

drop trigger if exists profile_updated_award_points on public.profiles;
create trigger profile_updated_award_points
  after update on public.profiles
  for each row execute function public.on_profile_updated_award_points();

-- ----------------------------------------------------------------------------
-- 6. LEADERBOARD (ranking del gym)
-- La vista corre con permisos del owner (bypassa RLS de point_events) a
-- propósito: los alumnos deben ver los TOTALES de todos para el ranking,
-- pero no el historial detallado ajeno.
-- ----------------------------------------------------------------------------
create or replace view public.leaderboard as
select
  p.id as student_id,
  p.full_name,
  coalesce(sum(e.points), 0)::integer as total_points,
  count(e.id) filter (where e.kind = 'assignment_completed')::integer as classes_completed,
  max(e.created_at) as last_activity_at
from public.profiles p
left join public.point_events e on e.student_id = p.id
where p.role = 'student'
group by p.id, p.full_name;

grant select on public.leaderboard to authenticated;

-- ----------------------------------------------------------------------------
-- 7. BACKFILL retroactivo (idempotente gracias a award_points)
-- ----------------------------------------------------------------------------

-- Registro: todos los perfiles existentes.
insert into public.point_events (student_id, kind, points, ref_id, created_at)
select id, 'signup', 20, null, created_at
from public.profiles
on conflict do nothing;

-- Clases ya completadas.
insert into public.point_events (student_id, kind, points, ref_id, created_at)
select student_id, 'assignment_completed', 50, assignment_id, completed_at
from public.assignment_completions
on conflict do nothing;

-- Votos ya emitidos.
insert into public.point_events (student_id, kind, points, ref_id, created_at)
select student_id, 'poll_voted', 10, poll_id, created_at
from public.poll_votes
on conflict do nothing;
