"use client";

import { useRef, useState, useTransition } from "react";
import toast from "react-hot-toast";
import { sendInvite } from "@/app/dashboard/admin/invitaciones/actions";

const AUDIENCES = [
  {
    key: "test",
    label: "Prueba",
    hint: "Solo a tu correo, para ver cómo llega",
  },
  { key: "students", label: "Alumnos", hint: "Todos los alumnos del gym" },
  { key: "all", label: "Todo el gym", hint: "Alumnos y profesores" },
];

/**
 * El envío por correo.
 *
 * Mientras no exista RESEND_API_KEY el panel se queda armado pero apagado:
 * el correo ya está escrito y el flyer ya se genera, solo falta la llave.
 * Se avisa aquí mismo en vez de dejar que el botón falle con un error feo.
 */
export default function InviteSendPanel({ invite, resendReady, from }) {
  const formRef = useRef(null);
  const [audience, setAudience] = useState("test");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (formData) => {
    const target = formData.get("audience");

    if (
      target !== "test" &&
      !window.confirm(
        "¿Mandar la invitación por correo? A quien ya le llegó no se le repite (salvo que marques reenviar)."
      )
    ) {
      return;
    }

    startTransition(async () => {
      const result = await sendInvite(formData);

      if (result?.error) {
        toast.error(result.error, { duration: 6000 });
        return;
      }

      const extra = [
        result.failed ? `${result.failed} fallaron` : null,
        result.skipped ? `${result.skipped} ya la tenían` : null,
      ]
        .filter(Boolean)
        .join(" · ");

      toast.success(
        `${result.sent} correo${result.sent === 1 ? "" : "s"} enviado${result.sent === 1 ? "" : "s"}${extra ? ` (${extra})` : ""}`
      );
      formRef.current?.reset();
    });
  };

  return (
    <form ref={formRef} action={handleSubmit} className="space-y-4">
      <input type="hidden" name="id" value={invite.id} />

      {!resendReady && (
        <div className="border-2 border-warning bg-warning/10 p-4">
          <p className="text-[0.65rem] font-black uppercase tracking-[0.2em] text-warning">
            Resend sin configurar
          </p>
          <p className="mt-2 text-sm font-semibold">
            Falta <code className="bg-base-300 px-1">RESEND_API_KEY</code>. El
            correo ya está armado con el flyer adentro: cuando verifiques el
            dominio y pongas la llave, este botón lo manda sin tocar nada más.
          </p>
          <p className="mt-2 text-[0.65rem] font-medium opacity-70">
            Mientras tanto, baja el flyer y repártelo por story y WhatsApp.
          </p>
        </div>
      )}

      <div className="grid gap-2 sm:grid-cols-3">
        {AUDIENCES.map((option) => (
          <label
            key={option.key}
            className={`cursor-pointer border-2 p-3 transition-colors ${
              audience === option.key
                ? "border-primary bg-primary/10"
                : "border-base-300 hover:border-base-content/30"
            }`}
          >
            <input
              type="radio"
              name="audience"
              value={option.key}
              checked={audience === option.key}
              onChange={() => setAudience(option.key)}
              className="sr-only"
            />
            <span className="block text-xs font-black uppercase tracking-widest">
              {option.label}
            </span>
            <span className="mt-1 block text-[0.6rem] font-medium opacity-60">
              {option.hint}
            </span>
          </label>
        ))}
      </div>

      <label className="block w-full">
        <span className="mb-1 block text-xs font-bold uppercase tracking-widest opacity-70">
          Correos sueltos
        </span>
        <textarea
          name="extra"
          rows={3}
          placeholder={"otrogym@correo.com, elamigo@correo.com"}
          className="textarea textarea-bordered w-full"
        />
        <span className="mt-1 block text-[0.65rem] font-medium opacity-50">
          Gente de fuera del gym: separados por coma o por línea. Se les suma a
          los de arriba.
        </span>
      </label>

      <label className="flex cursor-pointer items-center gap-3 border border-base-300 bg-base-100 px-3 py-3">
        <input
          type="checkbox"
          name="resend_all"
          className="checkbox checkbox-warning checkbox-sm"
        />
        <span>
          <span className="block text-xs font-bold uppercase tracking-widest">
            Reenviar a todos
          </span>
          <span className="text-[0.65rem] opacity-60">
            Repite el correo a quien ya lo recibió (recordatorio de última hora)
          </span>
        </span>
      </label>

      <button
        className="btn btn-primary btn-block"
        disabled={isPending || !resendReady}
      >
        {isPending && <span className="loading loading-spinner loading-xs" />}
        {audience === "test" ? "Mandarme la prueba" : "Enviar invitación"}
      </button>

      <p className="text-[0.65rem] font-medium opacity-50">
        Sale desde <span className="font-bold">{from}</span>. El flyer viaja
        dentro del correo como imagen.
      </p>
    </form>
  );
}
