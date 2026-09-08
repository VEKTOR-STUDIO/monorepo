-- ============================================================================
-- RollPrep — Migración: CERRAR LOS AVISOS DEL SECURITY ADVISOR
-- Ejecutar en el SQL Editor de Supabase (o via `supabase db push`).
-- Es idempotente: se puede correr varias veces.
--
-- Supabase mandó tres cosas que arreglar (Advisors → Security):
--
--   1. CRÍTICO · auth_users_exposed
--      La vista `admin_users` lee `auth.users` (el correo de cada alumno) y
--      corre con los permisos de su dueño, así que atraviesa toda la RLS.
--      Hoy el candado es el `where is_admin()` de adentro — funciona, pero
--      deja la puerta de auth.users conectada a la API pública: si mañana esa
--      condición se cae en un `create or replace`, se filtran los correos.
--      Se corta de raíz: la vista deja de tocar `auth.users` y el correo pasa
--      por una función en un esquema que la API no publica.
--
--   2. anon podía ESCRIBIR en las vistas
--      Supabase le da `all privileges` por defecto a anon/authenticated sobre
--      todo lo que nace en `public`. En una tabla no importa (la RLS manda),
--      pero `caos_invites_public` es una vista simple → Postgres la considera
--      actualizable, y al correr con permisos del dueño se salta la RLS de
--      `caos_invites`. Es decir: cualquiera con la anon key podía insertar,
--      editar o borrar invitaciones por /rest/v1/caos_invites_public.
--      Ahora cada vista tiene SELECT y nada más, y solo para quien la usa.
--
--   3. Funciones SECURITY DEFINER abiertas a anon
--      `award_points` es la peor: es la que reparte XP y estaba expuesta como
--      /rest/v1/rpc/award_points, o sea que cualquiera se regalaba puntos y
--      se ponía primero en el ranking. La app nunca la llama por RPC (solo la
--      llaman los triggers, que corren como dueños), así que se le quita el
--      permiso a anon y a authenticated. Igual con los triggers.
--
-- Lo que NO cambia y es a propósito:
--   · `leaderboard`, `gym_stats`, `active_class` y `caos_invites_public`
--     siguen corriendo con permisos del dueño (security_invoker off). Es su
--     razón de ser: son la proyección curada que deja ver un agregado (XP del
--     gym, la clase de hoy, el evento) sin abrir las tablas de abajo. El
--     advisor las va a seguir listando como "Security Definer View"; la
--     alternativa sería darle a anon permiso de lectura sobre `point_events`,
--     `profiles` y `caos_invites`, que es mucho peor.
--   · `public.is_admin()` sigue siendo ejecutable por authenticated: la usan
--     todas las policies de RLS y sin ese permiso el panel deja de funcionar.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. ESQUEMA PRIVADO
--    PostgREST solo publica `public` (y `graphql_public`). Lo que viva acá
--    no existe para la API: es el lugar de las funciones que sí necesitan
--    mirar `auth.users`.
-- ----------------------------------------------------------------------------
create schema if not exists private;

revoke all on schema private from public;
revoke all on schema private from anon;
grant usage on schema private to authenticated, service_role;

-- ----------------------------------------------------------------------------
-- 2. EL CORREO, DETRÁS DE UNA PUERTA
--    Devuelve id + correo + último acceso de todo el gym, y solo si quien
--    pregunta es el profesor. Para un alumno devuelve cero filas, así que la
--    vista de abajo (que la usa con `join`, no `left join`) se queda vacía.
--
--    `search_path = ''` obliga a escribir cada nombre completo: es lo que
--    impide que alguien cree un `users` propio y secuestre la consulta.
-- ----------------------------------------------------------------------------
create or replace function private.admin_auth_users()
returns table (id uuid, email text, last_sign_in_at timestamptz)
language sql
stable
security definer
set search_path = ''
as $$
  select u.id, u.email::text, u.last_sign_in_at
  from auth.users u
  where public.is_admin();
$$;

revoke all on function private.admin_auth_users() from public;
revoke all on function private.admin_auth_users() from anon;
grant execute on function private.admin_auth_users() to authenticated, service_role;

-- ----------------------------------------------------------------------------
-- 3. ADMIN_USERS: la misma lista, sin tocar auth.users
--    Mismas columnas de siempre (el panel no se entera del cambio), pero
--    ahora con `security_invoker = true`: la vista corre con los permisos de
--    quien pregunta, o sea que la RLS de `profiles`, `academies` y
--    `point_events` se aplica de verdad. Para el profesor no cambia nada
--    (`point_events` ya dejaba pasar a is_admin()); para un alumno el join
--    con la función se queda sin filas y la vista devuelve vacío.
-- ----------------------------------------------------------------------------
drop view if exists public.admin_users;

create view public.admin_users
with (security_invoker = true) as
select
  p.id,
  au.email,
  p.full_name,
  p.role,
  p.created_at,
  au.last_sign_in_at,
  a.id as academy_id,
  a.name as academy_name,
  a.slug as academy_slug,
  a.color as academy_color,
  coalesce(sum(e.points), 0)::integer as total_points,
  count(e.id) filter (where e.kind = 'assignment_completed')::integer as classes_completed
from public.profiles p
join private.admin_auth_users() au on au.id = p.id
left join public.academies a on a.id = p.academy_id
left join public.point_events e on e.student_id = p.id
group by
  p.id, au.email, p.full_name, p.role, p.created_at, au.last_sign_in_at,
  a.id, a.name, a.slug, a.color;

-- ----------------------------------------------------------------------------
-- 4. PERMISOS DE LAS VISTAS: solo SELECT, y solo para quien la usa
--    El `revoke all` limpia el `grant all` que Supabase reparte por defecto
--    (insert/update/delete incluidos) al crear cualquier cosa en `public`.
-- ----------------------------------------------------------------------------

-- Panel del profesor: nadie más, ni siquiera de lectura.
revoke all on public.admin_users from anon, authenticated;
grant select on public.admin_users to authenticated;

-- Dashboard: hay que tener sesión para verlas.
revoke all on public.leaderboard from anon, authenticated;
revoke all on public.caos_leaderboard from anon, authenticated;
revoke all on public.caos_podium from anon, authenticated;
revoke all on public.caos_fight_log from anon, authenticated;
grant select on public.leaderboard to authenticated;
grant select on public.caos_leaderboard to authenticated;
grant select on public.caos_podium to authenticated;
grant select on public.caos_fight_log to authenticated;

-- Landing y página del evento: las lee anon a propósito, pero solo leer.
revoke all on public.gym_stats from anon, authenticated;
revoke all on public.active_class from anon, authenticated;
revoke all on public.caos_invites_public from anon, authenticated;
grant select on public.gym_stats to anon, authenticated;
grant select on public.active_class to anon, authenticated;
grant select on public.caos_invites_public to anon, authenticated;

-- ----------------------------------------------------------------------------
-- 5. FUNCIONES INTERNAS: fuera de la API
--    Todas estas son de uso interno (triggers) o de servicio. Los triggers
--    siguen corriendo igual: se ejecutan con los permisos de su dueño, no con
--    los del alumno que insertó la fila.
-- ----------------------------------------------------------------------------

-- La que repartía XP a quien la llamara.
revoke all on function public.award_points(uuid, text, integer, uuid) from public;
revoke all on function public.award_points(uuid, text, integer, uuid) from anon, authenticated;

-- Triggers: nunca se llaman a mano.
revoke all on function public.handle_new_user() from public;
revoke all on function public.handle_new_user() from anon, authenticated;
-- ...salvo el trigger de auth.users, que lo dispara el propio Auth.
grant execute on function public.handle_new_user() to supabase_auth_admin;

revoke all on function public.on_caos_match_decided() from public;
revoke all on function public.on_caos_match_decided() from anon, authenticated;
revoke all on function public.on_comment_award_points() from public;
revoke all on function public.on_comment_award_points() from anon, authenticated;
revoke all on function public.on_completion_award_points() from public;
revoke all on function public.on_completion_award_points() from anon, authenticated;
revoke all on function public.on_profile_created_award_points() from public;
revoke all on function public.on_profile_created_award_points() from anon, authenticated;
revoke all on function public.on_profile_deleted_clean_tournaments() from public;
revoke all on function public.on_profile_deleted_clean_tournaments() from anon, authenticated;
revoke all on function public.on_profile_updated_award_points() from public;
revoke all on function public.on_profile_updated_award_points() from anon, authenticated;
revoke all on function public.on_tournament_deleted() from public;
revoke all on function public.on_tournament_deleted() from anon, authenticated;
revoke all on function public.on_tournament_match_deleted() from public;
revoke all on function public.on_tournament_match_deleted() from anon, authenticated;
revoke all on function public.on_tournament_match_fighters_cleared() from public;
revoke all on function public.on_tournament_match_fighters_cleared() from anon, authenticated;
revoke all on function public.on_tournament_status_change() from public;
revoke all on function public.on_tournament_status_change() from anon, authenticated;
revoke all on function public.on_vote_award_points() from public;
revoke all on function public.on_vote_award_points() from anon, authenticated;
revoke all on function public.protect_profile_role() from public;
revoke all on function public.protect_profile_role() from anon, authenticated;
revoke all on function public.touch_caos_invite() from public;
revoke all on function public.touch_caos_invite() from anon, authenticated;

-- Event trigger interno de Supabase: solo lo dispara el DDL.
revoke all on function public.rls_auto_enable() from public;
revoke all on function public.rls_auto_enable() from anon, authenticated;

-- `is_admin()` se queda: la llaman todas las policies de RLS y se evalúan con
-- el rol de quien pregunta. Sin este permiso, el panel del profesor muere.
revoke all on function public.is_admin() from public;
revoke all on function public.is_admin() from anon;
grant execute on function public.is_admin() to authenticated, service_role;

-- ----------------------------------------------------------------------------
-- 6. SEARCH_PATH FIJO EN EL ÚLTIMO TRIGGER QUE LE FALTABA
--    Sin esto, quien dispare el trigger elige qué `now()` se ejecuta.
-- ----------------------------------------------------------------------------
alter function public.touch_caos_invite() set search_path = pg_catalog, public;

-- ----------------------------------------------------------------------------
-- 7. LAS VISTAS DE CAOS SÍ PUEDEN RESPETAR LA RLS
--    `tournaments`, `tournament_matches` y `tournament_match_rolls` ya tienen
--    policy de lectura para authenticated (`using (true)`), así que estas tres
--    vistas no necesitan saltarse nada: pasan a correr con los permisos de
--    quien pregunta. Mismos números en el ranking, pero si mañana se cierra la
--    lectura de un torneo, las vistas se enteran en vez de ignorarla.
--
--    Es `alter view` y no `drop + create` a propósito: no se toca la
--    definición, solo quién manda al leerla.
-- ----------------------------------------------------------------------------
alter view public.caos_fight_log set (security_invoker = true);
alter view public.caos_podium set (security_invoker = true);
alter view public.caos_leaderboard set (security_invoker = true);

-- PostgREST se entera del cambio de permisos y de la vista nueva.
notify pgrst, 'reload schema';

-- ============================================================================
-- Después de correr esto:
--   · /dashboard/admin/usuarios se ve exactamente igual (mismas columnas).
--   · Un alumno que apunte a /rest/v1/admin_users sigue viendo cero filas, y
--     ahora además `auth.users` ya no cuelga de ninguna vista de la API.
--   · anon solo puede LEER gym_stats, active_class y caos_invites_public.
--   · /rest/v1/rpc/award_points responde 404: ya no se regala XP.
--
-- Queda un botón que hay que darle a mano en el dashboard (no se puede por
-- SQL): Authentication → Policies → "Leaked password protection". Enciéndelo
-- para que Supabase rechace contraseñas que ya se filtraron en otros hackeos.
-- ============================================================================
