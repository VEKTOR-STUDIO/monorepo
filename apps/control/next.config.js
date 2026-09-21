const nextConfig = {
  reactStrictMode: true,
  // El centro de control corre en local y no se despliega: lee y escribe en el
  // disco del monorepo y lanza procesos. No hay imágenes remotas ni dominio.
  devIndicators: false,
};

module.exports = nextConfig;
