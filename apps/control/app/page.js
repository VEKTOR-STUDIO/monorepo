import Tablero from "@/components/Tablero";
import { listarCandidatos, listarMaterial } from "@/libs/almacen.mjs";
import { rutinaEnMarcha } from "@/libs/rutina.mjs";

export const dynamic = "force-dynamic";

export default function PaginaTablero() {
  // Antes de pintar, recoge una rutina que se hubiera cortado sin avisar: si
  // no, su tarjeta seguiría «corriendo» hasta que alguien la abriera.
  rutinaEnMarcha();

  const candidatos = listarCandidatos().map((c) => ({
    id: c.id,
    nombre: c.nombre,
    instagram: c.instagram,
    ciudad: c.ciudad,
    rubro: c.rubro,
    etapa: c.etapa,
    carpeta: c.carpeta,
    enlace: c.enlace,
    actualizado: c.actualizado,
    rutina: { estado: c.rutina.estado, inicio: c.rutina.inicio, error: c.rutina.error },
    material: listarMaterial(c.id).length,
  }));

  return <Tablero candidatos={candidatos} />;
}
