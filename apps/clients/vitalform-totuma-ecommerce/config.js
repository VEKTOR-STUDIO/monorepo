const config = {
  // REQUIRED — Proyecto dual VitalForm Fit + Totuma Mealpreps
  appName: "VitalForm Fit · Totuma Mealpreps",
  appDescription:
    "Nutrición basada en evidencia y Real Fooding con Juan Vielma. Totuma Mealpreps: delivery y pick up de totumas listas para la semana — soluciones saludables, no procesados.",
  domainName: "vitalform-totuma-ecommerce.vercel.app",
  siteUrl:
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : "https://vitalform-totuma-ecommerce.vercel.app",
  crisp: {
    id: "",
    onlyShowOnRoutes: ["/"],
  },
  stripe: {
    plans: [],
  },
  aws: {
    bucket: "bucket-name",
    bucketUrl: `https://bucket-name.s3.amazonaws.com/`,
    cdn: "https://cdn-id.cloudfront.net/",
  },
  resend: {
    fromNoReply: `VitalForm Fit <noreply@vitalform.com>`,
    fromAdmin: `VitalForm Fit <admin@vitalform.com>`,
    supportEmail: "hola@vitalform.com",
  },
  colors: {
    theme: "vitalform-fit",
    main: "#2d5a2d",
  },
  business: {
    instagram: "https://www.instagram.com/vitalform_fit",
    whatsapp: "https://wa.me/584120000000",
    location: "Venezuela",
    tagline: "Carga combustible y mantente en movimiento",
    whatsappMessageVitalform: "Hola, me gustaría agendar una consulta nutricional con VitalForm Fit.",
    whatsappMessageTotuma: "Hola, quiero hacer un pedido de Totuma Mealpreps (delivery/pick up).",
  },
  auth: {
    loginUrl: "/signin",
    callbackUrl: "/dashboard",
  },
};

export default config;
