// Opciones del formulario de registro de peleadores.
// Divisiones de peso basadas en las oficiales de la UFC.

export const WEIGHT_CLASSES = {
  masculino: [
    { value: "Peso Mosca", limit: "56.7 kg" },
    { value: "Peso Gallo", limit: "61.2 kg" },
    { value: "Peso Pluma", limit: "65.8 kg" },
    { value: "Peso Ligero", limit: "70.3 kg" },
    { value: "Peso Wélter", limit: "77.1 kg" },
    { value: "Peso Mediano", limit: "83.9 kg" },
    { value: "Peso Semipesado", limit: "93.0 kg" },
    { value: "Peso Pesado", limit: "120.2 kg" },
  ],
  femenino: [
    { value: "Peso Paja", limit: "52.2 kg" },
    { value: "Peso Mosca", limit: "56.7 kg" },
    { value: "Peso Gallo", limit: "61.2 kg" },
    { value: "Peso Pluma", limit: "65.8 kg" },
  ],
};

export const DISCIPLINES = [
  { value: "mma", label: "MMA" },
  { value: "bjj", label: "BJJ / Grappling" },
  { value: "ambas", label: "Ambas" },
];

export const EXPERIENCE_LEVELS = [
  { value: "amateur", label: "Amateur" },
  { value: "profesional", label: "Profesional" },
];

export const BJJ_BELTS = [
  { value: "blanca", label: "Blanca" },
  { value: "azul", label: "Azul" },
  { value: "violeta", label: "Violeta" },
  { value: "marron", label: "Marrón" },
  { value: "negra", label: "Negra" },
];

export const STANCES = [
  { value: "ortodoxo", label: "Ortodoxo" },
  { value: "zurdo", label: "Zurdo" },
  { value: "ambidiestro", label: "Ambidiestro" },
];

export const BLOOD_TYPES = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export const NATIONALITIES = [
  { value: "VE", label: "Venezuela 🇻🇪" },
  { value: "CO", label: "Colombia 🇨🇴" },
  { value: "BR", label: "Brasil 🇧🇷" },
  { value: "AR", label: "Argentina 🇦🇷" },
  { value: "MX", label: "México 🇲🇽" },
  { value: "US", label: "Estados Unidos 🇺🇸" },
];

export const STATUS_LABELS = {
  pendiente: { label: "Pendiente de aprobación", badge: "badge-warning" },
  aprobado: { label: "Aprobado — en el roster", badge: "badge-success" },
  rechazado: { label: "Rechazado", badge: "badge-error" },
  inactivo: { label: "Inactivo", badge: "badge-ghost" },
};

// ── Eventos y carteleras ─────────────────────────────────────────────────────

export const EVENT_STATUS_LABELS = {
  borrador: { label: "Borrador / Simulación", badge: "badge-warning" },
  publicado: { label: "Publicado", badge: "badge-success" },
  finalizado: { label: "Finalizado", badge: "badge-info" },
  cancelado: { label: "Cancelado", badge: "badge-error" },
};

export const VICTORY_METHODS = [
  "KO",
  "TKO",
  "Sumisión",
  "Decisión unánime",
  "Decisión dividida",
  "Decisión mayoritaria",
  "Descalificación",
  "No Contest",
];

export const BOUT_WINNERS = [
  { value: "rojo", label: "Esquina roja" },
  { value: "azul", label: "Esquina azul" },
  { value: "empate", label: "Empate" },
  { value: "sin_decision", label: "Sin decisión" },
];
