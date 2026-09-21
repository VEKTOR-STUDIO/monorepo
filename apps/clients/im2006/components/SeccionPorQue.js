import Revelar from "@/components/Revelar";
import TituloAnimado from "@/components/TituloAnimado";
import BotonComprar from "@/components/demo/BotonComprar";
import config from "@/config";

// -----------------------------------------------------------------------------
// "¿Y para qué quiero una web si ya tengo el Instagram?"
//
// Es la objeción real de ESTE cliente, y no una genérica. LM 2006 ya tiene un
// sistema que le funciona: 9.179 seguidores, 47 publicaciones maquetadas con
// cuidado y un Linktree en la bio. Esta página se construyó a partir de ese
// mismo feed, así que la comparación no es teórica: cada fila se puede
// comprobar abriendo las dos cosas al lado.
//
// El argumento NO es que el Instagram sea malo. Es bueno —por eso la web le
// copió la gráfica entera— y decirlo da credibilidad a todo lo demás. El
// argumento es que una cuadrícula no se filtra, no dice precios, no separa
// camiones de carros y no la encuentra nadie en Google.
//
// Habla el vendedor del sistema, no LM 2006: por eso va en la zona marcada por
// el cintillo, con Microgramma y en rojo, que es la voz de la oferta.
// -----------------------------------------------------------------------------

const COMPARACION = [
  {
    tema: "Cuando entra una unidad nueva",
    hoy: "Se diseña la pieza, se publica y en una semana está enterrada bajo las seis siguientes. Quien llegue después tiene que desplazarse hasta encontrarla.",
    pagina:
      "Se carga desde el panel en dos minutos y sale la primera. El enlace que mandaste la semana pasada enseña el inventario de hoy, sin volver a mandar nada.",
  },
  {
    tema: "Cuando algo se vende",
    hoy: "La publicación sigue ahí. Te escriben por una unidad que ya no está y hay que explicarlo cada vez, o borrar el post y perder los comentarios.",
    pagina:
      "Se marca vendida y deja de ofrecerse sola. Se puede dejar a la vista, atenuada, que también vende: enseña lo que sale del local.",
  },
  {
    tema: "Vehículos y camiones mezclados",
    hoy: "La cuadrícula los revuelve. Quien viene por un Sinotruk pasa por delante de siete Toyotas, y tienes un destacado aparte justo porque hacía falta.",
    pagina:
      "Dos catálogos separados desde la portada, tal como lo dice tu bio. Quien busca carga entra directo a los camiones y no ve un solo carro.",
  },
  {
    tema: "Buscar algo concreto",
    hoy: "Publicaciones que se pasan una a una. Si alguien quiere una camioneta automática de menos de 40.000, le toca ir mirando publicación por publicación.",
    pagina:
      "Filtros por segmento, tipo, marca, año y precio. Y la búsqueda hecha se copia y se manda como enlace, que es lo que hace un vendedor con un cliente.",
  },
  {
    tema: "El precio",
    hoy: "Casi nunca sale en la publicación, así que cada conversación empieza por «¿cuánto es?» antes de llegar a nada.",
    pagina:
      "A la vista en cada ficha, en dólares y con su equivalente en bolívares a la tasa del BCV del día, que se actualiza sola.",
  },
  {
    tema: "Mandar una unidad por WhatsApp",
    hoy: "Se manda el enlace del post —que abre la app— o una captura suelta, sin motor, sin año y sin precio.",
    pagina:
      "Un enlace por unidad, con su foto, su ficha técnica y su precio. Se abre al instante y se ve igual en cualquier teléfono, con app o sin ella.",
  },
  {
    tema: "Quien busca en Google",
    hoy: "No te encuentra. Un perfil de Instagram no aparece cuando alguien escribe «Corolla Cross 2026 Caracas» en el buscador.",
    pagina:
      "Cada ficha se indexa con su marca, su modelo, su año y su ciudad. Esa búsqueda te encuentra a ti, y no al concesionario de al lado.",
  },
  {
    tema: "El enlace de la bio",
    hoy: "Hoy es un Linktree: una lista de botones alojada en otro sitio, con la marca de otro debajo, que todavía no lleva a ningún inventario.",
    pagina:
      "Tu dominio. Quien entra ve las unidades completas, con precio y ficha, sin escribirle a nadie y sin pasar por una página intermedia.",
  },
];

export default function SeccionPorQue() {
  const { business } = config;

  return (
    <section id="por-que" className="relative overflow-hidden px-4 py-24 sm:px-6">
      <div className="textura absolute inset-0" aria-hidden="true" />

      <div className="relative mx-auto max-w-5xl">
        <Revelar className="text-center">
          <p className="microgramma text-xs text-accent">La pregunta de siempre</p>
        </Revelar>

        <TituloAnimado as="h2" className="display mt-4 text-center text-4xl sm:text-5xl">
          ¿Y para qué, si ya tengo el Instagram?
        </TituloAnimado>

        <Revelar retraso={160}>
          <p className="mx-auto mt-6 max-w-2xl text-center leading-relaxed text-base-content/60">
            Tu Instagram funciona: {business.seguidores} seguidores y{" "}
            {business.publicaciones} publicaciones bien maquetadas, tan bien que esta
            página les copió la gráfica entera —el grafito, las tres barras, la
            itálica—. El problema no es ese. Es que una cuadrícula no se filtra, no
            dice precios, no separa los camiones de los carros y no la encuentra nadie
            en Google.
          </p>
        </Revelar>

        {/* Cabeceras de las dos columnas. Se ocultan en móvil, donde cada
            fila lleva su propia etiqueta encima. */}
        <Revelar retraso={80}>
          <div className="mt-14 hidden gap-5 sm:grid sm:grid-cols-2">
            <p className="microgramma text-[0.7rem] text-base-content/45">Solo con el perfil</p>
            <p className="microgramma text-[0.7rem] text-accent">Con tu propia página</p>
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
                      <span className="microgramma mr-2 text-[0.6rem] sm:hidden">Hoy:</span>
                      {fila.hoy}
                    </p>
                  </div>

                  {/* Lo que se compra. */}
                  <div className="flex gap-3">
                    <span className="mt-0.5 shrink-0 text-accent" aria-hidden="true">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                        <path d="m20 6-11 11-5-5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    <p className="text-sm leading-relaxed text-base-content/75">
                      <span className="microgramma mr-2 text-[0.6rem] text-accent sm:hidden">
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
              El Instagram se sigue publicando igual; lo que cambia es que la bio pasa a
              tener a dónde apuntar. Y la página se alimenta de las mismas fichas que ya
              maquetas: no hay trabajo nuevo.
            </p>
            <BotonComprar className="btn btn-primary shrink-0" />
          </div>
        </Revelar>
      </div>
    </section>
  );
}
