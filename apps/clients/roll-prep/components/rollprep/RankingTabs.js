import Link from "next/link";

// Las dos monedas del juego, una al lado de la otra.
//
// XP mide compromiso con el gym: estudiar, votar, comentar, aparecer. Es lo
// que sube el cinturón y por eso no se reinicia nunca.
// PC mide récord competitivo en modalidad CAOS: quién pelea y cómo le va.
//
// Son tableros distintos a propósito. Un cinturón azul puede tener cero PC, y
// alguien que acaba de llegar puede liderar el CAOS en su primer viernes.
const TABS = [
  {
    key: "gym",
    href: "/dashboard/ranking",
    label: "Gym",
    hint: "XP",
    tone: "primary",
  },
  {
    key: "caos",
    href: "/dashboard/ranking/caos",
    label: "CAOS",
    hint: "PC",
    tone: "accent",
  },
];

export default function RankingTabs({ active }) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {TABS.map((tab) => {
        const isActive = tab.key === active;
        const filled =
          tab.tone === "accent"
            ? "border-accent bg-accent text-accent-content"
            : "border-primary bg-primary text-primary-content";
        const idle =
          tab.tone === "accent"
            ? "border-base-300 bg-base-200 opacity-60 hover:border-accent/60 hover:opacity-100"
            : "border-base-300 bg-base-200 opacity-60 hover:border-primary/60 hover:opacity-100";

        return (
          <Link
            key={tab.key}
            href={tab.href}
            aria-current={isActive ? "page" : undefined}
            className={`clip-cut flex items-baseline justify-between border-2 px-4 py-2.5 transition-colors ${
              isActive ? filled : idle
            }`}
          >
            <span className="display text-2xl leading-none">{tab.label}</span>
            <span className="text-[0.6rem] font-black uppercase tracking-[0.2em] opacity-70">
              {tab.hint}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
