-- ═══════════════════════════════════════════════════════════════════════════
-- LEGIÓN MMA — Migración 005: Datos bancarios del peleador (pago de bolsas)
-- Fecha: 2026-06-17
--
-- Cómo correrla: pega TODO este archivo en el SQL Editor de Supabase y
-- ejecútalo una sola vez. Es idempotente: si la corres dos veces no rompe nada
-- ni borra datos ya cargados.
--
-- Qué hace:
--   Crea la tabla `fighter_payments` con los datos bancarios (Venezuela) para
--   poder pagarle al peleador: banco, tipo y número de cuenta, titular +
--   cédula/RIF y teléfono de Pago Móvil.
--
-- POR QUÉ UNA TABLA APARTE (y no columnas en `fighters`):
--   La tabla `fighters` tiene una política que deja al público (rol anon) leer
--   las filas de peleadores APROBADOS para el roster. Eso expone TODA la fila.
--   Los datos bancarios son sensibles, así que viven en su propia tabla SIN
--   política pública: sólo los lee el dueño de la ficha y el admin.
-- ═══════════════════════════════════════════════════════════════════════════

create table if not exists public.fighter_payments (
  -- 1:1 con la ficha. La FK apunta a fighters.user_id (que es UNIQUE) para que
  -- PostgREST pueda hacer el embedded select fighters → fighter_payments.
  user_id uuid primary key references public.fighters (user_id) on delete cascade,
  bank_code text,               -- código de banco de 4 dígitos (ver VE_BANKS)
  bank_account_type text,       -- 'ahorro' | 'corriente'
  bank_account_number text,     -- número de cuenta de 20 dígitos
  bank_account_holder text,     -- titular de la cuenta
  bank_account_holder_id text,  -- cédula o RIF del titular
  pago_movil_phone text,        -- teléfono asociado a Pago Móvil
  updated_at timestamptz not null default now()
);

alter table public.fighter_payments enable row level security;

-- El dueño lee/escribe sólo su propio registro de pago
drop policy if exists "fighter_payments_select_own" on public.fighter_payments;
create policy "fighter_payments_select_own"
  on public.fighter_payments for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "fighter_payments_insert_own" on public.fighter_payments;
create policy "fighter_payments_insert_own"
  on public.fighter_payments for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "fighter_payments_update_own" on public.fighter_payments;
create policy "fighter_payments_update_own"
  on public.fighter_payments for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- El admin puede todo (ver para pagar las bolsas, editar, borrar)
drop policy if exists "fighter_payments_admin_all" on public.fighter_payments;
create policy "fighter_payments_admin_all"
  on public.fighter_payments for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Mantener updated_at al día (reusa el trigger genérico de la migración 001)
drop trigger if exists set_fighter_payments_updated_at on public.fighter_payments;
create trigger set_fighter_payments_updated_at
  before update on public.fighter_payments
  for each row execute function public.set_updated_at();

-- ═══════════════════════════════════════════════════════════════════════════
-- FIN. La app lee/escribe esta tabla con embedded select desde `fighters`
-- (select "*, fighter_payments(*)") para el dueño y el admin.
-- ═══════════════════════════════════════════════════════════════════════════
