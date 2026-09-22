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
    "concesionario Valencia",
    "carros usados Valencia",
    "carros 0 km Valencia",
    "concesionario Carabobo",
    "vender mi carro Valencia",
    "consignación de vehículos Valencia",
    "Grupo Autos del Centro",
    "Coronado Carss",
    "Coronado Cars",
  ];

  return {
    title: title || `${config.appName} — Compra, venta y consignación de vehículos en Valencia`,
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
          areaServed: "Valencia, Carabobo, Venezuela",
          // Son parte de un grupo: `parentOrganization` es lo que le dice a
          // Google que Coronado Carss vive dentro del Grupo Autos del Centro,
          // que es como los presentan su bio y su publicación fijada.
          parentOrganization: {
            "@type": "Organization",
            name: config.business.grupo,
            sameAs: [config.business.grupoInstagramUrl].filter(Boolean),
          },
          containedInPlace: {
            "@type": "Place",
            name: config.business.centroLargo,
            address: {
              "@type": "PostalAddress",
              addressLocality: config.business.ciudad,
              addressRegion: config.business.estado,
              addressCountry: "VE",
            },
          },
          // El horario está en una destacada suya que no se pudo leer: no se
          // publica uno inventado. Cuando lo den, va aquí como openingHours.
          sameAs: [config.business.instagramUrl].filter(Boolean),
        }),
      }}
    />
  );
};
