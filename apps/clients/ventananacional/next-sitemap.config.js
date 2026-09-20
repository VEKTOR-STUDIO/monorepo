/** Mapa del sitio. Las fichas de vehículo entran solas: next-sitemap recorre
 *  la salida del build, que ya las pregenera una por una. */
module.exports = {
  siteUrl: process.env.SITE_URL || "https://ventanacional.com",
  generateRobotsTxt: true,
  exclude: [
    // Sin comodín además del de la extensión: la ruta se sirve como
    // /twitter-image, sin punto, y con el patrón de abajo se colaba al mapa.
    "/twitter-image",
    "/twitter-image.*",
    "/opengraph-image.*",
    "/icon.*",
    "/apple-icon.*",
    // La puerta de la demo no se indexa: no lleva a ningún sitio sin clave.
    "/entrar",
  ],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/entrar", "/api"],
      },
    ],
  },
};
