import config from "@/config";
import { getSEOTags } from "@/libs/seo";

export const metadata = getSEOTags({
  title: "Iniciar sesión — VitalForm Fit · Totuma Mealpreps",
  description: "Accedé a tu área personal para gestionar consultas nutricionales y pedidos de totumas.",
  canonicalUrlRelative: "/signin",
});

export default function Layout({ children }) {
  return <>{children}</>;
}
