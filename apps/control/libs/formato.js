// Formatos de pantalla. Sin disco: sirve en cliente y en servidor.

const UNIDADES = [
  ["year", 31536000],
  ["month", 2592000],
  ["day", 86400],
  ["hour", 3600],
  ["minute", 60],
];

const relativo = new Intl.RelativeTimeFormat("es", { numeric: "auto", style: "short" });

export function haceCuanto(fecha) {
  if (!fecha) return "";
  const segundos = (new Date(fecha).getTime() - Date.now()) / 1000;
  for (const [unidad, tamano] of UNIDADES) {
    if (Math.abs(segundos) >= tamano) return relativo.format(Math.round(segundos / tamano), unidad);
  }
  return "ahora";
}

export function duracion(inicio, fin) {
  if (!inicio) return "";
  const segundos = Math.max(0, Math.round((new Date(fin || Date.now()) - new Date(inicio)) / 1000));
  const h = Math.floor(segundos / 3600);
  const m = Math.floor((segundos % 3600) / 60);
  const s = segundos % 60;
  if (h) return `${h} h ${String(m).padStart(2, "0")} min`;
  if (m) return `${m} min ${String(s).padStart(2, "0")} s`;
  return `${s} s`;
}

export function peso(bytes) {
  if (bytes >= 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

export const fechaCorta = (fecha) =>
  fecha
    ? new Date(fecha).toLocaleString("es", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })
    : "";
