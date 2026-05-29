const config = {
  appName: "Legión MMA",
  appDescription:
    "Legión MMA — la liga venezolana de artes marciales mixtas fundada por el peleador UFC Omar Morales. Eventos en Caracas, Maracaibo y todo el país.",
  domainName: "legionmma.ve",
  siteUrl:
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : "https://legionmma.ve",
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
    fromNoReply: `Legión MMA <noreply@legionmma.ve>`,
    fromAdmin: `Legión MMA <admin@legionmma.ve>`,
    supportEmail: "contacto@legionmma.ve",
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
    posterImage:
      "https://images.unsplash.com/photo-1599058917212-d750089bc07e?auto=format&fit=crop&w=900&q=80",
  },
  auth: {
    loginUrl: "/signin",
    callbackUrl: "/dashboard",
  },
};

export default config;
