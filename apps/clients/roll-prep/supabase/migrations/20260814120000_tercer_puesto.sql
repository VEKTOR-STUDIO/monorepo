-- ============================================================================
-- RollPrep — Migración: PELEA POR EL 3ER PUESTO (el loser bracket del CAOS)
-- Ejecutar en el SQL Editor de Supabase (o via `supabase db push`).
-- Es idempotente: se puede correr varias veces.
--
-- Hasta ahora perder la semifinal era irse a casa: dos peleadores llegaban a
-- un paso de la final y su tope terminaba ahí, sin una última pelea y sin
-- nada que cobrar por haber llegado. Ahora se cruzan entre ellos.
--
-- El loser bracket de este sistema es UNA sola pelea. Vive en el mismo cuadro
-- que la final —ronda más alta, slot 1— y por eso NO hace falta tocar
-- tournament_matches: (round, slot) ya la describe entera. La final sigue
-- siendo el slot 0 de esa ronda, así que la regla histórica de
-- `order by round desc, slot asc limit 1` sigue apuntando exactamente a la
-- final, aquí y en on_tournament_status_change. Ese es todo el truco.
--
-- Qué cambia:
--   1. point_events.kind        → nuevo 'tournament_third'.
--   2. on_tournament_status_change → +25 XP al que gana el 3er puesto, y ese
--                                  XP se retira si el tope se reabre.
--   3. caos_podium              → nueva fila de podio 'third' (+50 PC).
--   4. caos_leaderboard         → se recrea igual (depende de caos_podium).
--
-- Los topes viejos no se enteran: su ronda más alta solo tiene el slot 0, así
-- que no hay 3er puesto que buscar y las vistas devuelven lo mismo de antes.
-- El bronce se crea al sortear el cuadro (libs/tournaments.js buildBracket),
-- nunca a posteriori: un tope ya sorteado se queda como está.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. NUEVO TIPO DE PUNTO
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
    'tournament_third',
    'tournament_finalist',
    'tournament_champion',
    'caos_upset',
    'caos_finish'
  )
);

-- ----------------------------------------------------------------------------
-- 2. XP DEL PODIO COMPLETO
--
--    Se mantiene la forma de buscar la final (round desc, slot asc) porque el
--    3er puesto es el slot 1 de esa misma ronda: el limit 1 nunca lo escoge.
--    El bronce se busca aparte y explícito.
--
--    +25 al tercero: por encima de los +15 que cobra cualquiera por pelear el
--    tope, por debajo de los +50 del finalista. Como el resto del podio, se
--    paga al cerrar el torneo y se retira si se reabre.
-- ----------------------------------------------------------------------------
create or replace function public.on_tournament_status_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_final record;
  v_third record;
  v_last_round integer;
  v_runner_up uuid;
  v_participant record;
begin
  if new.status = 'completed' and old.status is distinct from 'completed' then
    for v_participant in
      select student_id from public.tournament_participants
      where tournament_id = new.id and not is_guest
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

    -- El 3er puesto: slot 1 de la ronda más alta. En los cuadros que no lo
    -- tienen (los de 2, los de 4 con bye, y todos los topes viejos) esta
    -- consulta no devuelve nada y no se paga nada.
    select max(round) into v_last_round
    from public.tournament_matches
    where tournament_id = new.id;

    select * into v_third
    from public.tournament_matches
    where tournament_id = new.id
      and round = v_last_round
      and slot = 1;

    if v_third.winner_id is not null then
      perform public.award_points(v_third.winner_id, 'tournament_third', 25, new.id);
    end if;
  elsif old.status = 'completed' and new.status <> 'completed' then
    delete from public.point_events
    where ref_id = old.id
      and kind in (
        'tournament_participation',
        'tournament_third',
        'tournament_finalist',
        'tournament_champion'
      );
  end if;

  return new;
end;
$$;

-- ----------------------------------------------------------------------------
-- 3. EL PODIO CAOS, AHORA DE TRES
--
--    Antes la final se escogía con `distinct on (tournament_id)` ordenando por
--    round desc, slot asc. Ahora la ronda más alta tiene dos peleas, así que
--    se nombra cada casilla por lo que es: slot 0 = final, slot 1 = bronce.
--    Es la misma pelea que escogía el distinct on, dicha en voz alta.
--
--    El `winner_id is not null` sigue aplicándose FUERA de la selección de la
--    casilla, por la misma razón de siempre: primero se escoge la final,
--    después se pregunta si ya se peleó. Si se filtrara antes, un torneo a
--    medias coronaría campeón al ganador de una semifinal.
--
--    +50 PC al tercero: la mitad de lo que cobra el finalista, que es la
--    misma proporción que guardan +25 y +50 en el XP.
--
--    Las dos vistas se recrean juntas porque caos_leaderboard lee de
--    caos_podium; caos_leaderboard va idéntica a como estaba.
-- ----------------------------------------------------------------------------
drop view if exists public.caos_leaderboard;
drop view if exists public.caos_podium;

create view public.caos_podium as
with bracket as (
  select
    m.tournament_id,
    t.title as tournament_title,
    t.event_type,
    t.completed_at,
    m.id as match_id,
    m.round,
    m.slot,
    m.winner_id,
    m.student1_id,
    m.student2_id,
    max(m.round) over (partition by m.tournament_id) as last_round
  from public.tournament_matches m
  join public.tournaments t on t.id = m.tournament_id
  where t.mode = 'caos'
    and t.ranked
    and t.status = 'completed'
)
-- Campeón y finalista salen de la final.
select
  f.tournament_id,
  f.tournament_title,
  f.event_type,
  f.completed_at,
  f.match_id,
  s.student_id,
  s.placement,
  s.pc
from bracket f
cross join lateral (
  values
    (f.winner_id, 'champion'::text, 200),
    (
      case
        when f.winner_id = f.student1_id then f.student2_id
        when f.winner_id = f.student2_id then f.student1_id
      end,
      'runner_up'::text,
      100
    )
) as s (student_id, placement, pc)
where f.round = f.last_round
  and f.slot = 0
  and f.winner_id is not null
  and s.student_id is not null

union all

-- El tercero sale del bronce. El cuarto no cobra podio: ya cobró sus dos
-- peleas y su derrota en el fight_log, igual que cualquier otro eliminado.
select
  b.tournament_id,
  b.tournament_title,
  b.event_type,
  b.completed_at,
  b.match_id,
  b.winner_id,
  'third'::text,
  50
from bracket b
where b.round = b.last_round
  and b.slot = 1
  and b.winner_id is not null;

-- ----------------------------------------------------------------------------
-- 4. CAOS_LEADERBOARD — sin cambios, se recrea porque colgaba de caos_podium
--
--    `titles` sigue contando solo campeonatos: el 3er puesto paga PC, no
--    título. Un tercero no es campeón de nada.
-- ----------------------------------------------------------------------------
create view public.caos_leaderboard as
with ledger as (
  -- Lo que paga pelear.
  select
    f.student_id,
    f.event_type,
    f.pc,
    1 as fights,
    (case when f.won then 1 else 0 end) as wins,
    (case when f.won and f.method = 'submission' then 1 else 0 end) as submissions,
    (case when f.is_upset then 1 else 0 end) as upsets,
    0 as championships,
    f.decided_at as happened_at
  from public.caos_fight_log f
  union all
  -- Lo que paga el podio.
  select
    d.student_id,
    d.event_type,
    d.pc,
    0,
    0,
    0,
    0,
    (case when d.placement = 'champion' then 1 else 0 end),
    null::timestamptz
  from public.caos_podium d
)
select
  p.id as student_id,
  p.full_name,
  p.role,
  a.id as academy_id,
  a.name as academy_name,
  a.slug as academy_slug,
  a.color as academy_color,

  coalesce(sum(l.pc), 0)::integer as pc,
  coalesce(sum(l.pc) filter (where l.event_type = 'class'), 0)::integer as pc_class,
  coalesce(sum(l.pc) filter (where l.event_type = 'circuit'), 0)::integer as pc_circuit,

  coalesce(sum(l.fights), 0)::integer as fights,
  coalesce(sum(l.fights) filter (where l.event_type = 'class'), 0)::integer as fights_class,
  coalesce(sum(l.fights) filter (where l.event_type = 'circuit'), 0)::integer as fights_circuit,

  coalesce(sum(l.wins), 0)::integer as wins,
  coalesce(sum(l.wins) filter (where l.event_type = 'class'), 0)::integer as wins_class,
  coalesce(sum(l.wins) filter (where l.event_type = 'circuit'), 0)::integer as wins_circuit,

  coalesce(sum(l.submissions), 0)::integer as submissions,
  coalesce(sum(l.submissions) filter (where l.event_type = 'class'), 0)::integer as submissions_class,
  coalesce(sum(l.submissions) filter (where l.event_type = 'circuit'), 0)::integer as submissions_circuit,

  coalesce(sum(l.upsets), 0)::integer as upsets,
  coalesce(sum(l.upsets) filter (where l.event_type = 'class'), 0)::integer as upsets_class,
  coalesce(sum(l.upsets) filter (where l.event_type = 'circuit'), 0)::integer as upsets_circuit,

  coalesce(sum(l.championships), 0)::integer as titles,
  coalesce(sum(l.championships) filter (where l.event_type = 'class'), 0)::integer as titles_class,
  coalesce(sum(l.championships) filter (where l.event_type = 'circuit'), 0)::integer as titles_circuit,

  max(l.happened_at) as last_fight_at
from ledger l
-- El candado que deja fuera a los invitados: sin cuenta, no hay ranking.
join public.profiles p on p.id = l.student_id
left join public.academies a on a.id = p.academy_id
group by p.id, p.full_name, p.role, a.id, a.name, a.slug, a.color;

-- ----------------------------------------------------------------------------
-- 5. PERMISOS
--    Los grants se van con el drop de las vistas: hay que volver a darlos.
-- ----------------------------------------------------------------------------
grant select on public.caos_podium to authenticated;
grant select on public.caos_leaderboard to authenticated;

notify pgrst, 'reload schema';

-- ============================================================================
-- Listo. Después de correr esto:
--   · Los topes que se sorteen de 4 peleadores en adelante traen la pelea por
--     el 3er puesto pegada a la final, y se llena sola con los dos que
--     pierden en semifinales.
--   · El tope se cierra cuando el cuadro completo tiene resultado: si falta
--     el 3er puesto, sigue en curso (y esa pelea todavía se puede rolear).
--   · Ganar el bronce paga +25 XP y +50 PC, además de lo que ya paga la
--     pelea en sí (fight log, sumisión, remontada).
-- ============================================================================
