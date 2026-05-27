# Notion Project Plan — Examples

## Landing-only (e.g. Serpa Agricola)

- **Project description**: "Landing oficial de [Cliente], [una línea de valor]. Una sola página: Hero + Contacto + Footer. Sin Supabase, sin Google Auth ni dashboard; todo lo referente a auth/DB se desactiva (no se elimina). Stack: Next.js 15, Tailwind v4, DaisyUI v5."
- **Checklist de Infraestructura**: Configuración Inicial (config, SEO, theme, fonts); Desactivar (middleware, rutas /signin y /dashboard, Header sin auth, Footer, page.js solo Hero + ContactSection + Footer); Deploy.
- **Resumen**: Tipo = "Landing (Hero, Contacto, Footer)", Auth/DB = "Desactivados".
- **Estructura**: Tabla de 3 filas — Hero | Contacto | Footer con contenido de cada uno.
- **Qué desactivar**: middleware (no Supabase), redirects de signin/dashboard, quitar secciones extra de la home, Header/Footer sin auth, config.auth en null.
- **Inventario de componentes**: Header, Hero, ContactSection (nuevo), Footer.
- **External Services / Env**: "En modo landing no se usan" o "NEXT_PUBLIC_LANDING_ONLY opcional".

## Full-stack (e.g. Bull Pork, e-commerce)

- **Project description**: Include catálogo, carrito, pedidos, auth, dashboard, blog, Stripe/Resend if present.
- **Checklist de Infraestructura**: Add Supabase (proyecto, env vars), Auth (OAuth, redirect URI), Resend, Stripe (keys, webhook), Base de datos (tablas, RLS, seed), Deploy (webhook production).
- **Resumen**: Tipo = "E-commerce" or "Dashboard", Auth/DB = "Supabase + Stripe" (or similar).
- **Estructura**: List or table of main flows: Home, Catálogo, Producto, Carrito, Checkout, Dashboard, Admin, Blog.
- **Qué desactivar**: Often empty or "N/A"; or document optional feature flags.
- **Inventario de componentes**: Header, Footer, Hero, CartProvider, ProductActions, CheckoutClient, AdminProductsClient, etc.
- **External Services**: Supabase, Stripe, Resend; **Environment Variables**: NEXT_PUBLIC_SUPABASE_URL, ANON_KEY, SERVICE_ROLE_KEY, STRIPE_*, RESEND_API_KEY, etc.
- **Optional sections** (if template is extended): API Registry, Database Schema Reference, Webhook Events, Backend Runbook — only if the project has backend/APIs.

## Filling "Brand Architecture Plan" from codebase

- **Cliente / Sector**: From user or from config.appName and appDescription.
- **Paleta**: From config.colors.main, config.colors.theme, or app/globals.css (e.g. `[data-theme="serpa"]`).
- **Vibe**: From UI (DaisyUI theme, fonts in layout), or state "Sans-serif, flat" as default.
- **Datos de contacto**: From config.business (address, phone, email).
- **DB/Backend**: "No usar en esta versión" for landing-only; "Supabase + RLS" (or similar) for full-stack.

## References

- Serpa Agricola (template source): https://www.notion.so/alessandrovaru/Serpa-Agricola-30dbe694490f808fb3f3c5ec990285f9
- Páginas Web (Projects container): https://www.notion.so/alessandrovaru/P-ginas-Web-308be694490f819c8c72d623f923abb3
