-- ============================================================================
-- RollPrep — Migración: INVITACIONES CAOS (convocatorias a los eventos)
-- Ejecutar en el SQL Editor de Supabase (o via `supabase db push`).
-- Es idempotente: se puede correr varias veces.
--
-- Un torneo CAOS se anuncia antes de existir como bracket: primero se convoca
-- (qué es, cuándo, dónde), y el día del evento se arma el bracket con quien
-- llegó. Por eso la invitación es su propia tabla y no una columna de
-- `tournaments`: nace semanas antes, se comparte por fuera de la app y no
-- todos los convocados tienen cuenta.
--
-- Agrega:
--   1. caos_invites          → la convocatoria (fecha, sede, texto, CTA)
--   2. caos_invite_sends     → a quién se le mandó el correo y cómo salió
--   3. caos_invites_public   → vista para anon: la página pública del evento
--                              y el flyer que se descarga para las stories
--
-- Reglas de acceso: solo el profesor (admin) crea y edita. Los alumnos ven
-- todas; anon solo las marcadas como públicas, y sin saber quién las creó.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. CAOS_INVITES
--    `slug` es la llave pública: vive en el link que se comparte y en la URL
--    del flyer, así que se genera una vez al crear y NO se regenera al editar
--    el título — si cambiara, los links ya repartidos quedarían muertos.
--
--    `sent_at` es el único rastro del correo: null = todavía no ha salido.
--    `is_public` es independiente del correo — el flyer y la página del evento
--    se comparten por WhatsApp e Instagram mucho antes de que exista Resend.
-- ----------------------------------------------------------------------------
create table if not exists public.caos_invites (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9-]+$'),
  title text not null check (char_length(btrim(title)) between 1 and 60),
  -- Gancho corto que va debajo del título en el flyer.
  tagline text check (char_length(tagline) <= 90),
  -- De qué va el evento. Se recorta en el flyer; completo en correo y página.
  description text check (char_length(description) <= 700),
  starts_at timestamptz not null,
  location text check (char_length(location) <= 60),
  map_url text check (char_length(map_url) <= 500),
  cta_url text check (char_length(cta_url) <= 500),
  cta_label text check (char_length(cta_label) <= 24),
  outfit text not null default 'nogi' check (outfit in ('nogi', 'gi')),
  event_type text not null default 'circuit'
    check (event_type in ('class', 'circuit')),
  -- Cupos del bracket (se llena con potencias de 2, pero no se fuerza aquí).
  slots integer check (slots between 2 and 128),
  -- Texto libre: "Gratis", "5 $", "Socios gratis". No es un número: cambia
  -- de moneda y de forma según el evento.
  price text check (char_length(price) <= 30),
  is_public boolean not null default true,
  sent_at timestamptz,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists caos_invites_starts_at_idx
  on public.caos_invites (starts_at desc);

alter table public.caos_invites enable row level security;

grant select, insert, update, delete on public.caos_invites to authenticated;

-- Todo el gym ve las convocatorias (son un anuncio, no un secreto).
drop policy if exists "caos_invites_select" on public.caos_invites;
create policy "caos_invites_select" on public.caos_invites
  for select to authenticated using (true);

drop policy if exists "caos_invites_admin_write" on public.caos_invites;
create policy "caos_invites_admin_write" on public.caos_invites
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- `updated_at` se usa para romper el caché del flyer: cada edición cambia la
-- URL de la imagen y el preview del panel deja de servir la versión vieja.
create or replace function public.touch_caos_invite()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists caos_invite_touch on public.caos_invites;
create trigger caos_invite_touch
  before update on public.caos_invites
  for each row
  execute function public.touch_caos_invite();

-- ----------------------------------------------------------------------------
-- 2. CAOS_INVITE_SENDS
--    Una fila por correo enviado. Sirve para dos cosas: saber a quién ya le
--    llegó (y no volver a escribirle cuando se suma gente nueva a mitad de
--    semana) y ver qué rebotó sin entrar al panel de Resend.
--
--    La llave es (invite_id, email): reenviar sobrescribe la fila, así el log
--    siempre dice cómo terminó el ÚLTIMO intento.
-- ----------------------------------------------------------------------------
create table if not exists public.caos_invite_sends (
  invite_id uuid not null
    references public.caos_invites (id) on delete cascade,
  email text not null,
  -- Null cuando es alguien de fuera del gym (el amigo, el otro gym).
  profile_id uuid references public.profiles (id) on delete set null,
  status text not null default 'sent' check (status in ('sent', 'failed')),
  error text,
  -- Id que devuelve Resend, para buscar el correo en su panel.
  provider_id text,
  sent_at timestamptz not null default now(),
  primary key (invite_id, email)
);

alter table public.caos_invite_sends enable row level security;

grant select, insert, update, delete on public.caos_invite_sends to authenticated;

-- El log es del profesor: dice a qué correo se le escribió y cuál rebotó.
drop policy if exists "caos_invite_sends_admin" on public.caos_invite_sends;
create policy "caos_invite_sends_admin" on public.caos_invite_sends
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ----------------------------------------------------------------------------
-- 3. CAOS_INVITES_PUBLIC
--    La página del evento y el flyer se abren sin cuenta: es justamente lo que
--    se comparte en la story. Van por una vista para que anon no toque la
--    tabla — no ve las borradas del link público (`is_public` en false), ni
--    quién la creó, ni cuándo salió el correo.
-- ----------------------------------------------------------------------------
drop view if exists public.caos_invites_public;

create view public.caos_invites_public as
select
  i.id,
  i.slug,
  i.title,
  i.tagline,
  i.description,
  i.starts_at,
  i.location,
  i.map_url,
  i.cta_url,
  i.cta_label,
  i.outfit,
  i.event_type,
  i.slots,
  i.price,
  i.updated_at
from public.caos_invites i
where i.is_public;

-- La vista corre con los permisos de su dueño (security_invoker sigue en off),
-- así que atraviesa la RLS de la tabla. Es a propósito: es la única puerta por
-- la que anon ve una invitación, y solo ve estas columnas.
grant select on public.caos_invites_public to anon, authenticated;

-- PostgREST se entera de la tabla y la vista nuevas de una vez.
notify pgrst, 'reload schema';
