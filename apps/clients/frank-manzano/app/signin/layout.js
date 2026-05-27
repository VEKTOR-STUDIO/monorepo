import config from "@/config";
import { getSEOTags } from "@/libs/seo";

export const metadata = getSEOTags({
  title: `Iniciar sesión | ${config.appName}`,
  description: config.appDescription,
  canonicalUrlRelative: "/signin",
});

export default function Layout({ children }) {
  return <>{children}</>;
}
