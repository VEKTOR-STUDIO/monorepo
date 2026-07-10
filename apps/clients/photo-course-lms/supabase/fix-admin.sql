-- ============================================================================
-- FIX: promover a admin el correo del profesor.
-- Pega este archivo COMPLETO en el SQL Editor de Supabase y ejecútalo.
-- (Es idempotente: puedes correrlo varias veces sin problema.)
-- ============================================================================

-- 1. El perfil se crea como admin si el correo es el del profesor.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.email),
    case
      when lower(new.email) = 'sniperaless117@gmail.com' then 'admin'
      else 'student'
    end
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

-- 2. Permitir cambios de rol desde el SQL Editor / service role
--    (auth.uid() es null ahí), pero seguir bloqueando a los alumnos.
create or replace function public.protect_profile_role()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.role is distinct from old.role
     and auth.uid() is not null
     and not public.is_admin() then
    raise exception 'Solo el profesor puede cambiar roles';
  end if;
  return new;
end;
$$;

-- 3. Promover retroactivamente al profesor ya registrado.
update public.profiles p
set role = 'admin'
from auth.users u
where u.id = p.id
  and lower(u.email) = 'sniperaless117@gmail.com';

-- 4. Verificación: debe devolver una fila con role = 'admin'.
select u.email, p.role
from public.profiles p
join auth.users u on u.id = p.id
where lower(u.email) = 'sniperaless117@gmail.com';
