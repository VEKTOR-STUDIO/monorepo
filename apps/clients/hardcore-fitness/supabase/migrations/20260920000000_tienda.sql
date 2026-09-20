-- =============================================================================
-- Hardcore · esquema de la tienda
--
-- Ejecutar en el SQL Editor del proyecto de Supabase de Hardcore (uno propio,
-- no reutilizar el de otro cliente). Después cargar supabase/seeds/catalogo.sql
-- con los 231 productos del PDF.
--
-- Resumen:
--   perfiles        quién entra y con qué rol (cliente / admin)
--   categorias      taxonomía de la tienda
--   productos       el catálogo, con los tres precios del PDF
--   tasas_cambio    la tasa del BCV del día (la escribe el cron)
--   pedidos         lo que pide el cliente antes de irse a WhatsApp
--   pedido_items    las líneas de cada pedido
--   importaciones   historial de cada PDF importado
-- =============================================================================

create extension if not exists "pgcrypto";

-- -----------------------------------------------------------------------------
-- Perfiles
-- -----------------------------------------------------------------------------
create table if not exists public.perfiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  email       text,
  nombre      text,
  telefono    text,
  rol         text not null default 'cliente' check (rol in ('cliente', 'admin')),
  creado_en   timestamptz not null default now()
);

comment on table public.perfiles is 'Un perfil por usuario de Auth. El rol admin se pone a mano (ver README).';

-- Cada usuario que entra por Google/email estrena perfil automáticamente.
create or replace function public.crear_perfil()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.perfiles (id, email, nombre)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists al_crear_usuario on auth.users;
create trigger al_crear_usuario
  after insert on auth.users
  for each row execute function public.crear_perfil();

-- ¿El que pregunta es del equipo de Hardcore?
-- security definer para poder leer perfiles sin chocar con su propia RLS.
create or replace function public.es_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.perfiles
    where id = auth.uid() and rol = 'admin'
  );
$$;

-- -----------------------------------------------------------------------------
-- Catálogo
-- -----------------------------------------------------------------------------
create table if not exists public.categorias (
  slug     text primary key,
  nombre   text not null,
  familia  text not null default 'otros',
  orden    int  not null default 0
);

create table if not exists public.productos (
  id                 uuid primary key default gen_random_uuid(),
  slug               text unique not null,
  nombre             text not null,
  categoria_slug     text references public.categorias (slug) on delete set null,
  categoria_original text,
  marca              text,
  variaciones        text[] not null default '{}',
  estado             text not null default 'disponible'
                       check (estado in ('disponible', 'transito', 'agotado')),
  -- Los tres precios del PDF, en dólares. El de BCV se cobra en bolívares a la
  -- tasa del día; el de contado es efectivo en divisas; el de pago móvil, en
  -- bolívares por Pago Móvil (sin Cashea).
  precio_bcv         numeric(10, 2),
  precio_contado     numeric(10, 2),
  precio_pago_movil  numeric(10, 2),
  oferta_flash       boolean not null default false,
  destacado          boolean not null default false,
  imagen             text,
  pagina_catalogo    int,
  activo             boolean not null default true,
  creado_en          timestamptz not null default now(),
  actualizado_en     timestamptz not null default now()
);

comment on column public.productos.activo is
  'false = ya no viene en la última lista. No se borra: los pedidos viejos lo referencian.';

create index if not exists productos_categoria_idx on public.productos (categoria_slug);
create index if not exists productos_activo_idx    on public.productos (activo) where activo;
create index if not exists productos_marca_idx     on public.productos (marca);

-- Búsqueda por nombre y marca sin tildes ni mayúsculas.
create extension if not exists "unaccent";
create index if not exists productos_busqueda_idx on public.productos
  using gin (to_tsvector('spanish', coalesce(nombre, '') || ' ' || coalesce(marca, '')));

-- -----------------------------------------------------------------------------
-- Tasa del BCV
-- -----------------------------------------------------------------------------
create table if not exists public.tasas_cambio (
  id           bigint generated always as identity primary key,
  fuente       text not null default 'bcv',
  valor        numeric(14, 6) not null check (valor > 0),
  fecha_valor  date not null,
  obtenida_en  timestamptz not null default now(),
  unique (fuente, fecha_valor)
);

comment on table public.tasas_cambio is
  'Bolívares por dólar publicados por el BCV. La escribe /api/cron/tasa-bcv una vez al día.';

-- -----------------------------------------------------------------------------
-- Pedidos
-- -----------------------------------------------------------------------------
create table if not exists public.pedidos (
  id           uuid primary key default gen_random_uuid(),
  codigo       text unique not null,
  usuario_id   uuid references auth.users (id) on delete set null,
  nombre       text not null,
  telefono     text not null,
  email        text,
  metodo_pago  text not null check (metodo_pago in ('bcv', 'contado', 'pago_movil')),
  entrega      text not null default 'retiro' check (entrega in ('retiro', 'delivery', 'envio')),
  direccion    text,
  nota         text,
  -- Lo que costaba el pedido cuando se hizo, con la tasa de ese momento.
  subtotal     numeric(12, 2) not null default 0,
  tasa_bcv     numeric(14, 6),
  total_bs     numeric(14, 2),
  estado       text not null default 'nuevo'
                 check (estado in ('nuevo', 'confirmado', 'entregado', 'cancelado')),
  creado_en    timestamptz not null default now()
);

create index if not exists pedidos_usuario_idx on public.pedidos (usuario_id);
create index if not exists pedidos_estado_idx  on public.pedidos (estado, creado_en desc);

create table if not exists public.pedido_items (
  id              bigint generated always as identity primary key,
  pedido_id       uuid not null references public.pedidos (id) on delete cascade,
  producto_id     uuid references public.productos (id) on delete set null,
  slug            text not null,
  nombre          text not null,
  variacion       text,
  cantidad        int not null check (cantidad > 0),
  precio_unitario numeric(10, 2) not null,
  subtotal        numeric(12, 2) not null
);

create index if not exists pedido_items_pedido_idx on public.pedido_items (pedido_id);

-- -----------------------------------------------------------------------------
-- Historial de importaciones
-- -----------------------------------------------------------------------------
create table if not exists public.importaciones (
  id            uuid primary key default gen_random_uuid(),
  archivo       text,
  total         int not null default 0,
  nuevos        int not null default 0,
  actualizados  int not null default 0,
  desactivados  int not null default 0,
  usuario_id    uuid references auth.users (id) on delete set null,
  detalle       jsonb,
  creado_en     timestamptz not null default now()
);

-- =============================================================================
-- RLS
--
-- La tienda se lee sin sesión. Escribir el catálogo es cosa del admin.
-- Los pedidos los crea el servidor con la service role (ver app/api/checkout),
-- así que aquí no hace falta abrir ningún insert a anónimos.
-- =============================================================================

alter table public.perfiles      enable row level security;
alter table public.categorias    enable row level security;
alter table public.productos     enable row level security;
alter table public.tasas_cambio  enable row level security;
alter table public.pedidos       enable row level security;
alter table public.pedido_items  enable row level security;
alter table public.importaciones enable row level security;

-- Perfiles: cada quien el suyo; el admin los ve todos.
drop policy if exists perfiles_ver_propio on public.perfiles;
create policy perfiles_ver_propio on public.perfiles
  for select using (id = auth.uid() or public.es_admin());

drop policy if exists perfiles_editar_propio on public.perfiles;
create policy perfiles_editar_propio on public.perfiles
  for update using (id = auth.uid()) with check (id = auth.uid() and rol = 'cliente');

-- Catálogo y tasa: lectura pública.
drop policy if exists categorias_publicas on public.categorias;
create policy categorias_publicas on public.categorias for select using (true);

drop policy if exists productos_publicos on public.productos;
create policy productos_publicos on public.productos for select using (activo or public.es_admin());

drop policy if exists tasas_publicas on public.tasas_cambio;
create policy tasas_publicas on public.tasas_cambio for select using (true);

-- Catálogo: escribe el admin.
drop policy if exists categorias_admin on public.categorias;
create policy categorias_admin on public.categorias for all
  using (public.es_admin()) with check (public.es_admin());

drop policy if exists productos_admin on public.productos;
create policy productos_admin on public.productos for all
  using (public.es_admin()) with check (public.es_admin());

drop policy if exists importaciones_admin on public.importaciones;
create policy importaciones_admin on public.importaciones for all
  using (public.es_admin()) with check (public.es_admin());

-- Pedidos: el cliente ve los suyos, el admin todos y además los gestiona.
drop policy if exists pedidos_ver_propios on public.pedidos;
create policy pedidos_ver_propios on public.pedidos
  for select using (usuario_id = auth.uid() or public.es_admin());

drop policy if exists pedidos_admin on public.pedidos;
create policy pedidos_admin on public.pedidos for update
  using (public.es_admin()) with check (public.es_admin());

drop policy if exists pedido_items_ver on public.pedido_items;
create policy pedido_items_ver on public.pedido_items
  for select using (
    exists (
      select 1 from public.pedidos p
      where p.id = pedido_items.pedido_id
        and (p.usuario_id = auth.uid() or public.es_admin())
    )
  );

-- =============================================================================
-- Almacenamiento de fotos subidas desde el panel
-- =============================================================================
insert into storage.buckets (id, name, public)
values ('productos', 'productos', true)
on conflict (id) do nothing;

drop policy if exists productos_storage_leer on storage.objects;
create policy productos_storage_leer on storage.objects
  for select using (bucket_id = 'productos');

drop policy if exists productos_storage_admin on storage.objects;
create policy productos_storage_admin on storage.objects
  for all using (bucket_id = 'productos' and public.es_admin())
  with check (bucket_id = 'productos' and public.es_admin());
