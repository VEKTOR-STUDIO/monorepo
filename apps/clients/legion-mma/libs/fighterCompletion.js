// Cálculo del porcentaje de completado de la ficha de un peleador.
//
// Centralizado aquí para que, cuando se agreguen nuevos campos requeridos por
// Legión, baste con sumarlos a COMPLETION_FIELDS: el porcentaje y la lista de
// "lo que falta" se actualizan solos tanto en la ficha del peleador como en el
// panel de administración.

const isFilled = (value) => {
  if (value === null || value === undefined) return false;
  if (typeof value === "string") return value.trim() !== "";
  return true;
};

// Cada campo cuenta 1 hacia el total. `when` permite campos condicionales
// (p. ej. el cinturón de BJJ solo aplica si el peleador hace BJJ).
export const COMPLETION_FIELDS = [
  { key: "full_name", label: "Nombre completo" },
  { key: "birth_date", label: "Fecha de nacimiento" },
  { key: "id_document_number", label: "Cédula / Pasaporte" },
  { key: "id_document_url", label: "Foto de la cédula" },
  { key: "nationality", label: "Nacionalidad" },
  { key: "state", label: "Estado donde vive" },
  { key: "city", label: "Ciudad" },
  { key: "phone", label: "Teléfono de contacto" },
  { key: "instagram", label: "Instagram" },
  { key: "nickname", label: "Apodo / Nickname" },
  { key: "discipline", label: "Disciplina" },
  { key: "fighting_style", label: "Estilo de combate" },
  {
    key: "bjj_belt",
    label: "Cinturón de Jiu-Jitsu",
    when: (f) => f.discipline === "bjj" || f.discipline === "ambas",
  },
  { key: "weight_kg", label: "Peso de combate" },
  { key: "height_cm", label: "Estatura" },
  { key: "weight_class", label: "División de peso" },
  { key: "team", label: "Academia / Equipo" },
  { key: "coach_name", label: "Entrenador de esquina" },
  { key: "short_size", label: "Talla de short" },
  { key: "shirt_size", label: "Talla de franela" },
  { key: "glove_size", label: "Talla de guante de combate" },
  { key: "coach_shirt_size", label: "Talla de franela del entrenador" },
  { key: "emergency_contact_name", label: "Contacto de emergencia" },
  { key: "emergency_contact_phone", label: "Teléfono de emergencia" },
  { key: "photo_url", label: "Foto de peleador" },
];

/**
 * Calcula el avance de la ficha de un peleador.
 * @param {object|null} fighter
 * @returns {{ percent: number, completed: number, total: number, missing: {key:string,label:string}[] }}
 */
export function getFighterCompletion(fighter) {
  if (!fighter) return { percent: 0, completed: 0, total: 0, missing: [] };

  const applicable = COMPLETION_FIELDS.filter(
    (field) => !field.when || field.when(fighter)
  );

  const missing = applicable.filter((field) => !isFilled(fighter[field.key]));
  const completed = applicable.length - missing.length;
  const total = applicable.length;
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

  return { percent, completed, total, missing };
}
