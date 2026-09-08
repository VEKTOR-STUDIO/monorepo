import React from "react";
import { useCurrentFrame } from "remotion";
import { flyIn, riseIn } from "../../../../../lib/anim";
import { HazardBar, SpeedLines } from "../../../components/Fx";
import { RankingRow } from "../../../components/RankingRow";
import { useStage } from "../../../../../lib/layout";
import { SceneShell } from "../../../components/SceneShell";
import { Body, Display, Kicker, SkewTag } from "../../../components/Type";
import { colors } from "../../../theme";
import { RANKING } from "../content";

/** Cada fila entra cinco frames después de la anterior. */
const STAGGER = 5;

/**
 * 06 · El tablero.
 *
 * El ranking CAOS como quedó: PC, récord y remontadas, con el mismo orden y
 * la misma jerarquía visual que `app/dashboard/ranking/caos`. Las filas entran
 * de arriba abajo —de campeón a último— porque así se lee un podio.
 *
 * Los PC no son XP: miden récord de peleas, no compromiso con el gym. Por eso
 * el pie lo aclara en vez de dejar que se confundan.
 */
export const Ranking: React.FC = () => {
  const frame = useCurrentFrame();
  const { u, vertical } = useStage();

  return (
    <SceneShell gap={2} padding={6} behind={<SpeedLines opacity={0.07} speed={1} />}>
      <Kicker style={riseIn(frame, { delay: 2, duration: 12 })}>Récord del CAOS</Kicker>

      <Display size={vertical ? 8.6 : 9} style={riseIn(frame, { delay: 5, duration: 14 })}>
        El tablero
      </Display>

      <div style={riseIn(frame, { delay: 9, duration: 12 })}>
        <SkewTag size={2} bg={colors.accent} fg={colors.accentContent}>
          Puntos de CAOS
        </SkewTag>
      </div>

      <HazardBar
        color={colors.accent}
        height={0.5}
        style={{ ...riseIn(frame, { delay: 12, duration: 10 }), marginTop: u * 0.4 }}
      />

      <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: u * 1.1 }}>
        {RANKING.map((row, index) => (
          <RankingRow
            key={row.name}
            position={index + 1}
            name={row.name}
            academy={row.academy}
            wins={row.wins}
            losses={row.losses}
            submissions={row.submissions}
            upsets={row.upsets}
            titles={row.titles}
            pc={row.pc}
            size={vertical ? 4.2 : 3.7}
            style={flyIn(frame, index % 2 === 0 ? "left" : "right", {
              delay: 16 + index * STAGGER,
              duration: 16,
            })}
          />
        ))}
      </div>

      <Body
        size={2.2}
        dim
        style={{
          marginTop: u * 0.6,
          ...riseIn(frame, { delay: 16 + RANKING.length * STAGGER + 10, duration: 16 }),
        }}
      >
        Los PC se ganan peleando el modo, no estudiando. El cinturón va por otro lado.
      </Body>
    </SceneShell>
  );
};
