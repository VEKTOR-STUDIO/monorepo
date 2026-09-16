const config = {
  appName: "Camargo Coach",
  appDescription:
    "High Performance System for Combat Sports. Fuerza, potencia y conditioning online para atletas de combate: plan por bloques, progresión semanal y seguimiento de cada sesión.",
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
    fromNoReply: `Camargo Coach <noreply@yourdomain.com>`,
    fromAdmin: `Camargo Coach <admin@yourdomain.com>`,
    supportEmail: "support@yourdomain.com",
  },
  colors: {
    // Tema único oscuro (definido en app/globals.css).
    theme: "camargo",
    // Color de marca (rojo). Cambia también --color-primary en globals.css.
    main: "#E11D2A",
  },
  business: {
    address: "Entrenamiento online para atletas de combate",
    phone: "",
    email: "support@yourdomain.com",
    location: "Online",
    tagline: "La ciencia detrás del rendimiento.",
    whatsapp: "",
    instagram: "",
    organizationName: "Camargo Coach · High Performance System for Combat Sports",
  },
  auth: {
    loginUrl: "/signin",
    callbackUrl: "/dashboard",
  },
};

export default config;
