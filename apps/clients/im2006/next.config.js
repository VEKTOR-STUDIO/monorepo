const nextConfig = {
  reactStrictMode: true,
  // Se pregenera una página por vehículo. Son pocas, pero el margen no estorba
  // si algún día el catálogo crece de verdad.
  staticPageGenerationTimeout: 120,
  images: {
    // Las fotos de las unidades son sus publicaciones de Instagram, bajadas
    // con tools/instagram a /public/vehiculos, así que no hace falta ningún
    // dominio externo: NO se enlazan desde el CDN de Instagram, que firma las
    // URL y las caduca en unas horas. Si algún día el inventario pasa a
    // servirse desde un almacenamiento aparte, es aquí donde se declara.
    remotePatterns: [],
  },
};

module.exports = nextConfig;
