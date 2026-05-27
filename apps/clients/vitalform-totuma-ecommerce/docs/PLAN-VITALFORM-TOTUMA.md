# Plan de transformación: VitalForm Fit + Totuma Mealpreps

Documento de arquitectura y pasos para adaptar el template dual (Athlete/Bakery) a **VitalForm Fit** (landing principal — Juan como nutricionista) y **Totuma Mealpreps** (segunda landing — delivery/pick up, totumas listas para la semana). Sigue la metodología de **template-brand-transformer**, **project-metadata-favicon** y **distinctive-frontend**. Todo el plan está redactado **estrictamente en español**.

---

## Brand Architecture Plan

### Resumen del concepto

- **Landing 1 (por defecto)**: **VitalForm Fit** — Juan Francisco Vielma, Nutricionista ULA. Servicios de nutrición basada en evidencia y Real Fooding. Objetivo: **conversión a agendamiento de citas** y compra de planes de asesoría. No e-commerce; no se pide dirección de envío.
- **Landing 2**: **Totuma Mealpreps** — Delivery / Pick Up. No son bowls ni poke; soluciones saludables, no procesados; totumas listas para comer en la semana. Color de marca **#3a683a** (verde Totuma).

Un único sitio con **selector de modo** en el Navbar (VitalForm Fit / Totuma Mealpreps) que cambia branding, contenido y CTAs.

### Paleta dual

| Dimensión | **Modo VitalForm Fit** | **Modo Totuma Mealpreps** |
|-----------|-------------------------|----------------------------|
| **Background** | Claro (blanco/off-white) o verde muy suave (salud, naturaleza) | Claro cálido o blanco con acentos verdes |
| **Primary** | Verde salud/vida sana (ej. tono naturaleza, Real Food) | **#3a683a** (verde Totuma) |
| **Secondary** | Verde más oscuro o gris neutro | Verde más claro o crema |
| **Accent** | Toque de contraste (ej. verde lima o blanco) | Blanco o crema sobre #3a683a |
| **Estilo** | Profesional, limpio, basado en evidencia | Orgánico, fresco, “comida real”, delivery |

### Vibe y tipografía

| Modo | Tipografía | Estilo de componentes |
|------|------------|------------------------|
| **VitalForm Fit** | Sans-serif moderna y legible (evitar Inter/Roboto); títulos con peso medio-alto; tono profesional y cercano | Cards limpias, bordes suaves, iconografía salud/nutrición; mensajes claros (Real Fooding, planes personalizados) |
| **Totuma Mealpreps** | Sans-serif amigable; puede compartir familia con VitalForm pero con personalidad “comida real” | Cards con fotos de totumas/mealpreps, énfasis en “no procesados”, delivery/pick up; verde #3a683a dominante |

### Cambios en base de datos (Supabase)

- [ ] **Tabla `appointments`** (existente): Usar para **consultas de VitalForm Fit** (consulta inicial, control, pack mensual). No pedir dirección de envío; solo datos de contacto y reserva.
- [ ] **Tabla `leads`** (existente): Captura de interesados (newsletter, contacto VitalForm y/o Totuma). Opcional: columna `lead_type` ('vitalform'|'totuma'|'newsletter') para segmentar.
- [ ] **Tabla `products`** (si existe o se crea): Para **Totuma Mealpreps** — totumas/mealpreps con nombre, descripción, precio, categoría, imagen. RLS: lectura pública.
- [ ] **Mantener intactas**: `profiles`, `auth.users`, FKs y RLS de auth. Si Totuma requiere pedidos con delivery, valorar tabla `orders` con `delivery_type` ('delivery'|'pickup') y dirección solo para delivery.

---

## PASO 1: Configuración y branding global

### 1.1 `config.js`

- **appName**: Nombre que represente el proyecto dual, p. ej. `"VitalForm Fit · Totuma Mealpreps"` o el dominio principal (p. ej. `"VitalForm Fit"` con Totuma como segunda marca en la descripción).
- **appDescription**: Descripción breve dual para SEO, p. ej. *"Nutrición basada en evidencia y Real Fooding con Juan Vielma. Totuma Mealpreps: delivery y pick up de totumas listas para la semana — soluciones saludables, no procesados."*
- **domainName**: `vitalform-totuma-ecommerce.vercel.app` (sin `https://`, sin barra final).
- **siteUrl**: `https://vitalform-totuma-ecommerce.vercel.app` en producción; `http://localhost:3000` en desarrollo.
- **colors**:
  - **theme**: Base por defecto para el primer modo, p. ej. `"vitalform-fit"`; el segundo tema se aplica vía `data-theme="totuma-mealpreps"`.
  - **main**: Verde VitalForm (salud) como color principal de marca por defecto; Totuma usará #3a683a en su tema.
- **business**:
  - **instagram**: VitalForm Fit (ej. @vitalform_fit) y/o Totuma si aplica.
  - **whatsapp**: Número único o dos (VitalForm para consultas, Totuma para pedidos) según negocio.
  - **tagline**: Adaptable en UI por modo (VitalForm: “Carga combustible y mantente en movimiento”; Totuma: “Totumas listas para comer en la semana”).
  - **whatsappMessageVitalform**: Ej. *"Hola, me gustaría agendar una consulta nutricional con VitalForm Fit."*
  - **whatsappMessageTotuma**: Ej. *"Hola, quiero hacer un pedido de Totuma Mealpreps (delivery/pick up)."*
- **resend / crisp / stripe**: Ajustar nombres y soporte al proyecto (VitalForm / Totuma) si se usan.

### 1.2 `app/globals.css` — Dos temas (Tailwind v4)

- **Tema 1 — VitalForm Fit**: `[data-theme="vitalform-fit"]`
  - Base clara (blanco o off-white/verde muy suave).
  - Primary: verde salud (ej. tono naturaleza).
  - Secondary y accent coherentes con identidad “nutrición, vida sana, evidencia”.
  - Variables opcionales: `--color-vitalform-primary`, `--color-vitalform-bg`, etc.
- **Tema 2 — Totuma Mealpreps**: `[data-theme="totuma-mealpreps"]`
  - Primary: **#3a683a** (verde Totuma).
  - Base clara; secondary/accent que contrasten bien con #3a683a.
  - Variables opcionales: `--color-totuma-primary: #3a683a`, `--color-totuma-bg`, etc.
- Mantener `@theme { }` solo para animaciones/utilidades compartidas (shimmer, opacity, etc.); colores por tema en `[data-theme="..."]`.
- Clases de utilidad opcionales: `.bg-vitalform-light`, `.text-totuma-green`, etc., para uso condicional por modo.

### 1.3 ThemeContext (estado activo VitalForm / Totuma)

- **Estado**: `activeProfile: 'vitalform' | 'totuma'` (sustituir 'athlete' | 'bakery').
- **Acciones**: `setActiveProfile('vitalform' | 'totuma')`.
- **Efecto**: Al cambiar, `document.documentElement.setAttribute('data-theme', 'vitalform-fit' | 'totuma-mealpreps')` y persistir en `localStorage` (ej. clave `vitalform-profile-mode`) para la siguiente visita.
- **Valor por defecto**: `'vitalform'` (primera landing = VitalForm Fit).

### 1.4 `app/layout.js`

- **Theme script**: Leer tema guardado (ej. `localStorage`) o por defecto `vitalform-fit`; aplicar para evitar flash. El ThemeContext sobrescribe al hidratar.
- **Fuentes**: Evitar Arial, Inter, Roboto; usar fuentes con carácter (p. ej. una display + una body refinada) según distinctive-frontend.
- **Metadata**: `getSEOTags` con título/descripción del proyecto (ver PASO 4 y checklist de project-metadata-favicon).

---

## PASO 2: Adaptación de la base de datos (Supabase)

### 2.1 Uso de `appointments` (VitalForm Fit)

- Consultas nutricionales: consulta inicial, control/seguimiento, pack mensual.
- Campos existentes suficientes; **no** incluir dirección de envío en formularios de VitalForm.
- RLS: usuarios ven solo sus propias citas; políticas existentes se mantienen.

### 2.2 Tabla `leads`

- Mantener estructura actual. Opcional: añadir `lead_type text` ('vitalform'|'totuma'|'newsletter') para segmentar.

### 2.3 Totuma Mealpreps: productos y pedidos

- Si existe tabla **products**: usarla para totumas/mealpreps (nombre, descripción, precio, categoría, imagen). RLS: lectura pública.
- Si Totuma requiere pedidos con delivery/pick up: valorar tabla **orders** (o equivalente) con `delivery_type` ('delivery'|'pickup') y dirección solo cuando sea delivery.
- No modificar ni eliminar tablas core de auth ni FKs esenciales.

### 2.4 Tipos y uso en código

- Actualizar tipos de Supabase si se añaden tablas o columnas.
- Server: `const supabase = await createClient();` en RSC y rutas API.
- Client: `createClient()` desde `@/libs/supabase/client` en componentes con switch/formularios.

---

## PASO 3: UI/UX — Landing dual

### 3.1 Navbar y selector de modo

- **Componente**: Adaptar `Header.js` al nuevo dual.
- **Selector**: Dos opciones claras (ej. “VitalForm Fit” / “Totuma Mealpreps”) con iconos representativos (nutrición/salud vs. mealprep/delivery). Al cambiar, se actualiza ThemeContext y el resto de la página reacciona.
- **Enlaces de navegación** según modo:
  - **VitalForm Fit**: Servicios, Cómo funciona, FAQ, Agendar consulta.
  - **Totuma Mealpreps**: Productos/Totumas, Delivery/Pick up, Pedidos, FAQ.
- **CTA en Nav**: “Agendar consulta” (VitalForm) vs. “Pedir por WhatsApp” o “Ver totumas” (Totuma), enlazando a WhatsApp o sección de productos con mensaje predefinido.

### 3.2 Hero section dinámica

- **Modo VitalForm Fit**:
  - Headline principal: *«Carga combustible y mantente en movimiento».*
  - Subtítulo: Nutrición basada en evidencia y Real Fooding; planes personalizados; sin modas pasajeras.
  - CTA: “Agendar consulta”.
  - Estética: profesional, verde salud, limpia.
- **Modo Totuma Mealpreps**:
  - Título y mensaje diferenciador: *Delivery / Pick Up. No son bowls, ni poke. Soluciones saludables. No procesados. Totumas listas para comer en la semana.*
  - CTA: Pedir (WhatsApp) o Ver totumas.
  - Estética: verde #3a683a, orgánico, “comida real”.
- Implementación: dos componentes (ej. `HeroVitalForm.js`, `HeroTotuma.js`) o un `Hero.js` que recibe `activeProfile` y renderiza contenido y clases según modo. Opcional: Framer Motion para cross-fade al cambiar de modo.

### 3.3 Secciones de contenido condicionales

- **VitalForm Fit**:
  - Servicios: Consulta inicial, Control/Seguimiento, Pack mensual; texto breve y beneficios.
  - “Qué incluye”: planes personalizados, Real Fooding, consulta online/presencial, mealpreps como referido (enlace a Totuma).
  - Cómo funciona: elegir servicio → reservar y pagar → asistir (presencial u online).
  - FAQ: consulta inicial, envíos (no; solo servicios), presencial/online, Real Fooding, pack mensual, mealpreps (referido Totuma).
- **Totuma Mealpreps**:
  - Productos/totumas: cards desde BD o estáticos (nombre, descripción, “no procesados”, listas para la semana).
  - Delivery / Pick up: mensaje claro y CTA.
  - FAQ: pedidos, zonas de entrega, pickup, ingredientes.
- **Común**: Testimonios o redes si aplica; Footer unificado con crédito “Alessandrovaru” (Microgramma, link a alessandrovaru.com) y enlaces por modo.

### 3.4 Componentes y semántica

- Componentes por faceta donde aporte claridad: secciones o cards específicas para VitalForm (servicios, beneficios) y para Totuma (productos, delivery). Renderizado condicional según `activeProfile`.
- **HTML semántico**: `<article>`, `<section>`, `<aside>`, `<time>` en secciones y cards para SEO.

### 3.5 Imágenes

- VitalForm: fotos de Juan o de consulta/nutrición si están disponibles; placeholders profesionales en caso contrario.
- Totuma: fotos de totumas/mealpreps, presentación “comida real”; optimizar con `next/image`.

---

## PASO 4: Lógica de negocio y contenido

### 4.1 CTAs adaptables

- **VitalForm Fit**: “Agendar consulta” → enlace a reserva (dashboard/formulario) o WhatsApp con mensaje tipo `whatsappMessageVitalform`. Sin dirección de envío.
- **Totuma Mealpreps**: “Pedir por WhatsApp” o “Ver totumas” → WhatsApp con `whatsappMessageTotuma` o scroll a productos.
- Implementar con `config.business.whatsapp` (y segundo número si aplica) y mensajes por modo en config.

### 4.2 Footer

- Mantener crédito “Alessandrovaru” con fuente Microgramma y enlace a https://alessandrovaru.com.
- Redes y enlaces según negocio (Instagram VitalForm/Totuma, WhatsApp).
- Texto del footer: VitalForm Fit y Totuma Mealpreps; sin referencias a Barbara Felizola ni a marcas anteriores del template.

### 4.3 Copywriting

- **VitalForm Fit**: Tono profesional, cercano, basado en evidencia. Mensajes clave: Real Fooding, planes personalizados, sin dietas milagro, resultados sostenibles. Cierre: “Da el primer paso hacia un plan nutricional a tu medida.”
- **Totuma Mealpreps**: Tono fresco, claro, “comida real”. Refuerzo: no bowls ni poke, no procesados, totumas listas para la semana, delivery/pick up.

### 4.4 Recordatorio VitalForm

- En formularios y mensajes: dejar claro que **no hay envíos**; son servicios de consulta y asesoría. Solo datos de contacto y pago para reservar.

---

## Project Metadata & Favicon (checklist)

- [ ] **config.js**: appName, appDescription, domainName `vitalform-totuma-ecommerce.vercel.app`, siteUrl, colors (theme, main), business (instagram, whatsapp, tagline, whatsappMessageVitalform, whatsappMessageTotuma).
- [ ] **app/layout.js**: metadata con `getSEOTags`; script de tema según valor por defecto / ThemeContext.
- [ ] **libs/seo.js**: títulos, descripciones y keywords desde config y contexto del proyecto (VitalForm Fit, Totuma Mealpreps, nutrición, mealpreps); metadataBase y OpenGraph/Twitter con `https://${config.domainName}/`; sin nombres de template ni dominios antiguos.
- [ ] **renderSchemaTags()**: LocalBusiness (o tipo adecuado) con config.appName, config.appDescription, config.business y config.domainName.
- [ ] **app/icon.js**, **app/apple-icon.js**, **app/twitter-image.js**: Letra o marca del proyecto (ej. “V” o “V+T”) con colores del tema (verde VitalForm o #3a683a Totuma); fondo coherente con la marca.
- [ ] **scripts/generate-favicon.mjs**: Actualizar nombre del proyecto y colores; ejecutar para regenerar `public/favicon.svg`.
- [ ] **next-sitemap.config.js**: `siteUrl: process.env.SITE_URL || "https://vitalform-totuma-ecommerce.vercel.app"`.
- [ ] **Política de privacidad, TOS y demás páginas**: Texto y comentarios con VitalForm Fit / Totuma Mealpreps y dominio actual (.vercel.app).
- [ ] **Footer**: “Alessandrovaru” con Microgramma y enlace correcto.

---

## Distinctive Frontend (resumen)

- **VitalForm Fit**: Tipografía legible y con carácter (evitar Inter/Roboto); paleta verde salud; componentes limpios; sensación profesional y de confianza; animaciones sutiles si se usan.
- **Totuma Mealpreps**: Verde #3a683a como protagonista; fondos y cards que refuercen “comida real” y frescura; densidad y jerarquía claras; microinteracciones amigables.
- **Motion**: Opcional Framer Motion para transición entre modos (cross-fade); animaciones de entrada en hero y cards; evitar esquemas genéricos (gradientes púrpura sobre blanco, tipografías overused).
- **Paleta**: Aplicar con precisión los dos conjuntos de colores (VitalForm vs Totuma) y no mezclarlos en un mismo bloque visual.

---

## Reglas técnicas (guardrails)

1. **Next.js 15**: Siempre `await` para `cookies()`, `headers()` y `params`.
2. **Supabase**: En server `const supabase = await createClient()` (desde `@/libs/supabase/server`); en client `createClient()` desde `@/libs/supabase/client`.
3. **Tailwind v4**: Sin `tailwind.config.js`; tema solo en `app/globals.css` con `@theme` y `[data-theme="..."]`.
4. **Componentes**: Completos; evitar placeholders “// ... existing code ...” salvo edición puntual en archivos grandes.
5. **Semántica**: Uso de `<article>`, `<section>`, `<aside>`, `<time>` donde corresponda.
6. **Idioma**: Todo el contenido visible y comentarios del plan en **español**.

---

## Orden de implementación sugerido

1. **Config y temas**: config.js → globals.css (temas vitalform-fit y totuma-mealpreps, con #3a683a para Totuma) → ThemeContext (vitalform/totuma) → layout.js (script de tema + Provider).
2. **Metadata y favicon**: config actualizado → libs/seo.js → app/layout.js metadata → icon.js, apple-icon.js, twitter-image.js → generate-favicon.mjs → next-sitemap.config.js.
3. **Base de datos**: Ajustes en appointments/leads; crear o adaptar products (y orders si aplica) para Totuma; actualizar tipos.
4. **Navbar**: Header con selector VitalForm Fit / Totuma Mealpreps (ThemeContext), enlaces y CTA dinámicos por modo.
5. **Landing**: Hero dual (VitalForm / Totuma) → secciones condicionales (servicios y beneficios VitalForm; productos y delivery Totuma) → FAQ dual → CTA y Footer.
6. **Dashboard y formularios**: Flujo de agendar consulta para VitalForm (sin dirección de envío); si Totuma tiene pedidos, formulario con opción delivery/pick up y datos necesarios.

---

## Referencias

- Template Brand Transformer: `.cursor/skills/template-brand-transformer/SKILL.md`, `examples.md`
- Project Metadata & Favicon: `.cursor/skills/project-metadata-favicon/SKILL.md`
- Distinctive Frontend: `.cursor/skills/distinctive-frontend/SKILL.md`
- Reglas SQL/Supabase: `.cursor/rules/sql-database-rules.mdc`
- Reglas template Next.js 15: `.cursor/rules/template-rules.mdc`
- Descripción del cliente VitalForm Fit: brief proporcionado (identidad, propuesta de valor, servicios, tono, CTAs).
