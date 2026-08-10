-- ============================================================================
-- RollPrep — Migración: ACTIVE_CLASS (la clase activa, para la landing)
-- Ejecutar en el SQL Editor de Supabase (o via `supabase db push`).
-- Es idempotente: se puede correr varias veces.
--
-- La landing enseña qué está estudiando el gym AHORA MISMO: la tarea activa o,
-- si no hay, la votación abierta. Ni assignments ni polls se le pueden abrir a
-- anon (ahí vive el video de la clase, que es justamente lo que se entra a
-- buscar), así que va por una vista con lo mínimo para el gancho:
--
--   · el título y la fecha de la clase        → de qué se trata
--   · cuántos alumnos ya la estudiaron        → prueba social, sin nombres
--   · la pregunta y los títulos de la encuesta → qué se está decidiendo
--
-- Lo que NO sale de aquí: video_url, notas del profesor, ids y cualquier cosa
-- que identifique a un alumno. El contenido se desbloquea entrando.
--
-- Devuelve SIEMPRE una fila: los campos vienen en null cuando no hay nada
-- activo (día de descanso), y entonces la landing esconde la sección.
-- ============================================================================

drop view if exists public.active_class;

create view public.active_class as
select
  a.title as assignment_title,
  a.scheduled_for as assignment_date,
  coalesce(ac.studied, 0) as assignment_studied,
  p.question as poll_question,
  coalesce(po.options, '{}'::text[]) as poll_options,
  coalesce(pv.voters, 0) as poll_voters
-- Fila ancla: sin esto, quedarse sin tarea activa devolvería cero filas en vez
-- de una fila de nulls, y la landing no podría distinguir "día de descanso" de
-- "la vista no existe".
from (values (1)) as anchor (x)
left join lateral (
  select id, title, scheduled_for
  from public.assignments
  where is_active
  order by created_at desc
  limit 1
) a on true
left join lateral (
  select count(*)::integer as studied
  from public.assignment_completions c
  where c.assignment_id = a.id
) ac on true
left join lateral (
  select id, question
  from public.polls
  where is_active
  order by created_at desc
  limit 1
) p on true
left join lateral (
  select array_agg(o.title order by o.title) as options
  from public.poll_options o
  where o.poll_id = p.id
) po on true
left join lateral (
  select count(*)::integer as voters
  from public.poll_votes v
  where v.poll_id = p.id
) pv on true;

-- La vista corre con los permisos de su dueño (security_invoker sigue en off),
-- así que atraviesa la RLS de las tablas de abajo. Es a propósito: es la única
-- puerta por la que anon ve algo de assignments, y solo ve estas columnas.
grant select on public.active_class to anon, authenticated;

-- PostgREST se entera de la vista nueva de una vez.
notify pgrst, 'reload schema';
