import { ImageResponse } from "next/og";

const OCRE = "#C69C6D";
const BLACK = "#1A1A1A";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: BLACK,
        }}
      >
        <span
          style={{
            fontSize: 100,
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
