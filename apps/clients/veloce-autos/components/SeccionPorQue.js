import Revelar from "@/components/Revelar";
import TituloAnimado from "@/components/TituloAnimado";
import BotonComprar from "@/components/demo/BotonComprar";

// -----------------------------------------------------------------------------
// "¿Y esto por qué no es el PDF de siempre?"
//
// Es la objeción real de ESTE cliente, y no una genérica. HB ya tiene un
// sistema que le funciona: un catálogo en PDF de trece páginas, maquetado con
// cuidado, que manda por WhatsApp. Esta página se construyó a partir de ese
// mismo PDF, así que la comparación no es teórica: cada fila se puede
// comprobar mirando las dos cosas.
//
// El argumento NO es que el PDF sea malo. Es bueno —por eso la web le copió
// la gráfica entera— y decirlo da credibilidad a todo lo demás. El argumento
// es que un PDF no se busca, no se actualiza sin rehacerlo y no lo encuentra
// nadie en Google.
//
// Habla el vendedor del sistema, no HB: por eso va en la zona marcada por el
// cintillo y con Microgramma.
// -----------------------------------------------------------------------------

const COMPARACION = [
  {
    tema: "Cuando entra una unidad nueva",
    pdf: "Hay que rehacer la página en el editor, exportar el PDF otra vez y volver a mandárselo a todo el mundo.",
    pagina: "Se carga desde el panel en dos minutos y ya está arriba. El enlace que mandaste ayer enseña el inventario de hoy.",
  },
  {
    tema: "Cuando algo se vende",
    pdf: "Sigue en el PDF que ya circula. Te escriben por un carro que ya no está y hay que explicarlo cada vez.",
    pagina: "Se marca vendido y deja de ofrecerse solo. Se puede dejar a la vista, atenuado, que también vende.",
  },
  {
    tema: "Buscar algo concreto",
    pdf: "Trece páginas que se pasan una a una. Si alguien quiere un 0 km de menos de 25.000, lo tiene que ir mirando.",
    pagina: "Filtros por condición, tipo, marca, año y precio. Y la búsqueda hecha se copia y se manda como enlace.",
  },
  {
    tema: "Mandar un vehículo por WhatsApp",
    pdf: "Se manda el PDF entero, de dos megas, y el cliente busca la página. O se manda una captura suelta, sin datos.",
    pagina: "Un enlace por vehículo, con su foto, su precio y su ficha. Se abre al instante y se ve igual en cualquier teléfono.",
  },
  {
    tema: "Quien busca en Google",
    pdf: "No te encuentra. Un PDF que viaja por WhatsApp no está en ningún buscador.",
    pagina: "Cada ficha se indexa con su marca, modelo, año y ciudad: «Corolla Cross 2024 Barquisimeto» te encuentra a ti.",
  },
  {
    tema: "El precio en bolívares",
    pdf: "Se repite en cada conversación, y cambia todos los días.",
    pagina: "Sale solo, a la tasa del BCV del día, debajo del precio en dólares.",
  },
  {
    tema: "El enlace del perfil de Instagram",
    pdf: "Hoy no hay ninguno: quien ve una publicación y quiere el resto tiene que escribir y pedir el catálogo.",
    pagina: "Tu dominio en la bio. Quien entra ve las trece unidades sin escribirle a nadie.",
  },
];

export default function SeccionPorQue() {
  return (
    <section id="por-que" className="relative overflow-hidden px-4 py-24 sm:px-6">
      <div className="textura absolute inset-0" aria-hidden="true" />

      <div className="relative mx-auto max-w-5xl">
        <Revelar className="text-center">
          <p className="microgramma text-xs text-primary">La pregunta de siempre</p>
        </Revelar>

        <TituloAnimado as="h2" className="display mt-4 text-center text-4xl sm:text-5xl">
          ¿Y esto por qué no es el PDF de siempre?
        </TituloAnimado>

        <Revelar retraso={160}>
          <p className="mx-auto mt-6 max-w-2xl text-center leading-relaxed text-base-content/60">
            Tu catálogo en PDF está bien hecho: tan bien que esta página le copió la
            gráfica entera —el negro, el rojo, las diagonales, la itálica—. El
            problema no es ese. Es que un PDF no se busca, no se actualiza sin
            rehacerlo y no lo encuentra nadie en Google.
          </p>
        </Revelar>

        {/* Cabeceras de las dos columnas. Se ocultan en móvil, donde cada
            fila lleva su propia etiqueta encima. */}
        <Revelar retraso={80}>
          <div className="mt-14 hidden gap-5 sm:grid sm:grid-cols-2">
            <p className="microgramma text-[0.7rem] text-base-content/45">Con el PDF</p>
            <p className="microgramma text-[0.7rem] text-primary">Con tu propia página</p>
          </div>
        </Revelar>

        <div className="mt-4 divide-y divide-base-content/10 border-y border-base-content/10">
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
                      <span className="microgramma mr-2 text-[0.6rem] sm:hidden">PDF:</span>
                      {fila.pdf}
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
          <div className="panel mt-10 flex flex-col items-center gap-5 p-7 text-center sm:flex-row sm:justify-between sm:text-left">
            <p className="max-w-lg text-sm leading-relaxed text-base-content/65">
              <span className="font-semibold text-base-content">
                No hay que elegir entre las dos.
              </span>{" "}
              El PDF se sigue mandando igual; lo que cambia es que ahora tiene un sitio
              a dónde apuntar. Y la página se alimenta de las mismas fichas que ya
              maquetas: no hay trabajo nuevo.
            </p>
            <BotonComprar className="btn btn-primary shrink-0" />
          </div>
        </Revelar>
      </div>
    </section>
  );
}
