import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { FlashCut } from "../../components/Fx";
import { colors } from "../../theme";
import { Ceremonia } from "./scenes/Ceremonia";
import { Cierre } from "./scenes/Cierre";
import { ElDuelo } from "./scenes/ElDuelo";
import { ElMazo } from "./scenes/ElMazo";
import { ElTerreno } from "./scenes/ElTerreno";
import { Hook } from "./scenes/Hook";
import { LaIdea } from "./scenes/LaIdea";
import { Niveles } from "./scenes/Niveles";
import { ReglaDeOro } from "./scenes/ReglaDeOro";
import { RollDeSiempre } from "./scenes/RollDeSiempre";
import { SCENES, type SceneId } from "./timeline";

const SCENE_COMPONENTS: Record<SceneId, React.FC> = {
  hook: Hook,
  roll: RollDeSiempre,
  idea: LaIdea,
  dado: Ceremonia,
  terreno: ElTerreno,
  duelo: ElDuelo,
  tiers: Niveles,
  balance: ReglaDeOro,
  mazo: ElMazo,
  cierre: Cierre,
};

/**
 * El video del Modo CAOS, de punta a punta.
 *
 * Los cortes son secos, sin fundidos: un fighting game no hace crossfade. Lo
 * único que hay entre escena y escena es un destello de dos frames, que es lo
 * que hace que el corte se sienta intencional en vez de un salto de edición.
 */
export const ModoCaos: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: colors.base100 }}>
      {SCENES.map((scene) => {
        const Scene = SCENE_COMPONENTS[scene.id];
        return (
          <Sequence
            key={scene.id}
            name={scene.title}
            from={scene.from}
            durationInFrames={scene.frames}
          >
            <Scene />
          </Sequence>
        );
      })}

      {/* Los destellos van fuera de las escenas para que crucen el corte. */}
      {SCENES.slice(1).map((scene) => (
        <FlashCut
          key={`cut-${scene.id}`}
          at={scene.from - 1}
          duration={4}
          peak={0.14}
          color={colors.secondary}
        />
      ))}
    </AbsoluteFill>
  );
};
