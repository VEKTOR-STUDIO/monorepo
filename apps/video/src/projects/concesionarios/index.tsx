import React from "react";
import { Composition, Folder } from "remotion";
import { defineProject } from "../../lib/project";
import { MARCAS } from "./marcas";
import { VentaWeb } from "./video/VentaWeb";
import { FPS, TOTAL } from "./video/timeline";

// Carga las tipografías (las de la casa y las de las trece marcas).
import "./fonts";

/**
 * Un video de venta por marca, en los dos formatos: vertical para mandarlo por
 * WhatsApp o subirlo a historias, horizontal para enseñarlo en una reunión.
 * Cada marca tiene su subcarpeta en el estudio.
 */
const Compositions: React.FC = () => (
  <>
    {MARCAS.map((marca) => (
      <Folder key={marca.id} name={marca.id}>
        <Composition
          id={`${marca.id}-vertical`}
          component={VentaWeb}
          defaultProps={{ marcaId: marca.id }}
          durationInFrames={TOTAL}
          fps={FPS}
          width={1080}
          height={1920}
        />
        <Composition
          id={`${marca.id}-wide`}
          component={VentaWeb}
          defaultProps={{ marcaId: marca.id }}
          durationInFrames={TOTAL}
          fps={FPS}
          width={1920}
          height={1080}
        />
      </Folder>
    ))}
  </>
);

export const concesionarios = defineProject({
  id: "concesionarios",
  folder: "Concesionarios",
  description:
    "Videos de venta de 20 s para las demos de carros y concesionarios de apps/clients, cada uno con la identidad de su marca.",
  Compositions,
});
