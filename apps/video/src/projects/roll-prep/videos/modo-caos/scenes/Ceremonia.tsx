import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { progress, riseIn } from "../../../../../lib/anim";
import { useStage } from "../../../../../lib/layout";
import { Dice } from "../../../components/Dice";
import { BurstRing, FlashCut, SpeedLines } from "../../../components/Fx";
import { SceneShell } from "../../../components/SceneShell";
import { Body, Display, Kicker, SkewTag } from "../../../components/Type";
import { colors } from "../../../theme";

/** Frame en el que el d20 cae. Todo lo demás cuelga de este número. */
const LAND = 96;

/**
 * 04 · La ceremonia.
 *
 * El roleo no es un `Math.random()` que escupe texto: es una secuencia a
 * pantalla completa hecha para proyectarse. Aquí va la primera mitad —el dado
 * en el aire y el impacto—; las cartas salen en las dos escenas siguientes.
 */
export const Ceremonia: React.FC = () => {
  const frame = useCurrentFrame();
  const { u } = useStage();

  // La pantalla tiembla mientras el dado carga y se calma al aterrizar.
  const quake = interpolate(frame, [10, 24, LAND, LAND + 16], [0, 5, 5, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const lines = interpolate(frame, [10, 30, LAND, LAND + 20], [0.05, 0.34, 0.34, 0.08], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const landed = progress(frame, { delay: LAND + 6, duration: 14 });

  return (
    <SceneShell
      quake={quake}
      gap={2.4}
      halftone
      behind={<SpeedLines opacity={lines} speed={3.2} />}
      over={
        <>
          <FlashCut at={LAND} duration={6} peak={0.92} />
          <BurstRing at={LAND} color={colors.primary} size={38} />
          <BurstRing at={LAND + 5} color={colors.secondary} size={22} thickness={0.45} />
        </>
      }
    >
      <Kicker style={riseIn(frame, { delay: 2, duration: 14 })}>La ceremonia</Kicker>

      <Display size={8.6} style={riseIn(frame, { delay: 6, duration: 16 })}>
        Antes de cada pelea
        <br />
        <span style={{ color: colors.primary }}>se rolea</span>
      </Display>

      <div style={{ marginTop: u * 1.5, marginBottom: u * 1 }}>
        <Dice startsAt={12} landsAt={LAND} result={20} size={30} />
      </div>

      <div style={{ opacity: landed, transform: `scale(${0.9 + landed * 0.1})` }}>
        <SkewTag size={2.4}>Lo que salga, se pelea</SkewTag>
      </div>

      <Body size={2.4} dim style={riseIn(frame, { delay: LAND + 16, duration: 16 })}>
        Una sola vez, delante de todos. No hay repetición.
      </Body>
    </SceneShell>
  );
};
