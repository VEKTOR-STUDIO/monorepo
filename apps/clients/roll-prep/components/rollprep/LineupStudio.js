"use client";

import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { BELTS, RANKS } from "@/libs/gamification";
import {
  INVITE_FORMATS,
  LINEUP_LIMITS,
  LINEUP_SIZE,
  lineupCaption,
  lineupImageFilename,
} from "@/libs/invites";

const EMPTY = Array.from({ length: LINEUP_SIZE }, () => ({
  name: "",
  academy: "",
  rank: "",
}));

async function copy(text, message) {
  try {
    await navigator.clipboard.writeText(text);
    toast.success(message);
  } catch {
    toast.error("El navegador no dejó copiar. Selecciónalo a mano.");
  }
}

/**
 * Estudio de la story de lineup: 4 peleadores a mano, se genera al momento
 * y se baja. La imagen la dibuja el servidor con los datos de la invitación
 * (título, fecha, sede, ruleset) más lo que se escriba aquí.
 */
export default function LineupStudio({ invite, academies = [] }) {
  const spec = INVITE_FORMATS.story;
  const [fighters, setFighters] = useState(EMPTY);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [stale, setStale] = useState(false);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const ready = fighters.every((fighter) => fighter.name.trim());
  const filename = lineupImageFilename(invite.slug);

  const caption = useMemo(
    () => lineupCaption(invite, fighters),
    [invite, fighters]
  );

  const update = (index, field, value) => {
    setFighters((prev) =>
      prev.map((fighter, i) =>
        i === index ? { ...fighter, [field]: value } : fighter
      )
    );
    setStale(Boolean(previewUrl));
  };

  const generate = async () => {
    if (!ready) {
      toast.error("Escribe los 4 nombres.");
      return;
    }

    setPending(true);
    try {
      const response = await fetch(
        `/api/invitaciones/${invite.slug}/lineup`,
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ fighters }),
        }
      );

      if (!response.ok) {
        const message = await response.text();
        toast.error(message || "No se pudo generar la story.");
        return;
      }

      const blob = await response.blob();
      const next = URL.createObjectURL(blob);
      setPreviewUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return next;
      });
      setStale(false);
      toast.success("Story lista");
    } catch {
      toast.error("No se pudo generar la story.");
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {fighters.map((fighter, index) => (
          <div
            key={index}
            className="grid grid-cols-[2.5rem_1fr] items-start gap-3 border border-base-300 bg-base-100 p-3"
          >
            <span
              className={`display text-3xl leading-none ${
                index % 2 === 0 ? "text-primary" : "text-accent"
              }`}
            >
              {String(index + 1).padStart(2, "0")}
            </span>
            <div className="grid gap-2">
              <label className="block">
                <span className="mb-1 block text-[0.6rem] font-black uppercase tracking-widest opacity-60">
                  Peleador
                </span>
                <input
                  value={fighter.name}
                  maxLength={LINEUP_LIMITS.name}
                  onChange={(e) => update(index, "name", e.target.value)}
                  placeholder="Nombre"
                  className="input input-bordered input-sm w-full"
                />
              </label>
              <div className="grid gap-2 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1 block text-[0.6rem] font-black uppercase tracking-widest opacity-60">
                    Academia
                  </span>
                  <input
                    value={fighter.academy}
                    maxLength={LINEUP_LIMITS.academy}
                    onChange={(e) => update(index, "academy", e.target.value)}
                    placeholder="A mano"
                    list="lineup-academies"
                    className="input input-bordered input-sm w-full"
                  />
                </label>
                <label className="block">
                  <span className="mb-1 block text-[0.6rem] font-black uppercase tracking-widest opacity-60">
                    Cinturón
                  </span>
                  <select
                    value={fighter.rank}
                    onChange={(e) => update(index, "rank", e.target.value)}
                    className="select select-bordered select-sm w-full"
                  >
                    <option value="">Sin grado</option>
                    {BELTS.map((belt) => (
                      <optgroup key={belt.key} label={belt.name}>
                        {RANKS.filter((rank) => rank.beltKey === belt.key).map(
                          (rank) => (
                            <option key={rank.key} value={rank.key}>
                              {rank.short}
                            </option>
                          )
                        )}
                      </optgroup>
                    ))}
                  </select>
                </label>
              </div>
            </div>
          </div>
        ))}
        {academies.length > 0 && (
          <datalist id="lineup-academies">
            {academies.map((academy) => (
              <option key={academy} value={academy} />
            ))}
          </datalist>
        )}
      </div>

      <button
        type="button"
        onClick={generate}
        disabled={pending || !ready}
        className="btn btn-accent btn-block"
      >
        {pending && <span className="loading loading-spinner loading-xs" />}
        {previewUrl && !stale ? "Volver a generar" : "Generar story"}
      </button>

      <div className="flex justify-center border border-base-300 bg-base-100 p-4">
        <div
          className="relative w-full max-w-[280px] bg-base-300"
          style={{ aspectRatio: `${spec.width} / ${spec.height}` }}
        >
          {pending && (
            <span className="absolute inset-0 z-10 flex items-center justify-center">
              <span className="loading loading-spinner text-accent" />
            </span>
          )}
          {!previewUrl && !pending && (
            <span className="absolute inset-0 flex items-center justify-center p-6 text-center text-[0.65rem] font-semibold uppercase tracking-widest opacity-50">
              Escribe los 4 y genera. Sale en {spec.width}×{spec.height}.
            </span>
          )}
          {previewUrl && (
            // El PNG lo acaba de devolver la API: hay que ver el archivo.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={previewUrl}
              alt={`Lineup de ${invite.title}`}
              width={spec.width}
              height={spec.height}
              className={`h-full w-full object-contain transition-opacity ${
                pending || stale ? "opacity-40" : "opacity-100"
              }`}
            />
          )}
        </div>
      </div>

      {stale && previewUrl && (
        <p className="text-center text-[0.65rem] font-semibold uppercase tracking-widest text-accent">
          Cambiaste un dato. Vuelve a generar para actualizar la imagen.
        </p>
      )}

      <a
        href={previewUrl ?? undefined}
        download={filename}
        onClick={(event) => {
          if (!previewUrl || stale) {
            event.preventDefault();
            toast.error(
              stale
                ? "Vuelve a generar antes de bajar."
                : "Primero genera la story."
            );
          }
        }}
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
        Descargar story ({spec.width}×{spec.height})
      </a>

      <button
        type="button"
        onClick={() => copy(caption, "Caption copiado")}
        className="btn btn-outline btn-sm btn-block"
        disabled={!ready}
      >
        Copiar caption
      </button>

      <p className="text-[0.65rem] font-medium leading-relaxed opacity-50">
        Los nombres no se guardan: se dibujan y se bajan. El evento (título,
        fecha, sede) sale de esta invitación.
      </p>
    </div>
  );
}
