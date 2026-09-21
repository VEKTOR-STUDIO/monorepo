import Revelar from "@/components/Revelar";
import TituloAnimado from "@/components/TituloAnimado";
import BotonComprar from "@/components/demo/BotonComprar";
import config from "@/config";

// -----------------------------------------------------------------------------
// "¿Y para qué una página, si tenemos el Instagram?"
//
// Es la objeción real de ESTE cliente y no una genérica, y tiene una respuesta
// que no hay que inventarse: la escribieron ellos.
//
// Su comunicado fijado dice, entre otras cosas, "NO TENEMOS PÁGINA WEB:
// cualquier portal web que use nuestro nombre no es oficial". Eso está
// publicado porque alguien se estaba haciendo pasar por ellos. Y la única
// forma de cerrar esa puerta no es avisar cada tanto en una publicación que se
// hunde a los tres días: es tener una dirección propia que se pueda enlazar.
//
// De ahí el tono de toda la sección. El argumento NO es que el Instagram esté
// mal —tienen 222 mil seguidores, es su mejor activo y esta página se alimenta
// de él—. El argumento es que 2.391 publicaciones no son un inventario que se
// pueda buscar, que un enlace en la bio no separa dos sedes, y que el hueco
// que deja no tenerla ya se lo está ocupando otro.
//
// Habla el vendedor del sistema, no Veloce: por eso va en la zona marcada por
// el cintillo y con Microgramma.
// -----------------------------------------------------------------------------

const COMPARACION = [
  {
    tema: "Quien busca si eres tú de verdad",
    hoy: "Tu comunicado avisa de que no tienes web y de que cualquier portal con tu nombre es falso. Es un aviso que se hunde a las tres publicaciones y que no se puede enlazar en una conversación.",
    pagina:
      "Una dirección oficial, con tus cuatro canales publicados en una sección propia. Cuando alguien dude, le mandas ese enlace y se acabó la duda.",
  },
  {
    tema: "El enlace de la bio",
    hoy: "Un solo enlace que lleva al WhatsApp. Quien quiere ver qué tienes antes de escribir, no tiene dónde mirar.",
    pagina:
      "Tu dominio en la bio. Entra, ve el inventario completo con su precio y su procedencia, y escribe solo cuando ya sabe qué quiere.",
  },
  {
    tema: "Encontrar una unidad concreta",
    hoy: "2.391 publicaciones en una cuadrícula. Quien busca una camioneta de Dubái de menos de 40.000 la va pasando hasta que se cansa.",
    pagina:
      "Filtros por procedencia, entrega, sede, tipo, marca y precio. Y la búsqueda hecha se copia y se manda como enlace.",
  },
  {
    tema: "Las dos sedes",
    hoy: "La Florida y Chacao publican por separado. Quien ve un carro en una cuenta y escribe a la otra acaba rebotando entre las dos.",
    pagina:
      "Cada unidad lleva su sede escrita, con su dirección y su cuenta. El mensaje de WhatsApp sale ya con la sede dentro.",
  },
  {
    tema: "Lo que ya se vendió",
    hoy: "La publicación se queda arriba para siempre. Te escriben por un carro que se fue hace ocho meses y hay que explicarlo cada vez.",
    pagina:
      "Se marca vendido y deja de ofrecerse solo. Se puede dejar a la vista, atenuado, que también vende.",
  },
  {
    tema: "Lo que no está en el showroom",
    hoy: "La importación a pedido hay que explicarla en cada conversación, una por una.",
    pagina:
      "Está contada en la página, con sus tres pasos y sus cuatro orígenes, y cada unidad a pedido lo dice en su ficha.",
  },
  {
    tema: "Quien busca en Google",
    hoy: "«Importar carro desde Dubái Caracas» no te encuentra: un perfil de Instagram no compite por esa búsqueda.",
    pagina:
      "Cada ficha se indexa con su marca, modelo, año, procedencia y ciudad. Esa búsqueda llega a tu página.",
  },
  {
    tema: "El precio en bolívares",
    hoy: "Se repite en cada conversación, y cambia todos los días.",
    pagina: "Sale solo, a la tasa del BCV del día, debajo del precio en dólares.",
  },
];

export default function SeccionPorQue() {
  return (
    <section id="por-que" className="relative overflow-hidden px-4 py-24 sm:px-6">
      <div className="textura absolute inset-0" aria-hidden="true" />

      <div className="relative mx-auto max-w-5xl">
        <Revelar className="text-center">
          <p className="microgramma text-xs text-base-content/70">La pregunta de siempre</p>
        </Revelar>

        <TituloAnimado as="h2" className="display mt-4 text-center text-4xl sm:text-5xl">
          ¿Para qué una página, si tenemos el Instagram?
        </TituloAnimado>

        {/* La cita. Es la pieza más fuerte de toda la venta y por eso va antes
            que la tabla: no es un argumento nuestro, es lo que ellos
            publicaron. */}
        <Revelar retraso={140}>
          <figure className="mx-auto mt-10 max-w-2xl border-l-2 border-base-content/30 pl-6">
            <blockquote className="text-lg leading-relaxed text-base-content/80">
              «<span className="font-semibold">No tenemos página web:</span> cualquier
              portal web que use nuestro nombre no es oficial.»
            </blockquote>
            <figcaption className="mt-3 text-sm text-base-content/45">
              — Comunicado fijado de{" "}
              <a
                href={config.business.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="underline-offset-4 transition-colors hover:text-base-content hover:underline"
              >
                @{config.business.instagram}
              </a>
            </figcaption>
          </figure>
        </Revelar>

        <Revelar retraso={200}>
          <p className="mx-auto mt-8 max-w-2xl text-center leading-relaxed text-base-content/60">
            Ese comunicado existe porque alguien está usando tu nombre por ahí. Avisarlo
            en una publicación ayuda tres días; tener una dirección oficial que puedas
            enlazar lo cierra. El Instagram no sobra —esta página se alimenta de él—,
            pero 2.391 publicaciones no son un inventario que se pueda buscar.
          </p>
        </Revelar>

        {/* Cabeceras de las dos columnas. Se ocultan en móvil, donde cada
            fila lleva su propia etiqueta encima. */}
        <Revelar retraso={80}>
          <div className="mt-14 hidden gap-5 sm:grid sm:grid-cols-2">
            <p className="microgramma text-[0.7rem] text-base-content/45">Solo con Instagram</p>
            <p className="microgramma text-[0.7rem] text-base-content">Con tu propia página</p>
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
                    <span className="mt-0.5 shrink-0 text-base-content" aria-hidden="true">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                        <path d="m20 6-11 11-5-5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    <p className="text-sm leading-relaxed text-base-content/75">
                      <span className="microgramma mr-2 text-[0.6rem] text-base-content sm:hidden">
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
              Se sigue publicando igual; lo que cambia es que ahora las publicaciones
              tienen un sitio a dónde apuntar. Y la página se alimenta de esas mismas
              publicaciones: no hay trabajo nuevo.
            </p>
            <BotonComprar className="btn btn-primary shrink-0" />
          </div>
        </Revelar>
      </div>
    </section>
  );
}
