// -----------------------------------------------------------------------------
// Configuración de la tienda.
//
// Los datos de contacto salen del Linktree y el Instagram de Hardcore
// (linktr.ee/Hardcorestore.ve · @hardcore.fitshop). Si alguno cambia, se
// cambia aquí y se propaga a la cabecera, el pie, el checkout y el SEO.
//
// PENDIENTE: `domainName` y `siteUrl` llevan un dominio de ejemplo. Cuando
// esté el definitivo, cambiarlo aquí y en SITE_URL del entorno.
// -----------------------------------------------------------------------------

const config = {
  appName: "Hardcore",
  appDescription:
    "Tienda de suplementación deportiva y equipo de entrenamiento en Caracas. Proteínas, creatina, pre-entreno, vitaminas, accesorios de gimnasio, natación y bolsos.",
  domainName: "hardcorestore.ve",
  siteUrl:
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : process.env.SITE_URL || "https://hardcorestore.ve",

  crisp: {
    id: "",
    onlyShowOnRoutes: ["/"],
  },

  resend: {
    fromNoReply: `Hardcore <noreply@hardcorestore.ve>`,
    fromAdmin: `Hardcore <pedidos@hardcorestore.ve>`,
    supportEmail: "",
  },

  colors: {
    // Tema único oscuro, definido en app/globals.css.
    theme: "hardcore",
    // Rojo de marca. Cambiarlo también en --color-primary de globals.css.
    main: "#F5253C",
  },

  business: {
    nombre: "Hardcore",
    razonSocial: "Hardcore Fit Shop",
    // Número al que llegan los pedidos. Sale de wa.link/cmpxhx.
    whatsapp: "584127076624",
    whatsappVisible: "+58 412-7076624",
    instagram: "hardcore.fitshop",
    instagramUrl: "https://instagram.com/hardcore.fitshop/",
    linktree: "https://linktr.ee/Hardcorestore.ve",
    mercadoLibre: "https://tienda.mercadolibre.com.ve/hardcore",
    direccion: "Centro Lido, El Rosal",
    ciudad: "Caracas, Venezuela",
    horario: "Atención por WhatsApp 24/7",
    tagline: "Suplementación y equipo, de verdad y en stock.",
  },

  // Cómo se paga. Son las tres columnas del catálogo en PDF.
  pagos: {
    bcv: {
      id: "bcv",
      nombre: "Transferencia en bolívares",
      detalle: "Se cobra en bolívares a la tasa del BCV del día.",
      enBolivares: true,
      campoPrecio: "precio_bcv",
    },
    contado: {
      id: "contado",
      nombre: "Contado en divisas",
      detalle: "Efectivo o Zelle. Es el precio más bajo de los tres.",
      enBolivares: false,
      campoPrecio: "precio_contado",
    },
    pago_movil: {
      id: "pago_movil",
      nombre: "Pago Móvil",
      detalle: "En bolívares a la tasa del BCV del día. Sin Cashea.",
      enBolivares: true,
      campoPrecio: "precio_pago_movil",
    },
  },

  entregas: {
    retiro: { id: "retiro", nombre: "Retiro en tienda", detalle: "Centro Lido, El Rosal, Caracas." },
    delivery: { id: "delivery", nombre: "Delivery en Caracas", detalle: "Se coordina el costo por WhatsApp." },
    envio: { id: "envio", nombre: "Envío nacional", detalle: "Por encomienda, se cotiza por WhatsApp." },
  },

  auth: {
    loginUrl: "/signin",
    callbackUrl: "/cuenta",
  },
};

export default config;
