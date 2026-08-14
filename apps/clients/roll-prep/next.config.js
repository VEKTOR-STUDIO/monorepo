const nextConfig = {
  reactStrictMode: true,
  // El flyer CAOS lee fuentes y PNG del disco en runtime. Sin esto, NFT no
  // los mete en el lambda de Vercel (los paths pasan por un helper) y la
  // ruta /api/invitaciones/*/imagen revienta con 500 vacío.
  outputFileTracingIncludes: {
    "/api/invitaciones/*/imagen": [
      "./public/fonts/**/*",
      "./public/images/caosPrimary.png",
      "./public/logoAlessandrovaruBlanco.png",
    ],
    "/dashboard/admin/invitaciones": [
      "./public/fonts/**/*",
      "./public/images/caosPrimary.png",
      "./public/logoAlessandrovaruBlanco.png",
    ],
    "/dashboard/admin/invitaciones/*": [
      "./public/fonts/**/*",
      "./public/images/caosPrimary.png",
      "./public/logoAlessandrovaruBlanco.png",
    ],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "pbs.twimg.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "logos-world.net",
      },
    ],
  },
  turbopack: {
    rules: {
      "*.svg": {
        loaders: ["@svgr/webpack"],
        as: "*.js",
      },
    },
  },
  webpack: (config, { webpack, isServer }) => {
    // Suppress specific warnings from Supabase realtime-js and Edge Runtime compatibility
    config.ignoreWarnings = [
      {
        module: /node_modules\/@supabase\/realtime-js/,
        message: /Critical dependency: the request of a dependency is an expression/,
      },
      {
        module: /node_modules\/@supabase\/realtime-js/,
        message: /A Node\.js API is used \(process\.versions/,
      },
      {
        module: /node_modules\/@supabase\/realtime-js/,
        message: /A Node\.js API is used \(process\.version/,
      },
      {
        module: /node_modules\/@supabase\/supabase-js/,
        message: /A Node\.js API is used \(process\.version/,
      },
    ];

    return config;
  },
};

module.exports = nextConfig;
