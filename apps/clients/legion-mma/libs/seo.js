import config from "@/config";

// Genera todas las etiquetas SEO para cada página.
// Ya se incluye en el root layout.js — solo úsalo en páginas específicas
// si necesitas sobreescribir título/descripción/canonical.
export const getSEOTags = ({
  title,
  description,
  keywords,
  openGraph,
  canonicalUrlRelative,
  extraTags,
} = {}) => {
  const defaultKeywords = [
    "MMA",
    "artes marciales mixtas",
    "Legión MMA",
    "Omar Morales",
    "peleas Venezuela",
    "Caracas",
    "Maracaibo",
    "UFC Venezuela",
    "cartelera MMA",
  ];

  const defaultTitle = `${config.appName} | Liga venezolana de artes marciales mixtas`;

  return {
    title: title || defaultTitle,
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
      title: openGraph?.title || defaultTitle,
      description: openGraph?.description || config.appDescription,
      url: openGraph?.url || `https://${config.domainName}/`,
      siteName: config.appName,
      locale: "es",
      type: "website",
    },

    twitter: {
      title: openGraph?.title || defaultTitle,
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

// Schema de datos estructurados para Google Rich Results.
// Tipo: SportsOrganization — liga de MMA.
export const renderSchemaTags = () => {
  const ogImage = config.event?.posterImage;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SportsOrganization",
          name: config.appName,
          description: config.appDescription,
          url: `https://${config.domainName}/`,
          image: ogImage,
          sport: "Mixed Martial Arts",
          founder: {
            "@type": "Person",
            name: "Omar Morales",
          },
          location: {
            "@type": "Place",
            address: {
              "@type": "PostalAddress",
              addressCountry: "VE",
              addressLocality: "Caracas",
            },
          },
          sameAs: [
            config.social?.instagram,
            config.social?.facebook,
            config.social?.x,
          ].filter(Boolean),
          event: config.event && {
            "@type": "SportsEvent",
            name: `${config.event.name} ${config.event.edition}`,
            startDate: config.event.date,
            location: {
              "@type": "Place",
              name: config.event.venue,
              address: config.event.city,
            },
            offers: {
              "@type": "Offer",
              url: config.event.ticketUrl,
              availability: "https://schema.org/InStock",
            },
          },
        }),
      }}
    />
  );
};
