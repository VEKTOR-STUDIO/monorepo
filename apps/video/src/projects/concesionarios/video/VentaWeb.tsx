import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { Barrido } from "../components/Fondo";
import { MarcaProvider } from "../components/Tipos";
import { MARCAS } from "../marcas";
import { Cierre } from "./escenas/Cierre";
import { Diferencial } from "./escenas/Diferencial";
import { Portada } from "./escenas/Portada";
import { Problema } from "./escenas/Problema";
import { Web } from "./escenas/Web";
import { SCENES, type SceneId } from "./timeline";

const SCENE_COMPONENTS: Record<SceneId, React.FC> = {
  portada: Portada,
  problema: Problema,
  web: Web,
  diferencial: Diferencial,
  cierre: Cierre,
};

export type VentaWebProps = { marcaId: string };

/**
 * El video de venta de 20 s, para cualquiera de las trece marcas. El montaje es
 * uno solo; lo que cambia —colores, letra, logo, inventario y copy— viene de
 * `marcas.ts` e `inventario.ts` a través de `MarcaProvider`.
 *
 * Entre escena y escena, la banda del primario de la marca barre la pantalla:
 * es el corte de la casa, en el color de cada cliente.
 */
export const VentaWeb: React.FC<VentaWebProps> = ({ marcaId }) => {
  const marca = MARCAS.find((m) => m.id === marcaId);
  if (!marca) throw new Error(`Marca desconocida: ${marcaId}`);

  return (
    <MarcaProvider marca={marca}>
      {/* Remotion no trae reset: sin esto los paddings suman al alto. */}
      <style>{"*{box-sizing:border-box}"}</style>
      <AbsoluteFill style={{ backgroundColor: marca.colores.fondo }}>
        {SCENES.map((scene) => {
          const Scene = SCENE_COMPONENTS[scene.id];
          return (
            <Sequence key={scene.id} name={scene.title} from={scene.from} durationInFrames={scene.frames}>
              <Scene />
            </Sequence>
          );
        })}

        {SCENES.slice(1).map((scene) => (
          <Barrido key={`cut-${scene.id}`} at={scene.from} />
        ))}
      </AbsoluteFill>
    </MarcaProvider>
  );
};
