-- ============================================================================
-- RollPrep — Migración: Torneos internos (topes de clase)
-- Ejecutar en el SQL Editor de Supabase (o via `supabase db push`).
--
-- Agrega:
--   1. tournaments               → el tope (título, estado, fecha)
--   2. tournament_participants   → quiénes pelean (con su seed del sorteo)
--   3. tournament_matches        → el bracket de eliminación simple
--   4. Nuevos tipos de puntos:
--        - tournament_participation  +15  (pelear en un tope)
--        - tournament_finalist       +50  (perder la final)
--        - tournament_champion      +100  (ganar el tope)
--   5. Triggers que otorgan/retiran los puntos al completar/reabrir/borrar
--      un torneo (idempotentes gracias a award_points).
--
-- Reglas de acceso: todos los alumnos VEN los brackets; solo el profesor
-- (admin) crea, sortea, carga resultados o borra.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. TOURNAMENTS
-- ----------------------------------------------------------------------------
create table if not exists public.tournaments (
  id uuid primary key default gen_random_uuid(),
  title text not null default 'Tope interno'
    check (char_length(btrim(title)) between 1 and 80),
  status text not null default 'active'
    check (status in ('active', 'completed')),
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

alter table public.tournaments enable row level security;

drop policy if exists "tournaments_select" on public.tournaments;
create policy "tournaments_select" on public.tournaments
  for select to authenticated using (true);

drop policy if exists "tournaments_admin_write" on public.tournaments;
create policy "tournaments_admin_write" on public.tournaments
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ----------------------------------------------------------------------------
-- 2. TOURNAMENT_PARTICIPANTS
-- ----------------------------------------------------------------------------
create table if not exists public.tournament_participants (
  tournament_id uuid not null references public.tournaments (id) on delete cascade,
  student_id uuid not null references public.profiles (id) on delete cascade,
  -- Posición que le tocó en el sorteo (1..N). Cambia con cada re-sorteo.
  seed integer not null check (seed >= 1),
  primary key (tournament_id, student_id)
);

alter table public.tournament_participants enable row level security;

drop policy if exists "tournament_participants_select" on public.tournament_participants;
create policy "tournament_participants_select" on public.tournament_participants
  for select to authenticated using (true);

drop policy if exists "tournament_participants_admin_write" on public.tournament_participants;
create policy "tournament_participants_admin_write" on public.tournament_participants
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ----------------------------------------------------------------------------
-- 3. TOURNAMENT_MATCHES (eliminación simple)
--    El ganador de (round r, slot s) avanza a (round r+1, slot s/2):
--    como student1 si s es par, como student2 si s es impar.
--    Una pelea con un solo peleador es un BYE (pase directo, method null).
-- ----------------------------------------------------------------------------
create table if not exists public.tournament_matches (
  id uuid primary key default gen_random_uuid(),
  tournament_id uuid not null references public.tournaments (id) on delete cascade,
  round integer not null check (round >= 1),
  slot integer not null check (slot >= 0),
  student1_id uuid references public.profiles (id) on delete set null,
  student2_id uuid references public.profiles (id) on delete set null,
  winner_id uuid references public.profiles (id) on delete set null,
  -- Cómo terminó la pelea (null = sin resultado o pase directo).
  method text check (
    method in ('submission', 'points', 'decision', 'dq', 'walkover')
  ),
  decided_at timestamptz,
  unique (tournament_id, round, slot)
);

create index if not exists tournament_matches_tournament_idx
  on public.tournament_matches (tournament_id, round, slot);

alter table public.tournament_matches enable row level security;

drop policy if exists "tournament_matches_select" on public.tournament_matches;
create policy "tournament_matches_select" on public.tournament_matches
  for select to authenticated using (true);

drop policy if exists "tournament_matches_admin_write" on public.tournament_matches;
create policy "tournament_matches_admin_write" on public.tournament_matches
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ----------------------------------------------------------------------------
-- 4. Nuevos tipos de puntos en point_events
-- ----------------------------------------------------------------------------
alter table public.point_events drop constraint if exists point_events_kind_check;
alter table public.point_events add constraint point_events_kind_check check (
  kind in (
    'signup',
    'profile_completed',
    'assignment_completed',
    'poll_voted',
    'comment_posted',
    'tournament_participation',
    'tournament_finalist',
    'tournament_champion'
  )
);

-- ----------------------------------------------------------------------------
-- 5. TRIGGERS de puntos del torneo
--    Al pasar a 'completed': +15 a cada participante, +100 al campeón y
--    +50 al otro finalista (ref_id = tournament_id, así son idempotentes).
--    Al reabrir ('completed' → 'active') o borrar el torneo, se retiran.
-- ----------------------------------------------------------------------------
create or replace function public.on_tournament_status_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_final record;
  v_runner_up uuid;
  v_participant record;
begin
  if new.status = 'completed' and old.status is distinct from 'completed' then
    for v_participant in
      select student_id from public.tournament_participants
      where tournament_id = new.id
    loop
      perform public.award_points(
        v_participant.student_id, 'tournament_participation', 15, new.id
      );
    end loop;

    select * into v_final
    from public.tournament_matches
    where tournament_id = new.id
    order by round desc, slot asc
    limit 1;

    if v_final.winner_id is not null then
      perform public.award_points(v_final.winner_id, 'tournament_champion', 100, new.id);

      v_runner_up := case
        when v_final.student1_id = v_final.winner_id then v_final.student2_id
        else v_final.student1_id
      end;

      if v_runner_up is not null then
        perform public.award_points(v_runner_up, 'tournament_finalist', 50, new.id);
      end if;
    end if;
  elsif old.status = 'completed' and new.status <> 'completed' then
    delete from public.point_events
    where ref_id = old.id
      and kind in (
        'tournament_participation',
        'tournament_finalist',
        'tournament_champion'
      );
  end if;

  return new;
end;
$$;

drop trigger if exists tournament_status_change on public.tournaments;
create trigger tournament_status_change
  after update on public.tournaments
  for each row execute function public.on_tournament_status_change();

-- Si el torneo se borra (era de prueba), sus puntos se van con él.
create or replace function public.on_tournament_deleted()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  delete from public.point_events
  where ref_id = old.id
    and kind in (
      'tournament_participation',
      'tournament_finalist',
      'tournament_champion'
    );
  return old;
end;
$$;

drop trigger if exists tournament_deleted on public.tournaments;
create trigger tournament_deleted
  after delete on public.tournaments
  for each row execute function public.on_tournament_deleted();
