import type React from "react";

/**
 * Un "proyecto" de video es una carpeta con sus propias composiciones, su marca
 * y sus assets. En el estudio cada uno sale como una carpeta aparte en la barra
 * lateral, así se navega entre clientes sin que se mezclen.
 *
 * Para agregar uno nuevo:
 *   1. `src/projects/<id>/` con un `index.tsx` que exporte un VideoProject.
 *   2. Sus assets en `public/<id>/` (así nunca chocan dos clientes).
 *   3. Una línea en `src/projects/index.ts`.
 */
export type VideoProject = {
  /** Slug del proyecto. Debe coincidir con la carpeta y con `public/<id>/`. */
  id: string;
  /** Nombre de la carpeta en la barra lateral del estudio. Solo [A-Za-z0-9-]. */
  folder: string;
  /** Para qué es este proyecto. Solo documentación. */
  description: string;
  /** Las `<Composition />` del proyecto. Se montan dentro de su `<Folder />`. */
  Compositions: React.FC;
};

export const defineProject = (project: VideoProject): VideoProject => project;
