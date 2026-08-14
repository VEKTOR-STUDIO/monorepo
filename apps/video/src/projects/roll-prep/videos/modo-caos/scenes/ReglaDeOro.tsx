import React from "react";
import { useCurrentFrame } from "remotion";
import { countTo, riseIn, slamIn } from "../../../../../lib/anim";
import { useStage } from "../../../../../lib/layout";
import { CutPanel, HazardBar } from "../../../components/Fx";
import { SceneShell } from "../../../components/SceneShell";
import { Body, Display, Kicker } from "../../../components/Type";
import { colors, fonts } from "../../../theme";
import { XP } from "../content";

const Column: React.FC<{
  color: string;
  label: string;
  title: string;
  amount: React.ReactNode;
  note: string;
  delay: number;
}> = ({ color, label, title, amount, note, delay }) => {
  const frame = useCurrentFrame();
  const { u } = useStage();

  return (
    <CutPanel
      cut={1.8}
      border={color}
      borderWidth={0.26}
      style={{
        flex: 1,
        minWidth: 0,
        ...riseIn(frame, { delay, duration: 16 }),
        boxShadow: `0 0 ${u * 3}px ${-u * 1.4}px ${color}`,
      }}
    >
      <HazardBar color={color} height={0.5} />

      <div style={{ padding: `${u * 1.9}px ${u * 2.2}px ${u * 2.4}px`, textAlign: "left" }}>
        <div
          style={{
            fontFamily: fonts.sans,
            fontWeight: 800,
            fontSize: u * 1.8,
            letterSpacing: "0.26em",
            textTransform: "uppercase",
            color,
          }}
        >
          {label}
        </div>

        <div
          style={{
            marginTop: u * 0.7,
            fontFamily: fonts.sans,
            fontWeight: 700,
            fontSize: u * 2.2,
            color: colors.baseContent,
            opacity: 0.66,
          }}
        >
          {title}
        </div>

        <div
          style={{
            marginTop: u * 1.4,
            fontFamily: fonts.display,
            fontSize: u * 6.2,
            lineHeight: 1,
            color,
            whiteSpace: "nowrap",
          }}
        >
          {amount}
        </div>

        <div
          style={{
            marginTop: u * 1.2,
            fontFamily: fonts.sans,
            fontSize: u * 2,
            lineHeight: 1.28,
            color: colors.baseContent,
            opacity: 0.6,
          }}
        >
          {note}
        </div>
      </div>
    </CutPanel>
  );
};

/**
 * 08 · La regla de oro.
 *
 * El pilar que sostiene todo el modo: la asimetría no se ablanda, se paga. Si
 * el video solo enseñara las cartas, el CAOS parecería una lotería; esta escena
 * es la que lo convierte en un juego con balance.
 */
export const ReglaDeOro: React.FC = () => {
  const frame = useCurrentFrame();
  const { u, vertical } = useStage();

  // Los tres premios del OMEGA suben uno detrás de otro, como un marcador.
  const upset = XP.upset.map((value, i) => countTo(frame, value, { delay: 52 + i * 8, duration: 22 }));

  return (
    <SceneShell gap={2.4}>
      <Kicker style={riseIn(frame, { delay: 2, duration: 12 })}>La regla de oro</Kicker>

      <Display size={vertical ? 8.2 : 9} style={riseIn(frame, { delay: 5, duration: 14 })}>
        La desventaja
        <br />
        no se corrige
      </Display>

      <Display
        size={vertical ? 12 : 13}
        color={colors.primary}
        style={{ ...slamIn(frame, { delay: 22, duration: 16 }), textShadow: `0 0 ${u * 3}px ${colors.primary}44` }}
      >
        Se paga
      </Display>

      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: vertical ? "column" : "row",
          gap: u * 1.6,
          marginTop: u * 1.6,
        }}
      >
        <Column
          color={colors.accent}
          label="Omega"
          title="El que carga la desventaja"
          amount={
            <>
              +{upset[0]} / +{upset[1]} / +{upset[2]}{" "}
              <span style={{ fontSize: u * 3.4 }}>XP</span>
            </>
          }
          note="Diez XP por cada punto de diferencia de peso, si se lleva la pelea. Cuanto peor le tocó, más paga remontarla."
          delay={40}
        />

        <Column
          color={colors.primary}
          label="Alfa"
          title="El que agarró la ventaja"
          amount={
            <>
              +{XP.finish} <span style={{ fontSize: u * 3.4 }}>XP</span>
            </>
          }
          note="Solo si finaliza. Guindarse de la ventaja y estancar la pelea no paga nada."
          delay={48}
        />
      </div>

      <Body
        size={2.4}
        weight={700}
        style={{ marginTop: u * 1.6, ...riseIn(frame, { delay: 108, duration: 16 }) }}
      >
        Los dos tienen algo que buscar.
      </Body>
      <Body size={2.2} dim style={riseIn(frame, { delay: 118, duration: 16 })}>
        Eso es lo que hace que el CAOS sea un juego y no una lotería.
      </Body>
    </SceneShell>
  );
};
