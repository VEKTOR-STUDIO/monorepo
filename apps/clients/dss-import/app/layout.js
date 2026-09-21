import { Barlow_Condensed, Archivo, JetBrains_Mono } from "next/font/google";
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

// Los titulares de las publicaciones de DSS están en una condensada muy pesada
// e inclinada —"ADQUIERE UN CHEVROLET OPTRA"—. Barlow Condensed en 700/800
// itálica es lo más cerca que se llega con una tipografía libre, y es la que le
// da a la página el aire de pieza suya en vez de aire de plantilla.
const barlow = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  style: ["normal", "italic"],
  variable: "--font-barlow",
  display: "swap",
});

// El cuerpo, en una grotesca ancha que aguanta bien el fondo negro. Hace de
// contrapeso: si el texto corrido también fuera condensado, la página entera
// se leería apretada.
const archivo = Archivo({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-archivo",
  display: "swap",
});

// Las cifras —cuotas, iniciales, años— van en mono para que se alineen en
// columna y se puedan comparar de un vistazo. En un catálogo de crédito eso
// importa más que en uno de venta: lo que la gente compara, fila por fila, es
// cuánto paga cada semana.
const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-jetbrains",
  display: "swap",
});

// Microgramma: la tipografía de la firma de Alessandrovaru. No es del tema de
// la página, solo se usa en el crédito de autoría (components/FooterFoot.js) y
// en lo que le habla al dueño de DSS, igual que en el resto del monorepo.
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
      className={`${barlow.variable} ${archivo.variable} ${jetbrains.variable} ${microgramma.variable}`}
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
        {/* Aquí vivía un filtro SVG (`marca-alfa`) que sacaba el alfa del
            brillo del píxel, para comerse el fondo NEGRO del logotipo de otras
            marcas de este monorepo. Con el sello de DSS no hace falta y además
            haría lo contrario de lo que se busca: su archivo es un disco de oro
            sobre BLANCO, así que ese filtro dejaría las esquinas opacas y
            calaría el monograma, que es lo único oscuro de la pieza.

            Un logotipo redondo se recorta redondo: lo hace la clase `.sello` de
            globals.css con `border-radius` y `object-fit: cover`. Ver el
            comentario largo de components/Logo.js. */}

        <BarraDemo />
        <BarraProgreso />
        <ClientLayout>{children}</ClientLayout>
        <FooterFoot />
        {demo && <AvisoFlotante />}
      </body>
    </html>
  );
}
