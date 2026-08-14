import config from "@/config";

// Los alumnos entrenan presencial los MARTES y JUEVES.
// - Modo TAREA (martes → jueves): el profesor asigna un video para estudiar
//   antes de la clase del jueves. Días: martes, miércoles, jueves.
// - Modo VOTACIÓN (jueves → martes): los alumnos votan el tema de la próxima
//   semana. Días: viernes, sábado, domingo, lunes.
const TASK_DAYS = ["Tue", "Wed", "Thu"];

function getWeekday(date = new Date()) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    timeZone: config.timezone,
  }).format(date);
}

/**
 * Devuelve el modo que corresponde según el día de la semana:
 * "task" (martes a jueves) o "poll" (jueves a martes).
 */
export function getScheduleMode(date = new Date()) {
  return TASK_DAYS.includes(getWeekday(date)) ? "task" : "poll";
}

/**
 * Decide qué mostrar en el dashboard del alumno combinando el día de la
 * semana con el estado activo en la base de datos: si el contenido preferido
 * por calendario no está activo, cae al otro; si no hay nada activo, "empty".
 */
export function resolveDashboardMode({ assignment, poll, date = new Date() }) {
  const preferred = getScheduleMode(date);

  if (preferred === "task") {
    if (assignment) return "task";
    if (poll) return "poll";
  } else {
    if (poll) return "poll";
    if (assignment) return "task";
  }

  return "empty";
}

/**
 * El día de hoy (YYYY-MM-DD) en la zona del gym, no en la del servidor: en
 * Vercel son las 3am UTC cuando en Caracas todavía es ayer.
 */
export function todayInTimezone(date = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: config.timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

/**
 * Lee un `<input type="date">`. Vacío → hoy en la zona del gym. Si el valor
 * no tiene forma de fecha, null (el caller decide el error).
 */
export function parseDateInput(value) {
  const raw = typeof value === "string" ? value.trim() : "";
  if (!raw) return todayInTimezone();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(raw)) return null;
  return raw;
}

/**
 * La fecha (YYYY-MM-DD) de un instante cualquiera en la zona del gym. Sirve
 * para los timestamps que la base guarda en UTC (`tournaments.created_at`):
 * un tope creado a las 9pm de Caracas se guarda como el día siguiente en UTC
 * y en el calendario tiene que caer en el día que se peleó.
 */
export function dateInTimezone(value) {
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : todayInTimezone(date);
}

/**
 * Corre una fecha "YYYY-MM-DD" tantos días hacia adelante (o atrás, con
 * números negativos). Igual que `daysUntil`, ancla a mediodía UTC para que
 * ningún huso ni cambio de horario mueva el resultado un día.
 */
export function addDays(dateString, days) {
  if (typeof dateString !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    return null;
  }

  const base = Date.parse(`${dateString}T12:00:00Z`);
  return new Date(base + days * 86_400_000).toISOString().slice(0, 10);
}

/**
 * Cuántos días faltan para una fecha de clase (`assignments.scheduled_for`,
 * un date "2026-08-11"). 0 = hoy, negativo = ya pasó, null si la fecha no
 * viene o no tiene forma de fecha.
 *
 * Las dos fechas se anclan a mediodía UTC antes de restar: así la cuenta es de
 * días de calendario y ningún huso ni cambio de horario corre el resultado.
 */
export function daysUntil(dateString, now = new Date()) {
  if (typeof dateString !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    return null;
  }

  const target = Date.parse(`${dateString}T12:00:00Z`);
  const today = Date.parse(`${todayInTimezone(now)}T12:00:00Z`);

  return Math.round((target - today) / 86_400_000);
}

/**
 * Devuelve la miniatura (splash art) de un video de YouTube, o null si la
 * URL no es de YouTube. Se usa para el arte de fondo de los tiles del menú.
 */
export function getVideoThumbnail(videoUrl) {
  const { type, embedUrl } = getVideoEmbed(videoUrl);
  if (type !== "youtube" || !embedUrl) return null;

  const videoId = embedUrl.split("/embed/")[1];
  return videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : null;
}

/**
 * Convierte una URL de YouTube o Instagram en una URL embebible en iframe.
 * Devuelve { type: "youtube" | "instagram" | "unknown", embedUrl }.
 */
export function getVideoEmbed(videoUrl) {
  if (!videoUrl) return { type: "unknown", embedUrl: null };

  try {
    const url = new URL(videoUrl);
    const host = url.hostname.replace(/^www\./, "");

    if (host === "youtu.be") {
      return {
        type: "youtube",
        embedUrl: `https://www.youtube.com/embed/${url.pathname.slice(1)}`,
      };
    }

    if (host === "youtube.com" || host === "m.youtube.com") {
      if (url.searchParams.get("v")) {
        return {
          type: "youtube",
          embedUrl: `https://www.youtube.com/embed/${url.searchParams.get("v")}`,
        };
      }
      const shortsOrEmbed = url.pathname.match(/^\/(shorts|embed)\/([\w-]+)/);
      if (shortsOrEmbed) {
        return {
          type: "youtube",
          embedUrl: `https://www.youtube.com/embed/${shortsOrEmbed[2]}`,
        };
      }
    }

    if (host === "instagram.com") {
      const media = url.pathname.match(/^\/(reel|p|tv)\/([\w-]+)/);
      if (media) {
        return {
          type: "instagram",
          embedUrl: `https://www.instagram.com/${media[1]}/${media[2]}/embed`,
        };
      }
    }
  } catch {
    // URL inválida — se muestra como link plano.
  }

  return { type: "unknown", embedUrl: null };
}
