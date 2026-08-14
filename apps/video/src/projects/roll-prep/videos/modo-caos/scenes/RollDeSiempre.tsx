import React from "react";
import { useCurrentFrame } from "remotion";
import { riseIn } from "../../../../../lib/anim";
import { useStage } from "../../../../../lib/layout";
import { CutPanel, HazardBar } from "../../../components/Fx";
import { SceneShell } from "../../../components/SceneShell";
import { Body, Display, Kicker, Watermark } from "../../../components/Type";
import { colors, fonts } from "../../../theme";

const RULES = ["Mismo arranque", "Mismas reglas", "Mismo reloj"];

/** Una de las dos chapas de peleador. Las dos son idénticas: ese es el chiste. */
const Plate: React.FC<{ name: string; delay: number }> = ({ name, delay }) => {
  const frame = useCurrentFrame();
  const { u } = useStage();

  return (
    <CutPanel
      cut={1.6}
      style={{ flex: 1, minWidth: 0, ...riseIn(frame, { delay, duration: 16 }) }}
    >
      {/* Franja gris: aquí no hay nada en juego. */}
      <HazardBar color={colors.base300} height={0.5} />

      <div style={{ padding: `${u * 1.8}px ${u * 2}px ${u * 2.2}px` }}>
        <div
          style={{
            fontFamily: fonts.display,
            textTransform: "uppercase",
            fontSize: u * 6,
            lineHeight: 1,
            color: colors.baseContent,
            opacity: 0.85,
          }}
        >
          {name}
        </div>

        <div style={{ marginTop: u * 1.4, display: "flex", flexDirection: "column", gap: u * 0.8 }}>
          {RULES.map((rule, i) => (
            <div
              key={rule}
              style={{
                ...riseIn(frame, { delay: delay + 10 + i * 5, duration: 12, travel: 10 }),
                display: "flex",
                alignItems: "center",
                gap: u * 0.7,
                fontFamily: fonts.sans,
                fontWeight: 700,
                fontSize: u * 1.85,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: colors.baseContent,
                opacity: 0.5,
              }}
            >
              <span style={{ color: colors.base300 }}>—</span>
              {rule}
            </div>
          ))}
        </div>
      </div>
    </CutPanel>
  );
};

/**
 * 02 · El punto de partida.
 *
 * Antes de vender el CAOS hay que enseñar qué se siente sin él: dos chapas
 * calcadas, en gris, sin una gota de volt. La escena entera está apagada a
 * propósito — es la única del video que no tiene el color de la casa.
 */
export const RollDeSiempre: React.FC = () => {
  const frame = useCurrentFrame();
  const { u, vertical } = useStage();

  return (
    <SceneShell
      gap={3}
      glow={0.35}
      behind={
        <Watermark size={44} opacity={0.05} rotate={-8} style={{ left: "-6%", top: "34%" }}>
          Igual
        </Watermark>
      }
    >
      <div style={riseIn(frame, { delay: 2, duration: 14 })}>
        <Kicker color={colors.baseContent} style={{ opacity: 0.45 }}>
          Modo clásico
        </Kicker>
      </div>

      <Display size={vertical ? 9.5 : 10} style={riseIn(frame, { delay: 6, duration: 16 })}>
        Siempre
        <br />
        empieza igual
      </Display>

      <div
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          gap: u * 2,
          marginTop: u * 1.5,
        }}
      >
        <Plate name="Tú" delay={16} />

        <div
          style={{
            ...riseIn(frame, { delay: 26, duration: 12 }),
            flexShrink: 0,
            fontFamily: fonts.display,
            fontSize: u * 8,
            lineHeight: 1,
            color: colors.baseContent,
            opacity: 0.34,
          }}
        >
          =
        </div>

        <Plate name="Rival" delay={20} />
      </div>

      <Body size={2.6} dim style={{ marginTop: u * 1.5, ...riseIn(frame, { delay: 44, duration: 16 }) }}>
        El bracket te cambia de rival. La pelea, no.
      </Body>
    </SceneShell>
  );
};
