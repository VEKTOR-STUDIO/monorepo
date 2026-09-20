import { Sora, Outfit, JetBrains_Mono } from "next/font/google";
import { getSEOTags, renderSchemaTags } from "@/libs/seo";
import ClientLayout from "@/components/LayoutClient";
import { CarritoProvider } from "@/components/CarritoContext";
import BarraDemo from "@/components/demo/BarraDemo";
import AvisoFlotante from "@/components/demo/AvisoFlotante";
import { esDemo } from "@/libs/demo";
import config from "@/config";
import "./globals.css";

// Geométricas: titulares con Sora, cuerpo con Outfit y cifras con JetBrains
// Mono, que alinea los precios en columna.
const sora = Sora({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-sora",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-outfit",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-jetbrains",
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
      className={`${sora.variable} ${outfit.variable} ${jetbrains.variable}`}
    >
      <head>{renderSchemaTags()}</head>
      <body className="font-sans antialiased bg-base-100 text-base-content">
        <BarraDemo />
        <CarritoProvider>
          <ClientLayout>{children}</ClientLayout>
        </CarritoProvider>
        {demo && <AvisoFlotante />}
      </body>
    </html>
  );
}
