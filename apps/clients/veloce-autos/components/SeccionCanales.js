import Revelar from "@/components/Revelar";
import TituloAnimado from "@/components/TituloAnimado";
import MarcaVeloce from "@/components/MarcaVeloce";
import config from "@/config";

// -----------------------------------------------------------------------------
// Canales oficiales.
//
// Esta sección no se inventó: es el comunicado fijado de @veloce.autos pasado
// a página web. Lo que ellos publicaron dice, palabra por palabra, que no
// hacen sorteos, que no tienen página web, cuáles son sus cuatro canales
// oficiales y que no se compartan códigos ni se pague a cuentas no
// autorizadas.
//
// Que eso viva aquí y no solo en una imagen de Instagram cambia algo real: una
// publicación se hunde a las tres publicaciones siguientes y no se puede
// enlazar en una conversación. Una sección con dirección propia sí, y es lo
// que se manda cuando alguien escribe preguntando "¿esta cuenta es tuya?".
//
// Es también la respuesta a la línea más incómoda de su propio comunicado
// —"no tenemos página web"—, y por eso está escrita para el comprador y no
// para el dueño: aquí no se vende nada, se despeja una duda.
// -----------------------------------------------------------------------------

/** El icono de cada canal, dibujado, para no cargar una librería entera. */
function IconoCanal({ tipo }) {
  const comun = {
    width: 16,
    height: 16,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    "aria-hidden": true,
    className: "shrink-0",
  };

  if (tipo === "whatsapp") {
    return (
      <svg {...comun}>
        <path
          d="M21 11.5a8.4 8.4 0 0 1-12.6 7.3L3 20.5l1.8-5.2A8.4 8.4 0 1 1 21 11.5Z"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (tipo === "tiktok") {
    return (
      <svg {...comun}>
        <path
          d="M14 3v11.5a3.5 3.5 0 1 1-3-3.46M14 6.2A5 5 0 0 0 19 9.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  return (
    <svg {...comun}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

function tipoDe(canal) {
  const u = canal.url.toLowerCase();
  if (u.includes("wa.me")) return "whatsapp";
  if (u.includes("tiktok")) return "tiktok";
  return "instagram";
}

export default function SeccionCanales() {
  const { canales, avisos } = config.business;

  return (
    <section
      id="canales-oficiales"
      className="relative overflow-hidden border-t border-base-content/8 bg-base-200 px-4 py-24 sm:px-6"
    >
      <div className="textura absolute inset-0" aria-hidden="true" />
      <div className="textura-galon absolute inset-0" aria-hidden="true" />

      <div className="relative mx-auto max-w-5xl">
        <Revelar className="text-center">
          <p className="rotulo">Seguridad</p>
        </Revelar>

        <TituloAnimado as="h2" className="display mt-4 text-center text-4xl sm:text-5xl">
          Estos son nuestros canales
        </TituloAnimado>

        <Revelar retraso={140}>
          <p className="mx-auto mt-6 max-w-2xl text-center leading-relaxed text-base-content/60">
            Solo nos comunicamos por estos cuatro medios. Si alguien te escribe a nombre
            de Veloce Autos desde otra cuenta, otro número u otro portal, no somos
            nosotros. Ante cualquier duda, verifícalo aquí o en el showroom antes de
            hacer nada.
          </p>
        </Revelar>

        {/* Los cuatro canales, con la V al lado de cada uno: es la forma de
            decir "esto sí" sin escribirlo cuatro veces. */}
        <div className="mt-12 grid gap-3 sm:grid-cols-2">
          {canales.map((canal, i) => (
            <Revelar key={canal.url} retraso={i * 90}>
              <a
                href={canal.url}
                target="_blank"
                rel="noopener noreferrer"
                className="ficha group flex h-full items-center gap-4 p-5"
              >
                <MarcaVeloce className="h-5 w-auto shrink-0 text-base-content/70 transition-colors group-hover:text-base-content" />
                <span className="min-w-0 flex-1">
                  <span className="block text-[0.7rem] uppercase tracking-wider text-base-content/40">
                    {canal.etiqueta}
                  </span>
                  <span className="cifra mt-1 block truncate text-sm text-base-content">
                    {canal.cuenta}
                  </span>
                </span>
                <span className="shrink-0 text-base-content/35 transition-colors group-hover:text-base-content/70">
                  <IconoCanal tipo={tipoDe(canal)} />
                </span>
              </a>
            </Revelar>
          ))}
        </div>

        {/* Las dos advertencias. Van debajo y no encima: primero se dice qué
            SÍ es oficial, y solo después de qué hay que cuidarse. Al revés, la
            sección entera se lee como una alarma. */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {avisos.map((aviso, i) => (
            <Revelar key={aviso.titulo} retraso={i * 110}>
              <div className="panel h-full p-6">
                <p className="display-recto text-sm">{aviso.titulo}</p>
                <p className="mt-3 text-sm leading-relaxed text-base-content/60">
                  {aviso.detalle}
                </p>
              </div>
            </Revelar>
          ))}
        </div>
      </div>
    </section>
  );
}
