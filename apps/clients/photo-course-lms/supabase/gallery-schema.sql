-- ============================================================================
-- Fotografía como Expresión del Ser — Esquema de la galería
-- (Supabase / Postgres)
--
-- SQL 100% ADITIVO: solo crea las tablas `gallery_posts`/`gallery_concepts`,
-- el bucket `gallery` y sus políticas. No modifica ninguna tabla existente
-- de otras apps, por lo que es seguro ejecutarlo en el proyecto Supabase
-- actual (compartido con RollPrep). Cuando esta app tenga su propio proyecto
-- Supabase, ejecutar este mismo archivo allí y actualizar las llaves en
-- .env.local.
--
-- Este archivo siempre refleja el ESTADO FINAL completo del esquema (sirve
-- para levantar la base desde cero). Para aplicar solo los cambios de una
-- sesión puntual sobre una base que ya tenía una versión anterior, ver
-- supabase/migrations/ (p. ej. 20260713_rich_text_and_concepts.sql).
--
-- Ejecutar en el SQL Editor de Supabase.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. GALLERY_POSTS
-- Cada publicación: URL pública de la imagen, ruta interna en el bucket
-- (para poder borrarla luego) y el texto que la acompaña.
-- ----------------------------------------------------------------------------
create table if not exists public.gallery_posts (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  image_path text not null,
  description text not null check (char_length(description) >= 1),
  author_name text check (author_name is null or char_length(author_name) between 1 and 40),
  created_at timestamptz not null default now()
);

-- Migración segura si la tabla ya existía sin la columna de autor.
alter table public.gallery_posts
  add column if not exists author_name text
  check (author_name is null or char_length(author_name) between 1 and 40);

-- Migración: la descripción ahora admite texto enriquecido (HTML) sin
-- límite de caracteres. Se quita el tope de 280 que tenía el check
-- constraint original; se conserva solo la validación de "no vacío".
-- El sanitizado de las etiquetas HTML permitidas se hace en la Server
-- Action (ver app/actions.js), no aquí, porque Postgres no valida HTML.
alter table public.gallery_posts
  drop constraint if exists gallery_posts_description_check;
alter table public.gallery_posts
  add constraint gallery_posts_description_check check (char_length(description) >= 1);

create index if not exists gallery_posts_created_idx
  on public.gallery_posts (created_at desc);

-- ----------------------------------------------------------------------------
-- 2. GALLERY_CONCEPTS
-- Los "conceptos" del taller (p. ej. "masa confusa") a los que se asocia
-- cada foto. Rafael los va revelando de a poco para que los participantes
-- no los conozcan todos de una: cada concepto se revela a mano
-- (`is_revealed`) o automáticamente al llegar `reveal_at`. Las fotos
-- subidas antes de este cambio (o sin concepto elegido) tienen
-- `concept_id` null y se agrupan como "General" en la galería.
-- ----------------------------------------------------------------------------
create table if not exists public.gallery_concepts (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 60),
  sort_order integer not null default 0,
  is_revealed boolean not null default false,
  reveal_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists gallery_concepts_sort_idx
  on public.gallery_concepts (sort_order, created_at);

alter table public.gallery_concepts enable row level security;

-- El público (anon/authenticated) solo ve conceptos "efectivamente
-- revelados": los que Rafael marcó a mano o cuya fecha programada ya pasó.
-- El admin (service role) siempre ve todos, sin pasar por RLS.
drop policy if exists "gallery_concepts_public_select" on public.gallery_concepts;
create policy "gallery_concepts_public_select" on public.gallery_concepts
  for select to anon, authenticated
  using (is_revealed or (reveal_at is not null and reveal_at <= now()));

-- Referencia de cada foto a su concepto (null = "General"). Al borrar un
-- concepto, las fotos asociadas no se borran: quedan como "General".
alter table public.gallery_posts
  add column if not exists concept_id uuid references public.gallery_concepts (id) on delete set null;

create index if not exists gallery_posts_concept_idx
  on public.gallery_posts (concept_id);

-- ----------------------------------------------------------------------------
-- 3. ROW LEVEL SECURITY (gallery_posts)
-- La galería es pública: cualquiera lee y cualquiera publica (los
-- participantes del taller no tienen cuenta). Nadie edita ni borra desde el
-- cliente; la moderación queda para el service role / SQL Editor. Solo se
-- puede publicar en un concepto que ya esté revelado (o sin concepto).
-- ----------------------------------------------------------------------------
alter table public.gallery_posts enable row level security;

drop policy if exists "gallery_posts_public_select" on public.gallery_posts;
create policy "gallery_posts_public_select" on public.gallery_posts
  for select to anon, authenticated using (true);

drop policy if exists "gallery_posts_public_insert" on public.gallery_posts;
create policy "gallery_posts_public_insert" on public.gallery_posts
  for insert to anon, authenticated
  with check (
    char_length(description) >= 1
    and (
      concept_id is null
      or exists (
        select 1 from public.gallery_concepts c
        where c.id = concept_id
          and (c.is_revealed or (c.reveal_at is not null and c.reveal_at <= now()))
      )
    )
  );

-- ----------------------------------------------------------------------------
-- 4. STORAGE — bucket público "gallery"
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
-- 5. ADMINISTRADOR (moderación de la galería y de los conceptos)
-- El borrado/gestión se hace desde /admin con el service role (no requiere
-- políticas de update/delete). El acceso a /admin exige un usuario con
-- role = 'admin' en public.profiles.
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
