import BotonComprar from "@/components/demo/BotonComprar";
import Contador from "@/components/demo/Contador";
import Revelar from "@/components/Revelar";
import { esDemo } from "@/libs/demo";
import config from "@/config";

/**
 * El cierre de las páginas en modo demo: qué es esto, qué incluye y cuánto
 * cuesta. Va al final, cuando el visitante ya ha recorrido la página y sabe de
 * qué le están hablando.
 */
export default function BloqueVenta() {
  if (!esDemo()) return null;

  const { precio, precioAnterior, precioNota, incluye } = config.demo;

  return (
    <section className="relative overflow-hidden border-t border-white/10 bg-base-200/40">
      <div className="textura absolute inset-0" aria-hidden="true" />
      <div className="textura-hex absolute inset-0" aria-hidden="true" />

      <div className="relative mx-auto max-w-5xl px-4 py-20 sm:px-6">
        <Revelar className="text-center">
          <p className="microgramma text-xs text-primary">Lo que acabas de ver</p>
          <h2 className="display mt-4 text-3xl sm:text-4xl">
            Esta página
            <br />
            <span className="text-primary">puede ser la tuya</span>
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-base-content/60">
            Es una página real funcionando, no una maqueta: el inventario, las
            dos salas, los filtros y las fichas son los de verdad. Se adapta a tu
            marca y a tu forma de vender.
          </p>
        </Revelar>

        <Revelar retraso={100}>
          <div className="vidrio mx-auto mt-10 max-w-3xl p-7 sm:p-9">
            <ul className="grid gap-3.5 sm:grid-cols-2">
              {incluye.map((cosa) => (
                <li key={cosa} className="flex gap-3 text-sm leading-snug">
                  <span className="mt-0.5 shrink-0 text-primary" aria-hidden="true">
                    ✓
                  </span>
                  <span className="text-base-content/70">{cosa}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-col items-center gap-4 border-t border-white/10 pt-7 sm:flex-row sm:justify-between">
              <div className="text-center sm:text-left">
                {precioAnterior && (
                  <p className="microgramma text-[0.65rem] text-base-content/40">
                    Antes{" "}
                    <span className="cifra line-through">{precioAnterior}</span>
                  </p>
                )}
                <p className="cifra mt-0.5 text-4xl font-bold text-primary">{precio}</p>
                <p className="mt-1 text-xs text-base-content/45">{precioNota}</p>

                <div className="mt-5">
                  <p className="microgramma text-[0.6rem] text-base-content/45">
                    La oferta termina en
                  </p>
                  <Contador formato="completo" className="mt-2 justify-center sm:justify-start" />
                </div>
              </div>

              <BotonComprar className="btn btn-primary btn-lg w-full sm:w-auto" />
            </div>
          </div>
        </Revelar>

        <Revelar retraso={180}>
          <p className="mx-auto mt-6 max-w-lg text-center text-xs text-base-content/35">
            Los vehículos que ves son de muestra, para poder enseñar la página. En
            la tuya van tus publicaciones de Instagram, con tus fotos y tus precios.
          </p>
        </Revelar>
      </div>
    </section>
  );
}
