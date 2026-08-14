import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { flyIn, riseIn } from "../../../../../lib/anim";
import { useStage } from "../../../../../lib/layout";
import { CaosCard, Chip } from "../../../components/CaosCard";
import { BurstRing, FlashCut } from "../../../components/Fx";
import { SceneShell } from "../../../components/SceneShell";
import { Body, Display, Kicker } from "../../../components/Type";
import { colors } from "../../../theme";
import { DUEL, XP } from "../content";

/** Frame en el que las dos mitades chocan en el centro. */
const CLASH = 40;

/**
 * 06 · El duelo.
 *
 * Una sola carta partida en dos: ALFA se lleva la ventaja, OMEGA la carga. Las
 * dos mitades entran desde su esquina y chocan, porque son *la misma situación
 * vista de cada lado* — enseñarlas por separado rompería la idea.
 *
 * En 16:9 van hombro con hombro; en 9:16 se apilan, pero siguen entrando cada
 * una desde su lado para que el choque se lea igual.
 */
export const ElDuelo: React.FC = () => {
  const frame = useCurrentFrame();
  const { u, vertical } = useStage();

  const quake = interpolate(frame, [CLASH, CLASH + 12], [6, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <SceneShell
      quake={quake}
      gap={2.2}
      over={
        <>
          <FlashCut at={CLASH} duration={6} peak={0.6} />
          <BurstRing at={CLASH} color={colors.accent} size={34} thickness={0.5} />
        </>
      }
    >
      <Kicker style={riseIn(frame, { delay: 2, duration: 12 })}>02 · Sale el duelo</Kicker>

      <Display size={vertical ? 7.4 : 8} style={riseIn(frame, { delay: 5, duration: 14 })}>
        Una carta.
        <br />
        Dos mitades.
      </Display>

      <div style={{ ...riseIn(frame, { delay: 12, duration: 12 }), display: "flex", gap: u * 0.8 }}>
        <Chip color={colors.accent} filled>
          Nivel {DUEL.tier} · {DUEL.tierLabel}
        </Chip>
        <Chip color={colors.base300} style={{ color: colors.baseContent }}>
          {DUEL.start}
        </Chip>
      </div>

      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: vertical ? "column" : "row",
          alignItems: "stretch",
          gap: u * 1.6,
          marginTop: u * 1.2,
        }}
      >
        {/* Las dos mitades se estiran a la misma altura: si una se quedara más
            corta que la otra, dejaría de leerse como una sola carta partida. */}
        <div
          style={{
            flex: 1,
            minWidth: 0,
            display: "flex",
            ...flyIn(frame, "left", { delay: 22, duration: 18 }),
          }}
        >
          <CaosCard
            side="alfa"
            label="Alfa · la ventaja"
            name={DUEL.alfa.name}
            rule={DUEL.alfa.rule}
            footer={<Chip color={colors.primary}>+{XP.finish} XP solo si finaliza</Chip>}
            style={{ display: "flex", flexDirection: "column" }}
          />
        </div>

        <div
          style={{
            flex: 1,
            minWidth: 0,
            display: "flex",
            ...flyIn(frame, "right", { delay: 22, duration: 18 }),
          }}
        >
          <CaosCard
            side="omega"
            label="Omega · la carga"
            name={DUEL.omega.name}
            rule={DUEL.omega.rule}
            brutal
            footer={
              <Chip color={colors.accent} filled>
                +{XP.upset[2]} XP si remonta
              </Chip>
            }
            style={{ display: "flex", flexDirection: "column" }}
          />
        </div>
      </div>

      <Body
        size={2.4}
        dim
        style={{ marginTop: u * 1.4, ...riseIn(frame, { delay: CLASH + 14, duration: 16 }) }}
      >
        Quién agarra el lado ALFA se sortea. Estar de primero en el bracket no te regala nada.
      </Body>
    </SceneShell>
  );
};
