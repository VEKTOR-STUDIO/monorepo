import React from "react";
import { useCurrentFrame } from "remotion";
import { flyIn, riseIn } from "../../../../../lib/anim";
import { useStage } from "../../../../../lib/layout";
import { Chip } from "../../../components/CaosCard";
import { FighterSlate, stripeFor } from "../../../components/FighterSlate";
import { HazardBar, SpeedLines } from "../../../components/Fx";
import { SceneShell } from "../../../components/SceneShell";
import { Display, Kicker, SkewTag } from "../../../components/Type";
import { belts, colors } from "../../../theme";
import { DATE_TAG, EPISODE, FIGHTERS } from "../content";

/** Cada chapa entra tres frames después de la anterior. */
const STAGGER = 5;

/**
 * 06 · La cartelera.
 *
 * Los cuatro juntos, en el orden en que se presentaron y entrando desde el
 * mismo lado por el que entraron solos. Es la foto que se queda: si alguien
 * pausa la story, esto es lo único que necesita leer.
 */
export const Cartelera: React.FC = () => {
  const frame = useCurrentFrame();
  const { u, vertical } = useStage();

  // El grupo se dimensiona por cuántos son: cuatro caben grandes, seis no.
  const size = vertical ? 4.6 : 4;

  // Lo que comparten los cuatro es el titular del pie: en este episodio, mismo
  // cinturón y misma academia. Si algún episodio mezcla rangos o gyms, el dato
  // que dejó de ser común desaparece del pie en vez de convertirse en mentira.
  const shared = <T,>(pick: (fighter: (typeof FIGHTERS)[number]) => T): T | null => {
    const first = pick(FIGHTERS[0]);
    return FIGHTERS.every((fighter) => pick(fighter) === first) ? first : null;
  };

  const sharedBelt = shared((fighter) => fighter.belt);
  const sharedAcademy = shared((fighter) => fighter.academy);

  const footer = [
    sharedBelt || sharedAcademy ? `Los ${FIGHTERS.length}` : `${FIGHTERS.length} en el tatami`,
    sharedBelt ? `Cinturón ${belts[sharedBelt].label}` : null,
    sharedAcademy,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <SceneShell
      gap={2.2}
      behind={<SpeedLines opacity={0.07} speed={1} />}
    >
      <Kicker style={riseIn(frame, { delay: 2, duration: 12 })}>El lineup</Kicker>

      <Display size={vertical ? 8.6 : 9} style={riseIn(frame, { delay: 5, duration: 14 })}>
        Los cuatro
      </Display>

      <div style={{ ...riseIn(frame, { delay: 9, duration: 12 }), display: "flex", gap: u * 0.9 }}>
        <SkewTag size={2}>{DATE_TAG}</SkewTag>
        <SkewTag size={2} bg={colors.base300} fg={colors.baseContent}>
          Episodio {EPISODE.numeral}
        </SkewTag>
      </div>

      <HazardBar
        color={colors.primary}
        height={0.5}
        style={{ ...riseIn(frame, { delay: 12, duration: 10 }), marginTop: u * 0.6 }}
      />

      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: u * 1.1,
        }}
      >
        {FIGHTERS.map((fighter, index) => (
          <FighterSlate
            key={fighter.slot}
            slot={fighter.slot}
            name={fighter.name}
            belt={fighter.belt}
            academy={fighter.academy}
            stripe={stripeFor(index)}
            size={size}
            style={flyIn(frame, index % 2 === 0 ? "left" : "right", {
              delay: 16 + index * STAGGER,
              duration: 16,
            })}
          />
        ))}
      </div>

      <div style={{ ...riseIn(frame, { delay: 16 + FIGHTERS.length * STAGGER + 10, duration: 16 }) }}>
        <Chip color={sharedBelt ? belts[sharedBelt].color : colors.primary} size={2}>
          {footer}
        </Chip>
      </div>
    </SceneShell>
  );
};
