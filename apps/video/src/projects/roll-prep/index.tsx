import React from "react";
import { Composition } from "remotion";
import { defineProject } from "../../lib/project";
import { ModoCaos } from "./videos/modo-caos/ModoCaos";
import { FPS, TOTAL } from "./videos/modo-caos/timeline";

// Carga las tipografías de marca en cuanto se monta el proyecto.
import "./fonts";

/**
 * Las composiciones de RollPrep.
 *
 * Cada video se registra en los dos formatos que usa el gym: vertical para
 * historias y reels —que es donde vive el contenido del CAOS— y horizontal para
 * proyectarlo en la clase o subirlo a YouTube. Las escenas son las mismas: se
 * dimensionan en porcentaje del lado corto, así que el mismo componente sirve
 * para los dos encuadres sin duplicar nada.
 */
const Compositions: React.FC = () => (
  <>
    <Composition
      id="caos-vertical"
      component={ModoCaos}
      durationInFrames={TOTAL}
      fps={FPS}
      width={1080}
      height={1920}
    />

    <Composition
      id="caos-wide"
      component={ModoCaos}
      durationInFrames={TOTAL}
      fps={FPS}
      width={1920}
      height={1080}
    />
  </>
);

export const rollPrep = defineProject({
  id: "roll-prep",
  folder: "RollPrep",
  description:
    "Videos del LMS de jiu-jitsu: modos de juego, ceremonia de roleo y cartelera de torneos.",
  Compositions,
});
