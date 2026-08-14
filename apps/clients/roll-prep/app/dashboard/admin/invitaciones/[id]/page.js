import Link from "next/link";
import { notFound } from "next/navigation";
import AdminInviteForm from "@/components/rollprep/AdminInviteForm";
import InviteSendPanel from "@/components/rollprep/InviteSendPanel";
import InviteStudio from "@/components/rollprep/InviteStudio";
import LineupStudio from "@/components/rollprep/LineupStudio";
import config from "@/config";
import { createClient } from "@/libs/supabase/server";
import { getAcademies } from "@/libs/academies";
import { EVENT_TYPES, OUTFITS } from "@/libs/caos";
import {
  inviteDateParts,
  invitePath,
  isMissingInvites,
  isPastInvite,
} from "@/libs/invites";

export const dynamic = "force-dynamic";

// Ficha de una invitación: el flyer (preview + descarga), el envío por correo
// con su historial, y el formulario para corregir lo que haga falta.
export default async function InvitacionDetalle({ params }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: invite, error } = await supabase
    .from("caos_invites")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (isMissingInvites(error)) {
    return (
      <main className="min-h-screen bg-base-100 p-4 text-base-content md:p-8">
        <section className="mx-auto max-w-xl">
          <div className="clip-cut border-2 border-error bg-error/10 p-5 text-sm font-semibold">
            Falta correr la migración de invitaciones en Supabase.
          </div>
        </section>
      </main>
    );
  }

  if (!invite) notFound();

  const { data: sends } = await supabase
    .from("caos_invite_sends")
    .select("email, status, error, sent_at")
    .eq("invite_id", invite.id)
    .order("sent_at", { ascending: false });

  const academies = await getAcademies(supabase);
  const academyNames = academies.map((academy) => academy.name);

  const log = sends ?? [];
  const failed = log.filter((row) => row.status === "failed").length;
  const date = inviteDateParts(invite.starts_at);
  const past = isPastInvite(invite.starts_at);

  return (
    <main className="min-h-screen bg-base-100 p-4 text-base-content md:p-8">
      <section className="mx-auto max-w-4xl space-y-6">
        <div className="rise rise-1 flex items-center justify-between">
          <Link
            href="/dashboard/admin/invitaciones"
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
            Invitaciones
          </Link>
          <span
            className={`tag-skew px-3 py-1 text-xs ${
              invite.sent_at
                ? "bg-primary text-primary-content"
                : "bg-base-300 text-base-content"
            }`}
          >
            <span>{invite.sent_at ? "Correo enviado" : "Sin enviar"}</span>
          </span>
        </div>

        <div className="rise rise-1">
          <h1 className="display text-4xl md:text-5xl">
            {invite.title}
            <span className="text-primary">.</span>
          </h1>
          <p className="mt-2 text-[0.7rem] font-black uppercase tracking-[0.2em] text-primary">
            {date?.long}
            {past ? " · ya pasó" : ""}
          </p>
          <p className="mt-1 text-sm font-medium opacity-70">
            {[
              invite.location,
              `${OUTFITS[invite.outfit]?.label}`,
              `Torneo ${EVENT_TYPES[invite.event_type]?.label}`,
              invite.slots ? `${invite.slots} cupos` : null,
              invite.price,
            ]
              .filter(Boolean)
              .join(" · ")}
          </p>
          <a
            href={invitePath(invite.slug)}
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary hover:underline"
          >
            Ver la página pública
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              className="h-3 w-3"
            >
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </a>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* ---------------------------- FLYER --------------------------- */}
          <div className="rise rise-2 border border-base-300 bg-base-200">
            <div className="border-b border-base-300 px-6 py-4">
              <h2 className="display text-xl">El flyer</h2>
              <p className="mt-1 text-xs font-medium opacity-60">
                Lo que ves es el archivo: se genera con los mismos datos de
                abajo cada vez que guardas.
              </p>
            </div>
            <div className="p-6">
              <InviteStudio invite={invite} />
            </div>
          </div>

          {/* ---------------------------- CORREO -------------------------- */}
          <div className="rise rise-3 space-y-6">
            <div className="border border-base-300 bg-base-200">
              <div className="border-b border-base-300 px-6 py-4">
                <h2 className="display text-xl">Mandar por correo</h2>
                <p className="mt-1 text-xs font-medium opacity-60">
                  {invite.sent_at
                    ? `Última salida: ${new Date(invite.sent_at).toLocaleString("es-VE", { timeZone: config.timezone })}`
                    : "Todavía no ha salido ningún correo de esta invitación."}
                </p>
              </div>
              <div className="p-6">
                <InviteSendPanel
                  invite={{ id: invite.id }}
                  resendReady={Boolean(process.env.RESEND_API_KEY)}
                  from={config.resend.fromAdmin}
                />
              </div>
            </div>

            {log.length > 0 && (
              <div className="border border-base-300 bg-base-200">
                <div className="flex items-center justify-between border-b border-base-300 px-6 py-4">
                  <h2 className="display text-xl">Historial</h2>
                  <span className="text-[0.65rem] font-black uppercase tracking-[0.2em] opacity-50">
                    {log.length} correo{log.length === 1 ? "" : "s"}
                    {failed ? ` · ${failed} con error` : ""}
                  </span>
                </div>
                <ul className="max-h-72 divide-y divide-base-300 overflow-y-auto">
                  {log.map((row) => (
                    <li
                      key={row.email}
                      className="flex items-center gap-3 px-6 py-3 text-sm"
                    >
                      <span
                        className={`h-2 w-2 shrink-0 ${
                          row.status === "sent" ? "bg-primary" : "bg-error"
                        }`}
                      />
                      <span className="min-w-0 flex-1 truncate">
                        {row.email}
                        {row.error && (
                          <span className="block truncate text-[0.65rem] text-error">
                            {row.error}
                          </span>
                        )}
                      </span>
                      <span className="shrink-0 text-[0.65rem] font-semibold uppercase tracking-wider opacity-50">
                        {new Date(row.sent_at).toLocaleDateString("es-VE", {
                          day: "numeric",
                          month: "short",
                        })}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* ----------------------- STORY DE PELEADORES -------------------- */}
        <div className="rise rise-3 border border-base-300 bg-base-200">
          <div className="border-b border-base-300 px-6 py-4">
            <h2 className="display text-xl">Story de peleadores</h2>
            <p className="mt-1 text-xs font-medium opacity-60">
              Cuatro nombres y su academia, a mano. Se genera al momento con
              los datos de este evento y se baja para las stories.
            </p>
          </div>
          <div className="p-6">
            <LineupStudio invite={invite} academies={academyNames} />
          </div>
        </div>

        {/* ---------------------------- EDITAR ---------------------------- */}
        <div className="rise rise-4 border border-base-300 bg-base-200">
          <div className="border-b border-base-300 px-6 py-4">
            <h2 className="display text-xl">Editar</h2>
            <p className="mt-1 text-xs font-medium opacity-60">
              Al guardar se regeneran el flyer y la página. El link no cambia
              nunca: lo que ya repartiste sigue abriendo.
            </p>
          </div>
          <div className="p-6">
            <AdminInviteForm invite={invite} />
          </div>
        </div>
      </section>
    </main>
  );
}
