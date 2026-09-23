// Los estados de un prospecto: en qué punto está la conversación con la
// persona. No toca el disco: lo importan por igual los componentes de cliente
// y el servidor. Es cosa aparte de las columnas del tablero (etapas.js): la
// tarjeta dice cómo va la demo; esto dice cómo va la venta.
export const ESTADOS = [
  {
    id: "por-contactar",
    nombre: "Por contactar",
    ayuda: "Demo publicada y video hecho. Falta escribirle.",
    tono: "neutral",
  },
  {
    id: "contactado",
    nombre: "Contactado",
    ayuda: "Ya le mandaste el mensaje. Esperando respuesta.",
    tono: "info",
  },
  {
    id: "respondio",
    nombre: "Respondió",
    ayuda: "Hay conversación. Apunta qué dijo y el siguiente paso.",
    tono: "warning",
  },
  {
    id: "negociando",
    nombre: "Negociando",
    ayuda: "Quiere la web. Se habla de precio, dominio o cambios.",
    tono: "secondary",
  },
  {
    id: "vendido",
    nombre: "Vendido",
    ayuda: "Pagó. Toca entregar: apagar la demo y poner su dominio.",
    tono: "success",
  },
  {
    id: "descartado",
    nombre: "Descartado",
    ayuda: "Dijo que no, o no contestó nunca. Se queda por si vuelve.",
    tono: "error",
  },
];

export const estadoPorId = (id) => ESTADOS.find((e) => e.id === id) || ESTADOS[0];

// Las clases van escritas enteras: Tailwind solo genera las que encuentra tal cual.
export const TONOS_CONTACTO = {
  neutral: { punto: "bg-base-content/40", texto: "text-base-content/70", borde: "border-base-content/20" },
  info: { punto: "bg-info", texto: "text-info", borde: "border-info/40" },
  warning: { punto: "bg-warning", texto: "text-warning", borde: "border-warning/40" },
  secondary: { punto: "bg-secondary", texto: "text-secondary", borde: "border-secondary/40" },
  success: { punto: "bg-success", texto: "text-success", borde: "border-success/40" },
  error: { punto: "bg-error", texto: "text-error", borde: "border-error/40" },
};

// Por dónde se le escribe. WhatsApp es el canal normal; Instagram, cuando el
// negocio no publica número (varios concesionarios no lo hacen).
export const CANALES = [
  { id: "whatsapp", nombre: "WhatsApp" },
  { id: "instagram", nombre: "Instagram" },
  { id: "otro", nombre: "Otro" },
];

// Lo que se puede escribir dentro del mensaje y con qué se sustituye.
export const CAMPOS_MENSAJE = [
  ["{nombre}", "el nombre del negocio"],
  ["{ciudad}", "su ciudad"],
  ["{enlace}", "el enlace de la demo"],
  ["{clave}", "la contraseña de la demo"],
  ["{instagram}", "su cuenta de Instagram"],
];
