import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import config from "@/config";

export const alt = "RollPrep — el gym como videojuego";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// La R del favicon, para no repetir el dibujo en tres sitios distintos.
const MARK = `data:image/svg+xml;base64,${Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="140" height="140"><path d="M0 0h64v50L50 64H0Z" fill="#d4ff00"/><g fill="#0f0f12"><path d="M14 10h12v44H14z"/><path d="M26 10h20v22H26v-8h10v-6H26z"/><path d="M28 32h11l11 22H39z"/></g></svg>`
).toString("base64")}`;

// La imagen que se ve al compartir el link (WhatsApp, X, Slack...).
// Se rasteriza en el build: no hay PNG que mantener en el repo.
export default async function OpengraphImage() {
  const microgramma = await readFile(
    join(process.cwd(), "public/fonts/microgramma.otf")
  );

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0f0f12",
          padding: "72px",
          fontFamily: "Microgramma",
          textTransform: "uppercase",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "32px" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={MARK} alt="" width={140} height={140} />
          <div
            style={{
              display: "flex",
              fontSize: 104,
              color: "#d4ff00",
              letterSpacing: "-2px",
            }}
          >
            {config.appName}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div style={{ display: "flex", fontSize: 46, color: "#f5f5f0" }}>
            El gym como videojuego
          </div>
          <div style={{ display: "flex", fontSize: 30, color: "#8a8a85" }}>
            XP · cinturones · topes · CAOS
          </div>
          <div style={{ display: "flex", height: "14px", background: "#d4ff00" }} />
          <div style={{ display: "flex", fontSize: 26, color: "#d4ff00" }}>
            {config.domainName}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Microgramma",
          data: microgramma,
          style: "normal",
          weight: 400,
        },
      ],
    }
  );
}
