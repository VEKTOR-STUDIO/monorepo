import Link from "next/link";
import CaosMark from "@/components/rollprep/CaosMark";
import JoinCta from "@/components/rollprep/JoinCta";
import config from "@/config";
import { getSEOTags } from "@/libs/seo";
import { createPublicClient } from "@/libs/supabase/public";
import { EVENT_TYPES, OUTFITS, CAOS_STEPS } from "@/libs/caos";
import {
  inviteDateParts,
  invitePath,
  isPastInvite,
} from "@/libs/invites";

// La cartelera pública de eventos CAOS. Es la dirección corta que va impresa
// en el flyer (rollprep.../caos): quien la teclee tiene que caer en algo, no
// en un 404. Abre sin cuenta, como la página de cada evento.
export const revalidate = 300;

export const metadata = getSEOTags({
  title: `Torneos CAOS · ${config.appName}`,
  description:
    "Cartelera de los torneos CAOS: cada pelea se rolea, con terreno aleatorio y cartas de duelo. Fechas, sedes y cómo anotarte.",
  canonicalUrlRelative: "/caos",
});

export default async function CarteleraCaos() {
  const supabase = createPublicClient();

  const { data } = supabase
    ? await supabase
        .from("caos_invites_public")
        .select("slug, title, tagline, starts_at, location, outfit, event_type")
        .order("starts_at", { ascending: false })
    : { data: [] };

  const invites = data ?? [];
  const upcoming = invites.filter((invite) => !isPastInvite(invite.starts_at));
  const past = invites.filter((invite) => isPastInvite(invite.starts_at));

  const Card = ({ invite, dim }) => {
    const date = inviteDateParts(invite.starts_at);

    return (
      <Link
        href={invitePath(invite.slug)}
        className={`menu-tile flex items-center gap-4 p-5 ${dim ? "opacity-60" : ""}`}
      >
        <div className="flex w-14 shrink-0 flex-col items-center border-l-2 border-primary py-1 leading-none">
          <span className="display text-3xl text-primary">{date?.day}</span>
          <span className="text-[0.6rem] font-black uppercase tracking-widest opacity-60">
            {date?.month}
          </span>
        </div>

        <div className="min-w-0 flex-1">
          <p className="display text-xl">{invite.title}</p>
          <p className="mt-1 truncate text-xs font-medium opacity-60">
            {date?.short}
            {invite.location ? ` · ${invite.location}` : ""} ·{" "}
            {OUTFITS[invite.outfit]?.short} {EVENT_TYPES[invite.event_type]?.short}
          </p>
        </div>

        <span className="tile-cta shrink-0 text-primary">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            className="h-4 w-4"
          >
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </span>
      </Link>
    );
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-base-100 p-4 text-base-content md:p-8">
      <CaosMark
        watermark
        className="pointer-events-none fixed -right-16 top-20 w-[20rem] select-none opacity-[0.16] md:w-[30rem]"
      />

      <section className="relative z-10 mx-auto max-w-2xl space-y-8 py-8">
        <div className="rise rise-1 flex items-end gap-4">
          <CaosMark className="h-20 w-auto shrink-0" />
          <div>
            <h1 className="display text-5xl md:text-6xl">
              CAOS<span className="text-primary">.</span>
            </h1>
            <p className="mt-1 text-sm font-medium opacity-70">
              Torneos donde las reglas cambian en cada pelea.
            </p>
            <p className="mt-3 max-w-lg text-sm font-medium leading-relaxed opacity-60">
              Cada combate saca un terreno (la regla de arena) y un arranque
              distinto para cada uno. Remontar desde abajo paga el doble.
              El ranking CAOS mide récord de peleas, no cinturón.
            </p>
          </div>
        </div>

        <div className="rise rise-2 border-2 border-base-300 bg-base-200 p-6">
          <ol className="space-y-3">
            {CAOS_STEPS.map(({ n, short }) => (
              <li key={n} className="flex gap-3 text-sm font-medium">
                <span className="display shrink-0 text-lg text-primary">{n}</span>
                <span>{short}</span>
              </li>
            ))}
          </ol>

          {/* Los pasos son el resumen; el manual es el reglamento completo y
              abre sin cuenta, que es lo que pide el que todavía no se anota. */}
          <Link
            href="/caos/manual"
            className="mt-5 inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary hover:underline"
          >
            Leer el manual completo
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

        <div className="rise rise-3 space-y-3">
          <h2 className="display text-2xl">
            Por venir<span className="text-primary">.</span>
          </h2>
          {upcoming.map((invite) => (
            <Card key={invite.slug} invite={invite} />
          ))}
          {!upcoming.length && (
            <p className="border border-base-300 bg-base-200 p-6 text-sm opacity-60">
              No hay eventos convocados ahora mismo. El próximo se anuncia por
              aquí y por Instagram.
            </p>
          )}
        </div>

        {past.length > 0 && (
          <div className="rise rise-4 space-y-3">
            <h2 className="display text-2xl">
              Ya se pelearon<span className="text-primary">.</span>
            </h2>
            {past.slice(0, 8).map((invite) => (
              <Card key={invite.slug} invite={invite} dim />
            ))}
          </div>
        )}

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
          {/* Esta cartelera la comparte el gym por WhatsApp, así que la abre
              tanto el de afuera como el alumno: al que ya tiene sesión este
              botón lo devuelve a sus torneos sin pasar por el login. */}
          <div className="mt-4">
            <JoinCta
              next="/dashboard/torneos"
              signedInChildren="Ir a mis torneos"
              extraStyle="btn-primary"
            >
              Entrar a {config.appName}
            </JoinCta>
          </div>
        </div>
      </section>
    </main>
  );
}
