-- ============================================================================
-- RollPrep — Migración: GYM_STATS (números del gym para la landing)
-- Ejecutar en el SQL Editor de Supabase (o via `supabase db push`).
-- Es idempotente: se puede correr varias veces.
--
-- La landing es pública y quiere enseñar el XP que lleva acumulado el equipo.
-- Ni point_events ni leaderboard sirven para eso: el primero está cerrado por
-- RLS y el segundo solo se le concede a los autenticados — y con razón, que
-- ahí van los nombres y los totales de cada alumno.
--
-- Esta vista devuelve UNA fila de puros agregados: ni un nombre, ni un id, ni
-- forma de saber quién hizo qué. Eso sí se puede enseñar a cualquiera.
-- ============================================================================

drop view if exists public.gym_stats;

create view public.gym_stats as
select
  coalesce(sum(e.points), 0)::integer as total_points,
  count(distinct e.student_id)::integer as students,
  count(*) filter (where e.kind = 'assignment_completed')::integer as classes_studied
from public.point_events e
join public.profiles p on p.id = e.student_id and p.role = 'student';

grant select on public.gym_stats to anon, authenticated;

-- PostgREST se entera de la vista nueva de una vez.
notify pgrst, 'reload schema';
