import { ImageResponse } from "next/og";
import config from "@/config";

const PRIMARY = config.colors.main;
const DARK = "#000000";

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
          background: DARK,
          gap: 16,
        }}
      >
        <span
          style={{
            fontSize: 280,
            fontWeight: 700,
            color: PRIMARY,
            fontFamily: "system-ui, sans-serif",
            lineHeight: 1,
            letterSpacing: "-0.02em",
          }}
        >
          F
        </span>
        <span
          style={{
            fontSize: 36,
            color: "rgba(255,255,255,0.85)",
            fontFamily: "system-ui, sans-serif",
          }}
        >
          {config.appName} — Anti-Fragilidad y Entrenamiento de Élite
        </span>
      </div>
    ),
    { ...size }
  );
}
