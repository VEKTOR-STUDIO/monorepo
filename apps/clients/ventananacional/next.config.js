const nextConfig = {
  reactStrictMode: true,
  // Se pregenera una página por vehículo. Son pocas, pero el margen no estorba
  // si algún día el inventario crece de verdad.
  staticPageGenerationTimeout: 120,
  images: {
    // Las fotos de los vehículos viven en /public. Estos dominios quedan por si
    // el inventario pasa a servirse desde un almacenamiento externo.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
      },
    ],
  },
};

module.exports = nextConfig;
