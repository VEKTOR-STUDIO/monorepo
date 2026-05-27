# Informe completo — Base de datos Francesca D'apuzzo (Supabase)

**Proyecto:** fradap-appointments  
**Fecha del informe:** 18 de febrero de 2026  
**Esquema:** `public`

---

## 1. Migraciones aplicadas (orden cronológico)

| Versión       | Nombre                              | Descripción breve |
|---------------|-------------------------------------|-------------------|
| 20260218215123 | `create_services_table_and_seed`   | Creación tabla `services` + datos iniciales PMU |
| 20260218215153 | `create_appointments_with_services_fk` | Creación tabla `appointments` con FK a `services` y campos PMU |
| 20260218215202 | `add_role_to_profiles`             | Columna `role` en `profiles` (admin/user) |
| 20260218215211 | `appointments_admin_select_policy` | RLS: admins pueden ver todas las citas |
| 20260218215753 | `appointments_admin_update_policy` | RLS: admins pueden actualizar cualquier cita |

---

## 2. Tablas

### 2.1 `profiles`

Extiende `auth.users`. Usada para datos del usuario y rol.

| Columna       | Tipo        | Nullable | Default        | Notas |
|---------------|-------------|----------|----------------|-------|
| id            | uuid        | NO       | —              | PK, FK → auth.users.id |
| name          | text        | SÍ       | —              | |
| email         | text        | SÍ       | —              | |
| image         | text        | SÍ       | —              | URL avatar |
| customer_id    | text        | SÍ       | —              | Stripe (si aplica) |
| price_id      | text        | SÍ       | —              | Stripe (si aplica) |
| has_access    | boolean     | SÍ       | false          | |
| created_at    | timestamptz | SÍ       | now() AT TIME ZONE 'UTC' |
| updated_at    | timestamptz | SÍ       | now() AT TIME ZONE 'UTC' |
| **role**      | text        | SÍ       | **'user'**     | Añadido en migración: `'user'` \| `'admin'` |

**RLS:** Activado. Políticas: SELECT/INSERT/UPDATE/DELETE propias (por `auth.uid() = id`).

---

### 2.2 `services`

Catálogo de servicios PMU. Solo lectura para usuarios autenticados.

| Columna           | Tipo        | Nullable | Default          | Notas |
|-------------------|-------------|----------|------------------|-------|
| id                | uuid        | NO       | gen_random_uuid()| PK |
| name              | text        | NO       | —                | Ej. "Microblading Cejas" |
| description       | text        | SÍ       | —                | |
| price             | numeric     | NO       | —                | decimal(10,2) |
| duration_minutes   | integer     | NO       | —                | |
| image_url         | text        | SÍ       | —                | URL imagen (opcional) |
| created_at        | timestamptz | SÍ       | now()            | |

**RLS:** Activado. Política: `SELECT` para `authenticated` (sin filtro).

**Índices:** Ninguno adicional (tabla pequeña).

---

### 2.3 `appointments`

Citas/sesiones PMU. Relacionadas con `profiles` (cliente) y `services` (servicio elegido).

| Columna           | Tipo        | Nullable | Default             | Notas |
|-------------------|-------------|----------|---------------------|-------|
| id                | uuid        | NO       | gen_random_uuid()   | PK |
| user_id           | uuid        | NO       | —                   | FK → profiles(id) ON DELETE CASCADE |
| **service_id**    | uuid        | SÍ       | —                   | FK → services(id) ON DELETE SET NULL |
| full_name         | text        | NO       | —                   | |
| email             | text        | NO       | —                   | |
| phone             | text        | SÍ       | —                   | |
| company           | text        | SÍ       | —                   | |
| appointment_date  | date        | NO       | —                   | |
| appointment_time  | time        | NO       | —                   | sin time zone |
| timezone          | text        | SÍ       | 'America/Caracas'   | |
| message           | text        | SÍ       | —                   | |
| status            | text        | NO       | 'pending'           | CHECK: pending \| confirmed \| cancelled \| completed |
| **health_notes**  | text        | SÍ       | —                   | Ficha clínica / alergias / notas |
| **has_previous_work** | boolean | SÍ       | false               | Trabajo previo en zona (PMU) |
| **deposit_status**| text        | NO       | 'pending'           | CHECK: pending \| paid |
| created_at        | timestamptz | SÍ       | now()               | |
| updated_at        | timestamptz | SÍ       | now()               | |

**Índices:**

- `idx_appointments_user_id`
- `idx_appointments_status`
- `idx_appointments_date`
- `idx_appointments_service_id`

**RLS:** Activado. Políticas:

- **Usuarios:** SELECT / INSERT / UPDATE / DELETE solo donde `auth.uid() = user_id`.
- **Admins:** SELECT y UPDATE en todas las filas (quien tenga `profiles.role = 'admin'`). INSERT/DELETE siguen siendo por ownership (usuarios) o no definidos para admin.

---

## 3. Datos iniciales (seed) — `services`

| name                 | description                                              | price  | duration_minutes | image_url |
|----------------------|----------------------------------------------------------|--------|------------------|-----------|
| Microblading Cejas   | Técnica de microblading para cejas naturales y definidas.| 350.00 | 120              | null      |
| Baby Lips / Acuarela | Micropigmentación labial estilo acuarela para un look natural. | 380.00 | 150              | null      |
| Retoque Anual        | Sesión de retoque para mantener tu micropigmentación.    | 180.00 | 90               | null      |
| Diseño y Epilación   | Diseño de cejas y epilación con hilo.                    | 45.00  | 40               | null      |

*(IDs son UUID generados en el seed; se pueden consultar con `SELECT id, name FROM public.services`.)*

---

## 4. Resumen de políticas RLS (por tabla)

### `profiles`

- `read_own_profile_data` — SELECT donde `auth.uid() = id`
- `insert_own_profile_data` — INSERT (con restricciones propias del app)
- `update_own_profile_data` — UPDATE donde `auth.uid() = id`
- `delete_own_profile_data` — DELETE donde `auth.uid() = id`

### `services`

- `Services are readable by authenticated users` — SELECT para `authenticated` (todas las filas)

### `appointments`

- `Users can view own appointments` — SELECT donde `auth.uid() = user_id`
- `Users can create own appointments` — INSERT con `auth.uid() = user_id` (WITH CHECK)
- `Users can update own appointments` — UPDATE donde `auth.uid() = user_id`
- `Users can delete own appointments` — DELETE donde `auth.uid() = user_id`
- `Admins can view all appointments` — SELECT si existe perfil con `role = 'admin'`
- `Admins can update any appointment` — UPDATE si existe perfil con `role = 'admin'`

---

## 5. Cómo dar rol admin a un usuario

Desde SQL (por ejemplo en Supabase SQL Editor), con el `email` del usuario:

```sql
UPDATE public.profiles
SET role = 'admin'
WHERE email = 'tu-email@ejemplo.com';
```

O por `id` (uuid del usuario en auth):

```sql
UPDATE public.profiles
SET role = 'admin'
WHERE id = 'uuid-del-usuario';
```

---

## 6. Consultas útiles

- **Servicios para el wizard de reservas:**  
  `SELECT id, name, description, price, duration_minutes, image_url FROM public.services ORDER BY name;`

- **Citas de un usuario con nombre del servicio:**  
  `SELECT a.*, s.name as service_name, s.duration_minutes FROM public.appointments a LEFT JOIN public.services s ON a.service_id = s.id WHERE a.user_id = $user_id ORDER BY a.appointment_date;`

- **Todas las citas (vista admin) con servicio:**  
  `SELECT a.*, s.name as service_name FROM public.appointments a LEFT JOIN public.services s ON a.service_id = s.id ORDER BY a.appointment_date;`

---

*Documento generado a partir del estado actual del proyecto y de las migraciones aplicadas en Supabase.*
