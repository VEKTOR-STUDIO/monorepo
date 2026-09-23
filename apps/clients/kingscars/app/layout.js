import { Chakra_Petch, Archivo, JetBrains_Mono } from "next/font/google";
import localFont from "next/font/local";
import { Analytics } from "@vercel/analytics/next";
import { getSEOTags, renderSchemaTags } from "@/libs/seo";
import ClientLayout from "@/components/LayoutClient";
import BarraProgreso from "@/components/BarraProgreso";
import FooterFoot from "@/components/FooterFoot";
import BarraDemo from "@/components/demo/BarraDemo";
import AvisoFlotante from "@/components/demo/AvisoFlotante";
import { esDemo } from "@/libs/demo";
import config from "@/config";
import "./globals.css";

// Las letras de "KING CARS" son cuadradas, anchas, DERECHAS y con los vértices
// cortados. Chakra Petch en 600/700 es lo más cerca que se llega con una
// tipografía libre: tiene ese mismo chaflán en las esquinas y el mismo aire de
// rótulo de taller, y es lo que le da a la página el aire de pieza suya en vez
// de aire de plantilla.
//
// SIN ITÁLICA, a propósito: en su logotipo no hay una sola inclinación, y
// tumbar los titulares lo convertiría en cualquier otro concesionario.
const chakra = Chakra_Petch({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  style: ["normal"],
  variable: "--font-chakra",
  display: "swap",
});

// El cuerpo, en una grotesca ancha que aguanta bien el fondo oscuro. Hace de
// contrapeso: si el texto corrido también fuera cuadrado, la página entera se
// leería como una etiqueta de repuesto.
const archivo = Archivo({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-archivo",
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

// Microgramma: la tipografía de la firma de Vektor. No es del tema de
// la página, solo se usa en el crédito de autoría (components/FooterFoot.js) y
// en lo que le habla al dueño de Kings Cars, igual que en el resto del
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
      className={`${chakra.variable} ${archivo.variable} ${jetbrains.variable} ${microgramma.variable}`}
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
        {/* El filtro que recorta el fondo del emblema (components/Logo.js).
            Va aquí, una sola vez, porque un filtro SVG se referencia por id y
            repetirlo en cada instancia del logo sería duplicar el mismo nodo.
            El alfa sale del brillo del píxel: la losa oscura → transparente, y
            el blanco de la corona se queda como está.

            EL UMBRAL ESTÁ CALCULADO PARA ESTE ARCHIVO Y NO ES EL GENÉRICO DEL
            MONOREPO. El fondo de kings-cars.jpg no es negro puro: es una piedra
            gris con vetas claras, que en la suma de canales llega a rondar 1,0.
            Con el umbral de siempre —que corta cerca de 0,2— la losa entera se
            quedaba medio visible y la corona salía dentro de un cuadrado gris.
            Aquí el alfa vale 0,7·(R+G+B) − 0,72: cero hasta una suma de 1,03
            (más clara que cualquier veta) y opaco del todo a partir de 2,46.

            Se hace con filtro y no con `mix-blend-mode: screen` porque el blend
            mezcla con el contexto de apilamiento del padre y se apaga en cuanto
            un ancestro tiene z-index, opacity o backdrop-filter —la puerta de
            acceso, sin ir más lejos—. El filtro funciona igual en cualquier
            sitio. */}
        <svg width="0" height="0" aria-hidden="true" focusable="false" className="absolute">
          <filter id="marca-alfa" colorInterpolationFilters="sRGB">
            <feColorMatrix
              type="matrix"
              values="1 0 0 0 0
                      0 1 0 0 0
                      0 0 1 0 0
                      0.7 0.7 0.7 0 -0.72"
            />
          </filter>
        </svg>

        <BarraDemo />
        <BarraProgreso />
        <ClientLayout>{children}</ClientLayout>
        <FooterFoot />
        {demo && <AvisoFlotante />}
        {/* Web Analytics de Vercel: cuenta las visitas, también las de /entrar,
            que es como se sabe si el prospecto abrió el enlace. Solo funciona
            con Web Analytics activado en el proyecto de Vercel. */}
        <Analytics />
      </body>
    </html>
  );
}
