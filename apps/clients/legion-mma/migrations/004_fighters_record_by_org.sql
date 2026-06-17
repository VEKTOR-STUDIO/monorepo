-- ═══════════════════════════════════════════════════════════════════════════
-- LEGIÓN MMA — Migración 004: Récord profesional desglosado por organización
-- Fecha: 2026-06-17
--
-- Cómo correrla: pega TODO este archivo en el SQL Editor de Supabase y
-- ejecútalo una sola vez. Es idempotente: si la corres dos veces no rompe nada
-- ni borra datos de los peleadores ya registrados.
--
-- Qué hace:
--   Agrega a `fighters` el desglose del RÉCORD PROFESIONAL DE MMA según dónde
--   se disputaron las peleas: dentro de Legión vs. en otras organizaciones.
--   El récord profesional total sigue siendo wins / losses / draws (no cambia);
--   esto sólo dice cuántas de esas peleas fueron en cada lado.
-- ═══════════════════════════════════════════════════════════════════════════

alter table public.fighters
  -- Peleas profesionales disputadas EN Legión
  add column if not exists legion_wins integer not null default 0 check (legion_wins >= 0),
  add column if not exists legion_losses integer not null default 0 check (legion_losses >= 0),
  add column if not exists legion_draws integer not null default 0 check (legion_draws >= 0),

  -- Peleas profesionales disputadas en OTRAS organizaciones
  add column if not exists other_org_wins integer not null default 0 check (other_org_wins >= 0),
  add column if not exists other_org_losses integer not null default 0 check (other_org_losses >= 0),
  add column if not exists other_org_draws integer not null default 0 check (other_org_draws >= 0);

-- ═══════════════════════════════════════════════════════════════════════════
-- FIN. No requiere pasos adicionales: la app ya escribe y lee estos campos.
-- ═══════════════════════════════════════════════════════════════════════════
