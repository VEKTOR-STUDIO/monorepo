import Revelar from "@/components/Revelar";
import TituloAnimado from "@/components/TituloAnimado";
import BotonComprar from "@/components/demo/BotonComprar";
import config from "@/config";

// -----------------------------------------------------------------------------
// "¿Y para qué, si ya tengo Instagram?"
//
// Es la objeción real de ESTE cliente, y no una genérica. Coronado Carss tiene
// 71,8 mil seguidores y 2.567 publicaciones. Les funciona, y mucho. Cualquier
// argumento que empiece por "Instagram no sirve" es falso y además se nota,
// así que la sección empieza reconociendo lo contrario.
//
// El argumento es otro: Instagram es un río y esto es un almacén. Una
// publicación del martes ya no la ve nadie el viernes; un enlace con todo el
// inventario sí. Y sobre todo, la cuenta no es suya —se la pueden cerrar,
// hackear o bajar el alcance de un día para otro— y el dominio sí.
//
// Hay una fila que en esta casa pesa más que en otras: la de BUSCAR. Con 2.567
// publicaciones, encontrar "un sedán sincrónico de menos de 8.000" en su
// cuadrícula es pasar el dedo durante diez minutos. Y la de CONSIGNAR: es la
// mitad de lo que dice su logotipo y hoy solo lo sabe quien encuentra el post
// fijado.
//
// Habla el vendedor del sistema, no Coronado Carss: por eso va en la zona
// marcada por el cintillo y con Microgramma.
// -----------------------------------------------------------------------------

const COMPARACION = [
  {
    tema: "Cuando entra una unidad nueva",
    instagram:
      "Se publica, la ven los que estén conectados esa tarde y el resto no se entera. A los tres días está enterrada bajo otras diez.",
    pagina:
      "Se carga desde el panel en dos minutos y se queda arriba. El enlace que mandaste hace un mes enseña el inventario de hoy.",
  },
  {
    tema: "Buscar algo concreto",
    instagram:
      "2.567 publicaciones que se pasan con el dedo. Quien quiera un sedán sincrónico de menos de 8.000 tiene que ir mirando cuadro por cuadro.",
    pagina:
      "Filtros por condición, carrocería, marca, año y precio. Y la búsqueda hecha se copia y se manda como enlace.",
  },
  {
    tema: "Cuando algo se vende",
    instagram:
      "Se hace otra pieza de «VENDIDO!», pero la ficha vieja sigue ahí. Te escriben por una unidad que ya no está y hay que explicarlo cada vez.",
    pagina:
      "Se marca vendida y deja de ofrecerse sola. Se puede dejar a la vista, atenuada, que también vende.",
  },
  {
    tema: "Que compras y consignas",
    instagram:
      "Está en el logotipo y en un post fijado. Quien entra a mirar carros no lo lee, y ese es justo el que tiene uno que vender.",
    pagina:
      "Una página entera para eso, con su formulario de avalúo, y un enlace en el menú que se ve en todas las pantallas. Es la mitad de tu negocio y hoy es lo más escondido que tienes.",
  },
  {
    tema: "Mandar una unidad por WhatsApp",
    instagram:
      "Se manda una captura sin datos, o el enlace del post, que abre la aplicación y se pierde entre comentarios.",
    pagina:
      "Un enlace por unidad, con su año, su modelo, su kilometraje y su transmisión. Se abre al instante y se ve igual en cualquier teléfono.",
  },
  {
    tema: "Quien busca en Google",
    instagram:
      "No te encuentra. Un post de Instagram no aparece cuando alguien busca «Yaris 2008 Valencia» ni «consignar mi carro en Valencia».",
    pagina:
      "Cada ficha se indexa con su marca, modelo, año y ciudad. Esa búsqueda te encuentra a ti.",
  },
  {
    tema: "El precio en bolívares",
    instagram: "Se repite en cada conversación, y cambia todos los días.",
    pagina: "Sale solo, a la tasa del BCV del día, debajo del precio en dólares.",
  },
  {
    tema: "De quién es la cuenta",
    instagram:
      "De Instagram. Si la cierran, la hackean o le bajan el alcance, se van con ella las 2.567 publicaciones y los 71,8 mil seguidores.",
    pagina:
      "Tuyo el dominio, tuyo el código y tuyo el inventario. Si mañana no quieres seguir conmigo, te lo llevas entero.",
  },
];

export default function SeccionPorQue() {
  const { business } = config;

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
            Porque te funciona: {business.seguidores} seguidores y {business.publicaciones}{" "}
            publicaciones no se consiguen de casualidad. Esta página no viene a sustituir
            eso, viene a darle un sitio a dónde apuntar. Instagram es un río —lo de hoy
            tapa lo de ayer— y esto es el almacén donde queda todo.
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
                  <div className="flex min-w-0 gap-3">
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
              Sigues publicando igual; lo que cambia es que el enlace de la bio deja de
              ser un WhatsApp suelto y pasa a ser tu inventario completo. Y la página se
              alimenta de los mismos datos que ya escribes en cada post: no hay trabajo
              nuevo.
            </p>
            <BotonComprar className="btn btn-primary shrink-0" />
          </div>
        </Revelar>
      </div>
    </section>
  );
}
