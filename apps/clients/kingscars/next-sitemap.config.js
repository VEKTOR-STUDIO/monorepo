/** Mapa del sitio. Las fichas de cada unidad entran solas: next-sitemap recorre
 *  la salida del build, que ya las pregenera una por una. */
module.exports = {
  siteUrl: process.env.SITE_URL || "https://kingscars.com.ve",
  generateRobotsTxt: true,
  exclude: [
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
