import React from "react";
import { useStage } from "../../../lib/layout";
import { colors, fonts } from "../theme";

type TextProps = {
  children: React.ReactNode;
  /** Tamaño en unidades de escenario (1u = 1% del lado corto). */
  size?: number;
  color?: string;
  align?: React.CSSProperties["textAlign"];
  style?: React.CSSProperties;
};

/**
 * Titular tipo póster: Anton, mayúsculas, interlineado apretado.
 * Es la clase `.display` de la app.
 */
export const Display: React.FC<TextProps> = ({
  children,
  size = 9,
  color = colors.baseContent,
  align = "center",
  style,
}) => {
  const { u } = useStage();

  return (
    <div
      style={{
        fontFamily: fonts.display,
        fontWeight: 400,
        textTransform: "uppercase",
        letterSpacing: "-0.01em",
        lineHeight: 0.92,
        fontSize: size * u,
        color,
        textAlign: align,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/**
 * Antetítulo: Barlow negrita, muy espaciado. Lo que va encima del titular
 * para decir de qué sección estamos hablando.
 */
export const Kicker: React.FC<TextProps> = ({
  children,
  size = 2,
  color = colors.primary,
  align = "center",
  style,
}) => {
  const { u } = useStage();

  return (
    <div
      style={{
        fontFamily: fonts.sans,
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: "0.28em",
        fontSize: size * u,
        color,
        textAlign: align,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/** Cuerpo de texto. Barlow, con aire entre líneas para que se lea en móvil. */
export const Body: React.FC<TextProps & { weight?: number; dim?: boolean }> = ({
  children,
  size = 3,
  color = colors.baseContent,
  align = "center",
  weight = 400,
  dim = false,
  style,
}) => {
  const { u } = useStage();

  return (
    <div
      style={{
        fontFamily: fonts.sans,
        fontWeight: weight,
        fontSize: size * u,
        lineHeight: 1.32,
        color,
        opacity: dim ? 0.62 : 1,
        textAlign: align,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/**
 * Etiqueta inclinada estilo dorsal (`.tag-skew`). El contenido se contra-inclina
 * para que el texto quede recto dentro del paralelogramo.
 */
export const SkewTag: React.FC<{
  children: React.ReactNode;
  size?: number;
  bg?: string;
  fg?: string;
  style?: React.CSSProperties;
}> = ({ children, size = 2.1, bg = colors.primary, fg = colors.primaryContent, style }) => {
  const { u } = useStage();

  return (
    <div
      style={{
        display: "inline-block",
        transform: "skewX(-12deg)",
        backgroundColor: bg,
        padding: `${size * 0.42 * u}px ${size * 1.05 * u}px`,
        ...style,
      }}
    >
      <span
        style={{
          display: "inline-block",
          transform: "skewX(12deg)",
          fontFamily: fonts.sans,
          fontWeight: 800,
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          fontSize: size * u,
          lineHeight: 1,
          color: fg,
        }}
      >
        {children}
      </span>
    </div>
  );
};

/**
 * Palabra gigante contorneada de fondo (`OSS`, `BJJ`, `CAOS`). Va detrás de
 * todo, sin peso visual, solo para que el encuadre no se sienta vacío.
 */
export const Watermark: React.FC<{
  children: React.ReactNode;
  size?: number;
  opacity?: number;
  rotate?: number;
  style?: React.CSSProperties;
}> = ({ children, size = 34, opacity = 0.16, rotate = 0, style }) => {
  const { u } = useStage();

  return (
    <div
      style={{
        position: "absolute",
        fontFamily: fonts.display,
        textTransform: "uppercase",
        fontSize: size * u,
        lineHeight: 0.8,
        letterSpacing: "-0.02em",
        WebkitTextStrokeWidth: Math.max(1.5, u * 0.22),
        WebkitTextStrokeColor: colors.baseContent,
        color: "transparent",
        opacity,
        transform: `rotate(${rotate}deg)`,
        whiteSpace: "nowrap",
        pointerEvents: "none",
        userSelect: "none",
        ...style,
      }}
    >
      {children}
    </div>
  );
};
