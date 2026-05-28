import { ImageResponse } from "next/og";

const GOLD = "#D4AF37";
const BLACK = "#0A0A0A";

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
          borderBottom: `10px solid ${GOLD}`,
        }}
      >
        <span
          style={{
            fontSize: 120,
            fontWeight: 900,
            color: GOLD,
            fontFamily: "Arial, sans-serif",
            lineHeight: 1,
            letterSpacing: "-0.04em",
          }}
        >
          L
        </span>
      </div>
    ),
    { ...size }
  );
}
