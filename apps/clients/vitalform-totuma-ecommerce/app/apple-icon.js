import { ImageResponse } from "next/og";

const PRIMARY = "#2d5a2d";
const BG = "#0f1419";

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
          background: BG,
        }}
      >
        <span
          style={{
            fontSize: 100,
            fontWeight: 700,
            color: PRIMARY,
            fontFamily: "system-ui, sans-serif",
            lineHeight: 1,
            letterSpacing: "-0.02em",
          }}
        >
          V
        </span>
      </div>
    ),
    { ...size }
  );
}
