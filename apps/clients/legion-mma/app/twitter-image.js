import { ImageResponse } from "next/og";

const OCRE = "#C69C6D";
const BLACK = "#1A1A1A";

export const size = { width: 1200, height: 628 };
export const contentType = "image/png";

export default function TwitterImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 628,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: BLACK,
        }}
      >
        <span
          style={{
            fontSize: 280,
            fontWeight: 700,
            color: OCRE,
            fontFamily: "Georgia, serif",
            lineHeight: 1,
            letterSpacing: "-0.02em",
          }}
        >
          F
        </span>
      </div>
    ),
    { ...size }
  );
}
