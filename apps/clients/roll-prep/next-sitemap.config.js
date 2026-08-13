module.exports = {
  // REQUIRED: add your own domain name here (e.g. https://shipfa.st),
  siteUrl: process.env.SITE_URL || "https://rollprep.alessandrovaru.com",
  // El dashboard es privado — fuera del sitemap.
  generateRobotsTxt: true,
  // use this to exclude routes from the sitemap (i.e. a user dashboard). By default, NextJS app router metadata files are excluded (https://nextjs.org/docs/app/api-reference/file-conventions/metadata)
  // Los iconos y la imagen de OpenGraph ahora son rutas generadas (sin
  // extensión), así que el patrón va sin el punto o se cuelan en el sitemap.
  exclude: [
    "/twitter-image*",
    "/opengraph-image*",
    "/apple-icon*",
    "/icon*",
    "/dashboard",
    "/dashboard/*",
  ],
  // La cartelera de torneos CAOS se renderiza bajo demanda, así que no está
  // en el manifiesto de rutas estáticas que lee next-sitemap. Se agrega a
  // mano: es la página pública que se comparte y la que debería indexarse.
  additionalPaths: async (config) => [
    await config.transform(config, "/caos"),
  ],
};
