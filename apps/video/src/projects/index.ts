import type { VideoProject } from "../lib/project";
import { rollPrep } from "./roll-prep";

/**
 * El índice del estudio. Cada entrada se vuelve una carpeta en la barra lateral
 * de `pnpm dev`. El orden de este arreglo es el orden en que salen.
 */
export const projects: VideoProject[] = [rollPrep];
