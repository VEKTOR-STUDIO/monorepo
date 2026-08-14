import { Config } from "@remotion/cli/config";

// Los videos de la casa son de marca: negro profundo, volt neón y mucho
// contraste. H.264 con CRF bajo aguanta bien las tramas halftone y las líneas
// de velocidad, que son justo lo que un bitrate pobre convierte en papilla.
Config.setVideoImageFormat("jpeg");
Config.setCodec("h264");
Config.setCrf(16);

// La ceremonia del CAOS vive de flashes de un frame. Sin concurrencia alta el
// render se hace eterno; con esto usa lo que haya disponible.
Config.setConcurrency(null);

// Margen para los assets que Remotion espera antes de pintar un frame (las
// imágenes de marca, sobre todo). El defecto de 30s se queda corto cuando
// varias pestañas arrancan a la vez en una máquina cargada.
Config.setDelayRenderTimeoutInMilliseconds(120_000);

Config.setEntryPoint("./src/index.ts");
Config.setPublicDir("./public");

/**
 * Las tipografías se incrustan en el bundle como data URI en vez de servirse
 * desde `public/`: cada pestaña de Chrome que abre el render tendría que ir a
 * buscar los mismos TTF por HTTP, y con la concurrencia alta alguna petición se
 * queda colgada y tumba el render a mitad. Inlinearlas quita la red de la
 * ecuación — ver `src/projects/roll-prep/fonts.ts`.
 *
 * Las imágenes NO entran aquí a propósito: pesan más, cambian más a menudo y
 * se sirven bien desde `public/` con `staticFile()`.
 */
Config.overrideWebpackConfig((config) => ({
  ...config,
  module: {
    ...config.module,
    rules: [
      { test: /\.(ttf|otf|woff2?)$/, type: "asset/inline" as const },
      ...(config.module?.rules ?? []),
    ],
  },
}));
