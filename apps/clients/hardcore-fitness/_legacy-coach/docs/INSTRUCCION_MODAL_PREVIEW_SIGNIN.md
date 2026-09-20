# Instrucción: Modal de vista previa en la página de Sign In

Esta instrucción permite replicar en otros proyectos la funcionalidad de **mostrar una vista previa de “qué obtienes al iniciar sesión” en un modal**, abierto desde el botón principal de login (ej. “Continuar con Google”), con modal cerrable y un botón de contacto. El contenido y el idioma son independientes del template.

---

## 1. Objetivo

- En la página de **sign in**: el botón principal de inicio de sesión **no** inicia sesión (por ahora); en su lugar **abre un modal**.
- El modal muestra una **vista previa comercial** de lo que el usuario obtiene al tener cuenta (dashboard, reservas, historial, etc.), en el **idioma del proyecto**.
- El modal se puede **cerrar** con:
  - Botón X (esquina superior derecha).
  - Clic en el overlay (fondo oscuro).
- Incluir un botón tipo **“Contactar a [Nombre]”** que, por ahora, **solo cierra el modal** (luego se puede cambiar a enlace o mailto).

---

## 2. Prerrequisitos de estructura

El proyecto debe tener (o poder añadirse):

- Una **página de sign in** (ej. `app/signin/page.js` o `pages/signin.js`) con al menos un **botón principal** de login (OAuth, magic link, etc.).
- Un **dashboard** o área post-login con funcionalidades claras (citas, reservas, panel, historial, etc.) para redactar los 4–5 puntos de la vista previa.

---

## 3. Pasos de implementación

### 3.1 Estado del modal

En el componente de la página de sign in (client component si usas App Router):

- Añadir un estado booleano, por ejemplo: `showPreviewModal`.
- Inicializar en `false`.

```js
const [showPreviewModal, setShowPreviewModal] = useState(false);
```

### 3.2 Cambiar el comportamiento del botón principal de login

- Quitar (o no llamar) la función que hace el login real (OAuth, magic link, etc.).
- Hacer que el botón principal dispare la apertura del modal:

```js
onClick={() => setShowPreviewModal(true)}
```

- Quitar `disabled={isLoading}` y el spinner de carga de ese botón si ya no se usa el login real.

### 3.3 Contenido de la vista previa (para rellenar por proyecto)

Definir **4–5 beneficios** que el usuario obtiene al tener cuenta, alineados con lo que hace tu dashboard. Ejemplo de estructura (sustituir textos por los de tu proyecto e idioma):

| # | Título corto        | Descripción breve                                                                 |
|---|---------------------|------------------------------------------------------------------------------------|
| 1 | Panel personal      | Ver la próxima cita/sesión de un vistazo.                                          |
| 2 | Reservar y reprogramar | Elegir fecha y hora en segundos. Cambiar o cancelar cuando quieras.            |
| 3 | Confirmado y claro  | Recibir confirmación y saber cuándo y dónde presentarte.                           |
| 4 | Historial completo | Todas las sesiones en un solo lugar, pasadas y próximas.                          |

- Opcional: un **subtítulo** tipo “Qué incluye tu cuenta” y un **titulillo** tipo “Tus sesiones, todo en un solo lugar” (o equivalente).
- Una **frase de cierre** tipo “Un solo acceso. Todo gestionado. Empieza en segundos.”

Cada ítem puede llevar un **icono** (SVG inline o componente) y las clases de estilo del proyecto (primary, base-content, etc.).

### 3.4 Estructura del modal

- **Contenedor del modal** (solo se renderiza si `showPreviewModal === true`):
  - `position: fixed`, `inset: 0`, `z-index` alto (ej. 50).
  - Fondo semitransparente (ej. `bg-base-content/50` o `bg-black/50`) con `backdrop-blur` si quieres.
  - `role="dialog"`, `aria-modal="true"`, `aria-label` descriptivo (ej. “Vista previa de tu cuenta”).
  - **onClick en el overlay**: `onClick={() => setShowPreviewModal(false)}` para cerrar al hacer clic fuera.

- **Contenedor del contenido** (la “tarjeta” del modal):
  - Ancho máximo (ej. `max-w-md`), `max-height` (ej. `90vh`) con `overflow-y-auto` por si hay mucho texto.
  - Bordes redondeados, borde con color primary, fondo (ej. `bg-base-200` o equivalente).
  - **onClick**: `onClick={(e) => e.stopPropagation()` para que un clic dentro no cierre el modal.

### 3.5 Botón de cerrar (X)

- Dentro del contenedor del contenido, esquina superior derecha:
  - `position: absolute`, `top`, `right`.
  - `onClick={() => setShowPreviewModal(false)}`.
  - `aria-label="Cerrar"` (o el texto en el idioma del proyecto).

### 3.6 Botón “Contactar a [Nombre]”

- Debajo del listado de beneficios y de la frase de cierre.
- Texto: por ejemplo “Contactar a Alessandro” (o el nombre que corresponda).
- Por ahora: **solo cerrar el modal** con `onClick={() => setShowPreviewModal(false)}`.
- Estilo: botón principal (ej. `btn btn-primary btn-block`) para que destaque.

### 3.7 Resumen de UX

- Abrir: clic en el botón principal de la página de sign in → se abre el modal.
- Cerrar: clic en X, clic en el overlay, o clic en “Contactar a [Nombre]”.

---

## 4. Checklist rápido (para otros proyectos)

- [ ] Estado `showPreviewModal` en la página de sign in.
- [ ] Botón principal de login abre el modal (`setShowPreviewModal(true)`); login real desactivado si aplica.
- [ ] Modal con overlay que cierra al hacer clic fuera.
- [ ] Contenido del modal en el idioma del proyecto (título, 4–5 beneficios, frase de cierre).
- [ ] Botón X para cerrar.
- [ ] Botón “Contactar a [Nombre]” que por ahora solo cierra el modal.

---

## 5. Variaciones posteriores

- **Reactivar el login real**: hacer que el botón principal vuelva a llamar a la función de OAuth/magic link además de (o en lugar de) abrir el modal, según el diseño que quieras.
- **Botón “Contactar a X”**: cambiar el `onClick` por un `<a href="...">` (ej. web o `mailto:`) o por `window.open(...)`; opcionalmente cerrar el modal después de navegar.
- **Mostrar la vista previa también en la página** (no solo en modal): reutilizar el mismo bloque de contenido debajo del formulario de sign in si en algún proyecto prefieres no usar modal.

---

## 6. Cómo usar esta instrucción en otro proyecto

1. Copia este archivo (o su contenido) al otro proyecto (ej. en `docs/` o `.cursor/`).
2. En el otro proyecto, di al asistente algo como: *“Sigue la instrucción en docs/INSTRUCCION_MODAL_PREVIEW_SIGNIN.md y aplica el modal de vista previa en la página de sign in; adapta los textos al contenido y idioma de este proyecto.”*
3. Ajusta los textos de la vista previa según las funcionalidades reales del dashboard de ese proyecto.

Con esto puedes repetir el mismo patrón en cualquier proyecto con estructura parecida, independientemente del contenido o idioma.
