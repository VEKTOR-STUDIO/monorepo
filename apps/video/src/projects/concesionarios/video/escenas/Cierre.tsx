import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { progress, riseIn, slamIn } from "../../../../lib/anim";
import { useStage } from "../../../../lib/layout";
import { Columna } from "../../components/Columna";
import { alfa, Fondo } from "../../components/Fondo";
import { Logo } from "../../components/Logo";
import { Etiqueta, tamEtiqueta, Titular, useMarca, Voz } from "../../components/Tipos";

/**
 * El precio de las demos de `apps/clients`: el mismo en todas, igual que en el
 * bloque de venta de cada puerta (`config.demo`). No se ajusta por cliente.
 */
const PRECIO = {
  antes: "$740",
  ahora: "$449",
  nota: "Pago único · dominio, montaje y carga del catálogo incluidos",
};

/** Frame en el que el precio viejo se tacha y cae el nuevo. */
const TACHA = 30;

/**
 * 05 · La web ya existe: el enlace donde está publicada, el precio y la firma de Vektor en
 * Microgramma, como en el pie de cada demo.
 */
export const Cierre: React.FC = () => {
  const frame = useCurrentFrame();
  const { u, vertical } = useStage();
  const marca = useMarca();
  const { colores } = marca;

  const tacha = progress(frame, { delay: TACHA, duration: 10 });

  return (
    <Fondo halo={0.9}>
      <Columna gap={2.4}>
        <div style={riseIn(frame, { duration: 14 })}>
          <Logo size={12} />
        </div>

        <Titular size={7.4} style={riseIn(frame, { delay: 4, duration: 16, travel: u * 3 })}>
          Tu web ya está hecha
        </Titular>

        <div
          style={{
            ...riseIn(frame, { delay: 10, duration: 16 }),
            padding: `${u * 1.2}px ${u * 2.6}px`,
            borderBottom: `${u * 0.4}px solid ${colores.primario}`,
          }}
        >
          <Etiqueta
            size={tamEtiqueta(marca.dominio, 2.6, vertical ? 56 : 110, 0.08)}
            color={colores.tinta}
            style={{ letterSpacing: "0.08em", textTransform: "none", whiteSpace: "nowrap" }}
          >
            {marca.dominio}
          </Etiqueta>
        </div>

        {/* El precio */}
        <div
          style={{
            marginTop: u * 2,
            padding: `${u * 2.6}px ${u * 6}px ${u * 3}px`,
            borderRadius: u * 2,
            border: `${u * 0.3}px solid ${colores.linea}`,
            backgroundColor: alfa(colores.superficie, 0.85),
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: u * 1.2,
            ...riseIn(frame, { delay: 16, duration: 16 }),
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: u * 3 }}>
            <div style={{ position: "relative" }}>
              <Titular size={5.4} color={colores.humo}>
                {PRECIO.antes}
              </Titular>
              <div
                style={{
                  position: "absolute",
                  left: -u * 0.6,
                  top: "50%",
                  height: u * 0.55,
                  width: `calc(${tacha * 100}% + ${u * 1.2 * tacha}px)`,
                  backgroundColor: colores.primario,
                  transform: "rotate(-8deg)",
                }}
              />
            </div>
            <Titular
              size={13}
              color={colores.primario}
              style={{
                ...slamIn(frame, { delay: TACHA + 6, duration: 16 }),
                opacity: interpolate(frame, [TACHA + 6, TACHA + 9], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                }),
              }}
            >
              {PRECIO.ahora}
            </Titular>
          </div>
          <Voz size={2.3} dim style={{ maxWidth: u * 70 }}>
            {PRECIO.nota}
          </Voz>
        </div>

        {/* La firma */}
        <div
          style={{
            ...riseIn(frame, { delay: 52, duration: 16 }),
            marginTop: u * 3,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: u * 0.9,
          }}
        >
          <div style={{ display: "flex", alignItems: "baseline", gap: u * 1.4 }}>
            <Voz size={2.2} dim>
              Hecho por
            </Voz>
            <Etiqueta size={3} color={colores.tinta} style={{ letterSpacing: "0.14em" }}>
              Vektor
            </Etiqueta>
          </div>
          <Etiqueta size={1.4} color={colores.humo} style={{ textTransform: "none", letterSpacing: "0.18em" }}>
            vektorstudio.tech
          </Etiqueta>
        </div>
      </Columna>
    </Fondo>
  );
};
