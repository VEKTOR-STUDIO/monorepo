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
    "subastas de autos USA",
    "comprar carro en subasta Estados Unidos",
    "exportar vehículo a Venezuela",
    "importar carro de Estados Unidos a Panamá",
    "importar carro de Estados Unidos a Colombia",
    "Copart IAA Texas exportación",
    "Toyota de subasta",
    "Lone Star All In Autos",
  ];

  return {
    title:
      title || `${config.appName} — Compramos en subasta, reparamos y exportamos a Latinoamérica`,
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
            addressRegion: "TX",
            addressCountry: config.business.pais,
          },
          areaServed: [...config.business.destinos.map((d) => d.nombre), "Latinoamérica"],
          sameAs: [config.business.instagramUrl].filter(Boolean),
        }),
      }}
    />
  );
};
