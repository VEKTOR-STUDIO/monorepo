import { Playfair_Display, Montserrat, Roboto_Condensed } from "next/font/google";
import { getSEOTags, renderSchemaTags } from "@/libs/seo";
import ClientLayout from "@/components/LayoutClient";
import config from "@/config";
import "./globals.css";
import localFont from "next/font/local";

const microgramma = localFont({
  src: "../public/fonts/microgramma.otf",
  variable: "--microgramma-font",
  display: "swap",
  weight: "400",
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
});

const robotoCondensed = Roboto_Condensed({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "700"],
});

export const viewport = {
  themeColor: config.colors.main,
  width: "device-width",
  initialScale: 1,
};

export const metadata = getSEOTags({
  title: config.appName,
  description: config.appDescription,
  canonicalUrlRelative: "/",
});

export default function RootLayout({ children }) {
  return (
    <html
      lang="es"
      suppressHydrationWarning
      className={`${montserrat.variable} ${playfairDisplay.variable} ${robotoCondensed.variable} ${microgramma.variable}`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var t=localStorage.getItem('vitalform-profile-mode');document.documentElement.setAttribute('data-theme',t==='totuma'?'totuma-mealpreps':'vitalform-fit');})();`,
          }}
        />
        {renderSchemaTags()}
      </head>
      <body className={montserrat.className}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
