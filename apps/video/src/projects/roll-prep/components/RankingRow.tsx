import React from "react";
import { useStage } from "../../../lib/layout";
import { CutPanel } from "./Fx";
import { colors, fonts } from "../theme";

export type RankingRowProps = {
  /** 1, 2, 3… Se pinta como 01, 02, 03. */
  position: number;
  name: string;
  academy?: string;
  wins: number;
  losses: number;
  submissions: number;
  upsets: number;
  titles: number;
  /** Puntos de CAOS. La moneda del ranking competitivo, nada que ver con el XP. */
  pc: number;
  /** Alto de la fila en unidades de escenario: manda el tamaño del nombre. */
  size?: number;
  style?: React.CSSProperties;
};

/**
 * Una fila del ranking CAOS, igual que en
 * `app/dashboard/ranking/caos/page.js`: dorsal, nombre, la línea de récord
 * y los PC en rojo a la derecha.
 *
 * El podio se distingue como en la app — el primero en rojo, el segundo y el
 * tercero en tinta llena, del cuarto para abajo el número va contorneado — y
 * no con medallas: el ranking no premia, mide.
 */
export const RankingRow: React.FC<RankingRowProps> = ({
  position,
  name,
  academy,
  wins,
  losses,
  submissions,
  upsets,
  titles,
  pc,
  size = 4,
  style,
}) => {
  const { u } = useStage();

  const first = position === 1;
  const podium = position <= 3;

  // "0 sub · 1 remontada · 1 título" — el título solo aparece si lo hay, y en
  // singular o plural según toque, igual que la línea de la app.
  const record = [
    `${submissions} sub`,
    `${upsets} ${upsets === 1 ? "remontada" : "remontadas"}`,
    titles > 0 ? `${titles} ${titles === 1 ? "título" : "títulos"}` : null,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <CutPanel
      cut={size * 0.4}
      bg={colors.base200}
      border={first ? colors.accent : colors.base300}
      borderWidth={0.2}
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        gap: size * 0.4 * u,
        padding: `${size * 0.42 * u}px ${size * 0.5 * u}px`,
        boxShadow: first ? `0 0 ${u * 3.5}px ${-u * 1.2}px ${colors.accent}` : undefined,
        ...style,
      }}
    >
      <div
        style={{
          fontFamily: fonts.display,
          fontSize: size * 1.15 * u,
          lineHeight: 0.85,
          flexShrink: 0,
          width: size * 1.5 * u,
          textAlign: "center",
          // Del cuarto para abajo el número es solo contorno: el podio pesa.
          color: first ? colors.accent : podium ? colors.baseContent : "transparent",
          WebkitTextStrokeWidth: podium ? 0 : Math.max(1, u * 0.14),
          WebkitTextStrokeColor: colors.baseContent,
          opacity: podium ? 1 : 0.55,
        }}
      >
        {String(position).padStart(2, "0")}
      </div>

      <div
        style={{
          flexGrow: 1,
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
          gap: size * 0.16 * u,
        }}
      >
        <div
          style={{
            fontFamily: fonts.display,
            textTransform: "uppercase",
            fontSize: size * u,
            lineHeight: 0.92,
            letterSpacing: "-0.01em",
            color: colors.baseContent,
          }}
        >
          {name}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: size * 0.3 * u,
            fontFamily: fonts.sans,
            fontWeight: 700,
            fontSize: size * 0.4 * u,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            whiteSpace: "nowrap",
          }}
        >
          {academy ? (
            <span style={{ color: colors.baseContent, opacity: 0.75 }}>{academy}</span>
          ) : null}
          <span style={{ color: colors.baseContent }}>
            {wins}
            <span style={{ opacity: 0.4 }}>-</span>
            {losses}
          </span>
          <span style={{ color: colors.baseContent, opacity: 0.5 }}>{record}</span>
        </div>
      </div>

      <div
        style={{
          flexShrink: 0,
          fontFamily: fonts.display,
          fontSize: size * 1.05 * u,
          lineHeight: 0.9,
          color: colors.accent,
        }}
      >
        {pc}
        <span style={{ fontSize: size * 0.42 * u, marginLeft: u * 0.3, opacity: 0.7 }}>PC</span>
      </div>
    </CutPanel>
  );
};
