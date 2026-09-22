import { Anton, Barlow } from "next/font/google";
import localFont from "next/font/local";
import { getSEOTags, renderSchemaTags } from "@/libs/seo";
import ClientLayout from "@/components/LayoutClient";
import config from "@/config";
import "./globals.css";

// Tipografía estilo Nike: display condensado (Anton) + cuerpo atlético (Barlow).
const anton = Anton({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-anton",
});

const barlow = Barlow({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-barlow",
});

// Microgramma: la tipografía de la firma de Vektor. No es del tema de la
// página, solo se usa en el crédito de autoría (components/FooterFoot.js y
// components/Footer.js), igual que en el resto del monorepo.
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
  return (
    <html
      lang="es"
      data-theme={config.colors.theme}
      className={`${anton.variable} ${barlow.variable} ${microgramma.variable}`}
    >
      <head>{renderSchemaTags()}</head>
      <body className="grain font-sans antialiased bg-base-100 text-base-content">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
