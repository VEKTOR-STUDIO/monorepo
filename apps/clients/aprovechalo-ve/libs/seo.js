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
    "suplementos deportivos Caracas",
    "proteína whey Venezuela",
    "creatina",
    "pre-entreno",
    "tienda fitness Caracas",
    "accesorios de gimnasio",
    "vitaminas deportivas",
  ];

  return {
    title: title || `${config.appName} — Suplementación y equipo deportivo en Caracas`,
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
          "@type": "Store",
          name: config.business.razonSocial,
          description: config.appDescription,
          url: `https://${config.domainName}/`,
          telephone: `+${config.business.whatsapp}`,
          address: {
            "@type": "PostalAddress",
            streetAddress: config.business.direccion,
            addressLocality: "Caracas",
            addressCountry: "VE",
          },
          sameAs: [
            config.business.instagramUrl,
            config.business.mercadoLibre,
            config.business.linktree,
          ],
        }),
      }}
    />
  );
};
