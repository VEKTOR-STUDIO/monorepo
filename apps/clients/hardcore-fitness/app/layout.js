import { Sora, Questrial, JetBrains_Mono } from "next/font/google";
import localFont from "next/font/local";
import { getSEOTags, renderSchemaTags } from "@/libs/seo";
import ClientLayout from "@/components/LayoutClient";
import FooterFoot from "@/components/FooterFoot";
import { CarritoProvider } from "@/components/CarritoContext";
import Ambiente from "@/components/Ambiente";
import BarraDemo from "@/components/demo/BarraDemo";
import AvisoFlotante from "@/components/demo/AvisoFlotante";
import { esDemo } from "@/libs/demo";
import config from "@/config";
import "./globals.css";

// Geométricas: titulares con Sora, cuerpo con Questrial y cifras con JetBrains
// Mono, que alinea los precios en columna.
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
// la tienda, solo se usa en el crédito de autoría (components/FooterFoot.js),
// igual que en RollPrep y en los demás proyectos.
const microgramma = localFont({
  src: "../public/fonts/microgramma.otf",
  variable: "--microgramma-font",
  weight: "400",
  display: "swap",
});

export const viewport = {
  themeColor: config.colors.main,
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
        <Ambiente />
        <BarraDemo />
        <CarritoProvider>
          <ClientLayout>{children}</ClientLayout>
        </CarritoProvider>
        <FooterFoot />
        {demo && <AvisoFlotante />}
      </body>
    </html>
  );
}
