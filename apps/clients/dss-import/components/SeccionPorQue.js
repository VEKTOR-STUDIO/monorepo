import Revelar from "@/components/Revelar";
import TituloAnimado from "@/components/TituloAnimado";
import BotonComprar from "@/components/demo/BotonComprar";
import config from "@/config";

// -----------------------------------------------------------------------------
// "¿Y para qué, si ya tengo Instagram?"
//
// Es la objeción real de ESTE cliente, y no una genérica. DSS tiene 43,2 mil
// seguidores con 141 publicaciones —una proporción altísima, mucho mejor que la
// de casi todos los clientes de este monorepo—. Les funciona. Cualquier
// argumento que empiece por "Instagram no sirve" es falso y además se nota, así
// que la sección empieza reconociendo lo contrario.
//
// El argumento es otro, y en un negocio de CRÉDITO pesa más que en una venta al
// contado: financiar exige confianza. Quien va a entregar una inicial de varios
// cientos de dólares a una cuenta de Instagram está asumiendo un riesgo, y lo
// sabe. Una web propia, con dominio propio, con las condiciones escritas y la
// oficina publicada, es exactamente la prueba que le falta.
//
// Habla el vendedor del sistema, no DSS: por eso va en la zona marcada por el
// cintillo y con Microgramma.
// -----------------------------------------------------------------------------

const COMPARACION = [
  {
    tema: "La pregunta de siempre: «¿en cuánto me queda?»",
    instagram:
      "Te la hacen por DM veinte veces al día, una por una, y hay que contestar veinte veces lo mismo antes de saber si la persona califica.",
    pagina:
      "La cuota está escrita en cada unidad, y el simulador deja que muevan la inicial y el plazo solos. Te escriben cuando ya saben lo que van a pagar.",
  },
  {
    tema: "Cuando entra una unidad nueva",
    instagram:
      "Se publica, la ven los que estén conectados esa tarde y el resto no se entera. A los tres días está enterrada bajo otras diez.",
    pagina:
      "Se carga desde el panel en dos minutos y se queda arriba. El enlace que mandaste hace un mes enseña el catálogo de hoy.",
  },
  {
    tema: "Buscar algo que entre en el presupuesto",
    instagram:
      "141 publicaciones que se pasan con el dedo. Quien solo puede pagar 65 a la semana no tiene forma de filtrar: va mirando cuadro por cuadro.",
    pagina:
      "Un filtro de cuota máxima. Marcan «hasta $75 semanales» y ven solo lo que les entra, vehículos y motos juntos.",
  },
  {
    tema: "Cuando algo se entrega",
    instagram:
      "La publicación sigue ahí. Te escriben por una unidad que ya salió y hay que explicarlo cada vez.",
    pagina:
      "Se marca entregada y deja de ofrecerse sola. Se puede dejar a la vista, atenuada, que además demuestra que el crédito se cumple.",
  },
  {
    tema: "La confianza, que es todo en tu negocio",
    instagram:
      "Le estás pidiendo a un desconocido que entregue una inicial a una cuenta. Hay mil cuentas de crédito falsas y él lo sabe: por eso muchos no escriben.",
    pagina:
      "Dominio propio, las condiciones escritas, la oficina publicada y las unidades entregadas a la vista. Es la prueba que hoy no puedes dar en un post.",
  },
  {
    tema: "Mandar una unidad por WhatsApp",
    instagram:
      "Se manda una captura sin datos, o el enlace del post, que abre la aplicación y se pierde entre comentarios.",
    pagina:
      "Un enlace por unidad, con su cuota, su inicial y su plazo. Se abre al instante y se ve igual en cualquier teléfono.",
  },
  {
    tema: "Quien busca en Google",
    instagram:
      "No te encuentra. Un post de Instagram no aparece cuando alguien busca «motos a crédito en Maracay».",
    pagina:
      "Cada ficha se indexa con su marca, su modelo, su cuota y tu ciudad. Esa búsqueda te encuentra a ti.",
  },
  {
    tema: "De quién es la cuenta",
    instagram:
      "De Instagram. Si la cierran, la hackean o le bajan el alcance, se va con ella todo lo construido y los 43 mil seguidores.",
    pagina:
      "Tuyo el dominio, tuyo el código y tuyo el catálogo. Si mañana no quieres seguir conmigo, te lo llevas entero.",
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
            Porque te funciona: {business.seguidores} seguidores con solo{" "}
            {business.publicaciones} publicaciones no se consiguen de casualidad. Esta
            página no viene a sustituir eso, viene a darle un sitio a dónde apuntar.
            Instagram es un río —lo de hoy tapa lo de ayer— y esto es el almacén donde
            queda todo, con las condiciones por escrito.
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
              ser un índice de enlaces y pasa a ser tu catálogo completo con las cuotas
              dentro. Y la página se alimenta de los mismos datos que ya escribes en cada
              cartel: no hay trabajo nuevo.
            </p>
            <BotonComprar className="btn btn-primary shrink-0" />
          </div>
        </Revelar>
      </div>
    </section>
  );
}
