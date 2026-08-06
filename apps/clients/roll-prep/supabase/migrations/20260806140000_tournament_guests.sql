-- ============================================================================
-- RollPrep — Migración: INVITADOS en los topes
-- Ejecutar en el SQL Editor de Supabase (o via `supabase db push`).
--
-- Problema: al bracket solo podían entrar alumnos con cuenta. Pero a los
-- topes cae gente de otros gyms, el amigo que vino a probar, el que todavía
-- no se ha registrado. Antes había que dejarlos fuera o inventarles cuenta.
--
-- Qué agrega:
--   1. tournament_participants.is_guest / .guest_name
--      → un invitado es un participante SIN cuenta: su id es un uuid
--        inventado en el momento y su nombre vive en la misma fila.
--   2. Se sueltan los FK a profiles de los ids de peleador (participantes y
--      peleas), porque el uuid de un invitado no existe en profiles.
--      Lo que hacían esos FK ahora lo hace un trigger sobre profiles:
--        · borrar un alumno lo saca de los participantes (era cascade)
--        · y lo borra de las peleas donde aparecía (era set null)
--   3. award_points ignora a quien no tenga cuenta.
--      → los invitados pelean, avanzan y pueden ganar el tope, pero NO
--        cobran XP ni entran al ranking. No tienen dónde acumularlo.
--
-- Los torneos que ya existen no cambian: todos sus participantes quedan
-- como alumnos (is_guest = false).
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. PARTICIPANTES INVITADOS
--    Un invitado trae su nombre encima; un alumno lo saca de su perfil.
-- ----------------------------------------------------------------------------
alter table public.tournament_participants
  add column if not exists is_guest boolean not null default false;

alter table public.tournament_participants
  add column if not exists guest_name text;

alter table public.tournament_participants
  drop constraint if exists tournament_participants_guest_name_check;
alter table public.tournament_participants
  add constraint tournament_participants_guest_name_check check (
    case
      when is_guest then char_length(btrim(coalesce(guest_name, ''))) between 1 and 60
      else guest_name is null
    end
  );

-- ----------------------------------------------------------------------------
-- 2. LOS IDS DE PELEADOR YA NO APUNTAN A PROFILES
--    El uuid de un invitado se inventa al crear el torneo: no hay fila en
--    profiles a la que apuntar. Se sueltan los FK y el trigger de abajo
--    hace la limpieza que ellos hacían.
-- ----------------------------------------------------------------------------
alter table public.tournament_participants
  drop constraint if exists tournament_participants_student_id_fkey;

alter table public.tournament_matches
  drop constraint if exists tournament_matches_student1_id_fkey;
alter table public.tournament_matches
  drop constraint if exists tournament_matches_student2_id_fkey;
alter table public.tournament_matches
  drop constraint if exists tournament_matches_winner_id_fkey;

-- Se borró un alumno: lo mismo que hacían los FK, a mano.
create or replace function public.on_profile_deleted_clean_tournaments()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  delete from public.tournament_participants
  where student_id = old.id and not is_guest;

  update public.tournament_matches
  set student1_id = null
  where student1_id = old.id;

  update public.tournament_matches
  set student2_id = null
  where student2_id = old.id;

  update public.tournament_matches
  set winner_id = null
  where winner_id = old.id;

  return old;
end;
$$;

drop trigger if exists profile_deleted_clean_tournaments on public.profiles;
create trigger profile_deleted_clean_tournaments
  after delete on public.profiles
  for each row execute function public.on_profile_deleted_clean_tournaments();

-- ----------------------------------------------------------------------------
-- 3. EL XP ES SOLO PARA QUIEN TIENE DÓNDE GUARDARLO
--    point_events.student_id sí apunta a profiles: si un invitado gana el
--    tope, el insert reventaría el trigger completo y nadie cobraría. Se
--    ignora y ya: el invitado se lleva el bracket, no el XP.
-- ----------------------------------------------------------------------------
create or replace function public.award_points(
  p_student_id uuid,
  p_kind text,
  p_points integer,
  p_ref_id uuid default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_student_id is null then
    return;
  end if;

  -- Invitado (o perfil borrado): no hay cuenta donde acumular.
  if not exists (select 1 from public.profiles where id = p_student_id) then
    return;
  end if;

  insert into public.point_events (student_id, kind, points, ref_id)
  values (p_student_id, p_kind, p_points, p_ref_id)
  on conflict do nothing;
end;
$$;

-- Los +15 de participación tampoco se intentan para los invitados.
create or replace function public.on_tournament_status_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_final record;
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
  elsif old.status = 'completed' and new.status <> 'completed' then
    delete from public.point_events
    where ref_id = old.id
      and kind in (
        'tournament_participation',
        'tournament_finalist',
        'tournament_champion'
      );
  end if;

  return new;
end;
$$;

-- ============================================================================
-- Listo. Después de correr esto:
--   · En /dashboard/torneos/nuevo el profesor dice cuántos invitados hay y
--     el sistema les inventa el nombre de guerra.
--   · Los invitados salen en el bracket marcados como INV y pelean igual.
--   · El XP del tope sigue cayendo solo en las cuentas de los alumnos.
-- ============================================================================
