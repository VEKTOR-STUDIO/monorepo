-- ═══════════════════════════════════════════════════════════════════════════
-- LEGIÓN MMA — Migración 002: Generador de carteleras (eventos y combates)
-- Fecha: 2026-06-12
-- Requiere: haber corrido antes 001_fighters_setup.sql (usa fighters e is_admin()).
--
-- Cómo correrla: pega TODO este archivo en el SQL Editor de Supabase y
-- ejecútalo una sola vez. Es idempotente.
--
-- Qué hace:
--   1. Crea la tabla `events` (ediciones de Legión: fecha, sede, estado).
--   2. Crea la tabla `bouts` (combates: esquina roja vs azul, división,
--      orden en la cartelera, y resultado al finalizar).
--   3. RLS: el admin gestiona todo; el público solo ve eventos publicados
--      o finalizados (los borradores/simulaciones quedan privados).
-- ═══════════════════════════════════════════════════════════════════════════


-- ───────────────────────────────────────────────────────────────────────────
-- 1. EVENTS: cada edición de Legión
--    `borrador` sirve como modo simulación: armas la cartelera, comparas
--    enfrentamientos y solo cuando decides, la publicas.
-- ───────────────────────────────────────────────────────────────────────────
create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  name text not null,                              -- "Legión"
  edition text,                                    -- "XI"
  event_date timestamptz,
  venue text,                                      -- "Hotel Tamanaco"
  city text,                                       -- "Caracas"
  poster_url text,
  notes text,
  status text not null default 'borrador'
    check (status in ('borrador', 'publicado', 'finalizado', 'cancelado')),
  created_at timestamptz not null default (now() at time zone 'utc'),
  updated_at timestamptz not null default (now() at time zone 'utc')
);

create index if not exists events_status_idx on public.events (status);
create index if not exists events_date_idx on public.events (event_date);


-- ───────────────────────────────────────────────────────────────────────────
-- 2. BOUTS: combates de cada cartelera
-- ───────────────────────────────────────────────────────────────────────────
create table if not exists public.bouts (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,

  -- Posición en la cartelera (mayor = más arriba; el estelar es el más alto)
  bout_order integer not null default 1,
  is_main_event boolean not null default false,
  is_title_fight boolean not null default false,

  discipline text not null default 'mma' check (discipline in ('mma', 'bjj')),
  weight_class text,

  -- Esquinas (si se borra la ficha del peleador, el combate queda sin asignar)
  red_fighter_id uuid references public.fighters(id) on delete set null,
  blue_fighter_id uuid references public.fighters(id) on delete set null,
  check (
    red_fighter_id is null
    or blue_fighter_id is null
    or red_fighter_id <> blue_fighter_id
  ),

  -- Resultado (se llena al finalizar el combate)
  status text not null default 'programado'
    check (status in ('programado', 'finalizado', 'cancelado')),
  winner text check (winner in ('rojo', 'azul', 'empate', 'sin_decision')),
  method text,                                     -- "KO", "Sumisión", "Decisión unánime"...
  round integer check (round between 1 and 5),
  ended_at_time text,                              -- "3:42" dentro del round

  created_at timestamptz not null default (now() at time zone 'utc'),
  updated_at timestamptz not null default (now() at time zone 'utc')
);

create index if not exists bouts_event_idx on public.bouts (event_id);
create index if not exists bouts_red_fighter_idx on public.bouts (red_fighter_id);
create index if not exists bouts_blue_fighter_idx on public.bouts (blue_fighter_id);


-- ───────────────────────────────────────────────────────────────────────────
-- 3. TRIGGERS de updated_at (reusa set_updated_at() de la migración 001)
-- ───────────────────────────────────────────────────────────────────────────
drop trigger if exists events_set_updated_at on public.events;
create trigger events_set_updated_at
  before update on public.events
  for each row
  execute function public.set_updated_at();

drop trigger if exists bouts_set_updated_at on public.bouts;
create trigger bouts_set_updated_at
  before update on public.bouts
  for each row
  execute function public.set_updated_at();


-- ───────────────────────────────────────────────────────────────────────────
-- 4. ROW LEVEL SECURITY
-- ───────────────────────────────────────────────────────────────────────────
alter table public.events enable row level security;
alter table public.bouts enable row level security;

-- Admin: control total sobre eventos y combates
drop policy if exists "events_admin_all" on public.events;
create policy "events_admin_all"
  on public.events for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "bouts_admin_all" on public.bouts;
create policy "bouts_admin_all"
  on public.bouts for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Público: solo eventos publicados o finalizados (borradores = simulaciones privadas)
drop policy if exists "events_select_public" on public.events;
create policy "events_select_public"
  on public.events for select
  to anon, authenticated
  using (status in ('publicado', 'finalizado'));

drop policy if exists "bouts_select_public" on public.bouts;
create policy "bouts_select_public"
  on public.bouts for select
  to anon, authenticated
  using (
    exists (
      select 1 from public.events e
      where e.id = bouts.event_id
        and e.status in ('publicado', 'finalizado')
    )
  );

-- ═══════════════════════════════════════════════════════════════════════════
-- FIN. El generador de carteleras vive en /dashboard/events (solo admin).
-- ═══════════════════════════════════════════════════════════════════════════
