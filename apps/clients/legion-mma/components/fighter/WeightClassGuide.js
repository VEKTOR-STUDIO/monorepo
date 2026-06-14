"use client";

import { WEIGHT_CLASSES, suggestWeightClass } from "@/data/fighterOptions";

/**
 * Guía compacta de categorías de peso Legión para el formulario de peleador.
 */
export default function WeightClassGuide({ gender, weightKg, selectedClass }) {
  const weightClasses = WEIGHT_CLASSES[gender] || WEIGHT_CLASSES.masculino;
  const suggestedClass = suggestWeightClass(weightKg, gender);
  const weight = Number(weightKg);
  const hasValidWeight = weight > 0 && !Number.isNaN(weight);
  const isOutOfRange = hasValidWeight && !suggestedClass;

  return (
    <div className="border border-primary/20 p-4 col-span-2 md:col-span-4">
      <p className="text-[0.65rem] tracking-[0.2em] uppercase text-base-content/50 font-bold mb-1">
        Categorías establecidas según el peso
      </p>
      <p className="text-sm text-base-content/60 mb-4">
        Consulta tu división según el peso de combate. Legión usa el límite máximo en kg.
      </p>

      <div className="overflow-x-auto">
        <table className="table table-sm w-full text-sm">
          <thead>
            <tr className="text-[0.65rem] tracking-[0.15em] uppercase text-base-content/50">
              <th>Categoría</th>
              <th className="hidden sm:table-cell">Hasta (kg)</th>
              <th className="hidden md:table-cell">Hasta (lb max)</th>
              <th>KG MAX</th>
            </tr>
          </thead>
          <tbody>
            {weightClasses.map((wc) => {
              const isSuggested = suggestedClass === wc.value;
              const isSelected = selectedClass === wc.value;
              const isHighlighted = isSuggested || (isSelected && !suggestedClass);

              return (
                <tr
                  key={wc.value}
                  className={
                    isHighlighted
                      ? "bg-primary/10 border-l-2 border-primary"
                      : "border-l-2 border-transparent"
                  }
                >
                  <td className="font-medium">{wc.value}</td>
                  <td className="hidden sm:table-cell tabular-nums">{wc.limitKg} kg</td>
                  <td className="hidden md:table-cell tabular-nums">{wc.limitLbsMax} lb</td>
                  <td className="tabular-nums font-semibold text-primary">{wc.limitKgMax} kg</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {isOutOfRange && (
        <p className="text-xs text-warning mt-3">
          El peso ingresado ({weight} kg) supera el límite máximo de las divisiones disponibles
          para este sexo. Consulta con el staff de Legión.
        </p>
      )}

      {suggestedClass && hasValidWeight && (
        <p className="text-xs text-base-content/50 mt-3">
          Según {weight} kg, tu división sugerida es{" "}
          <span className="text-primary font-semibold">{suggestedClass}</span>.
        </p>
      )}
    </div>
  );
}
