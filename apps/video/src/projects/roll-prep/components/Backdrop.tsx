import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { breathe } from "../../../lib/anim";
import { colors } from "../theme";

/**
 * Trama halftone: el mismo punteado de `globals.css`, que es la marca de la
 * casa en los fighting games. Se dibuja con un radial-gradient repetido porque
 * a 1080p una textura bitmap se ve sucia al escalar.
 */
export const Halftone: React.FC<{
  size?: number;
  opacity?: number;
  color?: string;
}> = ({ size = 26, opacity = 0.16, color = colors.baseContent }) => (
  <AbsoluteFill
    style={{
      opacity,
      backgroundImage: `radial-gradient(${color} ${size * 0.09}px, transparent ${size * 0.14}px)`,
      backgroundSize: `${size}px ${size}px`,
    }}
  />
);

/** Rayas diagonales de peligro. Las mismas de `.stripes`. */
export const Stripes: React.FC<{
  opacity?: number;
  color?: string;
  scale?: number;
}> = ({ opacity = 0.1, color = colors.baseContent, scale = 3 }) => (
  <AbsoluteFill
    style={{
      opacity,
      backgroundImage: `repeating-linear-gradient(-45deg, ${color} 0 ${6 * scale}px, transparent ${6 * scale}px ${14 * scale}px)`,
    }}
  />
);

/**
 * Grano de impresión. Es literalmente el mismo `feTurbulence` que lleva el
 * `<body>` de la web, y es lo que evita que los negros planos se vean como
 * un PowerPoint: le da textura de papel a todo.
 */
const GRAIN_URI =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.95' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)' opacity='0.55'/%3E%3C/svg%3E\")";

export const Grain: React.FC<{ opacity?: number }> = ({ opacity = 0.055 }) => (
  <AbsoluteFill
    style={{ opacity, backgroundImage: GRAIN_URI, pointerEvents: "none" }}
  />
);

/**
 * Los dos focos de luz que respiran despacio detrás de toda la web
 * (`.glow::before`). Van en `screen`: solo suman claridad, nunca ensucian.
 */
const Glow: React.FC<{ intensity?: number }> = ({ intensity = 1 }) => {
  const frame = useCurrentFrame();
  // 26s de ciclo en la web ≈ 780 frames a 30fps. Aquí se acorta a 300 para que
  // en un clip de 60s el movimiento se note.
  const drift = breathe(frame, 300);
  const x = -3 + drift * 7;
  const y = -2 + drift * 5;
  const scale = 1 + drift * 0.14;

  return (
    <AbsoluteFill
      style={{
        inset: "-25%",
        opacity: 0.6 * intensity,
        mixBlendMode: "screen",
        transform: `translate3d(${x}%, ${y}%, 0) scale(${scale})`,
        backgroundImage: [
          `radial-gradient(40% 44% at 24% 26%, ${colors.primary}1f 0%, transparent 70%)`,
          `radial-gradient(36% 40% at 78% 70%, ${colors.accent}1a 0%, transparent 72%)`,
        ].join(", "),
      }}
    />
  );
};

export type BackdropProps = {
  children?: React.ReactNode;
  /** `dark` = negro de la casa. `volt` = banda invertida (fondo volt, tinta negra). */
  tone?: "dark" | "volt";
  halftone?: boolean;
  stripes?: boolean;
  /** Sube o baja los focos de luz. 0 los apaga. */
  glow?: number;
  grain?: number;
};

/**
 * El fondo de todas las escenas: negro profundo, luz ambiental y grano.
 * Sin esto cada escena tendría que repetir las tres capas y se irían
 * desincronizando entre sí.
 */
export const Backdrop: React.FC<BackdropProps> = ({
  children,
  tone = "dark",
  halftone = false,
  stripes = false,
  glow = 1,
  grain = 0.055,
}) => {
  const volt = tone === "volt";

  return (
    <AbsoluteFill
      style={{
        backgroundColor: volt ? colors.primary : colors.base100,
        color: volt ? colors.primaryContent : colors.baseContent,
        overflow: "hidden",
      }}
    >
      {halftone ? (
        <Halftone
          opacity={volt ? 0.18 : 0.1}
          color={volt ? colors.primaryContent : colors.baseContent}
        />
      ) : null}
      {stripes ? (
        <Stripes
          opacity={volt ? 0.12 : 0.07}
          color={volt ? colors.primaryContent : colors.baseContent}
        />
      ) : null}

      {children}

      {!volt && glow > 0 ? <Glow intensity={glow} /> : null}
      {grain > 0 ? <Grain opacity={grain} /> : null}
    </AbsoluteFill>
  );
};
