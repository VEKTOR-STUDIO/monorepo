-- ============================================================================
-- RollPrep — Migración: TORNEO CAOS
-- Ejecutar en el SQL Editor de Supabase (o via `supabase db push`).
--
-- Agrega una segunda modalidad de torneo. El bracket, los participantes y
-- los puntos de participación/finalista/campeón son EXACTAMENTE los mismos
-- que en el torneo clásico: lo único nuevo es que cada pelea se "rolea" y
-- saca modificadores aleatorios.
--
-- Qué agrega:
--   1. tournaments.mode              → 'classic' | 'caos'
--      tournaments.outfit            → 'nogi' | 'gi' (qué mazo se juega)
--   2. tournament_match_rolls        → el roll de cada pelea (terreno + duelo
--                                      + el peso que cargó cada peleador)
--   3. Nuevos tipos de puntos:
--        - caos_upset    +10 XP por cada punto de diferencia de peso
--                        (20 / 40 / 60) para el que gana DESDE la desventaja
--        - caos_finish   +20 XP para el que gana por sumisión en el CAOS
--   4. Triggers que reparten/retiran esos puntos al cargar o corregir el
--      resultado de una pelea, y que limpian el roll si la pelea se
--      desarma (cuando el profesor corrige la ronda anterior).
--
-- Idea del balance: la carta que te toca NO se compensa cambiando la regla,
-- se compensa con el premio. El que carga la desventaja cobra si gana; el
-- que tiene la ventaja solo cobra extra si FINALIZA (así no se guinda de la
-- ventaja a estancar la pelea). Los dos tienen algo que buscar.
--
-- Reglas de acceso: iguales al torneo clásico. Todos VEN los rolls; solo el
-- profesor (admin) rolea, re-rolea o carga resultados.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. MODALIDAD Y RULESET DEL TORNEO
--    Los torneos que ya existen quedan en 'classic' sin tocar nada.
--
--    `outfit` define qué mazo de cartas se juega: con kimono entran las de
--    solapa y cinturón, sin kimono entran las de piernas y control de
--    cuerpo. La mayoría de las cartas sirven para los dos. El default es
--    'nogi' porque es lo que se entrena a diario en el gym.
-- ----------------------------------------------------------------------------
alter table public.tournaments
  add column if not exists mode text not null default 'classic';

alter table public.tournaments drop constraint if exists tournaments_mode_check;
alter table public.tournaments add constraint tournaments_mode_check
  check (mode in ('classic', 'caos'));

alter table public.tournaments
  add column if not exists outfit text not null default 'nogi';

alter table public.tournaments drop constraint if exists tournaments_outfit_check;
alter table public.tournaments add constraint tournaments_outfit_check
  check (outfit in ('nogi', 'gi'));

-- ----------------------------------------------------------------------------
-- 2. TOURNAMENT_MATCH_ROLLS
--    Una fila por pelea roleada (por eso match_id es la PK: un solo roll por
--    pelea). Si el profesor re-rolea, se sobrescribe la fila.
--
--    Las claves de terreno y duelo viven en el mazo de libs/caos.js; aquí
--    solo se guarda la referencia. Lo único que la base necesita entender
--    es el PESO: positivo = ventaja (alfa), negativo = carga (omega),
--    cero = duelo neutro. Con eso reparte el XP sin saber nada del mazo.
-- ----------------------------------------------------------------------------
create table if not exists public.tournament_match_rolls (
  match_id uuid primary key
    references public.tournament_matches (id) on delete cascade,
  tournament_id uuid not null
    references public.tournaments (id) on delete cascade,
  -- Nivel de locura del duelo: 0 neutro, 1 leve, 2 serio, 3 brutal.
  tier smallint not null check (tier between 0 and 3),
  terrain_key text not null check (char_length(btrim(terrain_key)) between 1 and 60),
  duel_key text not null check (char_length(btrim(duel_key)) between 1 and 60),
  student1_weight smallint not null check (student1_weight between -3 and 3),
  student2_weight smallint not null check (student2_weight between -3 and 3),
  rolled_at timestamptz not null default now(),
  rolled_by uuid references public.profiles (id) on delete set null
);

create index if not exists tournament_match_rolls_tournament_idx
  on public.tournament_match_rolls (tournament_id);

alter table public.tournament_match_rolls enable row level security;

drop policy if exists "tournament_match_rolls_select" on public.tournament_match_rolls;
create policy "tournament_match_rolls_select" on public.tournament_match_rolls
  for select to authenticated using (true);

drop policy if exists "tournament_match_rolls_admin_write" on public.tournament_match_rolls;
create policy "tournament_match_rolls_admin_write" on public.tournament_match_rolls
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ----------------------------------------------------------------------------
-- 3. Nuevos tipos de puntos en point_events
--    (se re-declara la lista completa, incluyendo los que ya existían)
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
    'tournament_champion',
    'caos_upset',
    'caos_finish'
  )
);

-- ----------------------------------------------------------------------------
-- 4. PUNTOS DEL CAOS, pelea por pelea
--
--    A diferencia del torneo clásico (que reparte todo al final), aquí el
--    bonus cae apenas se carga el resultado: el alumno lo ve al instante.
--    ref_id = id de la pelea ⇒ idempotente y fácil de retirar.
--
--    - caos_upset:  el ganador cargaba MÁS peso negativo que el perdedor.
--                   10 XP por cada punto de diferencia (20 / 40 / 60).
--                   En los duelos neutros la diferencia es 0: no paga.
--    - caos_finish: el ganador terminó por sumisión, venga del lado que
--                   venga. Es el único XP extra que puede cobrar el que
--                   arrancó con ventaja.
-- ----------------------------------------------------------------------------
create or replace function public.on_caos_match_decided()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_mode text;
  v_roll record;
  v_winner_weight smallint;
  v_loser_weight smallint;
  v_spread integer;
begin
  -- Se corrigió el resultado: retirar cualquier bonus de esta pelea.
  if new.winner_id is null and old.winner_id is not null then
    delete from public.point_events
    where ref_id = new.id
      and kind in ('caos_upset', 'caos_finish');
    return new;
  end if;

  -- Solo nos interesa el momento en que la pelea queda decidida.
  if new.winner_id is null or new.winner_id is not distinct from old.winner_id then
    return new;
  end if;

  select mode into v_mode
  from public.tournaments
  where id = new.tournament_id;

  if v_mode is distinct from 'caos' then
    return new;
  end if;

  -- Un pase directo (bye) no paga bonus: no hubo pelea.
  if new.student1_id is null or new.student2_id is null then
    return new;
  end if;

  select * into v_roll
  from public.tournament_match_rolls
  where match_id = new.id;

  -- Sin roll no hay CAOS que premiar (el profesor la peleó a la clásica).
  if not found then
    return new;
  end if;

  if new.winner_id = new.student1_id then
    v_winner_weight := v_roll.student1_weight;
    v_loser_weight := v_roll.student2_weight;
  else
    v_winner_weight := v_roll.student2_weight;
    v_loser_weight := v_roll.student1_weight;
  end if;

  -- Positivo = el ganador venía cargando la desventaja.
  v_spread := v_loser_weight - v_winner_weight;

  if v_spread > 0 then
    perform public.award_points(
      new.winner_id, 'caos_upset', v_spread * 10, new.id
    );
  end if;

  if new.method = 'submission' then
    perform public.award_points(new.winner_id, 'caos_finish', 20, new.id);
  end if;

  return new;
end;
$$;

drop trigger if exists caos_match_decided on public.tournament_matches;
create trigger caos_match_decided
  after update on public.tournament_matches
  for each row execute function public.on_caos_match_decided();

-- ----------------------------------------------------------------------------
-- 5. LIMPIEZA
--
--    a) Si la pelea se borra (re-sorteo del bracket o borrado del torneo),
--       sus bonus se van con ella. El borrado del torneo llega hasta aquí
--       por el cascade de tournament_matches.
--    b) Si el profesor corrige la ronda anterior, la pelea de la ronda
--       siguiente se queda sin peleadores: ese roll ya no significa nada,
--       se borra para que se rolee de nuevo cuando lleguen los nuevos.
-- ----------------------------------------------------------------------------
create or replace function public.on_tournament_match_deleted()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  delete from public.point_events
  where ref_id = old.id
    and kind in ('caos_upset', 'caos_finish');
  return old;
end;
$$;

drop trigger if exists tournament_match_deleted on public.tournament_matches;
create trigger tournament_match_deleted
  after delete on public.tournament_matches
  for each row execute function public.on_tournament_match_deleted();

create or replace function public.on_tournament_match_fighters_cleared()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if (old.student1_id is not null and new.student1_id is null)
     or (old.student2_id is not null and new.student2_id is null) then
    delete from public.tournament_match_rolls where match_id = new.id;
  end if;
  return new;
end;
$$;

drop trigger if exists tournament_match_fighters_cleared on public.tournament_matches;
create trigger tournament_match_fighters_cleared
  after update on public.tournament_matches
  for each row execute function public.on_tournament_match_fighters_cleared();

-- ============================================================================
-- Listo. Después de correr esto:
--   · Los torneos que ya existían siguen en modo 'classic', intactos.
--   · El profesor puede crear un "Torneo CAOS" desde /dashboard/torneos/nuevo.
--   · Cada pelea con los dos peleadores listos muestra el botón de ROLEAR.
-- ============================================================================
