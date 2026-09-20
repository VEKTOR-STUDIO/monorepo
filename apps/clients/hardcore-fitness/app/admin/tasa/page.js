import BotonTasa from "@/components/admin/BotonTasa";
import { createAdminClient, haySupabase } from "@/libs/supabase/admin";
import { enBolivares, enDolares, fechaLarga } from "@/libs/formato";

export const dynamic = "force-dynamic";

export default async function Tasa() {
  if (!haySupabase()) {
    return (
      <div className="ficha px-6 py-16 text-center">
        <h1 className="display text-2xl">SIN BASE DE DATOS</h1>
        <p className="mx-auto mt-4 max-w-md text-sm text-base-content/55">
          La tasa se guarda en Supabase. Conéctalo y corre la migración.
        </p>
      </div>
    );
  }

  const supabase = createAdminClient();
  const { data: historial } = await supabase
    .from("tasas_cambio")
    .select("valor, fecha_valor, obtenida_en, fuente")
    .order("fecha_valor", { ascending: false })
    .limit(30);

  const actual = historial?.[0] || null;
  const anterior = historial?.[1] || null;
  const variacion =
    actual && anterior ? ((Number(actual.valor) - Number(anterior.valor)) / Number(anterior.valor)) * 100 : null;

  return (
    <div>
      <h1 className="display text-3xl">TASA BCV</h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-base-content/60">
        Se lee de la página del Banco Central una vez al día y sirve para calcular los montos en
        bolívares de la transferencia y el Pago Móvil. Si el BCV no responde, se usa un espejo y
        queda anotado.
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1.2fr] lg:items-start">
        <section className="ficha p-6">
          <h2 className="rotulo mb-4">Vigente</h2>

          {actual ? (
            <>
              <p className="cifra text-4xl font-bold text-primary">{enBolivares(actual.valor)}</p>
              <p className="mt-2 text-sm text-base-content/55">
                Por cada {enDolares(1)} · fecha valor {actual.fecha_valor}
              </p>
              <p className="mt-1 text-xs text-base-content/35">
                Leída {fechaLarga(actual.obtenida_en)}
                {actual.fuente !== "bcv" && ` · espejo ${actual.fuente}`}
              </p>

              {variacion !== null && Math.abs(variacion) > 0.001 && (
                <p
                  className={`cifra mt-3 text-sm ${variacion > 0 ? "text-warning" : "text-success"}`}
                >
                  {variacion > 0 ? "▲" : "▼"} {Math.abs(variacion).toFixed(2)}% respecto a la
                  lectura anterior
                </p>
              )}
            </>
          ) : (
            <p className="text-sm text-base-content/50">
              Todavía no hay ninguna tasa guardada. Pulsa el botón para traer la primera.
            </p>
          )}

          <div className="mt-6">
            <BotonTasa />
          </div>

          <p className="mt-5 border-t border-base-content/10 pt-4 text-xs leading-relaxed text-base-content/40">
            El cron diario está configurado en <code className="cifra">vercel.json</code> y llama a{" "}
            <code className="cifra">/api/cron/tasa-bcv</code>. Necesita la variable{" "}
            <code className="cifra">CRON_SECRET</code>.
          </p>
        </section>

        <section className="ficha p-6">
          <h2 className="rotulo mb-4">Historial</h2>

          {!historial?.length ? (
            <p className="py-8 text-center text-sm text-base-content/45">Sin lecturas todavía.</p>
          ) : (
            <ul className="divide-y divide-base-content/8">
              {historial.map((fila) => (
                <li key={fila.fecha_valor} className="flex items-baseline justify-between gap-4 py-2.5">
                  <span className="cifra text-sm text-base-content/55">{fila.fecha_valor}</span>
                  <span className="cifra text-sm font-medium">{enBolivares(fila.valor)}</span>
                  {fila.fuente !== "bcv" && (
                    <span className="text-[0.65rem] text-warning">{fila.fuente}</span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
