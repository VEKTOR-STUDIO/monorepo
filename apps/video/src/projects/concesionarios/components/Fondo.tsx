import React from "react";
import { AbsoluteFill, interpolate, random, useCurrentFrame } from "remotion";
import { easeOut } from "../../../lib/anim";
import { useStage } from "../../../lib/layout";
import { useMarca } from "./Tipos";

/** `#RRGGBB` + opacidad 0–1 → `#RRGGBBAA`. */
export const alfa = (hex: string, a: number) =>
  `${hex}${Math.round(Math.max(0, Math.min(1, a)) * 255)
    .toString(16)
    .padStart(2, "0")}`;

/**
 * Estelas horizontales, como luces de carretera en exposición larga. Son la
 * firma de movimiento de los trece videos: el mismo gesto, cada uno en su color.
 */
export const Estelas: React.FC<{ opacity?: number; speed?: number; count?: number }> = ({
  opacity = 0.5,
  speed = 1,
  count = 16,
}) => {
  const frame = useCurrentFrame();
  const { width, height, u } = useStage();
  const { colores } = useMarca();

  return (
    <AbsoluteFill style={{ opacity, pointerEvents: "none" }}>
      {Array.from({ length: count }, (_, i) => {
        const y = random(`estela-y-${i}`) * height;
        const len = (0.15 + random(`estela-l-${i}`) * 0.35) * width;
        const v = (0.6 + random(`estela-v-${i}`) * 1.2) * speed * u * 2.4;
        const start = random(`estela-s-${i}`) * (width + len);
        const x = ((start + frame * v) % (width + len)) - len;
        const grosor = (0.12 + random(`estela-g-${i}`) * 0.28) * u;
        const color = i % 3 === 0 ? colores.acento : colores.primario;

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: len,
              height: grosor,
              borderRadius: grosor,
              background: `linear-gradient(90deg, transparent, ${alfa(color, 0.9)})`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

/**
 * El fondo de todas las escenas: el color de la web del cliente, un halo de su
 * primario y una rejilla en perspectiva, como el piso de un showroom.
 */
export const Fondo: React.FC<{ children?: React.ReactNode; halo?: number }> = ({
  children,
  halo = 1,
}) => {
  const frame = useCurrentFrame();
  const { u, vertical } = useStage();
  const { colores, claro } = useMarca();
  const deriva = Math.sin(frame / 50) * 4;

  return (
    <AbsoluteFill style={{ backgroundColor: colores.fondo, overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse ${vertical ? "90% 55%" : "60% 80%"} at ${50 + deriva}% ${vertical ? 30 : 40}%, ${alfa(colores.primario, (claro ? 0.12 : 0.22) * halo)}, transparent 70%)`,
        }}
      />
      {/* El piso: líneas que fugan hacia el horizonte. */}
      <AbsoluteFill
        style={{
          top: "58%",
          perspective: u * 40,
          opacity: claro ? 0.5 : 0.35,
          maskImage: "linear-gradient(to bottom, transparent, #000 40%)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent, #000 40%)",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: "-50% -50% 0 -50%",
            transform: "rotateX(62deg)",
            transformOrigin: "50% 100%",
            backgroundImage: `linear-gradient(${colores.linea} ${u * 0.18}px, transparent ${u * 0.18}px), linear-gradient(90deg, ${colores.linea} ${u * 0.18}px, transparent ${u * 0.18}px)`,
            backgroundSize: `${u * 8}px ${u * 8}px`,
            backgroundPosition: `0 ${(frame * u * 0.6) % (u * 8)}px`,
          }}
        />
      </AbsoluteFill>
      {children}
    </AbsoluteFill>
  );
};

/**
 * El corte entre escenas: una banda del primario de la marca barre la pantalla
 * en diagonal y tapa el salto. Va fuera de las escenas para cruzar el corte.
 */
export const Barrido: React.FC<{ at: number }> = ({ at }) => {
  const frame = useCurrentFrame();
  const { colores } = useMarca();
  const dur = 14;
  const p = interpolate(frame, [at - dur / 2, at + dur / 2], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });
  if (p <= 0 || p >= 1) return null;

  // La banda sólida mide dos pantallas: a mitad del barrido (el frame del
  // corte) cubre de -50% a 150%, con margen de sobra para la inclinación.
  const izquierda = interpolate(p, [0, 1], [-270, 170]);

  return (
    <AbsoluteFill style={{ pointerEvents: "none", overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          top: "-30%",
          bottom: "-30%",
          left: `${izquierda}%`,
          width: "200%",
          transform: "skewX(-14deg)",
          backgroundColor: colores.primario,
          borderRight: `solid 3.5vw ${colores.acento}`,
        }}
      />
    </AbsoluteFill>
  );
};

/** La franja de colores de la casa (bandera, barras del logo…). */
export const Franja: React.FC<{ width: number; height: number; style?: React.CSSProperties }> = ({
  width,
  height,
  style,
}) => {
  const { franja } = useMarca();
  if (!franja) return null;

  return (
    <div style={{ display: "flex", gap: height * 0.35, transform: "skewX(-18deg)", ...style }}>
      {franja.map((c) => (
        <div key={c} style={{ width: width / franja.length, height, backgroundColor: c }} />
      ))}
    </div>
  );
};
