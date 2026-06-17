// Opciones del formulario de registro de peleadores.
// Divisiones de peso basadas en las categorías oficiales de Legión MMA.

const LEGION_WEIGHT_LIMITS = [
  { value: "Peso Paja", limitKg: 52.3, limitLbs: 115, limitLbsMax: 116, limitKgMax: 52.6 },
  { value: "Peso Mosca", limitKg: 56.7, limitLbs: 125, limitLbsMax: 126, limitKgMax: 57.1 },
  { value: "Peso Gallo", limitKg: 61.2, limitLbs: 135, limitLbsMax: 136, limitKgMax: 61.6 },
  { value: "Peso Pluma", limitKg: 65.8, limitLbs: 145, limitLbsMax: 146, limitKgMax: 66.2 },
  { value: "Peso Ligero", limitKg: 70.3, limitLbs: 155, limitLbsMax: 156, limitKgMax: 70.7 },
  { value: "Peso Wélter", limitKg: 77.1, limitLbs: 170, limitLbsMax: 171, limitKgMax: 77.5 },
  { value: "Peso Mediano", limitKg: 83.9, limitLbs: 185, limitLbsMax: 186, limitKgMax: 84.3 },
  { value: "Peso Semipesado", limitKg: 93.0, limitLbs: 205, limitLbsMax: 206, limitKgMax: 93.4 },
  { value: "Peso Pesado", limitKg: 120.2, limitLbs: 265, limitLbsMax: 267, limitKgMax: 121.1 },
].map((entry) => ({
  ...entry,
  limitLabel: `${entry.limitKgMax} kg max`,
}));

const MALE_WEIGHT_VALUES = [
  "Peso Mosca",
  "Peso Gallo",
  "Peso Pluma",
  "Peso Ligero",
  "Peso Wélter",
  "Peso Mediano",
  "Peso Semipesado",
  "Peso Pesado",
];

const FEMALE_WEIGHT_VALUES = ["Peso Paja", "Peso Mosca", "Peso Gallo", "Peso Pluma"];

export const WEIGHT_CLASSES = {
  masculino: LEGION_WEIGHT_LIMITS.filter((wc) => MALE_WEIGHT_VALUES.includes(wc.value)),
  femenino: LEGION_WEIGHT_LIMITS.filter((wc) => FEMALE_WEIGHT_VALUES.includes(wc.value)),
};

/** Sugiere división según peso de combate (kg) y sexo del peleador. */
export function suggestWeightClass(weightKg, gender) {
  const weight = Number(weightKg);
  if (!weight || Number.isNaN(weight) || weight <= 0) return null;

  const classes = [...(WEIGHT_CLASSES[gender] || WEIGHT_CLASSES.masculino)].sort(
    (a, b) => a.limitKgMax - b.limitKgMax
  );

  const match = classes.find((wc) => weight <= wc.limitKgMax);
  if (match) return match.value;

  const heaviest = classes[classes.length - 1];
  if (heaviest?.value === "Peso Pesado") return heaviest.value;

  return null;
}

export const DISCIPLINES = [
  { value: "mma", label: "MMA" },
  { value: "bjj", label: "BJJ / Grappling" },
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

// Estilo de combate del peleador (orientación principal en la jaula).
export const FIGHTING_STYLES = [
  { value: "striker", label: "Striker (golpeo)" },
  { value: "kickboxer", label: "Kickboxer (golpeo)" },
  { value: "SLAM", label: "Sistema de Libre de Artes Marciales (SLAM)" },
  { value: "grappler", label: "Grappler (suelo)" },
  { value: "wrestler", label: "Luchador (wrestling)" },
  { value: "boxeo", label: "Boxeo" },
  { value: "kickboxing", label: "Kickboxing" },
  { value: "muay_thai", label: "Muay Thai" },
  { value: "jiu_jitsu", label: "Jiu-Jitsu" },
  { value: "karate", label: "Karate" },
  { value: "sambo", label: "Sambo" },
  { value: "todoterreno", label: "Todoterreno (completo)" },
  { value: "otros", label: "Otros" },
];

// Tallas de uniforme (short y franela del peleador y del entrenador).
export const CLOTHING_SIZES = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];

// Tallas de guante de combate de MMA.
export const GLOVE_SIZES = ["XS", "S", "M", "L", "XL"];

export const NATIONALITIES = [
  { value: "VE", label: "Venezuela 🇻🇪" },
  { value: "CO", label: "Colombia 🇨🇴" },
  { value: "BR", label: "Brasil 🇧🇷" },
  { value: "AR", label: "Argentina 🇦🇷" },
  { value: "MX", label: "México 🇲🇽" },
  { value: "US", label: "Estados Unidos 🇺🇸" },
];

// ── Datos de pago (Venezuela) ────────────────────────────────────────────────
// Bancos principales de Venezuela. El `value` es el código bancario de 4 dígitos
// (el mismo que se usa para Pago Móvil y como prefijo del número de cuenta).
export const VE_BANKS = [
  { value: "0102", label: "Banco de Venezuela" },
  { value: "0104", label: "Banco Venezolano de Crédito" },
  { value: "0105", label: "Mercantil" },
  { value: "0108", label: "BBVA Provincial" },
  { value: "0114", label: "Bancaribe" },
  { value: "0115", label: "Banco Exterior" },
  { value: "0128", label: "Banco Caroní" },
  { value: "0134", label: "Banesco" },
  { value: "0137", label: "Banco Sofitasa" },
  { value: "0138", label: "Banco Plaza" },
  { value: "0146", label: "Bangente" },
  { value: "0151", label: "BFC Banco Fondo Común" },
  { value: "0156", label: "100% Banco" },
  { value: "0157", label: "DelSur Banco" },
  { value: "0163", label: "Banco del Tesoro" },
  { value: "0166", label: "Banco Agrícola de Venezuela" },
  { value: "0168", label: "Bancrecer" },
  { value: "0169", label: "Mi Banco" },
  { value: "0171", label: "Banco Activo" },
  { value: "0172", label: "Bancamiga" },
  { value: "0174", label: "Banplus" },
  { value: "0175", label: "Banco Bicentenario" },
  { value: "0191", label: "Banco Nacional de Crédito (BNC)" },
];

export const BANK_ACCOUNT_TYPES = [
  { value: "ahorro", label: "Ahorro" },
  { value: "corriente", label: "Corriente" },
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
