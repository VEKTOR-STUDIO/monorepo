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
    "micropigmentación",
    "PMU",
    "estudio de belleza",
    "microblading",
    "cejas",
    "arte facial",
    "agenda de citas online",
    "plantilla belleza",
    "salón premium",
  ];

  return {
    title: title || `${config.appName} | Micropigmentación y citas online`,
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
      title: openGraph?.title || `${config.appName} | Micropigmentación y citas online`,
      description: openGraph?.description || config.appDescription,
      url: openGraph?.url || `https://${config.domainName}/`,
      siteName: config.appName,
      locale: "es",
      type: "website",
    },

    twitter: {
      title: openGraph?.title || `${config.appName} | Micropigmentación y citas online`,
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
// Tipo: BeautySalon (LocalBusiness) — plantilla genérica de nicho belleza/PMU.
export const renderSchemaTags = () => {
  const ogImage =
    "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=1200&q=80";

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BeautySalon",
          name: config.appName,
          description: config.appDescription,
          url: `https://${config.domainName}/`,
          image: ogImage,
          priceRange: "$$",
          address: {
            "@type": "PostalAddress",
            addressCountry: "XX",
            addressLocality: "Tu ciudad",
          },
          sameAs: [config.business?.instagram].filter(Boolean),
          hasOfferCatalog: {
            "@type": "OfferCatalog",
            name: "Servicios de micropigmentación",
            itemListElement: [
              {
                "@type": "Offer",
                itemOffered: {
                  "@type": "Service",
                  name: "Servicio principal 1",
                  description:
                    "Describe aquí cómo este servicio ayuda a tus clientes a lograr el resultado que buscan.",
                },
              },
              {
                "@type": "Offer",
                itemOffered: {
                  "@type": "Service",
                  name: "Especialidad 2",
                  description:
                    "Texto plantilla: duración, beneficio clave y para quién está pensado.",
                },
              },
              {
                "@type": "Offer",
                itemOffered: {
                  "@type": "Service",
                  name: "Mantenimiento / retoque",
                  description:
                    "Plantilla para comunicar seguimiento y cuidados posteriores.",
                },
              },
            ],
          },
        }),
      }}
    />
  );
};
