import config from "@/config";

export const getSEOTags = ({
  title,
  description,
  keywords,
  openGraph,
  canonicalUrlRelative,
  extraTags,
} = {}) => {
  // Las búsquedas de este negocio son de CRÉDITO, no de compraventa: quien
  // busca "carros baratos Maracay" no es su cliente; quien busca "vehículos a
  // crédito en Maracay" o "motos en cuotas" sí.
  const defaultKeywords = [
    config.appName,
    "créditos para vehículos Maracay",
    "motos a crédito Maracay",
    "vehículos en cuotas Aragua",
    "financiamiento de vehículos Venezuela",
    "planes de crédito para motos",
    "carros financiados Maracay",
    "cuotas semanales vehículos",
    "DSS Import Export",
  ];

  return {
    title:
      title ||
      `${config.appName} — Créditos para vehículos y motos en ${config.business.ciudad}`,
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
        // `AutoDealer` sería mentir: DSS no vende vehículos, financia su
        // compra. `FinancialService` es el tipo que le corresponde, y de ahí
        // cuelga el producto de crédito con sus condiciones reales.
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FinancialService",
          name: config.business.razonSocial,
          alternateName: config.business.nombre,
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
          areaServed: `${config.business.ciudad} y estado ${config.business.estado}, Venezuela`,
          currenciesAccepted: "USD",
          slogan: config.business.tagline,
          makesOffer: {
            "@type": "Offer",
            name: "Plan de crédito para vehículos y motos",
            category: "VehicleLoan",
            priceCurrency: "USD",
            eligibleCustomerType: "https://schema.org/Consumer",
          },
          sameAs: [config.business.instagramUrl, config.business.enlaces].filter(Boolean),
        }),
      }}
    />
  );
};
