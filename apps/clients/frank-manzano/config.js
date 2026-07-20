const config = {
  appName: "Frank Manzano",
  appDescription:
    "Entrenamiento, preparación física y contenido en video para deportistas. Método, constancia y rendimiento real.",
  domainName: "yourdomain.com",
  siteUrl:
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : "https://yourdomain.com",
  crisp: {
    id: "",
    onlyShowOnRoutes: ["/"],
  },
  stripe: {
    plans: [],
    publishableKey: process.env.STRIPE_PUBLIC_KEY || "",
    webhookSecret: "",
    priceIds: {
      starter: "",
      pro: "",
      enterprise: "",
    },
  },
  aws: {
    bucket: "",
    bucketUrl: "",
    cdn: "",
  },
  resend: {
    fromNoReply: `Frank Manzano <noreply@yourdomain.com>`,
    fromAdmin: `Frank Manzano <admin@yourdomain.com>`,
    supportEmail: "support@yourdomain.com",
  },
  colors: {
    // Tema único oscuro estilo Nike (definido en app/globals.css).
    theme: "frank",
    // Color de marca (rojo eléctrico). Cambia también --color-primary en globals.css.
    main: "#E11D2A",
  },
  business: {
    address: "Instalaciones / Centro de entrenamiento — Ciudad, País",
    phone: "",
    email: "support@yourdomain.com",
    location: "Ciudad, País",
    tagline: "Rendimiento, constancia y método. Entrena con propósito.",
    whatsapp: "",
    instagram: "",
    organizationName: "Alto Rendimiento Athletics",
  },
  auth: {
    loginUrl: "/signin",
    callbackUrl: "/dashboard",
  },
};

export default config;
