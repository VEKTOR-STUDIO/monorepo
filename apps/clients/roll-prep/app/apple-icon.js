import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// La misma R del favicon (app/icon.svg), pero sobre el cuadro completo: iOS
// le pone sus propias esquinas redondeadas y el corte en diagonal quedaría
// como un triángulo transparente.
const MARK = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="180" height="180"><rect width="64" height="64" fill="#d4ff00"/><g fill="#0f0f12"><path d="M14 10h12v44H14z"/><path d="M26 10h20v22H26v-8h10v-6H26z"/><path d="M28 32h11l11 22H39z"/></g></svg>`;

// Se rasteriza en el build: no hace falta guardar un PNG en el repo.
export default function AppleIcon() {
  return new ImageResponse(
    (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        alt=""
        width={size.width}
        height={size.height}
        src={`data:image/svg+xml;base64,${Buffer.from(MARK).toString("base64")}`}
      />
    ),
    size
  );
}
