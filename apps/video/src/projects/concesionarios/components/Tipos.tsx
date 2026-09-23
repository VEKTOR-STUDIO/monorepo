import React, { createContext, useContext } from "react";
import { useStage } from "../../../lib/layout";
import { FAMILIAS } from "../fonts";
import type { Marca } from "../types";

const MarcaContext = createContext<Marca | null>(null);

/** Toda escena lee la marca de aquí: así ninguna la recibe por props. */
export const MarcaProvider: React.FC<{ marca: Marca; children: React.ReactNode }> = ({
  marca,
  children,
}) => <MarcaContext.Provider value={marca}>{children}</MarcaContext.Provider>;

export const useMarca = (): Marca => {
  const marca = useContext(MarcaContext);
  if (!marca) throw new Error("useMarca() fuera de <MarcaProvider>");
  return marca;
};

type TextProps = {
  children: React.ReactNode;
  /** En unidades de escenario (1u = 1% del lado corto). */
  size?: number;
  color?: string;
  align?: React.CSSProperties["textAlign"];
  style?: React.CSSProperties;
};

/** Titular en la tipografía de la web del cliente, con su peso y su cursiva. */
export const Titular: React.FC<TextProps & { mayusculas?: boolean }> = ({
  children,
  size = 9,
  color,
  align = "center",
  mayusculas = true,
  style,
}) => {
  const { u } = useStage();
  const { display, colores } = useMarca();

  return (
    <div
      style={{
        fontFamily: `"${display.family}", sans-serif`,
        fontWeight: display.weight,
        fontStyle: display.italic ? "italic" : "normal",
        letterSpacing: display.tracking,
        textTransform: mayusculas ? "uppercase" : "none",
        lineHeight: 0.98,
        fontSize: size * u,
        color: color ?? colores.tinta,
        textAlign: align,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/** La voz del video: Questrial, en todas las marcas. */
export const Voz: React.FC<TextProps & { dim?: boolean }> = ({
  children,
  size = 3,
  color,
  align = "center",
  dim = false,
  style,
}) => {
  const { u } = useStage();
  const { colores } = useMarca();

  return (
    <div
      style={{
        fontFamily: `"${FAMILIAS.questrial}", sans-serif`,
        fontSize: size * u,
        lineHeight: 1.3,
        color: color ?? (dim ? colores.humo : colores.tinta),
        textAlign: align,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/** Etiqueta en Microgramma, muy espaciada: la letra de Vektor. */
export const Etiqueta: React.FC<TextProps> = ({
  children,
  size = 1.7,
  color,
  align = "center",
  style,
}) => {
  const { u } = useStage();
  const { colores } = useMarca();

  return (
    <div
      style={{
        fontFamily: `"${FAMILIAS.microgramma}", sans-serif`,
        textTransform: "uppercase",
        letterSpacing: "0.22em",
        fontSize: size * u,
        lineHeight: 1.2,
        color: color ?? colores.primario,
        textAlign: align,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/** Precio como lo escriben en Venezuela: punto de miles, sin decimales. */
export const dolares = (n: number) => `$${n.toLocaleString("de-DE")}`;

/**
 * Tamaño de titular (en u) que hace caber la palabra más larga en la columna.
 * `ancho` es lo que mide la columna en u: en 9:16 la columna va escalada
 * (ver `Columna`), así que cabe menos de lo que parece.
 */
export const tamParaCaber = (texto: string | string[], tope: number, vertical: boolean, porLinea = false) => {
  const lineas = Array.isArray(texto) ? texto : [texto];
  const trozos = porLinea ? lineas : lineas.flatMap((l) => l.split(/\s+/));
  const largo = Math.max(...trozos.map((t) => t.length));
  const ancho = vertical ? 64 : 120;
  return Math.min(tope, ancho / (largo * 0.68));
};

/**
 * Tamaño (en u) de una etiqueta en Microgramma para que quepa en una línea.
 * Microgramma es extendida: cada carácter mide casi un em, más el espaciado.
 * Hace falta para los dominios de Vercel, que van de 17 a 33 caracteres.
 */
export const tamEtiqueta = (texto: string, tope: number, anchoU: number, espaciado = 0.22) =>
  Math.min(tope, anchoU / (texto.length * (0.92 + espaciado)));
