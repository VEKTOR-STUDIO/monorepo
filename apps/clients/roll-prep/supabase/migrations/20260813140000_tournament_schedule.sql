-- ============================================================================
-- RollPrep — Migración: FECHA DEL TOPE Y EVENTOS PROGRAMADOS
-- Ejecutar en el SQL Editor de Supabase (o via `supabase db push`).
-- Es idempotente: se puede correr varias veces.
--
-- Hasta ahora el tope no tenía fecha propia: el calendario usaba created_at,
-- que es el instante en que el profesor sorteó el bracket. Eso alcanza para
-- el tope de clase (se arma el mismo día que se pelea), pero no para el
-- circuito: el evento se anuncia con días de antelación y los peleadores
-- se eligen al llegar, no al crearlo.
--
-- Qué agrega:
--   1. tournaments.scheduled_for  → el día del evento, en la zona del gym.
--                                   Default: hoy en America/Caracas.
--                                   Los torneos viejos se rellenan con el
--                                   día de created_at en esa misma zona.
--   2. status 'scheduled'         → el evento existe, todavía no hay bracket.
--                                   El día del evento el profesor entra,
--                                   marca quién pelea y sortea: pasa a
--                                   'active'. Completarlo sigue igual.
--
-- El ranking CAOS no se toca: solo lee peleas decididas y torneos
-- 'completed'. Un circuito vacío no suma un punto.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. FECHA DEL EVENTO
--    Misma receta que assignments.scheduled_for: date (no timestamptz),
--    default en la zona del gym, backfill desde created_at.
-- ----------------------------------------------------------------------------
alter table public.tournaments
  add column if not exists scheduled_for date;

update public.tournaments
set scheduled_for = (created_at at time zone 'America/Caracas')::date
where scheduled_for is null;

alter table public.tournaments
  alter column scheduled_for set default ((now() at time zone 'America/Caracas')::date);

alter table public.tournaments
  alter column scheduled_for set not null;

create index if not exists tournaments_scheduled_for_idx
  on public.tournaments (scheduled_for desc);

-- ----------------------------------------------------------------------------
-- 2. ESTADO PROGRAMADO
--    Un circuito se crea sin peleadores. 'active' significaría "en curso"
--    con un bracket vacío, que no es verdad. 'scheduled' es "el evento
--    está en el calendario; el bracket se arma el día de".
-- ----------------------------------------------------------------------------
alter table public.tournaments drop constraint if exists tournaments_status_check;
alter table public.tournaments add constraint tournaments_status_check
  check (status in ('scheduled', 'active', 'completed'));
