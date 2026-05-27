// Shared component library — exports se van llenando a medida que migramos
// componentes desde los proyectos cliente.
// Reglas:
//  - Cero hex hardcodeados: usar tokens DaisyUI (bg-primary, text-base-content,
//    bg-base-100...) para que cada app pinte con su propio tema.
//  - Componentes presentacionales y prop-driven: nada de imports de
//    `@/config`, `@/libs/supabase/...` ni assets locales.
//  - Las utilidades CSS (animaciones, gradiente animado) viven en
//    `./styles.css` y se importan desde la `globals.css` de cada app.

export { default as Header } from "./Header";
export { default as Hero } from "./Hero";
