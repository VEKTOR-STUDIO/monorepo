// Constantes de la galería compartidas entre cliente y servidor.
// (Sin imports de servidor: este módulo se usa también en componentes cliente.)

export const MAX_AUTHOR_LENGTH = 40;
export const MAX_FILE_SIZE_MB = 5;

// Etiquetas y atributos permitidos en el texto enriquecido de una
// publicación. Se usan tanto para sanitizar antes de guardar (server
// action) como al renderizar (Lightbox / admin), así que cualquier tag
// que el editor pueda producir debe estar en esta lista.
export const ALLOWED_DESCRIPTION_TAGS = [
  "p",
  "br",
  "strong",
  "b",
  "em",
  "i",
  "u",
  "s",
  "ul",
  "ol",
  "li",
  "a",
  "blockquote",
  "h3",
];

export const ALLOWED_DESCRIPTION_ATTR = ["href", "target", "rel"];

/**
 * Quita las etiquetas HTML de un texto enriquecido para usarlo donde se
 * necesita texto plano (atributos alt/aria-label, previews, etc.).
 */
export function stripHtml(html) {
  if (!html) return "";
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Un concepto está "efectivamente revelado" si el admin lo marcó a mano
 * (`is_revealed`) o si ya pasó su fecha de revelado programado
 * (`reveal_at`). Se usa tanto en el servidor (filtrar qué se muestra/qué se
 * puede elegir al subir) como en el admin (mostrar el estado calculado).
 */
export function isConceptRevealed(concept) {
  if (!concept) return false;
  if (concept.is_revealed) return true;
  return Boolean(concept.reveal_at) && new Date(concept.reveal_at).getTime() <= Date.now();
}
