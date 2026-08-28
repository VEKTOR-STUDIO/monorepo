import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { FlashCut } from "../../components/Fx";
import { colors } from "../../theme";
import { Cartelera } from "./scenes/Cartelera";
import { Cierre } from "./scenes/Cierre";
import { Portada } from "./scenes/Portada";
import { Presentacion } from "./scenes/Presentacion";
import { SCENES } from "./timeline";

/**
 * Los competidores del episodio, de punta a punta.
 *
 * Cortes secos y un destello de dos frames entre escena y escena, igual que en
 * el Modo CAOS: los dos videos son la misma serie y tienen que sentirse
 * montados por la misma mano.
 */
export const Competidores: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: colors.base100 }}>
      {SCENES.map((scene) => (
        <Sequence
          key={scene.id}
          name={scene.title}
          from={scene.from}
          durationInFrames={scene.frames}
        >
          {scene.kind === "portada" ? <Portada /> : null}
          {scene.kind === "peleador" ? <Presentacion index={scene.index} /> : null}
          {scene.kind === "cartelera" ? <Cartelera /> : null}
          {scene.kind === "cierre" ? <Cierre /> : null}
        </Sequence>
      ))}

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
