import React from "react";
import { AbsoluteFill } from "remotion";
import { useStage } from "../../../lib/layout";

/** Columna centrada con el ancho seguro para 9:16 y 16:9. */
export const Columna: React.FC<{ children: React.ReactNode; gap?: number; style?: React.CSSProperties }> = ({
  children,
  gap = 3,
  style,
}) => {
  const { u, content, vertical } = useStage();
  // En 9:16 sobra alto: la columna se agranda un 30% para llenar la pantalla
  // del móvil, que es donde se ve este formato.
  const k = vertical ? 1.3 : 1;

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: 7 * u }}>
      <div
        style={{
          width: content / k,
          transform: `scale(${k})`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: gap * u,
          ...style,
        }}
      >
        {children}
      </div>
    </AbsoluteFill>
  );
};
