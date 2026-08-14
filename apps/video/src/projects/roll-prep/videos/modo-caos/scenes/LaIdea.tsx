import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { progress, riseIn } from "../../../../../lib/anim";
import { useStage } from "../../../../../lib/layout";
import { CutPanel, HazardBar } from "../../../components/Fx";
import { SceneShell } from "../../../components/SceneShell";
import { Body, Display, Kicker } from "../../../components/Type";
import { colors, fonts } from "../../../theme";

type TileProps = {
  n: string;
  name: string;
  tagline: string;
  delay: number;
  /** El tile del CAOS se despega y proyecta sombra dura, como al hover en la app. */
  highlight?: boolean;
  /** Frame en el que se enciende. Solo aplica al tile destacado. */
  litAt?: number;
};

const Tile: React.FC<TileProps> = ({ n, name, tagline, delay, highlight = false, litAt = 0 }) => {
  const frame = useCurrentFrame();
  const { u } = useStage();

  const lit = highlight ? progress(frame, { delay: litAt, duration: 12 }) : 0;
  const color = lit > 0.5 ? colors.primary : colors.base300;
  const entry = riseIn(frame, { delay, duration: 16 });

  // `.menu-tile:hover`: se despega -3px y suelta una sombra sólida detrás.
  const lift = lit * 3;
  // El destello diagonal que cruza el tile al encenderse.
  const shine = interpolate(frame, [litAt, litAt + 20], [-120, 120], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <CutPanel
      cut={1.6}
      border={color}
      borderWidth={0.28}
      style={{
        width: "100%",
        opacity: entry.opacity,
        transform: `${entry.transform} translate(${-lift}px, ${-lift}px)`,
        boxShadow: lit
          ? `${u * 0.55 * lit}px ${u * 0.55 * lit}px 0 0 ${colors.primary}, 0 0 ${u * 4}px ${-u * 1.2}px ${colors.primary}`
          : undefined,
      }}
    >
      <HazardBar color={color} height={0.45} />

      {highlight && lit > 0 && lit < 1 ? (
        <div
          style={{
            position: "absolute",
            inset: "-20% -60%",
            transform: `translateX(${shine}%)`,
            backgroundImage: `linear-gradient(105deg, transparent 42%, ${colors.secondary}24 50%, transparent 58%)`,
          }}
        />
      ) : null}

      <div
        style={{
          // El borde inferior derecho va rebanado: sin ese aire de más abajo,
          // la segunda línea del tagline se mete dentro del corte.
          padding: `${u * 2}px ${u * 3.4}px ${u * 2.6}px ${u * 2.2}px`,
          display: "flex",
          alignItems: "center",
          gap: u * 1.8,
        }}
      >
        <span
          style={{
            flexShrink: 0,
            width: u * 5.4,
            textAlign: "center",
            fontFamily: fonts.display,
            fontSize: u * 5,
            lineHeight: 1,
            color: lit > 0.5 ? colors.primary : colors.base300,
          }}
        >
          {n}
        </span>

        <div style={{ minWidth: 0, textAlign: "left" }}>
          <div
            style={{
              fontFamily: fonts.display,
              textTransform: "uppercase",
              fontSize: u * 4.4,
              lineHeight: 1,
              color: colors.baseContent,
            }}
          >
            {name}
          </div>
          <div
            style={{
              marginTop: u * 0.6,
              fontFamily: fonts.sans,
              fontSize: u * 2.1,
              lineHeight: 1.25,
              color: colors.baseContent,
              opacity: 0.6,
            }}
          >
            {tagline}
          </div>
        </div>
      </div>
    </CutPanel>
  );
};

/**
 * 03 · De dónde sale la idea.
 *
 * El argumento no es "le metimos aleatoriedad": es que un mismo juego admite
 * varios modos. Por eso los dos tiles se enseñan juntos y solo uno se enciende.
 */
export const LaIdea: React.FC = () => {
  const frame = useCurrentFrame();
  const { u, vertical } = useStage();

  return (
    <SceneShell gap={2.6}>
      <Kicker style={riseIn(frame, { delay: 2, duration: 14 })}>La idea</Kicker>

      <Display size={vertical ? 8.4 : 9} style={riseIn(frame, { delay: 6, duration: 16 })}>
        Un mismo juego,
        <br />
        varias formas
        <br />
        de jugarlo
      </Display>

      <Body
        size={2.3}
        dim
        style={{ maxWidth: "88%", ...riseIn(frame, { delay: 16, duration: 16 }) }}
      >
        Grieta del Invocador y ARAM comparten campeones, ítems y reglas. Se sienten
        distintos porque cambia el mapa.
      </Body>

      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: u * 1.4,
          marginTop: u * 1.2,
        }}
      >
        <Tile
          n="01"
          name="Clásico"
          tagline="Bracket de eliminación simple. Las reglas de siempre."
          delay={28}
        />
        <Tile
          n="02"
          name="Caos"
          tagline="Cada pelea se rolea: terreno aleatorio y cartas de duelo."
          delay={36}
          highlight
          litAt={62}
        />
      </div>

      <Body size={2.4} weight={700} style={{ marginTop: u * 1, ...riseIn(frame, { delay: 84, duration: 16 }) }}>
        Mismo bracket. Mismos puntos. Mismo tatami.
      </Body>
    </SceneShell>
  );
};
