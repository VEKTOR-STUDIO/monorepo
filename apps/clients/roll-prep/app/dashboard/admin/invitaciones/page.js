import Link from "next/link";
import AdminInviteForm from "@/components/rollprep/AdminInviteForm";
import CaosMark from "@/components/rollprep/CaosMark";
import { createClient } from "@/libs/supabase/server";
import { EVENT_TYPES, OUTFITS } from "@/libs/caos";
import {
  CAOS_INVITES_MIGRATION,
  inviteDateParts,
  isMissingInvites,
  isPastInvite,
} from "@/libs/invites";

export const dynamic = "force-dynamic";

// Invitaciones CAOS: la convocatoria de los eventos. Desde aquí el profesor
// crea el anuncio, baja el flyer para las stories y (cuando Resend esté
// configurado) lo manda por correo. Solo admin: lo garantiza el layout.
export default async function AdminInvitaciones() {
  const supabase = await createClient();

  const { data: invites, error } = await supabase
    .from("caos_invites")
    .select(
      "id, slug, title, tagline, starts_at, location, outfit, event_type, is_public, sent_at"
    )
    .order("starts_at", { ascending: false });

  const missingMigration = isMissingInvites(error);
  const list = invites ?? [];
  const upcoming = list.filter((invite) => !isPastInvite(invite.starts_at));

  return (
    <main className="min-h-screen bg-base-100 p-4 text-base-content md:p-8">
      <section className="mx-auto max-w-3xl space-y-8">
        <div className="rise rise-1 flex items-center justify-between">
          <Link
            href="/dashboard/admin"
            className="tile-cta text-[0.65rem] font-black uppercase tracking-[0.2em] opacity-60 hover:text-primary hover:opacity-100"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              className="h-3 w-3 rotate-180"
            >
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
            Panel
          </Link>
          <span className="tag-skew bg-primary px-3 py-1 text-xs text-primary-content">
            <span>Coach mode</span>
          </span>
        </div>

        <div className="rise rise-1 flex items-end gap-4">
          <CaosMark className="h-16 w-auto shrink-0" />
          <div>
            <h1 className="display text-5xl">
              Invitaciones<span className="text-primary">.</span>
            </h1>
            <p className="mt-1 text-sm font-medium opacity-70">
              Convoca un torneo CAOS: se arma el flyer para las stories, la
              página del evento y el correo. En la ficha de cada una también
              puedes generar la story de 4 peleadores.
            </p>
          </div>
        </div>

        {missingMigration && (
          <div className="rise rise-2 clip-cut border-2 border-error bg-error/10 p-5">
            <p className="text-[0.65rem] font-black uppercase tracking-[0.3em] text-error">
              Falta una migración
            </p>
            <p className="mt-2 text-sm font-semibold">
              Corre{" "}
              <code className="bg-base-300 px-1">{CAOS_INVITES_MIGRATION}</code>{" "}
              en el SQL Editor de Supabase. Se puede correr varias veces sin
              problema.
            </p>
          </div>
        )}

        {/* ------------------------------ LISTA --------------------------- */}
        <div className="rise rise-2 border border-base-300 bg-base-200">
          <div className="flex items-center justify-between border-b border-base-300 px-6 py-4">
            <h2 className="display text-xl">Convocatorias</h2>
            <span className="text-[0.65rem] font-black uppercase tracking-[0.2em] opacity-50">
              {upcoming.length} por venir · {list.length} en total
            </span>
          </div>

          <ul className="divide-y divide-base-300">
            {list.map((invite) => {
              const date = inviteDateParts(invite.starts_at);
              const past = isPastInvite(invite.starts_at);

              return (
                <li key={invite.id}>
                  <Link
                    href={`/dashboard/admin/invitaciones/${invite.id}`}
                    className="flex items-center gap-4 px-6 py-4 transition-colors hover:bg-base-300/40"
                  >
                    <div
                      className={`flex w-14 shrink-0 flex-col items-center border-l-2 py-1 ${
                        past ? "border-base-300 opacity-50" : "border-primary"
                      }`}
                    >
                      <span className="display text-3xl leading-none text-primary">
                        {date?.day ?? "—"}
                      </span>
                      <span className="text-[0.6rem] font-black uppercase tracking-widest opacity-60">
                        {date?.month ?? ""}
                      </span>
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold">{invite.title}</p>
                      <p className="mt-0.5 truncate text-xs opacity-60">
                        {date?.short}
                        {invite.location ? ` · ${invite.location}` : ""} ·{" "}
                        {OUTFITS[invite.outfit]?.short}{" "}
                        {EVENT_TYPES[invite.event_type]?.short}
                      </p>
                    </div>

                    <div className="flex shrink-0 flex-col items-end gap-1">
                      <span
                        className={`tag-skew px-2 py-0.5 text-[0.6rem] ${
                          invite.sent_at
                            ? "bg-primary text-primary-content"
                            : "bg-base-300 text-base-content"
                        }`}
                      >
                        <span>{invite.sent_at ? "Enviada" : "Sin enviar"}</span>
                      </span>
                      {!invite.is_public && (
                        <span className="text-[0.55rem] font-black uppercase tracking-widest opacity-50">
                          Link apagado
                        </span>
                      )}
                    </div>
                  </Link>
                </li>
              );
            })}

            {!list.length && !missingMigration && (
              <li className="px-6 py-8 text-center text-sm opacity-60">
                Todavía no has convocado ningún evento.
              </li>
            )}
          </ul>
        </div>

        {/* ------------------------------ NUEVA --------------------------- */}
        <div className="rise rise-3 border border-base-300 bg-base-200">
          <div className="border-b border-base-300 px-6 py-4">
            <h2 className="display text-xl">Nueva invitación</h2>
            <p className="mt-1 text-xs font-medium opacity-60">
              Al crearla vas directo a su ficha: ahí está el flyer, la story
              de 4 peleadores y el envío por correo.
            </p>
          </div>
          <div className="p-6">
            <AdminInviteForm />
          </div>
        </div>
      </section>
    </main>
  );
}
