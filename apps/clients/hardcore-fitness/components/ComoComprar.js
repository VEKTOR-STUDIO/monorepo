import Revelar from "@/components/Revelar";
import config from "@/config";

const PASOS = [
  {
    numero: "01",
    titulo: "Arma tu pedido",
    texto: "Agrega lo que quieras al carrito y elige el sabor o la talla cuando haga falta.",
  },
  {
    numero: "02",
    titulo: "Elige cómo pagas",
    texto:
      "Contado en divisas, transferencia en bolívares a tasa BCV o Pago Móvil. El total se recalcula solo.",
  },
  {
    numero: "03",
    titulo: "Confirma por WhatsApp",
    texto:
      "El pedido queda registrado con su código y se abre WhatsApp con el resumen para cerrar el pago y la entrega.",
  },
];

export default function ComoComprar() {
  const pagos = Object.values(config.pagos);
  const entregas = Object.values(config.entregas);

  return (
    <section className="relative overflow-hidden border-y border-base-content/10 bg-base-200/30">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <Revelar>
          <p className="rotulo">Sin vueltas</p>
          <h2 className="display mt-3 text-3xl sm:text-4xl">CÓMO SE COMPRA</h2>
        </Revelar>

        <ol className="mt-10 grid gap-4 md:grid-cols-3">
          {PASOS.map((paso, i) => (
            <Revelar key={paso.numero} retraso={i * 80}>
              <li className="ficha h-full list-none p-6">
                <span className="cifra text-3xl font-bold text-primary/35">{paso.numero}</span>
                <h3 className="mt-3 text-lg font-semibold">{paso.titulo}</h3>
                <p className="mt-2 text-sm leading-relaxed text-base-content/60">{paso.texto}</p>
              </li>
            </Revelar>
          ))}
        </ol>

        <div className="mt-10 grid gap-4 md:grid-cols-2">
          <Revelar>
            <div className="ficha h-full p-6">
              <p className="rotulo mb-4">Formas de pago</p>
              <ul className="space-y-3">
                {pagos.map((pago) => (
                  <li key={pago.id} className="flex gap-3">
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />
                    <div>
                      <p className="text-sm font-medium">{pago.nombre}</p>
                      <p className="text-xs text-base-content/55">{pago.detalle}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </Revelar>

          <Revelar retraso={80}>
            <div className="ficha h-full p-6">
              <p className="rotulo mb-4">Entrega</p>
              <ul className="space-y-3">
                {entregas.map((entrega) => (
                  <li key={entrega.id} className="flex gap-3">
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />
                    <div>
                      <p className="text-sm font-medium">{entrega.nombre}</p>
                      <p className="text-xs text-base-content/55">{entrega.detalle}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </Revelar>
        </div>
      </div>
    </section>
  );
}
