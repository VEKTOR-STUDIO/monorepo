import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { FlashCut } from "../../components/Fx";
import { colors } from "../../theme";
import { Cierre } from "./scenes/Cierre";
import { Combate } from "./scenes/Combate";
import { Portada } from "./scenes/Portada";
import { Ranking } from "./scenes/Ranking";
import { SCENES } from "./timeline";

/**
 * El recap del episodio 01, de punta a punta.
 *
 * Cortes secos y destello de dos frames entre escena y escena, como en el
 * resto de la serie.
 */
export const Recap: React.FC = () => {
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
          {scene.kind === "combate" ? <Combate index={scene.index} /> : null}
          {scene.kind === "ranking" ? <Ranking /> : null}
          {scene.kind === "cierre" ? <Cierre /> : null}
        </Sequence>
      ))}

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
