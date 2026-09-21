const nextConfig = {
  reactStrictMode: true,
  // Se pregenera una página por vehículo. Son pocas, pero el margen no estorba
  // si algún día el catálogo crece de verdad.
  staticPageGenerationTimeout: 120,
  images: {
    // Hoy ninguna ficha tiene foto: se dibuja la silueta de la carrocería.
    // Cuando se carguen las fotos reales desde su Instagram irán a
    // /public/vehiculos, que tampoco necesita dominio externo. Si algún día el
    // inventario pasa a servirse desde un almacenamiento aparte, es aquí donde
    // se declara.
    remotePatterns: [],
  },
};

module.exports = nextConfig;
