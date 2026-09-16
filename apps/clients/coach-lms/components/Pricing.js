import Link from "next/link";
import config from "@/config";

// Programas de coaching online. Sin precios inventados: cada uno se cotiza
// según el atleta y la fecha de pelea. El botón lleva a WhatsApp si está
// configurado en config.js; si no, al acceso de atletas.
const programas = [
  {
    name: "Bloque de 4 semanas",
    price: "A consultar",
    benefits: [
      "Ficha y objetivo del bloque",
      "3 sesiones por semana, 55 a 65 min",
      "Progresión semanal sobre los mismos ejercicios",
      "Registro y seguimiento en la app",
    ],
    highlighted: false,
  },
  {
    name: "Fight camp · 8 semanas",
    price: "A consultar",
    benefits: [
      "Todo lo del bloque de 4 semanas",
      "Fase específica y sistema híbrido de rounds",
      "Control del peso hacia la categoría",
      "Recomendaciones de camp: fatiga, respiración, mentalidad",
    ],
    highlighted: true,
  },
  {
    name: "Equipo / gimnasio",
    price: "A medida",
    benefits: [
      "Varios atletas en un mismo panel",
      "Planes compartidos y ranking del equipo",
      "Condiciones según número de peleadores",
    ],
    highlighted: false,
  },
];

const Pricing = () => {
  const whatsapp = config.business?.whatsapp?.replace(/\s/g, "") ?? "";
  const contactHref = whatsapp ? `https://wa.me/${whatsapp}` : "/signin";

  return (
    <section
      className="border-t border-base-300 bg-base-200 px-6 py-20 sm:px-8 md:py-28"
      id="pricing"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-primary">
            Programas
          </p>
          <h2 className="display text-4xl text-base-content sm:text-5xl md:text-6xl">
            Elige tu bloque
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {programas.map((plan) => (
            <div
              key={plan.name}
              className={`flex flex-col border bg-base-100 p-8 ${
                plan.highlighted ? "border-primary" : "border-base-300"
              }`}
            >
              {plan.highlighted && (
                <span className="tag-skew mb-4 self-start bg-primary px-3 py-1 text-[10px] text-primary-content">
                  <span>Para fecha de pelea</span>
                </span>
              )}
              <h3 className="display text-2xl text-base-content">{plan.name}</h3>
              <p className="mt-3 flex items-baseline gap-1">
                <span className="display text-4xl text-base-content">
                  {plan.price}
                </span>
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
                href={contactHref}
                className={`btn mt-8 w-full ${
                  plan.highlighted ? "btn-primary" : "btn-outline"
                }`}
              >
                Pedir mi plan
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
