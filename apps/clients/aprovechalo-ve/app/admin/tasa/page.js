import BotonTasa from "@/components/admin/BotonTasa";
import { obtenerTasaConDetalle, FUENTES_DE_TASA, CACHE_TASA_SEGUNDOS } from "@/libs/bcv";
import { enBolivares, enDolares } from "@/libs/formato";
import { esDemo } from "@/libs/demo";

export const dynamic = "force-dynamic";

export default async function Tasa() {
  const tasa = await obtenerTasaConDetalle();
  const minutos = Math.round(CACHE_TASA_SEGUNDOS / 60);

  return (
    <div>
      <h1 className="display text-3xl">TASA BCV</h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-base-content/60">
        Se consulta en el momento a una API con la tasa oficial y se guarda en caché{" "}
        {minutos} minutos, así que la tienda enseña siempre la del día sin depender de una
        tarea programada. Sirve para calcular los montos en bolívares de la transferencia y
        el Pago Móvil.
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1.2fr] lg:items-start">
        <section className="ficha p-6">
          <h2 className="rotulo mb-4">Vigente</h2>

          {tasa ? (
            <>
              <p className="cifra text-4xl font-bold text-primary">{enBolivares(tasa.valor)}</p>
              <p className="mt-2 text-sm text-base-content/55">
                Por cada {enDolares(1)} · fecha valor {tasa.fechaValor}
              </p>
              <p className="mt-1 text-xs text-base-content/35">Fuente: {tasa.fuente}</p>

              {tasa.fallos?.length > 0 && (
                <p className="mt-3 text-xs text-warning">
                  La fuente preferida no respondió, se usó la siguiente.
                </p>
              )}
            </>
          ) : (
            <p className="text-sm text-error">
              Ninguna fuente respondió. La tienda sigue funcionando: enseña los precios en
              dólares y avisa de que el monto en bolívares se confirma al cerrar el pedido.
            </p>
          )}

          {!esDemo() && (
            <div className="mt-6">
              <BotonTasa />
            </div>
          )}
        </section>

        <section className="ficha p-6">
          <h2 className="rotulo mb-4">Cómo se consigue</h2>

          <ol className="space-y-4">
            {FUENTES_DE_TASA.map((fuente, i) => (
              <li key={fuente.nombre} className="flex gap-3">
                <span className="cifra shrink-0 text-sm text-base-content/30">{i + 1}</span>
                <div className="min-w-0">
                  <p className="text-sm font-medium">
                    {fuente.nombre}
                    {tasa?.fuente === fuente.nombre && (
                      <span className="ml-2 text-xs text-success">en uso</span>
                    )}
                  </p>
                  <p className="cifra mt-0.5 truncate text-xs text-base-content/40">{fuente.url}</p>
                </div>
              </li>
            ))}
          </ol>

          <p className="mt-6 border-t border-base-content/10 pt-4 text-xs leading-relaxed text-base-content/45">
            Se prueban en orden y se usa la primera que conteste con una cifra razonable. Si
            fallan todas, la tienda no se rompe: deja de mostrar los bolívares y lo dice.
          </p>

          <p className="mt-3 text-xs leading-relaxed text-base-content/45">
            La tasa que se aplicó a cada pedido queda guardada en el propio pedido, así que
            una tasa que cambie mañana no altera lo que ya se cobró.
          </p>
        </section>
      </div>
    </div>
  );
}
