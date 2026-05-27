---
name: template-brand-transformer
description: Transforms a base Next.js 15 + Tailwind v4 + Supabase SaaS template into niche-specific brand experiences. Covers vibe extraction, config/CSS theming, schema adaptation, narrative landing pages, and dashboard redesign. Use when the user asks to adapt the template, apply a new brand, transform the UI for a new client, or provides a client's social media or vibe context.
---

# Template Brand Transformer & Full-Stack Architect

Transforms a base Next.js 15 + Tailwind v4 + Supabase SaaS template into a customized, niche-specific brand. Do not only change colors; adapt narrative, UI architecture, and database schema to fit the persona while preserving Auth, Stripe, and core Supabase logic.

## Trigger

Activate when the user:
- Asks to "adapt the template", "apply a new brand", or "transform the UI for a new client"
- Provides a client's social media, profession, or vibe context

---

## 1. Vibe & Brand Extraction

Before writing code, analyze the user's prompt about the client (e.g., Instagram aesthetic, profession, target audience).

Define:

| Dimension | Output |
|-----------|--------|
| **Color palette** | Base background, primary accent, secondary accent (e.g., "Luxury Dark + Ocre", "Neon Cyan & Magenta") |
| **Typography** | Serif vs. sans-serif, heavy impact vs. elegant minimalist |
| **Component style** | Neumorphism, glassmorphism, flat minimal, high-contrast borders, etc. |

---

## 2. Core Configuration

**`config.js`**
- Update `appName`, `appDescription`, `colors.main`, and SEO metadata for the new brand.

**`app/globals.css`**
- Rewrite CSS variables (`@theme`) with the new palette.
- Add brand-specific classes if needed (e.g. `.bg-luxury-gradient`, `.text-neon-glow`).
- Tailwind v4: no `tailwind.config.js`; all theme config in `globals.css` via `@theme`.

---

## 3. Database Adaptation (Supabase)

- Use Supabase MCP or instructions to inspect current schema (`appointments`, `profiles`, `leads`).
- Propose schema changes from the business model:
  - Aesthetic clinic → e.g. `services` table, `health_notes` on appointments.
  - Portfolio → e.g. `portfolio_items` or adapt `articles`.
- Do not drop core auth tables. Keep foreign keys and RLS intact.

---

## 4. Narrative & UI Redesign (`app/page.js`)

Replace generic SaaS layout with a narrative-driven landing:

- **Hero**: Match brand (cinematic video, split screen, centered minimal, etc.).
- **Services/Menu**: Present value in brand style (e.g. high-end menu, action cards).
- **Social proof**: Turn reviews into visual testimonials, masonry galleries, or case studies.

Use semantic HTML: `<article>`, `<section>`, `<aside>`, `<time>` for SEO.

---

## 5. Custom Flow (Dashboard & Forms)

- **Dashboard** (`/dashboard`): Shift from "SaaS metrics" to a client portal (e.g. "Your Next Transformation", "Your Active Projects").
- **Forms**: Adapt booking/appointment to the niche (medical questions, shipping locations, project scopes). Write complete components; no `// ... existing code ...` placeholders except when editing a single line in a large file.

---

## Strict Technical Guardrails

1. **Next.js 15 async**: Always `await` `cookies()`, `headers()`, and `params`.
2. **Supabase in server components**: Always `const supabase = await createClient()` in RSCs.
3. **Tailwind v4**: No `tailwind.config.js`; theme only in `app/globals.css` with `@theme`.
4. **No placeholders**: Deliver full components; avoid `// ... existing code ...` unless changing one line in a large file.
5. **Semantic HTML**: Use `<article>`, `<section>`, `<aside>`, `<time>` where appropriate.

---

## Output Format

1. **Brand Architecture Plan** (short): Palette, vibe, DB change summary.
2. **Code in order**: Configuration → `globals.css` → Hero/Landing → Dashboard/Forms.

For a sample Brand Architecture Plan and schema examples, see [examples.md](examples.md).
