import Revelar from "@/components/Revelar";
import TituloAnimado from "@/components/TituloAnimado";
import BotonComprar from "@/components/demo/BotonComprar";

// -----------------------------------------------------------------------------
// "¿Y para qué, si ya tengo Instagram?"
//
// Es la objeción real de ESTE cliente, y no una genérica. Lone Star vende por
// Instagram y por WhatsApp, y le funciona: sus piezas están bien hechas y el
// número va impreso en todas. Cualquier argumento que empiece por "Instagram no
// sirve" es falso y además se nota, así que la sección empieza reconociendo lo
// contrario.
//
// El argumento es otro, y en su caso pesa más que en un concesionario: un lote
// de subasta CADUCA. La Tacoma del post del lunes se puja el jueves; el viernes
// esa publicación ya no vale y nadie lo sabe. Y la pregunta que más reciben
// —"¿cómo funciona?", "¿cómo pago?"— la contestan hoy con una pieza suelta que
// se hunde en la cuadrícula.
//
// Habla el vendedor del sistema, no Lone Star: por eso va en la zona marcada
// por el cintillo y con Microgramma.
// -----------------------------------------------------------------------------

const COMPARACION = [
  {
    tema: "Cuando entra un lote nuevo",
    instagram:
      "Se diseña la pieza, se publica y la ven los que estén conectados esa tarde. A los tres días está enterrada bajo otras diez.",
    pagina:
      "Se carga desde el panel en dos minutos y se queda arriba. El enlace que mandaste hace un mes enseña los lotes de hoy.",
  },
  {
    tema: "Cuando la subasta cierra",
    instagram:
      "El post sigue ahí. Te escriben por una unidad que ya se pujó y hay que explicarlo en cada DM.",
    pagina:
      "Se marca ganada o perdida y deja de ofrecerse sola. Lo exportado se puede dejar a la vista, que también vende.",
  },
  {
    tema: "«¿Cómo funciona?»",
    instagram:
      "Se contesta a mano en cada conversación, o se reenvía la pieza de las subastas, que alguien tiene que ir a buscar.",
    pagina:
      "Los cinco pasos, de la subasta a su país, siempre en el mismo sitio. Llegan al DM con la pregunta ya contestada.",
  },
  {
    tema: "«¿Cómo pago?»",
    instagram: "La pieza de métodos de pago está en algún punto de la cuadrícula.",
    pagina: "Zelle, ACH, wire, efectivo y USDT en una sección con enlace propio, y en USD siempre.",
  },
  {
    tema: "Mandar un lote por WhatsApp",
    instagram:
      "Se manda una captura sin datos, o el enlace del post, que abre la aplicación y se pierde entre comentarios.",
    pagina:
      "Un enlace por lote, con sus fotos, sus millas, su daño y su puja. Se abre al instante en cualquier teléfono.",
  },
  {
    tema: "Quien busca en Google",
    instagram:
      "No te encuentra. Un post de Instagram no aparece cuando alguien busca «traer Tacoma de subasta a Venezuela».",
    pagina:
      "Cada ficha se indexa con su marca, modelo, año y destino. Esa búsqueda te encuentra a ti.",
  },
  {
    tema: "De quién es la cuenta",
    instagram:
      "De Instagram. Si la cierran, la hackean o le bajan el alcance, se va con ella todo lo construido.",
    pagina:
      "Tuyo el dominio, tuyo el código y tuyo el inventario. Si mañana no quieres seguir conmigo, te lo llevas entero.",
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
          ¿Y para qué, si ya tengo Instagram?
        </TituloAnimado>

        <Revelar retraso={160}>
          <p className="mx-auto mt-6 max-w-2xl text-center leading-relaxed text-base-content/60">
            Porque te funciona: tus piezas están bien hechas y tu número va en todas. Esta página no
            viene a sustituir eso, viene a darle un sitio a dónde apuntar. Instagram es un río —lo
            de hoy tapa lo de ayer— y en tu negocio lo de ayer ya se pujó. Esto es el tablero donde
            queda lo que sigue en pie.
          </p>
        </Revelar>

        {/* Cabeceras de las dos columnas. Se ocultan en móvil, donde cada
            fila lleva su propia etiqueta encima. */}
        <Revelar retraso={80}>
          <div className="mt-14 hidden gap-5 sm:grid sm:grid-cols-2">
            <p className="microgramma text-[0.7rem] text-base-content/45">Solo con Instagram</p>
            <p className="microgramma text-[0.7rem] text-primary">Con tu propia página</p>
          </div>
        </Revelar>

        <div className="mt-4 divide-y divide-base-content/10 border-y border-base-content/10">
          {COMPARACION.map((fila) => (
            <Revelar key={fila.tema}>
              <div className="py-6">
                <p className="microgramma mb-3.5 text-[0.65rem] text-base-content/40">
                  {fila.tema}
                </p>

                <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
                  {/* Lo de hoy. */}
                  <div className="flex min-w-0 gap-3">
                    <span className="mt-0.5 shrink-0 text-base-content/25" aria-hidden="true">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
                      </svg>
                    </span>
                    <p className="text-sm leading-relaxed text-base-content/45">
                      <span className="microgramma mr-2 text-[0.6rem] sm:hidden">Instagram:</span>
                      {fila.instagram}
                    </p>
                  </div>

                  {/* Lo que se compra. */}
                  <div className="flex min-w-0 gap-3">
                    <span className="mt-0.5 shrink-0 text-primary" aria-hidden="true">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.2"
                      >
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
              Sigues publicando igual; lo que cambia es que el enlace de la bio deja de ser un
              WhatsApp suelto y pasa a ser tu inventario completo. Y la página se alimenta de los
              mismos datos que ya escribes en cada post: no hay trabajo nuevo.
            </p>
            <BotonComprar className="btn btn-primary shrink-0" />
          </div>
        </Revelar>
      </div>
    </section>
  );
}
