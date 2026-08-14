import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { easeSlam, progress } from "../../../lib/anim";
import { useStage } from "../../../lib/layout";
import { colors } from "../theme";

/**
 * Líneas de velocidad de manga / fighting game (`.caos-speed`). Se desplazan en
 * bucle: el patrón mide 26px y el recorrido es de un tercio del ancho total del
 * bloque, así el ciclo empalma sin salto visible.
 */
export const SpeedLines: React.FC<{
  opacity?: number;
  color?: string;
  speed?: number;
}> = ({ opacity = 0.28, color = colors.primary, speed = 1 }) => {
  const frame = useCurrentFrame();
  const shift = ((frame * speed * 3.2) % 78) - 78;

  return (
    <AbsoluteFill
      style={{
        inset: "-20% -60%",
        opacity,
        pointerEvents: "none",
        transform: `translateX(${shift}px) skewX(-18deg)`,
        backgroundImage: `repeating-linear-gradient(90deg, ${color} 0 2px, transparent 2px 26px)`,
      }}
    />
  );
};

/**
 * Flash blanco de un par de frames: el hit-stop de un combo. Va sobre todo,
 * incluido el grano, porque tiene que sentirse como un corte de cámara.
 */
export const FlashCut: React.FC<{
  at: number;
  duration?: number;
  color?: string;
  peak?: number;
}> = ({ at, duration = 8, color = colors.secondary, peak = 0.85 }) => {
  const frame = useCurrentFrame();

  // Antes de su frame el destello no existe. Sin esta salida temprana un
  // `interpolate` con el borde izquierdo fijado devolvería `peak` desde el
  // frame 0, y cada destello pendiente estaría blanqueando la escena entera.
  if (frame < at) return null;

  const opacity = interpolate(frame, [at, at + duration], [peak, 0], {
    extrapolateRight: "clamp",
  });

  if (opacity <= 0.001) return null;

  return <AbsoluteFill style={{ backgroundColor: color, opacity }} />;
};

/** Estallido radial del impacto (`.caos-burst`): crece y se desvanece. */
export const BurstRing: React.FC<{
  at: number;
  duration?: number;
  color?: string;
  size?: number;
  thickness?: number;
}> = ({ at, duration = 18, color = colors.primary, size = 40, thickness = 0.8 }) => {
  const frame = useCurrentFrame();
  const { u } = useStage();
  const p = progress(frame, { delay: at, duration, easing: easeSlam });

  if (p <= 0 || p >= 1) return null;

  const scale = interpolate(p, [0, 1], [0.2, 2.6]);
  const opacity = interpolate(p, [0, 1], [0.9, 0]);

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <div
        style={{
          width: size * u,
          height: size * u,
          borderRadius: "50%",
          border: `${thickness * u}px solid ${color}`,
          transform: `scale(${scale})`,
          opacity,
        }}
      />
    </AbsoluteFill>
  );
};

/** Franja de tier: las rayitas diagonales que coronan cada carta del CAOS. */
export const HazardBar: React.FC<{
  color?: string;
  height?: number;
  style?: React.CSSProperties;
}> = ({ color = colors.primary, height = 0.55, style }) => {
  const { u } = useStage();

  return (
    <div
      style={{
        height: height * u,
        width: "100%",
        backgroundImage: `repeating-linear-gradient(-45deg, ${color} 0 ${u * 0.5}px, transparent ${u * 0.5}px ${u}px)`,
        ...style,
      }}
    />
  );
};

/**
 * Panel cortado en diagonal en la esquina inferior derecha (`.clip-cut`).
 * Es la silueta de todo bloque de la app: nada tiene esquinas redondeadas.
 */
export const CutPanel: React.FC<{
  children?: React.ReactNode;
  cut?: number;
  bg?: string;
  border?: string;
  borderWidth?: number;
  style?: React.CSSProperties;
}> = ({
  children,
  cut = 1.8,
  bg = colors.base200,
  border = colors.base300,
  borderWidth = 0.22,
  style,
}) => {
  const { u } = useStage();
  const c = cut * u;

  return (
    <div
      style={{
        position: "relative",
        overflow: "hidden",
        backgroundColor: bg,
        border: `${borderWidth * u}px solid ${border}`,
        clipPath: `polygon(0 0, 100% 0, 100% calc(100% - ${c}px), calc(100% - ${c}px) 100%, 0 100%)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/**
 * Barra de XP inclinada con el brillo que la recorre (`.xp-bar`).
 * `fill` va de 0 a 1.
 */
export const XpBar: React.FC<{
  fill: number;
  color?: string;
  height?: number;
  shineFrom?: number;
  style?: React.CSSProperties;
}> = ({ fill, color = colors.primary, height = 1.1, shineFrom = 0, style }) => {
  const frame = useCurrentFrame();
  const { u } = useStage();
  // El brillo cruza en 2.2s y descansa el resto del ciclo, como en la app.
  const cycle = (frame - shineFrom) % 66;
  const shine = interpolate(cycle, [0, 40, 66], [-100, 100, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "relative",
        height: height * u,
        overflow: "hidden",
        backgroundColor: colors.base300,
        transform: "skewX(-12deg)",
        ...style,
      }}
    >
      <div
        style={{
          position: "relative",
          height: "100%",
          width: `${Math.max(0, Math.min(1, fill)) * 100}%`,
          backgroundColor: color,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            transform: `translateX(${shine}%)`,
            backgroundImage:
              "linear-gradient(90deg, transparent 30%, rgba(255,255,255,0.55) 50%, transparent 70%)",
          }}
        />
      </div>
    </div>
  );
};
