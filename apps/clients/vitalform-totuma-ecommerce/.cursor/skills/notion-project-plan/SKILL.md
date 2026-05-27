---
name: notion-project-plan
description: Creates Notion project plan pages from codebases using the Serpa Agricola template structure. Use when the user wants to document a project in Notion, generate a plan from a codebase, or add a new project to the Páginas Web Projects database. Requires Notion MCP.
---

# Notion Project Plan from Codebase

Generates a **project plan page** in Notion from the current codebase, using the same structure as [Serpa Agricola](https://www.notion.so/alessandrovaru/Serpa-Agricola-30dbe694490f808fb3f3c5ec990285f9). The page must be created in the **Projects** database of [Páginas Web](https://www.notion.so/alessandrovaru/P-ginas-Web-308be694490f819c8c72d623f923abb3).

## Target location (fixed)

| What | Value |
|------|--------|
| **Workspace page** | Páginas Web — https://www.notion.so/alessandrovaru/P-ginas-Web-308be694490f819c8c72d623f923abb3 |
| **Projects database** | Lives inside Páginas Web; contains projects like Serpa Agricola, Bull Pork. |
| **Data source ID (Projects)** | `308be694-490f-813d-a294-000bf1d020de` — use as parent when creating a new project page. |

New project plan pages must belong to this Projects database so they appear in the same gallery as existing projects.

## Workflow

1. **Analyze the codebase**: config (appName, domain, stack), structure (app/, components/, APIs), type (landing-only, e-commerce, dashboard, etc.).
2. **Fill the template** with project-specific content (see Template structure below).
3. **Create the page in Notion** via MCP:
   - Use `mcp_notion_notion-create-pages` with `parent`: `{ "type": "data_source_id", "data_source_id": "308be694-490f-813d-a294-000bf1d020de" }` and `pages`: one object with:
     - **properties**: `Project` (title = project name), `Status` (e.g. "Not started"), `Priority` (e.g. "Medium ⚡️"), `Tech Stack:` (text), `Design System:` (text), and any other DB properties that exist on Projects.
     - **content**: Notion-flavored markdown (see Template structure).
   - If the MCP returns a validation error on `parent` (e.g. "Expected object, received string"), create the page **without** `parent` (standalone private page), then tell the user to **move it manually** into the Projects database in Notion (drag the page into the Projects view).
4. **Optional**: Link the new page from Páginas Web or from the project’s Tasks database if the user uses one.

## Template structure (match Serpa Agricola)

Use this section order and Notion syntax. Replace placeholders from codebase and user context.

```markdown
# Project description
::: callout {icon="/icons/categories_gray.svg" color="gray_bg"}
[1–3 sentences: what the project is, who it’s for, main scope (e.g. landing only / e-commerce / dashboard). Stack in one line.]
:::

# Contexto para la IA (Gema / Cursor)
<details>
<summary>Descripción completa del proyecto</summary>
[Paragraph for AI/Gemini: project name, type, stack, what to enable/disable, config keys, contact or domain, reference links. Copy-paste friendly.]
</details>

# Checklist de Infraestructura
## Configuración Inicial
- [ ] [Item from codebase: config, SEO, theme, fonts]
## [Desactivar / Rutas / APIs — adapt to project]
- [ ] [Items]
## Deploy
- [ ] Dominio, build, lint

---
# Resumen para Notion (como Bull Pork)
| Campo | Valor |
|------|--------|
| Cliente | [Name] |
| Tipo | [e.g. Landing / E-commerce / Dashboard] |
| Stack | [e.g. Next.js 15, Tailwind v4, DaisyUI v5] |
| Auth/DB | [e.g. Desactivados / Supabase + Stripe] |
| Referencia | [URL or short description] |
| Repo | [repo name or URL] |

---
# 1. Brand Architecture Plan
**Cliente:** [Name]. **Sector:** [Industry]. **Paleta:** [colors]. **Vibe:** [typography, style]. **Datos de contacto:** [if applicable]. **DB/Backend:** [use or not].

---
# 2. Estructura [del producto / de la landing / del dashboard]
[Table or list: main sections or screens and their content.]

---
# 3. Qué desactivar / configurar (no eliminar)
[Bullet list: middleware, routes, components, config, env.]

---
# 4. Orden de implementación (Cursor)
1. [Step] 2. [Step] … 8. [Step]

---
# 5. Checklist final
- [ ] [Concrete items before considering the plan done]

---
# 6. Referencias
- [Links to external refs, Notion Páginas Web, template docs]

---
# External Services
[Which services are used or “none for landing only”.]

---
# Environment Variables
[Required or optional env vars.]

---
# Inventario de componentes
| Componente | Archivo | Uso |
|-------------|---------|-----|
| [Name] | [File] | [Role] |

---
[Optional one-line note: e.g. “Documento listo para Cursor.”]
```

- Use **tables** with `| col1 | col2 |` and `header-row="true"` where the Notion API supports it; otherwise plain markdown tables.
- Use **callout** for the short project description.
- Use **details/summary** for the long “Contexto para la IA” block.
- Use **- [ ]** for checklists.

## Inferring content from the codebase

- **config.js / config.ts**: `appName`, `appDescription`, `domainName`, `siteUrl`, `colors.main`, `colors.theme`, `business` (address, phone, email), `auth` (loginUrl, callbackUrl).
- **package.json**: framework (Next.js, React), Tailwind, DaisyUI, Supabase, Stripe, Resend, etc.
- **app/**: routes (signin, dashboard, blog, api), layout, page structure.
- **components/**: Header, Footer, Hero, forms, cart, etc.
- **Middleware / env**: whether auth or landing-only is intended.

From this, fill Brand Architecture, Estructura, Qué desactivar, Orden de implementación, Inventario de componentes, External Services, and Environment Variables.

## Checklist before creating the page

- [ ] Codebase analyzed (config, stack, structure, type).
- [ ] Template sections filled with project-specific text (no generic placeholders left).
- [ ] Notion MCP used: `notion-create-pages` with `parent` = Projects data source when possible.
- [ ] If creation without parent: user instructed to move the new page into the Projects database in Páginas Web.
- [ ] Properties `Project`, `Status`, `Priority`, `Tech Stack:`, `Design System:` set to match the project.

For variant examples (landing-only vs full-stack), see [examples.md](examples.md).
