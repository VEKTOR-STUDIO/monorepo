/**
 * Las tipografías se importan como módulo, no se piden por HTTP: la regla
 * `asset/inline` de `remotion.config.ts` las convierte en un data URI durante
 * el bundling. Por eso cada import de fuente vale por una cadena.
 */
declare module "*.ttf" {
  const dataUri: string;
  export default dataUri;
}

declare module "*.otf" {
  const dataUri: string;
  export default dataUri;
}

declare module "*.woff2" {
  const dataUri: string;
  export default dataUri;
}
