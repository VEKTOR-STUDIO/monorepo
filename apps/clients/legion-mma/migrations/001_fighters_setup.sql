-- ═══════════════════════════════════════════════════════════════════════════
-- LEGIÓN MMA — Migración 001: Sistema de registro de peleadores
-- Fecha: 2026-06-12
--
-- Cómo correrla: pega TODO este archivo en el SQL Editor de Supabase y
-- ejecútalo una sola vez. Es idempotente: si la corres dos veces no rompe nada.
--
-- Qué hace:
--   1. Agrega la columna `role` a `profiles` (user | admin).
--   2. Crea la tabla `fighters` (perfil completo de peleador, 1 por usuario).
--   3. Crea la función `is_admin()` y el trigger de `updated_at`.
--   4. Activa RLS con políticas: cada quien gestiona su ficha, el público ve
--      solo peleadores aprobados, y el admin gestiona todo.
--   5. Crea el bucket de Storage `fighters` para las fotos de perfil.
-- ═══════════════════════════════════════════════════════════════════════════


-- ───────────────────────────────────────────────────────────────────────────
-- 1. PROFILES: columna de rol (el dashboard distingue admin vs peleador)
-- ───────────────────────────────────────────────────────────────────────────
alter table public.profiles
  add column if not exists role text not null default 'user'
  check (role in ('user', 'admin'));

-- Para convertir tu usuario en admin, corre (con tu email):
-- update public.profiles set role = 'admin' where email = 'tu-email@gmail.com';


-- ───────────────────────────────────────────────────────────────────────────
-- 2. FIGHTERS: la base de datos del roster de Legión
-- ───────────────────────────────────────────────────────────────────────────
create table if not exists public.fighters (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.profiles(id) on delete cascade,

  -- Identidad
  full_name text not null,
  nickname text,
  birth_date date not null,
  gender text not null check (gender in ('masculino', 'femenino')),
  nationality text not null default 'VE',          -- código ISO-2 (VE, CO, BR...)
  city text,
  state text,
  phone text not null,
  instagram text,

  -- Disciplina
  discipline text not null check (discipline in ('mma', 'bjj', 'ambas')),
  experience_level text not null default 'amateur'
    check (experience_level in ('amateur', 'profesional')),
  bjj_belt text check (bjj_belt in ('blanca', 'azul', 'violeta', 'marron', 'negra')),
  years_training integer check (years_training >= 0),

  -- Datos físicos (estilo ficha UFC)
  weight_kg numeric(5, 2) not null check (weight_kg between 30 and 200),
  height_cm numeric(5, 1) check (height_cm between 120 and 230),
  reach_cm numeric(5, 1) check (reach_cm between 120 and 240),
  stance text check (stance in ('ortodoxo', 'zurdo', 'ambidiestro')),
  weight_class text,                               -- división (Peso Ligero, etc.)

  -- Equipo
  team text,
  coach_name text,

  -- Récord (separado para poder calcular % de finalización como la UFC)
  wins integer not null default 0 check (wins >= 0),
  losses integer not null default 0 check (losses >= 0),
  draws integer not null default 0 check (draws >= 0),
  no_contests integer not null default 0 check (no_contests >= 0),
  wins_ko integer not null default 0 check (wins_ko >= 0),
  wins_sub integer not null default 0 check (wins_sub >= 0),
  wins_dec integer not null default 0 check (wins_dec >= 0),

  -- Salud y emergencia (requisito típico de una asociación de peleadores)
  emergency_contact_name text not null,
  emergency_contact_phone text not null,
  blood_type text check (blood_type in ('A+','A-','B+','B-','AB+','AB-','O+','O-')),
  medical_conditions text,

  -- Media y estado dentro de la liga
  photo_url text,
  status text not null default 'pendiente'
    check (status in ('pendiente', 'aprobado', 'rechazado', 'inactivo')),

  created_at timestamptz not null default (now() at time zone 'utc'),
  updated_at timestamptz not null default (now() at time zone 'utc')
);

create index if not exists fighters_status_idx on public.fighters (status);
create index if not exists fighters_discipline_idx on public.fighters (discipline);


-- ───────────────────────────────────────────────────────────────────────────
-- 3. FUNCIONES Y TRIGGERS
-- ───────────────────────────────────────────────────────────────────────────

-- ¿El usuario autenticado es admin? (security definer para poder usarla
-- dentro de políticas RLS sin chocar con las políticas de profiles)
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- Mantener updated_at al día en cada UPDATE
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = (now() at time zone 'utc');
  return new;
end;
$$;

drop trigger if exists fighters_set_updated_at on public.fighters;
create trigger fighters_set_updated_at
  before update on public.fighters
  for each row
  execute function public.set_updated_at();


-- ───────────────────────────────────────────────────────────────────────────
-- 4. ROW LEVEL SECURITY
-- ───────────────────────────────────────────────────────────────────────────
alter table public.fighters enable row level security;

-- El peleador ve su propia ficha
drop policy if exists "fighters_select_own" on public.fighters;
create policy "fighters_select_own"
  on public.fighters for select
  to authenticated
  using (auth.uid() = user_id);

-- Cualquiera (incluso sin sesión) ve los peleadores aprobados → roster público
drop policy if exists "fighters_select_approved" on public.fighters;
create policy "fighters_select_approved"
  on public.fighters for select
  to anon, authenticated
  using (status = 'aprobado');

-- El peleador crea su propia ficha (una sola, lo garantiza el unique user_id)
drop policy if exists "fighters_insert_own" on public.fighters;
create policy "fighters_insert_own"
  on public.fighters for insert
  to authenticated
  with check (auth.uid() = user_id);

-- El peleador edita su propia ficha
drop policy if exists "fighters_update_own" on public.fighters;
create policy "fighters_update_own"
  on public.fighters for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- El admin puede todo (ver, aprobar, rechazar, borrar)
drop policy if exists "fighters_admin_all" on public.fighters;
create policy "fighters_admin_all"
  on public.fighters for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());


-- ───────────────────────────────────────────────────────────────────────────
-- 5. STORAGE: bucket público `fighters` para fotos de perfil
--    Cada usuario solo puede subir/editar archivos dentro de su carpeta
--    ({user_id}/foto.jpg); la lectura es pública para mostrar el roster.
-- ───────────────────────────────────────────────────────────────────────────
insert into storage.buckets (id, name, public)
values ('fighters', 'fighters', true)
on conflict (id) do nothing;

drop policy if exists "fighters_photos_public_read" on storage.objects;
create policy "fighters_photos_public_read"
  on storage.objects for select
  using (bucket_id = 'fighters');

drop policy if exists "fighters_photos_insert_own" on storage.objects;
create policy "fighters_photos_insert_own"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'fighters'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "fighters_photos_update_own" on storage.objects;
create policy "fighters_photos_update_own"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'fighters'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "fighters_photos_delete_own" on storage.objects;
create policy "fighters_photos_delete_own"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'fighters'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- ═══════════════════════════════════════════════════════════════════════════
-- FIN. Después de correr esto:
--   1. update public.profiles set role = 'admin' where email = 'tu-email';
--   2. Listo — el dashboard de la web ya funciona contra estas tablas.
-- ═══════════════════════════════════════════════════════════════════════════
