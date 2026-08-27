import Link from "next/link";
import { notFound } from "next/navigation";
import CaosMark from "@/components/rollprep/CaosMark";
import JoinCta from "@/components/rollprep/JoinCta";
import config from "@/config";
import { getSEOTags } from "@/libs/seo";
import { createPublicClient } from "@/libs/supabase/public";
import {
  EVENT_TYPES,
  OUTFITS,
  TIER_LABELS,
  CARD_TONE_LABELS,
  CAOS_STEPS,
  caosShowcase,
} from "@/libs/caos";
import { safeUrl } from "@/libs/invite-email";
import {
  DEFAULT_CTA_LABEL,
  INVITE_FORMATS,
  inviteDateParts,
  inviteImageFilename,
  inviteImagePath,
  inviteImageUrl,
  inviteUrl,
  invitePath,
  isPastInvite,
} from "@/libs/invites";

// La página del evento: es a donde apunta el flyer, y la abre gente sin
// cuenta (el amigo, el otro gym, el que vio la story). Se revalida sola: el
// profesor puede corregir la hora sin que nadie tenga que redesplegar.
export const revalidate = 300;

const FIELDS =
  "id, slug, title, tagline, description, starts_at, location, map_url, cta_url, cta_label, outfit, event_type, slots, price, updated_at";

async function getInvite(slug) {
  const supabase = createPublicClient();
  if (!supabase) return null;

  const { data } = await supabase
    .from("caos_invites_public")
    .select(FIELDS)
    .eq("slug", slug)
    .maybeSingle();

  return data ?? null;
}

/**
 * El preview del link (WhatsApp, Instagram, X) es el mismo flyer del feed.
 * Es la mitad del trabajo de que esto se riegue: el link no llega pelado.
 */
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const invite = await getInvite(slug);

  if (!invite) return getSEOTags({ title: `Evento CAOS · ${config.appName}` });

  const date = inviteDateParts(invite.starts_at);
  const title = `${invite.title} · CAOS`;
  const description =
    invite.tagline ||
    (date
      ? `Torneo CAOS · ${date.long}${invite.location ? ` · ${invite.location}` : ""}`
      : "Torneo CAOS: las reglas cambian en cada pelea.");

  const imageUrl = inviteImageUrl(invite.slug, {
    format: "post",
    v: invite.updated_at,
  });

  return {
    ...getSEOTags({
      title,
      description,
      canonicalUrlRelative: invitePath(invite.slug),
      openGraph: { title, description, url: inviteUrl(invite.slug) },
    }),
    openGraph: {
      title,
      description,
      url: inviteUrl(invite.slug),
      siteName: config.appName,
      locale: "es_VE",
      type: "website",
      images: [
        {
          url: imageUrl,
          width: INVITE_FORMATS.post.width,
          height: INVITE_FORMATS.post.height,
          alt: `${invite.title} — invitación CAOS`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

function Dato({ label, children }) {
  return (
    <div className="border border-base-300 bg-base-200 p-4">
      <p className="text-[0.6rem] font-black uppercase tracking-[0.2em] opacity-50">
        {label}
      </p>
      <p className="display mt-1 text-xl">{children}</p>
    </div>
  );
}

export default async function EventoCaos({ params }) {
  const { slug } = await params;
  const invite = await getInvite(slug);

  if (!invite) notFound();

  const date = inviteDateParts(invite.starts_at);
  const past = isPastInvite(invite.starts_at);
  const cta = safeUrl(invite.cta_url);
  const map = safeUrl(invite.map_url);
  const show = caosShowcase(invite.slug, invite.outfit);
  const flyer = inviteImagePath(invite.slug, {
    format: "story",
    v: invite.updated_at,
  });

  return (
    <main className="relative min-h-screen overflow-hidden bg-base-100 text-base-content">
      <CaosMark
        watermark
        className="pointer-events-none fixed -right-16 top-20 w-[20rem] select-none opacity-[0.16] md:w-[30rem]"
      />

      <section className="relative z-10 mx-auto max-w-2xl space-y-10 px-4 py-14 md:py-20">
        {/* ------------------------------ HERO ---------------------------- */}
        <div className="rise rise-1 space-y-5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="tag-skew bg-primary px-3 py-1 text-xs text-primary-content">
              <span>Torneo {EVENT_TYPES[invite.event_type]?.label}</span>
            </span>
            <span className="tag-skew border-2 border-primary px-3 py-1 text-xs text-primary">
              <span>{OUTFITS[invite.outfit]?.label}</span>
            </span>
            {past && (
              <span className="tag-skew bg-base-300 px-3 py-1 text-xs">
                <span>Ya se peleó</span>
              </span>
            )}
          </div>

          <div className="flex items-end gap-4">
            <CaosMark className="h-20 w-auto shrink-0" />
            <span className="display text-6xl text-primary md:text-7xl">
              CAOS
            </span>
          </div>

          <div className="h-2 w-full bg-primary" />

          <h1 className="display text-5xl md:text-6xl">{invite.title}</h1>

          {invite.tagline && (
            <p className="text-lg font-bold text-primary">{invite.tagline}</p>
          )}
        </div>

        {/* ------------------------------ FECHA --------------------------- */}
        <div className="rise rise-2 flex items-center gap-5 bg-primary p-5 text-primary-content">
          <div className="flex flex-col items-center leading-none">
            <span className="display text-6xl">{date?.day}</span>
            <span className="text-xs font-black uppercase tracking-[0.2em]">
              {date?.month}
            </span>
          </div>
          <div className="h-16 w-1 bg-primary-content/70" />
          <div>
            <p className="display text-2xl">
              {date?.weekday} {date?.time}
            </p>
            {invite.location && (
              <p className="text-sm font-bold uppercase tracking-widest opacity-80">
                {invite.location}
              </p>
            )}
          </div>
        </div>

        {/* ------------------------------ DATOS --------------------------- */}
        <div className="rise rise-2 grid gap-3 sm:grid-cols-3">
          <Dato label="Ruleset">{OUTFITS[invite.outfit]?.short}</Dato>
          {invite.slots ? <Dato label="Cupos">{invite.slots}</Dato> : null}
          {invite.price ? <Dato label="Entrada">{invite.price}</Dato> : null}
        </div>

        {/* --------------------------- DESCRIPCIÓN ------------------------ */}
        {invite.description && (
          <div className="rise rise-3 space-y-4 text-base leading-relaxed opacity-90">
            {invite.description
              .split(/\n+/)
              .filter(Boolean)
              .map((line, index) => (
                <p key={index}>{line}</p>
              ))}
          </div>
        )}

        {/* --------------------------- QUÉ ES CAOS -------------------------
            El que llega del flyer viene picado por las cartas: aquí ve las
            mismas dos de su evento, completas, más el tamaño del mazo y las
            probabilidades de cada nivel. Es la misma muestra que usan el
            flyer y el correo (caosShowcase, anclada al slug). */}
        <div className="rise rise-3 space-y-5">
          <div>
            <h2 className="display text-3xl">
              Cómo se pelea<span className="text-primary">.</span>
            </h2>
            <p className="mt-1 text-sm font-medium opacity-60">
              {show.combos} combinaciones posibles: {show.terrainCount} terrenos
              × {show.duelCount} duelos.
            </p>
          </div>

          <ol className="space-y-3">
            {CAOS_STEPS.map(({ n, long }) => (
              <li key={n} className="flex gap-4">
                <span className="display shrink-0 text-2xl text-primary">{n}</span>
                <span className="text-sm font-medium leading-relaxed opacity-90">
                  {long}
                </span>
              </li>
            ))}
          </ol>

          <div className="caos-card caos-card-alfa p-5">
            <p className="text-[0.6rem] font-black uppercase tracking-[0.2em] text-primary">
              Terreno
            </p>
            <p className="display mt-1 text-2xl">{show.terrain.name}</p>
            <p className="mt-2 text-sm leading-relaxed opacity-80">
              {show.terrain.rule}
            </p>
          </div>

          <div className="caos-card caos-card-omega p-5">
            <p className="text-[0.6rem] font-black uppercase tracking-[0.2em] text-accent">
              Un arranque · {TIER_LABELS[show.duel.tier]}
            </p>
            <p className="display mt-1 text-2xl">{show.duel.name}</p>
            <p className="mt-1 text-xs italic opacity-60">{show.duel.start}</p>
            <div className="mt-3 space-y-2 text-sm">
              <p className="flex gap-3">
                <span className="w-24 shrink-0 text-[0.6rem] font-black uppercase tracking-[0.2em] text-primary">
                  {CARD_TONE_LABELS.alfa}
                </span>
                <span className="opacity-85">{show.duel.alfa.rule}</span>
              </p>
              <p className="flex gap-3">
                <span className="w-24 shrink-0 text-[0.6rem] font-black uppercase tracking-[0.2em] text-accent">
                  {CARD_TONE_LABELS.omega}
                </span>
                <span className="opacity-85">{show.duel.omega.rule}</span>
              </p>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {show.tiers.map(({ tier, label, odds }) => (
              <div
                key={tier}
                className={`border p-3 text-center ${
                  tier === 3
                    ? "border-accent bg-accent/15"
                    : "border-base-300 bg-base-200"
                }`}
              >
                <p className="text-[0.55rem] font-black uppercase tracking-widest opacity-60">
                  {label}
                </p>
                <p
                  className={`display mt-1 text-lg ${tier === 3 ? "text-accent" : "text-primary"}`}
                >
                  {odds}
                </p>
              </div>
            ))}
          </div>

          <p className="text-sm font-bold">
            La asimetría no se corrige, se paga: al que le toca la carga se le
            paga el doble por remontarla.
          </p>
        </div>

        {/* ------------------------------- CTA ---------------------------- */}
        <div className="rise rise-4 space-y-3">
          {/* Sin link externo, anotarse es entrar a la app: al que ya tiene
              sesión el botón lo lleva derecho a sus torneos y no al login. */}
          {cta ? (
            <a
              href={cta}
              target="_blank"
              rel="noreferrer"
              className="btn btn-primary btn-lg btn-block"
            >
              {invite.cta_label || DEFAULT_CTA_LABEL}
            </a>
          ) : (
            <JoinCta
              next="/dashboard/torneos"
              extraStyle="btn-primary btn-lg btn-block"
            >
              {invite.cta_label || DEFAULT_CTA_LABEL}
            </JoinCta>
          )}

          <div className="grid gap-3 sm:grid-cols-2">
            {map && (
              <a
                href={map}
                target="_blank"
                rel="noreferrer"
                className="btn btn-outline"
              >
                Cómo llegar
              </a>
            )}
            <a
              href={inviteImagePath(invite.slug, {
                format: "story",
                v: invite.updated_at,
                download: true,
              })}
              download={inviteImageFilename(invite.slug, "story")}
              className={`btn btn-outline ${map ? "" : "sm:col-span-2"}`}
            >
              Descargar el flyer
            </a>
          </div>

          <Link
            href="/caos/manual"
            className="mt-1 flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest text-primary hover:underline"
          >
            Leer el manual del CAOS
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              className="h-3 w-3"
            >
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </Link>
        </div>

        {/* ------------------------------ FLYER --------------------------- */}
        <div className="rise rise-5 flex justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={flyer}
            alt={`Flyer de ${invite.title}`}
            width={INVITE_FORMATS.story.width}
            height={INVITE_FORMATS.story.height}
            className="w-full max-w-xs border border-base-300"
          />
        </div>

        {/* ------------------------------- PIE ---------------------------- */}
        <div className="rise rise-5 border-t border-base-300 pt-6 text-center">
          <p className="text-xs font-medium opacity-60">
            El bracket, los puntos y el ranking CAOS viven en {config.appName}.
          </p>
          <Link
            href="/"
            className="display mt-2 inline-block text-2xl text-primary hover:underline"
          >
            {config.appName}
          </Link>
        </div>
      </section>
    </main>
  );
}
