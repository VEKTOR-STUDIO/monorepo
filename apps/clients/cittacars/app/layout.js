import { Sora, Questrial, JetBrains_Mono } from "next/font/google";
import localFont from "next/font/local";
import { Analytics } from "@vercel/analytics/next";
import { getSEOTags, renderSchemaTags } from "@/libs/seo";
import ClientLayout from "@/components/LayoutClient";
import FooterFoot from "@/components/FooterFoot";
import BarraDemo from "@/components/demo/BarraDemo";
import AvisoFlotante from "@/components/demo/AvisoFlotante";
import { esDemo } from "@/libs/demo";
import config from "@/config";
import "./globals.css";

// Geométricas: titulares con Sora, cuerpo con Questrial y cifras con JetBrains
// Mono, que alinea precios, años y kilometrajes en columna.
const sora = Sora({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-sora",
  display: "swap",
});

// Questrial solo se publica en un peso, el 400. Lo que en el cuerpo pida
// negrita lo sintetiza el navegador; los titulares no dependen de esto, que
// para eso está Sora.
const questrial = Questrial({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-questrial",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-jetbrains",
  display: "swap",
});

// Microgramma: la tipografía de la firma de Vektor. No es del tema de
// la página, solo se usa en el crédito de autoría (components/FooterFoot.js) y
// en la voz de venta, igual que en el resto de proyectos del monorepo.
const microgramma = localFont({
  src: "../public/fonts/microgramma.otf",
  variable: "--microgramma-font",
  weight: "400",
  display: "swap",
});

export const viewport = {
  // El negro del logotipo, no el rojo: es el color de fondo de la página y lo
  // que tiñe la barra del navegador en el móvil.
  themeColor: config.colors.fondo,
  width: "device-width",
  initialScale: 1,
};

export const metadata = getSEOTags();

export default function RootLayout({ children }) {
  const demo = esDemo();

  return (
    <html
      lang="es"
      data-theme={config.colors.theme}
      // Lo lee el CSS para dejarle sitio a la franja de demo (--alto-barra-demo).
      data-demo={demo ? "true" : undefined}
      className={`${sora.variable} ${questrial.variable} ${jetbrains.variable} ${microgramma.variable}`}
    >
      <head>
        {renderSchemaTags()}
        {/* Lo que va a entrar animado se oculta desde el CSS para que no dé un
            salto entre que el servidor lo pinta y GSAP toma el control. Si no
            hay JavaScript nadie lo animaría y se quedaría invisible, así que
            aquí se vuelve a mostrar. */}
        <noscript
          dangerouslySetInnerHTML={{
            __html: `<style>[data-anima]{opacity:1 !important}</style>`,
          }}
        />
      </head>
      <body className="font-sans antialiased bg-base-100 text-base-content">
        {/* El filtro que recorta el fondo negro del logotipo (components/Logo.js).
            Va aquí, una sola vez, porque un filtro SVG se referencia por id y
            repetirlo en cada instancia del logo sería duplicar el mismo nodo.
            El alfa sale del brillo del píxel: negro → transparente, y el blanco,
            el rojo y el verde del rótulo se quedan como están. */}
        <svg width="0" height="0" aria-hidden="true" focusable="false" className="absolute">
          <filter id="marca-alfa" colorInterpolationFilters="sRGB">
            <feColorMatrix
              type="matrix"
              values="1 0 0 0 0
                      0 1 0 0 0
                      0 0 1 0 0
                      1.4 1.4 1.4 0 -0.25"
            />
          </filter>
        </svg>

        <BarraDemo />
        <ClientLayout>{children}</ClientLayout>
        <FooterFoot />
        {demo && <AvisoFlotante />}
        {/* Web Analytics de Vercel: cuenta las visitas, también las de /entrar,
            que es como se sabe si el prospecto abrió el enlace. Solo funciona
            con Web Analytics activado en el proyecto de Vercel. */}
        <Analytics />
      </body>
    </html>
  );
}
