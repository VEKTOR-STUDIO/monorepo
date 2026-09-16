"use client";

import { useActionState, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import ExerciseBook from "@/components/training/ExerciseBook";
import ExerciseFigure from "@/components/training/ExerciseFigure";
import {
  addExerciseToWorkout,
  createWorkout,
  deleteExercise,
  deleteWorkout,
  moveExercise,
  moveWorkout,
  updateExercise,
  updateProgram,
  updateWorkout,
} from "@/app/admin/actions";

// -----------------------------------------------------------------------------
// Editor de un plan de entrenamiento.
//
// Pensado para que Frank lo use sin manual:
//   * Todo se ve en una sola página, sin pestañas escondidas.
//   * Los cambios se guardan con un botón "Guardar" explícito, no al vuelo:
//     así siempre sabe si quedó grabado o no.
//   * El orden se cambia con flechas ↑ ↓, no arrastrando.
//   * Para añadir un ejercicio se abre el libro entero, con los monigotes.
// -----------------------------------------------------------------------------

const LEVEL_OPTIONS = [
  { value: "todos", label: "Todos los niveles" },
  { value: "principiante", label: "Principiante" },
  { value: "intermedio", label: "Intermedio" },
  { value: "avanzado", label: "Avanzado" },
];

// ------------------------------------------------------------- un ejercicio ---
const ExerciseRow = ({ exercise, workoutId, programId, isFirst, isLast }) => {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: exercise.name || "",
    sets: exercise.sets ?? 3,
    reps: exercise.reps || "",
    restSeconds: exercise.rest_seconds ?? 60,
    targetWeightKg: exercise.target_weight_kg ?? "",
    tempo: exercise.tempo || "",
    description: exercise.description || "",
    videoUrl: exercise.video_url || "",
    supersetGroup: exercise.superset_group || "",
  });

  const run = (work) =>
    startTransition(async () => {
      await work();
      router.refresh();
    });

  const field = (key) => ({
    value: form[key],
    onChange: (event) => setForm({ ...form, [key]: event.target.value }),
  });

  return (
    <li className="border border-base-300 bg-base-100">
      <div className="flex items-center gap-3 p-3">
        <div className="h-14 w-14 shrink-0">
          <ExerciseFigure
            slug={exercise.animation_slug}
            name={exercise.name}
            playing={false}
            className="border border-base-300"
          />
        </div>

        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="min-w-0 flex-1 text-left"
        >
          <span className="block truncate font-bold text-base-content">
            {exercise.name}
          </span>
          <span className="block text-xs text-base-content/50">
            {exercise.sets || "?"} × {exercise.reps || "?"}
            {exercise.rest_seconds ? ` · ${exercise.rest_seconds}s descanso` : ""}
            {exercise.target_weight_kg ? ` · ${exercise.target_weight_kg} kg` : ""}
          </span>
        </button>

        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            disabled={pending || isFirst}
            onClick={() => run(() => moveExercise(exercise.id, workoutId, programId, "up"))}
            className="btn btn-ghost btn-xs"
            aria-label="Subir ejercicio"
          >
            ↑
          </button>
          <button
            type="button"
            disabled={pending || isLast}
            onClick={() =>
              run(() => moveExercise(exercise.id, workoutId, programId, "down"))
            }
            className="btn btn-ghost btn-xs"
            aria-label="Bajar ejercicio"
          >
            ↓
          </button>
          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="btn btn-ghost btn-xs"
            aria-expanded={open}
          >
            {open ? "Cerrar" : "Editar"}
          </button>
        </div>
      </div>

      {open && (
        <div className="space-y-3 border-t border-base-300 bg-base-200/50 p-3">
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            <label className="block sm:col-span-2">
              <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-base-content/50">
                Nombre
              </span>
              <input type="text" {...field("name")} className="input input-bordered input-sm w-full" />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-base-content/50">
                Series
              </span>
              <input type="number" min="1" {...field("sets")} className="input input-bordered input-sm w-full" />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-base-content/50">
                Repeticiones
              </span>
              <input
                type="text"
                placeholder="10-12, 30 s, AMRAP…"
                {...field("reps")}
                className="input input-bordered input-sm w-full"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-base-content/50">
                Descanso (seg)
              </span>
              <input type="number" min="0" {...field("restSeconds")} className="input input-bordered input-sm w-full" />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-base-content/50">
                Peso objetivo (kg)
              </span>
              <input type="number" min="0" step="0.5" {...field("targetWeightKg")} className="input input-bordered input-sm w-full" />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-base-content/50">
                Tempo
              </span>
              <input type="text" placeholder="3-1-1" {...field("tempo")} className="input input-bordered input-sm w-full" />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-base-content/50">
                Bloque (A, B…)
              </span>
              <input type="text" maxLength={2} {...field("supersetGroup")} className="input input-bordered input-sm w-full" />
            </label>
          </div>

          <label className="block">
            <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-base-content/50">
              Indicaciones para el alumno
            </span>
            <textarea rows={2} {...field("description")} className="textarea textarea-bordered textarea-sm w-full" />
          </label>

          <label className="block">
            <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-base-content/50">
              Video propio (opcional)
            </span>
            <input
              type="url"
              placeholder="https://www.youtube.com/watch?v=…"
              {...field("videoUrl")}
              className="input input-bordered input-sm w-full"
            />
          </label>

          <div className="flex gap-2">
            <button
              type="button"
              disabled={pending}
              onClick={() =>
                run(async () => {
                  await updateExercise({ id: exercise.id, programId, ...form });
                  setOpen(false);
                })
              }
              className="btn btn-primary btn-sm"
            >
              Guardar ejercicio
            </button>
            <button
              type="button"
              disabled={pending}
              onClick={() => {
                if (confirm(`¿Quitar "${exercise.name}" de esta sesión?`)) {
                  run(() => deleteExercise(exercise.id, programId));
                }
              }}
              className="btn btn-ghost btn-sm text-error hover:bg-error/10"
            >
              Quitar
            </button>
          </div>
        </div>
      )}
    </li>
  );
};

// --------------------------------------------------------------- una sesión ---
const WorkoutBlock = ({ workout, programId, isFirst, isLast, onAddExercise }) => {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    title: workout.title || "",
    focus: workout.focus || "",
    durationMinutes: workout.duration_minutes ?? "",
    weekNumber: workout.week_number ?? "",
    description: workout.description || "",
  });

  const run = (work) =>
    startTransition(async () => {
      await work();
      router.refresh();
    });

  const field = (key) => ({
    value: form[key],
    onChange: (event) => setForm({ ...form, [key]: event.target.value }),
  });

  return (
    <section className="border border-base-300 bg-base-200/40">
      <div className="flex flex-wrap items-center gap-3 border-b border-base-300 p-4">
        <div className="min-w-0 flex-1">
          <h3 className="display text-2xl text-base-content">{workout.title}</h3>
          <p className="text-xs text-base-content/50">
            {workout.focus || "Sin foco definido"}
            {workout.duration_minutes ? ` · ${workout.duration_minutes} min` : ""}
            {` · ${workout.exercises.length} ${
              workout.exercises.length === 1 ? "ejercicio" : "ejercicios"
            }`}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            disabled={pending || isFirst}
            onClick={() => run(() => moveWorkout(workout.id, programId, "up"))}
            className="btn btn-ghost btn-sm"
            aria-label="Subir sesión"
          >
            ↑
          </button>
          <button
            type="button"
            disabled={pending || isLast}
            onClick={() => run(() => moveWorkout(workout.id, programId, "down"))}
            className="btn btn-ghost btn-sm"
            aria-label="Bajar sesión"
          >
            ↓
          </button>
          <button
            type="button"
            onClick={() => setEditing(!editing)}
            className="btn btn-ghost btn-sm border border-base-300"
          >
            {editing ? "Cerrar" : "Editar"}
          </button>
        </div>
      </div>

      {editing && (
        <div className="space-y-3 border-b border-base-300 bg-base-100 p-4">
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            <label className="block lg:col-span-2">
              <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-base-content/50">
                Nombre de la sesión
              </span>
              <input type="text" {...field("title")} className="input input-bordered input-sm w-full" />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-base-content/50">
                Foco
              </span>
              <input
                type="text"
                placeholder="tren inferior, full body…"
                {...field("focus")}
                className="input input-bordered input-sm w-full"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-base-content/50">
                Duración (min)
              </span>
              <input type="number" min="0" {...field("durationMinutes")} className="input input-bordered input-sm w-full" />
            </label>
          </div>

          <label className="block">
            <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-base-content/50">
              Descripción
            </span>
            <textarea rows={2} {...field("description")} className="textarea textarea-bordered textarea-sm w-full" />
          </label>

          <div className="flex gap-2">
            <button
              type="button"
              disabled={pending}
              onClick={() =>
                run(async () => {
                  await updateWorkout({ id: workout.id, programId, ...form });
                  setEditing(false);
                })
              }
              className="btn btn-primary btn-sm"
            >
              Guardar sesión
            </button>
            <button
              type="button"
              disabled={pending}
              onClick={() => {
                if (confirm(`¿Borrar la sesión "${workout.title}" y sus ejercicios?`)) {
                  run(() => deleteWorkout(workout.id, programId));
                }
              }}
              className="btn btn-ghost btn-sm text-error hover:bg-error/10"
            >
              Borrar sesión
            </button>
          </div>
        </div>
      )}

      <div className="space-y-2 p-4">
        <ul className="space-y-2">
          {workout.exercises.map((exercise, index) => (
            <ExerciseRow
              key={exercise.id}
              exercise={exercise}
              workoutId={workout.id}
              programId={programId}
              isFirst={index === 0}
              isLast={index === workout.exercises.length - 1}
            />
          ))}
        </ul>

        {workout.exercises.length === 0 && (
          <p className="border border-dashed border-base-300 p-6 text-center text-sm text-base-content/50">
            Esta sesión está vacía. Añade el primer ejercicio.
          </p>
        )}

        <button
          type="button"
          onClick={() => onAddExercise(workout.id)}
          className="btn btn-ghost btn-block border border-primary/40 text-primary hover:bg-primary/10"
        >
          + Añadir ejercicio del libro
        </button>
      </div>
    </section>
  );
};

// -------------------------------------------------------------- el editor ---
const ProgramEditor = ({ program, book, filters }) => {
  const router = useRouter();
  const [settingsState, settingsAction, settingsPending] = useActionState(
    updateProgram,
    null
  );
  const [pending, startTransition] = useTransition();
  const [pickerFor, setPickerFor] = useState(null);
  const [showNewWorkout, setShowNewWorkout] = useState(false);
  const [newWorkout, setNewWorkout] = useState({
    title: "",
    focus: "",
    durationMinutes: "",
    weekNumber: "",
  });

  const handleCreateWorkout = (event) => {
    event.preventDefault();
    startTransition(async () => {
      const result = await createWorkout({ programId: program.id, ...newWorkout });
      if (result?.ok) {
        setNewWorkout({ title: "", focus: "", durationMinutes: "", weekNumber: "" });
        setShowNewWorkout(false);
        router.refresh();
      }
    });
  };

  const handlePick = (exercise) => {
    const workoutId = pickerFor;
    setPickerFor(null);
    startTransition(async () => {
      await addExerciseToWorkout({
        workoutId,
        programId: program.id,
        libraryId: exercise.id,
      });
      router.refresh();
    });
  };

  return (
    <div className="space-y-8">
      {/* --------------------------------------------------- datos del plan --- */}
      <section className="border border-base-300 bg-base-200/40 p-4 sm:p-5">
        <h2 className="display mb-4 text-2xl text-base-content">Datos del plan</h2>

        <form action={settingsAction} className="space-y-3">
          <input type="hidden" name="id" value={program.id} />

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block sm:col-span-2">
              <span className="mb-1 block text-sm font-semibold">Nombre</span>
              <input
                type="text"
                name="title"
                defaultValue={program.title}
                required
                className="input input-bordered w-full"
              />
            </label>

            <label className="block sm:col-span-2">
              <span className="mb-1 block text-sm font-semibold">Frase corta</span>
              <input
                type="text"
                name="subtitle"
                defaultValue={program.subtitle || ""}
                placeholder="Construye una base sólida de fuerza"
                className="input input-bordered w-full"
              />
            </label>

            <label className="block">
              <span className="mb-1 block text-sm font-semibold">Nivel</span>
              <select
                name="level"
                defaultValue={program.level || "todos"}
                className="select select-bordered w-full"
              >
                {LEVEL_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-1 block text-sm font-semibold">Tipo</span>
              <input
                type="text"
                name="category"
                defaultValue={program.category || ""}
                placeholder="fuerza, hiit, movilidad…"
                className="input input-bordered w-full"
              />
            </label>

            <label className="block">
              <span className="mb-1 block text-sm font-semibold">Semanas</span>
              <input
                type="number"
                name="duration_weeks"
                min="1"
                defaultValue={program.duration_weeks || ""}
                className="input input-bordered w-full"
              />
            </label>
          </div>

          <label className="block">
            <span className="mb-1 block text-sm font-semibold">Descripción</span>
            <textarea
              name="description"
              rows={3}
              defaultValue={program.description || ""}
              className="textarea textarea-bordered w-full"
            />
          </label>

          <div className="grid gap-2 sm:grid-cols-2">
            <label className="flex items-start gap-3 border border-base-300 p-3">
              <input
                type="checkbox"
                name="is_published"
                defaultChecked={program.is_published}
                className="checkbox checkbox-primary mt-0.5"
              />
              <span>
                <span className="block text-sm font-semibold">Plan activo</span>
                <span className="block text-xs text-base-content/50">
                  Si lo desmarcas, los alumnos dejan de verlo.
                </span>
              </span>
            </label>

            <label className="flex items-start gap-3 border border-base-300 p-3">
              <input
                type="checkbox"
                name="is_public"
                defaultChecked={program.is_public}
                className="checkbox checkbox-primary mt-0.5"
              />
              <span>
                <span className="block text-sm font-semibold">Mostrar en la web pública</span>
                <span className="block text-xs text-base-content/50">
                  Si lo dejas sin marcar, solo lo ven los alumnos a quienes se lo asignes.
                </span>
              </span>
            </label>
          </div>

          {settingsState?.ok && (
            <p className="border border-success/40 bg-success/10 px-3 py-2 text-sm text-success">
              Guardado.
            </p>
          )}
          {settingsState?.error && (
            <p className="border border-error/40 bg-error/10 px-3 py-2 text-sm text-error">
              {settingsState.error}
            </p>
          )}

          <button type="submit" className="btn btn-primary" disabled={settingsPending}>
            {settingsPending ? (
              <span className="loading loading-spinner loading-sm" />
            ) : (
              "Guardar datos del plan"
            )}
          </button>
        </form>
      </section>

      {/* ------------------------------------------------------- sesiones --- */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="display text-2xl text-base-content">Sesiones</h2>
            <p className="text-sm text-base-content/55">
              Cada sesión es un día de entrenamiento con su lista de ejercicios.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowNewWorkout(!showNewWorkout)}
            className="btn btn-primary btn-sm"
          >
            + Nueva sesión
          </button>
        </div>

        {showNewWorkout && (
          <form
            onSubmit={handleCreateWorkout}
            className="grid gap-3 border border-primary/40 bg-primary/5 p-4 sm:grid-cols-4"
          >
            <label className="block sm:col-span-2">
              <span className="mb-1 block text-sm font-semibold">
                Nombre de la sesión
              </span>
              <input
                type="text"
                value={newWorkout.title}
                onChange={(event) =>
                  setNewWorkout({ ...newWorkout, title: event.target.value })
                }
                placeholder="Semana 1 · Día 1 — Full body"
                required
                className="input input-bordered w-full"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-semibold">Foco</span>
              <input
                type="text"
                value={newWorkout.focus}
                onChange={(event) =>
                  setNewWorkout({ ...newWorkout, focus: event.target.value })
                }
                placeholder="tren inferior"
                className="input input-bordered w-full"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-semibold">Minutos</span>
              <input
                type="number"
                min="0"
                value={newWorkout.durationMinutes}
                onChange={(event) =>
                  setNewWorkout({ ...newWorkout, durationMinutes: event.target.value })
                }
                className="input input-bordered w-full"
              />
            </label>
            <button
              type="submit"
              className="btn btn-primary sm:col-span-4"
              disabled={pending}
            >
              {pending ? (
                <span className="loading loading-spinner loading-sm" />
              ) : (
                "Crear sesión"
              )}
            </button>
          </form>
        )}

        {program.workouts.length === 0 && !showNewWorkout && (
          <p className="border border-dashed border-base-300 p-10 text-center text-base-content/60">
            Este plan todavía no tiene sesiones. Empieza creando la primera.
          </p>
        )}

        {program.workouts.map((workout, index) => (
          <WorkoutBlock
            key={workout.id}
            workout={workout}
            programId={program.id}
            isFirst={index === 0}
            isLast={index === program.workouts.length - 1}
            onAddExercise={setPickerFor}
          />
        ))}
      </section>

      {/* ---------------------------------------------------- libro modal --- */}
      {pickerFor && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-base-content/50 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="Elegir ejercicio"
        >
          <div className="my-8 w-full max-w-5xl border border-base-300 bg-base-100 p-5 sm:p-6">
            <div className="mb-4 flex items-center justify-between gap-4">
              <div>
                <h2 className="display text-3xl text-base-content">Libro de ejercicios</h2>
                <p className="text-sm text-base-content/55">
                  Toca un ejercicio para verlo, o pulsa Añadir directamente.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPickerFor(null)}
                className="btn btn-ghost btn-sm"
              >
                Cerrar
              </button>
            </div>

            <ExerciseBook
              exercises={book}
              filters={filters}
              onPick={handlePick}
              pickLabel="Añadir"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgramEditor;
