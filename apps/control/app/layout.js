import { IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import localFont from "next/font/local";
import Cabecera from "@/components/Cabecera";
import Avisos from "@/components/Avisos";
import "./globals.css";

// Plex es una tipografía de ingeniería: clara en tamaños pequeños, con cifras
// que no bailan, y se lleva bien con el aire técnico de Microgramma.
const plexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-sans",
  display: "swap",
});

// Rutas, comandos, identificadores y el registro de la rutina.
const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
  display: "swap",
});

const microgramma = localFont({
  src: "../public/fonts/microgramma.otf",
  variable: "--microgramma-font",
  weight: "400",
  display: "swap",
});

export const metadata = {
  title: { default: "Centro de control", template: "%s · Centro de control" },
  description: "Tablero de candidatos, copia de plantillas y rutina de Claude del monorepo.",
  robots: { index: false, follow: false },
};

export const viewport = {
  themeColor: "#15181d",
  colorScheme: "dark",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="es"
      data-theme="control"
      className={`${plexSans.variable} ${plexMono.variable} ${microgramma.variable}`}
    >
      <body className="min-h-svh font-sans text-base-content antialiased">
        <Cabecera />
        {children}
        <Avisos />
      </body>
    </html>
  );
}
