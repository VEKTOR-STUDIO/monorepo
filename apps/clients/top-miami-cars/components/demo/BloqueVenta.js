import BotonComprar from "@/components/demo/BotonComprar";
import Contador from "@/components/demo/Contador";
import Revelar from "@/components/Revelar";
import TituloAnimado from "@/components/TituloAnimado";
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
    <section className="sobre-azul relative overflow-hidden">
      <div className="textura-brillo absolute inset-0" aria-hidden="true" />

      <div className="relative mx-auto max-w-5xl px-4 py-20 sm:px-6">
        <Revelar className="text-center">
          <p className="microgramma text-xs text-base-content/70">Lo que acabas de ver</p>
        </Revelar>

        <TituloAnimado as="h2" className="display mt-4 text-center text-3xl sm:text-4xl lg:text-5xl">
          Esta página puede ser la tuya
        </TituloAnimado>

        <Revelar retraso={140}>
          <p className="mx-auto mt-6 max-w-lg text-center leading-relaxed text-base-content/75">
            No es una maqueta: es una página real funcionando, hecha con tu logotipo —tu
            azul, tu escudo de acero y la letra de tu rótulo—. Lo que falta por poner es
            tu inventario real, tus precios, tus fotos y tu dominio.
          </p>
        </Revelar>

        <Revelar retraso={100}>
          <div className="ficha sobre-claro mx-auto mt-10 max-w-3xl p-7 sm:p-9">
            <ul className="grid gap-3.5 sm:grid-cols-2">
              {incluye.map((cosa) => (
                <li key={cosa} className="flex gap-3 text-sm leading-snug">
                  <span className="mt-0.5 shrink-0 text-primary" aria-hidden="true">
                    ✓
                  </span>
                  <span className="text-base-content/75">{cosa}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-col items-center gap-4 border-t border-base-content/10 pt-7 sm:flex-row sm:justify-between">
              <div className="text-center sm:text-left">
                {precioAnterior && (
                  <p className="microgramma text-[0.65rem] text-base-content/50">
                    Antes{" "}
                    <span className="cifra line-through">{precioAnterior}</span>
                  </p>
                )}
                <p className="display mt-1 text-4xl text-primary">{precio}</p>
                <p className="mt-1.5 text-xs text-base-content/55">{precioNota}</p>

                <div className="mt-5">
                  <p className="microgramma text-[0.6rem] text-base-content/55">
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
          <p className="mx-auto mt-7 max-w-lg text-center text-xs leading-relaxed text-base-content/60">
            Lo tuyo aquí es el logotipo y los datos de tu ficha de Google. Las unidades
            son de ejemplo, ningún precio es tuyo y no hay ni una foto tuya: lo que ves
            dibujado en cada ficha es tu escudo y tu rótulo, guardándole el sitio a la
            foto. Todo eso se carga desde el panel.
          </p>
        </Revelar>
      </div>
    </section>
  );
}
