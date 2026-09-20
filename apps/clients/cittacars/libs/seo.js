import config from "@/config";

export const getSEOTags = ({
  title,
  description,
  keywords,
  openGraph,
  canonicalUrlRelative,
  extraTags,
} = {}) => {
  const defaultKeywords = [
    config.appName,
    "concesionario Venezuela",
    "camionetas en venta Venezuela",
    "pick-up 4x4 Venezuela",
    "carros usados en dólares",
    "taller de accesorios 4x4",
    "detailing de vehículos",
    "vehículos en consignación",
  ];

  return {
    title: title || `${config.appName} — Concesionario, taller y detailing`,
    description: description || config.appDescription,
    keywords: keywords || defaultKeywords,
    applicationName: config.appName,
    authors: [{ name: config.business.razonSocial }],
    creator: config.business.razonSocial,
    metadataBase: new URL(
      process.env.NODE_ENV === "development"
        ? "http://localhost:3000/"
        : `https://${config.domainName}/`
    ),

    openGraph: {
      title: openGraph?.title || `${config.appName}`,
      description: openGraph?.description || config.appDescription,
      url: openGraph?.url || `https://${config.domainName}/`,
      siteName: config.appName,
      locale: "es_ES",
      type: "website",
    },

    twitter: {
      title: openGraph?.title || `${config.appName}`,
      description: openGraph?.description || config.appDescription,
      card: "summary_large_image",
    },

    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },

    ...(canonicalUrlRelative && {
      alternates: { canonical: canonicalUrlRelative },
    }),

    ...extraTags,
  };
};

export const renderSchemaTags = () => {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          // AutoDealer y no Store: esto es un concesionario con taller, y así
          // es como Google entiende el negocio.
          "@type": "AutoDealer",
          name: config.business.razonSocial,
          description: config.appDescription,
          url: `https://${config.domainName}/`,
          // Solo lo que se sabe de verdad. El teléfono y la dirección entran
          // el día que el cliente los dé; inventar un local es peor que no
          // poner nada, porque Google lo cruza con Maps.
          ...(config.business.whatsapp && { telephone: `+${config.business.whatsapp}` }),
          address: {
            "@type": "PostalAddress",
            addressCountry: "VE",
          },
          sameAs: [config.business.instagramUrl].filter(Boolean),
        }),
      }}
    />
  );
};
