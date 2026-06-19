const config = {
  appName: "Legión MMA",
  appDescription:
    "Legión MMA — la liga venezolana de artes marciales mixtas fundada por el peleador UFC Omar Morales. Eventos en Caracas, Maracaibo y todo el país.",
  domainName: "legionmmaoficial.com",
  siteUrl:
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : "https://legionmmaoficial.com",
  crisp: {
    id: "",
    onlyShowOnRoutes: ["/"],
  },
  stripe: {
    plans: [],
  },
  aws: {
    bucket: "",
    bucketUrl: "",
    cdn: "",
  },
  resend: {
    fromNoReply: `Legión MMA <noreply@legionmmaoficial.com>`,
    fromAdmin: `Legión MMA <admin@legionmmaoficial.com>`,
    supportEmail: "contacto@legionmmaoficial.com",
  },
  colors: {
    theme: "legion",
    main: "#D4AF37",
  },
  business: {
    instagram: "https://www.instagram.com/legionmmavenezuela",
    whatsapp: "",
    location: "Caracas, Venezuela",
    tagline: "La liga que cambia las artes marciales mixtas.",
  },
  social: {
    instagram: "https://www.instagram.com/legionmmavenezuela",
    facebook: "https://www.facebook.com/LEGIONMMAVENEZUELA",
    x: "https://x.com/omarmoralesjr",
    youtube: "",
  },
  event: {
    name: "Legión",
    edition: "X",
    date: "2026-05-16T18:30:00-04:00",
    venue: "Hotel Tamanaco",
    city: "Caracas, Venezuela",
    ticketUrl: "https://example.com/entradas",
    posterImage: "/cartelera.png",
  },
  auth: {
    loginUrl: "/signin",
    callbackUrl: "/dashboard",
  },
};

export default config;
