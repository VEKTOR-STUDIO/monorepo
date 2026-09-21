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
    "concesionario Caracas",
    "venta de camiones Venezuela",
    "camiones nuevos y usados Venezuela",
    "carros 0 km Caracas",
    "carros usados Caracas",
    "consignación de vehículos Caracas",
    "dealer San Antonio de los Altos",
    "DealerNauta Cars",
  ];

  return {
    title: title || `${config.appName} — Vehículos y camiones en Caracas y San Antonio de los Altos`,
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
          "@type": "AutoDealer",
          name: config.business.razonSocial,
          description: config.appDescription,
          url: `https://${config.domainName}/`,
          // Sin número configurado, `telephone` se queda fuera del esquema:
          // publicar "+" a secas es peor que no publicar nada.
          ...(config.business.whatsapp && {
            telephone: `+${config.business.whatsapp}`,
          }),
          address: {
            "@type": "PostalAddress",
            streetAddress: config.business.direccion,
            addressLocality: config.business.ciudad,
            addressRegion: config.business.estado,
            addressCountry: "VE",
          },
          areaServed: "Caracas y Miranda, Venezuela",
          // Las dos sedes, cada una con su dirección y su teléfono. Sin esto,
          // Google entiende que DealerNauta es un solo local y se queda con
          // uno de los dos.
          location: config.business.sedes.map((sede) => ({
            "@type": "AutoDealer",
            name: `${config.business.nombre} · ${sede.nombre}`,
            telephone: `+${sede.whatsapp}`,
            address: {
              "@type": "PostalAddress",
              streetAddress: sede.zona,
              addressLocality: sede.nombre,
              addressRegion: sede.estado,
              addressCountry: "VE",
            },
            sameAs: [sede.instagramUrl].filter(Boolean),
          })),
          sameAs: [
            config.business.instagramUrl,
            config.business.instagramCaracasUrl,
          ].filter(Boolean),
        }),
      }}
    />
  );
};
