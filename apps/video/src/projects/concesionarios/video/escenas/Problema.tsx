import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { progress, riseIn, slamIn } from "../../../../lib/anim";
import { useStage } from "../../../../lib/layout";
import { Columna } from "../../components/Columna";
import { alfa, Fondo } from "../../components/Fondo";
import { Etiqueta, Titular, useMarca, Voz } from "../../components/Tipos";

/** Frame en el que cae la pregunta. */
const PREGUNTA = 36;

/**
 * 02 · Lo que le pasa hoy. Tres publicaciones de su feed se van apagando una
 * tras otra —así se pierde un inventario que solo vive en Instagram— y cae la
 * pregunta en la letra de su marca.
 */
export const Problema: React.FC = () => {
  const frame = useCurrentFrame();
  const { u } = useStage();
  const marca = useMarca();
  const { colores } = marca;

  const texto = marca.problema ?? {
    a: `${marca.seguidores} personas siguen a ${marca.nombreCorto ?? marca.nombre} en Instagram.`,
    b: "¿Dónde ven tu inventario completo?",
  };

  return (
    <Fondo halo={0.6}>
      <Columna gap={3.4}>
        <div style={riseIn(frame, { duration: 12 })}>
          <Etiqueta size={1.6}>Hoy</Etiqueta>
        </div>

        {/* El feed que se apaga. */}
        <div style={{ display: "flex", gap: u * 1.6 }}>
          {[0, 1, 2].map((i) => {
            const entra = progress(frame, { delay: 2 + i * 3, duration: 12 });
            const sale = progress(frame, { delay: 22 + i * 7, duration: 16 });
            return (
              <div
                key={i}
                style={{
                  width: u * 17,
                  height: u * 21,
                  borderRadius: u * 1.6,
                  border: `${u * 0.3}px solid ${colores.linea}`,
                  background: `linear-gradient(160deg, ${alfa(colores.primario, 0.35)}, ${colores.superficie} 70%)`,
                  opacity: entra * (1 - sale * 0.85),
                  transform: `translateY(${(1 - entra) * u * 4 + sale * u * 3}px) scale(${1 - sale * 0.12}) rotate(${sale * (i - 1) * 6}deg)`,
                  filter: `grayscale(${sale})`,
                  display: "flex",
                  alignItems: "flex-end",
                  padding: u * 1.4,
                }}
              >
                <div style={{ width: "60%", height: u * 0.8, borderRadius: u, backgroundColor: alfa(colores.tinta, 0.4) }} />
              </div>
            );
          })}
        </div>

        <div style={riseIn(frame, { delay: 8, duration: 18 })}>
          <Voz size={3.8} style={{ maxWidth: u * 80 }}>
            {texto.a}
          </Voz>
        </div>

        <Titular
          size={8.4}
          color={colores.primario}
          style={{
            ...slamIn(frame, { delay: PREGUNTA, duration: 16 }),
            maxWidth: u * 86,
            opacity: interpolate(frame, [PREGUNTA, PREGUNTA + 4], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          {texto.b}
        </Titular>
      </Columna>
    </Fondo>
  );
};
