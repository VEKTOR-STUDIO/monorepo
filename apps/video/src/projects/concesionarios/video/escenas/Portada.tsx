import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { easeOvershoot, progress, riseIn } from "../../../../lib/anim";
import { useStage } from "../../../../lib/layout";
import { Columna } from "../../components/Columna";
import { Estelas, Fondo, Franja } from "../../components/Fondo";
import { Logo } from "../../components/Logo";
import { Etiqueta, tamEtiqueta, tamParaCaber, Titular, useMarca, Voz } from "../../components/Tipos";

/**
 * 01 · La marca. Entra el logo, luego su nombre en la letra de su web y su
 * propio lema. Lo primero que ve el dueño es SU marca, no la de la casa: la
 * firma (Alessandrovaru de Vektor) queda arriba, pequeña, y vuelve al final.
 */
/** La firma de la casa, arriba y pequeña: los dos nombres, como en el crédito. */
const PRESENTA = "Alessandrovaru de Vektor presenta";

export const Portada: React.FC = () => {
  const frame = useCurrentFrame();
  const { u, vertical } = useStage();
  const marca = useMarca();

  const logoP = progress(frame, { delay: 4, duration: 20, easing: easeOvershoot });
  const logoScale = interpolate(logoP, [0, 1], [0.4, 1]);
  const estelas = interpolate(frame, [0, 20, 60], [0.9, 0.55, 0.3], { extrapolateRight: "clamp" });

  const tam = tamParaCaber(marca.nombre, marca.nombre.length > 14 ? 9 : 11.5, vertical);

  return (
    <Fondo>
      <Estelas opacity={estelas} speed={2.2} count={20} />
      <Columna gap={2.6}>
        <div style={riseIn(frame, { delay: 0, duration: 14 })}>
          <Etiqueta
            size={tamEtiqueta(PRESENTA, 1.6, vertical ? 56 : 110)}
            color={marca.colores.humo}
            style={{ whiteSpace: "nowrap" }}
          >
            {PRESENTA}
          </Etiqueta>
        </div>

        <div style={{ height: u * 1 }} />

        <Logo
          size={24}
          style={{ opacity: progress(frame, { delay: 4, duration: 6 }), transform: `scale(${logoScale})` }}
        />

        <Franja
          width={u * 14}
          height={u * 0.9}
          style={{ opacity: progress(frame, { delay: 18, duration: 10 }), marginTop: u }}
        />

        <Titular size={tam} style={{ ...riseIn(frame, { delay: 16, duration: 18, travel: u * 4 }), marginTop: u }}>
          {marca.nombre}
        </Titular>

        <div style={riseIn(frame, { delay: 28, duration: 18 })}>
          <Voz size={3.6}>{marca.tagline}</Voz>
        </div>

        <div style={riseIn(frame, { delay: 36, duration: 18 })}>
          <Etiqueta size={1.6}>{marca.ciudad}</Etiqueta>
        </div>
      </Columna>
    </Fondo>
  );
};
