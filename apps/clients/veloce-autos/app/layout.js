import { Saira, Michroma, JetBrains_Mono } from "next/font/google";
import localFont from "next/font/local";
import { getSEOTags, renderSchemaTags } from "@/libs/seo";
import ClientLayout from "@/components/LayoutClient";
import BarraProgreso from "@/components/BarraProgreso";
import FooterFoot from "@/components/FooterFoot";
import BarraDemo from "@/components/demo/BarraDemo";
import AvisoFlotante from "@/components/demo/AvisoFlotante";
import { esDemo } from "@/libs/demo";
import config from "@/config";
import "./globals.css";

// Saira lleva sola el peso de la página: titulares y texto corrido. Es una
// neo-grotesca de esqueleto cuadrado, que es lo que tiene el rótulo "VELOCE"
// de su comunicado, y trae toda la escala de pesos, así que la jerarquía se
// puede hacer con grosor y espaciado en vez de con una segunda tipografía.
// Una sola familia es además lo que hace que la página se lea "de showroom":
// lo caro no mezcla letras.
const saira = Saira({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-saira",
  display: "swap",
});

// Michroma, y solo para el rótulo de la marca. Es la que tiene la O
// rectangular y la C de lados planos del logotipo original; a cambio solo
// existe en un peso y es demasiado ancha para cualquier otra cosa. Se usa en
// "Veloce" y "Autos", nada más.
const michroma = Michroma({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-michroma",
  display: "swap",
});

// Las cifras —precios, kilometrajes, años— van en mono para que se alineen en
// columna y se puedan comparar de un vistazo, que es lo que hace todo el que
// mira un inventario.
const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-jetbrains",
  display: "swap",
});

// Microgramma: la tipografía de la firma de Alessandrovaru. No es del tema de
// la página, solo se usa en el crédito de autoría (components/FooterFoot.js) y
// en lo que le habla a Veloce, igual que en el resto del monorepo.
const microgramma = localFont({
  src: "../public/fonts/microgramma.otf",
  variable: "--microgramma-font",
  weight: "400",
  display: "swap",
});

export const viewport = {
  themeColor: config.colors.main,
  colorScheme: "dark",
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
      className={`${saira.variable} ${michroma.variable} ${jetbrains.variable} ${microgramma.variable}`}
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
        <BarraDemo />
        <BarraProgreso />
        <ClientLayout>{children}</ClientLayout>
        <FooterFoot />
        {demo && <AvisoFlotante />}
      </body>
    </html>
  );
}
