"use client";

import { useMemo, useState } from "react";
import ExerciseFigure from "@/components/training/ExerciseFigure";
import { ANIMATION_CREDIT } from "@/libs/exercise-animation";
import { CATEGORY_LABELS } from "@/libs/training-constants";

// -----------------------------------------------------------------------------
// El libro de entrenamiento: buscador de ejercicios con su animación.
//
// Los filtros son de cliente porque el catálogo entero cabe de sobra en memoria
// y así se siente instantáneo — sin esperas ni recargas.
// -----------------------------------------------------------------------------

const normalize = (value = "") =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");

const ExerciseBook = ({ exercises, filters, onPick = null, pickLabel = "Añadir" }) => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [muscle, setMuscle] = useState("");
  const [equipment, setEquipment] = useState("");
  const [detail, setDetail] = useState(null);

  const visible = useMemo(() => {
    const needle = normalize(search.trim());
    return exercises.filter((exercise) => {
      if (category && exercise.category !== category) return false;
      if (muscle && exercise.primary_muscle !== muscle) return false;
      if (equipment && exercise.equipment !== equipment) return false;
      if (!needle) return true;
      return (
        normalize(exercise.name).includes(needle) ||
        normalize(exercise.name_en || "").includes(needle) ||
        normalize(exercise.primary_muscle || "").includes(needle)
      );
    });
  }, [exercises, search, category, muscle, equipment]);

  const clear = () => {
    setSearch("");
    setCategory("");
    setMuscle("");
    setEquipment("");
  };

  const hasFilters = search || category || muscle || equipment;

  return (
    <div className="space-y-5">
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Buscar: sentadilla, plancha…"
          aria-label="Buscar ejercicio"
          className="input input-bordered w-full lg:col-span-2"
        />
        <select
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          aria-label="Filtrar por tipo"
          className="select select-bordered w-full"
        >
          <option value="">Todos los tipos</option>
          {filters.categories.map((value) => (
            <option key={value} value={value}>
              {CATEGORY_LABELS[value] || value}
            </option>
          ))}
        </select>
        <select
          value={muscle}
          onChange={(event) => setMuscle(event.target.value)}
          aria-label="Filtrar por músculo"
          className="select select-bordered w-full"
        >
          <option value="">Todos los músculos</option>
          {filters.muscles.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
        <select
          value={equipment}
          onChange={(event) => setEquipment(event.target.value)}
          aria-label="Filtrar por material"
          className="select select-bordered w-full lg:col-span-2"
        >
          <option value="">Con cualquier material</option>
          {filters.equipment.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
        {hasFilters && (
          <button
            type="button"
            onClick={clear}
            className="btn btn-ghost border border-base-300 lg:col-span-2"
          >
            Limpiar filtros
          </button>
        )}
      </div>

      <p className="text-sm text-base-content/50">
        {visible.length} {visible.length === 1 ? "ejercicio" : "ejercicios"}
      </p>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {visible.map((exercise) => (
          <div
            key={exercise.id || exercise.slug}
            className="group flex flex-col border border-base-300 bg-base-200/40 transition-colors hover:border-primary/50"
          >
            <button
              type="button"
              onClick={() => setDetail(exercise)}
              className="text-left"
              aria-label={`Ver ${exercise.name}`}
            >
              <ExerciseFigure slug={exercise.animation_slug} name={exercise.name} />
              <div className="border-t border-base-300 p-3">
                <p className="text-sm font-bold leading-tight text-base-content">
                  {exercise.name}
                </p>
                <p className="mt-1 text-xs text-base-content/50">
                  {exercise.primary_muscle}
                  {exercise.equipment ? ` · ${exercise.equipment}` : ""}
                </p>
              </div>
            </button>
            {onPick && (
              <button
                type="button"
                onClick={() => onPick(exercise)}
                className="btn btn-primary btn-sm m-2 mt-0"
              >
                {pickLabel}
              </button>
            )}
          </div>
        ))}
      </div>

      {visible.length === 0 && (
        <p className="border border-dashed border-base-300 p-10 text-center text-base-content/60">
          Ningún ejercicio coincide con esa búsqueda.
        </p>
      )}

      <p className="border-t border-base-300 pt-4 text-xs text-base-content/40">
        Ilustraciones de{" "}
        <a
          href={ANIMATION_CREDIT.authorUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="link"
        >
          {ANIMATION_CREDIT.author}
        </a>
        , derivadas de{" "}
        <a
          href={ANIMATION_CREDIT.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="link"
        >
          {ANIMATION_CREDIT.source}
        </a>
        , bajo licencia{" "}
        <a
          href={ANIMATION_CREDIT.licenseUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="link"
        >
          {ANIMATION_CREDIT.license}
        </a>
        .
      </p>

      {detail && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-base-content/50 p-4 backdrop-blur-sm"
          onClick={() => setDetail(null)}
          role="dialog"
          aria-modal="true"
          aria-label={detail.name}
        >
          <div
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto border border-base-300 bg-base-100 p-6"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="display text-3xl text-base-content">{detail.name}</h2>
                {detail.name_en && detail.name_en !== detail.name && (
                  <p className="text-sm text-base-content/40">{detail.name_en}</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => setDetail(null)}
                className="btn btn-ghost btn-sm btn-square"
                aria-label="Cerrar"
              >
                ✕
              </button>
            </div>

            <div className="mx-auto my-4 max-w-xs border border-base-300">
              <ExerciseFigure slug={detail.animation_slug} name={detail.name} speed={600} />
            </div>

            <dl className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <dt className="text-xs uppercase tracking-widest text-base-content/40">
                  Músculo principal
                </dt>
                <dd className="font-semibold">{detail.primary_muscle || "—"}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-widest text-base-content/40">
                  Material
                </dt>
                <dd className="font-semibold">{detail.equipment || "—"}</dd>
              </div>
              {detail.secondary_muscles?.length > 0 && (
                <div className="col-span-2">
                  <dt className="text-xs uppercase tracking-widest text-base-content/40">
                    También trabaja
                  </dt>
                  <dd className="font-semibold">{detail.secondary_muscles.join(", ")}</dd>
                </div>
              )}
            </dl>

            {(detail.description || detail.cues) && (
              <p className="mt-4 border-l-2 border-primary/50 pl-3 text-sm text-base-content/70">
                {detail.description || detail.cues}
              </p>
            )}

            {onPick && (
              <button
                type="button"
                onClick={() => {
                  onPick(detail);
                  setDetail(null);
                }}
                className="btn btn-primary btn-block mt-6"
              >
                {pickLabel}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ExerciseBook;
