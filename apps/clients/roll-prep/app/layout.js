import { Anton, Barlow } from "next/font/google";
import localFont from "next/font/local";
import { Analytics } from "@vercel/analytics/next";
import { getSEOTags } from "@/libs/seo";
import ClientLayout from "@/components/LayoutClient";
import FooterFoot from "@/components/rollprep/FooterFoot";
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

const microgramma = localFont({
	src: "../public/fonts/microgramma.otf",
	variable: "--microgramma-font",
	display: "swap",
	weight: "400",
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
			className={`${anton.variable} ${barlow.variable} ${microgramma.variable}`}
		>
			<body className="glow grain font-sans antialiased">
				{/* ClientLayout contains all the client wrappers (Crisp chat support, toast messages, tooltips, etc.) */}
				<ClientLayout>{children}</ClientLayout>
				<FooterFoot />
				<Analytics />
			</body>
		</html>
	);
}
