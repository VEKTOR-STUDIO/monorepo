import { notFound } from "next/navigation";
import FichaProspecto from "@/components/FichaProspecto";
import { claveDeLaDemo, componerMensaje, leerPlantillaMensaje, leerProspecto, videosDe } from "@/libs/prospectos.mjs";
import { esSlug } from "@/libs/rutas.mjs";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const prospecto = esSlug(id) ? leerProspecto(id) : null;
  return { title: prospecto?.nombre || "Prospecto" };
}

export default async function PaginaProspecto({ params }) {
  const { id } = await params;
  if (!esSlug(id)) notFound();
  const prospecto = leerProspecto(id);
  if (!prospecto) notFound();

  const plantilla = leerPlantillaMensaje();
  // Lo que se ve en el disco ahora mismo, por si la ficha se quedó vieja.
  const claveEnDisco = prospecto.carpeta ? claveDeLaDemo(prospecto.carpeta) : { clave: "", origen: "" };

  return (
    <FichaProspecto
      prospecto={prospecto}
      videos={videosDe(id)}
      mensajeCompuesto={componerMensaje(prospecto, plantilla)}
      mensajeDePlantilla={componerMensaje({ ...prospecto, mensaje: "" }, plantilla)}
      claveEnDisco={claveEnDisco}
    />
  );
}
