import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import PantallaAcceso from "@/components/PantallaAcceso";
import { COOKIE_ACCESO, cookieEsValida, destinoSeguro, hayCandado } from "@/libs/acceso";
import { getSEOTags } from "@/libs/seo";

export const dynamic = "force-dynamic";

export const metadata = getSEOTags({
  title: "Acceso · Lone Star All In Autos",
  description: "Página de demostración con acceso restringido.",
  extraTags: { robots: { index: false, follow: false } },
});

export default async function Entrar({ searchParams }) {
  const p = (await searchParams) || {};
  const destino = destinoSeguro(p.destino);

  // Sin candado (o con la cookie ya puesta) esta pantalla no pinta nada:
  // quedarse en ella sería enseñar un formulario que no hace falta.
  if (!hayCandado()) redirect(destino);

  const guardada = (await cookies()).get(COOKIE_ACCESO)?.value;
  if (await cookieEsValida(guardada)) redirect(destino);

  return <PantallaAcceso destino={destino} />;
}
