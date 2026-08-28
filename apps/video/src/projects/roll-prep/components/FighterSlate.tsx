import React from "react";
import { useStage } from "../../../lib/layout";
import { CutPanel } from "./Fx";
import { SkewTag } from "./Type";
import { belts, colors, fonts, type BeltKey } from "../theme";

export type FighterSlateProps = {
  /** El puesto en la cartelera: se pinta como 01, 02, 03… */
  slot: number;
  name: string;
  belt: BeltKey;
  /** La academia, si se sabe. Sin ella la chapa se lee igual de completa. */
  academy?: string;
  /** Color de la cinta y del número. Alterna volt/rojo por puesto. */
  stripe?: string;
  /** Tamaño del nombre en unidades de escenario. */
  size?: number;
  style?: React.CSSProperties;
};

/**
 * El color de cinta que le toca a cada puesto: volt, rojo, volt, rojo.
 * Es la misma alternancia de la story de lineup, y es lo único que distingue
 * una chapa de otra cuando los cuatro llevan el mismo cinturón.
 */
export const stripeFor = (index: number): string =>
  index % 2 === 0 ? colors.primary : colors.accent;

/**
 * La chapa de un competidor: cinta de color, dorsal, nombre y cinturón.
 *
 * Es la misma pieza que la app imprime en la story de lineup
 * (`app/api/invitaciones/[slug]/lineup/card.js`) — cinta gruesa a la izquierda,
 * dorsal en Anton del color de la cinta, nombre enorme y la chapa del cinturón
 * debajo. Aquí solo cambia de medio: se dimensiona en `u` para que sirva en
 * 9:16 y en 16:9, y la usan tanto la presentación de uno solo como la
 * cartelera de los cuatro.
 */
export const FighterSlate: React.FC<FighterSlateProps> = ({
  slot,
  name,
  belt,
  academy,
  stripe = colors.primary,
  size = 6,
  style,
}) => {
  const { u } = useStage();
  const rank = belts[belt];

  return (
    <CutPanel
      cut={size * 0.34}
      bg={colors.base200}
      border={colors.base300}
      borderWidth={0.18}
      style={{ width: "100%", display: "flex", alignItems: "stretch", ...style }}
    >
      {/* La cinta va como bloque y no como `borderLeft` para que el corte
          diagonal del panel la rebane igual que a todo lo demás. */}
      <div style={{ width: size * 0.17 * u, backgroundColor: stripe, flexShrink: 0 }} />

      <div
        style={{
          flexGrow: 1,
          minWidth: 0,
          display: "flex",
          alignItems: "center",
          gap: size * 0.34 * u,
          padding: `${size * 0.3 * u}px ${size * 0.42 * u}px`,
        }}
      >
        <div
          style={{
            fontFamily: fonts.display,
            fontSize: size * 0.92 * u,
            lineHeight: 0.85,
            color: stripe,
            flexShrink: 0,
          }}
        >
          {String(slot).padStart(2, "0")}
        </div>

        <div style={{ minWidth: 0, display: "flex", flexDirection: "column", gap: size * 0.14 * u }}>
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

          <div style={{ display: "flex", alignItems: "center", gap: size * 0.2 * u }}>
            <SkewTag size={size * 0.3} bg={rank.color} fg={rank.ink}>
              {rank.label}
            </SkewTag>

            {academy ? (
              <span
                style={{
                  fontFamily: fonts.sans,
                  fontWeight: 700,
                  fontSize: size * 0.32 * u,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: stripe,
                  whiteSpace: "nowrap",
                }}
              >
                {academy}
              </span>
            ) : null}
          </div>
        </div>
      </div>
    </CutPanel>
  );
};
