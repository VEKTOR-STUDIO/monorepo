"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ExerciseFigure from "@/components/training/ExerciseFigure";
import { logWorkout } from "@/app/dashboard/actions";

// -----------------------------------------------------------------------------
// Pantalla para hacer la sesión.
//
// Decisiones de diseño pensadas para gente que no vive en el móvil:
//   * Todo en una lista que se baja con el dedo. Nada de asistentes por pasos.
//   * Cada serie es un botón grande: se toca y queda marcada.
//   * Los kilos y las repeticiones son OPCIONALES. Si el alumno solo marca las
//     series, la sesión se registra igual.
//   * El cronómetro de descanso arranca solo al marcar una serie.
// -----------------------------------------------------------------------------

const FIELDS_BY_TYPE = {
  weight_reps: ["reps", "weightKg"],
  bodyweight_reps: ["reps"],
  assisted_bodyweight: ["reps", "weightKg"],
  duration: ["seconds"],
  distance_duration: ["seconds"],
};

const FIELD_LABEL = {
  reps: "reps",
  weightKg: "kg",
  seconds: "seg",
};

const formatClock = (totalSeconds) => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
};

// ---------------------------------------------------------------- descanso ---
// Cuenta atrás contra una hora límite real, no restando de uno en uno: el
// cronómetro de la sesión provoca un re-render cada segundo y un `setTimeout`
// encadenado se reiniciaría antes de llegar a disparar.
// El padre lo remonta con `key` para que cada serie reinicie el descanso.
const RestTimer = ({ seconds, onDone }) => {
  const [left, setLeft] = useState(seconds);
  const done = useRef(onDone);
  done.current = onDone;

  useEffect(() => {
    const deadline = Date.now() + seconds * 1000;
    const tick = () => {
      const remaining = Math.ceil((deadline - Date.now()) / 1000);
      setLeft(remaining);
      if (remaining <= 0) done.current?.();
    };
    const id = setInterval(tick, 250);
    return () => clearInterval(id);
  }, [seconds]);

  return (
    <div className="flex items-center justify-between border border-accent/40 bg-accent/10 px-4 py-3">
      <span className="text-sm font-semibold uppercase tracking-wide text-accent">
        Descanso
      </span>
      <span className="display text-3xl text-accent">{formatClock(Math.max(left, 0))}</span>
      <button
        type="button"
        onClick={onDone}
        className="btn btn-ghost btn-sm text-base-content/60"
      >
        Saltar
      </button>
    </div>
  );
};

// --------------------------------------------------------------- ejercicio ---
const ExerciseCard = ({ exercise, sets, onToggleSet, onChangeField, onRest }) => {
  const fields = FIELDS_BY_TYPE[exercise.exercise_type] || ["reps", "weightKg"];
  const totalSets = Math.max(exercise.sets || 1, 1);
  const done = sets.filter((set) => set.completed).length;

  return (
    <article className="border border-base-300 bg-base-200/40">
      <div className="flex flex-col gap-4 p-4 sm:flex-row sm:p-5">
        <div className="w-full shrink-0 sm:w-36">
          <ExerciseFigure
            slug={exercise.animation_slug}
            name={exercise.name}
            className="border border-base-300"
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <h3 className="text-xl font-bold text-base-content">{exercise.name}</h3>
            {exercise.superset_group && (
              <span className="border border-accent/50 px-2 py-0.5 text-[11px] font-bold uppercase tracking-widest text-accent">
                Ronda {exercise.superset_group}
              </span>
            )}
          </div>

          <p className="mt-1 text-sm text-base-content/60">
            {totalSets} {totalSets === 1 ? "serie" : "series"}
            {exercise.reps ? ` × ${exercise.reps}` : ""}
            {exercise.per_side ? " por lado" : ""}
            {exercise.intensity ? ` · ${exercise.intensity}` : ""}
            {exercise.target_weight_kg ? ` · ${exercise.target_weight_kg} kg` : ""}
            {exercise.rest_seconds ? ` · descanso ${exercise.rest_seconds}s` : ""}
            {exercise.tempo ? ` · tempo ${exercise.tempo}` : ""}
          </p>

          {(exercise.description || exercise.cues) && (
            <p className="mt-2 border-l-2 border-primary/50 pl-3 text-sm text-base-content/70">
              {exercise.description || exercise.cues}
            </p>
          )}

          {exercise.video_url && (
            <a
              href={exercise.video_url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block text-sm font-semibold text-primary hover:underline"
            >
              Ver video del ejercicio →
            </a>
          )}

          <div className="mt-4 space-y-2">
            {sets.map((set, index) => (
              <div
                key={set.setNumber}
                className={`flex flex-wrap items-center gap-2 border p-2 transition-colors ${
                  set.completed
                    ? "border-primary/50 bg-primary/10"
                    : "border-base-300 bg-base-100"
                }`}
              >
                <button
                  type="button"
                  onClick={() => {
                    onToggleSet(exercise.id, index);
                    if (!set.completed && exercise.rest_seconds) {
                      onRest(exercise.rest_seconds);
                    }
                  }}
                  aria-pressed={set.completed}
                  className={`flex h-11 min-w-[6.5rem] items-center justify-center gap-2 px-3 text-sm font-bold uppercase tracking-wide transition-colors ${
                    set.completed
                      ? "bg-primary text-primary-content"
                      : "border border-base-300 text-base-content/70 hover:border-primary hover:text-primary"
                  }`}
                >
                  {set.completed ? "✓" : ""} Serie {set.setNumber}
                </button>

                {fields.map((field) => (
                  <label key={field} className="flex items-center gap-1">
                    <input
                      type="number"
                      inputMode="numeric"
                      min="0"
                      step={field === "weightKg" ? "0.5" : "1"}
                      value={set[field] ?? ""}
                      onChange={(event) =>
                        onChangeField(exercise.id, index, field, event.target.value)
                      }
                      placeholder="—"
                      aria-label={`${FIELD_LABEL[field]} de la serie ${set.setNumber}`}
                      className="h-11 w-20 border border-base-300 bg-base-100 px-2 text-center text-base"
                    />
                    <span className="text-xs uppercase text-base-content/45">
                      {FIELD_LABEL[field]}
                    </span>
                  </label>
                ))}
              </div>
            ))}
          </div>

          <p className="mt-2 text-xs uppercase tracking-widest text-base-content/40">
            {done} de {totalSets} series
          </p>
        </div>
      </div>
    </article>
  );
};

// ------------------------------------------------------------------ pantalla ---
const WorkoutRunner = ({ workout, assignmentId = null }) => {
  const router = useRouter();
  const startedAt = useRef(Date.now());

  const [elapsed, setElapsed] = useState(0);
  const [rest, setRest] = useState(null);
  const [finishing, setFinishing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [effort, setEffort] = useState(7);
  const [notes, setNotes] = useState("");
  const [duration, setDuration] = useState(workout.duration_minutes || 45);

  const [state, setState] = useState(() => {
    const initial = {};
    (workout.exercises || []).forEach((exercise) => {
      initial[exercise.id] = Array.from(
        { length: Math.max(exercise.sets || 1, 1) },
        (unused, index) => ({
          setNumber: index + 1,
          completed: false,
          reps: "",
          weightKg: "",
          seconds: "",
        })
      );
    });
    return initial;
  });

  useEffect(() => {
    const id = setInterval(
      () => setElapsed(Math.floor((Date.now() - startedAt.current) / 1000)),
      1000
    );
    return () => clearInterval(id);
  }, []);

  const totals = useMemo(() => {
    const all = Object.values(state).flat();
    return { done: all.filter((set) => set.completed).length, total: all.length };
  }, [state]);

  const toggleSet = (exerciseId, index) =>
    setState((previous) => {
      const rows = [...previous[exerciseId]];
      rows[index] = { ...rows[index], completed: !rows[index].completed };
      return { ...previous, [exerciseId]: rows };
    });

  const changeField = (exerciseId, index, field, value) =>
    setState((previous) => {
      const rows = [...previous[exerciseId]];
      rows[index] = { ...rows[index], [field]: value };
      return { ...previous, [exerciseId]: rows };
    });

  const openFinish = () => {
    // Propone los minutos que de verdad estuvo entrenando.
    const measured = Math.round(elapsed / 60);
    if (measured >= 5) setDuration(measured);
    setFinishing(true);
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");

    const sets = (workout.exercises || []).flatMap((exercise) =>
      (state[exercise.id] || [])
        .filter((set) => set.completed)
        .map((set) => ({
          exerciseId: exercise.id,
          libraryId: exercise.library_id || null,
          exerciseName: exercise.name,
          setNumber: set.setNumber,
          reps: set.reps || null,
          weightKg: set.weightKg || null,
          seconds: set.seconds || null,
          completed: true,
        }))
    );

    const response = await logWorkout({
      workoutId: workout.id,
      assignmentId,
      durationMinutes: duration,
      effort,
      notes,
      partial: totals.total > 0 && totals.done < totals.total,
      sets,
    });

    setSaving(false);
    if (!response.ok) {
      setError(response.error);
      return;
    }
    setResult(response);
    router.refresh();
  };

  // ---------------------------------------------------------------- final ---
  if (result) {
    return (
      <div className="mx-auto max-w-lg border border-primary/40 bg-primary/5 p-8 text-center">
        <p className="display text-6xl text-primary">+{result.xp} XP</p>
        <h2 className="display mt-2 text-3xl text-base-content">Sesión registrada</h2>
        <p className="mt-2 text-base-content/70">
          Llevas {result.stats?.total_workouts} sesiones y vas por el nivel{" "}
          {result.stats?.level}
          {result.stats?.current_streak > 1
            ? ` con ${result.stats.current_streak} días seguidos.`
            : "."}
        </p>

        {result.newAchievements?.length > 0 && (
          <div className="mt-6 space-y-2">
            <p className="text-xs uppercase tracking-[0.2em] text-base-content/50">
              Medallas nuevas
            </p>
            {result.newAchievements.map((achievement) => (
              <div
                key={achievement.name}
                className="flex items-center gap-3 border border-base-300 bg-base-100 p-3 text-left"
              >
                <span className="text-3xl" aria-hidden="true">
                  {achievement.icon}
                </span>
                <div>
                  <p className="font-bold text-base-content">{achievement.name}</p>
                  <p className="text-sm text-base-content/60">{achievement.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Link href="/dashboard/plan" className="btn btn-primary">
            Volver a mi plan
          </Link>
          <Link href="/dashboard/ranking" className="btn btn-ghost border border-base-300">
            Ver el ranking
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-32">
      <div className="flex flex-wrap items-center justify-between gap-3 border border-base-300 bg-base-200/60 px-4 py-3">
        <div>
          <p className="text-[11px] uppercase tracking-[0.14em] text-base-content/45">
            Llevas entrenando
          </p>
          <p className="display text-3xl text-base-content">{formatClock(elapsed)}</p>
        </div>
        <div className="text-right">
          <p className="text-[11px] uppercase tracking-[0.14em] text-base-content/45">
            Series hechas
          </p>
          <p className="display text-3xl text-primary">
            {totals.done}/{totals.total}
          </p>
        </div>
      </div>

      {rest && (
        <RestTimer
          key={rest.at}
          seconds={rest.seconds}
          onDone={() => setRest(null)}
        />
      )}

      {(workout.exercises || []).map((exercise, index, list) => {
        // Cabecera de bloque (Warm up, Contrast set…) cuando cambia respecto
        // al ejercicio anterior: así la sesión se lee como la escribe el coach.
        const previous = index > 0 ? list[index - 1].block_name : null;
        const startsBlock = exercise.block_name && exercise.block_name !== previous;
        return (
          <div key={exercise.id} className="space-y-4">
            {startsBlock && (
              <h2 className="display border-b border-base-300 pb-1 pt-4 text-2xl text-base-content">
                <span className="text-primary">/</span> {exercise.block_name}
              </h2>
            )}
            <ExerciseCard
              exercise={exercise}
              sets={state[exercise.id] || []}
              onToggleSet={toggleSet}
              onChangeField={changeField}
              onRest={(seconds) => setRest({ seconds, at: Date.now() })}
            />
          </div>
        );
      })}

      {(workout.exercises || []).length === 0 && (
        <p className="border border-dashed border-base-300 p-8 text-center text-base-content/60">
          Esta sesión todavía no tiene ejercicios cargados. Avisa a tu entrenador.
        </p>
      )}

      {/* Barra fija: el botón de terminar siempre a mano. */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-base-300 bg-base-100/95 p-3 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-3">
          <Link
            href="/dashboard/plan"
            className="btn btn-ghost border border-base-300 text-base-content/60"
          >
            Salir
          </Link>
          <button type="button" onClick={openFinish} className="btn btn-primary flex-1">
            Terminar sesión
          </button>
        </div>
      </div>

      {finishing && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-base-content/40 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="Terminar la sesión"
        >
          <div className="w-full max-w-md border border-base-300 bg-base-100 p-6">
            <h2 className="display text-3xl text-base-content">Terminar sesión</h2>
            <p className="mt-1 text-sm text-base-content/60">
              Dos datos rápidos y queda registrada.
            </p>

            <label className="mt-5 block">
              <span className="mb-1 block text-sm font-semibold">
                ¿Cuántos minutos entrenaste?
              </span>
              <input
                type="number"
                min="1"
                max="400"
                value={duration}
                onChange={(event) => setDuration(event.target.value)}
                className="input input-bordered w-full text-lg"
              />
            </label>

            <div className="mt-4">
              <span className="mb-1 block text-sm font-semibold">
                ¿Qué tan dura estuvo? ({effort}/10)
              </span>
              <input
                type="range"
                min="1"
                max="10"
                value={effort}
                onChange={(event) => setEffort(Number(event.target.value))}
                className="range range-primary"
                aria-label="Esfuerzo percibido del 1 al 10"
              />
              <div className="flex justify-between text-xs text-base-content/45">
                <span>Suave</span>
                <span>Al límite</span>
              </div>
            </div>

            <label className="mt-4 block">
              <span className="mb-1 block text-sm font-semibold">
                ¿Algo que contarle al entrenador? (opcional)
              </span>
              <textarea
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                rows={3}
                placeholder="Molestia en el hombro, subí el peso, etc."
                className="textarea textarea-bordered w-full"
              />
            </label>

            {error && (
              <p className="mt-3 border border-error/40 bg-error/10 px-3 py-2 text-sm text-error">
                {error}
              </p>
            )}

            <div className="mt-6 flex gap-2">
              <button
                type="button"
                onClick={() => setFinishing(false)}
                className="btn btn-ghost flex-1 border border-base-300"
                disabled={saving}
              >
                Seguir entrenando
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="btn btn-primary flex-1"
                disabled={saving}
              >
                {saving ? <span className="loading loading-spinner loading-sm" /> : "Guardar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkoutRunner;
