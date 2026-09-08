import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { flyIn, riseIn, slamIn } from "../../../../../lib/anim";
import { useStage } from "../../../../../lib/layout";
import { CaosCard, Chip } from "../../../components/CaosCard";
import { BurstRing, FlashCut } from "../../../components/Fx";
import { SceneShell } from "../../../components/SceneShell";
import { Body, Kicker, SkewTag, Watermark } from "../../../components/Type";
import { colors, sideColor } from "../../../theme";
import { FINISH_XP, MATCHES, type Corner } from "../content";

/** Frame en el que se canta el resultado. */
const WIN = 108;

/** Las etiquetas de lado, tal como las nombra el modo. */
const SIDE_LABEL: Record<Corner["side"], string> = {
  alfa: "Alfa · la ventaja",
  omega: "Omega · la carga",
  neutro: "Duelo parejo",
};

/**
 * El nombre del peleador se achica cuando tiene con qué. Es el mismo criterio
 * del helper `nameSize()` de la story de lineup en la app: en 16:9 las dos
 * cartas van hombro con hombro y un nombre de tres palabras se desbordaría.
 */
const fighterSize = (name: string): number => {
  if (name.length > 18) return 5.2;
  if (name.length > 14) return 5.9;
  return 6.4;
};

/**
 * 02–05 · Una pelea por escena.
 *
 * El orden es el de la mesa el día del torneo: primero el terreno —que aplica
 * a los dos y nunca toca el arranque—, después la carta partida en sus dos
 * mitades, y solo al final el resultado. Contar el resultado antes que las
 * cartas sería contar el partido por el marcador.
 *
 * Cuando se canta el ganador, la carta que perdió se apaga en vez de
 * desaparecer: el recap tiene que dejar leer de qué lado le tocó a cada uno.
 */
export const Combate: React.FC<{ index: number }> = ({ index }) => {
  const frame = useCurrentFrame();
  const { u, vertical } = useStage();

  const match = MATCHES[index];
  const upset = match.bounty?.fighter === match.winner;

  const quake = interpolate(frame, [WIN, WIN + 12], [6, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // La derrota se apaga, no se borra.
  const dim = interpolate(frame, [WIN, WIN + 12], [1, 0.32], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <SceneShell
      quake={quake}
      gap={1.8}
      padding={6}
      behind={
        <Watermark size={24} opacity={0.05} rotate={-10} style={{ left: "-6%", top: "10%" }}>
          {match.stage}
        </Watermark>
      }
      over={
        <>
          <FlashCut at={WIN} duration={6} peak={0.55} />
          <BurstRing at={WIN} color={colors.primary} size={38} thickness={0.45} />
        </>
      }
    >
      <Kicker style={riseIn(frame, { delay: 2, duration: 12 })}>
        {match.stage} · Nivel {match.tier} · {match.tierLabel}
      </Kicker>

      <div style={{ width: "100%", ...slamIn(frame, { delay: 5, duration: 16 }) }}>
        <CaosCard
          side="neutro"
          label="Terreno · aplica a los dos"
          name={match.terrain.name}
          rule={match.terrain.rule}
          nameSize={5.4}
        />
      </div>

      <div style={riseIn(frame, { delay: 22, duration: 12 })}>
        <SkewTag size={2.1}>Carta · {match.duel}</SkewTag>
      </div>

      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: vertical ? "column" : "row",
          alignItems: "stretch",
          gap: u * 1.4,
        }}
      >
        {match.corners.map((corner, position) => {
          const won = corner.fighter === match.winner;
          const color = sideColor[corner.side];
          const entry = flyIn(frame, position === 0 ? "left" : "right", {
            delay: 30,
            duration: 18,
          });

          return (
            <div
              key={corner.fighter}
              style={{
                flex: 1,
                minWidth: 0,
                display: "flex",
                ...entry,
                // La entrada y el apagado de la derrota se multiplican: si se
                // pisaran, la carta perdedora reaparecería entera al aterrizar.
                opacity: entry.opacity * (won ? 1 : dim),
              }}
            >
              <CaosCard
                side={corner.side}
                label={`${SIDE_LABEL[corner.side]}${corner.edge ? ` · ${corner.edge}` : ""}`}
                name={corner.fighter}
                nameSize={fighterSize(corner.fighter)}
                rule={corner.rule}
                footer={<Chip color={color}>{corner.name}</Chip>}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  boxShadow: won
                    ? `0 0 ${u * (1 - dim) * 8}px ${-u * 1.2}px ${colors.primary}`
                    : undefined,
                }}
              />
            </div>
          );
        })}
      </div>

      <Body size={2.2} dim style={riseIn(frame, { delay: 52, duration: 14 })}>
        Arrancan: {match.start}
        {match.bounty
          ? ` · Remontar pagaba +${match.bounty.xp} XP a ${match.bounty.fighter}.`
          : " · Sin ventaja: nadie cobraba remontada."}
        {` Finalizar, +${FINISH_XP} XP.`}
      </Body>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: u * 1,
          ...slamIn(frame, { delay: WIN - 10, duration: 16 }),
        }}
      >
        <SkewTag size={3}>Gana {match.winner}</SkewTag>
        {upset ? (
          <Chip color={colors.accent} filled size={2.1}>
            Remontada · +{match.bounty!.xp} XP
          </Chip>
        ) : null}
      </div>
    </SceneShell>
  );
};
