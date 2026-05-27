import { ImageResponse } from "next/og";
import config from "@/config";

const PRIMARY = "#2d5a2d";
const BG = "#0f1419";

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
          background: BG,
          padding: 48,
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
          V
        </span>
        <span
          style={{
            fontSize: 32,
            color: "oklch(0.75 0 0)",
            marginTop: 16,
            fontFamily: "system-ui, sans-serif",
          }}
        >
          {config.appName} — {config.business?.tagline ?? "Nutrición y mealpreps"}
        </span>
      </div>
    ),
    { ...size }
  );
}
