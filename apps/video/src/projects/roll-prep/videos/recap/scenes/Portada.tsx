import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { breathe, flyIn, progress, riseIn } from "../../../../../lib/anim";
import { useStage } from "../../../../../lib/layout";
import { BurstRing, FlashCut, SpeedLines } from "../../../components/Fx";
import { CaosMark, RollPrepLogo } from "../../../components/Marks";
import { SceneShell } from "../../../components/SceneShell";
import { Body, Display, Kicker, SkewTag } from "../../../components/Type";
import { colors } from "../../../theme";
import { EPISODE, MATCHES, RANKING } from "../content";

const IMPACT = 24;

/**
 * 01 · La portada.
 *
 * Mismo golpe de entrada que los otros videos de la serie, con el número del
 * episodio de protagonista. Debajo, las tres cifras que resumen el torneo
 * antes de contarlo: cuántos pelearon, cuántas peleas hubo y en qué formato.
 */
export const Portada: React.FC = () => {
  const frame = useCurrentFrame();
  const { u } = useStage();

  const quake = interpolate(frame, [IMPACT, IMPACT + 14], [7, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const lines = interpolate(frame, [0, IMPACT, IMPACT + 25], [0.38, 0.38, 0.08], {
    extrapolateRight: "clamp",
  });

  const markIn = progress(frame, { delay: IMPACT, duration: 26 });
  const drift = breathe(frame, 220);

  return (
    <SceneShell
      quake={quake}
      gap={2}
      behind={
        <>
          <SpeedLines opacity={lines} speed={2.2} />
          <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
            <CaosMark
              size={62}
              style={{
                opacity: markIn * 0.13,
                transform: `rotate(${-12 + drift * 6}deg) translateY(${-drift * 14}px)`,
              }}
            />
          </AbsoluteFill>
        </>
      }
      over={
        <>
          <FlashCut at={IMPACT} duration={7} peak={0.88} />
          <BurstRing at={IMPACT} color={colors.primary} size={46} />
          <BurstRing at={IMPACT + 4} color={colors.accent} size={30} thickness={0.5} />
        </>
      }
    >
      <div style={riseIn(frame, { delay: 2, duration: 14 })}>
        <RollPrepLogo size={5.2} />
      </div>

      <Kicker style={{ ...riseIn(frame, { delay: 6, duration: 12 }), marginTop: u * 0.6 }}>
        Torneo CAOS · {EPISODE.outfit}
      </Kicker>

      <Display size={7.6} style={flyIn(frame, "left", { delay: 8, duration: 18 })}>
        Así fue el
        <br />
        episodio
      </Display>

      <Display
        size={26}
        color={colors.primary}
        style={{
          ...flyIn(frame, "right", { delay: 8, duration: 18 }),
          textShadow: `0 0 ${u * 4}px ${colors.primary}55`,
        }}
      >
        {EPISODE.numeral}
      </Display>

      <div
        style={{
          ...riseIn(frame, { delay: IMPACT + 10, duration: 16 }),
          marginTop: u * 1.6,
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: u * 1,
        }}
      >
        <SkewTag size={2.2}>{RANKING.length} peleadores</SkewTag>
        <SkewTag size={2.2} bg={colors.accent} fg={colors.accentContent}>
          {MATCHES.length} peleas
        </SkewTag>
        <SkewTag size={2.2} bg={colors.base300} fg={colors.baseContent}>
          {EPISODE.academy}
        </SkewTag>
      </div>

      <div style={{ ...riseIn(frame, { delay: IMPACT + 20, duration: 16 }), marginTop: u * 1.2 }}>
        <Body size={2.5} dim>
          Las cartas que salieron y cómo terminó cada una.
        </Body>
      </div>
    </SceneShell>
  );
};
