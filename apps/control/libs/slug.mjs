// Nombres de carpeta e identificadores. Aparte de rutas.mjs porque no toca el
// disco, y así lo puede importar también un componente de cliente.

// Un id o un nombre de carpeta nunca llevan barras ni puntos: es lo que
// impide que un valor venido del navegador se salga de su sitio.
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const esSlug = (valor) =>
  typeof valor === "string" && valor.length > 0 && valor.length <= 60 && SLUG.test(valor);

export function aSlug(texto) {
  return String(texto || "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60)
    .replace(/-+$/g, "");
}
