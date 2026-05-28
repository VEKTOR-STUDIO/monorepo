import { ImageResponse } from "next/og";

const GOLD = "#D4AF37";
const BLACK = "#0A0A0A";
const WHITE = "#F5F1E8";

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
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: BLACK,
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: 12,
            background: GOLD,
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "100%",
            height: 12,
            background: GOLD,
          }}
        />
        <span
          style={{
            fontSize: 220,
            fontWeight: 900,
            color: WHITE,
            fontFamily: "Arial, sans-serif",
            lineHeight: 1,
            letterSpacing: "-0.03em",
          }}
        >
          LEGIÓN
        </span>
        <span
          style={{
            fontSize: 64,
            fontWeight: 900,
            color: GOLD,
            fontFamily: "Arial, sans-serif",
            letterSpacing: "0.2em",
            marginTop: 8,
          }}
        >
          MMA · VENEZUELA
        </span>
      </div>
    ),
    { ...size }
  );
}
