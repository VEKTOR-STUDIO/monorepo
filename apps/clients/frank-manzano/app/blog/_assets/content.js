// Blog demo content — replace with your posts

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
    slug: "john-doe",
    name: "John Doe",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Placeholder author bio.",
    job: "Contributor",
    avatar: "https://placehold.co/128x128/f3f4f6/1f2937/png?text=JD",
  },
  {
    slug: "jane-smith",
    name: "Jane Smith",
    description: "Lorem ipsum dolor sit amet. Second placeholder author.",
    job: "Editor",
    avatar: "https://placehold.co/128x128/f3f4f6/1f2937/png?text=JS",
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
    title: "Artículo de demostración uno",
    // The description of the article to display in the article page. Up to 160 characters. It's also used to generate the meta description.
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Descripción genérica para SEO de plantilla.",
    // An array of categories of the article. It's used to generate the category badges, the category filter, and more.
    categories: [
      categories.find((category) => category.slug === "inteligencia-artificial"),
    ],
    // The author of the article. It's used to generate a link to the author and display a short bio of the author.
    author: authors.find((author) => author.slug === "john-doe"),
    // The date of the article. It's used to generate the meta date.
    publishedAt: "2024-01-15",
    image: {
      src: "https://placehold.co/1200x630/f3f4f6/1f2937/png?text=Article+1",
      urlRelative: "https://placehold.co/1200x630/f3f4f6/1f2937/png?text=Article+1",
      alt: "Placeholder",
    },
    // The actual content of the article that will be shown under the <h1> title in the article page.
    content: (
      <>
        <p className={styles.p}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore
          magna aliqua.
        </p>
        <p className={styles.p}>
          Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </p>

        <h2 className={styles.h2}>Pregunta frecuente 1</h2>
        <p className={styles.p}>
          Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
        </p>

        <h3 className={styles.h3}>Subsección demo</h3>
        <ul className={styles.ul}>
          <li className={styles.li}>Lorem ipsum dolor sit amet.</li>
          <li className={styles.li}>Consectetur adipiscing elit.</li>
          <li className={styles.li}>Sed do eiusmod tempor incididunt.</li>
        </ul>

        <h2 className={styles.h2}>Pregunta frecuente 2</h2>
        <p className={styles.p}>
          Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        </p>
      </>
    ),
  },
  {
    slug: "automatizar-negocio-sin-codigo",
    title: "Artículo de demostración dos",
    description:
      "Lorem ipsum dolor sit amet. Segundo artículo placeholder para la plantilla de blog.",
    categories: [
      categories.find((category) => category.slug === "automatizacion"),
    ],
    author: authors.find((author) => author.slug === "john-doe"),
    publishedAt: "2024-02-01",
    image: {
      src: "https://placehold.co/1200x630/e5e7eb/1f2937/png?text=Article+2",
      urlRelative: "https://placehold.co/1200x630/e5e7eb/1f2937/png?text=Article+2",
      alt: "Placeholder",
    },
    content: (
      <>
        <p className={styles.p}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Párrafo de demostración para el segundo artículo.
        </p>

        <h2 className={styles.h2}>Sección demo</h2>
        <ul className={styles.ul}>
          <li className={styles.li}>Item uno</li>
          <li className={styles.li}>Item dos</li>
          <li className={styles.li}>Item tres</li>
        </ul>

        <h3 className={styles.h3}>Subsección</h3>
        <p className={styles.p}>
          Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.
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

