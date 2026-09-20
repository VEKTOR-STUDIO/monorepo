import Revelar from "@/components/Revelar";
import BotonComprar from "@/components/demo/BotonComprar";
import config from "@/config";

// -----------------------------------------------------------------------------
// "¿Y esto para qué, si ya vendo por Instagram?"
//
// Es la objeción real de esta cuenta, y no es una objeción tonta: 27.230
// publicaciones y 160 mil seguidores son un negocio que funciona. Decirlo de
// entrada es lo que da credibilidad a todo lo que viene después; plantear que
// Instagram "no sirve" sería mentir y además insultar diez años de trabajo.
//
// El argumento verdadero es otro: Instagram es un canal excelente para que te
// descubran y pésimo para que te compren. Un catálogo de 27.230 publicaciones
// no se puede recorrer, no se puede filtrar y no se puede enlazar vehículo a
// vehículo. Cada fila de abajo es comprobable en esta misma página.
//
// Habla el vendedor del sistema, no Venta Nacional: por eso va en la zona
// marcada por el cintillo y con Microgramma.
// -----------------------------------------------------------------------------

const COMPARACION = [
  {
    tema: "Ver qué hay disponible",
    instagram:
      "Bajar por la cuadrícula sin saber cuáles siguen a la venta ni desde cuándo está publicado eso.",
    pagina:
      "El inventario entero en una pantalla, con el estado de cada uno: disponible, reservado o vendido.",
  },
  {
    tema: "Buscar algo concreto",
    instagram:
      "No hay dónde buscar. «¿Tienen una camioneta 4x4 hasta 40 mil?» se responde a mano, una por una.",
    pagina:
      "Filtros por tipo, marca, sala, año y precio. La búsqueda se copia y se manda por WhatsApp.",
  },
  {
    tema: "El enlace del perfil",
    instagram:
      "Uno solo, y es el WhatsApp: quien entra sin saber qué quiere no tiene nada que mirar.",
    pagina:
      "Uno por vehículo. Pegas el del carro en su publicación o se lo mandas directo al cliente.",
  },
  {
    tema: "Las dos salas",
    instagram:
      "Se escribe en la descripción y se pierde: la mitad de los mensajes preguntan dónde está.",
    pagina:
      "Cada ficha dice en cuál está, y se puede ver el inventario de una sala sola.",
  },
  {
    tema: "Quien busca en Google",
    instagram: "No te encuentra: una publicación no se indexa como una ficha de producto.",
    pagina: "Cada vehículo se indexa con su marca, modelo, año y ciudad.",
  },
  {
    tema: "El precio en bolívares",
    instagram: "Lo repites en cada conversación, y cambia todos los días.",
    pagina: "Sale solo, a la tasa del BCV del día, debajo del precio en dólares.",
  },
  {
    tema: "Si mañana se cae la cuenta",
    instagram:
      "Diez años de publicaciones y 160 mil seguidores viven en una cuenta que no es tuya.",
    pagina: "El dominio y el código son tuyos. No hay quien te los pueda quitar.",
  },
];

export default function SeccionInstagram() {
  const { business } = config;

  return (
    <section id="por-que" className="relative overflow-hidden px-4 py-24 sm:px-6">
      <div className="textura absolute inset-0" aria-hidden="true" />

      <div className="relative mx-auto max-w-5xl">
        <Revelar className="text-center">
          <p className="microgramma text-xs text-primary">La pregunta de siempre</p>
          <h2 className="display mt-4 text-3xl sm:text-4xl">
            ¿Y esto para qué, si ya vendo por Instagram?
          </h2>
          <p className="mx-auto mt-5 max-w-2xl leading-relaxed text-base-content/60">
            Porque Instagram funciona: {business.publicaciones} publicaciones y{" "}
            {business.seguidores} de seguidores no son casualidad. Esta página no
            viene a sustituirlo, viene a recoger lo que él no puede hacer. Un
            catálogo de {business.publicaciones} publicaciones no se recorre, no se
            filtra y no se enlaza vehículo a vehículo.
          </p>
        </Revelar>

        {/* Cabeceras de las dos columnas. Se ocultan en móvil, donde cada fila
            lleva su propia etiqueta encima. */}
        <Revelar retraso={80}>
          <div className="mt-14 hidden gap-5 sm:grid sm:grid-cols-2">
            <p className="microgramma text-[0.7rem] text-base-content/45">Solo con Instagram</p>
            <p className="microgramma text-[0.7rem] text-primary">Con tu propia página</p>
          </div>
        </Revelar>

        <div className="mt-4 divide-y divide-white/10 border-y border-white/10">
          {COMPARACION.map((fila, i) => (
            <Revelar key={fila.tema} retraso={i * 60}>
              <div className="py-6">
                <p className="microgramma mb-3.5 text-[0.65rem] text-base-content/40">
                  {fila.tema}
                </p>

                <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
                  {/* Lo de hoy. */}
                  <div className="flex gap-3">
                    <span className="mt-0.5 shrink-0 text-base-content/25" aria-hidden="true">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
                      </svg>
                    </span>
                    <p className="text-sm leading-relaxed text-base-content/45">
                      <span className="microgramma mr-2 text-[0.6rem] sm:hidden">Instagram:</span>
                      {fila.instagram}
                    </p>
                  </div>

                  {/* Lo que se compra. */}
                  <div className="flex gap-3">
                    <span className="mt-0.5 shrink-0 text-primary" aria-hidden="true">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                        <path d="m20 6-11 11-5-5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    <p className="text-sm leading-relaxed text-base-content/75">
                      <span className="microgramma mr-2 text-[0.6rem] text-primary sm:hidden">
                        Tu página:
                      </span>
                      {fila.pagina}
                    </p>
                  </div>
                </div>
              </div>
            </Revelar>
          ))}
        </div>

        <Revelar retraso={140}>
          <div className="vidrio mt-10 flex flex-col items-center gap-5 p-7 text-center sm:flex-row sm:justify-between sm:text-left">
            <p className="max-w-lg text-sm leading-relaxed text-base-content/65">
              <span className="font-semibold text-base-content">
                No hay que elegir entre las dos.
              </span>{" "}
              Instagram se queda donde está y esta página pasa a ser el enlace del
              perfil, junto al WhatsApp. Lo que cambia es a dónde llega quien hace
              clic: a tu inventario, no a un chat vacío.
            </p>
            <BotonComprar className="btn btn-primary shrink-0" />
          </div>
        </Revelar>
      </div>
    </section>
  );
}
