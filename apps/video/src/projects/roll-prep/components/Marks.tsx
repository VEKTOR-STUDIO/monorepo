import React from "react";
import { Img, staticFile } from "remotion";
import { useStage } from "../../../lib/layout";
import { assets, colors, fonts } from "../theme";

/**
 * El corazón que escribe CAOS de forma abstracta. Igual que en la app:
 * la versión volt para fondos oscuros, la de tinta para bandas invertidas.
 */
export const CaosMark: React.FC<{
  variant?: "volt" | "ink";
  /** Alto en unidades de escenario. */
  size?: number;
  style?: React.CSSProperties;
}> = ({ variant = "volt", size = 20, style }) => {
  const { u } = useStage();

  return (
    <Img
      src={staticFile(variant === "ink" ? assets.caosInk : assets.caosVolt)}
      alt=""
      style={{
        height: size * u,
        width: "auto",
        objectFit: "contain",
        userSelect: "none",
        ...style,
      }}
    />
  );
};

/**
 * Chapa de RollPrep: el cuadrado volt con la R y la esquina rebanada,
 * opcionalmente con el nombre al lado.
 */
export const RollPrepLogo: React.FC<{
  size?: number;
  withWordmark?: boolean;
  style?: React.CSSProperties;
}> = ({ size = 6, withWordmark = true, style }) => {
  const { u } = useStage();

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: size * 0.42 * u,
        ...style,
      }}
    >
      <Img
        src={staticFile(assets.logo)}
        alt=""
        style={{ height: size * u, width: size * u, objectFit: "contain" }}
      />
      {withWordmark ? (
        <span
          style={{
            fontFamily: fonts.display,
            textTransform: "uppercase",
            fontSize: size * 0.86 * u,
            lineHeight: 1,
            letterSpacing: "-0.01em",
            color: colors.baseContent,
          }}
        >
          RollPrep
        </span>
      ) : null}
    </div>
  );
};
