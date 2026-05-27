// Blog content — plantilla LuxeBeauty / PMU

// ==================================================================================================================================================================
// BLOG ARTICLES 📚
// ==================================================================================================================================================================

// These styles are used in the content of the articles. When you update them, all articles will be updated.
const styles = {
  h2: "text-2xl lg:text-4xl font-bold tracking-tight mb-4 text-base-content",
  h3: "text-xl lg:text-2xl font-bold tracking-tight mb-2 text-base-content",
  p: "text-base-content/90 leading-relaxed",
  ul: "list-inside list-disc text-base-content/90 leading-relaxed",
  li: "list-item",
  // Altnernatively, you can use the library react-syntax-highlighter to display code snippets.
  code: "text-sm font-mono bg-neutral text-neutral-content p-6 rounded-box my-4 overflow-x-scroll select-all",
  codeInline:
    "text-sm font-mono bg-base-300 px-1 py-0.5 rounded-box select-all",
};

// All the blog authors you want to display on your blog post.
// Using an admin/support article/author as a fallback if the author is not found.
export const authors = [
  {
    slug: "luxe-beauty-studio",
    name: "LuxeBeauty Studio",
    description:
      "Plantilla editorial para tu estudio: micropigmentación, cejas y arte facial. Sustituye autor, foto y bio con tu marca.",
    job: "Estudio de belleza",
    avatar:
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=200&q=80",
  },
];

// All the blog categories you want to display on your blog post.
// Using an admin/support article/category as a fallback if the category is not found.
export const categories = [
  {
    // The slug to use in the URL, from the category's name (to make URL nice looking, optional).
    slug: "inteligencia-artificial",
    // The title of the category to display in the article (required)
    title: "Inteligencia Artificial",
    // A short description of the category to display in the article (optional)
    description:
      "Descubre cómo aplicar la IA en tu negocio para automatizar, optimizar y escalar.",
  },
  {
    slug: "automatizacion",
    title: "Automatización",
    description:
      "Herramientas y workflows para automatizar tareas y hacer crecer tu negocio sin esfuerzo adicional.",
  },
  {
    slug: "estrategia",
    title: "Estrategia de Negocio",
    description:
      "Estrategias y tácticas reales para vender más y hacer crecer tu negocio digital.",
  },
];

// All the blog articles you want to display on your blog post.
// These are in the /blog/[articleId]/page.js pages, to show one article with [articleId] being the slug of the article.
export const articles = [
  {
    // The unique slug to use in the URL. It's also used to generate the canonical URL.
    slug: "como-usar-ia-para-vender-mas",
    // The title to display in the article page (h1). Less than 60 characters. It's also used to generate the meta title.
    title: "Cómo usar IA para vender más en 2025",
    // The description of the article to display in the article page. Up to 160 characters. It's also used to generate the meta description.
    description:
      "Descubre las herramientas de IA que están revolucionando las ventas y cómo implementarlas en tu negocio sin necesidad de ser experto técnico.",
    // An array of categories of the article. It's used to generate the category badges, the category filter, and more.
    categories: [
      categories.find((category) => category.slug === "inteligencia-artificial"),
    ],
    // The author of the article. It's used to generate a link to the author and display a short bio of the author.
    author: authors.find((author) => author.slug === "luxe-beauty-studio"),
    // The date of the article. It's used to generate the meta date.
    publishedAt: "2024-01-15",
    image: {
      // The image to display in <CardArticle /> components.
      src: "/blog/ia-ventas.jpg",
      // The relative URL of the same image to use in the Open Graph meta tags & the Schema Markup JSON-LD.
      urlRelative: "/blog/ia-ventas.jpg",
      alt: "IA para ventas",
    },
    // The actual content of the article that will be shown under the <h1> title in the article page.
    content: (
      <>
        <p className={styles.p}>
          La inteligencia artificial ya no es el futuro, es el presente. Y si no la estás usando para vender más, tu competencia ya te está superando.
        </p>
        <p className={styles.p}>
          En este artículo te muestro exactamente cómo implementar IA en tu proceso de ventas, sin necesidad de ser un experto técnico.
        </p>

        <h2 className={styles.h2}>El problema que nadie te cuenta</h2>
        <p className={styles.p}>
          Mientras tú sigues escribiendo emails de prospección uno por uno, otros emprendedores están usando ChatGPT para generar 200 emails personalizados en 30 minutos.
        </p>
        <p className={styles.p}>
          La IA no espera. Cada día que no la implementas, la brecha con tu competencia se agranda.
        </p>

        <h3 className={styles.h3}>3 formas de usar IA para vender más</h3>
        <ul className={styles.ul}>
          <li className={styles.li}>
            <strong>Prospección automática:</strong> Usa herramientas como Apollo.io con ChatGPT para identificar y contactar leads calificados automáticamente.
          </li>
          <li className={styles.li}>
            <strong>Seguimiento inteligente:</strong> Automatiza tus emails de seguimiento con Make.com y personalízalos con IA según el comportamiento del lead.
          </li>
          <li className={styles.li}>
            <strong>Chatbots de ventas:</strong> Implementa chatbots que califiquen leads 24/7 y agenden citas automáticamente.
          </li>
        </ul>

        <h2 className={styles.h2}>La ventaja competitiva real</h2>
        <p className={styles.p}>
          La ventaja no está en usar IA por usarla. La ventaja está en implementarla con estrategia, medir resultados y optimizar constantemente.
        </p>
        <p className={styles.p}>
          En LuxeBeauty Studio (plantilla) puedes comunicar servicios de micropigmentación y arte facial a tu medida.
        </p>
      </>
    ),
  },
  {
    slug: "automatizar-negocio-sin-codigo",
    title: "Cómo automatizar tu negocio sin saber programar",
    description:
      "Guía práctica para implementar automatización en tu negocio usando herramientas no-code. Workflows reales que puedes copiar hoy mismo.",
    categories: [
      categories.find((category) => category.slug === "automatizacion"),
    ],
    author: authors.find((author) => author.slug === "luxe-beauty-studio"),
    publishedAt: "2024-02-01",
    image: {
      src: "/blog/automatizacion-nocode.jpg",
      urlRelative: "/blog/automatizacion-nocode.jpg",
      alt: "Automatización sin código",
    },
    content: (
      <>
        <p className={styles.p}>
          &quot;No sé programar&quot; ya no es una excusa para no automatizar tu negocio. Las herramientas no-code han democratizado la automatización.
        </p>

        <h2 className={styles.h2}>Las herramientas que necesitas</h2>
        <ul className={styles.ul}>
          <li className={styles.li}>
            <strong>Make.com:</strong> Para conectar aplicaciones y crear workflows automáticos
          </li>
          <li className={styles.li}>
            <strong>Zapier:</strong> Alternativa más simple con miles de integraciones
          </li>
          <li className={styles.li}>
            <strong>Airtable:</strong> Base de datos visual para gestionar todo tu negocio
          </li>
        </ul>

        <h3 className={styles.h3}>Workflow #1: Prospección automática</h3>
        <p className={styles.p}>
          Conecta Apollo.io → ChatGPT → Gmail para generar y enviar emails personalizados automáticamente a nuevos leads cada día.
        </p>

        <h3 className={styles.h3}>Workflow #2: Nutrición de leads</h3>
        <p className={styles.p}>
          Cuando un lead descarga tu lead magnet, automáticamente se activa una secuencia de emails educativos que lo preparan para la venta.
        </p>

        <p className={styles.p}>
          La automatización no es opcional. Es la diferencia entre un negocio que escala y uno que depende 100% de tus horas.
        </p>
      </>
    ),
  },
];

// ==================================================================================================================================================================
// BLOG COMPONENTS 🏗️
// ==================================================================================================================================================================

// These are building components for your articles. You can add as many as you want.
// ---------------------------------------------------------------------------
// A simple <p> component
export const Paragraph = ({ children }) => {
  return <p className={styles.p}>{children}</p>;
};

// A simple <h2> component
export const H2 = ({ children }) => {
  return <h2 className={styles.h2}>{children}</h2>;
};

// A simple <h3> component
export const H3 = ({ children }) => {
  return <h3 className={styles.h3}>{children}</h3>;
};

// A simple <ul> component
export const List = ({ children }) => {
  return <ul className={styles.ul}>{children}</ul>;
};

// A simple <li> component
export const ListItem = ({ children }) => {
  return <li className={styles.li}>{children}</li>;
};

// A simple <code> component
export const Code = ({ children }) => {
  return <code className={styles.code}>{children}</code>;
};

// A simple <code> component for inline code
export const InlineCode = ({ children }) => {
  return <code className={styles.codeInline}>{children}</code>;
};

