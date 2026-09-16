import { ImageResponse } from "next/og";
import config from "@/config";

const PRIMARY = config.colors.main;
const DARK = "#000000";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 64,
          height: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: DARK,
        }}
      >
        <span
          style={{
            fontSize: 36,
            fontWeight: 700,
            color: PRIMARY,
            fontFamily: "system-ui, sans-serif",
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
