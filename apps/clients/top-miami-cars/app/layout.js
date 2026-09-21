import { Russo_One, Titillium_Web, JetBrains_Mono } from "next/font/google";
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

// La letra del logotipo de Top Miami Cars es ancha, pesada y de esquinas
// redondeadas, con la O casi rectangular. Russo One es de esa misma familia de
// formas y es libre; solo existe en un peso, y el CSS se encarga de que nadie
// le fabrique una negrita falsa (ver .display en globals.css).
const russo = Russo_One({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-russo",
  display: "swap",
});

// El cuerpo, en Titillium Web: comparte las curvas cuadradas de la display sin
// ser una letra de rótulo, así que el texto corrido no desentona con los
// titulares y se sigue leyendo bien a 14 px.
const titillium = Titillium_Web({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-titillium",
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
// en lo que le habla al dueño de Top Miami Cars, igual que en el resto del
// monorepo.
const microgramma = localFont({
  src: "../public/fonts/microgramma.otf",
  variable: "--microgramma-font",
  weight: "400",
  display: "swap",
});

export const viewport = {
  themeColor: config.colors.main,
  colorScheme: "light",
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
      className={`${russo.variable} ${titillium.variable} ${jetbrains.variable} ${microgramma.variable}`}
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
