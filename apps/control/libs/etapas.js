// Las columnas del tablero, en orden. No toca el disco: lo importan por igual
// los componentes de cliente y el servidor.
//
// «Por hacer» es la columna con consecuencias: soltar una tarjeta ahí la mete
// en la cola de la rutina. «En proceso» no acepta tarjetas a mano, porque solo
// la rutina sabe cuándo empieza y cuándo acaba.
export const ETAPAS = [
  {
    id: "candidato",
    nombre: "Candidatos",
    ayuda: "Negocios a los que venderles. Todavía sin carpeta.",
    tono: "neutral",
  },
  {
    id: "preparando",
    nombre: "Preparando",
    ayuda: "Plantilla copiada. Se le carga el material y el encargo.",
    tono: "info",
  },
  {
    id: "por-hacer",
    nombre: "Por hacer",
    ayuda: "En cola. Soltar aquí lanza la rutina de Claude.",
    tono: "warning",
    dispara: true,
  },
  {
    id: "en-proceso",
    nombre: "En proceso",
    ayuda: "Claude está adaptando la plantilla.",
    tono: "accent",
    automatica: true,
  },
  {
    id: "revision",
    nombre: "Revisión",
    ayuda: "La rutina terminó. Toca mirarla entera antes de enseñarla.",
    tono: "secondary",
  },
  {
    id: "publicada",
    nombre: "Publicada",
    ayuda: "En línea y con el enlace repartido.",
    tono: "success",
  },
];

export const etapaPorId = (id) => ETAPAS.find((e) => e.id === id) || ETAPAS[0];

// Las clases van escritas enteras y no montadas con plantillas: Tailwind solo
// genera las que encuentra tal cual en el código.
export const TONOS = {
  neutral: { punto: "bg-base-content/40", texto: "text-base-content/70", borde: "border-base-content/20" },
  info: { punto: "bg-info", texto: "text-info", borde: "border-info/40" },
  warning: { punto: "bg-warning", texto: "text-warning", borde: "border-warning/40" },
  accent: { punto: "bg-accent", texto: "text-accent", borde: "border-accent/50" },
  secondary: { punto: "bg-secondary", texto: "text-secondary", borde: "border-secondary/40" },
  success: { punto: "bg-success", texto: "text-success", borde: "border-success/40" },
};

// Estados de la rutina, que son cosa aparte de la columna: una tarjeta puede
// estar en «Por hacer» porque espera turno o porque falló y hay que relanzarla.
export const RUTINA = {
  inactiva: "Sin lanzar",
  "en-cola": "En cola",
  corriendo: "Corriendo",
  terminada: "Terminada",
  fallida: "Falló",
  detenida: "Detenida",
};
