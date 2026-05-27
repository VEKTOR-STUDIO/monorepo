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
    "VitalForm Fit",
    "Totuma Mealpreps",
    "nutrición basada en evidencia",
    "Real Fooding",
    "Juan Vielma",
    "consulta nutricional",
    "mealpreps",
    "totumas",
    "delivery saludable",
    "comida real",
    "no procesados",
    "planes nutricionales",
  ];

  return {
    title: title || config.appName,
    description: description || config.appDescription,
    keywords: keywords || defaultKeywords,
    applicationName: config.appName,
    authors: [{ name: config.appName }],
    creator: config.appName,
    metadataBase: new URL(
      process.env.NODE_ENV === "development"
        ? "http://localhost:3000/"
        : `https://${config.domainName}/`
    ),

    openGraph: {
      title: openGraph?.title || config.appName,
      description: openGraph?.description || config.appDescription,
      url: openGraph?.url || `https://${config.domainName}/`,
      siteName: config.appName,
      locale: "es_ES",
      type: "website",
    },

    twitter: {
      title: openGraph?.title || config.appName,
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
          "@type": "LocalBusiness",
          name: config.appName,
          description: config.appDescription,
          url: `https://${config.domainName}/`,
          image: `https://${config.domainName}/opengraph-image`,
          sameAs: [config.business?.instagram].filter(Boolean),
          ...(config.business?.address && {
            address: {
              "@type": "PostalAddress",
              addressCountry: config.business.address.country || "VE",
              addressLocality: config.business.address.locality || config.business?.location,
            },
          }),
          ...(config.business?.whatsapp && {
            telephone: config.business.whatsapp.replace(/^https?:\/\//, "").replace(/\D/g, "").slice(0, 15),
          }),
        }),
      }}
    />
  );
};
