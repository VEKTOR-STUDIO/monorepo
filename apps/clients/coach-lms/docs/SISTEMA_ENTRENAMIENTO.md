# Sistema de entrenamiento — Frank Manzano

Frank arma los planes desde la web, se los asigna a sus alumnos, y ellos entran,
ven sus ejercicios con animación, registran lo que hicieron y suben en el ranking.

---

## 1. Puesta en marcha (30 minutos, una sola vez)

### Paso 1 — Ejecutar el SQL en Supabase

El proyecto de Supabase de esta web **no** está conectado por MCP, así que las
migraciones se entregan como archivos para pegar a mano.

Entra a tu proyecto → **SQL Editor** → **New query**. Son **dos archivos**, en
este orden:

| # | Archivo | Qué crea |
|---|---------|----------|
| 1 | `supabase/migrations/20260911100000_esquema_completo.sql` | Toda la base de datos: 20 tablas, RLS, triggers de gamificación, funciones de ranking y contenido de ejemplo. |
| 2 | `supabase/seeds/exercise_library_seed.sql` | **Los 302 ejercicios** del libro, con su animación. |

Los dos son **idempotentes**: si los vuelves a ejecutar no rompen nada ni borran
datos. Está probado contra PostgreSQL 16 — creación limpia, segunda pasada, y las
pruebas de RLS, gamificación y cupos de clase.

> Si prefieres la CLI: `supabase link --project-ref <ref>` y `supabase db push`,
> y luego el seed a mano (los seeds no los aplica `db push`).

### Paso 2 — Hacer admin a Frank

La migración promueve automáticamente a `admin@frankmanzano.com`. Si Frank usa
otro correo, **cámbialo en la migración antes de ejecutarla** (busca el comentario
`>>> CAMBIA ESTE CORREO POR EL DE FRANK <<<`), o promuévelo después:

```sql
update public.profiles set role = 'admin' where email = 'el-correo-de-frank@ejemplo.com';
```

### Paso 3 — Activar el login

En Supabase → **Authentication → Providers**:

- **Email**: actívalo. Si quieres que los alumnos entren **sin esperar un correo
  de confirmación**, pon **Confirm email = off**. (Con él activado, Supabase manda
  el correo desde su SMTP de pruebas, que solo entrega a miembros del proyecto:
  para producción tendrías que configurar un SMTP propio — Resend, por ejemplo.)
- **Google** (opcional pero recomendado, es un clic para el alumno): actívalo y
  pega el Client ID / Secret de Google Cloud.

En **Authentication → URL Configuration**:

- **Site URL**: la URL real de la web.
- **Redirect URLs**: añade `https://TU-DOMINIO/api/auth/callback` y, para
  desarrollo, `http://localhost:3000/api/auth/callback`.

### Paso 4 — Variables de entorno

Ya están en `.env.local`. Asegúrate de que `NEXT_PUBLIC_LANDING_ONLY=false`, o
toda el área privada redirige a la portada.

---

## 2. Cómo lo usa Frank

Entra con su correo y aterriza en **`/admin`**.

| Sección | Para qué |
|---------|----------|
| **Resumen** | Cuántos alumnos hay, sesiones de la semana y lo último que han entrenado (con sus notas). |
| **Alumnos** | La lista. Al entrar en uno: sus cifras, asignarle un plan, su ficha y notas privadas, y todo su historial. |
| **Planes** | Crear un plan → añadir sesiones → añadir ejercicios a cada sesión eligiéndolos del libro. |
| **Ejercicios** | El libro completo (302 con animación) y la opción de añadir los suyos. |
| **Clases** | Clases con día, hora y cupo. Los alumnos se apuntan solos. |
| **Citas y solicitudes** | Lo que ya existía: reservas, formulario "elite" y notas del manifiesto. |

**El flujo normal es:** crear el plan una vez → asignárselo a los alumnos que
toque. El mismo plan sirve para varios alumnos.

Detalles pensados para que lo use sin manual:

- Todo se guarda con un botón **Guardar** explícito, nunca al vuelo.
- El orden de sesiones y ejercicios se cambia con flechas ↑ ↓, no arrastrando.
- Un plan nuevo nace **privado**: solo lo ven los alumnos a quienes se lo asigne.
  Si quiere que salga en la web pública, marca *"Mostrar en la web pública"*.

---

## 3. Cómo lo usa un alumno

Se registra desde **Área atletas** y entra en **`/dashboard`**.

| Sección | Qué hace |
|---------|----------|
| **Inicio** | Su nivel, XP, racha y **cuál es su próxima sesión**, con un botón para empezarla. |
| **Mi plan** | El plan completo, con las sesiones ya hechas marcadas con ✓. |
| **Sesión** | La pantalla de entrenar: cada ejercicio con su **animación**, sus series marcables, cronómetro de descanso y el registro al terminar. |
| **Ejercicios** | El libro completo, buscable, para ver cómo se hace cualquier movimiento. |
| **Clases** | Apuntarse y anular. |
| **Ranking** | Histórico y del mes. |
| **Medallas** | Las conseguidas y las que faltan. |
| **Mis datos** | Nombre, teléfono, objetivo y **salir del ranking** si no quiere aparecer. |

Al registrar una sesión solo se le piden **dos cosas**: cuántos minutos entrenó y
qué tan dura estuvo. Los kilos y las repeticiones son opcionales: si solo marca
las series, la sesión cuenta igual.

---

## 4. Gamificación

El XP **no** lo calcula la web: lo calcula la base de datos con un trigger al
insertar en `workout_logs`. Así el número es el mismo venga de donde venga.

**Por sesión:**

```
  50 XP  sesión completada   (25 si la marcó como parcial)
+  1 XP  por minuto entrenado, hasta un máximo de 60
+ 25 XP  si mantiene la racha (entrenó ayer)
```

**Niveles:** el nivel N empieza en `(N-1)² × 100` XP.
Nivel 2 = 100 · Nivel 3 = 400 · Nivel 4 = 900 · Nivel 5 = 1.600… (tope: 50).

**Racha:** sube si entrenó ayer, se mantiene si ya entrenó hoy, se reinicia si
pasó más de un día. Cargar una sesión con fecha atrasada no rompe la racha actual.

**Medallas:** 16 en el catálogo (sesiones, racha, minutos y nivel). Se desbloquean
solas y dan XP extra. Para cambiarlas o añadir más, toca la tabla `achievements`.

**Ranking:** dos vistas, histórico y mes en curso. Solo salen los alumnos con
`show_in_ranking = true` (lo controla cada uno desde *Mis datos*). Se sirve por
las funciones `get_leaderboard()` y `get_my_rank()`, que son `SECURITY DEFINER`:
así nadie puede leer la tabla de perfiles ajenos para construirse el ranking por
su cuenta.

Para cambiar la economía de XP, edita `public.apply_workout_log()` en la
migración — la fórmula está comentada justo encima.

---

## 5. Las animaciones ("los monigotes")

Se usa **[@bryllim/workout-guide](https://github.com/bryllim/workout-guide)**:
302 ejercicios × 3 fotogramas transparentes de 512 × 512. Encadenando
1 → 2 → 3 → 2 se ve el movimiento completo.

- **Las imágenes se sirven desde el CDN de jsDelivr**, no están en el repositorio
  (pesan 33 MB). Ver `libs/exercise-animation.js`.
- El componente `components/training/ExerciseFigure.js` hace la animación y
  **respeta "reducir movimiento"** del sistema: en ese caso muestra el fotograma
  central, que es el que mejor explica el ejercicio.
- Son figuras blancas sobre transparente, así que quedan perfectas sobre el tema
  oscuro de la web.

### Licencia — importante

| Parte | Licencia |
|-------|----------|
| Código del paquete | MIT |
| **Ilustraciones** | **CC BY-SA 4.0** — Bryl Lim, derivadas de [Everkinetic](https://github.com/everkinetic/data) |

CC BY-SA 4.0 **exige atribución**. Ya está puesta al pie del libro de ejercicios
(`components/training/ExerciseBook.js`): **no la quites**. Si algún día se
rediseñan las figuras, el resultado también tendría que ir bajo CC BY-SA 4.0.

### Servirlas desde el propio dominio (opcional)

Si prefieres no depender del CDN:

```bash
cp -r node_modules/@bryllim/workout-guide/assets public/ejercicios
```

y en `libs/exercise-animation.js` cambia `ANIMATION_BASE` por `"/ejercicios"`.

### Regenerar el catálogo

Si el paquete publica ejercicios nuevos:

```bash
pnpm add -D @bryllim/workout-guide@latest
node scripts/build-exercise-catalog.mjs
```

Regenera `libs/exercise-catalog.json` y `supabase/seeds/exercise_library_seed.sql`,
y avisa por consola de los que falten traducir en `scripts/exercise-names-es.mjs`.

---

## 6. Modelo de datos

```
profiles ─┬─< program_assignments >─ programs ─< workouts ─< exercises ─> exercise_library
          ├─< workout_logs ─< exercise_logs                                  (el libro)
          ├─  athlete_stats            (XP, nivel, racha — se actualiza sola)
          ├─< athlete_achievements >─ achievements
          └─< class_bookings >─ classes
```

| Tabla | Para qué |
|-------|----------|
| `exercise_library` | El libro: catálogo maestro con animación, músculo, material y claves técnicas. |
| `programs` | Un plan. `is_public` decide si sale en la web pública. |
| `workouts` | Una sesión dentro del plan. |
| `exercises` | Un ejercicio prescrito: series, reps, descanso, peso objetivo. |
| `program_assignments` | Qué alumno tiene qué plan, desde cuándo y con qué nota. |
| `workout_logs` | "Hice esta sesión": fecha, minutos, esfuerzo, notas. |
| `exercise_logs` | El detalle serie a serie. |
| `athlete_stats` | XP, nivel, racha y totales. |
| `achievements` / `athlete_achievements` | Catálogo de medallas y las conseguidas. |
| `classes` / `class_bookings` | Clases con cupo e inscripciones. |

### Quién ve qué (RLS) — probado contra PostgreSQL 16

| | Visitante sin cuenta | Alumno | Frank (admin) |
|---|---|---|---|
| Planes públicos | ✅ | ✅ | ✅ |
| Planes privados | ❌ | solo los suyos | ✅ todos |
| Libro de ejercicios | ❌ | ✅ | ✅ |
| Sus registros | ❌ | solo los suyos | ✅ todos |
| Notas del entrenador | ❌ | ❌ | ✅ |
| Ranking | ❌ | ✅ | ✅ |

Además, un alumno **no puede** ascenderse a admin ni editarse su nivel, sus notas
de entrenador ni su estado de activo: hay triggers que lo impiden aunque toque el
formulario desde el navegador.

---

## 7. Qué queda por decidir

- **`config.js` sigue con `yourdomain.com`.** Hay que poner el dominio real, y con
  él el `siteUrl`, los correos de Resend y el Site URL de Supabase.
- **Correo de confirmación:** mientras no haya SMTP propio configurado en
  Supabase, lo más práctico es dejar *Confirm email* en off.
- **Stripe** está en el proyecto pero sin planes configurados. Si algún día se
  cobra por la plataforma, `profiles.has_access` ya existe para eso.
