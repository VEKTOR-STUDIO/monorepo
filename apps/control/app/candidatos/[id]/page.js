import fs from "node:fs";
import path from "node:path";
import { notFound } from "next/navigation";
import FichaCandidato from "@/components/FichaCandidato";
import { leerCandidato, listarMaterial } from "@/libs/almacen.mjs";
import { claveDemo, leerPendientes, nombrePaquete } from "@/libs/clientes.mjs";
import { listarPlantillas } from "@/libs/plantillas.mjs";
import { configuracion, puertoDePrueba, rutinaEnMarcha } from "@/libs/rutina.mjs";
import { carpetaClientes, esSlug } from "@/libs/rutas.mjs";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const candidato = esSlug(id) ? leerCandidato(id) : null;
  return { title: candidato?.nombre || "Candidato" };
}

export default async function PaginaCandidato({ params }) {
  const { id } = await params;
  if (!esSlug(id)) notFound();

  rutinaEnMarcha();
  const candidato = leerCandidato(id);
  if (!candidato) notFound();

  // La carpeta se pudo borrar o renombrar a mano desde que se copió.
  const carpetaViva = Boolean(
    candidato.carpeta && fs.existsSync(path.join(carpetaClientes(), candidato.carpeta))
  );

  return (
    <FichaCandidato
      candidato={candidato}
      material={listarMaterial(id)}
      plantillas={candidato.carpeta ? [] : listarPlantillas()}
      cliente={
        carpetaViva
          ? {
              paquete: nombrePaquete(candidato.carpeta),
              clave: claveDemo(candidato.carpeta),
              pendientes: leerPendientes(candidato.carpeta),
              puerto: puertoDePrueba(id),
            }
          : null
      }
      carpetaPerdida={Boolean(candidato.carpeta) && !carpetaViva}
      modo={configuracion().modo}
    />
  );
}
