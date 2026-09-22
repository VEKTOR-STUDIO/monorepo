import Revelar from "@/components/Revelar";
import TituloAnimado from "@/components/TituloAnimado";

// -----------------------------------------------------------------------------
// "El inventario lo suben ellos".
//
// La sección funciona en dos planos a la vez, y por eso está redactada así:
//
//   · Para quien viene a comprar un carro: explica por qué lo que ve está al
//     día —lo publica el propio vendedor, no un programador cada quince días—.
//   · Para quien viene a comprar la página: enseña que no queda atado a nadie
//     para actualizar su inventario, que es la objeción número uno.
//
// La maqueta del panel es un dibujo hecho con HTML, no una captura: así no hay
// imagen que se quede vieja cuando el panel cambie, pesa cero y se lee bien en
// cualquier pantalla.
// -----------------------------------------------------------------------------

const PASOS = [
  {
    numero: "01",
    titulo: "Entras a tu panel",
    detalle:
      "Con tu usuario y tu clave, desde el teléfono o la computadora. No hace falta instalar nada.",
  },
  {
    numero: "02",
    titulo: "Cargas el vehículo",
    detalle:
      "La foto que ya hiciste para el post, el precio, el año, el kilometraje y la transmisión. Exactamente los cuatro datos que van en las tarjetas de tus publicaciones, escritos una sola vez.",
  },
  {
    numero: "03",
    titulo: "Queda publicado",
    detalle:
      "Aparece al instante en el inventario y con su enlace propio, listo para pegarlo en la publicación o mandarlo por WhatsApp.",
  },
];

/** Una fila de la tabla de la maqueta. */
function FilaMaqueta({ nombre, precio, estado, tono }) {
  const colores = {
    disponible: "bg-emerald-500/20 text-emerald-300",
    reservado: "bg-amber-500/20 text-amber-300",
    vendido: "bg-base-content/10 text-base-content/45",
  };

  return (
    <div className="flex items-center gap-3 border-t border-base-content/8 px-4 py-2.5">
      <span className="size-7 shrink-0 bg-base-content/8" aria-hidden="true" />
      <span className="min-w-0 flex-1 truncate text-xs font-medium text-base-content/70">
        {nombre}
      </span>
      <span className="cifra hidden text-xs text-base-content/50 sm:block">{precio}</span>
      <span className={`px-2 py-0.5 text-[0.6rem] font-medium ${colores[tono]}`}>{estado}</span>
    </div>
  );
}

export default function SeccionPanel() {
  return (
    <section
      id="panel"
      className="relative overflow-hidden border-t border-base-content/8 bg-base-200 px-4 py-24 sm:px-6"
    >
      <div className="textura absolute inset-0" aria-hidden="true" />
      <div className="textura-via absolute inset-0" aria-hidden="true" />

      <div className="relative mx-auto max-w-7xl">
        <Revelar className="text-center">
          <p className="rotulo">Sin intermediarios</p>
        </Revelar>

        <TituloAnimado as="h2" className="display mt-4 text-center text-4xl sm:text-5xl">
          El inventario lo suben ellos
        </TituloAnimado>

        <Revelar retraso={160}>
          <p className="mx-auto mt-6 max-w-2xl text-center leading-relaxed text-base-content/60">
            Cada unidad de esta página la publica el propio equipo de Coronado Carss desde
            su panel, en un par de minutos, desde el teléfono o desde la computadora del
            local. Nadie tiene que llamar a un programador para subir un carro, cambiar
            un precio o marcar algo como vendido: por eso lo que ves aquí es lo que hay
            hoy en el local.
          </p>
        </Revelar>

        <div className="mt-16 grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* La maqueta del panel. */}
          <Revelar desde="corte">
            <div className="ficha overflow-hidden shadow-2xl shadow-black/40">
              {/* Barra de ventana. */}
              <div className="flex items-center gap-2 border-b border-base-content/8 bg-base-300/40 px-4 py-2.5">
                <span className="size-2.5 rounded-full bg-base-content/15" aria-hidden="true" />
                <span className="size-2.5 rounded-full bg-base-content/15" aria-hidden="true" />
                <span className="size-2.5 rounded-full bg-base-content/15" aria-hidden="true" />
                <span className="cifra ml-3 truncate text-[0.65rem] text-base-content/40">
                  panel · coronado carss
                </span>
              </div>

              <div className="bg-base-100 p-4 sm:p-5">
                {/* Cabecera del formulario. */}
                <div className="flex items-center justify-between gap-3">
                  <p className="display-abierto text-sm tracking-wide">Publicar vehículo</p>
                  <span className="bisel">
                    <span className="block bg-primary px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-wider text-primary-content">
                      Guardar
                    </span>
                  </span>
                </div>

                {/* Campos, dibujados. */}
                <div className="mt-4 grid grid-cols-2 gap-2.5">
                  {[
                    ["Marca", "Toyota"],
                    ["Modelo", "Yaris Belta"],
                    ["Año", "2008"],
                    ["Kilometraje", "188.000"],
                    ["Transmisión", "Sincrónico"],
                    ["Condición", "Usado"],
                  ].map(([etiqueta, valor]) => (
                    <div key={etiqueta}>
                      <p className="text-[0.6rem] uppercase tracking-wider text-base-content/40">
                        {etiqueta}
                      </p>
                      <div className="mt-1 border border-base-content/12 bg-base-200/60 px-2.5 py-1.5">
                        <span className="cifra text-[0.7rem] text-base-content/70">{valor}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Zona de fotos. */}
                <div className="mt-3 border border-dashed border-base-content/18 px-3 py-4 text-center">
                  <p className="text-[0.65rem] text-base-content/40">
                    Arrastra aquí las fotos del post
                  </p>
                </div>

                {/* Lo ya publicado. */}
                <p className="mt-5 text-[0.6rem] uppercase tracking-wider text-base-content/40">
                  Publicados
                </p>
                <div className="mt-2 overflow-hidden border border-base-content/8">
                  <FilaMaqueta
                    nombre="Toyota 4Runner Off Road 2026"
                    precio="$79.000"
                    estado="Disponible"
                    tono="disponible"
                  />
                  <FilaMaqueta
                    nombre="Chevrolet Silverado 2014"
                    precio="$16.500"
                    estado="Reservado"
                    tono="reservado"
                  />
                  <FilaMaqueta
                    nombre="Mitsubishi Canter FE 2023"
                    precio="$42.000"
                    estado="Vendido"
                    tono="vendido"
                  />
                </div>
              </div>
            </div>
          </Revelar>

          {/* Los tres pasos. */}
          <div>
            {PASOS.map((paso, i) => (
              <Revelar key={paso.numero} retraso={i * 120}>
                <div className="flex gap-5 border-b border-base-content/10 py-6 last:border-0">
                  <span className="cifra shrink-0 text-2xl font-bold text-primary/40">
                    {paso.numero}
                  </span>
                  <div>
                    <h3 className="display text-xl">{paso.titulo}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-base-content/60">
                      {paso.detalle}
                    </p>
                  </div>
                </div>
              </Revelar>
            ))}

            <Revelar retraso={360}>
              <div className="panel mt-7 p-5">
                <p className="text-sm leading-relaxed text-base-content/65">
                  <span className="font-semibold text-base-content">
                    El panel va incluido.
                  </span>{" "}
                  No se paga aparte ni se cobra por unidad publicada: es parte de la
                  página y el inventario es tuyo, no de nadie más.
                </p>
              </div>
            </Revelar>
          </div>
        </div>
      </div>
    </section>
  );
}
