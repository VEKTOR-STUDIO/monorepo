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
    "carros usados Caracas",
    "carros 0 km Caracas",
    "concesionario CCCT",
    "vender mi carro Caracas",
    "publicar mi vehículo gratis",
    "consignación de vehículos Caracas",
    "detailing Caracas",
    "Kings Cars",
  ];

  return {
    title: title || `${config.appName} — Concesionario de vehículos en el C.C.C.T., Caracas`,
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
          areaServed: "Caracas, Venezuela",
          // Un solo local, dentro de un centro comercial. `containedInPlace` es
          // lo que le dice a Google que la dirección no es una calle sino el
          // C.C.C.T., que es como lo busca la gente aquí.
          containedInPlace: {
            "@type": "ShoppingCenter",
            name: config.business.centroLargo,
            address: {
              "@type": "PostalAddress",
              addressLocality: config.business.ciudad,
              addressRegion: config.business.estado,
              addressCountry: "VE",
            },
          },
          // Se atiende con cita previa, así que no se publica un horario de
          // apertura: anunciar "lunes a sábado" invitaría a caer sin avisar,
          // que es justo lo que este negocio no hace.
          publicAccess: false,
          sameAs: [config.business.instagramUrl].filter(Boolean),
        }),
      }}
    />
  );
};
