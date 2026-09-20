// -----------------------------------------------------------------------------
// Helpers puros del LMS (sin dependencias de servidor).
// Se pueden importar tanto en componentes de servidor como de cliente.
// -----------------------------------------------------------------------------

export function getVideoEmbed(url) {
  if (!url) return null;

  // YouTube
  const yt = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/
  );
  if (yt) {
    return { type: "iframe", src: `https://www.youtube.com/embed/${yt[1]}` };
  }

  // Vimeo
  const vimeo = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeo) {
    return { type: "iframe", src: `https://player.vimeo.com/video/${vimeo[1]}` };
  }

  // Archivo de video directo
  if (/\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(url)) {
    return { type: "file", src: url };
  }

  // Fallback: intenta como iframe genérico
  return { type: "iframe", src: url };
}

export function formatDuration(seconds) {
  if (!seconds && seconds !== 0) return null;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export const LEVEL_LABELS = {
  principiante: "Principiante",
  intermedio: "Intermedio",
  avanzado: "Avanzado",
  todos: "Todos los niveles",
};
