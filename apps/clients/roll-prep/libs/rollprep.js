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
