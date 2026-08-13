"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import {
  DEFAULT_FORMAT,
  INVITE_FORMATS,
  inviteCaption,
  inviteImageFilename,
  inviteImagePath,
  inviteUrl,
} from "@/libs/invites";

async function copy(text, message) {
  try {
    await navigator.clipboard.writeText(text);
    toast.success(message);
  } catch {
    toast.error("El navegador no dejó copiar. Selecciónalo a mano.");
  }
}

/**
 * El estudio del flyer: se ve, se cambia de formato y se baja.
 *
 * La imagen la dibuja el servidor (/api/invitaciones/<slug>/imagen), así que
 * lo que se ve aquí es EXACTAMENTE el archivo que se sube a la story — no una
 * maqueta parecida. `updatedAt` va en la URL para que al guardar un cambio el
 * navegador no siga enseñando el flyer viejo.
 */
export default function InviteStudio({ invite }) {
  const [format, setFormat] = useState(DEFAULT_FORMAT);
  const [loading, setLoading] = useState(true);

  const spec = INVITE_FORMATS[format];
  const src = inviteImagePath(invite.slug, { format, v: invite.updated_at });
  const link = inviteUrl(invite.slug);

  return (
    <div className="space-y-4">
      {/* -------------------------- FORMATO ---------------------------- */}
      <div className="flex gap-2">
        {Object.entries(INVITE_FORMATS).map(([key, value]) => (
          <button
            key={key}
            type="button"
            onClick={() => {
              if (key === format) return;
              setLoading(true);
              setFormat(key);
            }}
            className={`flex-1 border-2 px-3 py-2 text-left transition-colors ${
              key === format
                ? "border-primary bg-primary/10"
                : "border-base-300 hover:border-base-content/30"
            }`}
          >
            <span className="block text-xs font-black uppercase tracking-widest">
              {value.label}{" "}
              <span className="opacity-50">{value.ratio}</span>
            </span>
            <span className="block text-[0.6rem] font-medium opacity-60">
              {value.hint}
            </span>
          </button>
        ))}
      </div>

      {/* -------------------------- PREVIEW ---------------------------- */}
      <div className="flex justify-center border border-base-300 bg-base-100 p-4">
        <div
          className="relative w-full max-w-[300px] bg-base-300"
          style={{ aspectRatio: `${spec.width} / ${spec.height}` }}
        >
          {loading && (
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="loading loading-spinner text-primary" />
            </span>
          )}
          {/* El PNG lo genera una ruta de API con parámetros: next/image no
              lo optimiza mejor, y aquí lo que importa es ver el archivo tal
              cual sale. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            key={src}
            src={src}
            alt={`Flyer ${spec.label} de ${invite.title}`}
            width={spec.width}
            height={spec.height}
            onLoad={() => setLoading(false)}
            onError={() => setLoading(false)}
            className={`h-full w-full object-contain transition-opacity duration-300 ${
              loading ? "opacity-0" : "opacity-100"
            }`}
          />
        </div>
      </div>

      {/* -------------------------- ACCIONES --------------------------- */}
      <a
        href={inviteImagePath(invite.slug, {
          format,
          v: invite.updated_at,
          download: true,
        })}
        download={inviteImageFilename(invite.slug, format)}
        className="btn btn-primary btn-block"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          className="h-4 w-4"
        >
          <path d="M12 4v12m0 0 5-5m-5 5-5-5M4 20h16" />
        </svg>
        Descargar {spec.label} ({spec.width}×{spec.height})
      </a>

      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => copy(link, "Link copiado")}
          className="btn btn-outline btn-sm"
        >
          Copiar link
        </button>
        <button
          type="button"
          onClick={() => copy(inviteCaption(invite), "Texto copiado")}
          className="btn btn-outline btn-sm"
        >
          Copiar caption
        </button>
      </div>

      <p className="text-[0.65rem] font-medium leading-relaxed opacity-50">
        Baja el PNG, súbelo a la story y pega el caption. El link del flyer
        lleva a la página del evento, que abre sin cuenta.
      </p>
    </div>
  );
}
