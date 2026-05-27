import config from "@/config";
import { getSEOTags } from "@/libs/seo";

export const metadata = getSEOTags({
  title: `Agendar Cita — ${config.appName}`,
  canonicalUrlRelative: "/signin",
});

export default function Layout({ children }) {
  return <>{children}</>;
}
