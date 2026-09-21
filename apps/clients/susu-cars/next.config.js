const nextConfig = {
  reactStrictMode: true,
  // Se pregenera una página por vehículo. Son pocas, pero el margen no estorba
  // si algún día el catálogo crece de verdad.
  staticPageGenerationTimeout: 120,
  images: {
    // Las fotos de los vehículos se bajan de su Instagram a /public/vehiculos
    // (ver tools/instagram), así que se sirven desde aquí y no hace falta
    // ningún dominio externo. Nunca se enlazan directo al CDN de Instagram:
    // esas URL van firmadas y caducan en unas horas. Si algún día el catálogo
    // pasa a servirse desde un almacenamiento aparte, es aquí donde se
    // declara.
    remotePatterns: [],
  },
};

module.exports = nextConfig;
