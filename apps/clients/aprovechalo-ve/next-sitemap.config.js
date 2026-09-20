/** Mapa del sitio. Las 231 fichas de producto entran solas: next-sitemap
 *  recorre la salida del build, que ya las pregenera. */
module.exports = {
  siteUrl: process.env.SITE_URL || "https://hardcorestore.ve",
  generateRobotsTxt: true,
  exclude: [
    "/twitter-image.*",
    "/opengraph-image.*",
    "/icon.*",
    "/apple-icon.*",
    "/admin",
    "/admin/*",
    "/cuenta",
    "/carrito",
    "/checkout",
    "/pedido/*",
  ],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/cuenta", "/carrito", "/checkout", "/pedido", "/api"],
      },
    ],
  },
};
