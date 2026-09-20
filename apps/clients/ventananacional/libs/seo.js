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
    "concesionaria de automóviles Venezuela",
    "venta de carros Caracas",
    "carros en venta Barcelona Anzoátegui",
    "camionetas en venta Venezuela",
    "consignación de vehículos Venezuela",
    "importación de vehículos Venezuela",
    "comprar carro en dólares",
  ];

  return {
    title: title || `${config.appName} — Concesionaria de automóviles en Venezuela`,
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
  const { business, sedes } = config;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          // AutoDealer y no Store: es lo que es, y es lo que entiende Google
          // para enseñar la ficha del negocio.
          "@type": "AutoDealer",
          name: business.razonSocial,
          description: config.appDescription,
          url: `https://${config.domainName}/`,
          telephone: `+${business.whatsapp}`,
          areaServed: "VE",
          // Una dirección por sala. Sin calle todavía: el perfil solo dice la
          // zona, y es preferible un dato corto y cierto a uno inventado.
          location: sedes.map((sede) => ({
            "@type": "AutoDealer",
            name: `${business.razonSocial} · ${sede.zona}`,
            address: {
              "@type": "PostalAddress",
              addressLocality: sede.ciudad,
              addressCountry: "VE",
            },
          })),
          sameAs: [
            business.instagramUrl,
            business.instagramInmueblesUrl,
            business.threads,
          ],
        }),
      }}
    />
  );
};
