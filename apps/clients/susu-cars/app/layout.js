import { Cinzel, Archivo, JetBrains_Mono } from "next/font/google";
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

// "SUSU" está escrito en capitales romanas de remate fino, de las que se
// tallaban en piedra. Cinzel es exactamente esa letra y es libre, así que los
// titulares de la página son los del logotipo y no una aproximación.
//
// Solo tiene mayúsculas, y aquí no es un límite: todo lo que usa .display va
// en caja alta. Lo que sí importa es no pedirle pesos que no hacen falta —cada
// uno es una descarga más en una página que ya sirve fotos de vehículos.
const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-cinzel",
  display: "swap",
});

// El cuerpo, en una grotesca ancha que aguanta bien el fondo negro. Hace de
// contrapeso: una romana da mucha personalidad en un titular y cansa en un
// párrafo, así que todo lo que se lee de verdad va en ésta.
const archivo = Archivo({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-archivo",
  display: "swap",
});

// Las cifras —precios, kilometrajes, años— van en mono para que se alineen en
// columna y se puedan comparar de un vistazo, que es lo que hace todo el que
// mira un catálogo de carros.
const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-jetbrains",
  display: "swap",
});

// Microgramma: la tipografía de la firma de Alessandrovaru. No es del tema de
// la página, solo se usa en el crédito de autoría (components/FooterFoot.js) y
// en lo que le habla al dueño de SUSU CARS, igual que en el resto del
// monorepo.
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
      className={`${cinzel.variable} ${archivo.variable} ${jetbrains.variable} ${microgramma.variable}`}
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
