"use client";

import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";
import toast from "react-hot-toast";
import { OUTFITS, EVENT_TYPES } from "@/libs/caos";
import {
  DEFAULT_CTA_LABEL,
  INVITE_LIMITS,
  isoToLocalInput,
} from "@/libs/invites";
import {
  createInvite,
  deleteInvite,
  updateInvite,
} from "@/app/dashboard/admin/invitaciones/actions";

function Field({ label, hint, children }) {
  return (
    <label className="block w-full">
      <span className="mb-1 block text-xs font-bold uppercase tracking-widest opacity-70">
        {label}
      </span>
      {children}
      {hint && (
        <span className="mt-1 block text-[0.65rem] font-medium opacity-50">
          {hint}
        </span>
      )}
    </label>
  );
}

/** Viernes que viene a las 7:00pm: el hueco natural para un evento. */
function defaultStart() {
  const date = new Date();
  date.setDate(date.getDate() + ((5 - date.getDay() + 7) % 7 || 7));
  date.setHours(19, 0, 0, 0);

  const pad = (value) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

/**
 * El formulario de la convocatoria. Sin `invite` crea una nueva y salta a su
 * ficha; con `invite` edita la que ya existe.
 *
 * Lo que se escriba aquí es lo que sale en el flyer, en el correo y en la
 * página pública: no hay tres textos que mantener, hay uno.
 */
export default function AdminInviteForm({ invite = null }) {
  const router = useRouter();
  const formRef = useRef(null);
  const [isPending, startTransition] = useTransition();
  const [isDeleting, startDeleting] = useTransition();
  const [tagline, setTagline] = useState(invite?.tagline ?? "");

  const editing = Boolean(invite);

  const handleSubmit = (formData) => {
    startTransition(async () => {
      const result = editing
        ? await updateInvite(formData)
        : await createInvite(formData);

      if (result?.error) {
        toast.error(result.error);
        return;
      }

      if (editing) {
        toast.success("Invitación actualizada");
        router.refresh();
        return;
      }

      toast.success("Invitación creada 🔥");
      formRef.current?.reset();
      router.push(`/dashboard/admin/invitaciones/${result.id}`);
    });
  };

  const handleDelete = () => {
    if (!window.confirm("¿Borrar la invitación? El link público deja de abrir.")) {
      return;
    }

    startDeleting(async () => {
      const result = await deleteInvite(invite.id);

      if (result?.error) {
        toast.error(result.error);
        return;
      }

      toast.success("Invitación borrada");
      router.push("/dashboard/admin/invitaciones");
    });
  };

  return (
    <form ref={formRef} action={handleSubmit} className="space-y-4">
      {editing && <input type="hidden" name="id" value={invite.id} />}

      <Field label="Título" hint="Es el titular del flyer: corto pega más.">
        <input
          name="title"
          required
          maxLength={INVITE_LIMITS.title}
          defaultValue={invite?.title ?? ""}
          placeholder="Ej. Circuito 01 · Maracay"
          className="input input-bordered w-full"
        />
      </Field>

      <Field
        label={`Gancho (${tagline.length}/${INVITE_LIMITS.tagline})`}
        hint="Una línea debajo del título. La que se lee de reojo en la story."
      >
        <input
          name="tagline"
          maxLength={INVITE_LIMITS.tagline}
          value={tagline}
          onChange={(event) => setTagline(event.target.value)}
          placeholder="Ocho peleadores. Reglas que cambian en cada pelea."
          className="input input-bordered w-full"
        />
      </Field>

      <Field label="Fecha y hora" hint="Hora de Caracas, la del gym.">
        <input
          name="starts_at"
          type="datetime-local"
          required
          defaultValue={
            invite ? isoToLocalInput(invite.starts_at) : defaultStart()
          }
          className="input input-bordered w-full"
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Tipo de evento">
          <select
            name="event_type"
            defaultValue={invite?.event_type ?? "circuit"}
            className="select select-bordered w-full"
          >
            {Object.entries(EVENT_TYPES).map(([key, value]) => (
              <option key={key} value={key}>
                {value.label}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Ruleset">
          <select
            name="outfit"
            defaultValue={invite?.outfit ?? "nogi"}
            className="select select-bordered w-full"
          >
            {Object.entries(OUTFITS).map(([key, value]) => (
              <option key={key} value={key}>
                {value.label}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="Sede">
        <input
          name="location"
          maxLength={INVITE_LIMITS.location}
          defaultValue={invite?.location ?? ""}
          placeholder="Ej. Slam MMA, Maracay"
          className="input input-bordered w-full"
        />
      </Field>

      <Field label="Link del mapa (opcional)">
        <input
          name="map_url"
          type="url"
          defaultValue={invite?.map_url ?? ""}
          placeholder="https://maps.app.goo.gl/..."
          className="input input-bordered w-full"
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Cupos" hint="Del bracket. Vacío = sin límite anunciado.">
          <input
            name="slots"
            type="number"
            min={2}
            max={128}
            defaultValue={invite?.slots ?? ""}
            placeholder="8"
            className="input input-bordered w-full"
          />
        </Field>

        <Field label="Entrada">
          <input
            name="price"
            maxLength={INVITE_LIMITS.price}
            defaultValue={invite?.price ?? ""}
            placeholder="Gratis"
            className="input input-bordered w-full"
          />
        </Field>
      </div>

      <p className="text-[0.65rem] font-medium opacity-50">
        Cupos y entrada no salen en el flyer —esa pieza es la invitación, no la
        letra chica—: aparecen en el correo y en la página del evento.
      </p>

      <Field
        label="De qué va"
        hint="Sale completo en el correo y en la página; en el flyer manda el título."
      >
        <textarea
          name="description"
          rows={5}
          maxLength={INVITE_LIMITS.description}
          defaultValue={invite?.description ?? ""}
          placeholder="Bracket de eliminación simple. Cada pelea se rolea delante de todos: sale un terreno y una carta de duelo. Se graba todo."
          className="textarea textarea-bordered w-full"
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Texto del botón">
          <input
            name="cta_label"
            maxLength={INVITE_LIMITS.ctaLabel}
            defaultValue={invite?.cta_label ?? ""}
            placeholder={DEFAULT_CTA_LABEL}
            className="input input-bordered w-full"
          />
        </Field>

        <Field label="Link de confirmación" hint="WhatsApp, formulario... Vacío = la página del evento.">
          <input
            name="cta_url"
            type="url"
            defaultValue={invite?.cta_url ?? ""}
            placeholder="https://wa.me/58..."
            className="input input-bordered w-full"
          />
        </Field>
      </div>

      <label className="flex cursor-pointer items-center gap-3 border border-base-300 bg-base-100 px-3 py-3">
        <input
          type="checkbox"
          name="is_public"
          defaultChecked={invite ? invite.is_public : true}
          className="checkbox checkbox-primary checkbox-sm"
        />
        <span>
          <span className="block text-xs font-bold uppercase tracking-widest">
            Link público encendido
          </span>
          <span className="text-[0.65rem] opacity-60">
            Apagado, la página y el flyer solo abren con sesión iniciada
          </span>
        </span>
      </label>

      <div className="flex gap-2">
        {editing && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting || isPending}
            className="btn btn-outline btn-error"
          >
            {isDeleting && <span className="loading loading-spinner loading-xs" />}
            Borrar
          </button>
        )}
        <button className="btn btn-primary flex-1" disabled={isPending}>
          {isPending && <span className="loading loading-spinner loading-xs" />}
          {editing ? "Guardar cambios" : "Crear invitación"}
        </button>
      </div>
    </form>
  );
}
