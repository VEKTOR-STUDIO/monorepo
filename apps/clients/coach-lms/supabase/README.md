# Supabase — Frank Manzano

Este proyecto **no** está conectado por MCP ni por la CLI, así que el esquema se
entrega como SQL para pegar en el **SQL Editor** del dashboard de Supabase.

## Son dos archivos, en este orden

```
1)  migrations/20260911100000_esquema_completo.sql   ← toda la base de datos
2)  seeds/exercise_library_seed.sql                  ← los 302 ejercicios
```

Nada más. Los dos son **idempotentes**: volver a ejecutarlos no rompe nada ni
borra datos. Verificado contra PostgreSQL 16 (creación limpia + segunda pasada +
pruebas de RLS, gamificación y cupos de clase).

## Qué crea cada uno

**`20260911100000_esquema_completo.sql`** — 20 tablas:

| Bloque | Tablas |
|--------|--------|
| Cuentas | `profiles` (con rol, alta automática al registrarse) |
| Landing | `disciplines`, `leads`, `elite_leads`, `manifesto_posts` |
| Citas | `services`, `appointments` |
| Contenido | `programs`, `workouts`, `exercises`, `videos` |
| Libro | `exercise_library` |
| Entrenamiento | `program_assignments`, `workout_logs`, `exercise_logs` |
| Gamificación | `athlete_stats`, `achievements`, `athlete_achievements` |
| Clases | `classes`, `class_bookings` |

Incluye las políticas RLS, los triggers de XP/racha/medallas, las funciones de
ranking y contenido de ejemplo para que la web no se vea vacía.

**`seeds/exercise_library_seed.sql`** — los 302 ejercicios del libro, en español,
con su animación. Está **generado** por `scripts/build-exercise-catalog.mjs`: no
lo edites a mano, vuelve a ejecutar el script.

## Antes de ejecutar

Abre la migración y busca `>>> CAMBIA ESTE CORREO POR EL DE FRANK <<<`. Si no lo
cambias, Frank entrará como alumno normal y no verá el panel de entrenador.

Si ya se registró antes de que lo cambies:

```sql
update public.profiles set role = 'admin' where email = 'su-correo@ejemplo.com';
```

## Después

Activa los proveedores de login y las Redirect URLs. El detalle completo está en
[`docs/SISTEMA_ENTRENAMIENTO.md`](../docs/SISTEMA_ENTRENAMIENTO.md).
