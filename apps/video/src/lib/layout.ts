import { useVideoConfig } from "remotion";

export type Stage = {
  width: number;
  height: number;
  /** 1% del lado corto. La unidad con la que se dimensiona TODO. */
  u: number;
  /** true en 9:16, false en 16:9. */
  vertical: boolean;
  /** Ancho de la columna de contenido, con aire a los lados. */
  content: number;
};

/**
 * Escala tipográfica compartida entre formatos.
 *
 * El truco: medir en porcentaje del **lado corto**, no del ancho. Un 1080×1920
 * y un 1920×1080 tienen el mismo lado corto, así que un titular de `9 * u` se
 * ve exactamente del mismo tamaño físico en los dos. Lo único que cambia entre
 * formatos es cuánto sitio hay en el eje largo — de eso se encarga cada escena
 * apilando o poniendo en fila según `vertical`.
 */
export const useStage = (): Stage => {
  const { width, height } = useVideoConfig();
  const u = Math.min(width, height) / 100;

  return {
    width,
    height,
    u,
    vertical: height >= width,
    // En vertical manda el ancho de pantalla; en horizontal, un tope duro para
    // que las líneas de texto no se vuelvan ilegibles de tan largas.
    content: Math.min(width * 0.88, 138 * u),
  };
};
