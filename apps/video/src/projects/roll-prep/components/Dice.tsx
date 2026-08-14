import React from "react";
import { interpolate, random, useCurrentFrame } from "remotion";
import { easeSlam, progress } from "../../../lib/anim";
import { useStage } from "../../../lib/layout";
import { colors, fonts } from "../theme";

// Icosaedro visto de frente: silueta hexagonal, cara central hacia el
// espectador y las tres caras vecinas apuntando a los vértices intermedios.
// Coordenadas en un viewBox de 100×100 para poder escalarlo a cualquier tamaño.
const HEX = [
  [50, 2],
  [91.57, 26],
  [91.57, 74],
  [50, 98],
  [8.43, 74],
  [8.43, 26],
] as const;

const FACE = [
  [50, 26],
  [70.78, 62],
  [29.22, 62],
] as const;

// Cada vértice de la cara central se une a tres vértices del hexágono: el que
// tiene enfrente y los dos que lo flanquean. Eso dibuja las caras vecinas.
const SPOKES: ReadonlyArray<readonly [number, number]> = [
  [0, 5],
  [0, 0],
  [0, 1],
  [1, 1],
  [1, 2],
  [1, 3],
  [2, 3],
  [2, 4],
  [2, 5],
];

const poly = (points: ReadonlyArray<readonly [number, number]>) =>
  points.map(([x, y]) => `${x},${y}`).join(" ");

export type DiceProps = {
  /** Frame en el que el dado clava y deja de girar. */
  landsAt: number;
  /** Cuándo empieza a girar. */
  startsAt?: number;
  /** Qué número queda arriba. */
  result?: number;
  size?: number;
  color?: string;
};

/**
 * El d20 de la ceremonia: gira en el aire (`.caos-tumble`, 1080°) mientras la
 * cara central pasa números al azar, y al aterrizar se queda en el resultado.
 *
 * Los números que pasan durante el giro salen de `random()` con semilla de
 * frame — deterministas, así que el mismo frame siempre muestra la misma cifra
 * aunque el render se reparta entre varias máquinas.
 */
export const Dice: React.FC<DiceProps> = ({
  landsAt,
  startsAt = 0,
  result = 20,
  size = 34,
  color = colors.primary,
}) => {
  const frame = useCurrentFrame();
  const { u } = useStage();

  const spin = progress(frame, {
    delay: startsAt,
    duration: landsAt - startsAt,
    easing: easeSlam,
  });

  const landed = frame >= landsAt;
  const rotation = spin * 1080;

  // Al aterrizar rebota un poco antes de quedarse quieto.
  const settle = progress(frame, { delay: landsAt, duration: 12 });
  const bounce = landed ? interpolate(settle, [0, 0.4, 0.7, 1], [1.22, 0.94, 1.04, 1]) : 1;
  const scale = interpolate(spin, [0, 1], [0.85, 1.15]) * (landed ? bounce / 1.15 : 1);

  // Mientras rueda, la cara enseña cualquier cosa; al caer, el resultado.
  const face = landed ? result : 1 + Math.floor(random(`d20-${Math.floor(frame / 2)}`) * 20);

  const px = size * u;

  return (
    <svg
      width={px}
      height={px}
      viewBox="0 0 100 100"
      style={{
        transform: `rotate(${rotation}deg) scale(${scale})`,
        overflow: "visible",
        filter: landed ? `drop-shadow(0 0 ${u * 2.2}px ${color}aa)` : undefined,
      }}
    >
      <polygon points={poly(HEX)} fill={colors.base200} stroke={color} strokeWidth={2.6} />
      <polygon
        points={poly(FACE)}
        fill={landed ? color : `${color}22`}
        stroke={color}
        strokeWidth={2.2}
      />
      {SPOKES.map(([f, h]) => (
        <line
          key={`${f}-${h}`}
          x1={FACE[f]![0]}
          y1={FACE[f]![1]}
          x2={HEX[h]![0]}
          y2={HEX[h]![1]}
          stroke={color}
          strokeWidth={1.4}
          opacity={0.65}
        />
      ))}
      {/* La cara central se estrecha hacia arriba: la cifra va baja y pequeña
          para que quepa dentro del triángulo y no se monte en los bordes. */}
      <text
        x={50}
        y={54}
        textAnchor="middle"
        dominantBaseline="middle"
        fontFamily={fonts.display}
        fontSize={17}
        fill={landed ? colors.base100 : color}
        // El texto va contra-rotado: el dado gira, la cifra se lee.
        transform={`rotate(${-rotation} 50 54)`}
      >
        {face}
      </text>
    </svg>
  );
};
