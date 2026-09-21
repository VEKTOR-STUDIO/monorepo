import Revelar from "@/components/Revelar";
import TituloAnimado from "@/components/TituloAnimado";
import BotonComprar from "@/components/demo/BotonComprar";
import config from "@/config";

// -----------------------------------------------------------------------------
// "¿Y esto por qué, si ya tengo Instagram?"
//
// Es la objeción real de ESTE cliente, y no una genérica. SUSU ya tiene un
// sistema que le funciona: dos cuentas, publicaciones cuidadas, un número de
// WhatsApp y una sede en Av. Casanova. No está empezando de cero y no hay que
// hablarle como si lo estuviera.
//
// El argumento NO es que Instagram sea malo. Es lo que le trae los clientes
// —por eso la web se diseñó a partir de su logotipo y su discurso, y por eso
// el enlace a su perfil está en todas las pantallas—, y decirlo en voz alta da
// credibilidad a todo lo demás. El argumento es que un feed no se filtra, no
// se ordena por precio, no dice qué sigue disponible y no lo encuentra nadie
// en Google.
//
// Cada fila se puede comprobar abriendo su perfil al lado, que es exactamente
// lo que hay que hacer en la reunión.
//
// Habla el vendedor del sistema, no SUSU: por eso va en la zona marcada por el
// cintillo y con Microgramma.
// -----------------------------------------------------------------------------

const COMPARACION = [
  {
    tema: "Cuando entra un vehículo en consignación",
    hoy: "Se arma el arte, se publica y a las dos horas ya lo tapó el siguiente post. Quien entró ayer no lo ve.",
    pagina:
      "Se carga desde el panel en dos minutos y se queda arriba mientras esté disponible, con su ficha y su enlace propio.",
  },
  {
    tema: "Cuando algo se vende",
    hoy: "La publicación sigue ahí. Te escriben por un carro que ya no está y hay que explicarlo cada vez.",
    pagina:
      "Se marca vendido y deja de ofrecerse solo. Se puede dejar a la vista, atenuado, que también vende: enseña qué se mueve aquí.",
  },
  {
    tema: "Buscar algo concreto",
    hoy: "Bajar por el feed hasta encontrarlo. Si alguien quiere una camioneta 4x4 de menos de $25.000, no hay forma de pedirla.",
    pagina:
      "Filtros por tipo, marca, año y precio. Y la búsqueda hecha se copia y se manda como enlace.",
  },
  {
    tema: "Mandar un vehículo por WhatsApp",
    hoy: "Se manda una captura, o el enlace de un post donde el precio está en el pie y el kilometraje en el comentario tres.",
    pagina:
      "Un enlace por vehículo, con su foto, su precio, su kilometraje y sus papeles. Se abre al instante y se ve igual en cualquier teléfono.",
  },
  {
    tema: "Quien quiere consignar el suyo",
    hoy: "Escribe al DM y hay que preguntarle marca, año y kilometraje una por una, muchas veces en días distintos.",
    pagina:
      "Llena el formulario de consignación y llega con los tres datos escritos. La primera respuesta ya puede ser un precio.",
  },
  {
    tema: "Quien busca en Google",
    hoy: "No te encuentra. Un perfil de Instagram no aparece cuando alguien escribe lo que quiere comprar.",
    pagina:
      "Cada ficha se indexa con su marca, modelo, año y ciudad: «Toyota 4Runner 2018 Caracas» te encuentra a ti.",
  },
  {
    tema: "El precio en bolívares",
    hoy: "Se repite en cada conversación, y cambia todos los días.",
    pagina: "Sale solo, a la tasa del BCV del día, debajo del precio en dólares.",
  },
  {
    tema: "El enlace de la bio",
    hoy: "Hoy lleva al DM. Quien ve una publicación y quiere ver el resto tiene que escribir y esperar.",
    pagina: "Tu dominio en la bio. Quien entra ve el catálogo entero sin escribirle a nadie.",
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

        <TituloAnimado as="h2" className="display mt-4 text-center text-2xl sm:text-3xl">
          ¿Y esto por qué, si ya tengo Instagram?
        </TituloAnimado>

        <Revelar retraso={160}>
          <p className="mx-auto mt-6 max-w-2xl text-center leading-relaxed text-base-content/60">
            Tu Instagram está bien llevado: tan bien que esta página salió de ahí
            —el oro, el negro, el trazo del logotipo y hasta el titular de la
            portada, que es tu frase—. El problema no es ese. Es que un feed no
            se filtra, no dice qué sigue disponible y no lo encuentra nadie en
            Google.
          </p>
        </Revelar>

        {/* Cabeceras de las dos columnas. Se ocultan en móvil, donde cada
            fila lleva su propia etiqueta encima. */}
        <Revelar retraso={80}>
          <div className="mt-14 hidden gap-5 sm:grid sm:grid-cols-2">
            <p className="microgramma text-[0.7rem] text-base-content/45">
              Solo con @{config.business.instagram}
            </p>
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
                      <span className="microgramma mr-2 text-[0.6rem] sm:hidden">Hoy:</span>
                      {fila.hoy}
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
              Instagram se sigue trabajando igual; lo que cambia es que ahora
              tiene un sitio a dónde mandar a la gente. Y la página se alimenta
              de las mismas fotos y los mismos datos que ya publicas: no hay
              trabajo nuevo.
            </p>
            <BotonComprar className="btn btn-primary shrink-0" />
          </div>
        </Revelar>
      </div>
    </section>
  );
}
