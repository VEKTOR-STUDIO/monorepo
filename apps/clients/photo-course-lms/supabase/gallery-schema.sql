-- ============================================================================
-- Fotografía como Expresión del Ser — Esquema de la galería
-- (Supabase / Postgres)
--
-- SQL 100% ADITIVO: solo crea la tabla `gallery_posts`, el bucket `gallery`
-- y sus políticas. No modifica ninguna tabla existente, por lo que es seguro
-- ejecutarlo en el proyecto Supabase actual (compartido con RollPrep).
-- Cuando esta app tenga su propio proyecto Supabase, ejecutar este mismo
-- archivo allí y actualizar las llaves en .env.local.
--
-- Ejecutar en el SQL Editor de Supabase.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. GALLERY_POSTS
-- Cada publicación: URL pública de la imagen, ruta interna en el bucket
-- (para poder borrarla luego) y el texto breve que la acompaña.
-- ----------------------------------------------------------------------------
create table if not exists public.gallery_posts (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  image_path text not null,
  description text not null check (char_length(description) between 1 and 280),
  author_name text check (author_name is null or char_length(author_name) between 1 and 40),
  created_at timestamptz not null default now()
);

-- Migración segura si la tabla ya existía sin la columna de autor.
alter table public.gallery_posts
  add column if not exists author_name text
  check (author_name is null or char_length(author_name) between 1 and 40);

create index if not exists gallery_posts_created_idx
  on public.gallery_posts (created_at desc);

-- ----------------------------------------------------------------------------
-- 2. ROW LEVEL SECURITY
-- La galería es pública: cualquiera lee y cualquiera publica (los
-- participantes del taller no tienen cuenta). Nadie edita ni borra desde el
-- cliente; la moderación queda para el service role / SQL Editor.
-- ----------------------------------------------------------------------------
alter table public.gallery_posts enable row level security;

drop policy if exists "gallery_posts_public_select" on public.gallery_posts;
create policy "gallery_posts_public_select" on public.gallery_posts
  for select to anon, authenticated using (true);

drop policy if exists "gallery_posts_public_insert" on public.gallery_posts;
create policy "gallery_posts_public_insert" on public.gallery_posts
  for insert to anon, authenticated
  with check (char_length(description) between 1 and 280);

-- ----------------------------------------------------------------------------
-- 3. STORAGE — bucket público "gallery"
-- Lectura pública; subida anónima limitada a la carpeta uploads/, a 5 MB
-- y a formatos de imagen (el límite también se valida en la Server Action,
-- esto es la red de seguridad a nivel de plataforma).
-- ----------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'gallery',
  'gallery',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update
  set public = true,
      file_size_limit = 5242880,
      allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

drop policy if exists "gallery_public_read" on storage.objects;
create policy "gallery_public_read" on storage.objects
  for select using (bucket_id = 'gallery');

drop policy if exists "gallery_public_upload" on storage.objects;
create policy "gallery_public_upload" on storage.objects
  for insert to anon, authenticated
  with check (
    bucket_id = 'gallery'
    and (storage.foldername(name))[1] = 'uploads'
  );

-- ----------------------------------------------------------------------------
-- 4. ADMINISTRADOR (moderación de la galería)
-- El borrado se hace desde /admin con el service role (no requiere políticas
-- de delete). El acceso a /admin exige un usuario con role = 'admin' en
-- public.profiles.
--
-- En este proyecto Supabase (compartido con RollPrep) la tabla `profiles`,
-- la función `is_admin()` y el trigger que crea el perfil al registrarse YA
-- EXISTEN (ver schema.sql). Los bloques de abajo son idempotentes: no cambian
-- nada si ya existen, y dejan este archivo autocontenido para cuando la app
-- tenga su propio proyecto Supabase.
-- ----------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role text not null default 'student' check (role in ('admin', 'student')),
  full_name text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Para promover al facilitador del taller a administrador, ejecutar
-- (después de que inicie sesión por primera vez en /signin):
--
--   insert into public.profiles (id, role, full_name)
--   select id, 'admin', coalesce(raw_user_meta_data ->> 'full_name', email)
--   from auth.users
--   where lower(email) = 'CORREO_DEL_FACILITADOR@ejemplo.com'
--   on conflict (id) do update set role = 'admin';
