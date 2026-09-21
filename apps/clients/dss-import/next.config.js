const nextConfig = {
  reactStrictMode: true,
  // Se pregenera una página por unidad. Son pocas, pero el margen no estorba si
  // algún día el catálogo crece de verdad.
  staticPageGenerationTimeout: 120,
  images: {
    // Las fotos de las unidades irán en /public/catalogo cuando el cliente las
    // cargue —hoy no hay ninguna, ver components/PlantillaPublicacion.js—, así
    // que no hace falta ningún dominio externo. Si algún día el catálogo pasa a
    // servirse desde un almacenamiento aparte, es aquí donde se declara.
    remotePatterns: [],
  },
};

module.exports = nextConfig;
