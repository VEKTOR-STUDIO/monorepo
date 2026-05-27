// Pricing component — plantilla genérica (nicho belleza / PMU)
import Image from "next/image";
import Link from "next/link";
import config from "@/config";

// <Pricing/> displays the pricing plans for your app
// It's your Stripe config in config.js.stripe.plans[] that will be used to display the plans
// <ButtonCheckout /> renders a button that will redirect the user to Stripe checkout called the /api/stripe/create-checkout API endpoint with the correct priceId

const Pricing = () => {
  return (
    <section
      className="relative py-24 md:py-32 overflow-hidden shadow-[0_-8px_16px_-4px_rgba(0,0,0,0.2)]"
      id="pricing"
      style={{
        background: "linear-gradient(135deg, #2a1a22 0%, #3d2430 35%, #4a2c36 70%, #2a1a22 100%)",
        backgroundSize: "400% 400%",
        animation: "gradientShift 20s ease infinite",
      }}
    >
      {/* Decorative overlays */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/25 via-transparent to-black/35 pointer-events-none" />
      <div className="absolute top-0 right-0 w-1/3 h-1/2 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-accent/10 rounded-full blur-3xl" />

      <div className=" px-8 max-w-5xl mx-auto relative z-10">
        <div className="flex flex-col text-center w-full mb-24">
          <p className="font-medium text-white mb-4 uppercase tracking-widest">Consultoría / reserva</p>
          <h2 className="font-bold text-4xl md:text-5xl tracking-tight mb-6 text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.3)]">
            Micropigmentación y experiencia de estudio
          </h2>
          <p className="mt-4 text-white/90 max-w-2xl mx-auto drop-shadow-[0_2px_8px_rgba(0,0,0,0.2)]">
            Texto plantilla: describe cómo {config.appName} ayuda a agendar una sesión personalizada.
            Sustituye por tu propuesta comercial real.
          </p>
        </div>

        <div className="relative flex justify-center ">
          <div className="relative w-full max-w-3xl bg-base-100/90 backdrop-blur-md rounded-2xl border-2 border-white/20 hover:border-white/40 transition-all duration-300">
            <div className="flex flex-col md:flex-row items-stretch">
              <div className="p-8 flex-1 z-11">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <p className="text-lg lg:text-xl font-bold text-white">Sesión de referencia — plantilla</p>
                    <p className="text-white/80 mt-1">Arte facial y diseño alineado a tu marca</p>
                  </div>
                </div>

                <ul className="space-y-2.5 leading-relaxed text-base mt-8 mb-8">
                  <li className="flex items-center gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-white/90">Evaluación de tipo de piel y expectativas (plantilla).</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-white/90">Diseño y técnica según tu catálogo real.</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-white/90">Sesión de preguntas para resolver dudas frecuentes.</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-white/90">Enlace a políticas y contacto: contacto@tudominio.com</span>
                  </li>
                </ul>

                <div className="space-y-3">
                  <Link href="/signin" className="bg-base-content text-base-100 font-bold py-3 px-8 rounded-lg w-full justify-center inline-flex hover:bg-base-content/90 hover:shadow-[0_8px_30px_rgba(255,255,255,0.3)] transition-all duration-300">
                    Solicitar información
                  </Link>
                  <p className="flex items-center justify-center gap-2 text-sm text-center text-white/80 font-medium relative">
                    Cupos de ejemplo — edita según tu operación.
                  </p>
                </div>
              </div>

              <div className="absolute right-0 bottom-0 md:w-[300px] flex-shrink-0 self-end z-10">
                <Image
                  src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80"
                  alt="Estudio de belleza — referencia"
                  width={800}
                  height={800}
                  className="w-full h-auto drop-shadow-2xl absolute right-0 bottom-0 "
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
