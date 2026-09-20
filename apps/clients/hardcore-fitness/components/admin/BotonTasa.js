"use client";

import { useActionState } from "react";
import { actualizarTasaAhora } from "@/app/admin/acciones";
import { enBolivares } from "@/libs/formato";

/** Fuerza una lectura de la tasa sin esperar al cron de la madrugada. */
export default function BotonTasa() {
  const [resultado, actualizar, trabajando] = useActionState(actualizarTasaAhora, null);

  return (
    <form action={actualizar}>
      <button type="submit" disabled={trabajando} className="btn btn-primary">
        {trabajando ? "Consultando al BCV…" : "Actualizar ahora"}
      </button>

      {resultado?.ok && (
        <p className="mt-4 rounded-lg border border-success/40 bg-success/8 px-3.5 py-2.5 text-sm text-success">
          Tasa guardada: {enBolivares(resultado.tasa.valor)} (fecha valor {resultado.tasa.fechaValor})
          {resultado.tasa.fuente !== "bcv" && ` · leída del espejo ${resultado.tasa.fuente}`}
        </p>
      )}

      {resultado && !resultado.ok && (
        <div className="mt-4 rounded-lg border border-error/40 bg-error/8 px-3.5 py-2.5 text-sm text-error">
          <p>{resultado.error}</p>
          {resultado.avisos?.length > 0 && (
            <ul className="mt-2 space-y-0.5 text-xs opacity-80">
              {resultado.avisos.map((aviso, i) => (
                <li key={i}>· {aviso}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </form>
  );
}
