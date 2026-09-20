import { Sora, Outfit, JetBrains_Mono } from "next/font/google";
import { getSEOTags, renderSchemaTags } from "@/libs/seo";
import ClientLayout from "@/components/LayoutClient";
import { CarritoProvider } from "@/components/CarritoContext";
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
  return (
    <html
      lang="es"
      data-theme={config.colors.theme}
      className={`${sora.variable} ${outfit.variable} ${jetbrains.variable}`}
    >
      <head>{renderSchemaTags()}</head>
      <body className="font-sans antialiased bg-base-100 text-base-content">
        <CarritoProvider>
          <ClientLayout>{children}</ClientLayout>
        </CarritoProvider>
      </body>
    </html>
  );
}
