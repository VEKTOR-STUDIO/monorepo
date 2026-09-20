const nextConfig = {
  reactStrictMode: true,
  // Se pregenera una página por vehículo. Son pocas, pero el margen no estorba
  // si algún día el catálogo crece de verdad.
  staticPageGenerationTimeout: 120,
  images: {
    // Las fotos de los vehículos son las trece páginas del catálogo de HB y
    // viven en /public/vehiculos, así que no hace falta ningún dominio
    // externo. Si algún día el inventario pasa a servirse desde un
    // almacenamiento aparte, es aquí donde se declara.
    remotePatterns: [],
  },
};

module.exports = nextConfig;
