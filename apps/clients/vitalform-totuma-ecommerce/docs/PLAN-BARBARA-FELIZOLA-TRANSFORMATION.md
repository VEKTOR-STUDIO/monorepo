# Plan de transformación: Barbara Felizola — The Fighter & The Baker

Documento de arquitectura y pasos para transformar el template SaaS en una **Split-Experience** dual (Atleta BJJ / Bakery). Sigue la metodología de **template-brand-transformer**, **project-metadata-favicon** y **distinctive-frontend**.

---

## Brand Architecture Plan

### Resumen del concepto

- **Marca**: Barbara Felizola — Atleta Pro BJJ (Campeona Europea 2026, World Master 2024) y emprendedora gastronómica (repostería artesanal y saludable).
- **Experiencia**: Un único sitio con **selector de modo** en el Navbar (Athlete / Bakery) que cambia branding, contenido y CTAs.

### Paleta dual

| Dimensión | **Modo Athlete** | **Modo Bakery** |
|-----------|-------------------|-----------------|
| **Background** | Dark (#0f0f0f / white) | Crema (#FEFCE8) |
| **Primary** | Púrpura BJJ (#6B21A8) | Marrón tostado (#78350F) |
| **Secondary** | Blanco / gris alto contraste | Ocre / beige |
| **Accent** | Oro medallas (#EAB308 / #CA8A04) | Amarillo banano (#FEF08A) |
| **Component style** | Alto contraste, bordes definidos, sans-serif bold | Suave, orgánico, serif elegante |

### Vibe y tipografía

| Modo | Tipografía | Estilo de componentes |
|------|------------|------------------------|
| **Athlete** | Sans-serif bold (Montserrat / Inter) para títulos y body; impacto visual | Cards con bordes marcados, gradientes sutiles, iconografía deportiva (medallas, cinturón) |
| **Bakery** | Serif elegante (Playfair Display) títulos; body legible (Montserrat light o similar) | Cards cálidos, sombras suaves, fotos de producto, énfasis en ingredientes y valor nutricional |

### Cambios en base de datos (Supabase)

- [ ] **Nueva tabla `achievements`**: `id` (uuid), `title` (text), `year` (int), `organization` (text), `medal_type` (text: 'gold'|'silver'|'bronze'|'other'), `created_at` (timestamptz). RLS: lectura pública.
- [ ] **Nueva tabla `products`**: `id` (uuid), `name` (text), `description` (text), `price` (numeric o int centavos), `ingredients` (text), `category` (text, e.g. 'ponque'|'banana_bread'), `image_url` (text nullable), `created_at`, `updated_at`. RLS: lectura pública.
- [ ] **Tabla `leads`** (existente): Reutilizar para captura de interesados en seminarios BJJ y/o pedidos/contacto repostería. Opcional: columna `lead_type` ('seminar'|'bakery'|'newsletter') si se quiere segmentar.
- [ ] **Mantener intactas**: `profiles`, `auth.users`, FKs y RLS de auth. Opcional: mantener `appointments` para agendar seminarios/clases si aplica.

---

## PASO 1: Configuración y branding global

### 1.1 `config.js`

- **appName**: `"Barbara Felizola"`.
- **appDescription**: Descripción dual breve, e.g. *"Atleta de Jiu Jitsu de élite y repostería artesanal saludable. Campeona Europea 2026 · World Master 2024 · Ponqués y Banana Bread."*
- **domainName**: `felizola-ecommerce.vercel.app` (sin `https://`, sin trailing slash).
- **siteUrl**: `https://felizola-ecommerce.vercel.app` en producción; `http://localhost:3000` en dev.
- **colors**:
  - **theme**: Dos temas DaisyUI o variables CSS (ver 1.2). Ej. `theme: "felizola"` como base y se sobrescribe con `--theme-athlete` / `--theme-bakery` según modo.
  - **main**: Color por defecto (ej. púrpura `#6B21A8` para Athlete como primario de marca).
- **business**:
  - **instagram**: `https://www.instagram.com/soyfelizola` (prioritario).
  - **whatsapp**: Número para seminarios y pedidos (ej. `https://wa.me/XXXXXXXX`).
  - **tagline**: Adaptar según modo en UI; en config puede ser genérico o dual.
- **resend / crisp**: Ajustar nombres y soporte a "Barbara Felizola" si se usan.
- **stripe**: Si aplica e-commerce con Stripe, configurar planes; si solo WhatsApp, se puede simplificar o dejar placeholder.

### 1.2 `app/globals.css` — Dos temas (Tailwind v4)

- Definir **dos bloques de tema** con variables CSS:
  - **`[data-theme="felizola-athlete"]`**: Base dark o white, primary `#6B21A8`, accent oro, `--color-athlete-primary`, `--color-athlete-bg`, etc.
  - **`[data-theme="felizola-bakery"]`**: Base crema `#FEFCE8`, primary `#78350F`, accent `#FEF08A`, `--color-bakery-primary`, etc.
- Usar `@theme { }` solo para animaciones/utilities compartidos (shimmer, opacity, etc.); los colores por tema en `[data-theme="..."]`.
- Clases de utilidad opcionales: `.bg-athlete-gradient`, `.text-bakery-warm`, etc., para uso en componentes condicionales.

### 1.3 ThemeContext (estado activo Athlete / Bakery)

- **Archivo**: `contexts/ThemeContext.js` (o `contexts/ProfileModeContext.js`).
- **Estado**: `activeProfile: 'athlete' | 'bakery'`.
- **Acciones**: `setActiveProfile('athlete' | 'bakery')`.
- **Efecto**: Al cambiar `activeProfile`, actualizar `document.documentElement.setAttribute('data-theme', 'felizola-athlete' | 'felizola-bakery')` y opcionalmente persistir en `localStorage` para la siguiente visita.
- **Provider**: Envolver la app en `app/layout.js` con este Provider (dentro de `ClientLayout` o en el layout raíz si el switch está en client).

### 1.4 `app/layout.js`

- **Theme script**: En lugar de fijar `data-theme="francesca"`, usar un script que lea el tema por defecto (ej. desde `localStorage` o `'felizola-athlete'`) y lo aplique para evitar flash. Si el tema es 100% client-driven, el script puede poner `felizola-athlete` por defecto y el ThemeContext lo sobrescribe al hidratar.
- **Fuentes**: Mantener Playfair Display (Bakery) y Montserrat (Athlete); aplicar clase o variable por tema en body/headers según distinctive-frontend (evitar Inter/Roboto genéricos; Montserrat ya está).
- **metadata**: `getSEOTags` con título/descripción de Barbara Felizola (ver PASO 4 y project-metadata-favicon).

---

## PASO 2: Adaptación de la base de datos (Supabase)

### 2.1 Tabla `achievements`

```sql
CREATE TABLE public.achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  year int NOT NULL,
  organization text,
  medal_type text CHECK (medal_type IN ('gold', 'silver', 'bronze', 'other')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "achievements public read" ON public.achievements
  FOR SELECT USING (true);
```

- Semilla: European Champion 2026, World Master 2024, etc.

### 2.2 Tabla `products`

```sql
CREATE TABLE public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  price numeric(10,2) NOT NULL,
  ingredients text,
  category text,
  image_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "products public read" ON public.products
  FOR SELECT USING (true);
```

- Categorías ejemplo: `ponque`, `banana_bread`, etc.

### 2.3 Tabla `leads`

- Mantener estructura actual. Opcional: añadir columna `lead_type text` para distinguir seminario / bakery / newsletter.
- RLS y políticas existentes se mantienen.

### 2.4 Tipos y uso en código

- Actualizar `libs/supabase/types` (o generar desde Supabase) con `achievements` y `products`.
- Server: `const supabase = await createClient();` en RSCs y API routes.
- Client: `createClient()` desde `@/libs/supabase/client` en componentes con switch/forms.

---

## PASO 3: UI/UX — Landing page dual

### 3.1 Navbar y switch de modo

- **Componente**: Extender o reemplazar `Header.js` para incluir el **Profile Switch**.
- **Diseño**: Switch animado con dos opciones (ej. iconos: 🥋 Athlete / 🍌 Bakery o iconos Lucide: Trophy vs Croissant). Al cambiar, se actualiza `ThemeContext` y el resto de la página reacciona.
- **Links de navegación**: Dinámicos según modo:
  - Athlete: Logros, Próximos seminarios, Agendar clase.
  - Bakery: Productos, Pedidos, Contacto.
- **CTA en Nav**: "Agendar Seminario / Clase" (Athlete) vs "Hacer pedido (WhatsApp)" (Bakery).

### 3.2 Hero section dinámica

- **Modo Athlete**: Imagen de Barbara con medallas; título tipo "World Master Champion" o "Campeona Europea 2026"; subtítulo inspirador y disciplinado; fondo y tipografía del tema Athlete.
- **Modo Bakery**: Imagen de repostería (ponqués saludables / banana bread); título "Repostería Artesanal & Saludable"; subtítulo dulce y honesto; fondo y tipografía del tema Bakery.
- **Implementación**: Dos componentes (ej. `HeroAthlete.js`, `HeroBakery.js`) o un solo `Hero.js` que recibe `activeProfile` y renderiza contenido + clases según modo. Usar Framer Motion para **cross-fade** al cambiar de modo (AnimatePresence + key por profile).

### 3.3 Secciones de contenido condicionales

- **Athlete**:
  - **Grid de logros**: Cards desde `achievements` (Europeo 26, World Master 24, etc.) con año, organización, tipo de medalla. Tipografía sans-serif bold, estilo premium.
  - **Próximos seminarios**: Sección con CTA "Agendar Seminario / Clase" (link a WhatsApp o formulario de contacto).
- **Bakery**:
  - **Galería de productos**: Cards de productos desde `products` (Ponqué de Vainilla, Banana Bread, etc.); destacar valor nutricional e ingredientes.
  - **CTA**: "Hacer pedido (WhatsApp)" con link a `config.business.whatsapp`.
- **Común**: Testimonios o redes (priorizar Instagram @soyfelizola); FAQ si aplica; Footer unificado con ambos mensajes o adaptado al modo.

### 3.4 Componentes espejo y semántica

- Crear componentes por faceta donde aporte claridad: `ProfileCardAthlete`, `ProfileCardBaker`, `AchievementsGrid`, `ProductGrid`, etc. Renderizado condicional según `activeProfile`.
- **Semantic HTML**: `<article>`, `<section>`, `<aside>`, `<time>` en secciones y cards para SEO.
- **Framer Motion**: Transición global entre modos (cross-fade de secciones o de toda la landing) para que el cambio no sea solo de color sino de contenido e imágenes.

### 3.5 Imágenes

- Usar fotos proporcionadas (repostería, perfil IG) en Hero Bakery y en galería de productos; placeholders profesionales para Athlete si no hay imagen final.
- Optimizar con `next/image` y tamaños adecuados.

---

## PASO 4: Lógica de negocio y contenido

### 4.1 CTAs adaptables

- **Botón principal (Hero / Nav)**:
  - Athlete: "Agendar Seminario / Clase" → enlace a WhatsApp con mensaje predefinido (ej. "Hola, me interesa agendar seminario/clase de BJJ con Barbara Felizola").
  - Bakery: "Hacer pedido (WhatsApp)" → enlace a WhatsApp con mensaje tipo "Hola, quiero hacer un pedido de repostería".
- Implementar con `config.business.whatsapp` y opcionalmente query params o texto por modo.

### 4.2 Footer

- Mantener crédito "Alessandrovaru" con Microgramma y link a alessandrovaru.com.
- Redes: Priorizar Instagram @soyfelizola; WhatsApp; resto si aplica.
- Texto del footer: Adaptar a Barbara Felizola (nombre, tagline dual o genérico). Sin referencias a Francesca D'Apuzzo ni antigua marca.

### 4.3 Copywriting

- **Athlete**: Tono inspirador, disciplinado, de élite (medallas, constancia, próximos retos).
- **Bakery**: Tono dulce, honesto, saludable (ingredientes, sin refinados, artesanal).

---

## Project Metadata & Favicon (checklist)

- [ ] **config.js**: appName "Barbara Felizola", appDescription, domainName `felizola-ecommerce.vercel.app`, siteUrl, colors, business (instagram, whatsapp, tagline).
- [ ] **app/layout.js**: metadata con `getSEOTags`; theme script según tema por defecto / ThemeContext.
- [ ] **libs/seo.js**: defaults y schema con `config.appName`, `config.appDescription`, `config.business`; metadataBase y OpenGraph/Twitter con `https://${config.domainName}/`; keywords adaptados (BJJ, repostería, Barbara Felizola, etc.); sin "Francesca" ni dominio antiguo.
- [ ] **renderSchemaTags()**: LocalBusiness (o Person + LocalBusiness) con datos de Barbara Felizola y domain.
- [ ] **app/icon.js**, **app/apple-icon.js**, **app/twitter-image.js**: Letra o marca "B" (o logo) con colores del tema (ej. púrpura Athlete o marrón Bakery); fondo coherente con brand.
- [ ] **scripts/generate-favicon.mjs**: Proyecto "Barbara Felizola", colores primarios; ejecutar para regenerar `public/favicon.svg`.
- [ ] **next-sitemap.config.js**: `siteUrl: process.env.SITE_URL || "https://felizola-ecommerce.vercel.app"`.
- [ ] **Privacy / TOS / otras páginas**: Texto y comentarios con Barbara Felizola y dominio actual.
- [ ] **Footer**: Alessandrovaru con Microgramma y link correcto.

---

## Distinctive Frontend (resumen)

- **Athlete**: Tipografía sans-serif bold (Montserrat); contraste alto; bordes definidos; sensación premium y competitiva; animaciones contundentes.
- **Bakery**: Serif elegante (Playfair) en títulos; fondos cálidos; sombras suaves; densidad controlada; micro-interacciones amigables.
- **Motion**: Framer Motion para cross-fade entre modos; animaciones de entrada en cards y hero; evitar genéricos (Space Grotesk, gradientes púrpura sobre blanco tipo "AI slop").
- **Paleta**: Ejecutar con precisión los dos conjuntos de colores (Athlete vs Bakery) y no mezclar en un solo bloque.

---

## Reglas técnicas (guardrails)

1. **Next.js 15**: Siempre `await` para `cookies()`, `headers()`, `params`.
2. **Supabase**: En server `const supabase = await createClient()` (desde `@/libs/supabase/server`); en client `createClient()` desde `@/libs/supabase/client`.
3. **Tailwind v4**: Sin `tailwind.config.js`; tema en `app/globals.css` con `@theme` y `[data-theme="..."]`.
4. **Componentes**: Completos; evitar placeholders "// ... existing code ..." salvo edición puntual en archivos grandes.
5. **Semántica**: Uso de `<article>`, `<section>`, `<aside>`, `<time>` donde corresponda.
6. **Stack**: Next.js 15 (App Router), Tailwind v4, Lucide React para iconos, Framer Motion para transiciones.

---

## Orden de implementación sugerido

1. **Config y temas**: config.js → globals.css (dual themes) → ThemeContext → layout.js (theme script + Provider).
2. **Metadata y favicon**: config ajustado → libs/seo.js → app/layout.js metadata → icon.js / apple-icon.js / twitter-image.js → generate-favicon.mjs → next-sitemap.config.js.
3. **Base de datos**: Crear tablas `achievements` y `products` en Supabase; actualizar tipos; opcional `lead_type` en leads.
4. **Navbar**: Header con Profile Switch (ThemeContext) + links y CTA dinámicos.
5. **Landing**: Hero dinámico (Athlete/Bakery) con Framer Motion → Secciones condicionales (logros, productos, seminarios, CTAs) → Footer actualizado.
6. **Dashboard / formularios**: Si aplica, adaptar dashboard y flujos de contacto/agenda según modo.

---

## Referencias

- Template Brand Transformer: `.cursor/skills/template-brand-transformer/SKILL.md`, `examples.md`
- Project Metadata & Favicon: `.cursor/skills/project-metadata-favicon/SKILL.md`
- Distinctive Frontend: `.cursor/skills/distinctive-frontend/SKILL.md`
- Reglas SQL/Supabase: `.cursor/rules/sql-database-rules.mdc`
- Reglas template Next.js 15: `.cursor/rules/template-rules.mdc`
