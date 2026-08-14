import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { breathe, flyIn, progress, riseIn } from "../../../../../lib/anim";
import { useStage } from "../../../../../lib/layout";
import { BurstRing, FlashCut, SpeedLines } from "../../../components/Fx";
import { CaosMark, RollPrepLogo } from "../../../components/Marks";
import { SceneShell } from "../../../components/SceneShell";
import { Body, Display } from "../../../components/Type";
import { colors } from "../../../theme";

/** Frame en el que las dos palabras chocan en el centro. */
const IMPACT = 26;

/**
 * 01 · El golpe de entrada.
 *
 * MODO entra por la izquierda y CAOS por la derecha; cuando se encuentran hay
 * flash, estallido y temblor. Es la misma gramática que la ceremonia de roleo
 * dentro de la app, para que el video y el producto se sientan la misma cosa.
 */
export const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { u } = useStage();

  // El temblor solo dura lo que dura el impacto y se apaga solo.
  const quake = interpolate(frame, [IMPACT, IMPACT + 14], [7, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Las líneas de velocidad arrancan fuertes y se calman tras el choque.
  const lines = interpolate(frame, [0, IMPACT, IMPACT + 25], [0.4, 0.4, 0.07], {
    extrapolateRight: "clamp",
  });

  const markIn = progress(frame, { delay: IMPACT, duration: 26 });
  const drift = breathe(frame, 220);

  return (
    <SceneShell
      quake={quake}
      gap={2.2}
      behind={
        <>
          <SpeedLines opacity={lines} speed={2.4} />
          <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
            <CaosMark
              size={64}
              style={{
                opacity: markIn * 0.14,
                transform: `rotate(${-12 + drift * 6}deg) translateY(${-drift * 14}px)`,
              }}
            />
          </AbsoluteFill>
        </>
      }
      over={
        <>
          <FlashCut at={IMPACT} duration={7} peak={0.9} />
          <BurstRing at={IMPACT} color={colors.primary} size={46} />
          <BurstRing at={IMPACT + 4} color={colors.accent} size={30} thickness={0.5} />
        </>
      }
    >
      <div style={riseIn(frame, { delay: 3, duration: 14 })}>
        <RollPrepLogo size={5.4} />
      </div>

      <div style={{ height: u * 1.5 }} />

      <Display size={11} style={flyIn(frame, "left", { delay: 8, duration: 18 })}>
        Modo
      </Display>

      <Display
        size={25}
        color={colors.primary}
        style={{
          ...flyIn(frame, "right", { delay: 8, duration: 18 }),
          textShadow: `0 0 ${u * 4}px ${colors.primary}55`,
        }}
      >
        Caos
      </Display>

      <div style={{ ...riseIn(frame, { delay: IMPACT + 12, duration: 16 }), marginTop: u * 2 }}>
        <Body size={3.4} weight={700}>
          Ninguna pelea empieza igual.
        </Body>
        <Body size={2.4} dim style={{ marginTop: u * 0.9 }}>
          La modalidad de torneo de RollPrep
        </Body>
      </div>
    </SceneShell>
  );
};
