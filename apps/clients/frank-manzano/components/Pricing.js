import Link from "next/link";

const plans = [
  {
    name: "Base",
    price: "$0",
    period: "/mes",
    benefits: ["Biblioteca básica de sesiones", "1 plan de entrenamiento demo", "Soporte por email"],
    highlighted: false,
  },
  {
    name: "Atleta Pro",
    price: "$29",
    period: "/mes",
    benefits: ["Todo en Base", "VOD completo y nuevas sesiones", "Prioridad en consultas"],
    highlighted: true,
  },
  {
    name: "Equipo",
    price: "A medida",
    period: "",
    benefits: ["Varios perfiles / club", "Contenido exclusivo", "Facturación y SLA"],
    highlighted: false,
  },
];

const Pricing = () => {
  return (
    <section className="py-16 md:py-24 px-6 sm:px-8 bg-base-200/40 border-t border-base-300" id="pricing">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-base-content mb-3">Planes para deportistas</h2>
          <p className="text-base-content/70 max-w-xl mx-auto">
            Estructura tipo SaaS: conecta Stripe en <code className="text-xs bg-base-300/80 px-1 rounded">config.js</code>{" "}
            cuando tengas precios reales.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`flex flex-col border rounded-md p-6 shadow-sm bg-base-100 ${
                plan.highlighted ? "border-primary border-2" : "border-base-300"
              }`}
            >
              <h3 className="text-lg font-semibold text-base-content">{plan.name}</h3>
              <p className="mt-2 flex items-baseline gap-1">
                <span className="text-3xl font-bold text-base-content">{plan.price}</span>
                {plan.period ? <span className="text-sm text-base-content/60">{plan.period}</span> : null}
              </p>
              <ul className="mt-6 space-y-2 flex-1">
                {plan.benefits.map((b) => (
                  <li key={b} className="flex items-center gap-2 text-sm text-base-content/80">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-primary shrink-0"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {b}
                  </li>
                ))}
              </ul>
              <Link
                href="/signin"
                className={`btn btn-sm mt-6 rounded-md shadow-sm w-full ${plan.highlighted ? "btn-primary" : "btn-outline border-base-300"}`}
              >
                Elegir plan
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
