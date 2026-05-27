const config = {
  // REQUIRED
  appName: "LuxeBeauty Studio",
  // REQUIRED: a short description of your app for SEO tags (can be overwritten)
  appDescription:
    "Plantilla profesional para estudios de micropigmentación, cejas y arte facial. Agenda citas en línea, presenta servicios y genera confianza desde el primer clic.",
  // REQUIRED (no https://, not trialing slash at the end, just the naked domain)
  domainName: "tudominio.com",
  // Full site URL (used for auth callbacks and redirects)
  siteUrl:
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : "https://tudominio.com",
  crisp: {
    // Crisp website ID. IF YOU DON'T USE CRISP: just remove this => Then add a support email in this config file (resend.supportEmail) otherwise customer support won't work.
    id: "",
    // Hide Crisp by default, except on route "/". Crisp is toggled with <ButtonSupport/>. If you want to show Crisp on every routes, just remove this below
    onlyShowOnRoutes: ["/"],
  },
  stripe: {
    // Create multiple plans in your Stripe dashboard, then add them here. You can add as many plans as you want, just make sure to add the priceId
    plans: [
      {
        // REQUIRED — we use this to find the plan in the webhook (for instance if you want to update the user's credits based on the plan)
        priceId: "",
        //  REQUIRED - Name of the plan, displayed on the pricing page
        name: "Esencial",
        // A friendly description of the plan, displayed on the pricing page. Tip: explain why this plan and not others
        description: "Ideal para lanzar tu presencia online",
        // The price you want to display, the one user will be charged on Stripe.
        price: 79,
        // If you have an anchor price (i.e. $29) that you want to display crossed out, put it here. Otherwise, leave it empty
        priceAnchor: 99,
        features: [
          {
            name: "Landing y flujo de citas",
          },
          { name: "Autenticación de usuarios" },
          { name: "Base de datos incluida" },
          { name: "Emails transaccionales" },
        ],
      },
      {
        // This plan will look different on the pricing page, it will be highlighted. You can only have one plan with isFeatured: true
        isFeatured: true,
        priceId: "",
        name: "Profesional",
        description: "Más herramientas para tu estudio",
        price: 99,
        priceAnchor: 149,
        features: [
          {
            name: "Todo lo del plan Esencial",
          },
          { name: "Panel de cliente" },
          { name: "Pagos con Stripe" },
          { name: "Soporte por email" },
          { name: "Actualizaciones del template" },
        ],
      },
    ],
  },
  aws: {
    // If you use AWS S3/Cloudfront, put values in here
    bucket: "",
    bucketUrl: "",
    cdn: "",
  },
  resend: {
    // REQUIRED — Email 'From' field to be used when sending magic login links
    fromNoReply: `LuxeBeauty Studio <noreply@tudominio.com>`,
    // REQUIRED — Email 'From' field to be used when sending other emails, like abandoned carts, updates etc..
    fromAdmin: `LuxeBeauty Studio <admin@tudominio.com>`,
    // Email shown to customer if need support. Leave empty if not needed => if empty, set up Crisp above, otherwise you won't be able to offer customer support."
    supportEmail: "contacto@tudominio.com",
  },
  colors: {
    // REQUIRED — The DaisyUI theme to use (added to the main layout.js). Leave blank for default (light & dark mode).
    theme: "luxury-beauty",
    // REQUIRED — This color will be reflected on the whole app outside of the document (loading bar, Chrome tabs, etc..).
    main: "#B87A87",
  },
  // Brand-specific configuration
  business: {
    instagram: "https://www.instagram.com",
    whatsapp: "https://wa.me/1234567890",
    location: "Tu ciudad",
    tagline: "Belleza con intención, resultados con propósito.",
  },
  auth: {
    // REQUIRED — the path to log in users. It's use to protect private routes (like /dashboard). It's used in apiClient (/libs/api.js) upon 401 errors from our API
    loginUrl: "/signin",
    // REQUIRED — the path you want to redirect users after successfull login (i.e. /dashboard, /private). This is normally a private page for users to manage their accounts. It's used in apiClient (/libs/api.js) upon 401 errors from our API & in ButtonSignin.js
    callbackUrl: "/dashboard",
  },
};

export default config;
