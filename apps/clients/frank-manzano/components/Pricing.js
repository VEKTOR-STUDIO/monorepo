import Link from "next/link";

const plans = [
  {
    name: "Base",
    price: "$0",
    period: "/mes",
    benefits: [
      "Biblioteca básica de sesiones",
      "1 plan de entrenamiento demo",
      "Soporte por email",
    ],
    highlighted: false,
  },
  {
    name: "Atleta Pro",
    price: "$29",
    period: "/mes",
    benefits: [
      "Todo en Base",
      "VOD completo y nuevas sesiones",
      "Prioridad en consultas",
    ],
    highlighted: true,
  },
  {
    name: "Equipo",
    price: "A medida",
    period: "",
    benefits: [
      "Varios perfiles / club",
      "Contenido exclusivo",
      "Facturación y SLA",
    ],
    highlighted: false,
  },
];

const Pricing = () => {
  return (
    <section
      className="border-t border-base-300 bg-base-200 px-6 py-20 sm:px-8 md:py-28"
      id="pricing"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-primary">
            Planes
          </p>
          <h2 className="display text-4xl text-base-content sm:text-5xl md:text-6xl">
            Elige tu nivel
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`flex flex-col border bg-base-100 p-8 ${
                plan.highlighted
                  ? "border-primary"
                  : "border-base-300"
              }`}
            >
              {plan.highlighted && (
                <span className="tag-skew mb-4 self-start bg-primary px-3 py-1 text-[10px] text-primary-content">
                  <span>Más elegido</span>
                </span>
              )}
              <h3 className="display text-2xl text-base-content">{plan.name}</h3>
              <p className="mt-3 flex items-baseline gap-1">
                <span className="display text-5xl text-base-content">
                  {plan.price}
                </span>
                {plan.period ? (
                  <span className="text-sm text-base-content/50">
                    {plan.period}
                  </span>
                ) : null}
              </p>
              <ul className="mt-8 flex-1 space-y-3">
                {plan.benefits.map((b) => (
                  <li
                    key={b}
                    className="flex items-center gap-2 text-sm text-base-content/70"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 shrink-0 text-primary"
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
                className={`btn mt-8 w-full ${
                  plan.highlighted ? "btn-primary" : "btn-outline"
                }`}
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
