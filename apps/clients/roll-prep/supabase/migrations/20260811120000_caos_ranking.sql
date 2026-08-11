-- ============================================================================
-- RollPrep — Migración: RANKING CAOS (Puntos de CAOS)
-- Ejecutar en el SQL Editor de Supabase (o via `supabase db push`).
-- Es idempotente: se puede correr varias veces.
--
-- El `leaderboard` de siempre no se toca: ese es el XP de por vida, el que
-- sube el cinturón, el que premia estudiar y aparecer. Este es OTRO tablero:
-- los Puntos de CAOS (PC), que solo se ganan peleando en la modalidad CAOS.
-- Sin temporadas: se acumula todo, como el récord de un peleador.
--
-- Qué agrega:
--   1. tournaments.event_type   → 'class' (el tope de la clase) | 'circuit'
--                                 (el evento oficial). Los dos suman al
--                                 ranking; el tipo es lo que deja mirarlos
--                                 por separado.
--      tournaments.ranked       → interruptor de "no puntuable": el bracket
--                                 de prueba, el demo, el que se armó para
--                                 explicar el modo. Se pelea igual, no cuenta.
--   2. caos_fight_log   (vista) → una fila POR PELEADOR por cada pelea CAOS
--                                 decidida. El expediente.
--   3. caos_podium      (vista) → una fila por puesto (campeón, finalista)
--                                 de cada torneo CAOS cerrado.
--   4. caos_leaderboard (vista) → una fila por peleador, con cada número
--                                 tres veces: total, clase y circuito.
--
-- LA DECISIÓN DE DISEÑO: nada de esto se materializa. No hay tabla nueva, no
-- hay trigger nuevo, no hay kind nuevo en point_events. Los PC no se guardan:
-- se calculan leyendo las peleas. Por eso corregir un resultado, re-sortear
-- un bracket o borrar un torneo corrige el ranking solo, sin retirar nada y
-- sin cuadrar nada. Lo que no se escribió no se puede desincronizar.
--
-- LA FÓRMULA (debe coincidir con CAOS_RANK_POINTS en libs/caos.js):
--   Por pelea decidida, con los dos peleadores en el tatami:
--     +20  a cada uno por pelear
--     +100 al ganador
--     +50  más si ganó por sumisión
--     +25 × nivel de la carta si el ganador venía cargando el OMEGA
--   Por torneo cerrado:
--     +200 al campeón   ·   +100 al finalista
--
-- QUIÉN ENTRA: solo quien tiene cuenta. Los invitados pelean, avanzan y
-- pueden llevarse el bracket, pero no tienen perfil donde acumular. Se caen
-- del ranking solos, sin filtro especial: el join contra profiles no los
-- encuentra. Es el mismo criterio que ya usa award_points.
--
-- A diferencia del leaderboard del gym, aquí NO se filtra por rol. Ese filtra
-- porque parte de profiles y sin él saldría el profesor con su XP de registro
-- sin haber hecho nada. Este parte de las peleas: quien no peleó no aparece,
-- y si el profesor se mete al bracket, rankea como cualquiera.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. QUÉ TIPO DE EVENTO ES Y SI CUENTA
--    Los torneos que ya existen quedan como 'class' y puntuables: el ranking
--    arranca con todo lo que ya se peleó. `event_type` aplica también al modo
--    clásico — mañana puede haber un viernes clásico y el dato ya está.
-- ----------------------------------------------------------------------------
alter table public.tournaments
  add column if not exists event_type text not null default 'class';

alter table public.tournaments drop constraint if exists tournaments_event_type_check;
alter table public.tournaments add constraint tournaments_event_type_check
  check (event_type in ('class', 'circuit'));

alter table public.tournaments
  add column if not exists ranked boolean not null default true;

create index if not exists tournaments_ranked_caos_idx
  on public.tournaments (mode, event_type)
  where ranked;

-- ----------------------------------------------------------------------------
-- 2. LIMPIEZA PREVIA
--    En orden inverso al de creación: caos_leaderboard se apoya en las otras
--    dos y Postgres no deja borrar el piso antes que el techo.
--
--    Es drop + create y no `create or replace view` a propósito: el replace
--    se niega a cambiar el tipo, el nombre o el orden de una columna, así que
--    reventaría la primera vez que se le sume una estadística al tablero.
-- ----------------------------------------------------------------------------
drop view if exists public.caos_leaderboard;
drop view if exists public.caos_podium;
drop view if exists public.caos_fight_log;

-- ----------------------------------------------------------------------------
-- 3. CAOS_FIGHT_LOG — el expediente, pelea por pelea
--
--    Cada pelea sale DOS veces, una por peleador: la misma pelea contada
--    desde cada lado (yo, mi rival, mi peso, su peso). Así el ranking suma
--    sin preguntarse si el alumno era el student1 o el student2.
--
--    Qué NO entra:
--      · Los pases directos (bye): no hubo pelea ni hubo rival.
--      · Los "no presentado" (walkover): nadie peleó. Pagarle los +20 de
--        pelear al que no se presentó sería premiarlo por faltar. Si algún
--        día se quiere que cuenten, se borra esa línea del where.
--      · Los torneos clásicos y los marcados como no puntuables.
--    Un DQ sí cuenta: ahí sí hubo pelea, solo que terminó mal.
--
--    El roll entra por LEFT JOIN a propósito. En el CAOS no se pelea sin
--    rolear (lo exige reportResult), pero si alguna vez apareciera una pelea
--    decidida sin roll, lo que se pierde es el bonus del OMEGA — no los +20
--    y los +100 de haber peleado. Los byes se excluyen diciéndolo, no de
--    rebote por el join.
-- ----------------------------------------------------------------------------
create view public.caos_fight_log as
select
  m.tournament_id,
  t.title as tournament_title,
  t.event_type,
  m.id as match_id,
  m.round,
  m.slot,
  s.student_id,
  s.opponent_id,
  (m.winner_id = s.student_id) as won,
  m.method,
  coalesce(r.tier, 0)::smallint as tier,
  s.weight,
  s.opponent_weight,
  -- El peso guardado es la única señal de quién cargó qué: positivo =
  -- ventaja (ALFA), negativo = carga (OMEGA), cero = duelo neutro. Ganar
  -- desde abajo es la remontada. En un duelo neutro los dos van en 0, así
  -- que la comparación estricta nunca es cierta y no paga.
  coalesce(m.winner_id = s.student_id and s.weight < s.opponent_weight, false)
    as is_upset,
  (
    20
    + case when m.winner_id = s.student_id then 100 else 0 end
    + case when m.winner_id = s.student_id and m.method = 'submission'
           then 50 else 0 end
    + case when m.winner_id = s.student_id and s.weight < s.opponent_weight
           then 25 * coalesce(r.tier, 0) else 0 end
  )::integer as pc,
  m.decided_at
from public.tournament_matches m
join public.tournaments t on t.id = m.tournament_id
left join public.tournament_match_rolls r on r.match_id = m.id
cross join lateral (
  values
    (m.student1_id, m.student2_id, r.student1_weight, r.student2_weight),
    (m.student2_id, m.student1_id, r.student2_weight, r.student1_weight)
) as s (student_id, opponent_id, weight, opponent_weight)
where t.mode = 'caos'
  and t.ranked
  and m.winner_id is not null
  and m.student1_id is not null
  and m.student2_id is not null
  and m.winner_id in (m.student1_id, m.student2_id)
  and m.method is distinct from 'walkover';

-- ----------------------------------------------------------------------------
-- 4. CAOS_PODIUM — campeón y finalista de cada torneo CAOS cerrado
--
--    La final es la última pelea del bracket: la de la ronda más alta. Es la
--    MISMA regla que usa on_tournament_status_change para repartir el XP de
--    campeón, y eso es deliberado: si las dos discreparan, el alumno vería un
--    campeón en el ranking y otro en su historial de XP.
--
--    OJO con el distinct on: adentro solo se filtra por lo que es del TORNEO
--    (modo, puntuable, cerrado). Meter ahí `winner_id is not null` sería el
--    bug: en un torneo a medias escogería la última pelea DECIDIDA —una
--    semifinal— y coronaría campeón a quien todavía no ha peleado la final.
--    Primero se escoge la final; después se pregunta si ya se peleó.
--
--    Sale una fila por PUESTO, no una por torneo. Eso es lo que hace que un
--    campeón invitado (uuid sin perfil) se caiga solo al cruzar con profiles
--    sin arrastrarse al finalista, que sí tiene cuenta y sí cobra sus +100.
-- ----------------------------------------------------------------------------
create view public.caos_podium as
with final as (
  select distinct on (m.tournament_id)
    m.tournament_id,
    t.title as tournament_title,
    t.event_type,
    t.completed_at,
    m.id as match_id,
    m.winner_id,
    m.student1_id,
    m.student2_id
  from public.tournament_matches m
  join public.tournaments t on t.id = m.tournament_id
  where t.mode = 'caos'
    and t.ranked
    and t.status = 'completed'
  order by m.tournament_id, m.round desc, m.slot asc
)
select
  f.tournament_id,
  f.tournament_title,
  f.event_type,
  f.completed_at,
  f.match_id,
  s.student_id,
  s.placement,
  s.pc
from final f
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
where f.winner_id is not null
  and s.student_id is not null;

-- ----------------------------------------------------------------------------
-- 5. CAOS_LEADERBOARD — el tablero
--
--    Una fila por peleador, con cada número tres veces: el total, lo de los
--    topes de clase y lo del circuito. Las pestañas TODO / CIRCUITO / CLASE
--    son entonces tres formas de ordenar el MISMO array, no tres cuentas
--    distintas hechas a mano en el cliente.
--
--    Las derrotas no tienen columna: son fights - wins, y ese resto siempre
--    cuadra porque el log solo trae peleas decididas.
--
--    Las columnas de academia van planas (academy_id / _name / _slug /
--    _color) igual que en leaderboard y admin_users: es lo que espera
--    academyFromRow en libs/academies.js.
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
-- 6. PERMISOS
--    Solo autenticados: el ranking es del gym, no de la landing. Las vistas
--    corren con permisos del dueño (security_invoker apagado, como el resto
--    del proyecto), pero aquí eso no abre ninguna puerta: tournaments,
--    tournament_matches y tournament_match_rolls ya tienen
--    `select using (true)` para authenticated. No hay RLS que esquivar; lo
--    único que hacen estas vistas es la cuenta.
-- ----------------------------------------------------------------------------
grant select on public.caos_fight_log to authenticated;
grant select on public.caos_podium to authenticated;
grant select on public.caos_leaderboard to authenticated;

-- PostgREST se entera de las vistas y de las columnas nuevas de una vez.
notify pgrst, 'reload schema';

-- ============================================================================
-- Listo. Después de correr esto:
--   · Al armar un tope el profesor elige si es de CLASE o del CIRCUITO.
--   · /dashboard/ranking/caos muestra el tablero, con filtro de tipo y de
--     academia. El ranking de XP del gym sigue exactamente igual.
--
-- OJO: `ranked` arranca en true, así que TODO CAOS que ya se peleó entra al
-- ranking apenas corras esto. Revisa qué hay antes de mostrárselo a nadie:
--
--   select id, title, event_type, ranked, status, created_at
--   from public.tournaments where mode = 'caos' order by created_at;
--
-- Sacar del ranking un bracket de prueba (sin borrarlo):
--   update public.tournaments set ranked = false where id = '<uuid>';
--
-- Marcar a mano un torneo viejo como evento del circuito:
--   update public.tournaments set event_type = 'circuit' where id = '<uuid>';
-- ============================================================================
