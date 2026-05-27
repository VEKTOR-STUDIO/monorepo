import { Inter } from "next/font/google";
import { getSEOTags, renderSchemaTags } from "@/libs/seo";
import ClientLayout from "@/components/LayoutClient";
import config from "@/config";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const viewport = {
  themeColor: config.colors.main,
  width: "device-width",
  initialScale: 1,
};

export const metadata = getSEOTags({
  title: "AthleteVOD — Entrenamiento y contenido para deportistas",
  description: config.appDescription,
  canonicalUrlRelative: "/",
});

export default function RootLayout({ children }) {
  return (
    <html lang="es" suppressHydrationWarning className={inter.variable}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var k="template-app-theme";var d="dark";var l="light";var s=typeof localStorage!="undefined"?localStorage.getItem(k):null;var t=(s===d)?d:l;document.documentElement.setAttribute("data-theme",t);document.documentElement.style.colorScheme=t===l?"light":"dark";})();`,
          }}
        />
        {renderSchemaTags()}
      </head>
      <body className={inter.className}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
