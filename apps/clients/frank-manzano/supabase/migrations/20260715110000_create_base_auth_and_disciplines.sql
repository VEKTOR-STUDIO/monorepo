-- =============================================================================
-- Base de autenticación (profiles + roles) y tabla de disciplinas — Frank Manzano
--
-- POR QUÉ ESTA MIGRACIÓN:
--   * La migración del LMS (20260715120000_create_lms_training_tables.sql)
--     depende de public.profiles (columna `role`) y de la función is_admin().
--     Esta migración crea esa base, por eso su timestamp es ANTERIOR.
--   * app/page.js consulta la tabla `disciplines` (id, name, description,
--     required_level), que no existía en ninguna migración. Aquí se crea.
--
-- ES IDEMPOTENTE: puedes ejecutarla una sola vez sin miedo aunque parte del
-- esquema ya exista (usa "if not exists" / "create or replace" / "drop policy
-- if exists").
--
-- CÓMO APLICARLA (elige una):
--   a) Supabase SQL Editor  -> pega este archivo y ejecútalo.
--   b) CLI local            -> supabase db push
--
-- ¡IMPORTANTE! Cambia el correo del admin más abajo (ADMIN EMAIL) por el tuyo.
-- =============================================================================

create extension if not exists "pgcrypto";

-- -----------------------------------------------------------------------------
-- 1. profiles  (extiende auth.users; guarda el rol)
-- -----------------------------------------------------------------------------
create table if not exists public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  email       text,
  full_name   text,
  image       text,
  role        text not null default 'user' check (role in ('admin', 'user')),
  has_access  boolean not null default false,
  -- Campos Stripe (opcionales, por compatibilidad con el boilerplate)
  customer_id text,
  price_id    text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Si la tabla ya existía sin `role`, la añadimos.
alter table public.profiles add column if not exists role text not null default 'user';

-- -----------------------------------------------------------------------------
-- 2. is_admin()  — helper reutilizado por las policies del LMS
--    SECURITY DEFINER para evitar recursión de RLS sobre profiles.
-- -----------------------------------------------------------------------------
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where profiles.id = auth.uid()
      and profiles.role = 'admin'
  );
$$;

-- -----------------------------------------------------------------------------
-- 3. handle_new_user()  — crea el perfil al registrarse un usuario.
--    El correo del admin se promueve automáticamente.
-- -----------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, image, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name', new.email),
    new.raw_user_meta_data ->> 'avatar_url',
    case
      -- >>> CAMBIA ESTE CORREO POR EL DEL ADMINISTRADOR <<<
      when lower(new.email) = 'admin@frankmanzano.com' then 'admin'
      else 'user'
    end
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- -----------------------------------------------------------------------------
-- 4. protect_profile_role()  — impide que un usuario se auto-promueva a admin.
--    auth.uid() null = contexto sin sesión (SQL Editor / service role): permitido.
-- -----------------------------------------------------------------------------
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
    raise exception 'Solo un administrador puede cambiar roles';
  end if;
  return new;
end;
$$;

drop trigger if exists on_profile_role_change on public.profiles;
create trigger on_profile_role_change
  before update on public.profiles
  for each row execute function public.protect_profile_role();

-- updated_at automático (usa el helper del LMS si ya existe; si no, lo creamos).
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_profiles_updated_at on public.profiles;
create trigger trg_profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- -----------------------------------------------------------------------------
-- 5. RLS de profiles
-- -----------------------------------------------------------------------------
alter table public.profiles enable row level security;

drop policy if exists "profiles_select_own_or_admin" on public.profiles;
create policy "profiles_select_own_or_admin" on public.profiles
  for select to authenticated
  using (id = auth.uid() or public.is_admin());

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own" on public.profiles
  for insert to authenticated
  with check (id = auth.uid());

drop policy if exists "profiles_update_own_or_admin" on public.profiles;
create policy "profiles_update_own_or_admin" on public.profiles
  for update to authenticated
  using (id = auth.uid() or public.is_admin())
  with check (id = auth.uid() or public.is_admin());

-- =============================================================================
-- 6. disciplines  (líneas de entrenamiento mostradas en la landing)
--    Consultada por app/page.js: select id, name, description, required_level
-- =============================================================================
create table if not exists public.disciplines (
  id             uuid primary key default gen_random_uuid(),
  name           text not null,
  description    text,
  required_level text default 'todos'
                   check (required_level in ('principiante', 'intermedio', 'avanzado', 'todos')),
  sort_order     integer not null default 0,
  is_published   boolean not null default true,
  created_at     timestamptz not null default now()
);

create index if not exists idx_disciplines_published on public.disciplines (is_published);
create index if not exists idx_disciplines_sort on public.disciplines (sort_order);

alter table public.disciplines enable row level security;

-- Lectura pública del contenido publicado (la landing se ve sin login).
drop policy if exists "disciplines_public_read" on public.disciplines;
create policy "disciplines_public_read" on public.disciplines
  for select to anon, authenticated
  using (is_published or public.is_admin());

-- Escritura solo administradores.
drop policy if exists "disciplines_admin_write" on public.disciplines;
create policy "disciplines_admin_write" on public.disciplines
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Seed de ejemplo (idempotente por nombre).
insert into public.disciplines (name, description, required_level, sort_order)
select v.name, v.description, v.required_level, v.sort_order
from (values
  ('Fuerza & potencia', 'Cargas, velocidad de ejecución y progresiones para ganar explosividad sin descuidar la técnica.', 'todos', 1),
  ('Condición & capacidad aeróbica', 'Trabajo metabólico y series estructuradas para mejorar resistencia según tu disciplina.', 'todos', 2),
  ('Movilidad / prevención', 'Patrones de movimiento, activación y enfriamiento para sostener semanas de carga altas.', 'todos', 3)
) as v(name, description, required_level, sort_order)
where not exists (
  select 1 from public.disciplines d where d.name = v.name
);

-- =============================================================================
-- 7. Promover un usuario existente a admin (si ya se había registrado antes)
--    Descomenta y usa tu correo:
--
-- update public.profiles p
-- set role = 'admin'
-- from auth.users u
-- where u.id = p.id and lower(u.email) = 'admin@frankmanzano.com';
-- =============================================================================
