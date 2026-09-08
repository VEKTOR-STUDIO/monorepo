import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { breathe, progress, riseIn, slamIn } from "../../../../../lib/anim";
import { useStage } from "../../../../../lib/layout";
import { BurstRing, FlashCut, SpeedLines } from "../../../components/Fx";
import { CaosMark, RollPrepLogo } from "../../../components/Marks";
import { SceneShell } from "../../../components/SceneShell";
import { Body, Display, Kicker, SkewTag } from "../../../components/Type";
import { colors } from "../../../theme";
import { CHAMPION, CTA, EPISODE } from "../content";

const STAMP = 16;

/**
 * 07 · Cierre.
 *
 * El campeón solo, con lo que se llevó. Es el único dato del recap que
 * merece quedarse en pantalla sin nada al lado.
 */
export const Cierre: React.FC = () => {
  const frame = useCurrentFrame();
  const { u, vertical } = useStage();

  const markIn = progress(frame, { delay: 4, duration: 22 });
  const drift = breathe(frame, 200);

  return (
    <SceneShell
      gap={2}
      behind={
        <>
          <SpeedLines opacity={0.09} speed={1.1} />
          <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
            <CaosMark
              size={70}
              style={{
                opacity: markIn * 0.2,
                transform: `rotate(${-12 + drift * 6}deg) translateY(${-drift * 16}px)`,
              }}
            />
          </AbsoluteFill>
        </>
      }
      over={
        <>
          <FlashCut at={STAMP} duration={5} peak={0.45} />
          <BurstRing at={STAMP} color={colors.primary} size={40} thickness={0.45} />
        </>
      }
    >
      <Kicker style={riseIn(frame, { delay: 2, duration: 12 })}>
        Campeón · Episodio {EPISODE.numeral}
      </Kicker>

      <Display
        size={vertical ? 10 : 11}
        color={colors.primary}
        style={{
          ...slamIn(frame, { delay: STAMP - 12, duration: 16 }),
          textShadow: `0 0 ${u * 4.5}px ${colors.primary}55`,
        }}
      >
        {CHAMPION.name}
      </Display>

      <div
        style={{
          ...riseIn(frame, { delay: STAMP + 8, duration: 16 }),
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: u * 1,
        }}
      >
        <SkewTag size={2.2} bg={colors.accent} fg={colors.accentContent}>
          {CHAMPION.pc} PC
        </SkewTag>
        <SkewTag size={2.2} bg={colors.base300} fg={colors.baseContent}>
          {CHAMPION.wins}-{CHAMPION.losses}
        </SkewTag>
        <SkewTag size={2.2} bg={colors.base300} fg={colors.baseContent}>
          {CHAMPION.upsets} {CHAMPION.upsets === 1 ? "remontada" : "remontadas"}
        </SkewTag>
      </div>

      <div style={{ marginTop: u * 2, ...riseIn(frame, { delay: STAMP + 18, duration: 16 }) }}>
        <SkewTag size={2.4}>{CTA.url}</SkewTag>
      </div>

      <div style={{ marginTop: u * 2.2, ...riseIn(frame, { delay: STAMP + 28, duration: 16 }) }}>
        <RollPrepLogo size={5} />
      </div>

      <Body
        size={2.4}
        dim
        style={{ marginTop: u * 0.8, ...riseIn(frame, { delay: STAMP + 38, duration: 16 }) }}
      >
        {CTA.sign}
      </Body>
    </SceneShell>
  );
};
