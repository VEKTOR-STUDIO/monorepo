-- ═══════════════════════════════════════════════════════════════════════════
-- LEGIÓN MMA — Migración 003: Datos del atleta (requerimientos de la liga)
-- Fecha: 2026-06-14
--
-- Cómo correrla: pega TODO este archivo en el SQL Editor de Supabase y
-- ejecútalo una sola vez. Es idempotente: si la corres dos veces no rompe nada
-- ni borra datos de los peleadores ya registrados.
--
-- Qué hace:
--   1. Agrega a `fighters` los campos que pidió Legión y que faltaban:
--      cédula/pasaporte + foto, récord amateur, estilo de combate y tallas
--      (short, franela, guante, franela del entrenador).
--   2. Crea el bucket PRIVADO `fighter-documents` para la foto de la cédula
--      (es un documento sensible: NO debe ser público como las fotos de perfil).
-- ═══════════════════════════════════════════════════════════════════════════


-- ───────────────────────────────────────────────────────────────────────────
-- 1. NUEVAS COLUMNAS EN fighters
--    El récord profesional de MMA sigue siendo wins / losses / draws (ya
--    existían). Aquí agregamos el récord AMATEUR aparte.
-- ───────────────────────────────────────────────────────────────────────────
alter table public.fighters
  -- Identificación
  add column if not exists id_document_number text,            -- cédula o pasaporte
  add column if not exists id_document_url text,                -- ruta de la foto de la cédula (bucket privado)

  -- Estilo de combate (texto libre: Striker, Grappler, Luchador, etc.)
  add column if not exists fighting_style text,

  -- Récord amateur (el profesional es wins/losses/draws)
  add column if not exists amateur_wins integer not null default 0 check (amateur_wins >= 0),
  add column if not exists amateur_losses integer not null default 0 check (amateur_losses >= 0),
  add column if not exists amateur_draws integer not null default 0 check (amateur_draws >= 0),

  -- Tallas (uniforme del peleador y del entrenador de esquina)
  add column if not exists short_size text,
  add column if not exists shirt_size text,
  add column if not exists glove_size text,
  add column if not exists coach_shirt_size text;


-- ───────────────────────────────────────────────────────────────────────────
-- 2. STORAGE: bucket PRIVADO `fighter-documents` para la foto de la cédula
--    A diferencia del bucket `fighters` (público, para el roster), este es
--    privado: solo el dueño de la ficha y el admin pueden leer el documento.
--    La lectura se hace con URLs firmadas (createSignedUrl) desde la app.
-- ───────────────────────────────────────────────────────────────────────────
insert into storage.buckets (id, name, public)
values ('fighter-documents', 'fighter-documents', false)
on conflict (id) do nothing;

-- El dueño lee su propio documento (carpeta = {user_id}/...)
drop policy if exists "fighter_docs_select_own" on storage.objects;
create policy "fighter_docs_select_own"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'fighter-documents'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- El admin puede leer cualquier documento
drop policy if exists "fighter_docs_select_admin" on storage.objects;
create policy "fighter_docs_select_admin"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'fighter-documents' and public.is_admin());

-- El dueño sube su propio documento
drop policy if exists "fighter_docs_insert_own" on storage.objects;
create policy "fighter_docs_insert_own"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'fighter-documents'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- El dueño actualiza/reemplaza su propio documento
drop policy if exists "fighter_docs_update_own" on storage.objects;
create policy "fighter_docs_update_own"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'fighter-documents'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- El dueño borra su propio documento
drop policy if exists "fighter_docs_delete_own" on storage.objects;
create policy "fighter_docs_delete_own"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'fighter-documents'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- ═══════════════════════════════════════════════════════════════════════════
-- FIN. No requiere pasos adicionales: la app ya escribe y lee estos campos.
-- ═══════════════════════════════════════════════════════════════════════════
