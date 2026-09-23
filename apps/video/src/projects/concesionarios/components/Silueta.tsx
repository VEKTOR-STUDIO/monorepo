import React from "react";
import type { Tipo } from "../types";

/**
 * Siluetas de perfil para las unidades sin foto, portadas de
 * `apps/clients/dealernautacars/components/Silueta.js` (carros y camiones) y
 * `apps/clients/aprovechalo-ve/components/Silueta.js` (la moto). Son formas
 * genéricas, no el contorno de ningún modelo: es lo mismo que enseña la demo
 * mientras el cliente no sube sus fotos.
 */
const Rueda: React.FC<{ cx: number; cy: number; r: number }> = ({ cx, cy, r }) => (
  <g>
    <circle cx={cx} cy={cy} r={r} fill="#0b0b0b" opacity="0.88" />
    <circle cx={cx} cy={cy} r={r * 0.52} fill="currentColor" opacity="0.7" />
    <circle cx={cx} cy={cy} r={r * 0.2} fill="#0b0b0b" opacity="0.5" />
  </g>
);

const Cristal: React.FC<{ d: string }> = ({ d }) => <path d={d} fill="#0b0b0b" opacity="0.42" />;

const DIBUJOS: Record<Tipo, React.ReactNode> = {
  suv: (
    <>
      <path
        d="M20 100 L26 74 C29 64 37 58 48 56 L104 50 L136 22 C143 16 152 13 163 13 L268 13 C281 13 291 17 297 26 L318 54 L356 62 C374 66 384 76 385 88 L386 100 Z"
        fill="currentColor"
        opacity="0.86"
      />
      <Cristal d="M142 48 L166 24 C170 21 175 19 181 19 L262 19 C270 19 276 22 280 28 L294 48 Z" />
      <Rueda cx={104} cy={100} r={29} />
      <Rueda cx={304} cy={100} r={29} />
    </>
  ),
  sedan: (
    <>
      <path
        d="M18 104 L28 82 C32 73 40 68 51 66 L112 60 L146 32 C153 26 162 23 173 23 L238 23 C251 23 262 27 269 36 L292 64 L350 72 C369 75 381 85 383 97 L384 104 Z"
        fill="currentColor"
        opacity="0.86"
      />
      <Cristal d="M152 58 L176 34 C180 31 185 29 191 29 L232 29 C240 29 246 32 250 38 L266 58 Z" />
      <Rueda cx={106} cy={104} r={25} />
      <Rueda cx={300} cy={104} r={25} />
    </>
  ),
  pickup: (
    <>
      <path
        d="M16 100 L22 76 C25 66 33 60 44 58 L96 52 L128 22 C135 16 144 13 155 13 L214 13 C227 13 237 18 243 27 L262 56 L266 58 L266 44 L388 44 L388 100 Z"
        fill="currentColor"
        opacity="0.86"
      />
      <Cristal d="M134 48 L158 24 C162 21 167 19 173 19 L210 19 C218 19 224 22 228 28 L242 48 Z" />
      <path d="M268 50 L386 50 L386 58 L268 58 Z" fill="#000000" opacity="0.28" />
      <Rueda cx={98} cy={100} r={27} />
      <Rueda cx={320} cy={100} r={27} />
    </>
  ),
  camion: (
    <>
      <path d="M140 12 L392 12 L392 94 L140 94 Z" fill="currentColor" opacity="0.9" />
      <path d="M140 12 L392 12 L392 24 L140 24 Z" fill="#000000" opacity="0.16" />
      <path
        d="M14 94 L14 54 C14 44 20 36 32 33 L52 28 L68 14 C73 10 80 8 88 8 L128 8 C134 8 138 12 138 18 L138 94 Z"
        fill="currentColor"
        opacity="0.86"
      />
      <Cristal d="M62 30 L76 16 C79 13 83 12 88 12 L124 12 C128 12 130 14 130 18 L130 34 L64 34 Z" />
      <Rueda cx={62} cy={94} r={24} />
      <Rueda cx={296} cy={94} r={24} />
      <Rueda cx={348} cy={94} r={24} />
    </>
  ),
  furgon: (
    <>
      <path
        d="M16 98 L16 46 C16 36 22 28 34 25 L60 12 C66 9 73 8 81 8 L352 8 C374 8 386 18 386 38 L386 98 Z"
        fill="currentColor"
        opacity="0.88"
      />
      <Cristal d="M42 40 L66 18 C70 15 75 14 81 14 L126 14 L126 40 Z" />
      <path d="M146 14 L146 98" stroke="#000000" strokeWidth="3" opacity="0.2" />
      <Rueda cx={86} cy={98} r={26} />
      <Rueda cx={316} cy={98} r={26} />
    </>
  ),
  moto: (
    <>
      <path
        d="M120 96 L148 58 C152 52 158 49 166 49 L214 49 C222 49 228 52 232 58 L238 68 L272 68 C280 68 285 63 285 56 L285 46 C285 42 288 39 292 39 L306 39 C310 39 313 42 313 46 C313 50 310 53 306 53 L297 53 L297 60 C297 74 288 82 274 82 L250 82 L262 96 Z"
        fill="currentColor"
        opacity="0.88"
      />
      <rect x="282" y="52" width="7" height="46" rx="3" fill="currentColor" opacity="0.8" transform="rotate(14 285 75)" />
      <Rueda cx={112} cy={98} r={32} />
      <Rueda cx={296} cy={98} r={32} />
    </>
  ),
};

export const Silueta: React.FC<{ tipo: Tipo; color: string; style?: React.CSSProperties }> = ({
  tipo,
  color,
  style,
}) => (
  <svg viewBox="0 0 400 140" preserveAspectRatio="xMidYMid meet" style={{ color, ...style }}>
    {DIBUJOS[tipo]}
  </svg>
);
