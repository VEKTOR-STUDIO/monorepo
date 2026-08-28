import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { flyIn, riseIn } from "../../../../../lib/anim";
import { useStage } from "../../../../../lib/layout";
import { FighterSlate, stripeFor } from "../../../components/FighterSlate";
import { BurstRing, FlashCut, SpeedLines } from "../../../components/Fx";
import { SceneShell } from "../../../components/SceneShell";
import { Kicker, Watermark } from "../../../components/Type";
import { colors } from "../../../theme";
import { DATE_TAG, EPISODE, FIGHTERS } from "../content";

/** Frame en el que la chapa clava en el centro. */
const LANDING = 14;

/**
 * 02–05 · Un competidor por escena.
 *
 * Cada uno entra desde su lado y se planta: la chapa es exactamente la misma
 * que después aparece en la cartelera, solo que sola y a tamaño de póster. Ese
 * es el truco de la secuencia — cuando salen los cuatro juntos, el ojo ya
 * reconoce cada fila porque acaba de verla llenar la pantalla.
 *
 * Detrás, el dorsal gigante contorneado. Con cuatro morados en cartelera, el
 * número y el color de cinta son lo único que separa una escena de la otra.
 */
export const Presentacion: React.FC<{ index: number }> = ({ index }) => {
  const frame = useCurrentFrame();
  const { u, vertical } = useStage();

  const fighter = FIGHTERS[index];
  const stripe = stripeFor(index);
  const from = index % 2 === 0 ? "left" : "right";
  const dorsal = String(fighter.slot).padStart(2, "0");

  const quake = interpolate(frame, [LANDING, LANDING + 10], [5, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <SceneShell
      quake={quake}
      gap={2.6}
      behind={
        <>
          <SpeedLines opacity={0.16} color={stripe} speed={1.8} />
          <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
            <Watermark
              size={62}
              opacity={interpolate(frame, [0, 18], [0, 0.14], { extrapolateRight: "clamp" })}
              style={{ transform: `rotate(-8deg) translateY(${-u * 3}px)` }}
            >
              {dorsal}
            </Watermark>
          </AbsoluteFill>
        </>
      }
      over={
        <>
          <FlashCut at={LANDING} duration={5} peak={0.4} />
          <BurstRing at={LANDING} color={stripe} size={34} thickness={0.45} />
        </>
      }
    >
      <Kicker color={stripe} style={riseIn(frame, { delay: 3, duration: 12 })}>
        Competidor {dorsal} de {String(FIGHTERS.length).padStart(2, "0")}
      </Kicker>

      <FighterSlate
        slot={fighter.slot}
        name={fighter.name}
        belt={fighter.belt}
        academy={fighter.academy}
        stripe={stripe}
        size={7.6}
        style={{
          ...flyIn(frame, from, { delay: 6, duration: 16 }),
          // En 16:9 la chapa no se estira de borde a borde: a lo ancho de un
          // 1920 el nombre se quedaría solo en una banda medio vacía.
          width: vertical ? "100%" : "84%",
          boxShadow: `0 0 ${u * 4}px ${-u * 1.2}px ${stripe}`,
        }}
      />

      {/* El cinturón ya lo dice la chapa: aquí abajo va el dato del evento,
          que es lo único que la escena todavía no ha contado. */}
      <Kicker
        size={1.9}
        color={`${colors.baseContent}8c`}
        style={riseIn(frame, { delay: LANDING + 8, duration: 14 })}
      >
        Episodio {EPISODE.numeral} · {DATE_TAG}
      </Kicker>
    </SceneShell>
  );
};
