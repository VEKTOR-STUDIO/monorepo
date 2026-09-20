const nextConfig = {
  reactStrictMode: true,
  // Son 231 fichas de producto. En un equipo cargado, alguna se pasa del
  // minuto que Next da por defecto y tumba la build entera.
  staticPageGenerationTimeout: 180,
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
      {
        protocol: "https",
        hostname: "placehold.co",
      },
      {
        // Avatares por defecto (iniciales) de los alumnos.
        protocol: "https",
        hostname: "api.dicebear.com",
      },
      {
        // Animaciones de ejercicios de @bryllim/workout-guide.
        protocol: "https",
        hostname: "cdn.jsdelivr.net",
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
