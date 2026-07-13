-- ============================================================================
-- Migración — sesión del 13 de julio de 2026
-- "Fotografía como Expresión del Ser" (Supabase / Postgres)
--
-- Junta los dos cambios hechos en esta sesión sobre una base que todavía
-- tiene el esquema viejo (el de `gallery-schema.sql` antes de hoy):
--
--   1. El texto de cada foto deja de tener el límite de 280 caracteres y
--      pasa a admitir texto enriquecido (HTML sanitizado en el servidor).
--   2. Cada foto se puede asociar a un "concepto" del taller (p. ej. "masa
--      confusa"), que Rafael va revelando de a poco (a mano o programado)
--      desde /admin/conceptos. Las fotos sin concepto quedan como
--      "General".
--
-- Es 100% ADITIVO e IDEMPOTENTE: se puede correr una o varias veces sin
-- romper nada, incluso si ya se corrió antes o si se corre después de
-- `gallery-schema.sql` (que ya incluye este mismo estado final).
--
-- Ejecutar una sola vez en el SQL Editor de Supabase.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. Descripción sin límite de caracteres (antes 280, ahora solo "no vacío")
-- El sanitizado de las etiquetas HTML permitidas se hace en la Server
-- Action (ver app/actions.js), no aquí, porque Postgres no valida HTML.
-- ----------------------------------------------------------------------------
alter table public.gallery_posts
  drop constraint if exists gallery_posts_description_check;
alter table public.gallery_posts
  add constraint gallery_posts_description_check check (char_length(description) >= 1);

-- ----------------------------------------------------------------------------
-- 2. Conceptos del taller (revelado progresivo)
-- Cada concepto se revela a mano (`is_revealed`) o automáticamente al
-- llegar `reveal_at`. El público solo puede ver (y publicar en) conceptos
-- efectivamente revelados; el admin (service role) siempre ve todos.
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
-- 3. La política de insert de gallery_posts ahora también exige que, si se
-- manda un concept_id, ese concepto esté efectivamente revelado (nadie
-- puede publicar en un concepto todavía oculto, ni adivinando su id).
-- ----------------------------------------------------------------------------
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
