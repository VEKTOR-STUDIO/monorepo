const config = {
  appName: "AthleteVOD",
  appDescription:
    "Plataforma para deportistas: entrenamiento, video bajo demanda y seguimiento de rendimiento. Sustituye este texto por tu marca y propuesta.",
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
    fromNoReply: `AthleteVOD <noreply@yourdomain.com>`,
    fromAdmin: `AthleteVOD <admin@yourdomain.com>`,
    supportEmail: "support@yourdomain.com",
  },
  colors: {
    theme: "light",
    main: "#2563EB",
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
