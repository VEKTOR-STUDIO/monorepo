import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { easeOut, progress, riseIn } from "../../../../lib/anim";
import { useStage } from "../../../../lib/layout";
import { Fondo } from "../../components/Fondo";
import { Telefono } from "../../components/Telefono";
import { Etiqueta, tamEtiqueta, Titular, useMarca, Voz } from "../../components/Tipos";

/** Los golpes de la escena, en frames desde su inicio. */
const T = {
  entra: 0,
  scroll: 40,
  toque: 108,
  ficha: 116,
  pulso: 150,
} as const;

/** Cuándo se enciende cada llamada. */
const LLAMADAS_EN = [18, 70, 112, 150];

/**
 * 03 · Su web, funcionando. El teléfono baja de la portada al inventario, se
 * toca la primera unidad, se abre su ficha y late el botón de WhatsApp. Al lado
 * (o debajo, en vertical) se va encendiendo lo que hace cada parte.
 */
export const Web: React.FC = () => {
  const frame = useCurrentFrame();
  const { u, width, height, vertical } = useStage();
  const marca = useMarca();
  const { colores } = marca;

  const llamadas = [
    marca.llamadaPrecio ?? "Todo tu inventario, con precio a la vista",
    "Filtros por tipo de vehículo",
    "Una ficha completa por unidad",
    "WhatsApp con la unidad ya escrita",
  ];
  const activa = LLAMADAS_EN.reduce((acc, at, i) => (frame >= at ? i : acc), -1);

  const entra = progress(frame, { delay: T.entra, duration: 22 });
  const scroll = progress(frame, { delay: T.scroll, duration: 30, easing: easeOut });
  const toque = interpolate(frame, [T.toque, T.toque + 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const ficha = progress(frame, { delay: T.ficha, duration: 20, easing: easeOut });
  const pulso = frame >= T.pulso ? ((frame - T.pulso) % 22) / 22 : 0;

  const altoTel = vertical ? height * 0.6 : height * 0.86;
  const telefono = (
    <Telefono
      alto={altoTel}
      scroll={scroll}
      ficha={ficha}
      pulso={pulso}
      toque={toque}
      style={{
        opacity: entra,
        transform: `translateY(${(1 - entra) * u * 30}px) rotate(${(1 - entra) * -4}deg)`,
      }}
    />
  );

  const encabezado = (align: "center" | "left") => (
    <div style={{ ...riseIn(frame, { duration: 16 }), display: "flex", flexDirection: "column", gap: u * 1.6 }}>
      <Etiqueta
        size={tamEtiqueta(`Tu web · ${marca.dominio}`, vertical ? 2 : 1.6, vertical ? 82 : 76)}
        align={align}
        style={{ whiteSpace: "nowrap" }}
      >
        Tu web · {marca.dominio}
      </Etiqueta>
      <Titular size={vertical ? 7.4 : 6.4} align={align}>
        Tu inventario, en tu propia web
      </Titular>
    </div>
  );

  if (vertical) {
    const actual = Math.max(0, activa);
    const desde = LLAMADAS_EN[actual];
    return (
      <Fondo halo={0.8}>
        <AbsoluteFill
          style={{
            alignItems: "center",
            justifyContent: "center",
            gap: u * 4,
            padding: `${u * 8}px ${u * 7}px`,
          }}
        >
          {encabezado("center")}
          {telefono}
          <div style={{ height: u * 12, display: "flex", alignItems: "center", gap: u * 2.4 }}>
            {activa >= 0 ? (
              <div
                key={actual}
                style={{ ...riseIn(frame, { delay: desde, duration: 12 }), display: "flex", alignItems: "center", gap: u * 2.4 }}
              >
                <Etiqueta size={2.6}>{String(actual + 1).padStart(2, "0")}</Etiqueta>
                <Voz size={3.6} align="left" style={{ maxWidth: width * 0.7 }}>
                  {llamadas[actual]}
                </Voz>
              </div>
            ) : null}
          </div>
        </AbsoluteFill>
      </Fondo>
    );
  }

  return (
    <Fondo halo={0.8}>
      <AbsoluteFill
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: u * 10,
          padding: u * 7,
        }}
      >
        <div style={{ width: u * 78, display: "flex", flexDirection: "column", gap: u * 4 }}>
          {encabezado("left")}
          <div style={{ display: "flex", flexDirection: "column", gap: u * 2.2 }}>
            {llamadas.map((texto, i) => {
              const on = i === activa;
              const visto = i <= activa;
              return (
                <div
                  key={texto}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: u * 2.2,
                    opacity: visto ? (on ? 1 : 0.45) : 0.12,
                    transform: `translateX(${on ? u * 1.4 : 0}px)`,
                  }}
                >
                  <div style={{ width: u * 0.7, height: u * 4, backgroundColor: on ? colores.primario : colores.linea }} />
                  <Etiqueta size={1.8} color={on ? colores.primario : colores.humo}>
                    {String(i + 1).padStart(2, "0")}
                  </Etiqueta>
                  <Voz size={3} align="left">
                    {texto}
                  </Voz>
                </div>
              );
            })}
          </div>
        </div>
        {telefono}
      </AbsoluteFill>
    </Fondo>
  );
};
