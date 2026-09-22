import { Inter } from "next/font/google";
import localFont from "next/font/local";
import { getSEOTags } from "@/libs/seo";
import ClientLayout from "@/components/LayoutClient";
import FooterFoot from "@/components/FooterFoot";
import config from "@/config";
import "./globals.css";

const font = Inter({ subsets: ["latin"] });

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
	// Will use the primary color of your theme to show a nice theme color in the URL bar of supported browsers
	themeColor: config.colors.main,
	width: "device-width",
	initialScale: 1,
};

// This adds default SEO tags to all pages in our app.
// You can override them in each page passing params to getSOTags() function.
export const metadata = getSEOTags();

export default function RootLayout({ children }) {
	return (
		<html
			lang="es"
			data-theme={config.colors.theme}
			className={`${font.className} ${microgramma.variable}`}
		>
			<body>
				{/* ClientLayout contains all the client wrappers (Crisp chat support, toast messages, tooltips, etc.) */}
				<ClientLayout>{children}</ClientLayout>
				<FooterFoot />
			</body>
		</html>
	);
}
