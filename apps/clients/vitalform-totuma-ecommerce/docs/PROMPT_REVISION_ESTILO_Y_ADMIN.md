# Prompt para Claude — Revisión de estilo, acabado premium y panel de administración

**Copia y pega este bloque completo** cuando pidas a Claude (Cursor/Cloud) que revise y unifique el estilo del proyecto y mejore el panel de administración de citas.

---

## INSTRUCCIÓN PARA CLAUDE

Eres un desarrollador front-end y de producto trabajando en **Francesca D'apuzzo**, una marca de PMU (micropigmentación) de alta gama. El proyecto es una app Next.js 15 con Tailwind v4, DaisyUI v5 y Supabase.

### Objetivo general

1. **Revisar todo el estilo y acabado** de la app (dashboard de usuario, wizard de reserva, historial) para que quede **alineado con el landing** y con la identidad "Luxury Dark" de la marca.
2. **Revisar y rediseñar el panel de administración** de citas (`/dashboard` cuando el usuario tiene `role === 'admin'`): mismo lenguaje visual premium (ocre/grafito, serif, bordes dorados) y misma sensación de calidad que el resto del sitio.
3. Hacer un **repaso general** de consistencia: tipografía, espaciados, bordes, estados de carga, mensajes de error y microcopy para que todo se sienta parte del mismo producto de lujo.

### Referencia de estilo (landing y tema)

- **Landing:** Revisa `components/Hero.js` y la home: fondo oscuro, acentos en **ocre dorado** (#C69C6D / variables primary/accent del tema), tipografía **serif para títulos** (`var(--font-display)` / Playfair), animaciones suaves (GSAP en Hero), badges y CTAs con el mismo tono.
- **Tema CSS:** En `app/globals.css` está el tema `[data-theme="francesca"]`: fondo grafito (#1A1A1A, base-100/200), **primary/accent** en tonos ocre/dorado, inputs con solo borde inferior (estilo “flat luxury”), headings con serif.
- **Colores de referencia:** Fondo principal `#1A1A1A`, tarjetas `#222222`, bordes y acentos `#C69C6D` (ocre). Evitar gradientes genéricos de template; preferir este set limitado y elegante.

### Qué revisar y ajustar

1. **Dashboard de usuario (no admin)**  
   - Header (“Bienvenida, [Nombre]. Tu transformación comienza aquí.”), cards de “Reservar tu Sesión”, **BookingWizard** (stepper de 4 pasos) y card “Boleto Dorado” de cita activa.  
   - Que todo use los mismos colores, serif en títulos, bordes `#C69C6D` y sin estilos que parezcan de otro template (por ejemplo gradientes purple/blue).

2. **BookingWizard**  
   - Pasos: selección de servicio, fecha/hora, ficha clínica, confirmación.  
   - Botones, inputs, toggles y mensajes de error/éxito deben seguir el tema francesca (oscuro, ocre, sin bordes pesados salvo donde corresponda).  
   - Placeholders e iconografía coherentes con el resto.

3. **ActiveAppointment (Boleto Dorado)**  
   - Ya está en estilo “Boleto Dorado” (fondo #222222, borde dorado). Revisar que los textos, badges y la caja de “Recomendaciones antes de tu sesión” sigan el mismo criterio que el landing (serif donde toque, mismo ocre).

4. **Historial estético**  
   - Lista de citas pasadas (completadas/canceladas). Misma paleta y tipografía que el resto del dashboard; cards discretas pero premium.

5. **Panel de administración (admin)**  
   - **Crítico:** El componente `components/AdminDashboard.js` y la vista de `/dashboard` para usuarios con `profile.role === 'admin'` siguen usando un estilo heredado (gradientes primary/accent/secondary genéricos, badges y cards que no siguen el “Luxury Dark” ocre/grafito).  
   - **Tarea:** Rediseñar **todo** el panel de administración para que:
     - Use el mismo fondo #1A1A1A y tarjetas #222222 con bordes #C69C6D.
     - Títulos en serif (font-display).
     - Secciones: Pendientes, Confirmadas, Completadas (o las que haya) con el mismo lenguaje visual que el dashboard de usuario y el landing.
     - Botones de acción (confirmar, completar, cancelar, etc.) con el mismo estilo que los CTAs del sitio (ocre, sin colores de template).
     - Si hay tabs, listas o modales, que sigan la misma estética (oscuro, bordes sutiles, acentos dorados).
   - Mostrar en cada cita, cuando exista, el **nombre del servicio** (relación `appointments` → `services`). El backend ya devuelve `services` en el select de citas del admin; solo falta mostrarlo en la UI y que el estilo sea coherente.

6. **Header del dashboard (admin)**  
   - El bloque superior del dashboard cuando es admin (avatar, nombre, “Administrador”, botones Inicio / Cerrar sesión) debe usar la misma paleta y tipografía que el header del dashboard de usuario (Bienvenida, [Nombre], etc.), para que no haya dos “mundos” visuales distintos.

7. **Repaso general**  
   - Loading states: preferir esqueletos oscuros con un toque dorado (por ejemplo en `app/dashboard/loading.js`) y evitar spinners o skeletons que no encajen con el tema.  
   - Mensajes de error/éxito: mismos colores y tono (por ejemplo alertas con borde ocre o success/warning del tema francesca).  
   - Enlaces y botones secundarios: coherentes en todo el dashboard (usuario y admin).  
   - Si en algún sitio quedan referencias a “Jorge Chacón”, “Beyond Contact Center” o otro producto, sustituirlas por “Francesca” / “Francesca D'apuzzo” y el contexto PMU.

### Archivos clave a tocar

- `app/dashboard/page.js` — Layout del dashboard (usuario y admin).
- `components/AdminDashboard.js` — **Principal:** rediseño completo del panel admin con estilo Luxury Dark.
- `components/BookingWizard.js` — Revisión de estilo y consistencia con el tema.
- `components/ActiveAppointment.js` — Pequeños ajustes si hace falta para alinear con el landing.
- `app/dashboard/loading.js` — Skeleton del dashboard (oscuro + ocre).
- Cualquier otro componente que se use solo en `/dashboard` o en flujos de cita.

### Restricciones técnicas

- Next.js 15, React 19, Tailwind v4, DaisyUI v5.
- No cambiar la lógica de negocio ni las políticas RLS; solo UI, estilos y copy.
- Mantener `createClient` de Supabase correcto (server vs client) y no introducir dependencias nuevas salvo que sea necesario para el diseño.

### Entregable esperado

- Código actualizado de los componentes anteriores con el mismo acabado premium que el landing.
- Panel de administración completamente rediseñado con el tema ocre/grafito y serif, mostrando el nombre del servicio en cada cita cuando aplique.
- Un repaso de consistencia en loading, errores y microcopy para que toda la experiencia se sienta de una sola pieza y de marca “Francesca D'apuzzo”.

---

*(Si quieres, puedes añadir: “Incluye un breve resumen de los cambios que hiciste en cada archivo.”)*
