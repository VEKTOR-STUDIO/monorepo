import React from "react";
import { useCurrentFrame } from "remotion";
import { riseIn, slamIn } from "../../../../../lib/anim";
import { useStage } from "../../../../../lib/layout";
import { CaosCard, Chip } from "../../../components/CaosCard";
import { FlashCut } from "../../../components/Fx";
import { SceneShell } from "../../../components/SceneShell";
import { Body, Kicker, Watermark } from "../../../components/Type";
import { colors } from "../../../theme";
import { TERRAIN, TERRAIN_REEL } from "../content";

/** Frame en el que la ruleta de nombres se detiene en el terreno bueno. */
const LOCK = 46;
/** Cada cuántos frames cambia el nombre mientras la ruleta gira. */
const REEL_STEP = 3;

/**
 * 05 · El terreno.
 *
 * La carta cae desde arriba con el nombre todavía girando: se ve pasar medio
 * mazo antes de que clave en uno. Es lo que convierte un resultado aleatorio en
 * un momento — sin la ruleta, "Suelo de Lava" sería solo un texto que apareció.
 */
export const ElTerreno: React.FC = () => {
  const frame = useCurrentFrame();
  const { u } = useStage();

  const spinning = frame < LOCK;
  const name = spinning
    ? TERRAIN_REEL[Math.floor(frame / REEL_STEP) % TERRAIN_REEL.length]!
    : TERRAIN.name;

  // Mientras gira, la regla todavía no se sabe.
  const rule = spinning ? "…" : TERRAIN.rule;

  return (
    <SceneShell
      gap={2.4}
      over={<FlashCut at={LOCK} duration={5} peak={0.55} color={colors.secondary} />}
      behind={
        <Watermark size={26} opacity={0.055} rotate={-10} style={{ left: "-8%", top: "16%" }}>
          Arena
        </Watermark>
      }
    >
      <Kicker style={riseIn(frame, { delay: 2, duration: 12 })}>
        01 · Sale el terreno
      </Kicker>

      <div style={{ width: "100%", ...slamIn(frame, { delay: 6, duration: 18 }) }}>
        <CaosCard
          side="neutro"
          label="Terreno"
          name={name}
          rule={rule}
          footer={
            <div style={{ display: "flex", flexWrap: "wrap", gap: u * 0.8 }}>
              <Chip color={colors.secondary}>Aplica igual a los dos</Chip>
              <Chip color={colors.secondary}>Nunca toca el arranque</Chip>
            </div>
          }
        />
      </div>

      <Body
        size={2.4}
        dim
        style={{ marginTop: u * 1.2, ...riseIn(frame, { delay: LOCK + 10, duration: 16 }) }}
      >
        Cambia el tiempo, el área, qué vale punto o qué termina la pelea.
        <br />
        Nunca la posición de arranque.
      </Body>
    </SceneShell>
  );
};
