import Revelar from "@/components/Revelar";
import TituloAnimado from "@/components/TituloAnimado";
import BotonComprar from "@/components/demo/BotonComprar";

// -----------------------------------------------------------------------------
// "¿Y para qué, si ya vendo por WhatsApp?"
//
// Es la objeción real de un salón de usados en Caracas: hoy venden con estados
// de WhatsApp, reenvíos y lo que publiquen en redes, y les funciona. Cualquier
// argumento que empiece por "eso no sirve" es falso y además se nota, así que
// la sección empieza reconociendo lo contrario.
//
// OJO CON LO QUE NO SE DICE: de Top Miami Cars no sabemos cuántos seguidores
// tienen ni en qué redes están —no mandaron ninguna cuenta—. Aquí no hay ni una
// cifra suya inventada; la comparación habla de cómo funcionan las redes, no de
// las de ellos.
//
// El argumento: un estado dura 24 horas y una publicación se entierra en tres
// días; un enlace con todo el inventario, no. Y sobre todo, ninguna cuenta es
// suya —se la pueden cerrar o hackear— y el dominio sí.
//
// Habla el vendedor del sistema, no Top Miami Cars: por eso va en la zona
// marcada por el cintillo y con Microgramma.
// -----------------------------------------------------------------------------

const COMPARACION = [
  {
    tema: "Cuando entra una unidad nueva",
    instagram:
      "Se sube al estado o se publica, la ven los que estén conectados esa tarde y el resto no se entera. A los tres días está enterrada.",
    pagina:
      "Se carga desde el panel en dos minutos y se queda arriba. El enlace que mandaste hace un mes enseña el inventario de hoy.",
  },
  {
    tema: "Buscar algo concreto",
    instagram:
      "Quien quiera una camioneta automática de menos de 25.000 tiene que preguntártelo, y tú contestarle a mano, una por una.",
    pagina:
      "Filtros por carrocería, marca, año y precio. Y la búsqueda hecha se copia y se manda como enlace.",
  },
  {
    tema: "Cuando algo se vende",
    instagram:
      "La publicación sigue ahí. Te escriben por una unidad que ya no está y hay que explicarlo cada vez.",
    pagina:
      "Se marca vendida y deja de ofrecerse sola. Se puede dejar a la vista, atenuada, que también vende.",
  },
  {
    tema: "Mandar una unidad por WhatsApp",
    instagram:
      "Se mandan seis fotos sueltas y un audio con el precio. Al día siguiente el cliente ya no sabe cuál era cuál.",
    pagina:
      "Un enlace por unidad, con su ficha, su precio y su año. Se abre al instante y se ve igual en cualquier teléfono.",
  },
  {
    tema: "Quien busca en Google",
    instagram:
      "Hoy te encuentra por tu ficha de Google, que tiene la dirección y el teléfono… y ni un solo carro.",
    pagina:
      "Cada ficha se indexa con su marca, modelo, año y ciudad. Quien busque «4Runner usada Caracas» te encuentra a ti, y tu ficha de Google ya tiene un sitio web que enlazar.",
  },
  {
    tema: "El precio en bolívares",
    instagram: "Se repite en cada conversación, y cambia todos los días.",
    pagina: "Sale solo, a la tasa del BCV del día, debajo del precio en dólares.",
  },
  {
    tema: "De quién es la cuenta",
    instagram:
      "De la red social. Si la cierran, la hackean o le bajan el alcance, se va con ella todo lo construido.",
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

        <TituloAnimado as="h2" className="display mt-4 text-center text-3xl sm:text-4xl lg:text-5xl">
          ¿Y para qué, si ya vendo por WhatsApp?
        </TituloAnimado>

        <Revelar retraso={160}>
          <p className="mx-auto mt-6 max-w-2xl text-center leading-relaxed text-base-content/60">
            Porque te funciona, y nadie te va a decir que lo dejes. Esta página no viene a
            sustituir tu WhatsApp ni tus redes: viene a darles un sitio a dónde apuntar.
            Un estado dura un día y una publicación se entierra en tres; esto es el
            salón que está abierto siempre, con todo lo que tienes hoy.
          </p>
        </Revelar>

        {/* Cabeceras de las dos columnas. Se ocultan en móvil, donde cada
            fila lleva su propia etiqueta encima. */}
        <Revelar retraso={80}>
          <div className="mt-14 hidden gap-5 sm:grid sm:grid-cols-2">
            <p className="microgramma text-[0.7rem] text-base-content/55">Solo con redes y WhatsApp</p>
            <p className="microgramma text-[0.7rem] text-primary">Con tu propia página</p>
          </div>
        </Revelar>

        <div className="mt-4 divide-y divide-base-content/10 border-y border-base-content/10">
          {COMPARACION.map((fila) => (
            <Revelar key={fila.tema}>
              <div className="py-6">
                <p className="microgramma mb-3.5 text-[0.65rem] text-base-content/55">
                  {fila.tema}
                </p>

                <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
                  {/* Lo de hoy. */}
                  <div className="flex min-w-0 gap-3">
                    <span className="mt-0.5 shrink-0 text-base-content/35" aria-hidden="true">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
                      </svg>
                    </span>
                    <p className="text-sm leading-relaxed text-base-content/55">
                      <span className="microgramma mr-2 text-[0.6rem] sm:hidden">Hoy:</span>
                      {fila.instagram}
                    </p>
                  </div>

                  {/* Lo que se compra. */}
                  <div className="flex min-w-0 gap-3">
                    <span className="mt-0.5 shrink-0 text-primary" aria-hidden="true">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                        <path d="m20 6-11 11-5-5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    <p className="text-sm leading-relaxed text-base-content/85">
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
              Sigues vendiendo igual; lo que cambia es que en vez de reenviar fotos sueltas
              mandas un enlace, y que tu ficha de Google deja de decir «Agregar sitio web».
              La página se alimenta de los mismos datos que ya escribes para cada unidad:
              no hay trabajo nuevo.
            </p>
            <BotonComprar className="btn btn-primary shrink-0" />
          </div>
        </Revelar>
      </div>
    </section>
  );
}
