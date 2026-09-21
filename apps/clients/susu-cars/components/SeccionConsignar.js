import Link from "next/link";
import Revelar from "@/components/Revelar";
import TituloAnimado from "@/components/TituloAnimado";
import Filetes from "@/components/Filetes";
import MarcaSusu from "@/components/MarcaSusu";
import BotonContacto from "@/components/BotonContacto";
import config from "@/config";

// -----------------------------------------------------------------------------
// Consignar: lo que de verdad vende esta casa.
//
// Un concesionario cualquiera pone el catálogo y ya está. SUSU no vende
// vehículos: vende el VENDER EL TUYO sin complicaciones, y eso está escrito con
// todas las letras en su propia publicación —"Vende tu vehículo en tiempo
// récord y con seguridad · ¡Olvídate de complicaciones!"— con los tres puntos
// que van debajo.
//
// Por eso esta sección va antes que cualquier otra cosa que no sea la portada:
// quien llega por su Instagram muchas veces no viene a comprar, viene a
// preguntar cuánto le cobran por vender el suyo, y esa pregunta no puede estar
// al final de la página.
//
// Los tres pilares salen tal cual de config.consignacion, que a su vez los
// copia de su publicación con el paréntesis y todo. Lo único añadido es el
// desarrollo de cada uno, que en una imagen de Instagram no cabe.
// -----------------------------------------------------------------------------

export default function SeccionConsignar({ demo = false }) {
  const { titular, pilares } = config.consignacion;

  return (
    <section
      id="consignar"
      className="campo-susu relative overflow-hidden border-t border-base-content/8 px-4 py-24 sm:px-6"
    >
      <Filetes variante="seccion" />
      <div className="textura absolute inset-0" aria-hidden="true" />

      <div className="relative mx-auto max-w-6xl">
        <div className="grid items-end gap-8 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <Revelar>
              <span className="banda" aria-hidden="true" />
              <p className="rotulo mt-5">{config.business.lema}</p>
            </Revelar>

            <TituloAnimado
              as="h2"
              className="display mt-4 text-3xl leading-[1.05] sm:text-4xl"
            >
              {titular}
            </TituloAnimado>
          </div>

          <Revelar desde="derecha" retraso={120}>
            <p className="leading-relaxed text-base-content/60">
              Tú sigues siendo el dueño. Nosotros lo recibimos en la sede de{" "}
              {config.business.direccion}, lo publicamos con su ficha completa y
              atendemos a todo el que pregunte, hasta que aparezca el comprador
              que de verdad lo va a comprar.
            </p>
          </Revelar>
        </div>

        {/* Los tres pilares de su publicación. */}
        <div className="mt-16 grid gap-px border border-base-content/10 bg-base-content/10 md:grid-cols-3">
          {pilares.map((pilar, i) => (
            <Revelar key={pilar.titulo} desde="abajo" retraso={i * 120}>
              <div className="flex h-full flex-col bg-base-100 p-7 sm:p-8">
                <span className="cifra text-xs text-primary">
                  0{i + 1}
                </span>
                <h3 className="display mt-5 text-2xl">{pilar.titulo}</h3>
                <p className="mt-2 text-sm text-primary/80">{pilar.apunte}</p>
                <p className="mt-5 flex-1 text-sm leading-relaxed text-base-content/60">
                  {pilar.detalle}
                </p>
              </div>
            </Revelar>
          ))}
        </div>

        {/* El cierre: las dos maneras de empezar la conversación. El trazo del
            logotipo hace de firma, grande y en oro, que es el único sitio de
            la página donde se usa así. */}
        <Revelar retraso={160}>
          <div className="panel mt-10 flex flex-col items-center gap-7 p-8 sm:p-10 lg:flex-row lg:justify-between">
            <div className="flex items-center gap-6">
              <MarcaSusu className="hidden h-12 w-36 shrink-0 text-primary sm:block" />
              <p className="max-w-md text-center leading-relaxed text-base-content/70 lg:text-left">
                <span className="display block text-xl text-base-content">
                  {config.business.tagline}
                </span>
                <span className="mt-2 block text-sm">
                  Escríbenos con la marca, el año y el kilometraje y te decimos
                  en qué precio sale y cuánto suele tardar.
                </span>
              </p>
            </div>

            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <Link href="/contacto?motivo=consignar" className="btn btn-primary sm:px-8">
                Consignar mi vehículo
              </Link>
              <BotonContacto demo={demo} className="btn btn-filo sm:px-8">
                Escribir por WhatsApp
              </BotonContacto>
            </div>
          </div>
        </Revelar>
      </div>
    </section>
  );
}
