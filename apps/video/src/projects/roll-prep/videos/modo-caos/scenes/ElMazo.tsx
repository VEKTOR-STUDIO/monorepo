import React from "react";
import { useCurrentFrame } from "remotion";
import { countTo, riseIn, slamIn } from "../../../../../lib/anim";
import { useStage } from "../../../../../lib/layout";
import { SceneShell } from "../../../components/SceneShell";
import { Body, Display, Kicker, Watermark } from "../../../components/Type";
import { colors, fonts } from "../../../theme";
import { DECK } from "../content";

const Stat: React.FC<{ value: number; label: string; delay: number }> = ({
  value,
  label,
  delay,
}) => {
  const frame = useCurrentFrame();
  const { u } = useStage();

  return (
    <div style={{ textAlign: "center", ...riseIn(frame, { delay, duration: 14 }) }}>
      <div
        style={{
          fontFamily: fonts.display,
          fontSize: u * 9,
          lineHeight: 1,
          color: colors.baseContent,
        }}
      >
        {countTo(frame, value, { delay, duration: 22 })}
      </div>
      <div
        style={{
          marginTop: u * 0.6,
          fontFamily: fonts.sans,
          fontWeight: 800,
          fontSize: u * 1.9,
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: colors.baseContent,
          opacity: 0.55,
        }}
      >
        {label}
      </div>
    </div>
  );
};

/**
 * 09 · El tamaño del mazo.
 *
 * Los números son el argumento de rejugabilidad: con 312 combinaciones en no-gi
 * —y otro mazo distinto para gi— nadie va a ver dos veces la misma pelea en una
 * temporada de clases.
 */
export const ElMazo: React.FC = () => {
  const frame = useCurrentFrame();
  const { u } = useStage();

  return (
    <SceneShell
      gap={2.2}
      behind={
        <Watermark size={52} opacity={0.06} rotate={-10} style={{ left: "-4%", top: "26%" }}>
          Caos
        </Watermark>
      }
    >
      <Kicker style={riseIn(frame, { delay: 2, duration: 12 })}>El mazo {DECK.outfit}</Kicker>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: u * 3,
          marginTop: u * 1,
        }}
      >
        <Stat value={DECK.terrains} label="Terrenos" delay={8} />
        <div
          style={{
            fontFamily: fonts.display,
            fontSize: u * 6,
            lineHeight: 1,
            color: colors.primary,
            ...riseIn(frame, { delay: 14, duration: 12 }),
          }}
        >
          ×
        </div>
        <Stat value={DECK.duels} label="Duelos" delay={18} />
      </div>

      <Display
        size={22}
        color={colors.primary}
        style={{
          ...slamIn(frame, { delay: 42, duration: 18 }),
          textShadow: `0 0 ${u * 4}px ${colors.primary}44`,
          marginTop: u * 1,
        }}
      >
        {countTo(frame, DECK.combos, { delay: 46, duration: 28 })}
      </Display>

      <Kicker
        size={2.4}
        color={colors.baseContent}
        style={riseIn(frame, { delay: 66, duration: 14 })}
      >
        Combinaciones
      </Kicker>

      <Body size={2.4} dim style={{ marginTop: u * 1.6, ...riseIn(frame, { delay: 84, duration: 16 }) }}>
        Y el mazo de Gi es otro distinto.
        <br />
        Ninguna noche se repite.
      </Body>
    </SceneShell>
  );
};
