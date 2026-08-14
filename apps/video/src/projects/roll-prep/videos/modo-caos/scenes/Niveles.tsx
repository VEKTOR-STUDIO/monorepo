import React from "react";
import { useCurrentFrame } from "remotion";
import { breathe, countTo, progress, riseIn } from "../../../../../lib/anim";
import { useStage } from "../../../../../lib/layout";
import { Chip } from "../../../components/CaosCard";
import { XpBar } from "../../../components/Fx";
import { SceneShell } from "../../../components/SceneShell";
import { Body, Display, Kicker, Watermark } from "../../../components/Type";
import { colors, fonts } from "../../../theme";
import { TIERS } from "../content";

/**
 * Escala de las barras. El tope va por encima del valor más alto a propósito:
 * si la barra del 35% llegara al final del carril, parecería un máximo absoluto
 * en vez de la más frecuente de cuatro.
 */
const BAR_SCALE = Math.max(...TIERS.map((t) => t.odds)) * 1.15;

const Row: React.FC<{
  tier: number;
  label: string;
  odds: number;
  note: string;
  delay: number;
}> = ({ tier, label, odds, note, delay }) => {
  const frame = useCurrentFrame();
  const { u } = useStage();

  const brutal = tier === 3;
  const color = brutal ? colors.accent : colors.primary;
  const fill = progress(frame, { delay, duration: 26 }) * (odds / BAR_SCALE);
  const shown = countTo(frame, odds, { delay, duration: 26 });
  // El tier 3 respira, como su carta.
  const pulse = brutal ? breathe(frame, 42) : 0;

  return (
    <div
      style={{
        ...riseIn(frame, { delay: delay - 6, duration: 14, travel: 16 }),
        width: "100%",
        display: "flex",
        alignItems: "center",
        gap: u * 1.6,
      }}
    >
      <div
        style={{
          width: u * 5,
          flexShrink: 0,
          fontFamily: fonts.display,
          fontSize: u * 5.4,
          lineHeight: 1,
          textAlign: "right",
          color,
          opacity: brutal ? 0.75 + pulse * 0.25 : 0.55,
        }}
      >
        {tier}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
            gap: u * 1,
          }}
        >
          <span
            style={{
              fontFamily: fonts.sans,
              fontWeight: 800,
              fontSize: u * 2.4,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: brutal ? colors.accent : colors.baseContent,
            }}
          >
            {label}
          </span>
          <span
            style={{
              fontFamily: fonts.display,
              fontSize: u * 3.4,
              lineHeight: 1,
              color: brutal ? colors.accent : colors.baseContent,
            }}
          >
            {shown}%
          </span>
        </div>

        <XpBar fill={fill} color={color} height={1.15} shineFrom={delay} style={{ marginTop: u * 0.7 }} />

        <div
          style={{
            marginTop: u * 0.6,
            fontFamily: fonts.sans,
            fontSize: u * 1.75,
            color: colors.baseContent,
            opacity: 0.5,
          }}
        >
          {note}
        </div>
      </div>
    </div>
  );
};

/**
 * 07 · Cuántas veces sale cada cosa.
 *
 * La honestidad del modo está en esta tabla: la mayoría de las peleas salen
 * suaves. El tier 3 es raro justo para que, cuando salga, todo el mundo saque
 * el teléfono.
 */
export const Niveles: React.FC = () => {
  const frame = useCurrentFrame();
  const { u } = useStage();

  const brutalTag = progress(frame, { delay: 118, duration: 14 });

  return (
    <SceneShell
      gap={2.4}
      behind={
        <Watermark size={30} opacity={0.035} rotate={-90} style={{ left: "-22%", top: "34%" }}>
          Locura
        </Watermark>
      }
    >
      <Kicker style={riseIn(frame, { delay: 2, duration: 12 })}>Niveles de locura</Kicker>

      <Display size={7.6} style={riseIn(frame, { delay: 5, duration: 14 })}>
        Cuántas veces
        <br />
        sale cada una
      </Display>

      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: u * 2,
          marginTop: u * 1.4,
        }}
      >
        {TIERS.map((tier, i) => (
          <Row
            key={tier.tier}
            tier={tier.tier}
            label={tier.label}
            odds={tier.odds}
            note={tier.note}
            delay={20 + i * 14}
          />
        ))}
      </div>

      <div style={{ marginTop: u * 1.4, opacity: brutalTag, transform: `scale(${0.92 + brutalTag * 0.08})` }}>
        <Chip color={colors.accent} filled size={2.2}>
          Cuanto más brutal, más paga remontarlo
        </Chip>
      </div>

      <Body size={2.2} dim style={riseIn(frame, { delay: 132, duration: 14 })}>
        Uno de cada cuatro duelos es neutro: los dos arrancan igual.
      </Body>
    </SceneShell>
  );
};
