import React from "react";
import { useCurrentFrame } from "remotion";
import { flyIn, riseIn } from "../../../../lib/anim";
import { useStage } from "../../../../lib/layout";
import { Columna } from "../../components/Columna";
import { Estelas, Fondo, Franja } from "../../components/Fondo";
import { Etiqueta, tamParaCaber, Titular, useMarca, Voz } from "../../components/Tipos";

/**
 * 04 · Lo que solo tiene esta marca: su corte de negocio, en dos a cuatro
 * palabras grandes que entran como carros en fila. La última va en el color
 * de la casa, que es donde cae la vista.
 */
export const Diferencial: React.FC = () => {
  const frame = useCurrentFrame();
  const { u, vertical } = useStage();
  const { diferencial, colores } = useMarca();
  const { lineas } = diferencial;

  const tam = tamParaCaber(lineas, lineas.length === 1 ? 18 : lineas.length > 3 ? 9 : 11, vertical);

  return (
    <Fondo halo={1.1}>
      <Estelas opacity={0.35} speed={1.6} />
      <Columna gap={1.4}>
        <div style={{ ...riseIn(frame, { duration: 12 }), marginBottom: u * 2 }}>
          <Etiqueta size={1.8}>{diferencial.kicker}</Etiqueta>
        </div>

        {lineas.map((linea, i) => (
          <Titular
            key={linea}
            size={tam}
            color={i === lineas.length - 1 ? colores.primario : colores.tinta}
            style={flyIn(frame, i % 2 === 0 ? "left" : "right", { delay: 6 + i * 7, duration: 16 })}
          >
            {linea}
          </Titular>
        ))}

        <Franja width={u * 14} height={u * 0.9} style={{ marginTop: u * 2.4, ...riseIn(frame, { delay: 30 }) }} />

        <div style={{ ...riseIn(frame, { delay: 34, duration: 18 }), marginTop: u * 2.4 }}>
          <Voz size={3} dim style={{ maxWidth: u * 84 }}>
            {diferencial.nota}
          </Voz>
        </div>
      </Columna>
    </Fondo>
  );
};
