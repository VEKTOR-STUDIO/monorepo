import Revelar from "@/components/Revelar";
import BotonComprar from "@/components/demo/BotonComprar";

// -----------------------------------------------------------------------------
// "¿Y esto por qué no es un Linktree?"
//
// Es la pregunta que se hace cualquiera que hoy resuelve su Instagram con una
// lista de enlaces, y la objeción real: no es "no me gusta", es "ya tengo algo
// que hace esto y es gratis".
//
// La comparación se plantea de frente y sin exagerar. Un Linktree hace bien lo
// que promete —reparte enlaces— y decirlo da credibilidad a todo lo demás; el
// argumento no es que sea malo, es que un negocio que mueve vehículos de cinco
// cifras necesita otra cosa. Las filas son concretas y comprobables en esta
// misma página: nada de promesas vagas.
//
// Habla el vendedor del sistema, no Citta Cars: por eso va en la zona marcada
// por el cintillo y con Microgramma.
// -----------------------------------------------------------------------------

const COMPARACION = [
  {
    tema: "Lo que ve quien entra",
    linktree: "Una lista de botones. Para saber qué hay disponible, tiene que escribir y preguntar.",
    pagina: "El inventario completo: foto, año, kilometraje, accesorios y precio, sin preguntar nada.",
  },
  {
    tema: "El enlace del perfil",
    linktree: "Uno solo para todo. El mismo para el post de la Hilux que para el de la Grand Cherokee.",
    pagina: "Uno por vehículo. Pegas el de la camioneta en su publicación o se lo mandas por WhatsApp.",
  },
  {
    tema: "De quién es la dirección",
    linktree: "linktr.ee/tu-nombre: la marca que se lee primero es la de ellos.",
    pagina: "Tu dominio, en el perfil, en la tarjeta y en el vinilo del showroom.",
  },
  {
    tema: "Quien busca en Google",
    linktree: "No te encuentra: una lista de enlaces no dice qué vehículos tienes.",
    pagina: "Cada ficha se indexa con su marca, modelo, año y carrocería.",
  },
  {
    tema: "Buscar dentro",
    linktree: "No hay dónde buscar. Se mira todo o no se mira.",
    pagina: "Filtros por tipo, marca, año y precio, y la búsqueda se comparte como enlace.",
  },
  {
    tema: "El precio en bolívares",
    linktree: "Lo repites en cada conversación, y cambia todos los días.",
    pagina: "Sale solo, a la tasa del BCV del día, debajo del precio en dólares.",
  },
  {
    tema: "Si mañana cambian las reglas",
    linktree: "Te enteras cuando ya pasó: el servicio es de otro.",
    pagina: "El código y el dominio son tuyos. No hay plan que se acabe.",
  },
];

export default function SeccionLinktree() {
  return (
    <section id="por-que" className="relative overflow-hidden px-4 py-24 sm:px-6">
      <div className="textura absolute inset-0" aria-hidden="true" />

      <div className="relative mx-auto max-w-5xl">
        <Revelar className="text-center">
          <p className="microgramma text-xs text-primary">La pregunta de siempre</p>
          <h2 className="display mt-4 text-3xl sm:text-4xl">
            ¿Y esto por qué no es un Linktree?
          </h2>
          <p className="mx-auto mt-5 max-w-2xl leading-relaxed text-base-content/60">
            Un Linktree hace bien lo que promete: reparte enlaces y se monta en diez
            minutos. El problema no es ese. Es que un concesionario que mueve
            camionetas de cinco cifras necesita que el cliente vea el inventario, no
            una lista de botones que lo obliga a escribir para saber qué hay.
          </p>
        </Revelar>

        {/* Cabeceras de las dos columnas. Se ocultan en móvil, donde cada
            fila lleva su propia etiqueta encima. */}
        <Revelar retraso={80}>
          <div className="mt-14 hidden gap-5 sm:grid sm:grid-cols-2">
            <p className="microgramma text-[0.7rem] text-base-content/45">Con un Linktree</p>
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
                    <span
                      className="mt-0.5 shrink-0 text-base-content/25"
                      aria-hidden="true"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
                      </svg>
                    </span>
                    <p className="text-sm leading-relaxed text-base-content/45">
                      <span className="microgramma mr-2 text-[0.6rem] sm:hidden">Linktree:</span>
                      {fila.linktree}
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
              El Linktree se queda donde está y se le mete esta página como primer
              enlace. Lo que cambia es a dónde llega quien hace clic: a tu inventario,
              no a otra lista.
            </p>
            <BotonComprar className="btn btn-primary shrink-0" />
          </div>
        </Revelar>
      </div>
    </section>
  );
}
