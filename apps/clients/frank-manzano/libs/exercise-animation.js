// -----------------------------------------------------------------------------
// Animaciones de ejercicios ("los monigotes").
//
// Usamos @bryllim/workout-guide: 302 ejercicios × 3 fotogramas transparentes de
// 512×512 px. Encadenando los fotogramas 1 → 2 → 3 → 2 se ve el movimiento
// completo (posición inicial, punto medio, posición final y vuelta).
//
// Las imágenes se sirven desde el CDN de jsDelivr para no meter 33 MB en el
// repositorio. Si algún día quieres servirlas tú, copia la carpeta
//   node_modules/@bryllim/workout-guide/assets   ->   public/ejercicios/
// y cambia ANIMATION_BASE por "/ejercicios".
//
// Licencia de las ilustraciones: CC BY-SA 4.0 — Bryl Lim, derivadas de
// Everkinetic. La atribución se muestra en /dashboard/biblioteca: no la quites.
// -----------------------------------------------------------------------------

export const ANIMATION_PACKAGE_VERSION = "1.0.0";

export const ANIMATION_BASE = `https://cdn.jsdelivr.net/npm/@bryllim/workout-guide@${ANIMATION_PACKAGE_VERSION}/assets`;

export const ANIMATION_CREDIT = {
  author: "Bryl Lim",
  authorUrl: "https://bryllim.com",
  source: "Everkinetic",
  sourceUrl: "https://github.com/everkinetic/data",
  license: "CC BY-SA 4.0",
  licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
};

// Orden de reproducción: ida y vuelta, para que el bucle se vea natural.
export const FRAME_SEQUENCE = [1, 2, 3, 2];

export function frameUrl(slug, frame = 1) {
  if (!slug) return null;
  return `${ANIMATION_BASE}/${slug}/frame-${frame}.png`;
}

export function frameUrls(slug) {
  if (!slug) return [];
  return [1, 2, 3].map((n) => frameUrl(slug, n));
}
