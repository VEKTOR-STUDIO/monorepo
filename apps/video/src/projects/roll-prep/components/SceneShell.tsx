import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { shake } from "../../../lib/anim";
import { useStage } from "../../../lib/layout";
import { Backdrop, type BackdropProps } from "./Backdrop";

export type SceneShellProps = BackdropProps & {
  children: React.ReactNode;
  /** Separación vertical entre bloques, en unidades de escenario. */
  gap?: number;
  /** Aire alrededor de la columna de contenido. */
  padding?: number;
  /** Amplitud del temblor en px. La escena del dado la usa fuerte. */
  quake?: number;
  /** Se pega abajo (para créditos o firmas) en vez de centrarse. */
  align?: "center" | "top";
  /** Capas que van DETRÁS del contenido pero delante del fondo. */
  behind?: React.ReactNode;
  /** Capas que van encima de todo (flashes, estallidos). */
  over?: React.ReactNode;
};

/**
 * El molde de todas las escenas: fondo de marca, una columna centrada con el
 * ancho seguro para los dos formatos, y ganchos para meter capas delante y
 * detrás del contenido.
 *
 * Que el temblor viva aquí y no en cada escena es lo que hace que el impacto
 * sacuda TODO a la vez —texto, cartas y estallido— en lugar de que cada
 * elemento tiemble por su cuenta y se vea como gelatina.
 */
export const SceneShell: React.FC<SceneShellProps> = ({
  children,
  gap = 3,
  padding = 7,
  quake = 0,
  align = "center",
  behind,
  over,
  ...backdrop
}) => {
  const frame = useCurrentFrame();
  const { u, content } = useStage();

  return (
    <Backdrop {...backdrop}>
      {behind}

      <AbsoluteFill
        style={{
          justifyContent: align === "center" ? "center" : "flex-start",
          alignItems: "center",
          padding: padding * u,
          transform: shake(frame, quake),
        }}
      >
        <div
          style={{
            width: content,
            maxWidth: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: gap * u,
          }}
        >
          {children}
        </div>
      </AbsoluteFill>

      {over}
    </Backdrop>
  );
};
