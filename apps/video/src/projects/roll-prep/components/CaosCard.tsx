import React from "react";
import { useCurrentFrame } from "remotion";
import { breathe } from "../../../lib/anim";
import { useStage } from "../../../lib/layout";
import { CutPanel, HazardBar } from "./Fx";
import { colors, fonts, sideColor, type DuelSide } from "../theme";

export type CaosCardProps = {
  /** Qué lado pinta la carta: volt = ventaja, rojo = carga, blanco = neutro. */
  side: DuelSide;
  /** La etiqueta de arriba: TERRENO, ALFA, OMEGA… */
  label: string;
  /** Nombre de la carta, en Anton. */
  name: string;
  /** La regla, tal como la lee el profesor. */
  rule: string;
  /** Chip opcional abajo del todo (el XP que paga, por ejemplo). */
  footer?: React.ReactNode;
  /** El tier 3 respira: aura que late (`.caos-brutal`). */
  brutal?: boolean;
  width?: number | string;
  style?: React.CSSProperties;
};

/**
 * La carta del CAOS: bloque cortado en diagonal, borde grueso del color del
 * lado y aura tenue. Es el mismo objeto que ve el alumno proyectado antes de
 * su pelea, solo que aquí a tamaño de video.
 */
export const CaosCard: React.FC<CaosCardProps> = ({
  side,
  label,
  name,
  rule,
  footer,
  brutal = false,
  width = "100%",
  style,
}) => {
  const frame = useCurrentFrame();
  const { u } = useStage();
  const color = sideColor[side];

  // `.caos-brutal`: la sombra late entre dos intensidades cada 1.4s.
  const pulse = brutal ? breathe(frame, 42) : 0;
  const glowSpread = u * (2.6 + pulse * 2.6);

  return (
    <CutPanel
      cut={2.2}
      bg={colors.base200}
      border={color}
      borderWidth={0.3}
      style={{
        width,
        boxShadow: `inset 0 0 0 1px ${color}4d, 0 0 ${glowSpread}px ${-u * 1.2}px ${color}`,
        ...style,
      }}
    >
      <HazardBar color={color} height={0.6} />

      <div style={{ padding: `${u * 2.2}px ${u * 2.6}px ${u * 2.8}px` }}>
        <div
          style={{
            fontFamily: fonts.sans,
            fontWeight: 800,
            fontSize: u * 1.9,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color,
          }}
        >
          {label}
        </div>

        <div
          style={{
            marginTop: u * 1.1,
            fontFamily: fonts.display,
            textTransform: "uppercase",
            fontSize: u * 6.4,
            lineHeight: 0.9,
            letterSpacing: "-0.01em",
            color: colors.baseContent,
          }}
        >
          {name}
        </div>

        <div
          style={{
            marginTop: u * 1.6,
            fontFamily: fonts.sans,
            fontWeight: 400,
            fontSize: u * 2.5,
            lineHeight: 1.3,
            color: colors.baseContent,
            opacity: 0.78,
          }}
        >
          {rule}
        </div>

        {footer ? <div style={{ marginTop: u * 2 }}>{footer}</div> : null}
      </div>
    </CutPanel>
  );
};

/** Chip pequeño de datos: el "+40 XP" o el "NIVEL 3 · BRUTAL". */
export const Chip: React.FC<{
  children: React.ReactNode;
  color?: string;
  filled?: boolean;
  size?: number;
  style?: React.CSSProperties;
}> = ({ children, color = colors.primary, filled = false, size = 1.9, style }) => {
  const { u } = useStage();

  return (
    <span
      style={{
        display: "inline-block",
        padding: `${u * size * 0.34}px ${u * size * 0.8}px`,
        border: `${u * 0.16}px solid ${color}`,
        backgroundColor: filled ? color : "transparent",
        color: filled ? colors.base100 : color,
        fontFamily: fonts.sans,
        fontWeight: 800,
        fontSize: u * size,
        lineHeight: 1,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        whiteSpace: "nowrap",
        ...style,
      }}
    >
      {children}
    </span>
  );
};
